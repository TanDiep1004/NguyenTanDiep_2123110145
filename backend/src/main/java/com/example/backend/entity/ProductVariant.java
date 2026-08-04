package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "product_variants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(length = 100)
    private String color;

    @Column(length = 100)
    private String degree;

    @Column(precision = 15, scale = 2)
    private BigDecimal price;

    @Column(name = "stock_quantity", columnDefinition = "INT DEFAULT 0")
    @Builder.Default
    private Integer stockQuantity = 0;

    @Column(columnDefinition = "TINYINT(1) DEFAULT 1")
    @Builder.Default
    private Integer status = 1;
}
