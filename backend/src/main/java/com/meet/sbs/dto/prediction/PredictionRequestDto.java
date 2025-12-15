package com.meet.sbs.dto.prediction;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.meet.sbs.enums.Season;
import jakarta.validation.constraints.*;
import lombok.Builder;

@Builder(toBuilder = true)
public record PredictionRequestDto(
        @NotBlank(message = "State cannot be empty")
        String state,

        @NotBlank(message = "District cannot be empty")
        String district,

        @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
        @DecimalMax(value = "90.0", message = "Latitude must be <= 90")
        Double latitude,
        
        @DecimalMin(value = "-180.0", message = "Longitude must be >= -180")
        @DecimalMax(value = "180.0", message = "Longitude must be <= 180")
        Double longitude,

        @NotNull(message = "Season is required")
        Season season,

        @NotNull(message = "Year is required")
        Integer year,

        @NotBlank(message = "Crop cannot be empty")
        String crop,

        @NotNull(message = "Area is required")
        @Positive(message = "Area must be positive")
        @JsonProperty("area_ha") // Handles the Python snake_case
        Double areaHa
) {


}


