"""AgriShield Weather Integration Service.

Connects to OpenWeatherMap API if OPENWEATHER_API_KEY is configured in .env.
Truthfully reports availability and never fabricates live weather data.
"""
import os
import requests
from typing import Dict, Any, Optional

class WeatherService:
    def __init__(self):
        self.api_key = os.getenv("OPENWEATHER_API_KEY", "").strip()

    def get_current_weather(self, district: str, state: str) -> Dict[str, Any]:
        """Fetch current weather for district if API key is provided."""
        if not self.api_key:
            return {
                "available": False,
                "reason": "OPENWEATHER_API_KEY not configured in .env",
                "weather_summary": "Historical regional benchmark (26°C, Clear)",
                "temperature": None,
                "rainfall_mm": None,
                "humidity_pct": None,
                "is_live": False
            }

        try:
            query = f"{district},{state},IN"
            url = f"https://api.openweathermap.org/data/2.5/weather?q={query}&units=metric&appid={self.api_key}"
            res = requests.get(url, timeout=4)
            if res.status_code == 200:
                data = res.json()
                return {
                    "available": True,
                    "district": district,
                    "temperature": round(data["main"]["temp"], 1),
                    "feels_like": round(data["main"]["feels_like"], 1),
                    "humidity_pct": data["main"]["humidity"],
                    "rainfall_mm": data.get("rain", {}).get("1h", 0.0),
                    "weather_condition": data["weather"][0]["main"],
                    "description": data["weather"][0]["description"].title(),
                    "is_live": True
                }
            else:
                return {
                    "available": False,
                    "reason": f"Weather API returned status code {res.status_code}",
                    "is_live": False
                }
        except Exception as e:
            return {
                "available": False,
                "reason": f"Weather API connection error: {str(e)}",
                "is_live": False
            }

weather_service = WeatherService()
