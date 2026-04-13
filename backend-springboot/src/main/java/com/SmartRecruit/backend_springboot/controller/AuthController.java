package com.SmartRecruit.backend_springboot.controller;

import com.SmartRecruit.backend_springboot.dto.Auth.LoginRequest;
import com.SmartRecruit.backend_springboot.dto.Auth.LoginResponse;
import com.SmartRecruit.backend_springboot.dto.Auth.RegisterRequest;
import com.SmartRecruit.backend_springboot.entity.User;
import com.SmartRecruit.backend_springboot.entity.enums.UserRole;
import com.SmartRecruit.backend_springboot.entity.enums.UserStatus;
import com.SmartRecruit.backend_springboot.repository.UserRepository;
import com.SmartRecruit.backend_springboot.service.Setting.JwtService;
import com.SmartRecruit.backend_springboot.service.User.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.SmartRecruit.backend_springboot.dto.Auth.SocialLoginRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired private UserService userService;
    @Autowired private UserRepository userRepository;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtService jwtService;
    @Autowired private PasswordEncoder passwordEncoder; // Để encode pass ảo cho social user

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) { // Dùng @RequestBody cho sạch
        try {
            userService.registerUser(req);
            return ResponseEntity.ok(Map.of("message", "Đăng ký thành công..."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // 1. Xác thực bằng Email và Password
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // 2. Lấy thông tin User từ DB
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

            // 3. Kiểm tra các điều kiện (Không cần check Role ở đây nữa)
            if (!user.isVerified()) {
                return ResponseEntity.status(403).body("Tài khoản chưa xác thực email.");
            }

            if (user.getStatus() == UserStatus.LOCKED) {
                return ResponseEntity.status(403).body("Tài khoản đã bị khóa.");
            }

            // 4. Tạo token và trả về thông tin (Kèm theo Role thật từ Database)
            String token = jwtService.generateToken(user);
            return ResponseEntity.ok(new LoginResponse(
                    user.getId(),
                    token,
                    user.getRole().name(),
                    user.getFullName(),
                    user.getPhone(),
                    user.getAvatarUrl()
            ));

        } catch (BadCredentialsException e) {
            return ResponseEntity.badRequest().body("Sai email hoặc mật khẩu.");
        }
    }

    //Login Gooogle Facebook
    @PostMapping("/social-login")
    public ResponseEntity<?> socialLogin(@RequestBody SocialLoginRequest req) {
        try {
            // 1. Tìm user theo email
            User user = userRepository.findByEmail(req.email()).orElse(null);

            if (user != null) {
                // TRƯỜNG HỢP 1: User đã có tài khoản (có thể đang INACTIVE do đăng ký thường chưa check mail)
                if (!user.isVerified() || user.getStatus() == UserStatus.INACTIVE) {
                    // Vì họ login qua Google thành công -> Xác nhận email này chính chủ
                    // Chúng ta tự động ACTIVE luôn
                    user.setVerified(true);
                    user.setStatus(UserStatus.ACTIVE);
                    user.setVerificationToken(null); // Xóa token xác thực cũ đi
                    userRepository.save(user);
                }

                // Nếu bị khóa chủ động bởi Admin thì vẫn phải chặn
                if (user.getStatus() == UserStatus.LOCKED) {
                    return ResponseEntity.status(403).body("Tài khoản đã bị khóa.");
                }
            } else {
                // TRƯỜNG HỢP 2: User hoàn toàn mới -> Tạo mới và cho ACTIVE luôn
                user = new User();
                user.setEmail(req.email());
                user.setFullName(req.fullName());
                user.setRole(UserRole.CANDIDATE);
                user.setVerified(true);
                user.setStatus(UserStatus.ACTIVE);
                user.setPassword(passwordEncoder.encode("SOCIAL_" + UUID.randomUUID()));
                user = userRepository.save(user);
            }

            // 2. Tạo Token trả về
            String token = jwtService.generateToken(user);
            return ResponseEntity.ok(new LoginResponse(
                    user.getId(),
                    token,
                    user.getRole().name(),
                    user.getFullName(),
                    user.getPhone(),
                    user.getAvatarUrl()
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam String token) {
        try {
            userService.verifyEmail(token);

            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(URI.create("http://localhost:5173/login?verified=true"));

            return new ResponseEntity<>(headers, HttpStatus.SEE_OTHER);

        } catch (Exception e) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(URI.create("http://localhost:5173/login?error=verification_failed"));
            return new ResponseEntity<>(headers, HttpStatus.SEE_OTHER);
        }
    }
}