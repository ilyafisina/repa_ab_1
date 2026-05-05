package com.mathtutor.service;

import com.mathtutor.dto.MaterialDTO;
import com.mathtutor.entity.Material;
import com.mathtutor.entity.User;
import com.mathtutor.repository.MaterialRepository;
import com.mathtutor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentMaterialService {

    private final MaterialRepository materialRepository;
    private final UserRepository userRepository;

    /**
     * Получить все материалы для студента
     */
    public List<MaterialDTO> getStudentMaterials(String email) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Студент не найден"));

        // Получаем материалы от репетитора студента через уроки
        // Или все видимые материалы для студента
        List<Material> materials = materialRepository
                .findByStudent_IdAndIsVisibleOrderByCreatedAtDesc(student.getId(), true);

        return materials.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private MaterialDTO convertToDTO(Material material) {
        return MaterialDTO.builder()
                .id(material.getId())
                .title(material.getTitle())
                .description(material.getDescription())
                .materialType(material.getMaterialType().toString())
                .subject(material.getSubject())
                .isVisible(material.getIsVisible())
                .fileSizeKb(material.getFileSizeKb())
                .fileType(material.getFileType())
                .externalUrl(material.getExternalUrl())
                .content(material.getContent())
                .originalName(material.getOriginalName())
                .storedPath(material.getStoredPath())
                .lessonId(material.getLesson() != null ? material.getLesson().getId() : null)
                .studentId(material.getStudent() != null ? material.getStudent().getId() : null)
                .tutorId(material.getTutor().getId())
                .createdAt(material.getCreatedAt())
                .updatedAt(material.getUpdatedAt())
                .build();
    }
}
