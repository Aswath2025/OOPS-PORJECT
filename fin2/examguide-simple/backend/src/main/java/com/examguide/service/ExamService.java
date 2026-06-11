package com.examguide.service;

import com.examguide.dto.ExamDTO;
import com.examguide.entity.Exam;
import com.examguide.exception.ResourceNotFoundException;
import com.examguide.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExamService {

    private static final Logger logger = LoggerFactory.getLogger(ExamService.class);

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private AnalyticsService analyticsService;

    @Transactional
    @CacheEvict(value = {"exams", "featuredExams"}, allEntries = true)
    public Exam createExam(ExamDTO examDTO) {
        logger.info("Creating new exam with name: {}", examDTO.getName());
        Exam exam = new Exam();
        mapDTOToEntity(examDTO, exam);
        Exam savedExam = examRepository.save(exam);
        logger.debug("Exam created successfully with ID: {}", savedExam.getId());
        return savedExam;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "exams", key = "#id")
    public Exam getExamById(Long id) {
        logger.debug("Fetching exam with ID: {}", id);
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Exam not found with ID: {}", id);
                    return new ResourceNotFoundException("Exam not found with ID: " + id);
                });
        // Track view
        analyticsService.recordExamView();
        logger.info("Exam retrieved successfully with ID: {}", id);
        return exam;
    }

    @Transactional
    @CacheEvict(value = {"exams", "featuredExams"}, allEntries = true)
    public Exam updateExam(Long id, ExamDTO examDTO) {
        logger.info("Updating exam with ID: {}", id);
        Exam exam = getExamById(id);
        mapDTOToEntity(examDTO, exam);
        Exam updatedExam = examRepository.save(exam);
        logger.debug("Exam updated successfully with ID: {}", id);
        return updatedExam;
    }

    @Transactional
    @CacheEvict(value = {"exams", "featuredExams"}, allEntries = true)
    public void deleteExam(Long id) {
        logger.info("Deleting exam with ID: {}", id);
        if (!examRepository.existsById(id)) {
            logger.warn("Attempted to delete non-existent exam with ID: {}", id);
            throw new ResourceNotFoundException("Exam not found with ID: " + id);
        }
        examRepository.deleteById(id);
        logger.debug("Exam deleted successfully with ID: {}", id);
    }

    @Transactional(readOnly = true)
    public List<Exam> getAllExams() {
        logger.debug("Fetching all exams");
        return examRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Page<Exam> getExams(Pageable pageable,
                               String search,
                               String category,
                               String level,
                               String conductingBody,
                               String mode,
                               Integer month) {
        logger.debug("Fetching paged exams via Specification: page={}, size={}, search={}, category={}, level={}, conductingBody={}, mode={}, month={}",
                pageable.getPageNumber(), pageable.getPageSize(), search, category, level, conductingBody, mode, month);

        org.springframework.data.jpa.domain.Specification<Exam> spec = com.examguide.specification.ExamSpecification.filterBy(search, category, level, conductingBody, mode, month);
        return examRepository.findAll(spec, pageable);
    }

    @Transactional(readOnly = true)
    public List<Exam> getAllExamsWithSpec(org.springframework.data.jpa.domain.Specification<Exam> spec) {
        return examRepository.findAll(spec);
    }

    @Transactional(readOnly = true)
    public Page<Exam> searchExams(String keyword, Pageable pageable) {
        logger.debug("Searching exams with keyword: {}", keyword);
        return examRepository.findByNameContainingIgnoreCase(keyword, pageable);
    }

    @Transactional(readOnly = true)
    public List<Exam> getExamsByCategory(String category) {
        logger.debug("Fetching exams by category: {}", category);
        return examRepository.findByCategory(category);
    }

    @Transactional(readOnly = true)
    public List<Exam> getExamsByLevel(String level) {
        logger.debug("Fetching exams by level: {}", level);
        return examRepository.findByLevel(level);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "featuredExams")
    public List<Exam> getFeaturedExams() {
        logger.debug("Fetching featured exams");
        return examRepository.findByIsFeatured(true);
    }

    @Transactional(readOnly = true)
    public List<Exam> getUpcomingExams(int days) {
        logger.debug("Fetching upcoming exams within {} days", days);
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(days);
        return examRepository.findByExamDateBetween(today, futureDate);
    }

    @Transactional(readOnly = true)
    public List<Exam> getSortedByDate() {
        logger.debug("Fetching exams sorted by date");
        return examRepository.findByOrderByExamDateAsc();
    }

    @Transactional(readOnly = true)
    public List<Exam> getSortedByPopularity() {
        logger.debug("Fetching exams sorted by popularity");
        return examRepository.findByOrderByViewCountDesc();
    }

    @Transactional
    @CacheEvict(value = "exams", key = "#id")
    public void incrementViewCount(Long id) {
        logger.debug("Incrementing view count for exam ID: {}", id);
        Exam exam = getExamById(id);
        Integer current = exam.getViewCount();
        exam.setViewCount((current == null ? 0 : current) + 1);
        examRepository.save(exam);
        analyticsService.recordExamView();
    }

    @Transactional
    @CacheEvict(value = "exams", key = "#id")
    public void incrementBookmarkCount(Long id) {
        logger.debug("Incrementing bookmark count for exam ID: {}", id);
        Exam exam = getExamById(id);
        Integer bc = exam.getBookmarkCount();
        exam.setBookmarkCount((bc == null ? 0 : bc) + 1);
        examRepository.save(exam);
    }

    private void mapDTOToEntity(ExamDTO dto, Exam exam) {
        if (dto.getName() != null) exam.setName(dto.getName());
        if (dto.getConductingBody() != null) exam.setConductingBody(dto.getConductingBody());
        if (dto.getOfficialWebsite() != null) exam.setOfficialWebsite(dto.getOfficialWebsite());
        if (dto.getCategory() != null) exam.setCategory(dto.getCategory());
        if (dto.getLevel() != null) exam.setLevel(dto.getLevel());
        if (dto.getMode() != null) exam.setMode(dto.getMode());
        if (dto.getEligibilityCriteria() != null) exam.setEligibilityCriteria(dto.getEligibilityCriteria());
        if (dto.getExamPattern() != null) exam.setExamPattern(dto.getExamPattern());
        if (dto.getTotalMarks() != null) exam.setTotalMarks(dto.getTotalMarks());
        if (dto.getDuration() != null) exam.setDuration(dto.getDuration());
        if (dto.getSyllabus() != null) exam.setSyllabus(dto.getSyllabus());
        if (dto.getIsFeatured() != null) exam.setIsFeatured(dto.getIsFeatured());
    }
}
