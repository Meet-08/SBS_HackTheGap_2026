import asyncio

NASA_SEMAPHORE = asyncio.Semaphore(10)
SOIL_SEMAPHORE = asyncio.Semaphore(20)


async def fetch_soil_async(session, lat, lon):
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
        for attempt in range(5):
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

                    return {
                        "soil_ph": extract("phh2o"),
                        "soil_oc": extract("ocd"),
                        "clay_pct": extract("clay"),
                        "sand_pct": extract("sand"),
                        "cec_cmol": extract("cec"),
                    }
            except Exception:
                if attempt == 4:
                    return None
                await asyncio.sleep(1)
    return None


async def fetch_weather_async(session, lat, lon, year, season):
    year = int(year)
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

                    return {
                        "avg_temp": sum(t2m) / len(t2m) if t2m else 0,
                        "humidity_avg": sum(rh2m) / len(rh2m) if rh2m else 0,
                        "rain_total": sum(rain) if rain else 0,
                        "solar_avg": sum(solar) / len(solar) if solar else 0,
                    }
            except Exception:
                if attempt == 4:
                    return None
                await asyncio.sleep(1)
    return None


if __name__ == "__main__":
    import aiohttp

    async def main():
        async with aiohttp.ClientSession() as session:
            soil_data = await fetch_soil_async(session, 28.6139, 77.209)
            print("Soil Data:", soil_data)

            weather_data = await fetch_weather_async(
                session, 28.6139, 77.209, 2026, "Whole Year"
            )
            print("Weather Data:", weather_data)

    asyncio.run(main())
