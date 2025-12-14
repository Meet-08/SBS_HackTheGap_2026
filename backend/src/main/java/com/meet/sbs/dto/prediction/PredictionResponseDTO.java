package com.meet.sbs.dto.prediction;

import com.fasterxml.jackson.annotation.JsonProperty;

public record PredictionResponseDTO(
        @JsonProperty("predicted_yield_qha")
        Double predictedYieldQha,

        @JsonProperty("model_used")
        String modelUsed,

        WeatherDataDTO weather,
        SoilDataDTO soil
) {

}