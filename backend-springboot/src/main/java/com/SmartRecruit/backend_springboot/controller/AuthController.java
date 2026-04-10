package com.SmartRecruit.backend_springboot.controller;

import com.SmartRecruit.backend_springboot.dto.*;
import com.SmartRecruit.backend_springboot.entity.User;
import com.SmartRecruit.backend_springboot.entity.enums.UserStatus;
import com.SmartRecruit.backend_springboot.repository.UserRepository;
import com.SmartRecruit.backend_springboot.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired private UserService userService;
    @Autowired private UserRepository userRepository;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@ModelAttribute RegisterRequest req) {
        try {
            userService.registerUser(req);
            return ResponseEntity.ok(Map.of("message", "Đăng ký thành công. Vui lòng kiểm tra email để xác thực."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

            if (!user.isVerified()) {
                return ResponseEntity.status(403).body("Tài khoản chưa xác thực email.");
            }

            if (user.getStatus() == UserStatus.LOCKED) {
                return ResponseEntity.status(403).body("Tài khoản đã bị khóa.");
            }

            if (user.getRole() != request.getRole()) {
                return ResponseEntity.status(403).body("Sai vai trò đăng nhập.");
            }

            String token = jwtService.generateToken(user);
            return ResponseEntity.ok(new LoginResponse(
                    user.getId(), token, user.getRole().name(),
                    user.getFullName(), user.getPhone(), user.getAvatarUrl()
            ));

        } catch (BadCredentialsException e) {
            return ResponseEntity.badRequest().body("Sai email hoặc mật khẩu.");
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam String token) {
        try {
            userService.verifyEmail(token);
            return ResponseEntity.ok("Xác thực tài khoản thành công! Bây giờ bạn có thể đăng nhập.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}