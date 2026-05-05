package com.mathtutor.repository;

import com.mathtutor.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRoleAndTutor_Id(String role, Long tutorId);
    List<User> findByRoleAndTutorIsNull(String role);
}
