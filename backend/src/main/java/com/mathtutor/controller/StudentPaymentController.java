package com.mathtutor.controller;

import com.mathtutor.dto.AddBalanceRequest;
import com.mathtutor.dto.BalanceDTO;
import com.mathtutor.dto.PaymentDTO;
import com.mathtutor.service.StudentPaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
public class StudentPaymentController {

    private final StudentPaymentService studentPaymentService;

    @GetMapping("/balance")
    @PreAuthorize("hasRole('Студент')")
    public ResponseEntity<BalanceDTO> getBalance(Authentication authentication) {
        String email = authentication.getName();
        log.info("💰 GET /api/student/balance called for: {}", email);
        BalanceDTO balance = studentPaymentService.getBalance(email);
        return ResponseEntity.ok(balance);
    }

    @GetMapping("/payments")
    @PreAuthorize("hasRole('Студент')")
    public ResponseEntity<List<PaymentDTO>> getPayments(Authentication authentication) {
        String email = authentication.getName();
        List<PaymentDTO> payments = studentPaymentService.getPayments(email);
        return ResponseEntity.ok(payments);
    }

    @PostMapping("/balance/add")
    @PreAuthorize("hasRole('Студент')")
    public ResponseEntity<BalanceDTO> addBalance(@RequestBody AddBalanceRequest request, Authentication authentication) {
        String email = authentication.getName();
        BalanceDTO balance = studentPaymentService.addBalance(email, request.getAmount(), request.getDescription());
        return ResponseEntity.ok(balance);
    }
}
