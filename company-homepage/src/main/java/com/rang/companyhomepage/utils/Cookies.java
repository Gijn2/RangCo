package com.rang.companyhomepage.utils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class Cookies { // 클래스 이름을 유지하고 싶다면 내부 로직에서 Cookie(단수)를 정확히 써야 합니다.

    // 쿠키 설정 함수
    public static void setCookie(HttpServletResponse response, String name, String value, int maxAge) {
        // 'Cookies'가 아니라 자바 표준 'Cookie' 객체를 생성해야 합니다.
        Cookie cookie = new Cookie(name, value);
        cookie.setPath("/");
        cookie.setHttpOnly(true); // 보안을 위해 설정 (XSS 공격 방지)
        cookie.setMaxAge(maxAge);
        response.addCookie(cookie);
    }

    // 쿠키 읽기 함수
    public static String getCookieValue(HttpServletRequest request, String name) {
        // request.getCookies()는 'Cookie[]' 배열을 반환합니다.
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (name.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    // 쿠키 삭제 함수
    public static void deleteCookie(HttpServletResponse response, String name) {
        Cookie cookie = new Cookie(name, null);
        cookie.setPath("/");
        cookie.setMaxAge(0); // 만료 시간을 0으로 설정하여 즉시 삭제
        response.addCookie(cookie);
    }
}