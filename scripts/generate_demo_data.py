"""AgriShield Synthetic Demo Dataset Generator.

Generates realistic historical daily market price and arrivals data for Indian mandis,
with authentic price cycles, seasonal supply surges, weather influences, and price crash events.
Every generated row is explicitly labeled with source and 'is_synthetic=True'.
"""
import csv
import datetime
import math
import random
from pathlib import Path

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "ml" / "data"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_FILE = OUTPUT_DIR / "agmarknet_market_prices.csv"

MANDIS_CONFIG = [
    {"state": "Tamil Nadu", "district": "Dindigul", "mandi": "Oddanchatram", "crops": ["Tomato", "Chilli", "Brinjal", "Onion"]},
    {"state": "Tamil Nadu", "district": "Madurai", "mandi": "Madurai Central Mandi", "crops": ["Tomato", "Brinjal", "Rice"]},
    {"state": "Tamil Nadu", "district": "Thiruvallur", "mandi": "Koyambedu Wholesale", "crops": ["Tomato", "Potato", "Onion"]},
    {"state": "Maharashtra", "district": "Nashik", "mandi": "Lasalgaon APMC", "crops": ["Onion", "Tomato", "Potato"]},
    {"state": "Maharashtra", "district": "Pune", "mandi": "Pune APMC Market Yard", "crops": ["Tomato", "Onion", "Wheat", "Maize"]},
    {"state": "Karnataka", "district": "Kolar", "mandi": "Kolar APMC Mandi", "crops": ["Tomato", "Potato", "Groundnut"]},
    {"state": "Karnataka", "district": "Belagavi", "mandi": "Belagavi APMC", "crops": ["Potato", "Onion", "Maize"]},
    {"state": "Andhra Pradesh", "district": "Guntur", "mandi": "Guntur Mirchi Yard", "crops": ["Chilli", "Cotton", "Rice"]},
    {"state": "Punjab", "district": "Ludhiana", "mandi": "Khanna Grain Market", "crops": ["Wheat", "Rice", "Maize"]},
    {"state": "Gujarat", "district": "Rajkot", "mandi": "Rajkot Marketing Yard", "crops": ["Cotton", "Groundnut", "Wheat"]},
]

CROP_PROFILES = {
    "Tomato": {"base_price": 2400, "volatility": 0.45, "variety": "Hybrid-Desi", "shelf_life": 5, "min_p": 450, "max_p": 7200},
    "Onion": {"base_price": 2800, "volatility": 0.38, "variety": "Nashik Red", "shelf_life": 45, "min_p": 800, "max_p": 6800},
    "Potato": {"base_price": 1800, "volatility": 0.25, "variety": "Jyoti / Kufri", "shelf_life": 60, "min_p": 700, "max_p": 3800},
    "Rice": {"base_price": 3200, "volatility": 0.15, "variety": "Common Paddy", "shelf_life": 180, "min_p": 2000, "max_p": 4600},
    "Wheat": {"base_price": 2350, "volatility": 0.12, "variety": "Lokwan / Sharbati", "shelf_life": 240, "min_p": 1900, "max_p": 3200},
    "Maize": {"base_price": 1950, "volatility": 0.18, "variety": "Yellow Hybrid", "shelf_life": 120, "min_p": 1300, "max_p": 2900},
    "Cotton": {"base_price": 6800, "volatility": 0.22, "variety": "Medium Staple", "shelf_life": 150, "min_p": 4800, "max_p": 9200},
    "Groundnut": {"base_price": 5900, "volatility": 0.20, "variety": "Bold Pods", "shelf_life": 120, "min_p": 4100, "max_p": 8200},
    "Chilli": {"base_price": 13500, "volatility": 0.30, "variety": "Teja Red Dry", "shelf_life": 90, "min_p": 7500, "max_p": 24000},
    "Brinjal": {"base_price": 2100, "volatility": 0.35, "variety": "Green Round", "shelf_life": 7, "min_p": 600, "max_p": 4600},
}


def generate_market_data(start_date="2024-01-01", end_date="2026-03-25"):
    random.seed(42)
    start = datetime.datetime.strptime(start_date, "%Y-%m-%d").date()
    end = datetime.datetime.strptime(end_date, "%Y-%m-%d").date()
    num_days = (end - start).days

    rows = []
    
    for mandi_info in MANDIS_CONFIG:
        state = mandi_info["state"]
        district = mandi_info["district"]
        mandi = mandi_info["mandi"]
        
        for crop in mandi_info["crops"]:
            profile = CROP_PROFILES[crop]
            base_p = profile["base_price"]
            variety = profile["variety"]
            volatility = profile["volatility"]
            
            current_p = base_p * random.uniform(0.9, 1.1)
            crash_cycle_timer = random.randint(30, 90)
            in_crash_event = False
            crash_days_left = 0
            
            for d_idx in range(num_days):
                curr_date = start + datetime.timedelta(days=d_idx)
                month = curr_date.month
                day_of_year = curr_date.timetuple().tm_yday
                
                # Seasonality factor
                seasonal_multiplier = 1.0 + 0.20 * math.sin(2 * math.pi * (day_of_year - 40) / 365)
                
                # Simulate periodic glut / crash conditions (e.g. unseasonal rain or sudden heavy harvest arrivals)
                crash_cycle_timer -= 1
                if crash_cycle_timer <= 0 and not in_crash_event:
                    in_crash_event = True
                    crash_days_left = random.randint(5, 12)
                    crash_cycle_timer = random.randint(45, 120)
                
                if in_crash_event:
                    # In crash event, arrivals surge drastically (1.8x to 3x) and price plummets daily
                    arrivals = int(random.uniform(800, 2500) * (2.2 if crop in ["Tomato", "Onion"] else 1.6))
                    daily_drift = random.uniform(-0.08, -0.02)
                    crash_days_left -= 1
                    if crash_days_left <= 0:
                        in_crash_event = False
                else:
                    # Normal market variation with mean-reversion
                    arrivals = int(random.uniform(150, 750) * (1.2 - 0.2 * math.sin(2 * math.pi * day_of_year / 365)))
                    mean_pull = (base_p * seasonal_multiplier - current_p) * 0.05
                    daily_noise = random.gauss(0, volatility * base_p * 0.035)
                    daily_drift = (mean_pull + daily_noise) / current_p

                current_p = current_p * (1.0 + daily_drift)
                current_p = max(profile["min_p"], min(profile["max_p"], current_p))
                
                modal_price = round(current_p, 2)
                min_price = round(modal_price * random.uniform(0.88, 0.96), 2)
                max_price = round(modal_price * random.uniform(1.04, 1.15), 2)
                
                # Weather variables
                temp = round(22 + 10 * math.sin(2 * math.pi * (day_of_year - 100) / 365) + random.uniform(-3, 3), 1)
                rainfall = round(max(0.0, random.gauss(1.5, 4.0) if month in [6, 7, 8, 9, 10] else random.gauss(0.1, 0.5)), 1)
                humidity = round(max(20.0, min(98.0, 55 + 20 * math.sin(2 * math.pi * (day_of_year - 150) / 365) + random.uniform(-8, 8))), 1)
                weather = "Rainy" if rainfall > 10 else ("Overcast" if humidity > 75 else ("Clear" if temp > 28 else "Mild"))
                
                rows.append({
                    "date": curr_date.strftime("%Y-%m-%d"),
                    "state": state,
                    "district": district,
                    "mandi": mandi,
                    "crop": crop,
                    "variety": variety,
                    "min_price": min_price,
                    "max_price": max_price,
                    "modal_price": modal_price,
                    "arrivals": arrivals,
                    "weather": weather,
                    "rainfall": rainfall,
                    "temperature": temp,
                    "humidity": humidity,
                    "source": "AgriShield_Agmarknet_Benchmark_v1",
                    "is_synthetic": True,
                    "retrieval_timestamp": "2026-09-19T03:00:00Z"
                })

    headers = [
        "date", "state", "district", "mandi", "crop", "variety",
        "min_price", "max_price", "modal_price", "arrivals",
        "weather", "rainfall", "temperature", "humidity",
        "source", "is_synthetic", "retrieval_timestamp"
    ]
    
    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)
        
    print(f"Generated {len(rows)} records saved to {OUTPUT_FILE}")
    return OUTPUT_FILE

if __name__ == "__main__":
    generate_market_data()
