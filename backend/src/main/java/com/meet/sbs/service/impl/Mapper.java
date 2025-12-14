package com.meet.sbs.service.impl;

import com.meet.sbs.dto.prediction.PredictionResponseDTO;
import com.meet.sbs.dto.user.UserResponse;
import com.meet.sbs.models.Prediction;
import com.meet.sbs.models.SoilInfo;
import com.meet.sbs.models.User;
import com.meet.sbs.models.WeatherInfo;

public class Mapper {

    public static UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole()
        );
    }

    public static Prediction mapToPredictionEntity(PredictionResponseDTO dto, User user) {
        return Prediction.builder()
                .user(user)
                .predictedYieldQha(dto.predictedYieldQha())
                .modelUsed(dto.modelUsed())
                .weather(WeatherInfo.builder()
                        .avgTemp(dto.weather().avgTemp())
                        .humidityAvg(dto.weather().humidityAvg())
                        .rainTotal(dto.weather().rainTotal())
                        .solarAvg(dto.weather().solarAvg())
                        .build())
                .soil(SoilInfo.builder()
                        .soilPh(dto.soil().soilPh())
                        .soilOc(dto.soil().soilOc())
                        .clayPct(dto.soil().clayPct())
                        .sandPct(dto.soil().sandPct())
                        .cecCmol(dto.soil().cecCmol())
                        .build())
                .build();
    }

}
