package com.mathtutor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HomeworkDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private String status;
    private Byte grade;
    private String studentAnswer;
    private LocalDateTime submittedAt;
    private String tutorComment;
    private LocalDateTime checkedAt;
    private Long lessonId;
    private Long studentId;
    private Long tutorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<HomeworkFileDTO> attachments;
    private List<HomeworkFileDTO> studentWork;
    private List<Long> materialIds; // ID материалов для прикрепления

    // Дополнительная информация для отображения
    private String subject;
    private String tutorName;
    private LocalDateTime lessonDate;
    private String lessonTopic;
    private LocalDate assignedDate;
}
