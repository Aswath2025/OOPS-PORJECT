package com.examguide.service;

import com.examguide.dto.ScholarshipDTO;
import com.examguide.entity.Scholarship;
import com.examguide.exception.ResourceNotFoundException;
import com.examguide.repository.ScholarshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDate;
import java.util.List;

@Service
public class ScholarshipService {

    private static final Logger logger = LoggerFactory.getLogger(ScholarshipService.class);

    @Autowired
    private ScholarshipRepository scholarshipRepository;

    @Autowired
    private AnalyticsService analyticsService;

    @Transactional
    @CacheEvict(value = {"scholarships", "featuredScholarships"}, allEntries = true)
    public Scholarship createScholarship(ScholarshipDTO scholarshipDTO) {
        logger.info("Creating new scholarship with name: {}", scholarshipDTO.getName());
        Scholarship scholarship = new Scholarship();
        mapDTOToEntity(scholarshipDTO, scholarship);
        Scholarship savedScholarship = scholarshipRepository.save(scholarship);
        logger.debug("Scholarship created successfully with ID: {}", savedScholarship.getId());
        return savedScholarship;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "scholarships", key = "#id")
    public Scholarship getScholarshipById(Long id) {
        logger.debug("Fetching scholarship with ID: {}", id);
        Scholarship scholarship = scholarshipRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Scholarship not found with ID: {}", id);
                    return new ResourceNotFoundException("Scholarship not found with ID: " + id);
                });
        // Track view
        analyticsService.recordScholarshipView();
        logger.info("Scholarship retrieved successfully with ID: {}", id);
        return scholarship;
    }

    @Transactional
    @CacheEvict(value = {"scholarships", "featuredScholarships"}, allEntries = true)
    public Scholarship updateScholarship(Long id, ScholarshipDTO scholarshipDTO) {
        logger.info("Updating scholarship with ID: {}", id);
        Scholarship scholarship = getScholarshipById(id);
        mapDTOToEntity(scholarshipDTO, scholarship);
        Scholarship updatedScholarship = scholarshipRepository.save(scholarship);
        logger.debug("Scholarship updated successfully with ID: {}", id);
        return updatedScholarship;
    }

    @Transactional
    @CacheEvict(value = {"scholarships", "featuredScholarships"}, allEntries = true)
    public void deleteScholarship(Long id) {
        logger.info("Deleting scholarship with ID: {}", id);
        if (!scholarshipRepository.existsById(id)) {
            logger.warn("Attempted to delete non-existent scholarship with ID: {}", id);
            throw new ResourceNotFoundException("Scholarship not found with ID: " + id);
        }
        scholarshipRepository.deleteById(id);
        logger.debug("Scholarship deleted successfully with ID: {}", id);
    }

    @Transactional(readOnly = true)
    public List<Scholarship> getAllScholarships() {
        logger.debug("Fetching all scholarships");
        return scholarshipRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Page<Scholarship> searchScholarships(String keyword, Pageable pageable) {
        logger.debug("Searching scholarships with keyword: {}", keyword);
        return scholarshipRepository.findByNameContainingIgnoreCase(keyword, pageable);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "featuredScholarships")
    public List<Scholarship> getFeaturedScholarships() {
        logger.debug("Fetching featured scholarships");
        return scholarshipRepository.findByIsFeatured(true);
    }

    @Transactional(readOnly = true)
    public List<Scholarship> getActiveScholarships() {
        logger.debug("Fetching active scholarships");
        return scholarshipRepository.findByDeadlineGreaterThan(LocalDate.now());
    }

    @Transactional(readOnly = true)
    public List<Scholarship> getExpiringScholarships(int days) {
        logger.debug("Fetching scholarships expiring within {} days", days);
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(days);
        return scholarshipRepository.findByDeadlineBetween(today, futureDate);
    }

    @Transactional(readOnly = true)
    public List<Scholarship> getSortedByDeadline() {
        logger.debug("Fetching scholarships sorted by deadline");
        return scholarshipRepository.findByOrderByDeadlineAsc();
    }

    @Transactional
    @CacheEvict(value = "scholarships", key = "#id")
    public void incrementViewCount(Long id) {
        logger.debug("Incrementing view count for scholarship ID: {}", id);
        Scholarship scholarship = getScholarshipById(id);
        scholarship.setViewCount(scholarship.getViewCount() + 1);
        scholarshipRepository.save(scholarship);
        analyticsService.recordScholarshipView();
    }

    private void mapDTOToEntity(ScholarshipDTO dto, Scholarship scholarship) {
        if (dto.getName() != null) scholarship.setName(dto.getName());
        if (dto.getProvider() != null) scholarship.setProvider(dto.getProvider());
        if (dto.getAmount() != null) scholarship.setAmount(dto.getAmount());
        if (dto.getDeadline() != null) scholarship.setDeadline(java.time.LocalDate.parse(dto.getDeadline()));
        if (dto.getEligibilityCriteria() != null) scholarship.setEligibilityCriteria(dto.getEligibilityCriteria());
        if (dto.getApplicationLink() != null) scholarship.setApplicationLink(dto.getApplicationLink());
        if (dto.getIsFeatured() != null) scholarship.setIsFeatured(dto.getIsFeatured());
    }
}
