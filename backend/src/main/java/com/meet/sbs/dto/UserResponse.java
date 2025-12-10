package com.meet.sbs.dto;

import com.meet.sbs.enums.Role;
import com.meet.sbs.models.User;

public record UserResponse(
        String firstName,
        String lastName,
        String email,
        Role role
) {

    public static UserResponse toResponse(User user) {
        return new UserResponse(
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole()
        );
    }
}
