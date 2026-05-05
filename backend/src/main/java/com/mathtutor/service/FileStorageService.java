package com.mathtutor.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    // Допустимые типы файлов для домашних заданий
    private static final Set<String> ALLOWED_HOMEWORK_EXTENSIONS = new HashSet<>(Arrays.asList(
            ".doc", ".docx", ".pdf"
    ));

    private static final Set<String> ALLOWED_HOMEWORK_MIME_TYPES = new HashSet<>(Arrays.asList(
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/pdf"
    ));

    /**
     * Сохранить файл в хранилище
     */
    public String saveFile(MultipartFile file, String folder) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Файл не может быть пустым");
        }

        // Валидация для домашних заданий
        if ("homework".equals(folder)) {
            validateHomeworkFile(file);
        }

        // Получаем абсолютный путь
        File baseDir = new File(uploadDir).getAbsoluteFile();
        String uploadPath = Paths.get(baseDir.getAbsolutePath(), folder).toString();
        File dir = new File(uploadPath);
        
        // Создаем папки если их нет
        if (!dir.exists()) {
            boolean created = dir.mkdirs();
            if (!created && !dir.exists()) {
                throw new IOException("Не удалось создать директорию: " + uploadPath);
            }
        }
        
        System.out.println("📁 Сохранение файла в: " + uploadPath);

        // Генерируем уникальное имя файла
        String originalFileName = file.getOriginalFilename();
        String fileExtension = originalFileName != null ? originalFileName.substring(originalFileName.lastIndexOf(".")) : "";
        String fileName = UUID.randomUUID().toString() + fileExtension;

        // Сохраняем файл
        Path filePath = Paths.get(uploadPath, fileName);
        Files.write(filePath, file.getBytes());

        // Возвращаем путь для хранения в БД
        return Paths.get(folder, fileName).toString();
    }

    /**
     * Удалить файл из хранилища
     */
    public boolean deleteFile(String filePath) {
        try {
            Path path = Paths.get(uploadDir, filePath);
            return Files.deleteIfExists(path);
        } catch (IOException e) {
            return false;
        }
    }

    /**
     * Получить полный путь к файлу
     */
    public Path getFilePath(String filePath) {
        File baseDir = new File(uploadDir).getAbsoluteFile();
        Path fullPath = Paths.get(baseDir.getAbsolutePath(), filePath);
        System.out.println("📂 Поиск файла по пути: " + fullPath.toString());
        System.out.println("📂 Файл существует: " + Files.exists(fullPath));
        return fullPath;
    }

    /**
     * Валидировать файл домашнего задания (только Word и PDF)
     */
    private void validateHomeworkFile(MultipartFile file) {
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null) {
            throw new IllegalArgumentException("Не удалось определить имя файла");
        }

        // Проверяем расширение файла
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf(".")).toLowerCase();
        if (!ALLOWED_HOMEWORK_EXTENSIONS.contains(fileExtension)) {
            throw new IllegalArgumentException("Допустимые типы файлов: .doc, .docx, .pdf");
        }

        // Проверяем MIME-type
        String contentType = file.getContentType();
        if (contentType != null && !ALLOWED_HOMEWORK_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Допустимые типы файлов: Word (.doc, .docx) и PDF");
        }

        // Проверяем размер файла (максимум 10MB)
        long maxFileSize = 10 * 1024 * 1024; // 10MB
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("Размер файла не должен превышать 10MB");
        }
    }
}
