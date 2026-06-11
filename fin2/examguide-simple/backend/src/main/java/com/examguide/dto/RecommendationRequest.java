package com.examguide.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationRequest {
    
    @NotBlank(message = "Education level is required")
    private String educationLevel;

    @NotBlank(message = "Field of study is required")
    @Size(min = 2, max = 100, message = "Field of study must be between 2 and 100 characters")
    private String fieldOfStudy;

    @Size(max = 200, message = "Preferred exam types must not exceed 200 characters")
    private String preferredExamTypes;

    @Size(max = 500, message = "Additional notes must not exceed 500 characters")
    private String additionalNotes;
}
