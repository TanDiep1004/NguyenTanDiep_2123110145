package com.example.backend.service;

import com.example.backend.dto.ProductDetailResponse;

public interface ProductService {
    /**
     * Luồng logic hiển thị Chi tiết Sản phẩm
     * @param productId Mã sản phẩm cần lấy thông tin
     * @return DTO chứa thông tin sản phẩm, hình ảnh và danh sách biến thể
     */
    ProductDetailResponse getProductDetail(Integer productId);
}
