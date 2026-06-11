package com.examguide.controller;

import com.examguide.dto.ExamDTO;
import com.examguide.dto.ScholarshipDTO;
import com.examguide.entity.Exam;
import com.examguide.entity.Scholarship;
import com.examguide.entity.StudyMaterial;
import com.examguide.entity.User;
import com.examguide.service.AdminService;
import com.examguide.service.ExamService;
import com.examguide.service.MaterialService;
import com.examguide.service.ScholarshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private ExamService examService;

    @Autowired
    private ScholarshipService scholarshipService;

    @Autowired
    private MaterialService materialService;

    // Dashboard
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    // User Management
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = adminService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{id}/disable")
    public ResponseEntity<String> disableUser(@PathVariable Long id) {
        adminService.disableUser(id);
        return ResponseEntity.ok("User disabled");
    }

    @PutMapping("/users/{id}/enable")
    public ResponseEntity<String> enableUser(@PathVariable Long id) {
        adminService.enableUser(id);
        return ResponseEntity.ok("User enabled");
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok("User deleted");
    }

    @PutMapping("/users/{id}/promote")
    public ResponseEntity<String> promoteToAdmin(@PathVariable Long id) {
        adminService.promoteToAdmin(id);
        return ResponseEntity.ok("User promoted to admin");
    }

    // Exam Management
    @PostMapping("/exams")
    public ResponseEntity<Exam> createExam(@RequestBody ExamDTO examDTO) {
        com.examguide.entity.Exam exam = examService.createExam(examDTO);
        return ResponseEntity.ok(exam);
    }

    @PutMapping("/exams/{id}")
    public ResponseEntity<com.examguide.entity.Exam> updateExam(@PathVariable Long id, 
                                                                  @RequestBody ExamDTO examDTO) {
        com.examguide.entity.Exam exam = examService.updateExam(id, examDTO);
        return ResponseEntity.ok(exam);
    }

    @DeleteMapping("/exams/{id}")
    public ResponseEntity<String> deleteExam(@PathVariable Long id) {
        examService.deleteExam(id);
        return ResponseEntity.ok("Exam deleted");
    }

    // Scholarship Management
    @PostMapping("/scholarships")
    public ResponseEntity<com.examguide.entity.Scholarship> createScholarship(
            @RequestBody ScholarshipDTO scholarshipDTO) {
        com.examguide.entity.Scholarship scholarship = scholarshipService.createScholarship(scholarshipDTO);
        return ResponseEntity.ok(scholarship);
    }

    @PutMapping("/scholarships/{id}")
    public ResponseEntity<com.examguide.entity.Scholarship> updateScholarship(
            @PathVariable Long id, @RequestBody ScholarshipDTO scholarshipDTO) {
        com.examguide.entity.Scholarship scholarship = scholarshipService.updateScholarship(id, scholarshipDTO);
        return ResponseEntity.ok(scholarship);
    }

    @DeleteMapping("/scholarships/{id}")
    public ResponseEntity<String> deleteScholarship(@PathVariable Long id) {
        scholarshipService.deleteScholarship(id);
        return ResponseEntity.ok("Scholarship deleted");
    }

    // Material Management
    @PostMapping("/materials")
    public ResponseEntity<StudyMaterial> uploadMaterial(@RequestBody StudyMaterial material) {
        StudyMaterial uploaded = materialService.createMaterial(material);
        return ResponseEntity.ok(uploaded);
    }

    @PutMapping("/materials/{id}")
    public ResponseEntity<StudyMaterial> updateMaterial(@PathVariable Long id, 
                                                        @RequestBody StudyMaterial material) {
        StudyMaterial updated = materialService.updateMaterial(id, material);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/materials/{id}")
    public ResponseEntity<String> deleteMaterial(@PathVariable Long id) {
        materialService.deleteMaterial(id);
        return ResponseEntity.ok("Material deleted");
    }
}
