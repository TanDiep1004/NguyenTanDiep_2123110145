package com.example.backend.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplyPromotionRequest {
    private String code;
    private List<Integer> productIds;
    private BigDecimal orderSubtotal;
}
