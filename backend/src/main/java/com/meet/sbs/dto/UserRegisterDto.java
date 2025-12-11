package com.meet.sbs.dto;

import com.meet.sbs.models.User;
import jakarta.validation.constraints.Email;
import org.hibernate.validator.constraints.Length;

public record UserRegisterDto(
        String firstName,
        String lastName,
        @Email(message = "Email cannot be empty") String email,
        String password,
        String address,

        @Length(message = "Pin code must be size of 6", max = 6, min = 6)
        String pinCode
) {
    public User toEntity() {
        return User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .password(password)
                .address(address)
                .pinCode(pinCode)
                .build();
    }
}
