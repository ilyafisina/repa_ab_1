package com.mathtutor.service;

import com.mathtutor.dto.HomeworkDTO;
import com.mathtutor.dto.HomeworkFileDTO;
import com.mathtutor.dto.UserDTO;
import com.mathtutor.entity.Homework;
import com.mathtutor.entity.HomeworkFile;
import com.mathtutor.entity.User;
import com.mathtutor.repository.HomeworkRepository;
import com.mathtutor.repository.HomeworkFileRepository;
import com.mathtutor.repository.LessonRepository;
import com.mathtutor.repository.UserRepository;
import com.mathtutor.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentHomeworkService {

    private final HomeworkRepository homeworkRepository;
    private final HomeworkFileRepository homeworkFileRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final FileStorageService fileStorageService;
    private final MaterialRepository materialRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Получить все домашние задания студента
     */
    public List<HomeworkDTO> getStudentHomeworks(String email) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Студент не найден"));

        List<Homework> homeworks = homeworkRepository.findByStudent_IdOrderByDueDateDesc(student.getId());

        return homeworks.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Получить всех учеников преподавателя
     */
    public List<UserDTO> getTutorStudents(String tutorEmail) {
        User tutor = userRepository.findByEmail(tutorEmail)
                .orElseThrow(() -> new RuntimeException("Преподаватель не найден"));

        List<User> students = userRepository.findByRoleAndTutor_Id("Студент", tutor.getId());

        return students.stream()
                .map(this::convertUserToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Получить незакреплённых учеников (без репетитора)
     */
    public List<UserDTO> getUnassignedStudents(String tutorEmail) {
        List<User> students = userRepository.findByRoleAndTutorIsNull("Студент");

        return students.stream()
                .map(this::convertUserToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Привязать существующего ученика к репетитору
     */
    public UserDTO assignStudentToTutor(Long studentId, String tutorEmail) {
        User tutor = userRepository.findByEmail(tutorEmail)
                .orElseThrow(() -> new RuntimeException("Преподаватель не найден"));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Ученик не найден"));

        if (!"Студент".equals(student.getRole())) {
            throw new RuntimeException("Пользователь не является учеником");
        }

        if (student.getTutor() != null) {
            throw new RuntimeException("Ученик уже закреплён за другим репетитором");
        }

        student.setTutor(tutor);
        student = userRepository.save(student);

        return convertUserToDTO(student);
    }

    /**
     * Создать нового ученика и привязать к репетитору
     */
    public UserDTO createStudentForTutor(String fullName, String email, String phone,
                                          Byte grade, String password, String tutorEmail) {
        User tutor = userRepository.findByEmail(tutorEmail)
                .orElseThrow(() -> new RuntimeException("Преподаватель не найден"));

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Пользователь с таким email уже существует");
        }

        User student = User.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .fullName(fullName)
                .phone(phone)
                .grade(grade)
                .role("Студент")
                .balance(java.math.BigDecimal.ZERO)
                .active(true)
                .tutor(tutor)
                .build();

        student = userRepository.save(student);
        return convertUserToDTO(student);
    }

    /**
     * Получить домашние задания студента по его ID (для преподавателя)
     */
    public List<HomeworkDTO> getStudentHomeworksById(Long studentId, String tutorEmail) {
        User tutor = userRepository.findByEmail(tutorEmail)
                .orElseThrow(() -> new RuntimeException("Преподаватель не найден"));

        List<Homework> homeworks = homeworkRepository.findByStudent_IdOrderByDueDateDesc(studentId);

        // Проверяем, что все домашние задания принадлежат этому преподавателю
        return homeworks.stream()
                .filter(hw -> hw.getTutor().getId().equals(tutor.getId()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Загрузить решение домашнего задания
     */
    public HomeworkDTO uploadHomeworkAnswer(Long homeworkId, MultipartFile file, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Студент не найден"));

        Homework homework = homeworkRepository.findById(homeworkId)
                .orElseThrow(() -> new RuntimeException("Домашнее задание не найдено"));

        if (!homework.getStudent().getId().equals(student.getId())) {
            throw new RuntimeException("Это домашнее задание не принадлежит студенту");
        }

        try {
            // Сохраняем файл
            String filePath = fileStorageService.saveFile(file, "homework");

            // Записываем информацию о файле в БД
            HomeworkFile homeworkFile = HomeworkFile.builder()
                    .homework(homework)
                    .uploadedBy(student)
                    .originalName(file.getOriginalFilename())
                    .fileType(file.getContentType())
                    .fileSizeKb((int) (file.getSize() / 1024))
                    .storedPath(filePath)
                    .isAnswer(true)
                    .createdAt(LocalDateTime.now())
                    .build();

            homeworkFileRepository.save(homeworkFile);

            // Обновляем статус домашнего задания
            homework.setStatus(Homework.HomeworkStatus.submitted);
            homework.setSubmittedAt(LocalDateTime.now());
            homework = homeworkRepository.save(homework);

            return convertToDTO(homework);
        } catch (IOException e) {
            throw new RuntimeException("Ошибка при сохранении файла: " + e.getMessage());
        }
    }

    private HomeworkDTO convertToDTO(Homework homework) {
        // Загружаем файлы студента (ответы)
        List<HomeworkFile> studentFiles = homeworkFileRepository
                .findByHomework_IdAndIsAnswer(homework.getId(), true);
        List<HomeworkFileDTO> studentWork = studentFiles.stream()
                .map(this::convertFileToDTO)
                .collect(Collectors.toList());

        // Загружаем материалы от преподавателя (прикрепленные файлы)
        List<HomeworkFile> attachmentFiles = homeworkFileRepository
                .findByHomework_IdAndIsAnswer(homework.getId(), false);
        List<HomeworkFileDTO> attachments = attachmentFiles.stream()
                .map(this::convertFileToDTO)
                .collect(Collectors.toList());

        // Если оценка выставлена, то статус = "Проверено" (checked)
        String status = homework.getStatus().toString();
        if (homework.getGrade() != null) {
            status = Homework.HomeworkStatus.checked.toString();
        }

        return HomeworkDTO.builder()
                .id(homework.getId())
                .title(homework.getTitle())
                .description(homework.getDescription())
                .dueDate(homework.getDueDate())
                .status(status)
                .grade(homework.getGrade())
                .studentAnswer(homework.getStudentAnswer())
                .submittedAt(homework.getSubmittedAt())
                .tutorComment(homework.getTutorComment())
                .checkedAt(homework.getCheckedAt())
                .lessonId(homework.getLesson() != null ? homework.getLesson().getId() : null)
                .studentId(homework.getStudent().getId())
                .tutorId(homework.getTutor().getId())
                .createdAt(homework.getCreatedAt())
                .updatedAt(homework.getUpdatedAt())
                .studentWork(studentWork)
                .attachments(attachments)
                // Дополнительная информация
                .subject(homework.getLesson() != null ? homework.getLesson().getSubject() : null)
                .tutorName(homework.getTutor() != null ? homework.getTutor().getFullName() : null)
                .lessonDate(homework.getLesson() != null ? homework.getLesson().getLessonDate() : null)
                .lessonTopic(homework.getLesson() != null ? homework.getLesson().getTopic() : null)
                .assignedDate(homework.getCreatedAt() != null ? homework.getCreatedAt().toLocalDate() : null)
                .build();
    }

    private HomeworkFileDTO convertFileToDTO(HomeworkFile file) {
        return HomeworkFileDTO.builder()
                .id(file.getId())
                .fileName(file.getOriginalName())
                .filePath(file.getStoredPath())
                .fileType(file.getFileType())
                .fileSize(file.getFileSizeKb() != null ? file.getFileSizeKb() * 1024L : 0L)
                .uploadedAt(file.getCreatedAt())
                .build();
    }

    private UserDTO convertUserToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .grade(user.getGrade())
                .balance(user.getBalance())
                .active(user.getActive())
                .avatarPath(user.getAvatarPath())
                .tutorId(user.getTutor() != null ? user.getTutor().getId() : null)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    /**
     * Создать новое домашнее задание для студента
     */
    @Transactional
    public HomeworkDTO createHomeworkForStudent(Long studentId, HomeworkDTO homeworkDTO, String tutorEmail) {
        User tutor = userRepository.findByEmail(tutorEmail)
                .orElseThrow(() -> new RuntimeException("Преподаватель не найден"));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Студент не найден"));

        // Проверяем, что урок существует и принадлежит этому преподавателю
        if (homeworkDTO.getLessonId() == null) {
            throw new RuntimeException("Необходимо указать урок для домашнего задания");
        }

        var lesson = lessonRepository.findById(homeworkDTO.getLessonId())
                .orElseThrow(() -> new RuntimeException("Урок не найден"));

        if (!lesson.getTutor().getId().equals(tutor.getId())) {
            throw new RuntimeException("Этот урок не принадлежит вам");
        }

        if (!lesson.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Этот урок не принадлежит выбранному студенту");
        }

        Homework homework = new Homework();
        homework.setTitle(homeworkDTO.getTitle());
        homework.setDescription(homeworkDTO.getDescription());
        homework.setDueDate(homeworkDTO.getDueDate());
        homework.setStatus(Homework.HomeworkStatus.assigned);
        homework.setStudent(student);
        homework.setTutor(tutor);
        homework.setLesson(lesson);
        homework.setCreatedAt(LocalDateTime.now());
        homework.setUpdatedAt(LocalDateTime.now());

        Homework saved = homeworkRepository.save(homework);

        // Прикрепляем материалы, если они были выбраны
        if (homeworkDTO.getMaterialIds() != null && !homeworkDTO.getMaterialIds().isEmpty()) {
            for (Long materialId : homeworkDTO.getMaterialIds()) {
                try {
                    // Находим материал
                    var material = materialRepository.findById(materialId)
                            .orElseThrow(() -> new RuntimeException("Материал не найден: " + materialId));

                    // Проверяем, что материал принадлежит этому преподавателю
                    if (!material.getTutor().getId().equals(tutor.getId())) {
                        continue; // Пропускаем чужие материалы
                    }

                    // Создаем запись HomeworkFile как attachment (isAnswer = false)
                    HomeworkFile homeworkFile = HomeworkFile.builder()
                            .homework(saved)
                            .uploadedBy(tutor)
                            .originalName(material.getOriginalName())
                            .fileType(material.getFileType())
                            .fileSizeKb(material.getFileSizeKb())
                            .storedPath(material.getStoredPath()) // Используем тот же путь (не копируем файл)
                            .isAnswer(false) // Это материал от преподавателя, не ответ студента
                            .createdAt(LocalDateTime.now())
                            .build();

                    homeworkFileRepository.save(homeworkFile);
                    System.out.println("Прикреплен материал: " + material.getOriginalName() + " к ДЗ ID: " + saved.getId());
                } catch (Exception e) {
                    System.err.println("Ошибка при прикреплении материала ID " + materialId + ": " + e.getMessage());
                }
            }
        }

        return convertToDTO(saved);
    }

    /**
     * Удалить домашнее задание
     */
    @Transactional
    public void deleteHomework(Long homeworkId, String tutorEmail) {
        User tutor = userRepository.findByEmail(tutorEmail)
                .orElseThrow(() -> new RuntimeException("Преподаватель не найден"));

        Homework homework = homeworkRepository.findById(homeworkId)
                .orElseThrow(() -> new RuntimeException("Домашнее задание не найдено"));

        // Проверяем, что это домашнее задание принадлежит этому преподавателю
        if (!homework.getTutor().getId().equals(tutor.getId())) {
            throw new RuntimeException("Вы не можете удалить это домашнее задание");
        }

        homeworkRepository.delete(homework);
    }

    /**
     * Скачать файл домашнего задания
     */
    public ResponseEntity<?> downloadHomeworkFile(Long fileId, String studentEmail) {
        System.out.println("=== НАЧАЛО СКАЧИВАНИЯ ФАЙЛА ===");
        System.out.println("File ID: " + fileId);
        System.out.println("Student email: " + studentEmail);

        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Студент не найден"));

        System.out.println("Student found: " + student.getId() + " - " + student.getEmail());

        HomeworkFile homeworkFile = homeworkFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("Файл не найден"));

        System.out.println("File found in DB: " + homeworkFile.getId() + " - " + homeworkFile.getOriginalName());

        // Проверяем, что файл принадлежит домашнему заданию этого студента
        if (!homeworkFile.getHomework().getStudent().getId().equals(student.getId())) {
            System.out.println("Access denied: homework belongs to student " + homeworkFile.getHomework().getStudent().getId() + ", requested by " + student.getId());
            throw new RuntimeException("У вас нет доступа к этому файлу");
        }

        System.out.println("Access granted");
        System.out.println("Оригинальное имя: " + homeworkFile.getOriginalName());
        System.out.println("Сохраненный путь в БД: " + homeworkFile.getStoredPath());

        try {
            Path filePath = fileStorageService.getFilePath(homeworkFile.getStoredPath());
            System.out.println("Полный путь к файлу: " + filePath.toString());
            System.out.println("Файл существует: " + Files.exists(filePath));

            if (!Files.exists(filePath)) {
                throw new RuntimeException("Файл не найден на сервере");
            }

            byte[] fileContent = Files.readAllBytes(filePath);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", homeworkFile.getOriginalName());
            headers.setContentLength(fileContent.length);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(fileContent);
        } catch (IOException e) {
            throw new RuntimeException("Ошибка при скачивании файла: " + e.getMessage());
        }
    }

    /**
     * Обновить статусы домашних заданий (автоматически)
     */
    @Transactional
    public void updateHomeworkStatuses() {
        LocalDate today = LocalDate.now();

        // Найти все задания со статусом assigned или submitted, у которых истек срок
        List<Homework> overdueHomeworks = homeworkRepository.findByStatusInAndDueDateBefore(
                Arrays.asList(Homework.HomeworkStatus.assigned, Homework.HomeworkStatus.submitted), today);

        for (Homework homework : overdueHomeworks) {
            homework.setStatus(Homework.HomeworkStatus.overdue);
            homeworkRepository.save(homework);
            System.out.println("Обновлен статус задания " + homework.getId() + " на overdue");
        }
    }

    /**
     * Проверить домашнее задание (для преподавателя)
     */
    @Transactional
    public HomeworkDTO checkHomework(Long homeworkId, Byte grade, String comment, String tutorEmail) {
        User tutor = userRepository.findByEmail(tutorEmail)
                .orElseThrow(() -> new RuntimeException("Преподаватель не найден"));

        Homework homework = homeworkRepository.findById(homeworkId)
                .orElseThrow(() -> new RuntimeException("Домашнее задание не найдено"));

        if (!homework.getTutor().getId().equals(tutor.getId())) {
            throw new RuntimeException("У вас нет доступа к этому заданию");
        }

        homework.setStatus(Homework.HomeworkStatus.checked);
        homework.setGrade(grade);
        homework.setTutorComment(comment);
        homework.setCheckedAt(LocalDateTime.now());

        homework = homeworkRepository.save(homework);
        return convertToDTO(homework);
    }

    /**
     * Скачать файл домашнего задания для преподавателя
     */
    public ResponseEntity<?> downloadHomeworkFileForTutor(Long fileId, String tutorEmail) {
        System.out.println("=== СКАЧИВАНИЕ ФАЙЛА ПРЕПОДАВАТЕЛЕМ ===");
        System.out.println("File ID: " + fileId);
        System.out.println("Tutor email: " + tutorEmail);

        User tutor = userRepository.findByEmail(tutorEmail)
                .orElseThrow(() -> new RuntimeException("Преподаватель не найден"));

        System.out.println("Tutor found: " + tutor.getId() + " - " + tutor.getEmail());

        HomeworkFile homeworkFile = homeworkFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("Файл не найден"));

        System.out.println("File found in DB: " + homeworkFile.getId() + " - " + homeworkFile.getOriginalName());

        // Проверяем, что файл принадлежит домашнему заданию этого преподавателя
        if (!homeworkFile.getHomework().getTutor().getId().equals(tutor.getId())) {
            System.out.println("Access denied: homework tutor " + homeworkFile.getHomework().getTutor().getId() + ", requested by " + tutor.getId());
            throw new RuntimeException("У вас нет доступа к этому файлу");
        }

        System.out.println("Access granted");
        System.out.println("Оригинальное имя: " + homeworkFile.getOriginalName());
        System.out.println("Сохраненный путь в БД: " + homeworkFile.getStoredPath());

        try {
            Path filePath = fileStorageService.getFilePath(homeworkFile.getStoredPath());
            System.out.println("Полный путь к файлу: " + filePath.toString());
            System.out.println("Абсолютный путь: " + filePath.toAbsolutePath().toString());
            System.out.println("Файл существует: " + Files.exists(filePath));

            // Проверяем родительскую директорию
            Path parentDir = filePath.getParent();
            System.out.println("Родительская директория: " + parentDir);
            System.out.println("Родительская директория существует: " + Files.exists(parentDir));

            if (Files.exists(parentDir)) {
                System.out.println("Содержимое родительской директории:");
                Files.list(parentDir).forEach(p -> System.out.println("  - " + p.getFileName()));
            }

            if (!Files.exists(filePath)) {
                throw new RuntimeException("Файл не найден на сервере по пути: " + filePath.toAbsolutePath());
            }

            byte[] fileContent = Files.readAllBytes(filePath);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", homeworkFile.getOriginalName());
            headers.setContentLength(fileContent.length);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(fileContent);
        } catch (IOException e) {
            throw new RuntimeException("Ошибка при скачивании файла: " + e.getMessage());
        }
    }
}
