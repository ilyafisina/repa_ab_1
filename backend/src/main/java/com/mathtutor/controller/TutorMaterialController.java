package com.mathtutor.controller;

import com.mathtutor.dto.MaterialDTO;
import com.mathtutor.dto.MaterialFolderDTO;
import com.mathtutor.service.TutorMaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/tutor/materials")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('Репетитор', 'Преподаватель')")
public class TutorMaterialController {

    private final TutorMaterialService tutorMaterialService;

    /**
     * Получить все папки преподавателя
     */
    @GetMapping("/folders")
    public ResponseEntity<List<MaterialFolderDTO>> getTutorFolders(Authentication authentication) {
        String email = authentication.getName();
        List<MaterialFolderDTO> folders = tutorMaterialService.getTutorFolders(email);
        return ResponseEntity.ok(folders);
    }

    /**
     * Создать новую папку
     */
    @PostMapping("/folders")
    public ResponseEntity<MaterialFolderDTO> createFolder(
            @RequestBody MaterialFolderDTO folderDTO,
            Authentication authentication) {
        String email = authentication.getName();
        MaterialFolderDTO created = tutorMaterialService.createFolder(email, folderDTO);
        return ResponseEntity.ok(created);
    }

    /**
     * Удалить папку
     */
    @DeleteMapping("/folders/{folderId}")
    public ResponseEntity<String> deleteFolder(
            @PathVariable Long folderId,
            Authentication authentication) {
        String email = authentication.getName();
        tutorMaterialService.deleteFolder(email, folderId);
        return ResponseEntity.ok("Папка удалена");
    }

    /**
     * Получить файлы в папке
     */
    @GetMapping("/folders/{folderId}/files")
    public ResponseEntity<List<MaterialDTO>> getFolderFiles(
            @PathVariable Long folderId,
            Authentication authentication) {
        String email = authentication.getName();
        List<MaterialDTO> files = tutorMaterialService.getFolderFiles(email, folderId);
        return ResponseEntity.ok(files);
    }

    /**
     * Загрузить файл в папку
     */
    @PostMapping("/folders/{folderId}/files")
    public ResponseEntity<MaterialDTO> uploadFile(
            @PathVariable Long folderId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        String email = authentication.getName();
        MaterialDTO uploaded = tutorMaterialService.uploadFileToFolder(email, folderId, file);
        return ResponseEntity.ok(uploaded);
    }

    /**
     * Удалить файл
     */
    @DeleteMapping("/files/{fileId}")
    public ResponseEntity<String> deleteFile(
            @PathVariable Long fileId,
            Authentication authentication) {
        String email = authentication.getName();
        tutorMaterialService.deleteFile(email, fileId);
        return ResponseEntity.ok("Файл удален");
    }

    /**
     * Скачать файл материала
     */
    @GetMapping("/files/{fileId}/download")
    public ResponseEntity<?> downloadFile(
            @PathVariable Long fileId,
            Authentication authentication) {
        String email = authentication.getName();
        return tutorMaterialService.downloadFile(email, fileId);
    }
}
