package com.SmartRecruit.backend_springboot.service;

import com.SmartRecruit.backend_springboot.dto.*;
import com.SmartRecruit.backend_springboot.entity.User;
import com.SmartRecruit.backend_springboot.entity.enums.UserStatus;
import com.SmartRecruit.backend_springboot.repository.UserRepository;
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

        String avatarUrl = null;
        if (req.getAvatarUrl() != null && !req.getAvatarUrl().isEmpty()) {
            avatarUrl = cloudinaryService.uploadImage(req.getAvatarUrl());
        }

        String token = UUID.randomUUID().toString();

        // Sử dụng Builder nếu bạn đã thêm @Builder ở Entity (như tôi gợi ý lúc nãy)
        // hoặc dùng Setter như cũ nhưng sửa kiểu dữ liệu
        User user = new User();
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setFullName(req.getFullName());
        user.setPhone(req.getPhone());
        user.setAvatarUrl(avatarUrl);
        user.setRole(req.getRole());
        user.setVerified(false);
        user.setStatus(UserStatus.INACTIVE);
        user.setVerificationToken(token);

        // SỬA TẠI ĐÂY: Gán trực tiếp LocalDateTime, không dùng Timestamp.valueOf
        user.setTokenExpiresAt(LocalDateTime.now().plusHours(24));

        // Lưu ý: Nếu ở Entity dùng @PrePersist thì không cần dòng dưới này
        // user.setCreatedAt(LocalDateTime.now());

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
}