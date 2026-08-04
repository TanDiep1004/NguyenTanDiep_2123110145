package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.ApplyPromotionRequest;
import com.example.backend.dto.PromotionDiscountResponse;
import com.example.backend.entity.Promotion;
import com.example.backend.repository.PromotionRepository;
import com.example.backend.service.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/promotions")
@RequiredArgsConstructor
public class PublicPromotionController {

    private final PromotionService promotionService;
    private final PromotionRepository promotionRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Promotion>>> getActivePromotions() {
        List<Promotion> promotions = promotionRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success(promotions, "Lấy danh sách khuyến mãi thành công!"));
    }

    @PostMapping("/apply")
    public ResponseEntity<ApiResponse<PromotionDiscountResponse>> applyPromotion(@RequestBody ApplyPromotionRequest request) {
        PromotionDiscountResponse response = promotionService.applyPromotion(request);
        return ResponseEntity.ok(ApiResponse.success(response, response.getMessage()));
    }
}
