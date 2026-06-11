package com.examguide.service;

import com.examguide.dto.AnalyticsDTO;
import com.examguide.entity.Analytics;
import com.examguide.repository.AnalyticsRepository;
import com.examguide.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AnalyticsService Unit Tests")
class AnalyticsServiceTest {

    @Mock
    private AnalyticsRepository analyticsRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AnalyticsService analyticsService;

    private Analytics analytics;
    private LocalDate today;

    @BeforeEach
    void setUp() {
        today = LocalDate.now();

        analytics = new Analytics();
        analytics.setId(1L);
        analytics.setDateRecorded(today);
        analytics.setNewUserRegistrations(5);
        analytics.setExamsViewed(10);
        analytics.setScholarshipsViewed(3);
        analytics.setMaterialsDownloaded(2);
        analytics.setRecommendationsGenerated(1);
        analytics.setRecommendationFeedbackPositive(1);
        analytics.setRecommendationFeedbackNegative(0);
        analytics.setTotalActiveUsers(100);
    }

    @Test
    @DisplayName("Should record a new user registration")
    void testRecordNewUserRegistration() {
        // Arrange
        when(analyticsRepository.findByDateRecorded(today))
                .thenReturn(Optional.of(analytics));
        when(analyticsRepository.save(any(Analytics.class))).thenReturn(analytics);

        // Act
        analyticsService.recordNewUserRegistration();

        // Assert
        verify(analyticsRepository, times(1)).save(any(Analytics.class));
    }

    @Test
    @DisplayName("Should record an exam view")
    void testRecordExamView() {
        // Arrange
        when(analyticsRepository.findByDateRecorded(today))
                .thenReturn(Optional.of(analytics));
        when(analyticsRepository.save(any(Analytics.class))).thenReturn(analytics);

        // Act
        analyticsService.recordExamView();

        // Assert
        verify(analyticsRepository, times(1)).save(any(Analytics.class));
    }

    @Test
    @DisplayName("Should record a scholarship view")
    void testRecordScholarshipView() {
        // Arrange
        when(analyticsRepository.findByDateRecorded(today))
                .thenReturn(Optional.of(analytics));
        when(analyticsRepository.save(any(Analytics.class))).thenReturn(analytics);

        // Act
        analyticsService.recordScholarshipView();

        // Assert
        verify(analyticsRepository, times(1)).save(any(Analytics.class));
    }

    @Test
    @DisplayName("Should record a material download")
    void testRecordMaterialDownload() {
        // Arrange
        when(analyticsRepository.findByDateRecorded(today))
                .thenReturn(Optional.of(analytics));
        when(analyticsRepository.save(any(Analytics.class))).thenReturn(analytics);

        // Act
        analyticsService.recordMaterialDownload();

        // Assert
        verify(analyticsRepository, times(1)).save(any(Analytics.class));
    }

    @Test
    @DisplayName("Should record a recommendation generated")
    void testRecordRecommendationGenerated() {
        // Arrange
        when(analyticsRepository.findByDateRecorded(today))
                .thenReturn(Optional.of(analytics));
        when(analyticsRepository.save(any(Analytics.class))).thenReturn(analytics);

        // Act
        analyticsService.recordRecommendationGenerated();

        // Assert
        verify(analyticsRepository, times(1)).save(any(Analytics.class));
    }

    @Test
    @DisplayName("Should record recommendation feedback - positive")
    void testRecordRecommendationFeedbackPositive() {
        // Arrange
        when(analyticsRepository.findByDateRecorded(today))
                .thenReturn(Optional.of(analytics));
        when(analyticsRepository.save(any(Analytics.class))).thenReturn(analytics);

        // Act
        analyticsService.recordRecommendationFeedback(true);

        // Assert
        verify(analyticsRepository, times(1)).save(any(Analytics.class));
    }

    @Test
    @DisplayName("Should record recommendation feedback - negative")
    void testRecordRecommendationFeedbackNegative() {
        // Arrange
        when(analyticsRepository.findByDateRecorded(today))
                .thenReturn(Optional.of(analytics));
        when(analyticsRepository.save(any(Analytics.class))).thenReturn(analytics);

        // Act
        analyticsService.recordRecommendationFeedback(false);

        // Assert
        verify(analyticsRepository, times(1)).save(any(Analytics.class));
    }

    @Test
    @DisplayName("Should get today's analytics")
    void testGetTodayAnalytics() {
        // Arrange
        when(analyticsRepository.findByDateRecorded(today))
                .thenReturn(Optional.of(analytics));

        // Act
        AnalyticsDTO result = analyticsService.getTodayAnalyticsDTO();

        // Assert
        assertNotNull(result);
        assertEquals(today, result.getDateRecorded());
        verify(analyticsRepository, times(1)).findByDateRecorded(today);
    }

    @Test
    @DisplayName("Should get analytics for date range")
    void testGetAnalyticsRange() {
        // Arrange
        LocalDate startDate = today.minusDays(7);
        LocalDate endDate = today;
        List<Analytics> analyticsList = Arrays.asList(analytics);

        when(analyticsRepository.findByDateRecordedBetweenOrderByDateRecordedDesc(startDate, endDate))
                .thenReturn(analyticsList);

        // Act
        List<AnalyticsDTO> results = analyticsService.getAnalyticsRange(startDate, endDate);

        // Assert
        assertNotNull(results);
        assertEquals(1, results.size());
        verify(analyticsRepository, times(1)).findByDateRecordedBetweenOrderByDateRecordedDesc(startDate, endDate);
    }

    @Test
    @DisplayName("Should update total active users")
    void testUpdateTotalActiveUsers() {
        // Arrange
        when(analyticsRepository.findByDateRecorded(today))
                .thenReturn(Optional.of(analytics));
        when(analyticsRepository.save(any(Analytics.class))).thenReturn(analytics);

        // Act
        analyticsService.updateTotalActiveUsers();

        // Assert
        verify(analyticsRepository, times(1)).save(any(Analytics.class));
    }

    @Test
    @DisplayName("Should create new analytics record if none exists for today")
    void testCreateNewAnalyticsWhenNotExists() {
        // Arrange
        when(analyticsRepository.findByDateRecorded(today))
                .thenReturn(Optional.empty());
        when(analyticsRepository.save(any(Analytics.class))).thenReturn(analytics);

        // Act
        analyticsService.recordNewUserRegistration();

        // Assert
        verify(analyticsRepository, times(1)).save(any(Analytics.class));
    }

    @Test
    @DisplayName("Should return empty list when no analytics found for date range")
    void testGetAnalyticsRangeEmpty() {
        // Arrange
        LocalDate startDate = today.minusDays(7);
        LocalDate endDate = today;

        when(analyticsRepository.findByDateRecordedBetweenOrderByDateRecordedDesc(startDate, endDate))
                .thenReturn(Arrays.asList());

        // Act
        List<AnalyticsDTO> results = analyticsService.getAnalyticsRange(startDate, endDate);

        // Assert
        assertNotNull(results);
        assertTrue(results.isEmpty());
        verify(analyticsRepository, times(1)).findByDateRecordedBetweenOrderByDateRecordedDesc(startDate, endDate);
    }
}
