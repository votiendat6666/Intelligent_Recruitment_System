package com.SmartRecruit.backend_springboot.dto.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Integer id;
    private String fullName;
    private String role;
    private String avatarUrl;
    private String phone;
    private String email;
}