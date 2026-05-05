package com.mathtutor.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "homework_files")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class HomeworkFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "homework_id", nullable = false)
    private Homework homework;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    @Column(nullable = false)
    private String originalName;

    @Column(nullable = false)
    private String storedPath;

    @Column
    private String fileType;

    @Column
    private Integer fileSizeKb;

    @Column(nullable = false)
    private Boolean isAnswer;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (isAnswer == null) {
            isAnswer = false;
        }
    }
}
