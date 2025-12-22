package com.meet.sbs.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class PredictionException extends RuntimeException {

    private final HttpStatus status;

    public PredictionException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }
}
