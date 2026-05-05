package com.mathtutor.repository;

import com.mathtutor.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByStudent_IdAndIsVisibleOrderByCreatedAtDesc(Long studentId, boolean isVisible);
    List<Material> findByFolder_IdOrderByCreatedAtDesc(Long folderId);
    List<Material> findByTutor_IdOrderByCreatedAtDesc(Long tutorId);
}

