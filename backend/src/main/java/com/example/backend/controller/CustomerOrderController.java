package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.OrderRequest;
import com.example.backend.dto.OrderResponse;
import com.example.backend.entity.Order;
import com.example.backend.repository.OrderRepository;
import com.example.backend.security.CustomUserDetails;
import com.example.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/orders")
@RequiredArgsConstructor
public class CustomerOrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> checkout(
            @RequestBody OrderRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        if (userDetails != null && userDetails.getUser() != null) {
            request.setUserId(userDetails.getUser().getId());
        }

        OrderResponse response = orderService.checkout(request);
        return ResponseEntity.ok(ApiResponse.success(response, response.getMessage()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Order>>> getMyOrders(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null || userDetails.getUser() == null) {
            throw new RuntimeException("Bạn cần đăng nhập để xem lịch sử đơn hàng!");
        }
        List<Order> orders = orderRepository.findByUserId(userDetails.getUser().getId());
        return ResponseEntity.ok(ApiResponse.success(orders, "Lấy danh sách đơn hàng thành công!"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> getOrderById(
            @PathVariable Integer id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null || userDetails.getUser() == null) {
            throw new RuntimeException("Bạn cần đăng nhập để xem đơn hàng!");
        }
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng!"));
                
        if (!order.getUser().getId().equals(userDetails.getUser().getId())) {
            throw new RuntimeException("Bạn không có quyền xem đơn hàng này!");
        }
        
        return ResponseEntity.ok(ApiResponse.success(order, "Lấy chi tiết đơn hàng thành công!"));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Order>> cancelOrder(
            @PathVariable Integer id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null || userDetails.getUser() == null) {
            throw new RuntimeException("Bạn cần đăng nhập để thao tác!");
        }
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng!"));
                
        if (!order.getUser().getId().equals(userDetails.getUser().getId())) {
            throw new RuntimeException("Bạn không có quyền hủy đơn hàng này!");
        }
        
        if (!"Pending".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Chỉ có thể hủy đơn hàng khi ở trạng thái Chờ xác nhận!");
        }
        
        order.setStatus("Cancelled");
        orderRepository.save(order);
        
        return ResponseEntity.ok(ApiResponse.success(order, "Đã hủy đơn hàng thành công!"));
    }
}
