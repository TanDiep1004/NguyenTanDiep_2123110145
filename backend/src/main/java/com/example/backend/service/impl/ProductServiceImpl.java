package com.example.backend.service.impl;

import com.example.backend.dto.ProductDetailResponse;
import com.example.backend.entity.Product;
import com.example.backend.entity.ProductImage;
import com.example.backend.entity.ProductVariant;
import com.example.backend.repository.ProductImageRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ProductVariantRepository;
import com.example.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductVariantRepository productVariantRepository;

    @Override
    @Transactional(readOnly = true)
    public ProductDetailResponse getProductDetail(Integer productId) {
        // 1 & 2. Gọi Repository lấy thông tin gốc của sản phẩm ID
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + productId));

        // 3. Gọi Repository lấy danh sách toàn bộ hình ảnh của sản phẩm ID
        List<ProductImage> images = productImageRepository.findByProductId(productId);

        // 4. Gọi Repository lấy danh sách các biến thể (Màu sắc, độ cận, giá, tồn kho) của sản phẩm ID
        List<ProductVariant> variants = productVariantRepository.findByProductId(productId);

        // 5 & 6. Gom tất cả dữ liệu trên vào một "gói hàng" duy nhất và trả ra ngoài
        return ProductDetailResponse.builder()
                .product(product)
                .images(images)
                .variants(variants)
                .build();
    }
}
