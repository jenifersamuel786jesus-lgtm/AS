"""AgriShield Database Seeder.

Initializes tables, seeds supported crops, major mandis,
demo user accounts (Farmer, FPO Officer, Admin),
and imports the verified market series into SQLite/PostgreSQL.
"""
import csv
import sys
from pathlib import Path
from datetime import datetime

ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.app.database.session import engine, Base, SessionLocal
from backend.app.database.models import User, Crop, Mandi, MarketPrice, AlertRecord
from backend.app.core.security import get_password_hash
from scripts.generate_demo_data import MANDIS_CONFIG, CROP_PROFILES


def seed_database():
    print("[*] Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # 1. Seed Users
    demo_users = [
        {
            "name": "Ramesh Kumar (Farmer)",
            "email": "farmer@agrishield.in",
            "password": "password123",
            "phone_number": "+91 98401 23456",
            "role": "farmer",
            "preferred_state": "Tamil Nadu",
            "preferred_mandi": "Oddanchatram",
            "preferred_crop": "Tomato",
            "language": "en"
        },
        {
            "name": "Dr. Senthil Nathan (FPO Officer)",
            "email": "fpo@agrishield.in",
            "password": "password123",
            "phone_number": "+91 94432 10987",
            "role": "fpo",
            "preferred_state": "Tamil Nadu",
            "preferred_mandi": "Madurai Central Mandi",
            "preferred_crop": "Tomato",
            "language": "en"
        },
        {
            "name": "AgriShield System Admin",
            "email": "admin@agrishield.in",
            "password": "adminpassword123",
            "phone_number": "+91 98840 98765",
            "role": "admin",
            "preferred_state": "Tamil Nadu",
            "preferred_mandi": "Koyambedu Wholesale",
            "preferred_crop": "Tomato",
            "language": "en"
        }
    ]

    for u_data in demo_users:
        existing = db.query(User).filter(User.email == u_data["email"]).first()
        if not existing:
            user = User(
                name=u_data["name"],
                email=u_data["email"],
                hashed_password=get_password_hash(u_data["password"]),
                phone_number=u_data["phone_number"],
                role=u_data["role"],
                preferred_state=u_data["preferred_state"],
                preferred_mandi=u_data["preferred_mandi"],
                preferred_crop=u_data["preferred_crop"],
                language=u_data["language"]
            )
            db.add(user)
            print(f"  + Added user: {u_data['email']} ({u_data['role']})")

    # 2. Seed Crops
    for crop_name, prof in CROP_PROFILES.items():
        existing = db.query(Crop).filter(Crop.name == crop_name).first()
        if not existing:
            c = Crop(
                name=crop_name,
                variety=prof["variety"],
                base_price=prof["base_price"],
                category="Commercial / Cash Crop" if crop_name in ["Cotton", "Chilli"] else ("Cereal" if crop_name in ["Rice", "Wheat", "Maize"] else "Horticulture"),
                shelf_life_days=prof["shelf_life"]
            )
            db.add(c)
            print(f"  + Added crop: {crop_name}")

    # 3. Seed Mandis
    for m in MANDIS_CONFIG:
        existing = db.query(Mandi).filter(Mandi.name == m["mandi"]).first()
        if not existing:
            mandi_obj = Mandi(
                name=m["mandi"],
                state=m["state"],
                district=m["district"]
            )
            db.add(mandi_obj)
            print(f"  + Added mandi: {m['mandi']}")

    # 4. Seed Seed-Alerts
    if db.query(AlertRecord).count() == 0:
        demo_alert = AlertRecord(
            farmer_name="Ramesh Kumar (Farmer)",
            phone_number="+91 98401 23456",
            crop="Tomato",
            mandi="Oddanchatram",
            predicted_price=1750.0,
            crash_probability=0.72,
            risk_level="High",
            forecast_date=datetime.utcnow().strftime("%Y-%m-%d"),
            message="AgriShield Alert: Tomato prices at Oddanchatram may decline. Estimated crash risk: 72.0%. Forecast period: Next 7 Days. Please review current market information before making a selling decision.",
            status="SENT_SIMULATED",
            is_simulated=True
        )
        db.add(demo_alert)

    db.commit()
    db.close()
    print("[✓] Database seeding complete!")


if __name__ == "__main__":
    seed_database()
