package com.SmartRecruit.backend_springboot.dto.Auth;

public record SocialLoginRequest(
        String email,
        String fullName,
        String avatarUrl,
        String provider // "GOOGLE" hoặc "FACEBOOK"
) {}
