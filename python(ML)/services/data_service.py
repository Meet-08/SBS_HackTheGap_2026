import aiohttp
from schemas.prediction import WeatherData, SoilData
from utils.fetch_data import fetch_weather_async, fetch_soil_async


class DataService:
    """Service for fetching weather and soil data from external APIs."""

    async def get_weather_data(
        self, latitude: float, longitude: float, year: int, season: str
    ) -> WeatherData:
        """
        Fetch weather data from NASA POWER API.

        Args:
            latitude: Location latitude
            longitude: Location longitude
            year: Year for weather data
            season: Season (Kharif, Rabi, Whole Year)

        Returns:
            WeatherData with temperature, humidity, rainfall, and solar radiation
        """
        async with aiohttp.ClientSession() as session:
            result = await fetch_weather_async(session, latitude, longitude, year, season)

            if result is None:
                return WeatherData(
                    avg_temp=None,
                    humidity_avg=None,
                    rain_total=None,
                    solar_avg=None,
                )

            return WeatherData(
                avg_temp=result.get("avg_temp"),
                humidity_avg=result.get("humidity_avg"),
                rain_total=result.get("rain_total"),
                solar_avg=result.get("solar_avg"),
            )

    async def get_soil_data(self, latitude: float, longitude: float) -> SoilData:
        """
        Fetch soil data from SoilGrids API.

        Args:
            latitude: Location latitude
            longitude: Location longitude

        Returns:
            SoilData with pH, organic carbon, clay, sand, and CEC
        """
        async with aiohttp.ClientSession() as session:
            result = await fetch_soil_async(session, latitude, longitude)

            if result is None:
                return SoilData(
                    soil_ph=None,
                    soil_oc=None,
                    clay_pct=None,
                    sand_pct=None,
                    cec_cmol=None,
                )

            return SoilData(
                soil_ph=result.get("soil_ph"),
                soil_oc=result.get("soil_oc"),
                clay_pct=result.get("clay_pct"),
                sand_pct=result.get("sand_pct"),
                cec_cmol=result.get("cec_cmol"),
            )


# Singleton instance
data_service = DataService()
