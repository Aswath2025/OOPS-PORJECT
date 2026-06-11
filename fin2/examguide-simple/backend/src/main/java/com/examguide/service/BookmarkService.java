package com.examguide.service;

import com.examguide.entity.Bookmark;
import com.examguide.entity.Exam;
import com.examguide.entity.Scholarship;
import com.examguide.repository.BookmarkRepository;
import com.examguide.repository.ExamRepository;
import com.examguide.repository.ScholarshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class BookmarkService {

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private ScholarshipRepository scholarshipRepository;

    public Bookmark bookmarkExam(Long userId, Long examId) {
        if (isExamBookmarked(userId, examId)) {
            return bookmarkRepository.findByUserIdAndExamIdAndEntityType(userId, examId, "EXAM").orElse(null);
        }
        Bookmark bookmark = new Bookmark();
        bookmark.setUserId(userId);
        bookmark.setExamId(examId);
        bookmark.setEntityType("EXAM");
        return bookmarkRepository.save(bookmark);
    }

    public Bookmark bookmarkScholarship(Long userId, Long scholarshipId) {
        if (isScholarshipBookmarked(userId, scholarshipId)) {
            return bookmarkRepository.findByUserIdAndScholarshipIdAndEntityType(userId, scholarshipId, "SCHOLARSHIP").orElse(null);
        }
        Bookmark bookmark = new Bookmark();
        bookmark.setUserId(userId);
        bookmark.setScholarshipId(scholarshipId);
        bookmark.setEntityType("SCHOLARSHIP");
        return bookmarkRepository.save(bookmark);
    }

    public boolean isExamBookmarked(Long userId, Long examId) {
        return bookmarkRepository.findByUserIdAndExamIdAndEntityType(userId, examId, "EXAM")
                .isPresent();
    }

    public boolean isScholarshipBookmarked(Long userId, Long scholarshipId) {
        return bookmarkRepository.findByUserIdAndScholarshipIdAndEntityType(userId, scholarshipId, "SCHOLARSHIP")
                .isPresent();
    }

    public List<Bookmark> getUserExamBookmarks(Long userId) {
        return bookmarkRepository.findByUserIdAndEntityType(userId, "EXAM");
    }

    public List<Bookmark> getUserScholarshipBookmarks(Long userId) {
        return bookmarkRepository.findByUserIdAndEntityType(userId, "SCHOLARSHIP");
    }

    public List<Exam> getUserBookmarkedExams(Long userId) {
        List<Bookmark> bookmarks = bookmarkRepository.findByUserIdAndEntityType(userId, "EXAM");
        List<Long> examIds = bookmarks.stream()
                .map(Bookmark::getExamId)
                .collect(Collectors.toList());
        return examRepository.findAllById(examIds);
    }

    public List<Scholarship> getUserBookmarkedScholarships(Long userId) {
        List<Bookmark> bookmarks = bookmarkRepository.findByUserIdAndEntityType(userId, "SCHOLARSHIP");
        List<Long> scholarshipIds = bookmarks.stream()
                .map(Bookmark::getScholarshipId)
                .collect(Collectors.toList());
        return scholarshipRepository.findAllById(scholarshipIds);
    }

    public void removeExamBookmark(Long userId, Long examId) {
        bookmarkRepository.deleteByUserIdAndExamIdAndEntityType(userId, examId, "EXAM");
    }

    public void removeScholarshipBookmark(Long userId, Long scholarshipId) {
        bookmarkRepository.deleteByUserIdAndScholarshipIdAndEntityType(userId, scholarshipId, "SCHOLARSHIP");
    }
}
