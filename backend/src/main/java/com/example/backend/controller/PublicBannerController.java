package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.entity.Banner;
import com.example.backend.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/banners")
@RequiredArgsConstructor
public class PublicBannerController {

    private final BannerRepository bannerRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Banner>>> getPublicBanners() {
        List<Banner> banners = bannerRepository.findByStatusOrderByPositionAsc(1);
        return ResponseEntity.ok(ApiResponse.success(banners, "Lấy danh sách Banner thành công!"));
    }
}
