package com.examguide.controller;

import com.examguide.entity.StudyMaterial;
import com.examguide.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    @GetMapping
    public ResponseEntity<List<StudyMaterial>> getAllMaterials() {
        List<StudyMaterial> materials = materialService.getAllMaterials();
        return ResponseEntity.ok(materials);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudyMaterial> getMaterialById(@PathVariable Long id) {
        StudyMaterial material = materialService.getMaterialById(id);
        return ResponseEntity.ok(material);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<StudyMaterial>> searchMaterials(@RequestParam String keyword,
                                                              @RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<StudyMaterial> results = materialService.searchMaterials(keyword, pageable);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<StudyMaterial>> getMaterialsByType(@PathVariable String type) {
        List<StudyMaterial> materials = materialService.getMaterialsByType(type);
        return ResponseEntity.ok(materials);
    }

    @GetMapping("/exam/{examId}")
    public ResponseEntity<List<StudyMaterial>> getMaterialsByExam(@PathVariable Long examId) {
        List<StudyMaterial> materials = materialService.getMaterialsByExam(examId);
        return ResponseEntity.ok(materials);
    }

    @GetMapping("/popular")
    public ResponseEntity<List<StudyMaterial>> getMostDownloaded() {
        List<StudyMaterial> materials = materialService.getMostDownloaded();
        return ResponseEntity.ok(materials);
    }

    @PostMapping("/{id}/download")
    public ResponseEntity<String> incrementDownloadCount(@PathVariable Long id) {
        materialService.incrementDownloadCount(id);
        return ResponseEntity.ok("Download count incremented");
    }
}
