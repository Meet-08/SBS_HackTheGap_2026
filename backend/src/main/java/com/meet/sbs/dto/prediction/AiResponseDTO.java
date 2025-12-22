package com.meet.sbs.dto.prediction;

public record AiResponseDTO(
        String optimalIrrigationStrategy,
        String soilHealthManagement,
        String temperatureAndClimateAdaptation,
        String nutrientManagementPlan
) {
}
