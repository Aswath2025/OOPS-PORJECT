package com.examguide.repository;

import com.examguide.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUserIdAndEntityType(Long userId, String entityType);
    Optional<Bookmark> findByUserIdAndExamIdAndEntityType(Long userId, Long examId, String entityType);
    Optional<Bookmark> findByUserIdAndScholarshipIdAndEntityType(Long userId, Long scholarshipId, String entityType);
    void deleteByUserIdAndExamIdAndEntityType(Long userId, Long examId, String entityType);
    void deleteByUserIdAndScholarshipIdAndEntityType(Long userId, Long scholarshipId, String entityType);
}
