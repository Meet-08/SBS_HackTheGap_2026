package com.meet.sbs.controller;

import com.meet.sbs.dto.prediction.AiResponseDTO;
import com.meet.sbs.dto.prediction.AiSuggestionRequestDTO;
import com.meet.sbs.dto.prediction.PredictionRequestDto;
import com.meet.sbs.dto.prediction.PredictionResponseDTO;
import com.meet.sbs.service.PredicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/predict")
@RequiredArgsConstructor
public class PredicationController {

    private final PredicationService predicationService;

    @PostMapping
    public ResponseEntity<PredictionResponseDTO> makePrediction(
            @RequestBody PredictionRequestDto request,
            @AuthenticationPrincipal UserDetails user

    ) {
        PredictionResponseDTO response = predicationService.predict(request, user.getUsername());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/ai-suggestion")
    public ResponseEntity<AiResponseDTO> suggest(
            @RequestBody AiSuggestionRequestDTO body
    ) {
        return ResponseEntity.ok(predicationService.getAiSuggestions(body.requestData(), body.responseData()));
    }
}
