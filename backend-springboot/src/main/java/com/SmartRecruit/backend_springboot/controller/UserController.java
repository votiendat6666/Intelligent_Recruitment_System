package com.SmartRecruit.backend_springboot.controller;

import com.SmartRecruit.backend_springboot.dto.User.UserResponse;
import com.SmartRecruit.backend_springboot.service.User.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*") // Đảm bảo React gọi được
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(403).build();
        }

        // Lấy username từ Token đã được Spring Security giải mã
        String username = authentication.getName();
        UserResponse userResponse = userService.getUserProfile(username);

        return ResponseEntity.ok(userResponse);
    }
}