package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.entity.Setting;
import com.example.backend.repository.SettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/settings")
@RequiredArgsConstructor
public class AdminSettingController {

    private final SettingRepository settingRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Setting>>> getAllSettings() {
        List<Setting> settings = settingRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success(settings, "Lấy Cấu hình hệ thống thành công!"));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<List<Setting>>> updateSettings(@RequestBody List<Setting> settings) {
        for (Setting s : settings) {
            if (s.getKeyName() != null) {
                Setting existing = settingRepository.findByKeyName(s.getKeyName())
                        .orElse(Setting.builder().keyName(s.getKeyName()).keyValue("").build());
                existing.setKeyValue(s.getKeyValue());
                settingRepository.save(existing);
            }
        }
        List<Setting> updated = settingRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success(updated, "Cập nhật Cấu hình hệ thống thành công!"));
    }
}
