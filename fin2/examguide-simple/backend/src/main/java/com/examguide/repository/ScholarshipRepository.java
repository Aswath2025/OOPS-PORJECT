package com.examguide.repository;

import com.examguide.entity.Scholarship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScholarshipRepository extends JpaRepository<Scholarship, Long> {
    List<Scholarship> findByIsFeatured(Boolean isFeatured);
    Page<Scholarship> findByNameContainingIgnoreCase(String name, Pageable pageable);
    List<Scholarship> findByDeadlineGreaterThan(LocalDate deadline);
    List<Scholarship> findByDeadlineBetween(LocalDate startDate, LocalDate endDate);
    List<Scholarship> findByOrderByDeadlineAsc();
}
