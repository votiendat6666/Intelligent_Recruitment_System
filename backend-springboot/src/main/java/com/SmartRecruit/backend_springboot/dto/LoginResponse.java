package com.SmartRecruit.backend_springboot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private Integer id;
    private String token;
    private String role;
    private String fullName;
    private String phone;
    private String avatarUrl;
}