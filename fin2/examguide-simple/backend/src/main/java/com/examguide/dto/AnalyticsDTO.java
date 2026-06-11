package com.examguide.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDTO {
    private Long id;
    private LocalDate dateRecorded;
    private Integer newUserRegistrations;
    private Integer totalActiveUsers;
    private Integer examsViewed;
    private Integer scholarshipsViewed;
    private Integer materialsDownloaded;
    private Integer recommendationsGenerated;
    private String mostViewedExam;
    private String mostViewedScholarship;
    private Integer recommendationFeedbackPositive;
    private Integer recommendationFeedbackNegative;
}
