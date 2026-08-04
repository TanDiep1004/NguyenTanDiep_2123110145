package com.example.backend.service.impl;

import com.example.backend.dto.ApplyPromotionRequest;
import com.example.backend.dto.OrderItemRequest;
import com.example.backend.dto.OrderRequest;
import com.example.backend.dto.OrderResponse;
import com.example.backend.dto.PromotionDiscountResponse;
import com.example.backend.entity.*;
import com.example.backend.repository.*;
import com.example.backend.service.OrderService;
import com.example.backend.service.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PromotionRepository promotionRepository;
    private final PromotionService promotionService;

    @Override
    @Transactional
    public OrderResponse checkout(OrderRequest request) {
        // 1. Nhận danh sách các món hàng khách muốn mua và thông tin người nhận, địa chỉ giao hàng
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Giỏ hàng rỗng, không thể thực hiện đặt hàng!");
        }

        // Tìm User (nếu có)
        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId()).orElse(null);
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<Integer> productIds = new ArrayList<>();
        List<ProductVariant> variantsToUpdate = new ArrayList<>();
        List<OrderItemRequest> validItems = request.getItems();

        // 2. Chạy vòng lặp kiểm tra từng món: Kho còn đủ số lượng (stock_quantity) để bán không?
        for (OrderItemRequest item : validItems) {
            ProductVariant variant = productVariantRepository.findById(item.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Biến thể sản phẩm ID " + item.getVariantId() + " không tồn tại!"));

            // Kiểm tra trạng thái bán
            if (variant.getStatus() == null || variant.getStatus() != 1) {
                throw new RuntimeException("Sản phẩm biến thể ID " + variant.getId() + " đã ngừng kinh doanh!");
            }

            // Kiểm tra tồn kho
            if (variant.getStockQuantity() < item.getQuantity()) {
                throw new RuntimeException("Sản phẩm '" + variant.getProduct().getName() + "' (ID: " + variant.getId()
                        + ") không đủ số lượng tồn kho để bán (Còn tồn: " + variant.getStockQuantity()
                        + ", Số lượng yêu cầu: " + item.getQuantity() + ")!");
            }

            // Tính tiền gốc của món hàng
            BigDecimal itemPrice = variant.getPrice() != null ? variant.getPrice() : BigDecimal.ZERO;
            BigDecimal itemSubtotal = itemPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
            totalAmount = totalAmount.add(itemSubtotal);

            // Lưu danh sách productId để áp dụng khuyến mãi
            if (variant.getProduct() != null && !productIds.contains(variant.getProduct().getId())) {
                productIds.add(variant.getProduct().getId());
            }

            variantsToUpdate.add(variant);
        }

        // 3. Tính tổng tiền: (Giá từng biến thể x Số lượng) - Số tiền khuyến mãi
        BigDecimal discountAmount = BigDecimal.ZERO;
        Promotion appliedPromotion = null;

        if (request.getPromotionCode() != null && !request.getPromotionCode().trim().isEmpty()) {
            ApplyPromotionRequest promoReq = ApplyPromotionRequest.builder()
                    .code(request.getPromotionCode())
                    .productIds(productIds)
                    .orderSubtotal(totalAmount)
                    .build();

            PromotionDiscountResponse promoResp = promotionService.applyPromotion(promoReq);
            discountAmount = promoResp.getCalculatedDiscountAmount();

            appliedPromotion = promotionRepository.findByCode(request.getPromotionCode()).orElse(null);
        }

        BigDecimal finalAmount = totalAmount.subtract(discountAmount);
        if (finalAmount.compareTo(BigDecimal.ZERO) < 0) {
            finalAmount = BigDecimal.ZERO;
        }

        // 4. Lưu thông tin chung vào bảng Đơn hàng (orders)
        Order order = Order.builder()
                .user(user)
                .promotion(appliedPromotion)
                .receiverName(request.getReceiverName())
                .receiverPhone(request.getReceiverPhone())
                .shippingAddress(request.getShippingAddress())
                .paymentMethod(request.getPaymentMethod())
                .totalAmount(totalAmount)
                .discountAmount(discountAmount)
                .finalAmount(finalAmount)
                .status("Pending")
                .build();

        Order savedOrder = orderRepository.save(order);

        // 5. Lưu chi tiết từng món vào bảng Chi tiết đơn hàng (order_details) & 6. Trừ đi số lượng tồn kho trong database
        for (int i = 0; i < validItems.size(); i++) {
            OrderItemRequest item = validItems.get(i);
            ProductVariant variant = variantsToUpdate.get(i);

            // Lưu OrderDetail
            BigDecimal unitPrice = variant.getPrice() != null ? variant.getPrice() : BigDecimal.ZERO;
            OrderDetail orderDetail = OrderDetail.builder()
                    .order(savedOrder)
                    .variant(variant)
                    .quantity(item.getQuantity())
                    .unitPrice(unitPrice)
                    .build();

            orderDetailRepository.save(orderDetail);

            // Trừ số lượng tồn kho (stock_quantity)
            variant.setStockQuantity(variant.getStockQuantity() - item.getQuantity());
            productVariantRepository.save(variant);
        }

        // 7. Xóa giỏ hàng cũ của khách
        if (user != null) {
            cartRepository.deleteByUserId(user.getId());
        }

        // 8. Trả về thông báo Đặt hàng thành công
        return OrderResponse.builder()
                .orderId(savedOrder.getId())
                .totalAmount(totalAmount)
                .discountAmount(discountAmount)
                .finalAmount(finalAmount)
                .status(savedOrder.getStatus())
                .createdAt(savedOrder.getCreatedAt())
                .message("Đặt hàng thành công! Mã đơn hàng của bạn là #" + savedOrder.getId())
                .build();
    }
}
