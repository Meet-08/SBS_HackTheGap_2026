package com.meet.sbs.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Season {
    KHARIF("Kharif"),
    RABI("Rabi"),
    WHOLE_YEAR("Whole Year");

    private final String mlValue;

    Season(String mlValue) {
        this.mlValue = mlValue;
    }

    @JsonValue
    public String toJson() {
        return mlValue;
    }
}
