package com.examguide.controller;

import com.examguide.entity.Exam;
import com.examguide.service.ExamService;
import com.examguide.specification.ExamSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    @Autowired
    private ExamService examService;

    @GetMapping
    public ResponseEntity<Page<Exam>> getAllExams(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "9") int size,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "level", required = false) String level,
            @RequestParam(name = "conductingBody", required = false) String conductingBody,
            @RequestParam(name = "mode", required = false) String mode,
            @RequestParam(name = "month", required = false) Integer month,
            @RequestParam(name = "sort", required = false, defaultValue = "deadline") String sort
    ) {
        Sort sortObj;
        if ("name".equalsIgnoreCase(sort)) {
            sortObj = Sort.by("name").ascending();
        } else if ("popularity".equalsIgnoreCase(sort)) {
            sortObj = Sort.by("id").descending();
        } else {
            // default: sorted by id ascending (deadline substitute)
            sortObj = Sort.by("id").ascending();
        }

        Pageable pageable = PageRequest.of(page, size, sortObj);
        Page<Exam> exams = examService.getExams(pageable, search, category, level, conductingBody, mode, month);
        return ResponseEntity.ok(exams);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exam> getExamById(@PathVariable("id") Long id) {
        examService.incrementViewCount(id);
        Exam exam = examService.getExamById(id);
        return ResponseEntity.ok(exam);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Exam>> searchExams(
            @RequestParam(name = "keyword") String keyword,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Exam> results = examService.searchExams(keyword, pageable);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Exam>> getExamsByCategory(@PathVariable("category") String category) {
        List<Exam> exams = examService.getExamsByCategory(category);
        return ResponseEntity.ok(exams);
    }

    @GetMapping("/level/{level}")
    public ResponseEntity<List<Exam>> getExamsByLevel(@PathVariable("level") String level) {
        List<Exam> exams = examService.getExamsByLevel(level);
        return ResponseEntity.ok(exams);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Exam>> getFeaturedExams() {
        List<Exam> exams = examService.getFeaturedExams();
        return ResponseEntity.ok(exams);
    }

    @GetMapping("/upcoming/{days}")
    public ResponseEntity<List<Exam>> getUpcomingExams(@PathVariable("days") int days) {
        List<Exam> exams = examService.getUpcomingExams(days);
        return ResponseEntity.ok(exams);
    }

    @PostMapping("/{id}/bookmark")
    public ResponseEntity<String> bookmarkExam(@PathVariable("id") Long id) {
        examService.incrementBookmarkCount(id);
        return ResponseEntity.ok("Exam bookmarked");
    }

    @GetMapping("/sorted/date")
    public ResponseEntity<List<Exam>> getSortedByDate() {
        List<Exam> exams = examService.getSortedByDate();
        return ResponseEntity.ok(exams);
    }

    @GetMapping("/sorted/popularity")
    public ResponseEntity<List<Exam>> getSortedByPopularity() {
        List<Exam> exams = examService.getSortedByPopularity();
        return ResponseEntity.ok(exams);
    }
}
