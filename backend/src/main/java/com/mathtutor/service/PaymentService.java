package com.mathtutor.service;

import com.mathtutor.entity.Payment;
import com.mathtutor.entity.User;
import com.mathtutor.entity.Lesson;
import com.mathtutor.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;

    /**
     * Создать платеж (расход)
     */
    public Payment createPayment(User student, Lesson lesson, BigDecimal amount, String description) {
        Payment payment = Payment.builder()
                .student(student)
                .lesson(lesson)
                .amount(amount)
                .direction(Payment.PaymentDirection.debit)
                .status(Payment.PaymentStatus.success)
                .description(description)
                .method("balance")
                .createdAt(LocalDateTime.now())
                .build();

        return paymentRepository.save(payment);
    }

    /**
     * Создать платеж (пополнение)
     */
    public Payment createCreditPayment(User student, BigDecimal amount, String description) {
        Payment payment = Payment.builder()
                .student(student)
                .amount(amount)
                .direction(Payment.PaymentDirection.credit)
                .status(Payment.PaymentStatus.success)
                .description(description)
                .method("web")
                .createdAt(LocalDateTime.now())
                .build();

        return paymentRepository.save(payment);
    }
}
