package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.entity.Order;
import com.example.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderRepository orderRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrdersAdmin() {
        List<Order> orders = orderRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success(orders, "Lấy danh sách đơn hàng quản trị thành công!"));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable Integer id,
            @RequestParam String status) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + id));

        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);

        return ResponseEntity.ok(ApiResponse.success(updatedOrder, "Cập nhật trạng thái đơn hàng #" + id + " thành '" + status + "' thành công!"));
    }
}
