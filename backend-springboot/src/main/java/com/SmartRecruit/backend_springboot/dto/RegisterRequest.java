package com.SmartRecruit.backend_springboot.dto;

import com.SmartRecruit.backend_springboot.entity.enums.UserRole;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String fullName;
    private String phone;
    private UserRole role;
    private MultipartFile avatarUrl; // Dùng MultipartFile để nhận file từ Frontend
}