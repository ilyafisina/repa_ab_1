package com.mathtutor.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AuthResponse {

    private String token;
    private String type;
    private Long userId;
    private String email;
    private String fullName;
    private String role;
    private Byte grade;
    private String phone;
    private String message;

    public AuthResponse(String token, Long userId, String email, String fullName, String role, Byte grade, String phone) {
        this.token = token;
        this.type = "Bearer";
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.grade = grade;
        this.phone = phone;
    }
}
