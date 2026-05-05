package com.mathtutor.controller;

import com.mathtutor.dto.HomeworkDTO;
import com.mathtutor.service.StudentHomeworkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/student/homeworks")
@RequiredArgsConstructor
public class StudentHomeworkController {

    private final StudentHomeworkService studentHomeworkService;

    @GetMapping
    @PreAuthorize("hasRole('Студент')")
    public ResponseEntity<List<HomeworkDTO>> getStudentHomeworks(Authentication authentication) {
        String email = authentication.getName();
        List<HomeworkDTO> homeworks = studentHomeworkService.getStudentHomeworks(email);
        return ResponseEntity.ok(homeworks);
    }

    @PostMapping("/{homeworkId}/answer")
    @PreAuthorize("hasRole('Студент')")
    public ResponseEntity<HomeworkDTO> uploadHomeworkAnswer(
            @PathVariable Long homeworkId,
            @RequestParam MultipartFile file,
            Authentication authentication) {
        String email = authentication.getName();
        HomeworkDTO homework = studentHomeworkService.uploadHomeworkAnswer(homeworkId, file, email);
        return ResponseEntity.ok(homework);
    }

    @GetMapping("/files/{fileId}")
    @PreAuthorize("hasRole('Студент')")
    public ResponseEntity<?> downloadHomeworkFile(
            @PathVariable Long fileId,
            Authentication authentication) {
        try {
            return studentHomeworkService.downloadHomeworkFile(fileId, authentication.getName());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка при скачивании файла: " + e.getMessage());
        }
    }
}
