package com.meet.sbs.dto.prediction;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

@Builder
public record SoilDataDTO(
        @JsonProperty("soil_ph") Double soilPh,
        @JsonProperty("soil_oc") Double soilOc,
        @JsonProperty("clay_pct") Double clayPct,
        @JsonProperty("sand_pct") Double sandPct,
        @JsonProperty("cec_cmol") Double cecCmol
) {
}
