package com.example.backend.service.impl;

import com.example.backend.dto.ApplyPromotionRequest;
import com.example.backend.dto.PromotionDiscountResponse;
import com.example.backend.entity.Promotion;
import com.example.backend.repository.PromotionProductRepository;
import com.example.backend.repository.PromotionRepository;
import com.example.backend.service.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;
    private final PromotionProductRepository promotionProductRepository;

    @Override
    @Transactional(readOnly = true)
    public PromotionDiscountResponse applyPromotion(ApplyPromotionRequest request) {
        // 1 & 2. Nhận mã khách nhập & kiểm tra tồn tại trong bảng promotions
        Promotion promotion = promotionRepository.findByCode(request.getCode())
                .orElseThrow(() -> new RuntimeException("Mã khuyến mãi không tồn tại!"));

        // Kiểm tra trạng thái kích hoạt
        if (promotion.getStatus() == null || promotion.getStatus() != 1) {
            throw new RuntimeException("Mã khuyến mãi hiện đang bị tạm dừng!");
        }

        // 3. Kiểm tra thời gian hiện tại có nằm trong khoảng start_datetime và end_datetime không
        LocalDateTime now = LocalDateTime.now();
        if (promotion.getStartDatetime() != null && now.isBefore(promotion.getStartDatetime().minusMinutes(5))) {
            throw new RuntimeException("Mã khuyến mãi chưa tới đợt áp dụng!");
        }
        if (promotion.getEndDatetime() != null && now.isAfter(promotion.getEndDatetime())) {
            throw new RuntimeException("Mã khuyến mãi đã hết hạn!");
        }

        // 4. Kiểm tra mã áp dụng cho toàn shop ('all') hay sản phẩm cụ thể ('specific')
        if ("specific".equalsIgnoreCase(promotion.getApplyTo())) {
            boolean hasApplicableProduct = false;
            if (request.getProductIds() != null && !request.getProductIds().isEmpty()) {
                for (Integer productId : request.getProductIds()) {
                    if (promotionProductRepository.existsByPromotionIdAndProductId(promotion.getId(), productId)) {
                        hasApplicableProduct = true;
                        break;
                    }
                }
            }
            if (!hasApplicableProduct) {
                throw new RuntimeException("Mã khuyến mãi không áp dụng cho sản phẩm nào trong giỏ hàng!");
            }
        }

        // 5. Hợp lệ -> Tính toán số tiền được giảm
        BigDecimal subtotal = request.getOrderSubtotal() != null ? request.getOrderSubtotal() : BigDecimal.ZERO;
        BigDecimal calculatedDiscount = BigDecimal.ZERO;

        if ("percent".equalsIgnoreCase(promotion.getDiscountType())) {
            calculatedDiscount = subtotal.multiply(promotion.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else if ("fixed".equalsIgnoreCase(promotion.getDiscountType())) {
            calculatedDiscount = promotion.getDiscountValue();
        }

        // Không cho phép tiền giảm vượt quá tổng tiền gốc
        if (calculatedDiscount.compareTo(subtotal) > 0) {
            calculatedDiscount = subtotal;
        }

        BigDecimal finalAmount = subtotal.subtract(calculatedDiscount);

        return PromotionDiscountResponse.builder()
                .code(promotion.getCode())
                .name(promotion.getName())
                .discountType(promotion.getDiscountType())
                .discountValue(promotion.getDiscountValue())
                .calculatedDiscountAmount(calculatedDiscount)
                .finalAmount(finalAmount)
                .valid(true)
                .message("Áp dụng mã khuyến mãi thành công!")
                .build();
    }
}
