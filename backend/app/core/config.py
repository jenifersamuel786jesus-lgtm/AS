"""AgriShield Backend Configuration Settings.
"""
import os
from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "AgriShield API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database: SQLite fallback for easy local zero-config run, configurable to PostgreSQL
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/agrishield.db")
    
    # JWT Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "agrishield_super_secure_enterprise_key_2026_jwt_token")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Twilio SMS Config
    TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    TWILIO_PHONE_NUMBER: str = os.getenv("TWILIO_PHONE_NUMBER", "")
    SMS_SIMULATION_MODE: bool = True  # Defaults to true so local devs never fail
    
    # Weather API (Optional)
    OPENWEATHER_API_KEY: str = os.getenv("OPENWEATHER_API_KEY", "")
    
    # Crash thresholds
    DEFAULT_CRASH_THRESHOLD_PCT: float = 0.20
    LOW_RISK_THRESHOLD: float = 0.30
    MEDIUM_RISK_THRESHOLD: float = 0.60

    class Config:
        case_sensitive = True

settings = Settings()
