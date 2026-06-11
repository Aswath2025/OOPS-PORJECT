package com.examguide.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResult {
    private Long examId;
    private String examName;
    private Integer matchPercentage;
    private String matchReasons;
}
