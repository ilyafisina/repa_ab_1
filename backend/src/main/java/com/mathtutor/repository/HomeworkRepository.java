package com.mathtutor.repository;

import com.mathtutor.entity.Homework;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HomeworkRepository extends JpaRepository<Homework, Long> {
    List<Homework> findByStudent_IdOrderByDueDateDesc(Long studentId);
    List<Homework> findByStatusInAndDueDateBefore(List<Homework.HomeworkStatus> statuses, LocalDate date);
    List<Homework> findByTutor_IdOrderByCreatedAtDesc(Long tutorId);
}

