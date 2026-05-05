package com.mathtutor.controller;

import com.mathtutor.dto.HomeworkDTO;
import com.mathtutor.dto.LessonDTO;
import com.mathtutor.dto.UserDTO;
import com.mathtutor.service.StudentHomeworkService;
import com.mathtutor.service.StudentLessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/tutor")
@RequiredArgsConstructor
public class TutorHomeworkController {

    private final StudentHomeworkService studentHomeworkService;
    private final StudentLessonService studentLessonService;

    /**
     * Получить всех учеников преподавателя
     */
    @GetMapping("/students")
    public ResponseEntity<List<UserDTO>> getTutorStudents(Authentication authentication) {
        String email = authentication.getName();
        List<UserDTO> students = studentHomeworkService.getTutorStudents(email);
        return ResponseEntity.ok(students);
    }

    /**
     * Получить домашние задания конкретного студента
     */
    @GetMapping("/students/{studentId}/homeworks")
    public ResponseEntity<List<HomeworkDTO>> getStudentHomeworks(
            @PathVariable Long studentId,
            Authentication authentication) {
        String email = authentication.getName();
        List<HomeworkDTO> homeworks = studentHomeworkService.getStudentHomeworksById(studentId, email);
        return ResponseEntity.ok(homeworks);
    }

    /**
     * Получить уроки конкретного студента
     */
    @GetMapping("/students/{studentId}/lessons")
    public ResponseEntity<List<LessonDTO>> getStudentLessons(
            @PathVariable Long studentId,
            Authentication authentication) {
        String email = authentication.getName();
        List<LessonDTO> lessons = studentLessonService.getStudentLessonsForTutor(studentId, email);
        return ResponseEntity.ok(lessons);
    }

    /**
     * Создать новое домашнее задание для студента
     */
    @PostMapping("/students/{studentId}/homeworks")
    public ResponseEntity<HomeworkDTO> createHomework(
            @PathVariable Long studentId,
            @RequestBody HomeworkDTO homeworkDTO,
            Authentication authentication) {
        String email = authentication.getName();
        HomeworkDTO created = studentHomeworkService.createHomeworkForStudent(studentId, homeworkDTO, email);
        return ResponseEntity.ok(created);
    }

    /**
     * Создать новое занятие для студента
     */
    @PostMapping("/students/{studentId}/lessons")
    public ResponseEntity<LessonDTO> createLesson(
            @PathVariable Long studentId,
            @RequestBody LessonDTO lessonDTO,
            Authentication authentication) {
        String email = authentication.getName();
        LessonDTO created = studentLessonService.createLessonForStudent(studentId, lessonDTO, email);
        return ResponseEntity.ok(created);
    }

    /**
     * Получить все занятия преподавателя
     */
    @GetMapping("/lessons")
    public ResponseEntity<List<LessonDTO>> getTutorLessons(Authentication authentication) {
        String email = authentication.getName();
        List<LessonDTO> lessons = studentLessonService.getTutorLessons(email);
        return ResponseEntity.ok(lessons);
    }

    /**
     * Переключить статус оплаты занятия
     */
    @PutMapping("/lessons/{lessonId}/toggle-payment")
    public ResponseEntity<LessonDTO> toggleLessonPayment(
            @PathVariable Long lessonId,
            Authentication authentication) {
        String email = authentication.getName();
        LessonDTO updated = studentLessonService.toggleLessonPaymentStatus(lessonId, email);
        return ResponseEntity.ok(updated);
    }

    /**
     * Удалить домашнее задание
     */
    @DeleteMapping("/homeworks/{homeworkId}")
    public ResponseEntity<String> deleteHomework(
            @PathVariable Long homeworkId,
            Authentication authentication) {
        String email = authentication.getName();
        studentHomeworkService.deleteHomework(homeworkId, email);
        return ResponseEntity.ok("Домашнее задание удалено");
    }

    /**
     * Проверить домашнее задание
     */
    @PutMapping("/homeworks/{homeworkId}/check")
    @PreAuthorize("hasAnyRole('Репетитор', 'Преподаватель')")
    public ResponseEntity<HomeworkDTO> checkHomework(
            @PathVariable Long homeworkId,
            @RequestParam Byte grade,
            @RequestParam(required = false) String comment,
            Authentication authentication) {
        String email = authentication.getName();
        HomeworkDTO homework = studentHomeworkService.checkHomework(homeworkId, grade, comment, email);
        return ResponseEntity.ok(homework);
    }

    /**
     * Обновить статусы домашних заданий (автоматически)
     */
    @PostMapping("/homeworks/update-statuses")
    @PreAuthorize("hasRole('Репетитор')")
    public ResponseEntity<String> updateHomeworkStatuses() {
        studentHomeworkService.updateHomeworkStatuses();
        return ResponseEntity.ok("Статусы обновлены");
    }

    /**
     * Скачать файл домашнего задания студента
     */
    @GetMapping("/homework-files/{fileId}/download")
    public ResponseEntity<?> downloadHomeworkFile(
            @PathVariable Long fileId,
            Authentication authentication) {
        String email = authentication.getName();
        return studentHomeworkService.downloadHomeworkFileForTutor(fileId, email);
    }
}