package com.example.backend.service;

import com.example.backend.dto.ApplyPromotionRequest;
import com.example.backend.dto.PromotionDiscountResponse;

public interface PromotionService {
    /**
     * Luồng logic áp dụng Mã khuyến mãi
     * @param request Thông tin mã khuyến mãi, tổng tiền đơn hàng và danh sách ID sản phẩm
     * @return DTO kết quả tính toán giảm giá
     */
    PromotionDiscountResponse applyPromotion(ApplyPromotionRequest request);
}
