package com.meet.sbs.config;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.meet.sbs.service.JwtService;
import com.meet.sbs.utils.CookieUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;

    @Value("${spring.application.frontend-urls}")
    private List<String> allowedFrontends;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        String token = jwtService.generateToken(email, oAuth2User.getAttributes());

        response.addCookie(CookieUtil.createJwtCookie("X-Access-Token", token));

        // Redirect to Frontend
        getRedirectStrategy().sendRedirect(request, response, determineTargetUrl(request));
    }

    private String determineTargetUrl(HttpServletRequest request) {
        String referer = request.getHeader("Referer");

        if (referer != null && !referer.isEmpty()) {
            return allowedFrontends.stream()
                    .filter(referer::startsWith)
                    .findFirst()
                    .orElse(allowedFrontends.get(0));
        }

        return allowedFrontends.get(0);
    }

}
