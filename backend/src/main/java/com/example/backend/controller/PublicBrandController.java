package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.entity.Brand;
import com.example.backend.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/brands")
@RequiredArgsConstructor
public class PublicBrandController {

    private final BrandRepository brandRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Brand>>> getAllBrands() {
        List<Brand> brands = brandRepository.findByStatus(1);
        return ResponseEntity.ok(ApiResponse.success(brands, "Lấy danh sách thương hiệu thành công!"));
    }
}
