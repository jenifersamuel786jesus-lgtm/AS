"""Harvest Timing, Delay Selling & Cold Storage Recommendation Engine.
"""
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database.session import get_db
from backend.app.database.models import HarvestPlan, Crop
from backend.app.schemas.schemas import HarvestPlanCreate, HarvestPlanResponse
from ml.predict import get_predictor
from scripts.generate_demo_data import CROP_PROFILES

router = APIRouter(prefix="", tags=["Harvest & Storage Planning"])


@router.post("/harvest/plan")
def calculate_harvest_recommendation(
    plan: HarvestPlanCreate,
    db: Session = Depends(get_db)
):
    """Evaluate optimal selling strategy comparing instant sell, delay, and cold storage."""
    predictor = get_predictor()
    
    # Fetch prediction
    pred = predictor.predict_crop_mandi(
        crop=plan.crop,
        state="Tamil Nadu",
        mandi=plan.mandi,
        forecast_days=7
    )
    
    current_price = pred["current_price"]
    forecast = pred["forecast_prices"]
    
    # Shelf life lookup
    prof = CROP_PROFILES.get(plan.crop, {"shelf_life": 7, "base_price": 2000.0})
    shelf_life = prof["shelf_life"]
    is_highly_perishable = shelf_life <= 7
    
    # Parse harvest date
    try:
        harvest_dt = datetime.strptime(plan.harvest_date, "%Y-%m-%d")
        today = datetime.utcnow().date()
        diff_days = (harvest_dt.date() - today).days
    except Exception:
        diff_days = 2
        
    diff_days = max(1, min(7, diff_days))
    price_at_harvest = forecast[diff_days - 1]["predicted_price"] if diff_days <= len(forecast) else forecast[-1]["predicted_price"]
    
    # 1. Option A: Sell Immediately (Today)
    gross_today = current_price * plan.quantity_quintals
    transport_total = plan.transport_cost_per_qtl * plan.quantity_quintals
    net_today = gross_today - transport_total
    
    # 2. Option B: Sell on Planned Harvest Date
    gross_harvest = price_at_harvest * plan.quantity_quintals
    net_harvest = gross_harvest - transport_total
    
    # 3. Option C: Cold Storage for 7-14 days (if storage is available)
    # Storage cost: approx ₹35 per quintal per week
    storage_cost_per_qtl = 40.0 if plan.storage_available else 0.0
    # Expected rebound price after crash glut passes
    expected_rebound_price = current_price * 1.08
    gross_stored = expected_rebound_price * plan.quantity_quintals
    net_stored = gross_stored - (transport_total + (storage_cost_per_qtl * plan.quantity_quintals))
    
    # Recommendation Strategy Logic
    risk = pred["risk_category"]
    net_diff_harvest_vs_today = net_harvest - net_today
    
    if risk == "High":
        if is_highly_perishable and not plan.storage_available:
            recommendation_action = "SELL IMMEDIATELY / ADVANCE HARVEST"
            strategy_explanation = f"Price crash risk is HIGH ({pred['crash_probability_pct']}%), and {plan.crop} has a short shelf-life ({shelf_life} days). Delaying harvest will result in estimated net revenue loss of ₹{abs(round(net_diff_harvest_vs_today)):,}."
            suggested_window = "Next 24 to 48 Hours"
        elif plan.storage_available:
            recommendation_action = "STORE IN COLD STORAGE FACILITY"
            strategy_explanation = f"Market is experiencing a temporary harvest glut. Cold storage will protect your crop until prices rebound, generating an estimated net gain of ₹{round(net_stored - net_harvest):,}."
            suggested_window = "Store for 7–10 days before releasing to market"
        else:
            recommendation_action = "CHECK ALTERNATIVE MANDIS"
            strategy_explanation = "Severe price crash at current mandi. Shift harvest delivery to nearby regional mandis with higher demand."
            suggested_window = "Immediate diversion"
    elif risk == "Medium":
        recommendation_action = "HARVEST IN STAGGERED BATCHES"
        strategy_explanation = "Downward pressure is moderate. Split your harvest into 2-3 lots over 5 days to average market realization."
        suggested_window = "Staggered 3-day intervals"
    else:
        recommendation_action = "MAINTAIN PLANNED HARVEST SCHEDULE"
        strategy_explanation = "Market price trend is healthy and stable. Proceed with normal harvest operations."
        suggested_window = f"On planned date: {plan.harvest_date}"

    # Save plan to database
    db_plan = HarvestPlan(
        user_id=1,
        crop=plan.crop,
        mandi=plan.mandi,
        harvest_date=plan.harvest_date,
        quantity_quintals=plan.quantity_quintals,
        storage_available=plan.storage_available,
        transport_cost_per_qtl=plan.transport_cost_per_qtl,
        estimated_gross_value=round(gross_harvest, 2),
        estimated_net_value=round(net_harvest, 2),
        risk_category=risk,
        notes=plan.notes
    )
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)

    return {
        "id": db_plan.id,
        "crop": plan.crop,
        "mandi": plan.mandi,
        "harvest_date": plan.harvest_date,
        "quantity_quintals": plan.quantity_quintals,
        "shelf_life_days": shelf_life,
        "is_highly_perishable": is_highly_perishable,
        "current_market_price": current_price,
        "expected_price_at_harvest": price_at_harvest,
        "estimated_gross_value": round(gross_harvest, 2),
        "estimated_net_value": round(net_harvest, 2),
        "net_today": round(net_today, 2),
        "net_difference": round(net_diff_harvest_vs_today, 2),
        "storage_available": plan.storage_available,
        "net_with_cold_storage": round(net_stored, 2) if plan.storage_available else None,
        "risk_category": risk,
        "crash_probability_pct": pred["crash_probability_pct"],
        "recommendation_action": recommendation_action,
        "suggested_window": suggested_window,
        "strategy_explanation": strategy_explanation
    }


@router.get("/harvest/plans")
def list_harvest_plans(db: Session = Depends(get_db)):
    plans = db.query(HarvestPlan).order_by(HarvestPlan.created_at.desc()).limit(15).all()
    return [
        {
            "id": p.id,
            "crop": p.crop,
            "mandi": p.mandi,
            "harvest_date": p.harvest_date,
            "quantity_quintals": p.quantity_quintals,
            "storage_available": p.storage_available,
            "transport_cost_per_qtl": p.transport_cost_per_qtl,
            "estimated_gross_value": p.estimated_gross_value,
            "estimated_net_value": p.estimated_net_value,
            "risk_category": p.risk_category,
            "created_at": p.created_at.isoformat() if p.created_at else None
        }
        for p in plans
    ]
