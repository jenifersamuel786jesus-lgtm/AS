"""Price Prediction and Crash Risk inference endpoints.
"""
import json
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from backend.app.database.session import get_db
from backend.app.database.models import PredictionRecord
from backend.app.schemas.schemas import PredictionRequest, PredictionResponse
from ml.predict import get_predictor
from ml.config import RESULTS_DIR, MODELS_DIR

router = APIRouter(prefix="", tags=["Prediction Engine"])


@router.post("/predict/forecast-7-days", response_model=PredictionResponse)
def forecast_7_days(req: PredictionRequest, db: Session = Depends(get_db)):
    """Generate multi-day price forecast and crash risk analysis using trained ML models."""
    try:
        predictor = get_predictor()
        res = predictor.predict_crop_mandi(
            crop=req.crop,
            state=req.state,
            mandi=req.mandi,
            forecast_days=req.forecast_days or 7,
            custom_price=req.custom_price
        )

        # Store in prediction history
        record = PredictionRecord(
            user_id=1,  # Default demo farmer
            crop=res["crop"],
            state=res["state"],
            mandi=res["mandi"],
            prediction_date=res["prediction_date"],
            current_price=res["current_price"],
            tomorrow_price=res["tomorrow_predicted_price"],
            forecast_json=json.dumps(res["forecast_prices"]),
            crash_probability=res["crash_probability"],
            risk_category=res["risk_category"],
            model_version=res["model_version"],
            is_demo=res["is_demo"]
        )
        db.add(record)
        db.commit()

        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/predict/price")
def predict_price(req: PredictionRequest, db: Session = Depends(get_db)):
    """Predict tomorrow's price directly."""
    full_pred = forecast_7_days(req, db)
    return {
        "crop": full_pred["crop"],
        "mandi": full_pred["mandi"],
        "state": full_pred["state"],
        "current_price": full_pred["current_price"],
        "tomorrow_predicted_price": full_pred["tomorrow_predicted_price"],
        "price_change_pct": full_pred["tomorrow_change_pct"],
        "model_version": full_pred["model_version"],
        "disclaimer": full_pred["disclaimer"]
    }


@router.post("/predict/crash-risk")
def predict_crash_risk(req: PredictionRequest, db: Session = Depends(get_db)):
    """Predict 7-day price crash risk probability."""
    full_pred = forecast_7_days(req, db)
    return {
        "crop": full_pred["crop"],
        "mandi": full_pred["mandi"],
        "crash_probability": full_pred["crash_probability"],
        "crash_probability_pct": full_pred["crash_probability_pct"],
        "risk_category": full_pred["risk_category"],
        "risk_color": full_pred["risk_color"],
        "recommended_action": full_pred["recommended_action"],
        "estimated_decline_pct": full_pred["estimated_decline_pct"],
        "contributing_factors": full_pred["contributing_factors"]
    }


@router.get("/predict/history")
def get_prediction_history(crop: Optional[str] = None, limit: int = 20, db: Session = Depends(get_db)):
    query = db.query(PredictionRecord)
    if crop:
        query = query.filter(PredictionRecord.crop.ilike(f"%{crop}%"))
    records = query.order_by(PredictionRecord.created_at.desc()).limit(limit).all()
    
    out = []
    for r in records:
        out.append({
            "id": r.id,
            "crop": r.crop,
            "state": r.state,
            "mandi": r.mandi,
            "prediction_date": r.prediction_date,
            "current_price": r.current_price,
            "tomorrow_price": r.tomorrow_price,
            "crash_probability_pct": round(r.crash_probability * 100, 1),
            "risk_category": r.risk_category,
            "model_version": r.model_version,
            "created_at": r.created_at.isoformat() if r.created_at else None
        })
    return out


@router.get("/models/metrics")
def get_model_metrics():
    """Retrieve verified evaluation metrics calculated from held-out chronological test data."""
    reg_file = RESULTS_DIR / "regression_metrics.json"
    clf_file = RESULTS_DIR / "classification_metrics.json"
    meta_file = MODELS_DIR / "model_metadata.json"
    summary_file = RESULTS_DIR / "evaluation_summary.txt"

    if not (reg_file.exists() and clf_file.exists()):
        return {
            "status": "NOT_EVALUATED",
            "message": "Models have not been trained or evaluated yet. Run 'python3 ml/evaluate_model.py'."
        }

    with open(reg_file, "r") as f:
        reg_metrics = json.load(f)
    with open(clf_file, "r") as f:
        clf_metrics = json.load(f)
        
    metadata = {}
    if meta_file.exists():
        with open(meta_file, "r") as f:
            metadata = json.load(f)

    summary_text = ""
    if summary_file.exists():
        with open(summary_file, "r") as f:
            summary_text = f.read()

    return {
        "status": "EVALUATED_READY",
        "model_version": metadata.get("model_version", "v1.2.0"),
        "training_timestamp": metadata.get("training_timestamp"),
        "dataset_name": metadata.get("dataset_name"),
        "total_records": metadata.get("total_records"),
        "train_period": metadata.get("train_period"),
        "test_period": metadata.get("test_period"),
        "regression": reg_metrics,
        "classification": clf_metrics,
        "summary_text": summary_text
    }


@router.get("/models/status")
def get_models_status():
    reg_path = MODELS_DIR / "price_forecaster.joblib"
    clf_path = MODELS_DIR / "crash_classifier.joblib"
    scaler_path = MODELS_DIR / "feature_scaler.joblib"
    
    is_ready = reg_path.exists() and clf_path.exists() and scaler_path.exists()
    return {
        "is_ready": is_ready,
        "regression_model_available": reg_path.exists(),
        "classification_model_available": clf_path.exists(),
        "feature_scaler_available": scaler_path.exists(),
        "mode": "ML_INFERENCE" if is_ready else "DEMO_FALLBACK"
    }
