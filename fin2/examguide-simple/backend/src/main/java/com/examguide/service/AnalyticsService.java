package com.examguide.service;

import com.examguide.dto.AnalyticsDTO;
import com.examguide.entity.Analytics;
import com.examguide.repository.AnalyticsRepository;
import com.examguide.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private AnalyticsRepository analyticsRepository;

    @Autowired
    private UserRepository userRepository;

    public Analytics getTodayAnalytics() {
        LocalDate today = LocalDate.now();
        return analyticsRepository.findByDateRecorded(today)
                .orElseGet(() -> initializeTodayAnalytics());
    }

    private Analytics initializeTodayAnalytics() {
        Analytics analytics = new Analytics();
        analytics.setDateRecorded(LocalDate.now());
        return analyticsRepository.save(analytics);
    }

    public void recordNewUserRegistration() {
        Analytics analytics = getTodayAnalytics();
        analytics.setNewUserRegistrations(analytics.getNewUserRegistrations() + 1);
        analyticsRepository.save(analytics);
    }

    public void recordExamView() {
        Analytics analytics = getTodayAnalytics();
        analytics.setExamsViewed(analytics.getExamsViewed() + 1);
        analyticsRepository.save(analytics);
    }

    public void recordScholarshipView() {
        Analytics analytics = getTodayAnalytics();
        analytics.setScholarshipsViewed(analytics.getScholarshipsViewed() + 1);
        analyticsRepository.save(analytics);
    }

    public void recordMaterialDownload() {
        Analytics analytics = getTodayAnalytics();
        analytics.setMaterialsDownloaded(analytics.getMaterialsDownloaded() + 1);
        analyticsRepository.save(analytics);
    }

    public void recordRecommendationGenerated() {
        Analytics analytics = getTodayAnalytics();
        analytics.setRecommendationsGenerated(analytics.getRecommendationsGenerated() + 1);
        analyticsRepository.save(analytics);
    }

    public void recordRecommendationFeedback(Boolean isPositive) {
        Analytics analytics = getTodayAnalytics();
        if (isPositive) {
            analytics.setRecommendationFeedbackPositive(analytics.getRecommendationFeedbackPositive() + 1);
        } else {
            analytics.setRecommendationFeedbackNegative(analytics.getRecommendationFeedbackNegative() + 1);
        }
        analyticsRepository.save(analytics);
    }

    public void updateTotalActiveUsers() {
        Analytics analytics = getTodayAnalytics();
        long activeUsers = userRepository.findByIsActive(true).size();
        analytics.setTotalActiveUsers((int) activeUsers);
        analyticsRepository.save(analytics);
    }

    public AnalyticsDTO getTodayAnalyticsDTO() {
        Analytics analytics = getTodayAnalytics();
        return mapToDTO(analytics);
    }

    public List<AnalyticsDTO> getAnalyticsRange(LocalDate start, LocalDate end) {
        return analyticsRepository.findByDateRecordedBetweenOrderByDateRecordedDesc(start, end)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private AnalyticsDTO mapToDTO(Analytics analytics) {
        return new AnalyticsDTO(
                analytics.getId(),
                analytics.getDateRecorded(),
                analytics.getNewUserRegistrations(),
                analytics.getTotalActiveUsers(),
                analytics.getExamsViewed(),
                analytics.getScholarshipsViewed(),
                analytics.getMaterialsDownloaded(),
                analytics.getRecommendationsGenerated(),
                analytics.getMostViewedExam(),
                analytics.getMostViewedScholarship(),
                analytics.getRecommendationFeedbackPositive(),
                analytics.getRecommendationFeedbackNegative()
        );
    }
}
