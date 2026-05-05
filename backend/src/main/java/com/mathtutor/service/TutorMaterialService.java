package com.mathtutor.service;

import com.mathtutor.dto.MaterialDTO;
import com.mathtutor.dto.MaterialFolderDTO;
import com.mathtutor.entity.Material;
import com.mathtutor.entity.MaterialFolder;
import com.mathtutor.entity.User;
import com.mathtutor.repository.MaterialFolderRepository;
import com.mathtutor.repository.MaterialRepository;
import com.mathtutor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TutorMaterialService {

    private final MaterialFolderRepository materialFolderRepository;
    private final MaterialRepository materialRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    /**
     * Получить все папки преподавателя
     */
    public List<MaterialFolderDTO> getTutorFolders(String tutorEmail) {
        User tutor = userRepository.findByEmail(tutorEmail)
                .orElseThrow(() -> new RuntimeException("Преподаватель не найден"));

        List<MaterialFolder> folders = materialFolderRepository.findByTutor_IdOrderByCreatedAtDesc(tutor.getId());

        return folders.stream()
                .map(this::convertFolderToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Создать новую папку
     */
    public MaterialFolderDTO createFolder(String tutorEmail, MaterialFolderDTO folderDTO) {
        User tutor = userRepository.findByEmail(tutorEmail)
                .orElseThrow(() -> new RuntimeException("Преподаватель не найден"));

        MaterialFolder folder = MaterialFolder.builder()
                .name(folderDTO.getName())
                .description(folderDTO.getDescription())
                .subject(folderDTO.getSubject())
                .tutor(tutor)
                .build();

        MaterialFolder saved = materialFolderRepository.save(folder);
        return convertFolderToDTO(saved);
    }

    /**
     * Удалить папку
     */
    public void deleteFolder(String tutorEmail, Long folderId) {
        User tutor = userRepository.findByEmail(tutorEmail)
                .orElseThrow(() -> new RuntimeException("Преподаватель не найден"));

        MaterialFolder folder = materialFolderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Папка не найдена"));

        if (!folder.getTutor().getId().equals(tutor.getId())) {
            throw new RuntimeException("У вас нет доступа к этой папке");
        }

        // Удаляем все файлы в папке
        List<Material> materials = materialRepository.findByFolder_IdOrderByCreatedAtDesc(folderId);
        for (Material material : materials) {
            if (material.getStoredPath() != null) {
                fileStorageService.deleteFile(material.getStoredPath());
            }
            materialRepository.delete(material);
        }

        materialFolderRepository.delete(folder);
    }

    /**
     * Получить файлы в папке
     */
    public List<MaterialDTO> getFolderFiles(String tutorEmail, Long folderId) {
        User tutor = userRepository.findByEmail(tutorEmail)
                .orElseThrow(() -> new RuntimeException("Преподаватель не найден"));

        MaterialFolder folder = materialFolderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Папка не найдена"));

        if (!folder.getTutor().getId().equals(tutor.getId())) {
            throw new RuntimeException("У вас нет доступа к этой папке");
        }

        List<Material> materials = materialRepository.findByFolder_IdOrderByCreatedAtDesc(folderId);

        return materials.stream()
                .map(this::convertMaterialToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Загрузить файл в папку
     */
    public MaterialDTO uploadFileToFolder(String tutorEmail, Long folderId, MultipartFile file) {
        User tutor = userRepository.findByEmail(tutorEmail)
                .orElseThrow(() -> new RuntimeException("Преподаватель не найден"));

        MaterialFolder folder = materialFolderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Папка не найдена"));

        if (!folder.getTutor().getId().equals(tutor.getId())) {
            throw new RuntimeException("У вас нет доступа к этой папке");
        }

        try {
            // Сохраняем файл
            String filePath = fileStorageService.saveFile(file, "materials");

            // Создаем запись в БД
            Material material = Material.builder()
                    .title(file.getOriginalFilename())
                    .materialType(Material.MaterialType.file)
                    .fileType(file.getContentType())
                    .originalName(file.getOriginalFilename())
                    .storedPath(filePath)
                    .fileSizeKb((int) (file.getSize() / 1024))
                    .isVisible(true)
                    .tutor(tutor)
                    .folder(folder)
                    .build();

            Material saved = materialRepository.save(material);
            return convertMaterialToDTO(saved);
        } catch (IOException e) {
            throw new RuntimeException("Ошибка при загрузке файла: " + e.getMessage());
        }
    }

    /**
     * Удалить файл
     */
    public void deleteFile(String tutorEmail, Long fileId) {
        User tutor = userRepository.findByEmail(tutorEmail)
                .orElseThrow(() -> new RuntimeException("Преподаватель не найден"));

        Material material = materialRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("Файл не найден"));

        if (!material.getTutor().getId().equals(tutor.getId())) {
            throw new RuntimeException("У вас нет доступа к этому файлу");
        }

        // Удаляем файл с диска
        if (material.getStoredPath() != null) {
            fileStorageService.deleteFile(material.getStoredPath());
        }

        materialRepository.delete(material);
    }

    /**
     * Скачать файл материала
     */
    public ResponseEntity<?> downloadFile(String tutorEmail, Long fileId) {
        User tutor = userRepository.findByEmail(tutorEmail)
                .orElseThrow(() -> new RuntimeException("Преподаватель не найден"));

        Material material = materialRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("Файл не найден"));

        if (!material.getTutor().getId().equals(tutor.getId())) {
            throw new RuntimeException("У вас нет доступа к этому файлу");
        }

        try {
            Path filePath = fileStorageService.getFilePath(material.getStoredPath());

            if (!Files.exists(filePath)) {
                throw new RuntimeException("Файл не найден на сервере");
            }

            byte[] fileContent = Files.readAllBytes(filePath);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", material.getOriginalName());
            headers.setContentLength(fileContent.length);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(fileContent);
        } catch (IOException e) {
            throw new RuntimeException("Ошибка при скачивании файла: " + e.getMessage());
        }
    }

    private MaterialFolderDTO convertFolderToDTO(MaterialFolder folder) {
        List<Material> materials = materialRepository.findByFolder_IdOrderByCreatedAtDesc(folder.getId());

        long totalSize = materials.stream()
                .filter(m -> m.getFileSizeKb() != null)
                .mapToLong(m -> m.getFileSizeKb() * 1024L)
                .sum();

        return MaterialFolderDTO.builder()
                .id(folder.getId())
                .name(folder.getName())
                .description(folder.getDescription())
                .subject(folder.getSubject())
                .tutorId(folder.getTutor().getId())
                .createdAt(folder.getCreatedAt())
                .updatedAt(folder.getUpdatedAt())
                .files(materials.stream().map(this::convertMaterialToDTO).collect(Collectors.toList()))
                .fileCount(materials.size())
                .totalSize(totalSize)
                .build();
    }

    private MaterialDTO convertMaterialToDTO(Material material) {
        return MaterialDTO.builder()
                .id(material.getId())
                .title(material.getTitle())
                .description(material.getDescription())
                .materialType(material.getMaterialType().name())
                .externalUrl(material.getExternalUrl())
                .content(material.getContent())
                .fileType(material.getFileType())
                .originalName(material.getOriginalName())
                .storedPath(material.getStoredPath())
                .fileSizeKb(material.getFileSizeKb())
                .subject(material.getSubject())
                .isVisible(material.getIsVisible())
                .tutorId(material.getTutor().getId())
                .studentId(material.getStudent() != null ? material.getStudent().getId() : null)
                .lessonId(material.getLesson() != null ? material.getLesson().getId() : null)
                .createdAt(material.getCreatedAt())
                .updatedAt(material.getUpdatedAt())
                .build();
    }
}
