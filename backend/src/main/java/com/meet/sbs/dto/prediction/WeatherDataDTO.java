package com.meet.sbs.dto.prediction;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

@Builder
public record WeatherDataDTO(
        @JsonProperty("avg_temp") Double avgTemp,
        @JsonProperty("humidity_avg") Double humidityAvg,
        @JsonProperty("rain_total") Double rainTotal,
        @JsonProperty("solar_avg") Double solarAvg
) {
}
