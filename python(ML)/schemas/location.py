from pydantic import BaseModel, Field

class LocationInput(BaseModel):
    """Input schema for location data."""

    state: str
    district: str
    latitude: float = Field(
        description="Latitude",
        ge=-90,
        le=90,
    )
    longitude: float = Field(
        description="Longitude",
        ge=-180,
        le=180,
    )


class LocationResponse(BaseModel):
    """Response schema for resolved location."""

    state: str
    district: str
    latitude: float
    longitude: float
