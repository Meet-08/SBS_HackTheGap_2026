package com.meet.sbs.dto.prediction;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public record PredictionResponseDTO(
        @JsonProperty("predicted_yield_qha")
        Double predictedYieldQha,

        String crop,

        @JsonProperty("model_used")
        String modelUsed,

        WeatherDataDTO weather,
        SoilDataDTO soil,

        @JsonProperty("last_four_years_yield")
        Map<String, Double> lastFourYearsYield
) {

}