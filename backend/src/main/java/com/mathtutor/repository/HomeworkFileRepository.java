package com.mathtutor.repository;

import com.mathtutor.entity.HomeworkFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HomeworkFileRepository extends JpaRepository<HomeworkFile, Long> {
    List<HomeworkFile> findByHomework_IdAndIsAnswer(Long homeworkId, Boolean isAnswer);
}
