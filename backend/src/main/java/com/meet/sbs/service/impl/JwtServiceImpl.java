package com.meet.sbs.service.impl;

import com.meet.sbs.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService {

    // 2 days
    private final Long jwtExpirationInMs = 172800000L;
    @Value("${spring.application.secret-key}")
    private String secretKey;
    private SecretKey key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    @Override
    public String generateToken(String subject, Map<String, Object> claims) {
        return Jwts.builder()
                .subject(subject)
                .claims(claims)
                .signWith(key)
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationInMs))
                .compact();
    }

    @Override
    public String extractSubject(String token) {
        if (isTokenExpired(token))
            throw new RuntimeException("Token has expired");


        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token).getPayload()
                .getSubject();
    }

    @Override
    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    @Override
    public boolean isTokenExpired(String token) {
        Date expiration = extractClaims(token).getExpiration();
        return expiration.before(new Date());
    }
}
