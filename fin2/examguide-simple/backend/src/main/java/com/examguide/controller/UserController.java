package com.examguide.controller;

import com.examguide.dto.UserDTO;
import com.examguide.entity.User;
import com.examguide.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(Authentication authentication, @RequestBody UserDTO userDTO) {
        User user = userService.getUserByEmail(authentication.getName());
        User updated = userService.updateUserProfile(user.getId(), userDTO);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(Authentication authentication,
                                                 @RequestParam String oldPassword,
                                                 @RequestParam String newPassword) {
        User user = userService.getUserByEmail(authentication.getName());
        userService.changePassword(user.getId(), oldPassword, newPassword);
        return ResponseEntity.ok("Password changed successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
}
