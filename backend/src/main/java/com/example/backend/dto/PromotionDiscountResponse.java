package com.example.backend.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromotionDiscountResponse {
    private String code;
    private String name;
    private String discountType;
    private BigDecimal discountValue;
    private BigDecimal calculatedDiscountAmount;
    private BigDecimal finalAmount;
    private boolean valid;
    private String message;
}
