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
public class SoilInfo {
    @Column(name = "soil_ph")
    private Double soilPh;

    @Column(name = "soil_oc")
    private Double soilOc;

    @Column(name = "soil_clay_pct")
    private Double clayPct;

    @Column(name = "soil_sand_pct")
    private Double sandPct;

    @Column(name = "soil_cec_cmol")
    private Double cecCmol;
}
