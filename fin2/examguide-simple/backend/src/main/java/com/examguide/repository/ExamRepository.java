package com.examguide.repository;

import com.examguide.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long>, JpaSpecificationExecutor<Exam> {
    List<Exam> findByCategory(String category);
    List<Exam> findByLevel(String level);
    List<Exam> findByIsFeatured(Boolean isFeatured);
    Page<Exam> findByNameContainingIgnoreCase(String name, Pageable pageable);
    List<Exam> findByExamDateBetween(LocalDate startDate, LocalDate endDate);
    List<Exam> findByOrderByExamDateAsc();
    List<Exam> findByOrderByViewCountDesc();
}
