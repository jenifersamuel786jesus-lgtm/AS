"""AgriShield Model Training Pipeline.

Trains:
  Model A: Multi-Day Price Forecasting (Regression)
    - Baseline: Linear Regression
    - Random Forest Regressor
    - Gradient Boosting Regressor
  Model B: Price Crash Risk (Classification)
    - Baseline: Logistic Regression
    - Random Forest Classifier (balanced weights)
    - Gradient Boosting Classifier

Saves trained models, feature pipelines, metadata and benchmark comparisons.
"""
import json
import os
import sys
from datetime import datetime
from pathlib import Path

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

import joblib
import numpy as np
import pandas as pd

from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.multioutput import MultiOutputRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from ml.config import (
    DATASET_PATH, MODELS_DIR, RESULTS_DIR, RANDOM_STATE,
    TEST_SIZE_CHRONO_DAYS, DEFAULT_CRASH_THRESHOLD_PCT, DEFAULT_FORECAST_DAYS
)
from ml.data_preprocessing import load_raw_dataset, validate_and_clean_data, chronological_split
from ml.feature_engineering import prepare_ml_matrices, FEATURE_COLUMNS


def train_models():
    print("=" * 60)
    print("AGRISHIELD ML TRAINING PIPELINE INITIALIZING")
    print("=" * 60)

    # 1. Load Dataset
    if not DATASET_PATH.exists():
        print(f"[!] Dataset not found at {DATASET_PATH}. Running demo data generator...")
        from scripts.generate_demo_data import generate_market_data
        generate_market_data()

    raw_df = load_raw_dataset(DATASET_PATH)
    clean_df, report = validate_and_clean_data(raw_df)
    print(f"[*] Clean dataset loaded: {len(clean_df)} records across {len(report['crops'])} crops and {len(report['mandis'])} mandis.")
    print(f"[*] Date span: {report['date_min']} to {report['date_max']}")

    # 2. Chronological Split (Strictly Time-Ordered)
    train_raw, test_raw = chronological_split(clean_df, test_days=TEST_SIZE_CHRONO_DAYS)
    print(f"[*] Chronological Split: Train up to {train_raw['date'].max().strftime('%Y-%m-%d')} | Test from {test_raw['date'].min().strftime('%Y-%m-%d')} ({len(test_raw)} records)")

    # 3. Feature Engineering & Target Generation
    print("[*] Engineering lag features, rolling windows, surge ratios, and crash labels...")
    # Process train and test separately to avoid lookahead contamination
    X_train, Y_train_reg, Y_train_clf, train_processed = prepare_ml_matrices(train_raw, is_training=True)
    X_test, Y_test_reg, Y_test_clf, test_processed = prepare_ml_matrices(test_raw, is_training=True)

    print(f"[*] Training matrices: {X_train.shape[0]} samples, {X_train.shape[1]} features.")
    print(f"[*] Testing matrices: {X_test.shape[0]} samples.")
    crash_rate_train = (Y_train_clf == 1).mean() * 100
    crash_rate_test = (Y_test_clf == 1).mean() * 100
    print(f"[*] Historical Crash Class Distribution: Train={crash_rate_train:.1f}%, Test={crash_rate_test:.1f}%")

    # 4. Standard Scaler Pipeline
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # ========================================================
    # MODEL A: REGRESSION (7-DAY FORECASTING)
    # ========================================================
    print("\n--- Training Model A: Multi-Day Price Forecaster (Regression) ---")
    reg_models = {
        "Linear_Regression": MultiOutputRegressor(LinearRegression()),
        "Random_Forest_Regressor": RandomForestRegressor(
            n_estimators=60, max_depth=12, min_samples_split=5, random_state=RANDOM_STATE, n_jobs=-1
        ),
        "Gradient_Boosting_Regressor": MultiOutputRegressor(
            GradientBoostingRegressor(n_estimators=20, max_depth=3, learning_rate=0.1, random_state=RANDOM_STATE)
        )
    }

    best_reg_name = None
    best_reg_mae = float("inf")
    trained_reg_models = {}

    for name, model in reg_models.items():
        print(f"  > Fitting {name}...")
        model.fit(X_train_scaled, Y_train_reg)
        preds = model.predict(X_test_scaled)
        mae = np.mean(np.abs(preds - Y_test_reg.values))
        rmse = np.sqrt(np.mean((preds - Y_test_reg.values) ** 2))
        print(f"    - {name} Test MAE: Rs {mae:.2f}/qtl | RMSE: Rs {rmse:.2f}/qtl")
        trained_reg_models[name] = {"model": model, "mae": mae, "rmse": rmse, "preds": preds}
        if mae < best_reg_mae:
            best_reg_mae = mae
            best_reg_name = name

    print(f"[✓] Selected Best Regression Model: {best_reg_name} (MAE: Rs {best_reg_mae:.2f})")
    selected_reg_model = trained_reg_models[best_reg_name]["model"]

    # ========================================================
    # MODEL B: CLASSIFICATION (7-DAY CRASH RISK)
    # ========================================================
    print("\n--- Training Model B: Price Crash Risk (Classification) ---")
    clf_models = {
        "Logistic_Regression": LogisticRegression(class_weight="balanced", max_iter=500, random_state=RANDOM_STATE),
        "Random_Forest_Classifier": RandomForestClassifier(
            n_estimators=50, max_depth=10, min_samples_split=4, class_weight="balanced_subsample",
            random_state=RANDOM_STATE, n_jobs=-1
        ),
        "Gradient_Boosting_Classifier": GradientBoostingClassifier(
            n_estimators=25, max_depth=3, learning_rate=0.1, random_state=RANDOM_STATE
        )
    }

    best_clf_name = None
    best_clf_f1 = -1.0
    trained_clf_models = {}

    from sklearn.metrics import f1_score, precision_score, recall_score, accuracy_score

    for name, model in clf_models.items():
        print(f"  > Fitting {name}...")
        model.fit(X_train_scaled, Y_train_clf)
        preds = model.predict(X_test_scaled)
        f1 = f1_score(Y_test_clf, preds, zero_division=0)
        prec = precision_score(Y_test_clf, preds, zero_division=0)
        rec = recall_score(Y_test_clf, preds, zero_division=0)
        acc = accuracy_score(Y_test_clf, preds)
        print(f"    - {name} Test Acc: {acc*100:.1f}% | Crash Precision: {prec*100:.1f}% | Recall: {rec*100:.1f}% | F1: {f1:.3f}")
        trained_clf_models[name] = {"model": model, "f1": f1, "precision": prec, "recall": rec, "acc": acc, "preds": preds}
        if f1 > best_clf_f1:
            best_clf_f1 = f1
            best_clf_name = name

    print(f"[✓] Selected Best Crash Classifier: {best_clf_name} (F1 Score: {best_clf_f1:.3f})")
    selected_clf_model = trained_clf_models[best_clf_name]["model"]

    # 5. Save Trained Models and Feature Artifacts
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    reg_path = MODELS_DIR / "price_forecaster.joblib"
    clf_path = MODELS_DIR / "crash_classifier.joblib"
    scaler_path = MODELS_DIR / "feature_scaler.joblib"

    joblib.dump(selected_reg_model, reg_path)
    joblib.dump(selected_clf_model, clf_path)
    joblib.dump(scaler, scaler_path)

    metadata = {
        "model_version": "v1.2.0-production",
        "training_timestamp": datetime.utcnow().isoformat() + "Z",
        "dataset_name": "Agmarknet Historical Market Series + Government Benchmarks",
        "dataset_path": str(DATASET_PATH),
        "total_records": len(clean_df),
        "train_records": len(X_train),
        "test_records": len(X_test),
        "train_period": f"{train_raw['date'].min().strftime('%Y-%m-%d')} to {train_raw['date'].max().strftime('%Y-%m-%d')}",
        "test_period": f"{test_raw['date'].min().strftime('%Y-%m-%d')} to {test_raw['date'].max().strftime('%Y-%m-%d')}",
        "selected_regression_model": best_reg_name,
        "selected_classification_model": best_clf_name,
        "features": FEATURE_COLUMNS,
        "forecast_horizon_days": DEFAULT_FORECAST_DAYS,
        "crash_threshold_pct": DEFAULT_CRASH_THRESHOLD_PCT,
        "is_synthetic_demo": report["has_synthetic_data"]
    }

    with open(MODELS_DIR / "model_metadata.json", "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"\n[✓] All models and pipelines saved successfully under {MODELS_DIR}/")
    return {
        "selected_reg_model": best_reg_name,
        "selected_clf_model": best_clf_name,
        "trained_reg_models": trained_reg_models,
        "trained_clf_models": trained_clf_models,
        "X_test_scaled": X_test_scaled,
        "Y_test_reg": Y_test_reg,
        "Y_test_clf": Y_test_clf,
        "metadata": metadata
    }


if __name__ == "__main__":
    train_models()
