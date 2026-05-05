package com.mathtutor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UserDTO {

    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private String role;
    private Byte grade;
    private BigDecimal balance;
    private Boolean active;
    private String avatarPath;
    private Long tutorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
