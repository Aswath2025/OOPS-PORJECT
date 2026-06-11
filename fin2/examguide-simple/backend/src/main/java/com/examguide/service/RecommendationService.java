package com.examguide.service;

import com.examguide.dto.RecommendationRequest;
import com.examguide.dto.RecommendationResult;
import com.examguide.entity.Exam;
import com.examguide.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private static final Logger logger = LoggerFactory.getLogger(RecommendationService.class);

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private AnalyticsService analyticsService;

    // Use a RestTemplate to communicate with the ML Python microservice
    private final RestTemplate restTemplate = new RestTemplate();
    private static final String ML_SERVICE_URL = "http://localhost:5001/predict";

    public List<RecommendationResult> getRecommendations(RecommendationRequest request) {
        logger.info("Generating recommendations for education level: {}, field: {}", 
                   request.getEducationLevel(), request.getFieldOfStudy());
                   
        // --- 1. Attempt Machine Learning Approach ---
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<RecommendationRequest> entity = new HttpEntity<>(request, headers);

            logger.info("Calling ML Service at {}", ML_SERVICE_URL);
            ResponseEntity<RecommendationResult[]> response = restTemplate.postForEntity(
                    ML_SERVICE_URL, entity, RecommendationResult[].class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                logger.info("Successfully received ML recommendations");
                analyticsService.recordRecommendationGenerated();
                return Arrays.asList(response.getBody());
            }
        } catch (RestClientException e) {
            logger.warn("ML Service unavailable, falling back to rule-based engine: {}", e.getMessage());
        }

        // --- 2. Fallback Rule-Based Approach ---
        List<Exam> allExams = examRepository.findAll();
        List<RecommendationResult> results = new ArrayList<>();

        for (Exam exam : allExams) {
            int matchScore = calculateMatchScore(exam, request);
            if (matchScore > 0) {
                RecommendationResult result = new RecommendationResult();
                result.setExamId(exam.getId());
                result.setExamName(exam.getName());
                result.setMatchPercentage(matchScore);
                result.setMatchReasons(getMatchReasons(exam, request, matchScore));
                results.add(result);
            }
        }

        List<RecommendationResult> sortedResults = results.stream()
                .sorted((a, b) -> b.getMatchPercentage() - a.getMatchPercentage())
                .limit(10)
                .collect(Collectors.toList());
        
        // Record the recommendation generation
        analyticsService.recordRecommendationGenerated();
        logger.debug("Successfully generated {} recommendations for user", sortedResults.size());
        
        return sortedResults;
    }

    public void recordFeedback(Long examId, boolean isPositive) {
        logger.info("Recording recommendation feedback for exam ID: {} - positive: {}", examId, isPositive);
        analyticsService.recordRecommendationFeedback(isPositive);
    }

    private int calculateMatchScore(Exam exam, RecommendationRequest request) {
        int score = 0;
        
        // Match by education level
        if (request.getEducationLevel() != null) {
            if (matchesEducationLevel(exam, request.getEducationLevel())) {
                score += 25;
            }
        }

        // Match by field of study
        if (request.getFieldOfStudy() != null && request.getFieldOfStudy().length() > 0) {
            if (matchesFieldOfStudy(exam, request.getFieldOfStudy())) {
                score += 25;
            }
        }

        // Match by exam type preference
        if (request.getPreferredExamTypes() != null && request.getPreferredExamTypes().length() > 0) {
            if (matchesExamType(exam, request.getPreferredExamTypes())) {
                score += 30;
            }
        }

        // Additional bonus for additional notes containing keywords
        if (request.getAdditionalNotes() != null && request.getAdditionalNotes().length() > 0) {
            if (matchesAdditionalNotes(exam, request.getAdditionalNotes())) {
                score += 20;
            }
        }

        return score;
    }

    private boolean matchesEducationLevel(Exam exam, String educationLevel) {
        if ("10th".equals(educationLevel)) {
            return "Banking".equals(exam.getCategory()) || "Railways".equals(exam.getCategory());
        } else if ("12th".equals(educationLevel)) {
            return "Banking".equals(exam.getCategory()) || "Railways".equals(exam.getCategory()) || 
                   "SSC".equals(exam.getCategory());
        } else if ("Graduate".equals(educationLevel)) {
            return "Banking".equals(exam.getCategory()) || "CivilServices".equals(exam.getCategory()) || 
                   "Engineering".equals(exam.getCategory());
        } else if ("PostGraduate".equals(educationLevel)) {
            return "CivilServices".equals(exam.getCategory()) || "Engineering".equals(exam.getCategory());
        }
        return false;
    }

    private boolean matchesFieldOfStudy(Exam exam, String fieldOfStudy) {
        String field = fieldOfStudy.toLowerCase();
        
        if (field.contains("b.tech") || field.contains("engineering")) {
            return "Engineering".equals(exam.getCategory());
        } else if (field.contains("b.com") || field.contains("commerce")) {
            return "Banking".equals(exam.getCategory());
        } else if (field.contains("arts") || field.contains("humanities")) {
            return "CivilServices".equals(exam.getCategory());
        }
        return false;
    }

    private boolean matchesExamType(Exam exam, String preferredTypes) {
        String examCategory = exam.getCategory();
        return preferredTypes.contains(examCategory);
    }

    private boolean matchesAdditionalNotes(Exam exam, String notes) {
        String notesLower = notes.toLowerCase();
        String categoryLower = exam.getCategory().toLowerCase();
        
        return notesLower.contains("government") || 
               notesLower.contains("banking") || 
               notesLower.contains("civil") ||
               notesLower.contains(categoryLower);
    }

    private String getMatchReasons(Exam exam, RecommendationRequest request, int score) {
        List<String> reasons = new ArrayList<>();

        if (request.getEducationLevel() != null && matchesEducationLevel(exam, request.getEducationLevel())) {
            reasons.add("Matches your education level");
        }

        if (request.getFieldOfStudy() != null && matchesFieldOfStudy(exam, request.getFieldOfStudy())) {
            reasons.add("Relevant to " + request.getFieldOfStudy());
        }

        if (request.getPreferredExamTypes() != null && matchesExamType(exam, request.getPreferredExamTypes())) {
            reasons.add("Matches exam type preference");
        }

        return String.join("; ", reasons);
    }
}