package com.SmartRecruit.backend_springboot.repository;

import com.SmartRecruit.backend_springboot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    // Thêm dòng này để hết lỗi trong UserService
    Optional<User> findByVerificationToken(String token);
}