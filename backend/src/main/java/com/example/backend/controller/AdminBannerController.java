package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.entity.Banner;
import com.example.backend.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/banners")
@RequiredArgsConstructor
public class AdminBannerController {

    private final BannerRepository bannerRepository;

    // 1. Lấy danh sách tất cả Banner
    @GetMapping
    public ResponseEntity<ApiResponse<List<Banner>>> getAllBanners() {
        List<Banner> banners = bannerRepository.findAllByOrderByPositionAsc();
        return ResponseEntity.ok(ApiResponse.success(banners, "Lấy danh sách Banner Admin thành công!"));
    }

    // 2. Thêm Banner mới (Create)
    @PostMapping
    public ResponseEntity<ApiResponse<Banner>> createBanner(@RequestBody Banner banner) {
        if (banner.getStatus() == null) {
            banner.setStatus(1);
        }
        if (banner.getPosition() == null) {
            banner.setPosition(0);
        }
        Banner savedBanner = bannerRepository.save(banner);
        return ResponseEntity.ok(ApiResponse.success(savedBanner, "Thêm Banner mới thành công!"));
    }

    // 3. Cập nhật Banner (Update)
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Banner>> updateBanner(@PathVariable Integer id, @RequestBody Banner bannerReq) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Banner với ID: " + id));

        banner.setTitle(bannerReq.getTitle());
        banner.setImageUrl(bannerReq.getImageUrl());
        banner.setLink(bannerReq.getLink());
        if (bannerReq.getPosition() != null) {
            banner.setPosition(bannerReq.getPosition());
        }
        if (bannerReq.getStatus() != null) {
            banner.setStatus(bannerReq.getStatus());
        }

        Banner updatedBanner = bannerRepository.save(banner);
        return ResponseEntity.ok(ApiResponse.success(updatedBanner, "Cập nhật Banner thành công!"));
    }

    // 4. Xóa Banner (Delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteBanner(@PathVariable Integer id) {
        if (!bannerRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "Không tìm thấy Banner để xóa!"));
        }
        bannerRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa", "Xóa Banner ID " + id + " thành công!"));
    }
}
