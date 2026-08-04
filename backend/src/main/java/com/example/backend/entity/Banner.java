package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "banners")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 100)
    private String title;

    @Column(name = "image_url", nullable = false, columnDefinition = "LONGTEXT")
    private String imageUrl;

    @Column(length = 255)
    private String link;

    @Column(columnDefinition = "INT DEFAULT 0")
    @Builder.Default
    private Integer position = 0;

    @Column(columnDefinition = "TINYINT(1) DEFAULT 1")
    @Builder.Default
    private Integer status = 1;
}
