package com.examguide.repository;

import com.examguide.entity.StudyMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<StudyMaterial, Long> {
    List<StudyMaterial> findByType(String type);
    List<StudyMaterial> findByExamId(Long examId);
    Page<StudyMaterial> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    List<StudyMaterial> findByIsPublished(Boolean isPublished);
    List<StudyMaterial> findByOrderByDownloadCountDesc();
}
