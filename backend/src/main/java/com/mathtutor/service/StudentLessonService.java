package com.mathtutor.service;

import com.mathtutor.dto.LessonDTO;
import com.mathtutor.entity.Lesson;
import com.mathtutor.entity.User;
import com.mathtutor.repository.LessonRepository;
import com.mathtutor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentLessonService {

    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final PaymentService paymentService;

    /**
     * Получить все занятия студента
     */
    public List<LessonDTO> getStudentLessons(String email) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Студент не найден"));

        List<Lesson> lessons = lessonRepository.findByStudent_IdOrderByLessonDateDesc(student.getId());

        return lessons.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Получить все занятия студента для преподавателя
     */
    public List<LessonDTO> getStudentLessonsForTutor(Long studentId, String tutorEmail) {
        User tutor = userRepository.findByEmail(tutorEmail)
                .orElseThrow(() -> new RuntimeException("Преподаватель не найден"));

        List<Lesson> lessons = lessonRepository.findByStudent_IdOrderByLessonDateDesc(studentId);

        return lessons.stream()
                .filter(lesson -> lesson.getTutor().getId().equals(tutor.getId()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Получить все занятия преподавателя
     */
    public List<LessonDTO> getTutorLessons(String tutorEmail) {
        User tutor = userRepository.findByEmail(tutorEmail)
                .orElseThrow(() -> new RuntimeException("Преподаватель не найден"));

        List<Lesson> lessons = lessonRepository.findByTutor_IdOrderByLessonDateDesc(tutor.getId());

        return lessons.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Создать новое занятие для студента
     */
    public LessonDTO createLessonForStudent(Long studentId, LessonDTO lessonDTO, String tutorEmail) {
        User tutor = userRepository.findByEmail(tutorEmail)
                .orElseThrow(() -> new RuntimeException("Преподаватель не найден"));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Студент не найден"));

        Lesson lesson = Lesson.builder()
                .subject(lessonDTO.getSubject())
                .topic(lessonDTO.getTopic())
                .lessonDate(lessonDTO.getLessonDate())
                .durationMin(lessonDTO.getDurationMin())
                .format(Lesson.LessonFormat.valueOf(lessonDTO.getFormat()))
                .location(lessonDTO.getLocation())
                .onlineLink(lessonDTO.getOnlineLink())
                .price(lessonDTO.getPrice() != null ? lessonDTO.getPrice() : BigDecimal.ZERO)
                .isPaid(false)
                .status(Lesson.LessonStatus.upcoming)
                .tutor(tutor)
                .student(student)
                .notes(lessonDTO.getNotes())
                .build();

        Lesson saved = lessonRepository.save(lesson);
        return convertToDTO(saved);
    }

    /**
     * Переключить статус оплаты занятия
     */
    public LessonDTO toggleLessonPaymentStatus(Long lessonId, String tutorEmail) {
        User tutor = userRepository.findByEmail(tutorEmail)
                .orElseThrow(() -> new RuntimeException("Преподаватель не найден"));

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Занятие не найдено"));

        if (!lesson.getTutor().getId().equals(tutor.getId())) {
            throw new RuntimeException("У вас нет доступа к этому занятию");
        }

        lesson.setIsPaid(!lesson.getIsPaid());
        if (lesson.getIsPaid()) {
            lesson.setPaidAt(LocalDateTime.now());
        } else {
            lesson.setPaidAt(null);
        }

        Lesson saved = lessonRepository.save(lesson);
        return convertToDTO(saved);
    }

    /**
     * Оплатить занятие
     */
    public LessonDTO payLesson(Long lessonId, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Студент не найден"));

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Занятие не найдено"));

        if (!lesson.getStudent().getId().equals(student.getId())) {
            throw new RuntimeException("Это занятие не принадлежит студенту");
        }

        if (lesson.getIsPaid()) {
            throw new RuntimeException("Занятие уже оплачено");
        }

        if (student.getBalance().compareTo(lesson.getPrice()) < 0) {
            throw new RuntimeException("Недостаточно средств на балансе");
        }

        student.setBalance(student.getBalance().subtract(lesson.getPrice()));
        userRepository.save(student);

        java.time.LocalDateTime lessonDateTime = lesson.getLessonDate().minusHours(3);
        String paymentDescription = String.format("Оплата урока: %s%s (%s)",
            lesson.getSubject(),
            lesson.getTopic() != null ? " - " + lesson.getTopic() : "",
            lessonDateTime.format(java.time.format.DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm")));
        paymentService.createPayment(student, lesson, lesson.getPrice(), paymentDescription);

        lesson.setIsPaid(true);
        lesson.setPaidAt(LocalDateTime.now());
        lesson = lessonRepository.save(lesson);

        return convertToDTO(lesson);
    }

    private LessonDTO convertToDTO(Lesson lesson) {
        return LessonDTO.builder()
                .id(lesson.getId())
                .subject(lesson.getSubject())
                .topic(lesson.getTopic())
                .lessonDate(lesson.getLessonDate())
                .durationMin(lesson.getDurationMin())
                .format(lesson.getFormat().toString())
                .location(lesson.getLocation())
                .onlineLink(lesson.getOnlineLink())
                .price(lesson.getPrice())
                .isPaid(lesson.getIsPaid())
                .status(lesson.getStatus().toString())
                .tutorId(lesson.getTutor().getId())
                .tutorName(lesson.getTutor().getFullName())
                .tutorPhone(lesson.getTutor().getPhone())
                .studentId(lesson.getStudent().getId())
                .notes(lesson.getNotes())
                .createdAt(lesson.getCreatedAt())
                .updatedAt(lesson.getUpdatedAt())
                .build();
    }
}
