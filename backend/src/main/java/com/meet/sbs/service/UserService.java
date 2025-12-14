package com.meet.sbs.service;

import com.meet.sbs.dto.user.UserLoginDto;
import com.meet.sbs.dto.user.UserRegisterDto;
import com.meet.sbs.dto.user.UserResponse;

public interface UserService {

    UserResponse registerUser(UserRegisterDto userRegisterDto);

    UserResponse loginUser(UserLoginDto userLoginDto);
}
