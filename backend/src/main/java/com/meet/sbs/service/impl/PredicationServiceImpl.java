package com.meet.sbs.service.impl;

import com.meet.sbs.dto.prediction.PredictionRequestDto;
import com.meet.sbs.dto.prediction.PredictionResponseDTO;
import com.meet.sbs.exception.UserException;
import com.meet.sbs.repository.LocationRepository;
import com.meet.sbs.repository.PredictionRepository;
import com.meet.sbs.repository.UserRepository;
import com.meet.sbs.service.PredicationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
@RequiredArgsConstructor
public class PredicationServiceImpl implements PredicationService {

    private static final Logger log = LoggerFactory.getLogger(PredicationServiceImpl.class);
    private final UserRepository userRepository;
    private final PredictionRepository predictionRepository;
    private final LocationRepository locationRepository;
    private final RestClient restClient;
    @Value("${spring.application.ml-service-url}")
    private String mlServiceUrl;

    @Override
    public PredictionResponseDTO predict(
            PredictionRequestDto requestDto,
            String userEmail
    ) {
        log.info("Prediction request received: {} for user: {}", requestDto, userEmail);
        var user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserException("User not found", HttpStatus.NOT_FOUND));

        var location = locationRepository.findByStateAndDistrict(
                requestDto.state(),
                requestDto.district()
        ).orElseThrow(() -> new UserException("Location not found", HttpStatus.NOT_FOUND));

        var updatedReq = requestDto.toBuilder()
                .latitude(location.getLatitude())
                .longitude(location.getLongitude())
                .build();

        log.info("Sending request to ML service at {}: {}", mlServiceUrl + "/predict", updatedReq);
        var res = restClient.post()
                .uri(mlServiceUrl + "/predict")
                .contentType(MediaType.APPLICATION_JSON)
                .body(updatedReq)
                .retrieve()
                .body(PredictionResponseDTO.class);

        if (res == null) {
            //TODO: Handle null response appropriately
            throw new RuntimeException("Failed to fetch prediction");
        }

        var predictionEntity = Mapper.mapToPredictionEntity(res, user);
        predictionRepository.save(predictionEntity);
        return res;
    }
}
