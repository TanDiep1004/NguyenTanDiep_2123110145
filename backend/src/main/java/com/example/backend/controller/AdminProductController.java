package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.entity.Brand;
import com.example.backend.entity.Category;
import com.example.backend.entity.Product;
import com.example.backend.entity.ProductImage;
import com.example.backend.entity.ProductVariant;
import com.example.backend.repository.BrandRepository;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ProductImageRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ProductVariantRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    private final JdbcTemplate jdbcTemplate;

    @Data
    public static class ImageDto {
        private String imageUrl;
        private Integer isPrimary;
    }

    @Data
    public static class VariantDto {
        private String color;
        private String degree;
        private BigDecimal price;
        private Integer stockQuantity;
        private Integer status;
    }

    @Data
    public static class CreateProductDto {
        private String name;
        private BigDecimal price;
        private BigDecimal originalPrice;
        private String description;
        private String content;
        private Integer categoryId;
        private Integer brandId;
        private Integer status;
        private List<ImageDto> images;
        private List<VariantDto> variants;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Product>>> getAllProductsAdmin() {
        List<Product> products = productRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success(products, "Lấy danh sách tất cả sản phẩm (Admin) thành công!"));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<ApiResponse<Product>> createProduct(@RequestBody CreateProductDto dto) {
        BigDecimal basePrice = dto.getPrice() != null ? dto.getPrice() : new BigDecimal("1500000");
        BigDecimal origPrice = dto.getOriginalPrice() != null ? dto.getOriginalPrice() : basePrice.multiply(new BigDecimal("1.25"));

        Product product = Product.builder()
                .name(dto.getName())
                .price(basePrice)
                .originalPrice(origPrice)
                .description(dto.getDescription())
                .content(dto.getContent())
                .status(dto.getStatus() != null ? dto.getStatus() : 1)
                .build();

        if (dto.getCategoryId() != null) {
            categoryRepository.findById(dto.getCategoryId()).ifPresent(product::setCategory);
        }
        if (dto.getBrandId() != null) {
            brandRepository.findById(dto.getBrandId()).ifPresent(product::setBrand);
        }

        Product savedProduct = productRepository.save(product);

        // Lưu danh sách hình ảnh vào product_images
        if (dto.getImages() != null && !dto.getImages().isEmpty()) {
            for (ImageDto imgDto : dto.getImages()) {
                ProductImage img = ProductImage.builder()
                        .product(savedProduct)
                        .imageUrl(imgDto.getImageUrl())
                        .isPrimary(imgDto.getIsPrimary() != null ? imgDto.getIsPrimary() : 0)
                        .build();
                productImageRepository.save(img);
            }
        } else {
            ProductImage img = ProductImage.builder()
                    .product(savedProduct)
                    .imageUrl("https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800")
                    .isPrimary(1)
                    .build();
            productImageRepository.save(img);
        }

        // Lưu danh sách biến thể với màu sắc, độ cận và giá tiền vào product_variants
        if (dto.getVariants() != null && !dto.getVariants().isEmpty()) {
            for (VariantDto vDto : dto.getVariants()) {
                BigDecimal variantPrice = vDto.getPrice() != null && vDto.getPrice().compareTo(BigDecimal.ZERO) > 0 ? vDto.getPrice() : basePrice;
                ProductVariant v = ProductVariant.builder()
                        .product(savedProduct)
                        .color(vDto.getColor() != null ? vDto.getColor() : "Đen Nhám")
                        .degree(vDto.getDegree() != null ? vDto.getDegree() : "0.00 (Không độ)")
                        .price(variantPrice)
                        .stockQuantity(vDto.getStockQuantity() != null ? vDto.getStockQuantity() : 50)
                        .status(1)
                        .build();
                productVariantRepository.save(v);
            }
        } else {
            ProductVariant v = ProductVariant.builder()
                    .product(savedProduct)
                    .color("Đen Nhám")
                    .degree("0.00 (Không độ)")
                    .price(basePrice)
                    .stockQuantity(50)
                    .status(1)
                    .build();
            productVariantRepository.save(v);
        }

        return ResponseEntity.ok(ApiResponse.success(savedProduct, "Thêm sản phẩm mới thành công!"));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<Product>> updateProduct(@PathVariable Integer id, @RequestBody CreateProductDto dto) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));

        existingProduct.setName(dto.getName());
        if (dto.getPrice() != null) {
            existingProduct.setPrice(dto.getPrice());
        }
        if (dto.getOriginalPrice() != null) {
            existingProduct.setOriginalPrice(dto.getOriginalPrice());
        }
        existingProduct.setDescription(dto.getDescription());
        existingProduct.setContent(dto.getContent());
        if (dto.getStatus() != null) {
            existingProduct.setStatus(dto.getStatus());
        }
        if (dto.getCategoryId() != null) {
            Category cat = categoryRepository.findById(dto.getCategoryId()).orElse(null);
            if (cat != null) existingProduct.setCategory(cat);
        }
        if (dto.getBrandId() != null) {
            Brand brand = brandRepository.findById(dto.getBrandId()).orElse(null);
            if (brand != null) existingProduct.setBrand(brand);
        }

        Product updatedProduct = productRepository.save(existingProduct);
        return ResponseEntity.ok(ApiResponse.success(updatedProduct, "Cập nhật thông tin sản phẩm thành công!"));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Integer id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy sản phẩm với ID: " + id);
        }

        // 1. Xóa các bảng liên kết Foreign Key trước khi xóa sản phẩm
        try {
            jdbcTemplate.update("DELETE FROM promotion_products WHERE product_id = ?", id);
            jdbcTemplate.update("DELETE FROM cart_items WHERE product_id = ?", id);
            jdbcTemplate.update("DELETE FROM reviews WHERE product_id = ?", id);
        } catch (Exception e) {
            System.err.println("Lỗi khi xóa bảng phụ thuộc: " + e.getMessage());
        }

        // 2. Xóa các biến thể và hình ảnh
        List<ProductVariant> variants = productVariantRepository.findByProductId(id);
        productVariantRepository.deleteAll(variants);

        List<ProductImage> images = productImageRepository.findByProductId(id);
        productImageRepository.deleteAll(images);

        // 3. Xóa sản phẩm
        productRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa sản phẩm thành công!"));
    }
}
