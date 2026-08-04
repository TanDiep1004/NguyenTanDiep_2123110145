package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.entity.Brand;
import com.example.backend.entity.Product;
import com.example.backend.entity.ProductImage;
import com.example.backend.entity.ProductVariant;
import com.example.backend.repository.BrandRepository;
import com.example.backend.repository.ProductImageRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/brands")
@RequiredArgsConstructor
public class AdminBrandController {

    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Brand>>> getAllBrands() {
        List<Brand> brands = brandRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success(brands, "Lấy danh sách Thương hiệu thành công!"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Brand>> createBrand(@RequestBody Brand brand) {
        if (brand.getSlug() == null || brand.getSlug().isEmpty()) {
            brand.setSlug(brand.getName().toLowerCase().replaceAll("[^a-z0-9]", "-"));
        }
        if (brand.getStatus() == null) {
            brand.setStatus(1);
        }
        Brand saved = brandRepository.save(brand);
        return ResponseEntity.ok(ApiResponse.success(saved, "Thêm Thương hiệu mới thành công!"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Brand>> updateBrand(@PathVariable Integer id, @RequestBody Brand req) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Thương hiệu ID: " + id));

        brand.setName(req.getName());
        if (req.getSlug() != null && !req.getSlug().isEmpty()) {
            brand.setSlug(req.getSlug());
        }
        brand.setLogo(req.getLogo());
        brand.setDescription(req.getDescription());
        if (req.getSortOrder() != null) {
            brand.setSortOrder(req.getSortOrder());
        }
        if (req.getStatus() != null) {
            brand.setStatus(req.getStatus());
        }

        Brand updated = brandRepository.save(brand);
        return ResponseEntity.ok(ApiResponse.success(updated, "Cập nhật Thương hiệu thành công!"));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<String>> deleteBrand(@PathVariable Integer id) {
        if (!brandRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "Không tìm thấy Thương hiệu để xóa!"));
        }

        try {
            // Tự động giải phóng các sản phẩm liên quan đến thương hiệu này trước khi xóa
            List<Product> products = productRepository.findByBrandId(id);
            for (Product p : products) {
                List<ProductVariant> variants = productVariantRepository.findByProductId(p.getId());
                productVariantRepository.deleteAll(variants);

                List<ProductImage> images = productImageRepository.findByProductId(p.getId());
                productImageRepository.deleteAll(images);

                productRepository.delete(p);
            }

            brandRepository.deleteById(id);
            return ResponseEntity.ok(ApiResponse.success("Xóa", "Xóa Thương hiệu thành công!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "Không thể xóa thương hiệu: " + e.getMessage()));
        }
    }
}
