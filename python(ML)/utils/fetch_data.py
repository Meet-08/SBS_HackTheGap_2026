import pandas as pd
import asyncio
import os
from utils.redis_cache import (
    get_cached_soil, set_cached_soil,
    get_cached_weather, set_cached_weather
)

NASA_SEMAPHORE = asyncio.Semaphore(10)
SOIL_SEMAPHORE = asyncio.Semaphore(20)

# Cache for fallback soil data loaded from CSV
_fallback_soil_data = None


def _load_fallback_soil_data():
    """Load average soil data from processed_crop_data.csv as fallback."""
    global _fallback_soil_data
    if _fallback_soil_data is not None:
        return _fallback_soil_data

    csv_path = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        "data", "processed_crop_data.csv"
    )

    try:
        df = pd.read_csv(csv_path)
        _fallback_soil_data = {
            "soil_ph": df["soil_ph"].mean() if "soil_ph" in df.columns else None,
            "soil_oc": df["soil_oc"].mean() if "soil_oc" in df.columns else None,
            "clay_pct": df["clay_pct"].mean() if "clay_pct" in df.columns else None,
            "sand_pct": df["sand_pct"].mean() if "sand_pct" in df.columns else None,
            "cec_cmol": df["cec_cmol"].mean() if "cec_cmol" in df.columns else None,
        }
        return _fallback_soil_data
    except Exception:
        return None


async def fetch_soil_async(session, lat, lon):
    cached = await get_cached_soil(lat, lon)
    if cached is not None:
        return cached

    url = "https://rest.isric.org/soilgrids/v2.0/properties/query"
    params = [
        ("lat", lat),
        ("lon", lon),
        ("property", "phh2o"),
        ("property", "ocd"),
        ("property", "clay"),
        ("property", "sand"),
        ("property", "cec"),
        ("depth", "0-5cm"),
    ]

    async with SOIL_SEMAPHORE:
        for attempt in range(1):
            try:
                async with session.get(url, params=params) as response:
                    if response.status == 429:
                        await asyncio.sleep((2**attempt) + 1)
                        continue
                    response.raise_for_status()
                    data = await response.json()

                    layers = data.get("properties", {}).get("layers", [])

                    def extract(layer_name):
                        for lyr in layers:
                            if lyr.get("name") == layer_name:
                                depth_info = lyr["depths"][0]
                                raw = depth_info["values"].get("mean")
                                return raw / 10.0 if raw is not None else None
                        return None

                    result = {
                        "soil_ph": extract("phh2o"),
                        "soil_oc": extract("ocd"),
                        "clay_pct": extract("clay"),
                        "sand_pct": extract("sand"),
                        "cec_cmol": extract("cec"),
                    }

                    await set_cached_soil(lat, lon, result)
                    return result
            except Exception:
                if attempt == 4:
                    fallback = _load_fallback_soil_data()
                    if fallback is not None:
                        await set_cached_soil(lat, lon, fallback)
                        return fallback
                    return None
                await asyncio.sleep(1)
    # Fallback to CSV data when all retries exhausted
    fallback = _load_fallback_soil_data()
    if fallback is not None:
        await set_cached_soil(lat, lon, fallback)
        return fallback
    return None


async def _fetch_single_year_weather(session, lat, lon, year, season, use_cache=True):
    """Helper function to fetch weather data for a single year."""
    from datetime import datetime

    year = int(year)
    current_year = datetime.now().year
    is_historical = year < current_year

    if use_cache:
        cached = await get_cached_weather(lat, lon, year, season)
        if cached is not None:
            return cached

    s = season.lower()
    if s == "kharif":
        start, end = f"{year}0601", f"{year}0930"
    elif s == "rabi":
        start, end = f"{year}1001", f"{year + 1}0331"
    elif s == "whole year":
        start, end = f"{year}0101", f"{year}1231"
    else:
        return None

    url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    params = {
        "start": start,
        "end": end,
        "latitude": lat,
        "longitude": lon,
        "community": "AG",
        "parameters": "T2M,RH2M,PRECTOTCORR,ALLSKY_SFC_SW_DWN",
        "format": "JSON",
    }

    async with NASA_SEMAPHORE:
        for attempt in range(5):
            try:
                async with session.get(url, params=params) as response:
                    if response.status == 429:
                        await asyncio.sleep((2**attempt) + 1)
                        continue
                    response.raise_for_status()
                    data = await response.json()

                    daily = data.get("properties", {}).get("parameter", {})

                    def get_vals(key):
                        vals = [v for v in daily.get(key, {}).values() if v != -999]
                        return vals

                    t2m = get_vals("T2M")
                    rh2m = get_vals("RH2M")
                    rain = get_vals("PRECTOTCORR")
                    solar = get_vals("ALLSKY_SFC_SW_DWN")

                    result = {
                        "avg_temp": sum(t2m) / len(t2m) if t2m else 0,
                        "humidity_avg": sum(rh2m) / len(rh2m) if rh2m else 0,
                        "rain_total": sum(rain) if rain else 0,
                        "solar_avg": sum(solar) / len(solar) if solar else 0,
                    }

                    if use_cache:
                        await set_cached_weather(lat, lon, year, season, result, is_historical)
                    return result
            except Exception:
                if attempt == 4:
                    return None
                await asyncio.sleep(1)
    return None


async def fetch_weather_async(session, lat, lon, year, season):
    from datetime import datetime

    year = int(year)
    current_year = datetime.now().year
    current_date = datetime.now()

    # Determine the end date of the season to check if it's in the future
    s = season.lower()
    if s == "kharif":
        season_end_month, season_end_day = 9, 30  # September 30
    elif s == "rabi":
        season_end_month, season_end_day = 3, 31  # March 31 of next year
        # For Rabi, the end date is in year+1
        season_end_year = year + 1
    elif s == "whole year":
        season_end_month, season_end_day = 12, 31  # December 31
    else:
        return None

    # Check if the season end date is in the future
    if s == "rabi":
        season_end_date = datetime(year + 1, season_end_month, season_end_day)
    else:
        season_end_date = datetime(year, season_end_month, season_end_day)

    is_future_season = season_end_date > current_date

    if year > current_year or is_future_season:
        cached = await get_cached_weather(lat, lon, year, season)
        if cached is not None:
            return cached

        historical_years = range(current_year - 10, current_year)

        tasks = [
            _fetch_single_year_weather(session, lat, lon, hist_year, season)
            for hist_year in historical_years
        ]
        results = await asyncio.gather(*tasks)

        valid_results = [r for r in results if r is not None]

        if not valid_results:
            return None

        num_years = len(valid_results)
        result = {
            "avg_temp": sum(r["avg_temp"] for r in valid_results) / num_years,
            "humidity_avg": sum(r["humidity_avg"] for r in valid_results) / num_years,
            "rain_total": sum(r["rain_total"] for r in valid_results) / num_years,
            "solar_avg": sum(r["solar_avg"] for r in valid_results) / num_years,
        }

        await set_cached_weather(lat, lon, year, season, result, is_historical=False)
        return result

    return await _fetch_single_year_weather(session, lat, lon, year, season)


if __name__ == "__main__":
    import aiohttp

    async def main():
        async with aiohttp.ClientSession() as session:
            soil_data = await fetch_soil_async(session, 26.376476287500054, 91.05235564396247)
            print("Soil Data:", soil_data)

            weather_data = await fetch_weather_async(
                session, 26.376476287500054, 91.05235564396247, 2026, "Whole Year"
            )
            print("Weather Data:", weather_data)

    asyncio.run(main())
