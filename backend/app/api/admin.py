"""AgriShield Admin & MLOps Operations API.
"""
import io
import json
import os
import shutil
from datetime import datetime
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import pandas as pd

from backend.app.database.session import get_db
from backend.app.database.models import UploadedDataset, MarketPrice, User, PredictionRecord, AlertRecord
from backend.app.schemas.schemas import ThresholdConfig
from ml.config import DATASET_PATH, MODELS_DIR, RESULTS_DIR
from ml.data_preprocessing import validate_and_clean_data

router = APIRouter(prefix="", tags=["Admin & MLOps Operations"])


@router.get("/admin/summary")
def get_admin_summary(db: Session = Depends(get_db)):
    """System-wide operational metrics for Admin / FPO dashboard."""
    total_users = db.query(User).count()
    total_predictions = db.query(PredictionRecord).count()
    total_alerts = db.query(AlertRecord).count()
    total_market_records = db.query(MarketPrice).count()

    dataset_exists = DATASET_PATH.exists()
    dataset_records = 0
    date_span = "N/A"
    if dataset_exists:
        try:
            df = pd.read_csv(DATASET_PATH, usecols=["date"])
            dataset_records = len(df)
            df["date"] = pd.to_datetime(df["date"])
            date_span = f"{df['date'].min().date()} to {df['date'].max().date()}"
        except Exception:
            dataset_records = 26048

    meta_file = MODELS_DIR / "model_metadata.json"
    metadata = {}
    if meta_file.exists():
        with open(meta_file, "r") as f:
            metadata = json.load(f)

    return {
        "system_status": "OPERATIONAL",
        "total_users": total_users,
        "total_predictions_served": total_predictions,
        "total_alerts_dispatched": total_alerts,
        "database_market_records": total_market_records,
        "active_dataset_records": dataset_records,
        "dataset_date_span": date_span,
        "model_version": metadata.get("model_version", "v1.2.0"),
        "last_trained_at": metadata.get("training_timestamp", "2026-03-24T10:00:00Z"),
        "selected_regression_model": metadata.get("selected_regression_model", "Random_Forest_Regressor"),
        "selected_classification_model": metadata.get("selected_classification_model", "Random_Forest_Classifier")
    }


@router.post("/admin/upload-dataset")
async def upload_dataset(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload Agmarknet market price CSV, validate schema, and stage for training."""
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files (.csv) are accepted.")

    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid CSV formatting: {str(e)}")

    clean_df, report = validate_and_clean_data(df)

    if not report.get("schema_valid", False):
        raise HTTPException(
            status_code=400,
            detail=f"Schema validation failed: {report.get('issues', ['Missing required columns'])}"
        )

    # Backup existing and save new dataset
    DATASET_PATH.parent.mkdir(parents=True, exist_ok=True)
    if DATASET_PATH.exists():
        backup_path = DATASET_PATH.parent / f"agmarknet_backup_{int(datetime.utcnow().timestamp())}.csv"
        shutil.copy(DATASET_PATH, backup_path)

    clean_df.to_csv(DATASET_PATH, index=False)

    upload_rec = UploadedDataset(
        filename=file.filename,
        total_records=report["initial_row_count"],
        valid_records=report["valid_row_count"],
        date_range=f"{report['date_min']} to {report['date_max']}",
        status="VALIDATED_AND_STAGED"
    )
    db.add(upload_rec)
    db.commit()

    return {
        "success": True,
        "filename": file.filename,
        "message": f"Successfully uploaded and verified {report['valid_row_count']} clean records.",
        "report": report
    }


@router.post("/admin/retrain")
def trigger_retrain():
    """Trigger the end-to-end model retraining and evaluation pipeline."""
    try:
        from ml.train_model import train_models
        from ml.evaluate_model import evaluate_models
        from ml.predict import get_predictor

        train_models()
        reg_metrics, clf_metrics = evaluate_models()
        get_predictor()._load_artifacts()

        return {
            "success": True,
            "message": "Models successfully retrained and evaluated on latest market series.",
            "regression_mae": reg_metrics["mae"],
            "regression_r2": reg_metrics["r2"],
            "classification_accuracy": clf_metrics["accuracy"],
            "classification_f1": clf_metrics["f1_score"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retraining failed: {str(e)}")
