package com.examguide.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.URL;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScholarshipDTO {
    private Long id;

    @NotBlank(message = "Scholarship name is required")
    @Size(min = 3, max = 200, message = "Scholarship name must be between 3 and 200 characters")
    private String name;

    @NotBlank(message = "Provider name is required")
    @Size(min = 2, max = 100, message = "Provider name must be between 2 and 100 characters")
    private String provider;

    @NotBlank(message = "Amount is required")
    @Size(min = 1, max = 100, message = "Amount must be between 1 and 100 characters")
    private String amount;

    @NotBlank(message = "Deadline is required")
    private String deadline;

    @Size(max = 1000, message = "Eligibility criteria must not exceed 1000 characters")
    private String eligibilityCriteria;

    @URL(message = "Application link must be a valid URL")
    private String applicationLink;

    private Boolean isFeatured;

    @PositiveOrZero(message = "View count must be zero or positive")
    private Integer viewCount;
}
