package com.examguide.controller;

import com.examguide.entity.Bookmark;
import com.examguide.entity.Exam;
import com.examguide.entity.Scholarship;
import com.examguide.service.BookmarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    @Autowired
    private BookmarkService bookmarkService;

    @Autowired
    private com.examguide.repository.UserRepository userRepository;
    @Autowired
    private com.examguide.service.ExamService examService;

    @GetMapping("/exams")
    public ResponseEntity<List<Exam>> getBookmarkedExams(Authentication authentication) {
        Long userId = resolveUserId(authentication);
        System.out.println("Fetching bookmarked exams for userId: " + userId);
        List<Exam> bookmarkedExams = bookmarkService.getUserBookmarkedExams(userId);
        System.out.println("Found " + bookmarkedExams.size() + " bookmarked exams.");
        if (!bookmarkedExams.isEmpty()) {
            System.out.println("First exam name: " + bookmarkedExams.get(0).getName());
        }
        return ResponseEntity.ok(bookmarkedExams);
    }

    @GetMapping("/scholarships")
    public ResponseEntity<List<Scholarship>> getBookmarkedScholarships(Authentication authentication) {
        Long userId = resolveUserId(authentication);
        System.out.println("Fetching bookmarked scholarships for userId: " + userId);
        List<Scholarship> bookmarkedScholarships = bookmarkService.getUserBookmarkedScholarships(userId);
        System.out.println("Found " + bookmarkedScholarships.size() + " bookmarked scholarships.");
        return ResponseEntity.ok(bookmarkedScholarships);
    }

    @PostMapping("/exam/{examId}")
    public ResponseEntity<Map<String, String>> bookmarkExam(
            @PathVariable("examId") Long examId,
            Authentication authentication) {
        Long userId = resolveUserId(authentication);
        bookmarkService.bookmarkExam(userId, examId);
        examService.incrementBookmarkCount(examId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Exam bookmarked successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/exam/{examId}")
    public ResponseEntity<Map<String, String>> removeExamBookmark(
            @PathVariable("examId") Long examId,
            Authentication authentication) {
        Long userId = resolveUserId(authentication);
        bookmarkService.removeExamBookmark(userId, examId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Exam removed from bookmarks");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/scholarship/{scholarshipId}")
    public ResponseEntity<Map<String, String>> bookmarkScholarship(
            @PathVariable("scholarshipId") Long scholarshipId,
            Authentication authentication) {
        Long userId = resolveUserId(authentication);
        System.out.println("Bookmarking scholarship " + scholarshipId + " for userId: " + userId);
        bookmarkService.bookmarkScholarship(userId, scholarshipId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Scholarship bookmarked successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/scholarship/{scholarshipId}")
    public ResponseEntity<Map<String, String>> removeScholarshipBookmark(
            @PathVariable("scholarshipId") Long scholarshipId,
            Authentication authentication) {
        Long userId = resolveUserId(authentication);
        bookmarkService.removeScholarshipBookmark(userId, scholarshipId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Scholarship removed from bookmarks");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/exam/{examId}/status")
    public ResponseEntity<Map<String, Boolean>> isExamBookmarked(
            @PathVariable("examId") Long examId,
            Authentication authentication) {
        Long userId = resolveUserId(authentication);
        boolean isBookmarked = bookmarkService.isExamBookmarked(userId, examId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isBookmarked", isBookmarked);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/scholarship/{scholarshipId}/status")
    public ResponseEntity<Map<String, Boolean>> isScholarshipBookmarked(
            @PathVariable("scholarshipId") Long scholarshipId,
            Authentication authentication) {
        Long userId = resolveUserId(authentication);
        boolean isBookmarked = bookmarkService.isScholarshipBookmarked(userId, scholarshipId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isBookmarked", isBookmarked);
        return ResponseEntity.ok(response);
    }

    private Long resolveUserId(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return 1L; // fallback
        }
        String username = authentication.getName();
        return userRepository.findByEmail(username).map(u -> u.getId()).orElse(1L);
    }
}
