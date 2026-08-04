package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.entity.Cart;
import com.example.backend.entity.ProductVariant;
import com.example.backend.repository.CartRepository;
import com.example.backend.repository.ProductVariantRepository;
import com.example.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/cart")
@RequiredArgsConstructor
public class CustomerCartController {

    private final CartRepository cartRepository;
    private final ProductVariantRepository productVariantRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Cart>>> getMyCart(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null || userDetails.getUser() == null) {
            throw new RuntimeException("Bạn cần đăng nhập để xem giỏ hàng!");
        }
        List<Cart> cartItems = cartRepository.findByUserId(userDetails.getUser().getId());
        return ResponseEntity.ok(ApiResponse.success(cartItems, "Lấy giỏ hàng thành công!"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Cart>> addToCart(
            @RequestParam Integer variantId,
            @RequestParam(defaultValue = "1") Integer quantity,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        if (userDetails == null || userDetails.getUser() == null) {
            throw new RuntimeException("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
        }

        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy biến thể sản phẩm với ID: " + variantId));

        Cart cart = Cart.builder()
                .user(userDetails.getUser())
                .variant(variant)
                .quantity(quantity)
                .build();

        Cart savedCart = cartRepository.save(cart);
        return ResponseEntity.ok(ApiResponse.success(savedCart, "Đã thêm sản phẩm vào giỏ hàng thành công!"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> removeFromCart(
            @PathVariable Integer id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        cartRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Đã xóa sản phẩm khỏi giỏ hàng thành công!"));
    }
}
