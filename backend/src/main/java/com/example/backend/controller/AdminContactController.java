package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.entity.Contact;
import com.example.backend.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/contacts")
@RequiredArgsConstructor
public class AdminContactController {

    private final ContactRepository contactRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Contact>>> getAllContacts() {
        List<Contact> contacts = contactRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success(contacts, "Lấy danh sách Liên hệ thành công!"));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Contact>> updateStatus(@PathVariable Integer id, @RequestParam String status) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Liên hệ ID: " + id));

        contact.setStatus(status);
        Contact updated = contactRepository.save(contact);
        return ResponseEntity.ok(ApiResponse.success(updated, "Cập nhật trạng thái Liên hệ thành công!"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteContact(@PathVariable Integer id) {
        if (!contactRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "Không tìm thấy Liên hệ để xóa!"));
        }
        contactRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa", "Xóa Liên hệ ID " + id + " thành công!"));
    }
}
