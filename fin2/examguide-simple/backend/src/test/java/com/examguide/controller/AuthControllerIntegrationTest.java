package com.examguide.controller;

import com.examguide.dto.LoginRequest;
import com.examguide.dto.RegisterRequest;
import com.examguide.service.AuthService;
import com.examguide.service.AnalyticsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("AuthController Integration Tests")
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private AnalyticsService analyticsService;

    private LoginRequest validLoginRequest;
    private RegisterRequest validRegisterRequest;

    @BeforeEach
    void setUp() {
        validLoginRequest = new LoginRequest();
        validLoginRequest.setEmail("test@example.com");
        validLoginRequest.setPassword("password123");

        validRegisterRequest = new RegisterRequest();
        validRegisterRequest.setEmail("newuser@example.com");
        validRegisterRequest.setPassword("password123");
        validRegisterRequest.setConfirmPassword("password123");
        validRegisterRequest.setFullName("New User");
    }

    @Test
    @DisplayName("Should return 400 when login email is blank")
    void testLoginWithBlankEmail() throws Exception {
        // Arrange
        validLoginRequest.setEmail("");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validLoginRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should return 400 when login email is invalid format")
    void testLoginWithInvalidEmailFormat() throws Exception {
        // Arrange
        validLoginRequest.setEmail("invalid-email");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validLoginRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should return 400 when login password is too short")
    void testLoginWithShortPassword() throws Exception {
        // Arrange
        validLoginRequest.setPassword("12345"); // Less than 6 characters

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validLoginRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should return 400 when register email is blank")
    void testRegisterWithBlankEmail() throws Exception {
        // Arrange
        validRegisterRequest.setEmail("");

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRegisterRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should return 400 when register password is too short")
    void testRegisterWithShortPassword() throws Exception {
        // Arrange
        validRegisterRequest.setPassword("12345");
        validRegisterRequest.setConfirmPassword("12345");

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRegisterRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should return 400 when register full name is missing")
    void testRegisterWithMissingFullName() throws Exception {
        // Arrange
        validRegisterRequest.setFullName("");

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRegisterRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should return 400 when register full name is too short")
    void testRegisterWithTooShortFullName() throws Exception {
        // Arrange
        validRegisterRequest.setFullName("A"); // Less than 2 characters

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRegisterRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should return 400 when register confirm password is blank")
    void testRegisterWithBlankConfirmPassword() throws Exception {
        // Arrange
        validRegisterRequest.setConfirmPassword("");

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRegisterRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should handle missing request body")
    void testLoginWithMissingBody() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should reject invalid content type")
    void testLoginWithInvalidContentType() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType("text/plain")
                .content("invalid"))
                .andExpect(status().isBadRequest());
    }
}
