package com.example.backend.repository;

import com.example.backend.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Integer> {
    List<Banner> findByStatusOrderByPositionAsc(Integer status);
    List<Banner> findAllByOrderByPositionAsc();
}
