package com.meet.sbs.service;

import com.meet.sbs.dto.UserLoginDto;
import com.meet.sbs.dto.UserRegisterDto;
import com.meet.sbs.dto.UserResponse;

public interface UserService {

    UserResponse registerUser(UserRegisterDto userRegisterDto);

    UserResponse loginUser(UserLoginDto userLoginDto);
}
