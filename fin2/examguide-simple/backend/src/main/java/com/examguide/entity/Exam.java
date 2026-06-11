package com.examguide.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "exams")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String conductingBody;

    @Column
    private String officialWebsite;

    @Column
    private String category; // Engineering, Banking, Civil Services, etc.

    @Column
    private String level; // National, State

    @Column
    private String mode; // Online, Offline

    @Column
    private LocalDate notificationDate;

    @Column
    private LocalDate applicationStartDate;

    @Column
    private LocalDate applicationEndDate;

    @Column
    private LocalDate examDate;

    @Column
    private LocalDate resultDate;

    @Column(columnDefinition = "TEXT")
    private String eligibilityCriteria;

    @Column
    private String minAge;

    @Column
    private String maxAge;

    @Column
    private String ageRelaxation;

    @Column(columnDefinition = "TEXT")
    private String examPattern;

    @Column
    private Integer totalMarks;

    @Column
    private String duration;

    @Column
    private Integer numberOfSubjects;

    @Column(columnDefinition = "TEXT")
    private String markingScheme;

    @Column(columnDefinition = "TEXT")
    private String subjectWeightage;

    @Column(columnDefinition = "TEXT")
    private String syllabus;

    @Column
    private Boolean isFeatured = false;

    @Column
    private Boolean isPublished = true;

    @Column
    private Integer viewCount = 0;

    @Column
    private Integer bookmarkCount = 0;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
