"""AgriShield Alert & Early Warning Dispatcher API.
"""
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from backend.app.database.session import get_db
from backend.app.database.models import AlertRecord, User
from backend.app.schemas.schemas import AlertTriggerRequest, AlertOut
from backend.app.services.sms_service import sms_service
from ml.predict import get_predictor

router = APIRouter(prefix="", tags=["Early Warning & SMS Alerts"])


@router.post("/alerts/trigger")
def trigger_alert(
    req: AlertTriggerRequest,
    db: Session = Depends(get_db)
):
    """Trigger an early warning alert and dispatch via SMS gateway / simulator."""
    predictor = get_predictor()
    pred = predictor.predict_crop_mandi(
        crop=req.crop,
        state="Tamil Nadu",
        mandi=req.mandi,
        forecast_days=7
    )

    phone = req.phone_number or "+91 98401 23456"
    lang = req.language or "en"
    dates_str = f"Next 7 Days ({pred['forecast_prices'][0]['date']} to {pred['forecast_prices'][-1]['date']})"

    # Dispatch via SMS service
    dispatch_res = sms_service.send_alert_sms(
        to_phone=phone,
        crop=req.crop,
        mandi=req.mandi,
        prob_pct=pred["crash_probability_pct"],
        dates=dates_str,
        lang=lang
    )

    # Record in database
    alert = AlertRecord(
        user_id=1,
        farmer_name="Ramesh Kumar (Farmer)",
        phone_number=phone,
        crop=req.crop,
        mandi=req.mandi,
        predicted_price=pred["tomorrow_predicted_price"],
        crash_probability=pred["crash_probability"],
        risk_level=req.override_risk or pred["risk_category"],
        forecast_date=dates_str,
        message=dispatch_res["message"],
        language=lang,
        status=dispatch_res["status"],
        is_simulated=dispatch_res["is_simulated"]
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)

    return {
        "alert_id": alert.id,
        "dispatch_status": dispatch_res["status"],
        "is_simulated": dispatch_res["is_simulated"],
        "provider": dispatch_res["provider"],
        "provider_message_id": dispatch_res.get("provider_message_id"),
        "to_phone": phone,
        "message": dispatch_res["message"],
        "crash_probability_pct": pred["crash_probability_pct"],
        "risk_level": alert.risk_level,
        "note": dispatch_res.get("note"),
        "timestamp": dispatch_res["timestamp"]
    }


@router.get("/alerts/history")
def get_alert_history(
    crop: Optional[str] = None,
    limit: int = 25,
    db: Session = Depends(get_db)
):
    """Retrieve full audit log of all early warning alerts and delivery statuses."""
    q = db.query(AlertRecord)
    if crop:
        q = q.filter(AlertRecord.crop.ilike(f"%{crop}%"))
    alerts = q.order_by(AlertRecord.created_at.desc()).limit(limit).all()

    return [
        {
            "id": a.id,
            "farmer_name": a.farmer_name,
            "phone_number": a.phone_number,
            "crop": a.crop,
            "mandi": a.mandi,
            "predicted_price": a.predicted_price,
            "crash_probability": round(a.crash_probability * 100, 1),
            "risk_level": a.risk_level,
            "forecast_date": a.forecast_date,
            "message": a.message,
            "language": a.language,
            "status": a.status,
            "is_simulated": a.is_simulated,
            "created_at": a.created_at.strftime("%Y-%m-%d %H:%M:%S") if a.created_at else None
        }
        for a in alerts
    ]
