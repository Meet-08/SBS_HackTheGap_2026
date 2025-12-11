package com.meet.sbs.service;

import io.jsonwebtoken.Claims;

import java.util.Map;

public interface JwtService {

    String generateToken(String subject, Map<String, Object> claims);

    String extractSubject(String token);

    Claims extractClaims(String token);
    
    boolean isTokenExpired(String token);

}

