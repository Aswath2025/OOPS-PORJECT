package com.examguide.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "analytics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Analytics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private LocalDate dateRecorded;

    @Column
    private Integer newUserRegistrations = 0;

    @Column
    private Integer totalActiveUsers = 0;

    @Column
    private Integer examsViewed = 0;

    @Column
    private Integer scholarshipsViewed = 0;

    @Column
    private Integer materialsDownloaded = 0;

    @Column
    private Integer recommendationsGenerated = 0;

    @Column
    private String mostViewedExam;

    @Column
    private String mostViewedScholarship;

    @Column
    private String mostDownloadedMaterial;

    @Column
    private Integer recommendationFeedbackPositive = 0;

    @Column
    private Integer recommendationFeedbackNegative = 0;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (dateRecorded == null) {
            dateRecorded = LocalDate.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
