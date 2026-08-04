package com.example.backend.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequest {
    private Integer userId;
    private Integer addressId;
    private String paymentMethod;
    private String promotionCode;
    private List<OrderItemRequest> items;
}
