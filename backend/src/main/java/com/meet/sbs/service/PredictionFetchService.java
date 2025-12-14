package com.meet.sbs.service;

import com.meet.sbs.dto.prediction.PredictionRequestDto;
import com.meet.sbs.dto.prediction.PredictionResponseDTO;
import jakarta.validation.Valid;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(url = "${spring.application.ml-service-url}")
public interface PredictionFetchService {

    @PostExchange("/predict")
    PredictionResponseDTO getPrediction(@Valid PredictionRequestDto requestDto);
}
