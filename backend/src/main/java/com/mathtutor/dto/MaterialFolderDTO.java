package com.mathtutor.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialFolderDTO {
    private Long id;
    private String name;
    private String description;
    private String subject;
    private Long tutorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<MaterialDTO> files;
    private Integer fileCount;
    private Long totalSize; // в байтах
}
