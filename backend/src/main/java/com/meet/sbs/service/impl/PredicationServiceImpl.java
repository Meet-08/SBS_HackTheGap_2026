package com.meet.sbs.service.impl;

import com.meet.sbs.dto.prediction.PredictionRequestDto;
import com.meet.sbs.dto.prediction.PredictionResponseDTO;
import com.meet.sbs.exception.UserException;
import com.meet.sbs.repository.PredictionRepository;
import com.meet.sbs.repository.UserRepository;
import com.meet.sbs.service.PredicationService;
import com.meet.sbs.service.PredictionFetchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PredicationServiceImpl implements PredicationService {

    private final UserRepository userRepository;
    private final PredictionRepository predictionRepository;
    private final PredictionFetchService fetchService;

    @Override
    public PredictionResponseDTO predict(
            PredictionRequestDto requestDto,
            String userEmail
    ) {
        var user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserException("User not found", HttpStatus.NOT_FOUND));
        
        var res = fetchService.getPrediction(requestDto);

        if (res == null) {
            //TODO: Handle null response appropriately
            throw new RuntimeException("Failed to fetch prediction");
        }

        var predictionEntity = Mapper.mapToPredictionEntity(res, user);
        predictionRepository.save(predictionEntity);
        return res;
    }
}
