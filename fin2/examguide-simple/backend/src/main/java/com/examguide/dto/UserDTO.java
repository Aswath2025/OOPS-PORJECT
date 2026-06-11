package com.examguide.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @Email(message = "Email must be valid")
    @NotBlank(message = "Email is required")
    private String email;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String phoneNumber;

    private String dateOfBirth;

    @NotBlank(message = "Education level is required")
    private String education;

    private String category;

    @Size(max = 100, message = "Work experience must not exceed 100 characters")
    private String workExperience;

    @Size(max = 500, message = "Exam preferences must not exceed 500 characters")
    private String examPreferences;
}
