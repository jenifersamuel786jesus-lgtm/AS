"""AgriShield Feature Engineering Pipeline.

Constructs historical lag features, rolling statistics, price momentum indicators,
arrival dynamics, calendar/seasonal harmonics, and target labels without lookahead bias.
"""
from typing import List, Tuple, Dict
import numpy as np
import pandas as pd
from ml.config import LAG_DAYS, ROLLING_WINDOWS, DEFAULT_CRASH_THRESHOLD_PCT, DEFAULT_FORECAST_DAYS

FEATURE_COLUMNS = [
    "modal_price",
    "arrivals",
    "min_max_spread",
    "price_lag_1", "price_lag_3", "price_lag_7", "price_lag_14", "price_lag_30",
    "rolling_mean_7", "rolling_std_7",
    "rolling_mean_14", "rolling_std_14",
    "rolling_mean_30", "rolling_std_30",
    "pct_change_1d", "pct_change_3d", "pct_change_7d",
    "arrivals_lag_1", "arrivals_lag_7", "arrivals_rolling_mean_7",
    "arrivals_surge_ratio",
    "day_of_week", "month", "sin_day_of_year", "cos_day_of_year",
    "temperature", "rainfall", "humidity"
]

CATEGORICAL_COLUMNS = ["crop", "mandi", "state"]


def create_time_series_features(df: pd.DataFrame) -> pd.DataFrame:
    """Create temporal, lag, rolling and momentum features per crop & mandi series.
    
    Prevents data leakage by computing all rolling and shift metrics purely
    over preceding records in historical order.
    """
    df = df.sort_values(by=["crop", "mandi", "date"]).copy()
    
    grouped = df.groupby(["crop", "mandi"])
    
    # 1. Price Lags
    for lag in LAG_DAYS:
        df[f"price_lag_{lag}"] = grouped["modal_price"].shift(lag)
        
    # 2. Arrivals Lags
    df["arrivals_lag_1"] = grouped["arrivals"].shift(1)
    df["arrivals_lag_7"] = grouped["arrivals"].shift(7)
    
    # 3. Rolling Statistics using transform (preserves original 1D index, shift(1) avoids lookahead)
    for window in ROLLING_WINDOWS:
        df[f"rolling_mean_{window}"] = grouped["modal_price"].transform(
            lambda s: s.shift(1).rolling(window=window, min_periods=2).mean()
        )
        df[f"rolling_std_{window}"] = grouped["modal_price"].transform(
            lambda s: s.shift(1).rolling(window=window, min_periods=2).std()
        ).fillna(0.0)

    # 4. Arrivals rolling mean and surge ratio
    df["arrivals_rolling_mean_7"] = grouped["arrivals"].transform(
        lambda s: s.shift(1).rolling(window=7, min_periods=2).mean()
    ).fillna(df["arrivals"].mean())
    
    df["arrivals_surge_ratio"] = (df["arrivals"] / (df["arrivals_rolling_mean_7"] + 1e-5)).clip(0.1, 10.0)

    # 5. Price Momentum & percentage changes
    df["pct_change_1d"] = grouped["modal_price"].pct_change(1)
    df["pct_change_3d"] = grouped["modal_price"].pct_change(3)
    df["pct_change_7d"] = grouped["modal_price"].pct_change(7)
    
    # Min-max intraday spread
    df["min_max_spread"] = (df["max_price"] - df["min_price"]) / (df["modal_price"] + 1e-5)

    # 6. Calendar & Seasonal harmonics
    df["day_of_week"] = df["date"].dt.dayofweek
    df["month"] = df["date"].dt.month
    day_of_year = df["date"].dt.dayofyear
    df["sin_day_of_year"] = np.sin(2 * np.pi * day_of_year / 365.25)
    df["cos_day_of_year"] = np.cos(2 * np.pi * day_of_year / 365.25)
    
    # Weather safety fills
    if "temperature" not in df.columns:
        df["temperature"] = 26.0
    if "rainfall" not in df.columns:
        df["rainfall"] = 0.0
    if "humidity" not in df.columns:
        df["humidity"] = 60.0

    return df


def generate_targets(
    df: pd.DataFrame, 
    forecast_days: int = DEFAULT_FORECAST_DAYS,
    crash_threshold_pct: float = DEFAULT_CRASH_THRESHOLD_PCT
) -> pd.DataFrame:
    """Generate multi-day regression targets and crash classification labels."""
    df = df.copy()
    grouped = df.groupby(["crop", "mandi"])
    
    future_cols = []
    for d in range(1, forecast_days + 1):
        col_name = f"target_price_{d}d"
        df[col_name] = grouped["modal_price"].shift(-d)
        future_cols.append(col_name)
        
    df["min_future_price_7d"] = df[future_cols].min(axis=1)
    future_ratio = df["min_future_price_7d"] / df["modal_price"]
    df["max_future_drop_pct"] = (1.0 - future_ratio).clip(lower=0.0)
    
    # Crash label: 1 if future price drops by >= crash_threshold_pct (e.g. 20%)
    df["is_price_crash"] = (future_ratio <= (1.0 - crash_threshold_pct)).astype(int)
    
    return df


def prepare_ml_matrices(
    df: pd.DataFrame,
    is_training: bool = True
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.DataFrame]:
    """Clean NaN rows produced by lagging/target shifting and extract X, Y_reg, Y_clf."""
    feat_df = create_time_series_features(df)
    
    if is_training:
        feat_df = generate_targets(feat_df)
        target_reg_cols = [f"target_price_{d}d" for d in range(1, DEFAULT_FORECAST_DAYS + 1)]
        valid_df = feat_df.dropna(subset=FEATURE_COLUMNS + target_reg_cols + ["is_price_crash"]).copy()
        
        X = valid_df[FEATURE_COLUMNS]
        Y_reg = valid_df[target_reg_cols]
        Y_clf = valid_df["is_price_crash"]
        return X, Y_reg, Y_clf, valid_df
    else:
        valid_df = feat_df.dropna(subset=FEATURE_COLUMNS).copy()
        X = valid_df[FEATURE_COLUMNS]
        return X, None, None, valid_df
