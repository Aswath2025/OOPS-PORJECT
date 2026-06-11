package com.examguide.service;

import com.examguide.dto.LoginRequest;
import com.examguide.dto.RegisterRequest;
import com.examguide.dto.AuthResponse;
import com.examguide.entity.User;
import com.examguide.exception.ValidationException;
import com.examguide.repository.UserRepository;
import com.examguide.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AnalyticsService analyticsService;

    public AuthResponse login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            String token = jwtUtil.generateToken(authentication);
            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found after authentication"));
            
            if (!user.getIsActive()) {
                throw new ValidationException("User account is disabled");
            }

            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);

            logger.info("User logged in successfully: {}", user.getEmail());
            analyticsService.updateTotalActiveUsers();

            return new AuthResponse(
                    token,
                    "Bearer",
                    user.getId(),
                    user.getEmail(),
                    user.getFullName(),
                    user.getRole().toString()
            );
        } catch (BadCredentialsException e) {
            logger.warn("Login failed: invalid credentials for email {}", loginRequest.getEmail());
            throw new ValidationException("Invalid email or password");
        } catch (Exception e) {
            logger.error("Login error: {}", e.getMessage());
            throw new ValidationException("Login failed: " + e.getMessage());
        }
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        // Validate input
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new ValidationException("Passwords do not match");
        }

        if (registerRequest.getPassword().length() < 6) {
            throw new ValidationException("Password must be at least 6 characters");
        }

        // Check if email already exists
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new ValidationException("Email is already registered");
        }

        try {
            User user = new User();
            user.setFullName(registerRequest.getFullName());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.setRole(User.UserRole.USER);
            user.setIsActive(true);

            User savedUser = userRepository.save(user);

            logger.info("User registered successfully: {}", savedUser.getEmail());
            analyticsService.recordNewUserRegistration();

            String token = jwtUtil.generateTokenFromUsername(savedUser.getEmail());

            return new AuthResponse(
                    token,
                    "Bearer",
                    savedUser.getId(),
                    savedUser.getEmail(),
                    savedUser.getFullName(),
                    savedUser.getRole().toString()
            );
        } catch (Exception e) {
            logger.error("Registration error: {}", e.getMessage());
            throw new ValidationException("Registration failed: " + e.getMessage());
        }
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
