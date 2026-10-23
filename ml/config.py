"""AgriShield Machine Learning Configuration & Hyperparameters.
"""
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"
RESULTS_DIR = BASE_DIR / "results"

DATA_DIR.mkdir(parents=True, exist_ok=True)
MODELS_DIR.mkdir(parents=True, exist_ok=True)
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

# Datasets
DATASET_PATH = DATA_DIR / "agmarknet_market_prices.csv"
SYNTHETIC_DATASET_PATH = DATA_DIR / "synthetic_demo_prices.csv"

# Prediction horizon & threshold
DEFAULT_FORECAST_DAYS = 7
DEFAULT_CRASH_THRESHOLD_PCT = 0.20  # 20% drop within 7 days defines price crash
LOW_RISK_THRESHOLD = 0.30           # <30% probability
MEDIUM_RISK_THRESHOLD = 0.60        # 30% - 60% probability
# >= 60% is High Risk

# Features Configuration
LAG_DAYS = [1, 3, 7, 14, 30]
ROLLING_WINDOWS = [7, 14, 30]

SUPPORTED_CROPS = [
    "Tomato", "Onion", "Potato", "Rice", "Wheat",
    "Maize", "Cotton", "Groundnut", "Chilli", "Brinjal"
]

RANDOM_STATE = 42
TEST_SIZE_CHRONO_DAYS = 60  # Held-out latest 60 days for chronological testing
