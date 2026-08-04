package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.entity.Setting;
import com.example.backend.repository.SettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/settings")
@RequiredArgsConstructor
public class PublicSettingController {

    private final SettingRepository settingRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Setting>>> getPublicSettings() {
        List<Setting> settings = settingRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success(settings, "Lấy cấu hình hệ thống công khai thành công!"));
    }
}
