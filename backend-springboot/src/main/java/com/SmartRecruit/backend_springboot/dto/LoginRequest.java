package com.SmartRecruit.backend_springboot.dto;

import com.SmartRecruit.backend_springboot.entity.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    private String email;
    private String password;
    private UserRole role; // Phải là kiểu Enum UserRole để khớp với logic Controller
}