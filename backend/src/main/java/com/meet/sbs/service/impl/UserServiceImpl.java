package com.meet.sbs.service.impl;

import com.meet.sbs.dto.user.UserLoginDto;
import com.meet.sbs.dto.user.UserRegisterDto;
import com.meet.sbs.dto.user.UserResponse;
import com.meet.sbs.enums.Role;
import com.meet.sbs.exception.UserException;
import com.meet.sbs.repository.UserRepository;
import com.meet.sbs.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserResponse registerUser(UserRegisterDto userRegisterDto) {
        log.info("Registering user with email: {}", userRegisterDto.email());
        var user = userRegisterDto.toEntity();
        if (userRepository.existsByEmail(user.getEmail())) {
            log.warn("User with email {} already exists", user.getEmail());
            throw new UserException("User with email " + user.getEmail() + " already exists", HttpStatus.CONFLICT);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.USER);

        var savedUser = userRepository.save(user);
        log.info("User with email {} registered successfully", savedUser.getEmail());
        return Mapper.toUserResponse(savedUser);
    }

    @Override
    public UserResponse loginUser(UserLoginDto userLoginDto) {
        log.info("Logging in user with email: {}", userLoginDto.email());
        var user = userRepository.findByEmail(userLoginDto.email())
                .orElseThrow(() -> new UserException("User with email not found", HttpStatus.NOT_FOUND));

        if (!passwordEncoder.matches(userLoginDto.password(), user.getPassword()))
            throw new UserException("Invalid password", HttpStatus.UNAUTHORIZED);

        log.info("User with email {} logged in successfully", user.getEmail());
        return Mapper.toUserResponse(user);
    }
}
