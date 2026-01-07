package com.meet.sbs.service.impl;

import com.meet.sbs.enums.Role;
import com.meet.sbs.models.User;
import com.meet.sbs.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // 1. Identify the provider (google, facebook, etc.)
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        log.info("OAuth2 Provider: {}", registrationId);
        log.info("User Attributes: {}", attributes);

        // 2. Extract common fields based on provider
        String email = (String) attributes.get("email");
        String fullName = (String) attributes.get("name");

        if (email == null) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        log.info("Extracted Email: {}, Full Name: {}", email, fullName);
        userRepository.findByEmail(email).orElseGet(() -> {
            String[] nameParts = splitName(fullName);

            User newUser = User.builder()
                    .email(email)
                    .firstName(nameParts[0])
                    .lastName(nameParts[1])
                    // Generate a secure random password since it's required in DB but not used for OAuth
                    .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .role(Role.USER)
                    .build();

            return userRepository.save(newUser);
        });

        return oAuth2User;
    }

    private String[] splitName(String fullName) {
        if (fullName == null || fullName.isBlank()) {
            return new String[]{"", ""};
        }
        String[] parts = fullName.trim().split("\\s+", 2);
        if (parts.length == 1) {
            return new String[]{parts[0], ""};
        }
        return parts;
    }
}