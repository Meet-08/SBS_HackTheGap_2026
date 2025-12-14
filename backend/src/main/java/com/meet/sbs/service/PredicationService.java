package com.meet.sbs.service;

import com.meet.sbs.dto.prediction.PredictionRequestDto;
import com.meet.sbs.dto.prediction.PredictionResponseDTO;

public interface PredicationService {

    PredictionResponseDTO predict(PredictionRequestDto requestDto, String userEmail);
}
