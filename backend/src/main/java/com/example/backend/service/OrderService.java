package com.example.backend.service;

import com.example.backend.dto.OrderRequest;
import com.example.backend.dto.OrderResponse;

public interface OrderService {
    /**
     * Luồng logic Đặt hàng (Thanh toán)
     * @param request Thông tin đơn hàng từ phía khách hàng
     * @return DTO kết quả đặt hàng
     */
    OrderResponse checkout(OrderRequest request);
}
