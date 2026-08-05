package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.entity.Contact;
import com.example.backend.repository.ContactRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/contacts")
@RequiredArgsConstructor
public class PublicContactController {

    private final ContactRepository contactRepository;

    @Data
    public static class ContactRequest {
        private String customerName;
        private String email;
        private String phone;
        private String message;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Contact>> submitContact(@RequestBody ContactRequest request) {
        if (request.getCustomerName() == null || request.getCustomerName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "Vui lòng nhập họ và tên."));
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "Vui lòng nhập email."));
        }
        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "Vui lòng nhập nội dung liên hệ."));
        }

        Contact contact = Contact.builder()
                .customerName(request.getCustomerName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .message(request.getMessage())
                .status("Unread") // Default status
                .build();

        Contact saved = contactRepository.save(contact);
        return ResponseEntity.ok(ApiResponse.success(saved, "Gửi liên hệ thành công. Chúng tôi sẽ phản hồi sớm nhất!"));
    }
}
