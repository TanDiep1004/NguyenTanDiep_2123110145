package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.entity.Article;
import com.example.backend.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/articles")
@RequiredArgsConstructor
public class PublicArticleController {

    private final ArticleRepository articleRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Article>>> getPublicArticles() {
        List<Article> articles = articleRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success(articles, "Lấy danh sách bài viết thành công!"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Article>> getArticleById(@PathVariable Integer id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết với ID: " + id));
        return ResponseEntity.ok(ApiResponse.success(article, "Lấy chi tiết bài viết thành công!"));
    }
}
