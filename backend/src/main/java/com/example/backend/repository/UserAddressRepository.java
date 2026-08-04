package com.example.backend.repository;

import com.example.backend.entity.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAddressRepository extends JpaRepository<UserAddress, Integer> {
    
    // Tìm toàn bộ sổ địa chỉ của một khách hàng
    List<UserAddress> findByUserId(Integer userId);
    
    // Tìm địa chỉ mặc định của một khách hàng
    Optional<UserAddress> findByUserIdAndIsDefaultTrue(Integer userId);
}
