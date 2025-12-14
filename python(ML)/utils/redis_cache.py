import json
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

import redis.asyncio as redis
from config import settings

_redis_client = None


async def get_redis_client():
    global _redis_client
    if _redis_client is None:
        _redis_client = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            db=settings.REDIS_DB,
            decode_responses=True
        )
    return _redis_client


async def close_redis_client():
    global _redis_client
    if _redis_client is not None:
        await _redis_client.close()
        _redis_client = None


def _make_soil_key(lat: float, lon: float) -> str:
    return f"soil:{lat:.6f}:{lon:.6f}"


def _make_weather_key(lat: float, lon: float, year: int, season: str) -> str:
    return f"weather:{lat:.6f}:{lon:.6f}:{year}:{season.lower()}"


async def get_cached_soil(lat: float, lon: float) -> dict | None:
    client = await get_redis_client()
    key = _make_soil_key(lat, lon)
    try:
        data = await client.get(key)
        if data:
            return json.loads(data)
    except Exception:
        pass
    return None


async def set_cached_soil(lat: float, lon: float, data: dict) -> None:
    client = await get_redis_client()
    key = _make_soil_key(lat, lon)
    try:
        await client.setex(key, settings.SOIL_CACHE_TTL, json.dumps(data))
    except Exception:
        pass


async def get_cached_weather(lat: float, lon: float, year: int, season: str) -> dict | None:
    client = await get_redis_client()
    key = _make_weather_key(lat, lon, year, season)
    try:
        data = await client.get(key)
        if data:
            return json.loads(data)
    except Exception:
        pass
    return None


async def set_cached_weather(lat: float, lon: float, year: int, season: str, data: dict, is_historical: bool = False) -> None:
    client = await get_redis_client()
    key = _make_weather_key(lat, lon, year, season)
    ttl = settings.HISTORICAL_WEATHER_CACHE_TTL if is_historical else settings.WEATHER_CACHE_TTL
    try:
        await client.setex(key, ttl, json.dumps(data))
    except Exception:
        pass
