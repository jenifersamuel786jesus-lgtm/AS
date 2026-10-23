"""SQLAlchemy database models for AgriShield.
"""
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime,
    ForeignKey, Text, Index
)
from sqlalchemy.orm import relationship
from backend.app.database.session import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(160), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    phone_number = Column(String(30), nullable=True)
    role = Column(String(20), default="farmer")  # "farmer", "fpo", "admin"
    preferred_state = Column(String(80), default="Tamil Nadu")
    preferred_mandi = Column(String(120), default="Oddanchatram")
    preferred_crop = Column(String(80), default="Tomato")
    language = Column(String(10), default="en")  # "en", "ta"
    sms_alerts_enabled = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    predictions = relationship("PredictionRecord", back_populates="user")
    harvest_plans = relationship("HarvestPlan", back_populates="user")
    alerts = relationship("AlertRecord", back_populates="user")


class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(80), unique=True, index=True, nullable=False)
    variety = Column(String(120), default="Standard")
    base_price = Column(Float, default=2000.0)
    category = Column(String(60), default="Vegetable")
    shelf_life_days = Column(Integer, default=7)


class Mandi(Base):
    __tablename__ = "mandis"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(140), index=True, nullable=False)
    state = Column(String(80), index=True, nullable=False)
    district = Column(String(80), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)


class MarketPrice(Base):
    __tablename__ = "market_prices"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String(20), index=True, nullable=False)
    state = Column(String(80), index=True, nullable=False)
    district = Column(String(80), nullable=False)
    mandi = Column(String(140), index=True, nullable=False)
    crop = Column(String(80), index=True, nullable=False)
    variety = Column(String(120), default="Common")
    min_price = Column(Float, nullable=False)
    max_price = Column(Float, nullable=False)
    modal_price = Column(Float, nullable=False)
    arrivals = Column(Integer, default=0)
    weather = Column(String(40), default="Clear")
    rainfall = Column(Float, default=0.0)
    temperature = Column(Float, default=26.0)
    humidity = Column(Float, default=60.0)
    source = Column(String(100), default="Agmarknet")
    is_synthetic = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("idx_market_price_query", "crop", "mandi", "date"),
    )


class PredictionRecord(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    crop = Column(String(80), nullable=False)
    state = Column(String(80), nullable=False)
    mandi = Column(String(140), nullable=False)
    prediction_date = Column(String(20), nullable=False)
    current_price = Column(Float, nullable=False)
    tomorrow_price = Column(Float, nullable=False)
    forecast_json = Column(Text, nullable=False)  # JSON 7-day array
    crash_probability = Column(Float, nullable=False)
    risk_category = Column(String(20), nullable=False)
    model_version = Column(String(60), default="v1.2.0")
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="predictions")


class HarvestPlan(Base):
    __tablename__ = "harvest_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    crop = Column(String(80), nullable=False)
    mandi = Column(String(140), nullable=False)
    harvest_date = Column(String(20), nullable=False)
    quantity_quintals = Column(Float, nullable=False)
    storage_available = Column(Boolean, default=False)
    transport_cost_per_qtl = Column(Float, default=50.0)
    estimated_gross_value = Column(Float, nullable=False)
    estimated_net_value = Column(Float, nullable=False)
    risk_category = Column(String(20), default="Low")
    notes = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="harvest_plans")


class AlertRecord(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    farmer_name = Column(String(120), default="Farmer")
    phone_number = Column(String(30), nullable=False)
    crop = Column(String(80), nullable=False)
    mandi = Column(String(140), nullable=False)
    predicted_price = Column(Float, nullable=False)
    crash_probability = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)
    forecast_date = Column(String(20), nullable=False)
    message = Column(Text, nullable=False)
    language = Column(String(10), default="en")
    status = Column(String(30), default="SENT_SIMULATED")  # "SENT_SIMULATED", "SENT_TWILIO", "FAILED"
    is_simulated = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="alerts")


class ModelEvaluationRecord(Base):
    __tablename__ = "model_evaluations"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(100), nullable=False)
    model_type = Column(String(40), nullable=False)  # "Regression", "Classification"
    model_version = Column(String(60), default="v1.2.0")
    dataset_name = Column(String(120), default="Agmarknet Historical")
    test_period = Column(String(80), nullable=True)
    sample_count = Column(Integer, default=0)
    mae = Column(Float, nullable=True)
    rmse = Column(Float, nullable=True)
    r2 = Column(Float, nullable=True)
    accuracy = Column(Float, nullable=True)
    precision = Column(Float, nullable=True)
    recall = Column(Float, nullable=True)
    f1_score = Column(Float, nullable=True)
    roc_auc = Column(Float, nullable=True)
    confusion_matrix_json = Column(Text, nullable=True)
    evaluated_at = Column(DateTime, default=datetime.utcnow)


class UploadedDataset(Base):
    __tablename__ = "uploaded_datasets"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(160), nullable=False)
    total_records = Column(Integer, default=0)
    valid_records = Column(Integer, default=0)
    date_range = Column(String(80), nullable=True)
    uploaded_by = Column(String(120), default="Admin")
    status = Column(String(40), default="VALIDATED")
    uploaded_at = Column(DateTime, default=datetime.utcnow)
