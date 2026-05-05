package com.mathtutor.repository;

import com.mathtutor.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByStudent_IdOrderByLessonDateDesc(Long studentId);
    List<Lesson> findByTutor_IdOrderByLessonDateDesc(Long tutorId);
}

