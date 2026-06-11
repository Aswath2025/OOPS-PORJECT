package com.examguide.controller;

import com.examguide.dto.RecommendationRequest;
import com.examguide.dto.RecommendationResult;
import com.examguide.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.validation.Valid;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private static final Logger logger = LoggerFactory.getLogger(RecommendationController.class);

    @Autowired
    private RecommendationService recommendationService;

    @PostMapping
    public ResponseEntity<List<RecommendationResult>> getRecommendations(
            @Valid @RequestBody RecommendationRequest request) {
        logger.info("Recommendation request received for education level: {}, field: {}", 
                   request.getEducationLevel(), request.getFieldOfStudy());
        List<RecommendationResult> recommendations = recommendationService.getRecommendations(request);
        logger.debug("Generated {} recommendations", recommendations.size());
        return ResponseEntity.ok(recommendations);
    }

    @PostMapping("/{examId}/feedback")
    public ResponseEntity<Map<String, String>> submitFeedback(
            @PathVariable Long examId,
            @RequestParam String feedback) {
        logger.info("Feedback received for exam ID: {} - feedback: {}", examId, feedback);
        
        boolean isPositive = "like".equalsIgnoreCase(feedback);
        recommendationService.recordFeedback(examId, isPositive);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Thank you for your feedback");
        logger.debug("Feedback recorded successfully for exam ID: {}", examId);
        return ResponseEntity.ok(response);
    }
}
