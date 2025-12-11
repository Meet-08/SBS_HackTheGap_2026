package com.meet.sbs.utils;

import jakarta.servlet.http.Cookie;

public class CookieUtil {

    private static final String COOKIE_PATH = "/";
    private static final int cookieExpirationInMs = 172800000;
    private static final boolean secure = false; // true in production (HTTPS)

    public static Cookie createJwtCookie(String name, String token) {
        Cookie cookie = new Cookie(name, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(secure);
        cookie.setPath(COOKIE_PATH);
        cookie.setMaxAge(cookieExpirationInMs);
        return cookie;
    }

    public static Cookie deleteJwtCookie(String name) {
        Cookie cookie = new Cookie(name, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(secure);
        cookie.setPath(COOKIE_PATH);
        cookie.setMaxAge(0);
        return cookie;
    }
}

