package com.examguide.service;

import com.examguide.dto.LoginRequest;
import com.examguide.dto.RegisterRequest;
import com.examguide.dto.AuthResponse;
import com.examguide.entity.User;
import com.examguide.exception.ValidationException;
import com.examguide.repository.UserRepository;
import com.examguide.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AnalyticsService analyticsService;

    @InjectMocks
    private AuthService authService;

    private LoginRequest loginRequest;
    private RegisterRequest registerRequest;
    private User user;

    @BeforeEach
    void setUp() {
        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        registerRequest = new RegisterRequest();
        registerRequest.setFullName("John Doe");
        registerRequest.setEmail("john@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setConfirmPassword("password123");

        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setFullName("Test User");
        user.setRole(User.UserRole.USER);
        user.setIsActive(true);
    }

    @Test
    @DisplayName("Should successfully login with valid credentials")
    void testLoginWithValidCredentials() {
        // Arrange
        Authentication auth = new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(), loginRequest.getPassword());
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken(any(Authentication.class))).thenReturn("test-jwt-token");
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act
        AuthResponse response = authService.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertNotNull(response.getToken());
        verify(userRepository, times(1)).findByEmail(loginRequest.getEmail());
        verify(analyticsService, times(1)).updateTotalActiveUsers();
    }

    @Test
    @DisplayName("Should throw exception with invalid credentials")
    void testLoginWithInvalidCredentials() {
        // Arrange
        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        // Act & Assert
        assertThrows(ValidationException.class, () -> authService.login(loginRequest));
        verify(authenticationManager, times(1)).authenticate(any());
    }

    @Test
    @DisplayName("Should successfully register new user")
    void testRegisterWithValidData() {
        // Arrange
        when(userRepository.findByEmail(registerRequest.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(registerRequest.getPassword()))
                .thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtUtil.generateTokenFromUsername(anyString())).thenReturn("test-jwt-token");

        // Act
        AuthResponse response = authService.register(registerRequest);

        // Assert
        assertNotNull(response);
        assertNotNull(response.getToken());
        verify(userRepository, times(1)).findByEmail(registerRequest.getEmail());
        verify(userRepository, times(1)).save(any(User.class));
        verify(analyticsService, times(1)).recordNewUserRegistration();
    }

    @Test
    @DisplayName("Should throw exception when email already exists")
    void testRegisterWithExistingEmail() {
        // Arrange
        when(userRepository.findByEmail(registerRequest.getEmail())).thenReturn(Optional.of(user));

        // Act & Assert
        assertThrows(ValidationException.class, () -> authService.register(registerRequest));
        verify(userRepository, times(1)).findByEmail(registerRequest.getEmail());
    }

    @Test
    @DisplayName("Should throw exception when passwords don't match")
    void testRegisterWithMismatchedPasswords() {
        // Arrange
        registerRequest.setConfirmPassword("differentPassword");

        // Act & Assert
        assertThrows(ValidationException.class, () -> authService.register(registerRequest));
    }

    @Test
    @DisplayName("Should register even with non-standard email format (validation at controller level)")
    void testRegisterWithInvalidEmail() {
        // Arrange
        registerRequest.setEmail("invalid-email");
        when(userRepository.findByEmail("invalid-email")).thenReturn(Optional.empty());
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtUtil.generateTokenFromUsername(anyString())).thenReturn("test-jwt-token");

        // Act & Assert - email validation is done by @Email annotation at controller level
        assertDoesNotThrow(() -> authService.register(registerRequest));
    }

    @Test
    @DisplayName("Should throw exception when password is too short")
    void testRegisterWithShortPassword() {
        // Arrange
        registerRequest.setPassword("short");
        registerRequest.setConfirmPassword("short");

        // Act & Assert - AuthService checks password length >= 6
        assertThrows(ValidationException.class, () -> authService.register(registerRequest));
    }
}
