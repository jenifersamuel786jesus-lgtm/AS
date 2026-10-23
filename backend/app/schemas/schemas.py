"""Pydantic request and response schemas for AgriShield API.
"""
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, EmailStr, Field


# --- User & Auth Schemas ---
class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    phone_number: Optional[str] = None
    role: Optional[str] = "farmer"  # "farmer", "fpo", "admin"
    preferred_state: Optional[str] = "Tamil Nadu"
    preferred_mandi: Optional[str] = "Oddanchatram"
    preferred_crop: Optional[str] = "Tomato"
    language: Optional[str] = "en"


class UserLogin(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    phone_number: Optional[str]
    preferred_state: Optional[str]
    preferred_mandi: Optional[str]
    preferred_crop: Optional[str]
    language: Optional[str]
    sms_alerts_enabled: bool

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# --- Prediction Schemas ---
class PredictionRequest(BaseModel):
    crop: str = Field(..., example="Tomato")
    state: str = Field(..., example="Tamil Nadu")
    mandi: str = Field(..., example="Oddanchatram")
    forecast_days: Optional[int] = 7
    expected_harvest_date: Optional[str] = None
    expected_quantity_quintals: Optional[float] = None
    custom_price: Optional[float] = None


class DailyForecastItem(BaseModel):
    day: int
    date: str
    day_name: str
    predicted_price: float
    change_pct: float
    confidence_interval_low: float
    confidence_interval_high: float


class ContributingFactor(BaseModel):
    factor: str
    impact: str
    description: str


class PredictionResponse(BaseModel):
    crop: str
    state: str
    mandi: str
    prediction_date: str
    latest_observation_date: str
    current_price: float
    forecast_prices: List[DailyForecastItem]
    tomorrow_predicted_price: float
    tomorrow_change_pct: float
    crash_probability: float
    crash_probability_pct: float
    risk_category: str  # "Low", "Medium", "High"
    risk_color: str     # "green", "yellow", "red"
    recommended_action: str
    estimated_decline_pct: float
    contributing_factors: List[ContributingFactor]
    model_version: str
    model_architecture: str
    data_freshness: str
    is_demo: bool
    disclaimer: str


# --- Mandi Comparison Schemas ---
class MandiComparisonItem(BaseModel):
    mandi: str
    district: str
    state: str
    current_price: float
    tomorrow_price: float
    seven_day_forecast_min: float
    seven_day_forecast_max: float
    crash_probability_pct: float
    risk_category: str
    arrivals_today: int
    estimated_distance_km: Optional[int] = None
    data_freshness: str


# --- Harvest Planning Schemas ---
class HarvestPlanCreate(BaseModel):
    crop: str
    mandi: str
    harvest_date: str
    quantity_quintals: float
    storage_available: bool = False
    transport_cost_per_qtl: float = 50.0
    notes: Optional[str] = None


class HarvestPlanResponse(BaseModel):
    id: int
    crop: str
    mandi: str
    harvest_date: str
    quantity_quintals: float
    storage_available: bool
    transport_cost_per_qtl: float
    estimated_gross_value: float
    estimated_net_value: float
    risk_category: str
    expected_price_at_harvest: float
    assumptions_note: str


# --- Alert & SMS Schemas ---
class AlertTriggerRequest(BaseModel):
    crop: str
    mandi: str
    phone_number: Optional[str] = None
    language: Optional[str] = "en"
    override_risk: Optional[str] = None


class AlertOut(BaseModel):
    id: int
    farmer_name: str
    phone_number: str
    crop: str
    mandi: str
    predicted_price: float
    crash_probability: float
    risk_level: str
    forecast_date: str
    message: str
    language: str
    status: str
    is_simulated: bool
    created_at: str


# --- Admin & Datasets ---
class ThresholdConfig(BaseModel):
    crash_threshold_pct: float
    low_risk_threshold: float
    medium_risk_threshold: float
