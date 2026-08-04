package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.entity.Article;
import com.example.backend.repository.ArticleRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/articles")
@RequiredArgsConstructor
public class AdminArticleController {

    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Article>>> getAllArticles() {
        List<Article> articles = articleRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success(articles, "Lấy danh sách Bài viết thành công!"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Article>> createArticle(@RequestBody Article article) {
        if (article.getAuthor() == null) {
            userRepository.findAll().stream().findFirst().ifPresent(article::setAuthor);
        }
        Article saved = articleRepository.save(article);
        return ResponseEntity.ok(ApiResponse.success(saved, "Thêm Bài viết mới thành công!"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Article>> updateArticle(@PathVariable Integer id, @RequestBody Article req) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Bài viết ID: " + id));

        article.setTitle(req.getTitle());
        article.setContent(req.getContent());
        article.setThumbnail(req.getThumbnail());

        Article updated = articleRepository.save(article);
        return ResponseEntity.ok(ApiResponse.success(updated, "Cập nhật Bài viết thành công!"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteArticle(@PathVariable Integer id) {
        if (!articleRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "Không tìm thấy Bài viết để xóa!"));
        }
        articleRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa", "Xóa Bài viết ID " + id + " thành công!"));
    }
}
