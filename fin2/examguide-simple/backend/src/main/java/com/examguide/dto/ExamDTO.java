package com.examguide.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.URL;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamDTO {
    private Long id;

    @NotBlank(message = "Exam name is required")
    @Size(min = 3, max = 200, message = "Exam name must be between 3 and 200 characters")
    private String name;

    @NotBlank(message = "Conducting body is required")
    @Size(min = 2, max = 100, message = "Conducting body must be between 2 and 100 characters")
    private String conductingBody;

    @URL(message = "Official website must be a valid URL")
    private String officialWebsite;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Level is required")
    private String level;

    @NotBlank(message = "Mode is required")
    private String mode;

    private String applicationStartDate;
    private String applicationEndDate;

    private String examDate;

    private String resultDate;

    @Size(max = 1000, message = "Eligibility criteria must not exceed 1000 characters")
    private String eligibilityCriteria;

    @Size(max = 1000, message = "Exam pattern must not exceed 1000 characters")
    private String examPattern;

    @Positive(message = "Total marks must be a positive number")
    private Integer totalMarks;

    private String duration;

    @Size(max = 2000, message = "Syllabus must not exceed 2000 characters")
    private String syllabus;

    private Boolean isFeatured;

    @PositiveOrZero(message = "View count must be zero or positive")
    private Integer viewCount;
}
