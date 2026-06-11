package com.examguide.repository;

import com.examguide.entity.Analytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

@Repository
public interface AnalyticsRepository extends JpaRepository<Analytics, Long> {
    Optional<Analytics> findByDateRecorded(LocalDate date);
    List<Analytics> findByDateRecordedBetweenOrderByDateRecordedDesc(LocalDate start, LocalDate end);
}
