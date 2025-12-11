package com.meet.sbs.controller;

import com.meet.sbs.dto.UserLoginDto;
import com.meet.sbs.dto.UserRegisterDto;
import com.meet.sbs.dto.UserResponse;
import com.meet.sbs.service.JwtService;
import com.meet.sbs.service.UserService;
import com.meet.sbs.utils.CookieUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

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

