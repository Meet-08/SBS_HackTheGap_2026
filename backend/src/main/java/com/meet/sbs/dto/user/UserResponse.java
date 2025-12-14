package com.meet.sbs.dto.user;

import com.meet.sbs.enums.Role;

public record UserResponse(
        String firstName,
        String lastName,
        String email,
        Role role
) {
    
}
