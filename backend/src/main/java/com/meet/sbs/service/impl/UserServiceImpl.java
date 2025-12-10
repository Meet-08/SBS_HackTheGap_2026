package com.meet.sbs.service.impl;

import com.meet.sbs.dto.UserLoginDto;
import com.meet.sbs.dto.UserRegisterDto;
import com.meet.sbs.dto.UserResponse;
import com.meet.sbs.repository.UserRepository;
import com.meet.sbs.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserResponse registerUser(UserRegisterDto userRegisterDto) {
        var user = userRegisterDto.toEntity();

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        return UserResponse.toResponse(userRepository.save(user));
    }

    @Override
    public UserResponse loginUser(UserLoginDto userLoginDto) {
        return null;
    }
}
