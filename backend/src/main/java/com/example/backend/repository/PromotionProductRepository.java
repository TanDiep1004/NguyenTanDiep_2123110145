package com.example.backend.repository;

import com.example.backend.entity.PromotionProduct;
import com.example.backend.entity.PromotionProductId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromotionProductRepository extends JpaRepository<PromotionProduct, PromotionProductId> {
    List<PromotionProduct> findByPromotionId(Integer promotionId);
    boolean existsByPromotionIdAndProductId(Integer promotionId, Integer productId);
}
