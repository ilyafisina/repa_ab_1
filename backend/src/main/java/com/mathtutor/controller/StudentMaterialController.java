package com.mathtutor.controller;

import com.mathtutor.dto.MaterialDTO;
import com.mathtutor.service.StudentMaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student/materials")
@RequiredArgsConstructor
public class StudentMaterialController {

    private final StudentMaterialService studentMaterialService;

    @GetMapping
    @PreAuthorize("hasRole('Студент')")
    public ResponseEntity<List<MaterialDTO>> getStudentMaterials(Authentication authentication) {
        String email = authentication.getName();
        List<MaterialDTO> materials = studentMaterialService.getStudentMaterials(email);
        return ResponseEntity.ok(materials);
    }
}
