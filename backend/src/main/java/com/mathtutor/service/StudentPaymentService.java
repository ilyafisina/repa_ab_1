package com.mathtutor.service;

import com.mathtutor.dto.PaymentDTO;
import com.mathtutor.dto.BalanceDTO;
import com.mathtutor.entity.Payment;
import com.mathtutor.entity.User;
import com.mathtutor.repository.PaymentRepository;
import com.mathtutor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentPaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    /**
     * Получить баланс студента
     */
    public BalanceDTO getBalance(String email) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Студент не найден"));

        return BalanceDTO.builder()
                .balance(student.getBalance())
                .build();
    }

    /**
     * Получить историю платежей студента
     */
    public List<PaymentDTO> getPayments(String email) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Студент не найден"));

        List<Payment> payments = paymentRepository.findByStudent_IdOrderByCreatedAtDesc(student.getId());

        return payments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Пополнить баланс студента
     */
    public BalanceDTO addBalance(String email, BigDecimal amount, String description) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Сумма должна быть больше нуля");
        }

        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Студент не найден"));

        // Добавляем средства на баланс
        student.setBalance(student.getBalance().add(amount));
        userRepository.save(student);

        // Записываем платеж как пополнение
        Payment payment = Payment.builder()
                .student(student)
                .amount(amount)
                .direction(Payment.PaymentDirection.credit)
                .status(Payment.PaymentStatus.success)
                .description(description != null ? description : "Пополнение баланса")
                .method("web")
                .createdAt(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);

        return BalanceDTO.builder()
                .balance(student.getBalance())
                .build();
    }

    private PaymentDTO convertToDTO(Payment payment) {
        return PaymentDTO.builder()
                .id(payment.getId())
                .amount(payment.getAmount())
                .createdAt(payment.getCreatedAt())
                .description(payment.getDescription())
                .direction(payment.getDirection().toString())
                .status(payment.getStatus().toString())
                .lessonId(payment.getLesson() != null ? payment.getLesson().getId() : null)
                .studentId(payment.getStudent().getId())
                .build();
    }
}
