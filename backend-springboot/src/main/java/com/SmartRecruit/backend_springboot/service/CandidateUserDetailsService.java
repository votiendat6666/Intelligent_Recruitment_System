package com.SmartRecruit.backend_springboot.service;

import com.SmartRecruit.backend_springboot.repository.UserRepository;
import com.SmartRecruit.backend_springboot.security.CandidateUserDetails;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
// Đã đổi tên class thành CandidateUserDetailsService
public class CandidateUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public CandidateUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .map(CandidateUserDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng: " + email));
    }
}