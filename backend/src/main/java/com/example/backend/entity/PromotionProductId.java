package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromotionProductId implements Serializable {

    @Column(name = "promotion_id")
    private Integer promotionId;

    @Column(name = "product_id")
    private Integer productId;
}
