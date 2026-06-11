package com.examguide.controller;

import com.examguide.dto.AnalyticsDTO;
import com.examguide.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/today")
    public ResponseEntity<AnalyticsDTO> getTodayAnalytics() {
        AnalyticsDTO analytics = analyticsService.getTodayAnalyticsDTO();
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/range")
    public ResponseEntity<List<AnalyticsDTO>> getAnalyticsRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        List<AnalyticsDTO> analytics = analyticsService.getAnalyticsRange(start, end);
        return ResponseEntity.ok(analytics);
    }

    @PostMapping("/user-registrations")
    public ResponseEntity<String> recordUserRegistration() {
        analyticsService.recordNewUserRegistration();
        return ResponseEntity.ok("User registration recorded");
    }

    @PostMapping("/exam-view")
    public ResponseEntity<String> recordExamView() {
        analyticsService.recordExamView();
        return ResponseEntity.ok("Exam view recorded");
    }

    @PostMapping("/scholarship-view")
    public ResponseEntity<String> recordScholarshipView() {
        analyticsService.recordScholarshipView();
        return ResponseEntity.ok("Scholarship view recorded");
    }

    @PostMapping("/material-download")
    public ResponseEntity<String> recordMaterialDownload() {
        analyticsService.recordMaterialDownload();
        return ResponseEntity.ok("Material download recorded");
    }

    @PostMapping("/recommendation")
    public ResponseEntity<String> recordRecommendation() {
        analyticsService.recordRecommendationGenerated();
        return ResponseEntity.ok("Recommendation recorded");
    }

    @PostMapping("/recommendation-feedback")
    public ResponseEntity<String> recordRecommendationFeedback(
            @RequestParam Boolean isPositive) {
        analyticsService.recordRecommendationFeedback(isPositive);
        return ResponseEntity.ok("Recommendation feedback recorded");
    }
}
