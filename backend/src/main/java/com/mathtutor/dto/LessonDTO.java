package com.mathtutor.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonDTO {
    private Long id;
    private String subject;
    private String topic;
    private LocalDateTime lessonDate;
    private Integer durationMin;
    private String format;
    private String location;
    private String onlineLink;
    private BigDecimal price;
    @JsonProperty("isPaid")
    private boolean isPaid;
    private String status;
    private Long tutorId;
    private String tutorName;
    private String tutorPhone;
    private Long studentId;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
