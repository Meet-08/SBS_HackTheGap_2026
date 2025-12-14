package com.meet.sbs.models;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherInfo {
    
    @Column(name = "weather_avg_temp")
    private Double avgTemp;

    @Column(name = "weather_humidity_avg")
    private Double humidityAvg;

    @Column(name = "weather_rain_total")
    private Double rainTotal;

    @Column(name = "weather_solar_avg")
    private Double solarAvg;
}