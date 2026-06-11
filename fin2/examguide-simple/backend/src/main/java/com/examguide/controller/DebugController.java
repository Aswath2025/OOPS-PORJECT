package com.examguide.controller;

import com.examguide.entity.User;
import com.examguide.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public/debug")
public class DebugController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users")
    public List<Object> listUsers() {
        return userRepository.findAll().stream()
                .map(u -> {
                    return new Object() {
                        public final Long id = u.getId();
                        public final String email = u.getEmail();
                        public final String fullName = u.getFullName();
                        public final String role = u.getRole() == null ? null : u.getRole().toString();
                        public final Boolean active = u.getIsActive();
                        public final String password = u.getPassword();
                    };
                }).collect(Collectors.toList());
    }
}
