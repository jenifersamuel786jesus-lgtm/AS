"""AgriShield FastAPI Enterprise Backend Application.

Provides unified prediction endpoints, multi-market comparison,
harvest & cold storage timing optimization, SMS alert dispatch,
and MLOps model evaluation telemetry.
"""
import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Add project root to sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.app.core.config import settings
from backend.app.database.session import engine, Base
from backend.app.database.seed import seed_database
from backend.app.api import auth, predictions, mandis, harvest, alerts, admin
from ml.config import RESULTS_DIR

# Create database tables upon initialization
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AgriShield API",
    description="AI-Powered Farmer Price Crash Prediction & Early Warning System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static directory for evaluation plots & charts
RESULTS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/results", StaticFiles(directory=str(RESULTS_DIR)), name="results")

# Include Routers
app.include_router(auth.router, prefix="/api")
app.include_router(predictions.router, prefix="/api")
app.include_router(mandis.router, prefix="/api")
app.include_router(harvest.router, prefix="/api")
app.include_router(alerts.router, prefix="/api")
app.include_router(admin.router, prefix="/api")


@app.on_event("startup")
def on_startup():
    try:
        seed_database()
    except Exception as e:
        print(f"[!] Seed check notice: {e}")


@app.get("/")
def root():
    return {
        "system": "AgriShield AI Early Warning System",
        "status": "ONLINE",
        "api_docs": "/docs",
        "version": "1.0.0",
        "mode": "Full-Stack Production"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "agrishield-backend",
        "environment": "production"
    }
