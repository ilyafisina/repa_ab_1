package com.mathtutor.controller;

import com.mathtutor.dto.LessonDTO;
import com.mathtutor.service.StudentLessonService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/student/lessons")
@RequiredArgsConstructor
public class StudentLessonController {

    private final StudentLessonService studentLessonService;

    @GetMapping
    @PreAuthorize("hasRole('Студент')")
    public ResponseEntity<List<LessonDTO>> getStudentLessons(Authentication authentication) {
        String email = authentication.getName();
        log.info("🎓 GET /api/student/lessons called for: {}", email);
        List<LessonDTO> lessons = studentLessonService.getStudentLessons(email);
        return ResponseEntity.ok(lessons);
    }

    @PostMapping("/{lessonId}/pay")
    @PreAuthorize("hasRole('Студент')")
    public ResponseEntity<LessonDTO> payLesson(@PathVariable Long lessonId, Authentication authentication) {
        String email = authentication.getName();
        LessonDTO lesson = studentLessonService.payLesson(lessonId, email);
        return ResponseEntity.ok(lesson);
    }
}
