package com.mathtutor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialDTO {
    private Long id;
    private String title;
    private String description;
    private String materialType;
    private String subject;
    private boolean isVisible;
    private Integer fileSizeKb;
    private String fileType;
    private String externalUrl;
    private String content;
    private String originalName;
    private String storedPath;
    private Long lessonId;
    private Long studentId;
    private Long tutorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
