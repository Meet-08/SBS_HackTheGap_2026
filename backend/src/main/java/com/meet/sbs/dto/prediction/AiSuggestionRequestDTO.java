package com.meet.sbs.dto.prediction;

public record AiSuggestionRequestDTO(
        PredictionRequestDto requestData,
        PredictionResponseDTO responseData
) {
    
}
