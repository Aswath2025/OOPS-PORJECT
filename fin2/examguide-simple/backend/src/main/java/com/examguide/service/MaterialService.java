package com.examguide.service;

import com.examguide.entity.StudyMaterial;
import com.examguide.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MaterialService {

    @Autowired
    private MaterialRepository materialRepository;

    public StudyMaterial createMaterial(StudyMaterial material) {
        return materialRepository.save(material);
    }

    public StudyMaterial getMaterialById(Long id) {
        return materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));
    }

    public StudyMaterial updateMaterial(Long id, StudyMaterial material) {
        StudyMaterial existing = getMaterialById(id);
        
        if (material.getTitle() != null) existing.setTitle(material.getTitle());
        if (material.getDescription() != null) existing.setDescription(material.getDescription());
        if (material.getType() != null) existing.setType(material.getType());
        if (material.getFileUrl() != null) existing.setFileUrl(material.getFileUrl());
        if (material.getExternalLink() != null) existing.setExternalLink(material.getExternalLink());
        if (material.getTags() != null) existing.setTags(material.getTags());
        if (material.getIsPublished() != null) existing.setIsPublished(material.getIsPublished());

        return materialRepository.save(existing);
    }

    public void deleteMaterial(Long id) {
        materialRepository.deleteById(id);
    }

    public List<StudyMaterial> getAllMaterials() {
        return materialRepository.findAll();
    }

    public Page<StudyMaterial> searchMaterials(String keyword, Pageable pageable) {
        return materialRepository.findByTitleContainingIgnoreCase(keyword, pageable);
    }

    public List<StudyMaterial> getMaterialsByType(String type) {
        return materialRepository.findByType(type);
    }

    public List<StudyMaterial> getMaterialsByExam(Long examId) {
        return materialRepository.findByExamId(examId);
    }

    public List<StudyMaterial> getPublishedMaterials() {
        return materialRepository.findByIsPublished(true);
    }

    public List<StudyMaterial> getMostDownloaded() {
        return materialRepository.findByOrderByDownloadCountDesc();
    }

    public void incrementDownloadCount(Long id) {
        StudyMaterial material = getMaterialById(id);
        material.setDownloadCount(material.getDownloadCount() + 1);
        materialRepository.save(material);
    }
}
