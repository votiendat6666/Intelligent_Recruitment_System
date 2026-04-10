package com.SmartRecruit.backend_springboot.security;

import com.SmartRecruit.backend_springboot.entity.User;
import com.SmartRecruit.backend_springboot.entity.enums.UserStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;

public class CandidateUserDetails implements UserDetails {
    private final User user;

    public CandidateUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

    @Override
    public String getPassword() {
        // Đổi từ getPasswordHash() sang getPassword()
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() {
        // Thay vì dùng isActive, hãy check UserStatus cho chuyên nghiệp
        return user.getStatus() != UserStatus.LOCKED;
    }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() {
        // Tài khoản chỉ được enable khi đã xác thực email
        return user.isVerified();
    }
}