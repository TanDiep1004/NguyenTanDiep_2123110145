package com.example.backend.controller;

import com.example.backend.entity.User;
import com.example.backend.entity.UserAddress;
import com.example.backend.repository.UserAddressRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-addresses")
@RequiredArgsConstructor
public class UserAddressController {

    private final UserAddressRepository userAddressRepository;
    private final UserRepository userRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserAddress>> getUserAddresses(@PathVariable Integer userId) {
        return ResponseEntity.ok(userAddressRepository.findByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<?> addAddress(@RequestBody UserAddress request) {
        if (request.getUser() == null || request.getUser().getId() == null) {
            return ResponseEntity.badRequest().body("User ID is required");
        }
        
        User user = userRepository.findById(request.getUser().getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        
        request.setUser(user);
        
        // If this is the first address or set to default, ensure others are not default
        List<UserAddress> existingAddresses = userAddressRepository.findByUserId(user.getId());
        if (existingAddresses.isEmpty() || (request.getIsDefault() != null && request.getIsDefault())) {
            for (UserAddress addr : existingAddresses) {
                if (addr.getIsDefault() != null && addr.getIsDefault()) {
                    addr.setIsDefault(false);
                    userAddressRepository.save(addr);
                }
            }
            request.setIsDefault(true);
        } else {
            request.setIsDefault(false);
        }

        UserAddress saved = userAddressRepository.save(request);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<?> setDefaultAddress(@PathVariable Integer id) {
        UserAddress address = userAddressRepository.findById(id).orElse(null);
        if (address == null) {
            return ResponseEntity.badRequest().body("Address not found");
        }

        // Unset all other default addresses for this user
        List<UserAddress> existingAddresses = userAddressRepository.findByUserId(address.getUser().getId());
        for (UserAddress addr : existingAddresses) {
            if (addr.getIsDefault() != null && addr.getIsDefault()) {
                addr.setIsDefault(false);
                userAddressRepository.save(addr);
            }
        }

        // Set the chosen one as default
        address.setIsDefault(true);
        userAddressRepository.save(address);

        return ResponseEntity.ok(address);
    }
}
