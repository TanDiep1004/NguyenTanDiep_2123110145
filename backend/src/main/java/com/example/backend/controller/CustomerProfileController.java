package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.entity.User;
import com.example.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/profile")
@RequiredArgsConstructor
public class CustomerProfileController {

    @GetMapping
    public ResponseEntity<ApiResponse<User>> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null || userDetails.getUser() == null) {
            throw new RuntimeException("Bạn chưa đăng nhập!");
        }
        User user = userDetails.getUser();
        // Không trả về password hash vì lý do bảo mật
        user.setPassword(null);
        return ResponseEntity.ok(ApiResponse.success(user, "Lấy thông tin cá nhân thành công!"));
    }
}
