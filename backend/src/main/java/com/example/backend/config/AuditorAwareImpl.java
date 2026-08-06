package com.example.backend.config;

import com.example.backend.entity.User;
import com.example.backend.security.CustomUserDetails;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component("auditorProvider")
public class AuditorAwareImpl implements AuditorAware<User> {

    @Override
    public Optional<User> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return Optional.empty();
        }
        
        try {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            return Optional.ofNullable(userDetails.getUser());
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
