package com.SmartRecruit.backend_springboot.service.User;

import com.SmartRecruit.backend_springboot.dto.Auth.RegisterRequest;
import com.SmartRecruit.backend_springboot.dto.User.UserResponse;
import com.SmartRecruit.backend_springboot.entity.User;
import com.SmartRecruit.backend_springboot.entity.enums.UserRole;
import com.SmartRecruit.backend_springboot.entity.enums.UserStatus;
import com.SmartRecruit.backend_springboot.repository.UserRepository;
import com.SmartRecruit.backend_springboot.service.Setting.CloudinaryService;
import com.SmartRecruit.backend_springboot.service.Setting.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime; // Dùng duy nhất thư viện này
import java.util.UUID;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private CloudinaryService cloudinaryService;
    @Autowired private EmailService emailService;
    @Autowired private PasswordEncoder passwordEncoder;

    public void registerUser(RegisterRequest req) throws Exception {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email đã được sử dụng.");
        }

        String token = UUID.randomUUID().toString();
        User user = new User();

        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));

        // Xử lý FullName
        if (req.getFullName() != null && !req.getFullName().trim().isEmpty()) {
            user.setFullName(req.getFullName());
        } else {
            user.setFullName(req.getEmail().split("@")[0]);
        }

        user.setPhone(req.getPhone());
        user.setAvatarUrl(null); // Luôn để null hoặc một link ảnh mặc định
        user.setRole(UserRole.CANDIDATE); // Mặc định là CANDIDATE như bạn muốn
        user.setVerified(false);
        user.setStatus(UserStatus.INACTIVE);
        user.setVerificationToken(token);
        user.setTokenExpiresAt(LocalDateTime.now().plusHours(24));

        userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), token, user.getFullName());
    }

    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Token không hợp lệ."));

        // SỬA TẠI ĐÂY: So sánh trực tiếp giữa 2 đối tượng LocalDateTime bằng isBefore()
        if (user.getTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token đã hết hạn.");
        }

        user.setVerified(true);
        user.setStatus(UserStatus.ACTIVE);
        user.setVerificationToken(null);
        user.setTokenExpiresAt(null);
        userRepository.save(user);
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng."));
    }

    public UserResponse getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với email: " + email));

        // Chuyển đổi từ Entity User sang DTO UserResponse
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole() != null ? user.getRole().name() : null);
        response.setAvatarUrl(user.getAvatarUrl());
        response.setPhone(user.getPhone());
        response.setEmail(user.getEmail());

        return response;
    }
}