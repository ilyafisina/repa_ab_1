package com.mathtutor.repository;

import com.mathtutor.entity.MaterialFolder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialFolderRepository extends JpaRepository<MaterialFolder, Long> {
    List<MaterialFolder> findByTutor_IdOrderByCreatedAtDesc(Long tutorId);
}
