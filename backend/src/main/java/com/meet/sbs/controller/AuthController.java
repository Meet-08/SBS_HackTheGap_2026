package com.meet.sbs.controller;

import com.meet.sbs.dto.user.UserLoginDto;
import com.meet.sbs.dto.user.UserRegisterDto;
import com.meet.sbs.dto.user.UserResponse;
import com.meet.sbs.service.JwtService;
import com.meet.sbs.service.UserService;
import com.meet.sbs.utils.CookieUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        var email = userDetails.getUsername();
        UserResponse userResponse = userService.getUserByEmail(email);
        return ResponseEntity.ok(userResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            HttpServletResponse response,
            @Valid @RequestBody UserRegisterDto userRegisterDto
    ) {
        UserResponse userResponse = userService.registerUser(userRegisterDto);
        String token = jwtService.generateToken(userResponse.email(), new HashMap<>());
        response.addCookie(CookieUtil.createJwtCookie("X-Access-Token", token));
        return ResponseEntity.status(HttpStatus.CREATED).body(userResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(
            HttpServletResponse response,
            @Valid @RequestBody UserLoginDto userLoginDto) {
        UserResponse userResponse = userService.loginUser(userLoginDto);
        String token = jwtService.generateToken(userResponse.email(), new HashMap<>());
        response.addCookie(CookieUtil.createJwtCookie("X-Access-Token", token));
        return ResponseEntity.ok(userResponse);
    }

    @GetMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        response.addCookie(CookieUtil.deleteJwtCookie("X-Access-Token"));
        return ResponseEntity.ok().build();
    }
}

