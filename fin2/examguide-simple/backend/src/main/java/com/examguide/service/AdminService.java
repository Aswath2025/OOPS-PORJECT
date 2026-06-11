package com.examguide.service;

import com.examguide.entity.User;
import com.examguide.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        List<User> allUsers = userRepository.findAll();
        stats.put("totalUsers", allUsers.size());
        stats.put("activeUsers", allUsers.stream().filter(User::getIsActive).count());
        stats.put("adminCount", userRepository.findByRole(User.UserRole.ADMIN).size());
        
        return stats;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void resetUserPassword(Long id, String newPassword) {
        // This would be called with hashed password from controller
        User user = getUserById(id);
        user.setPassword(newPassword);
        userRepository.save(user);
    }

    public void disableUser(Long id) {
        User user = getUserById(id);
        user.setIsActive(false);
        userRepository.save(user);
    }

    public void enableUser(Long id) {
        User user = getUserById(id);
        user.setIsActive(true);
        userRepository.save(user);
    }

    public void promoteToAdmin(Long id) {
        User user = getUserById(id);
        user.setRole(User.UserRole.ADMIN);
        userRepository.save(user);
    }

    public void demoteToUser(Long id) {
        User user = getUserById(id);
        user.setRole(User.UserRole.USER);
        userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
