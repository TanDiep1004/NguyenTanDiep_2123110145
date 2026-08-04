package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAllUsersAdmin() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success(users, "Lấy danh sách người dùng Admin thành công!"));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<User>> updateUserStatus(@PathVariable Integer id, @RequestParam Integer status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + id));
        user.setStatus(status);
        User updated = userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success(updated, "Cập nhật trạng thái người dùng thành công!"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Integer id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy người dùng với ID: " + id);
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa người dùng thành công!"));
    }
}
