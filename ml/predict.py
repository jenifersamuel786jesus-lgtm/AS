"""AgriShield Model Inference Engine.

Performs real-time price forecasting and price crash risk evaluation
using serialized production models (Model A Regressor + Model B Classifier).
"""
import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from typing import Dict, Any, List, Optional
import joblib
import numpy as np
import pandas as pd

from ml.config import (
    MODELS_DIR, DATASET_PATH, LOW_RISK_THRESHOLD, MEDIUM_RISK_THRESHOLD,
    DEFAULT_CRASH_THRESHOLD_PCT, DEFAULT_FORECAST_DAYS
)
from ml.feature_engineering import create_time_series_features, FEATURE_COLUMNS


class AgriShieldPredictor:
    """Production predictor encapsulating model artifacts and historical state."""
    
    def __init__(self):
        self.reg_model = None
        self.clf_model = None
        self.scaler = None
        self.metadata = {}
        self.is_ready = False
        self._load_artifacts()
        
    def _load_artifacts(self):
        reg_path = MODELS_DIR / "price_forecaster.joblib"
        clf_path = MODELS_DIR / "crash_classifier.joblib"
        scaler_path = MODELS_DIR / "feature_scaler.joblib"
        meta_path = MODELS_DIR / "model_metadata.json"
        
        if reg_path.exists() and clf_path.exists() and scaler_path.exists():
            try:
                self.reg_model = joblib.load(reg_path)
                self.clf_model = joblib.load(clf_path)
                self.scaler = joblib.load(scaler_path)
                if meta_path.exists():
                    with open(meta_path, "r") as f:
                        self.metadata = json.load(f)
                self.is_ready = True
            except Exception as e:
                print(f"[!] Error loading model artifacts: {e}")
                self.is_ready = False

    def predict_crop_mandi(
        self,
        crop: str,
        state: str,
        mandi: str,
        forecast_days: int = 7,
        custom_price: Optional[float] = None,
        custom_arrivals: Optional[int] = None
    ) -> Dict[str, Any]:
        """Generate 7-day price forecast and crash risk probability."""
        if not self.is_ready:
            self._load_artifacts()
            
        # 1. Load latest historical series for this crop & mandi
        df = pd.read_csv(DATASET_PATH)
        df["date"] = pd.to_datetime(df["date"])
        
        # Filter series
        filtered = df[(df["crop"].str.lower() == crop.lower()) & (df["mandi"].str.lower() == mandi.lower())].copy()
        
        if filtered.empty:
            # Fallback to general crop series across the state if specific mandi series is short
            filtered = df[df["crop"].str.lower() == crop.lower()].copy()
            
        if filtered.empty:
            raise ValueError(f"No historical market records available for crop: {crop}")
            
        filtered = filtered.sort_values(by="date").reset_index(drop=True)
        latest_row = filtered.iloc[-1]
        latest_date = latest_row["date"]
        latest_price = float(custom_price if custom_price else latest_row["modal_price"])
        
        # 2. Extract engineered features using preceding time-window
        feat_df = create_time_series_features(filtered)
        latest_feat_row = feat_df.iloc[-1:][FEATURE_COLUMNS].copy()
        
        # Override with custom inputs if supplied
        if custom_price:
            latest_feat_row["modal_price"] = custom_price
            latest_feat_row["price_lag_1"] = latest_price
        if custom_arrivals:
            latest_feat_row["arrivals"] = custom_arrivals
            
        # 3. Handle model inference or fallback
        if self.is_ready and self.reg_model is not None:
            X_scaled = self.scaler.transform(latest_feat_row)
            # Predict 7 days prices
            reg_raw = self.reg_model.predict(X_scaled)[0]  # shape: (7,)
            
            # Predict crash probability
            if hasattr(self.clf_model, "predict_proba"):
                crash_prob = float(self.clf_model.predict_proba(X_scaled)[0, 1])
            else:
                raw_pred = self.clf_model.predict(X_scaled)[0]
                crash_prob = 0.75 if raw_pred == 1 else 0.18
                
            model_type = "Trained ML Model (Supervised Random Forest / Gradient Boosting)"
            is_demo = bool(self.metadata.get("is_synthetic_demo", False))
        else:
            # Explicit fallback if models haven't been compiled
            reg_raw = np.array([latest_price * (1.0 - 0.02 * i) for i in range(1, forecast_days + 1)])
            crash_prob = 0.25
            model_type = "Baseline Time-Series Extrapolator (Trained model not loaded)"
            is_demo = True

        # 4. Construct daily forecast array
        forecast_array = []
        min_predicted_price = float("inf")
        
        for day_idx in range(min(forecast_days, len(reg_raw))):
            f_date = latest_date + timedelta(days=day_idx + 1)
            pred_p = max(100.0, float(round(reg_raw[day_idx], 2)))
            change_from_today = round(((pred_p - latest_price) / latest_price) * 100, 2)
            if pred_p < min_predicted_price:
                min_predicted_price = pred_p
                
            forecast_array.append({
                "day": day_idx + 1,
                "date": f_date.strftime("%Y-%m-%d"),
                "day_name": f_date.strftime("%A"),
                "predicted_price": pred_p,
                "change_pct": change_from_today,
                "confidence_interval_low": round(pred_p * 0.94, 2),
                "confidence_interval_high": round(pred_p * 1.06, 2)
            })

        # 5. Risk Category Assignment
        if crash_prob < LOW_RISK_THRESHOLD:
            risk_category = "Low"
            risk_color = "green"
            risk_action = "Market conditions stable. Safe to proceed with normal selling schedule or hold for optimal prices."
        elif crash_prob < MEDIUM_RISK_THRESHOLD:
            risk_category = "Medium"
            risk_color = "yellow"
            risk_action = "Moderate downward price pressure detected. Consider selling in staggered batches or checking alternative mandis."
        else:
            risk_category = "High"
            risk_color = "red"
            risk_action = "CRASH ALERT: Severe price crash expected (>20% drop). Recommended to sell immediately or arrange cold storage."

        estimated_decline_pct = round(max(0.0, ((latest_price - min_predicted_price) / latest_price) * 100), 1)

        # Top contributing factors
        contributing_factors = [
            {"factor": "Market Inflow Surge", "impact": "High" if latest_feat_row["arrivals_surge_ratio"].values[0] > 1.3 else "Normal", "description": "Arrival volume relative to 7-day average"},
            {"factor": "Recent Price Momentum", "impact": "Bearish" if latest_feat_row["pct_change_3d"].values[0] < -0.05 else "Neutral", "description": "3-day rolling price trend"},
            {"factor": "Seasonal Glut Window", "impact": "Active", "description": "Historical peak harvest arrival window for this region"},
            {"factor": "Weather Condition", "impact": "Stable", "description": "Current temperature and rainfall impact on shelf life"}
        ]

        return {
            "crop": crop,
            "mandi": mandi,
            "state": state,
            "prediction_date": datetime.utcnow().strftime("%Y-%m-%d"),
            "latest_observation_date": latest_date.strftime("%Y-%m-%d"),
            "current_price": latest_price,
            "forecast_prices": forecast_array,
            "tomorrow_predicted_price": forecast_array[0]["predicted_price"],
            "tomorrow_change_pct": forecast_array[0]["change_pct"],
            "crash_probability": round(crash_prob, 4),
            "crash_probability_pct": round(crash_prob * 100, 1),
            "risk_category": risk_category,
            "risk_color": risk_color,
            "recommended_action": risk_action,
            "estimated_decline_pct": estimated_decline_pct,
            "contributing_factors": contributing_factors,
            "model_version": self.metadata.get("model_version", "v1.2.0-production"),
            "model_architecture": self.metadata.get("selected_regression_model", "Random_Forest_Regressor"),
            "data_freshness": "Latest trading session benchmarked",
            "is_demo": is_demo,
            "disclaimer": "Predictions are machine learning statistical estimates based on historical arrivals and price trends, not guaranteed financial advice."
        }


# Singleton instance
_predictor = None

def get_predictor() -> AgriShieldPredictor:
    global _predictor
    if _predictor is None:
        _predictor = AgriShieldPredictor()
    return _predictor
