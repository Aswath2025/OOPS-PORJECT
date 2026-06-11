package com.examguide.controller;

import com.examguide.dto.ScholarshipDTO;
import com.examguide.entity.Scholarship;
import com.examguide.service.ScholarshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/scholarships")
public class ScholarshipController {

    @Autowired
    private ScholarshipService scholarshipService;

    @GetMapping
    public ResponseEntity<List<Scholarship>> getAllScholarships() {
        List<Scholarship> scholarships = scholarshipService.getAllScholarships();
        return ResponseEntity.ok(scholarships);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Scholarship> getScholarshipById(@PathVariable("id") Long id) {
        scholarshipService.incrementViewCount(id);
        Scholarship scholarship = scholarshipService.getScholarshipById(id);
        return ResponseEntity.ok(scholarship);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Scholarship>> searchScholarships(@RequestParam(name = "keyword") String keyword,
                                                                @RequestParam(name = "page", defaultValue = "0") int page,
                                                                @RequestParam(name = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Scholarship> results = scholarshipService.searchScholarships(keyword, pageable);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Scholarship>> getFeaturedScholarships() {
        List<Scholarship> scholarships = scholarshipService.getFeaturedScholarships();
        return ResponseEntity.ok(scholarships);
    }

    @GetMapping("/active")
    public ResponseEntity<List<Scholarship>> getActiveScholarships() {
        List<Scholarship> scholarships = scholarshipService.getActiveScholarships();
        return ResponseEntity.ok(scholarships);
    }

    @GetMapping("/expiring/{days}")
    public ResponseEntity<List<Scholarship>> getExpiringScholarships(@PathVariable("days") int days) {
        List<Scholarship> scholarships = scholarshipService.getExpiringScholarships(days);
        return ResponseEntity.ok(scholarships);
    }

    @Autowired
    private com.examguide.service.BookmarkService bookmarkService;

    @Autowired
    private com.examguide.repository.UserRepository userRepository;

    @PostMapping("/{id}/save")
    public ResponseEntity<String> saveScholarship(@PathVariable("id") Long id, org.springframework.security.core.Authentication authentication) {
        Long userId = 1L;
        if (authentication != null && authentication.getName() != null) {
            userId = userRepository.findByEmail(authentication.getName()).map(u -> u.getId()).orElse(1L);
        }
        bookmarkService.bookmarkScholarship(userId, id);
        return ResponseEntity.ok("Scholarship saved");
    }
}
