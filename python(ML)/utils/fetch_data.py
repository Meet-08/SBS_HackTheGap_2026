import time

import pandas as pd
import requests


def fetch_soil(lat, lon):
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

    for attempt in range(5):
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            break
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:
                time.sleep((2**attempt) + 1)
                continue
            raise
    else:
        response = requests.get(url, params=params)
        response.raise_for_status()

    data = response.json()

    layers = data.get("properties", {}).get("layers", [])

    def extract(layer_name):
        for lyr in layers:
            if lyr.get("name") == layer_name:
                depth_info = lyr["depths"][0]
                raw = depth_info["values"].get("mean")
                if raw is None:
                    return None

                return raw / 10.0

        return None

    return {
        "soil_ph": extract("phh2o"),
        "soil_oc": extract("ocd"),
        "clay_pct": extract("clay"),
        "sand_pct": extract("sand"),
        "cec_cmol": extract("cec"),
    }


def fetch_weather(lat, lon, year, season):
    def get_nasa_dates(year, season):
        year = int(year)
        s = season.lower()

        if s == "kharif":
            # 1 June to 30 September (same year)
            start = f"{year}0601"
            end = f"{year}0930"

        elif s == "rabi":
            # 1 October (current year) to 31 March (next year)
            start = f"{year}1001"
            end = f"{year + 1}0331"

        elif s == "whole year":
            # 1 January to 31 December (same year)
            start = f"{year}0101"
            end = f"{year}1231"

        else:
            raise ValueError(f"Unknown season: {season}")

        return start, end

    url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    start, end = get_nasa_dates(year, season)
    params = {
        "start": start,
        "end": end,
        "latitude": lat,
        "longitude": lon,
        "community": "AG",
        "parameters": "T2M,RH2M,PRECTOTCORR,ALLSKY_SFC_SW_DWN",
        "format": "JSON",
    }

    for attempt in range(5):
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            break
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:
                time.sleep((2**attempt) + 1)
                continue
            raise
    else:
        response = requests.get(url, params=params)
        response.raise_for_status()

    data = response.json()
    daily = data["properties"]["parameter"]

    df = pd.DataFrame(
        {
            "date": list(daily["T2M"].keys()),
            "temp": daily["T2M"].values(),
            "humidity": daily["RH2M"].values(),
            "rain": daily["PRECTOTCORR"].values(),
            "solar": daily["ALLSKY_SFC_SW_DWN"].values(),
        }
    )

    return {
        "avg_temp": float(df["temp"].mean()),  # °C
        "humidity_avg": float(df["humidity"].mean()),  # %
        "rain_total": float(df["rain"].sum()),  # mm
        "solar_avg": float(df["solar"].mean()),  # MJ/m2/day
    }


if __name__ == "__main__":
    # Example usage
    lat, lon = 28.6139, 77.209  # New Delhi, India
    soil_data = fetch_soil(lat, lon)
    print("Soil Data:", soil_data)

    weather_data = fetch_weather(lat, lon, year=2022, season="Kharif")
    print("Weather Data:", weather_data)
