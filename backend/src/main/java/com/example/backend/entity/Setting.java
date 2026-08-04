package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Setting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "key_name", nullable = false, unique = true, length = 100)
    private String keyName;

    @Column(name = "key_value", columnDefinition = "LONGTEXT", nullable = false)
    private String keyValue;
}
