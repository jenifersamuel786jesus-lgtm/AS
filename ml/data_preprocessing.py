"""AgriShield Data Preprocessing Pipeline.

Handles data validation, duplicate removal, missing value imputation,
standardization, and strictly chronological train/validation/test splitting
to prevent data leakage in time-series forecasting.
"""
from datetime import datetime
from pathlib import Path
from typing import Dict, Tuple, Optional
import numpy as np
import pandas as pd
from ml.config import SUPPORTED_CROPS, TEST_SIZE_CHRONO_DAYS

REQUIRED_COLUMNS = [
    "date", "state", "district", "mandi", "crop",
    "min_price", "max_price", "modal_price", "arrivals"
]

OPTIONAL_COLUMNS = [
    "variety", "weather", "rainfall", "temperature", "humidity",
    "source", "is_synthetic", "retrieval_timestamp"
]


def load_raw_dataset(csv_path: Path) -> pd.DataFrame:
    """Load raw dataset from CSV with validation."""
    if not csv_path.exists():
        raise FileNotFoundError(f"Dataset file not found at: {csv_path}")
    
    df = pd.read_csv(csv_path)
    return df


def validate_and_clean_data(df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, any]]:
    """Validate schema, remove duplicates, handle missing values, and standardize types."""
    initial_rows = len(df)
    missing_req = [c for c in REQUIRED_COLUMNS if c not in df.columns]
    if missing_req:
        raise ValueError(f"Missing required columns in dataset: {missing_req}")
    
    clean_df = df.copy()
    
    # 1. Standardize string columns
    clean_df["crop"] = clean_df["crop"].astype(str).str.strip().str.title()
    clean_df["mandi"] = clean_df["mandi"].astype(str).str.strip()
    clean_df["state"] = clean_df["state"].astype(str).str.strip()
    clean_df["district"] = clean_df["district"].astype(str).str.strip()
    
    # 2. Parse dates
    clean_df["date"] = pd.to_datetime(clean_df["date"], errors="coerce")
    clean_df = clean_df.dropna(subset=["date"])
    
    # 3. Numeric conversions & sanitization
    numeric_cols = ["modal_price", "min_price", "max_price", "arrivals"]
    for col in numeric_cols:
        clean_df[col] = pd.to_numeric(clean_df[col], errors="coerce")
        
    # Remove negative or zero modal prices (corrupted records)
    clean_df = clean_df[clean_df["modal_price"] > 0]
    
    # Consistency fix: min_price <= modal_price <= max_price
    clean_df["min_price"] = clean_df[["min_price", "modal_price"]].min(axis=1)
    clean_df["max_price"] = clean_df[["max_price", "modal_price"]].max(axis=1)
    
    # Weather columns imputation if present
    if "rainfall" in clean_df.columns:
        clean_df["rainfall"] = pd.to_numeric(clean_df["rainfall"], errors="coerce").fillna(0.0)
    if "temperature" in clean_df.columns:
        clean_df["temperature"] = pd.to_numeric(clean_df["temperature"], errors="coerce").fillna(26.0)
    if "humidity" in clean_df.columns:
        clean_df["humidity"] = pd.to_numeric(clean_df["humidity"], errors="coerce").fillna(60.0)
    if "weather" in clean_df.columns:
        clean_df["weather"] = clean_df["weather"].fillna("Clear")
        
    # 4. Remove duplicate entries for (date, mandi, crop)
    clean_df = clean_df.drop_duplicates(subset=["date", "mandi", "crop"], keep="last")
    
    # 5. Sort chronologically
    clean_df = clean_df.sort_values(by=["crop", "mandi", "date"]).reset_index(drop=True)
    
    validation_report = {
        "initial_rows": initial_rows,
        "clean_rows": len(clean_df),
        "dropped_rows": initial_rows - len(clean_df),
        "crops": sorted(clean_df["crop"].unique().tolist()),
        "mandis": sorted(clean_df["mandi"].unique().tolist()),
        "date_min": clean_df["date"].min().strftime("%Y-%m-%d"),
        "date_max": clean_df["date"].max().strftime("%Y-%m-%d"),
        "has_synthetic_data": bool(clean_df.get("is_synthetic", pd.Series([False])).any()),
        "validation_passed": True
    }
    
    return clean_df, validation_report


def chronological_split(
    df: pd.DataFrame, 
    test_days: int = TEST_SIZE_CHRONO_DAYS
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Split dataset chronologically.
    
    Training set: all records up to (max_date - test_days)
    Testing set: latest test_days
    STRICTLY NO RANDOM SHUFFLE to avoid lookahead data leakage.
    """
    max_date = df["date"].max()
    split_date = max_date - pd.Timedelta(days=test_days)
    
    train_df = df[df["date"] <= split_date].copy()
    test_df = df[df["date"] > split_date].copy()
    
    return train_df, test_df
