package com.examguide.config;

import com.examguide.entity.Exam;
import com.examguide.entity.User;
import com.examguide.entity.Scholarship;
import com.examguide.entity.StudyMaterial;
import com.examguide.repository.ExamRepository;
import com.examguide.repository.ScholarshipRepository;
import com.examguide.repository.MaterialRepository;
import com.examguide.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.datasource.init.ScriptUtils;

import java.time.LocalDate;

@Component
public class DataLoader implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataLoader.class);

    private final ExamRepository examRepository;
    private final ScholarshipRepository scholarshipRepository;
    private final MaterialRepository materialRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DataSource dataSource;

    public DataLoader(ExamRepository examRepository,
                      ScholarshipRepository scholarshipRepository,
                      MaterialRepository materialRepository,
                      UserRepository userRepository,
                      PasswordEncoder passwordEncoder,
                      DataSource dataSource) {
        this.examRepository = examRepository;
        this.scholarshipRepository = scholarshipRepository;
        this.materialRepository = materialRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) {
        if (examRepository.count() == 0) {
            logger.info("No exams found — seeding sample exam data...");
            seedExams();
            logger.info("Executing massive dataset script...");
            try (Connection connection = dataSource.getConnection()) {
                Resource resource = new ClassPathResource("data.sql");
                ScriptUtils.executeSqlScript(connection, resource);
            } catch (Exception ex) {
                logger.error("Failed to execute data.sql", ex);
            }
        }
        if (scholarshipRepository.count() == 0) {
            logger.info("No scholarships found — seeding sample scholarship data...");
            seedScholarships();
        }
        if (materialRepository.count() == 0) {
            logger.info("No study materials found — seeding sample material data...");
            seedMaterials();
        }
        // Ensure admin user exists for local/dev
        ensureAdminUser();
    }

    private void ensureAdminUser() {
        String adminEmail = "admin@examguide.com";
        try {
            userRepository.findByEmail(adminEmail).ifPresentOrElse(u -> {
                // Update existing admin password and ensure role/isActive
                u.setPassword(passwordEncoder.encode("admin123"));
                u.setRole(User.UserRole.ADMIN);
                u.setIsActive(true);
                userRepository.save(u);
                logger.info("Updated admin user password and role: {}", adminEmail);
            }, () -> {
                User admin = new User();
                admin.setFullName("Admin User");
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(User.UserRole.ADMIN);
                admin.setIsActive(true);
                userRepository.save(admin);
                logger.info("Created admin user: {} with password 'admin123'", adminEmail);
            });
        } catch (Exception ex) {
            logger.error("Failed to ensure admin user: {}", ex.getMessage());
        }

        // Also ensure a fallback dev admin exists
        String devEmail = "devadmin@examguide.com";
        try {
            userRepository.findByEmail(devEmail).ifPresentOrElse(u -> {
                u.setPassword(passwordEncoder.encode("devpass123"));
                u.setRole(User.UserRole.ADMIN);
                u.setIsActive(true);
                userRepository.save(u);
                logger.info("Updated dev admin: {}", devEmail);
            }, () -> {
                User admin = new User();
                admin.setFullName("Dev Admin");
                admin.setEmail(devEmail);
                admin.setPassword(passwordEncoder.encode("devpass123"));
                admin.setRole(User.UserRole.ADMIN);
                admin.setIsActive(true);
                userRepository.save(admin);
                logger.info("Created dev admin: {} with password 'devpass123'", devEmail);
            });
        } catch (Exception ex) {
            logger.error("Failed to ensure dev admin user: {}", ex.getMessage());
        }

        // Debug: log current users
        try {
            userRepository.findAll().forEach(u -> logger.info("User in DB: {} (role={}, active={})", u.getEmail(), u.getRole(), u.getIsActive()));
        } catch (Exception ex) {
            logger.error("Failed to list users for debug: {}", ex.getMessage());
        }
    }

    private void seedExams() {
        LocalDate today = LocalDate.now();

        Exam e1 = new Exam();
        e1.setName("IBPS PO 2026");
        e1.setConductingBody("IBPS");
        e1.setOfficialWebsite("https://www.ibps.in");
        e1.setCategory("Banking");
        e1.setLevel("National");
        e1.setMode("Online");
        e1.setNotificationDate(today.minusDays(30));
        e1.setApplicationStartDate(today.minusDays(20));
        e1.setApplicationEndDate(today.plusDays(15));
        e1.setExamDate(today.plusDays(45));
        e1.setEligibilityCriteria("Graduation in any discipline from a recognized university");
        e1.setTotalMarks(100);
        e1.setDuration("60 minutes");
        e1.setNumberOfSubjects(5);
        e1.setIsFeatured(true);
        e1.setIsPublished(true);
        e1.setViewCount(120);
        e1.setBookmarkCount(34);
        examRepository.save(e1);

        Exam e2 = new Exam();
        e2.setName("SBI Clerk 2026");
        e2.setConductingBody("SBI");
        e2.setOfficialWebsite("https://www.sbi.co.in");
        e2.setCategory("Banking");
        e2.setLevel("National");
        e2.setMode("Online");
        e2.setNotificationDate(today.minusDays(15));
        e2.setApplicationStartDate(today.minusDays(10));
        e2.setApplicationEndDate(today.plusDays(20));
        e2.setExamDate(today.plusDays(60));
        e2.setEligibilityCriteria("Intermediate (12th Pass) from a recognized board");
        e2.setTotalMarks(100);
        e2.setDuration("60 minutes");
        e2.setNumberOfSubjects(4);
        e2.setIsFeatured(true);
        e2.setIsPublished(true);
        e2.setViewCount(95);
        e2.setBookmarkCount(22);
        examRepository.save(e2);

        Exam e3 = new Exam();
        e3.setName("UPSC Civil Services 2026");
        e3.setConductingBody("UPSC");
        e3.setOfficialWebsite("https://www.upsc.gov.in");
        e3.setCategory("CivilServices");
        e3.setLevel("National");
        e3.setMode("Offline");
        e3.setNotificationDate(today.minusDays(45));
        e3.setApplicationStartDate(today.minusDays(30));
        e3.setApplicationEndDate(today.plusDays(5));
        e3.setExamDate(today.plusDays(90));
        e3.setEligibilityCriteria("Graduation from a recognized university; Age 21-32 years");
        e3.setTotalMarks(400);
        e3.setDuration("120 minutes");
        e3.setNumberOfSubjects(2);
        e3.setIsFeatured(true);
        e3.setIsPublished(true);
        e3.setViewCount(250);
        e3.setBookmarkCount(78);
        examRepository.save(e3);

        Exam e4 = new Exam();
        e4.setName("GATE 2026 - Computer Science");
        e4.setConductingBody("IIT");
        e4.setOfficialWebsite("https://gate2026.iisc.ac.in");
        e4.setCategory("Engineering");
        e4.setLevel("National");
        e4.setMode("Online");
        e4.setNotificationDate(today.minusDays(60));
        e4.setApplicationStartDate(today.minusDays(50));
        e4.setApplicationEndDate(today.minusDays(10));
        e4.setExamDate(today.plusDays(20));
        e4.setEligibilityCriteria("Graduation or Final Year in Engineering/Science");
        e4.setTotalMarks(100);
        e4.setDuration("180 minutes");
        e4.setNumberOfSubjects(1);
        e4.setIsFeatured(true);
        e4.setIsPublished(true);
        e4.setViewCount(310);
        e4.setBookmarkCount(102);
        examRepository.save(e4);

        Exam e5 = new Exam();
        e5.setName("SSC CGL 2026");
        e5.setConductingBody("SSC");
        e5.setOfficialWebsite("https://ssc.nic.in");
        e5.setCategory("CivilServices");
        e5.setLevel("National");
        e5.setMode("Online");
        e5.setNotificationDate(today.minusDays(10));
        e5.setApplicationStartDate(today.minusDays(5));
        e5.setApplicationEndDate(today.plusDays(25));
        e5.setExamDate(today.plusDays(75));
        e5.setEligibilityCriteria("12th Pass from a recognized board");
        e5.setTotalMarks(200);
        e5.setDuration("120 minutes");
        e5.setNumberOfSubjects(4);
        e5.setIsFeatured(false);
        e5.setIsPublished(true);
        e5.setViewCount(88);
        e5.setBookmarkCount(15);
        examRepository.save(e5);

        Exam e6 = new Exam();
        e6.setName("RBI Grade B 2026");
        e6.setConductingBody("RBI");
        e6.setOfficialWebsite("https://www.rbi.org.in");
        e6.setCategory("Banking");
        e6.setLevel("National");
        e6.setMode("Online");
        e6.setNotificationDate(today.minusDays(5));
        e6.setApplicationStartDate(today);
        e6.setApplicationEndDate(today.plusDays(30));
        e6.setExamDate(today.plusDays(80));
        e6.setEligibilityCriteria("Graduation with minimum 60% marks");
        e6.setTotalMarks(200);
        e6.setDuration("120 minutes");
        e6.setNumberOfSubjects(3);
        e6.setIsFeatured(false);
        e6.setIsPublished(true);
        e6.setViewCount(67);
        e6.setBookmarkCount(19);
        examRepository.save(e6);

        Exam e7 = new Exam();
        e7.setName("NEET UG 2026");
        e7.setConductingBody("NTA");
        e7.setOfficialWebsite("https://neet.nta.nic.in");
        e7.setCategory("Medical");
        e7.setLevel("National");
        e7.setMode("Offline");
        e7.setNotificationDate(today.minusDays(40));
        e7.setApplicationStartDate(today.minusDays(35));
        e7.setApplicationEndDate(today.plusDays(10));
        e7.setExamDate(today.plusDays(50));
        e7.setEligibilityCriteria("12th Pass with Physics, Chemistry and Biology; Age 17+");
        e7.setTotalMarks(720);
        e7.setDuration("200 minutes");
        e7.setNumberOfSubjects(3);
        e7.setIsFeatured(true);
        e7.setIsPublished(true);
        e7.setViewCount(420);
        e7.setBookmarkCount(150);
        examRepository.save(e7);

        logger.info("Seeded {} exams", 7);
    }

    // Add more exams to make total seeded exams 15
    private void seedMoreExams() {
        LocalDate today = LocalDate.now();

        Exam e8 = new Exam();
        e8.setName("CTET 2026");
        e8.setConductingBody("CBSE");
        e8.setOfficialWebsite("https://ctet.nic.in");
        e8.setCategory("Teaching");
        e8.setLevel("National");
        e8.setMode("Offline");
        e8.setNotificationDate(today.minusDays(12));
        e8.setApplicationStartDate(today.minusDays(10));
        e8.setApplicationEndDate(today.plusDays(18));
        e8.setExamDate(today.plusDays(40));
        e8.setEligibilityCriteria("Graduation and BEd for Paper II");
        e8.setTotalMarks(150);
        e8.setDuration("150 minutes");
        e8.setNumberOfSubjects(2);
        e8.setIsFeatured(false);
        e8.setIsPublished(true);
        e8.setViewCount(45);
        e8.setBookmarkCount(5);
        examRepository.save(e8);

        Exam e9 = new Exam();
        e9.setName("AIIMS MBBS 2026");
        e9.setConductingBody("AIIMS");
        e9.setOfficialWebsite("https://aiimsexams.org");
        e9.setCategory("Medical");
        e9.setLevel("National");
        e9.setMode("Online");
        e9.setNotificationDate(today.minusDays(20));
        e9.setApplicationStartDate(today.minusDays(15));
        e9.setApplicationEndDate(today.plusDays(10));
        e9.setExamDate(today.plusDays(55));
        e9.setEligibilityCriteria("12th with PCB and minimum marks as per notification");
        e9.setTotalMarks(720);
        e9.setDuration("240 minutes");
        e9.setNumberOfSubjects(3);
        e9.setIsFeatured(true);
        e9.setIsPublished(true);
        e9.setViewCount(150);
        e9.setBookmarkCount(40);
        examRepository.save(e9);

        Exam e10 = new Exam();
        e10.setName("CLAT 2026");
        e10.setConductingBody("CLAT Consortium");
        e10.setOfficialWebsite("https://clat.ac.in");
        e10.setCategory("Law");
        e10.setLevel("National");
        e10.setMode("Offline");
        e10.setNotificationDate(today.minusDays(8));
        e10.setApplicationStartDate(today.minusDays(5));
        e10.setApplicationEndDate(today.plusDays(25));
        e10.setExamDate(today.plusDays(70));
        e10.setEligibilityCriteria("12th Pass; Age as per participating NLUs");
        e10.setTotalMarks(150);
        e10.setDuration("120 minutes");
        e10.setNumberOfSubjects(1);
        e10.setIsFeatured(false);
        e10.setIsPublished(true);
        e10.setViewCount(60);
        e10.setBookmarkCount(10);
        examRepository.save(e10);

        Exam e11 = new Exam();
        e11.setName("NDA 2026");
        e11.setConductingBody("UPSC");
        e11.setOfficialWebsite("https://upsc.gov.in");
        e11.setCategory("Defense");
        e11.setLevel("National");
        e11.setMode("Offline");
        e11.setNotificationDate(today.minusDays(35));
        e11.setApplicationStartDate(today.minusDays(30));
        e11.setApplicationEndDate(today.plusDays(5));
        e11.setExamDate(today.plusDays(50));
        e11.setEligibilityCriteria("12th Pass with Physics & Maths for Air Force/NA");
        e11.setTotalMarks(900);
        e11.setDuration("300 minutes");
        e11.setNumberOfSubjects(2);
        e11.setIsFeatured(false);
        e11.setIsPublished(true);
        e11.setViewCount(85);
        e11.setBookmarkCount(12);
        examRepository.save(e11);

        Exam e12 = new Exam();
        e12.setName("IBPS Clerk 2026");
        e12.setConductingBody("IBPS");
        e12.setOfficialWebsite("https://www.ibps.in");
        e12.setCategory("Banking");
        e12.setLevel("National");
        e12.setMode("Online");
        e12.setNotificationDate(today.minusDays(7));
        e12.setApplicationStartDate(today.minusDays(3));
        e12.setApplicationEndDate(today.plusDays(30));
        e12.setExamDate(today.plusDays(90));
        e12.setEligibilityCriteria("12th Pass; Local language proficiency as per state");
        e12.setTotalMarks(100);
        e12.setDuration("60 minutes");
        e12.setNumberOfSubjects(3);
        e12.setIsFeatured(false);
        e12.setIsPublished(true);
        e12.setViewCount(40);
        e12.setBookmarkCount(6);
        examRepository.save(e12);

        Exam e13 = new Exam();
        e13.setName("LIC AAO 2026");
        e13.setConductingBody("LIC");
        e13.setOfficialWebsite("https://licindia.in");
        e13.setCategory("Insurance");
        e13.setLevel("National");
        e13.setMode("Online");
        e13.setNotificationDate(today.minusDays(18));
        e13.setApplicationStartDate(today.minusDays(12));
        e13.setApplicationEndDate(today.plusDays(8));
        e13.setExamDate(today.plusDays(35));
        e13.setEligibilityCriteria("Graduation in any discipline; Age 21-30");
        e13.setTotalMarks(200);
        e13.setDuration("120 minutes");
        e13.setNumberOfSubjects(4);
        e13.setIsFeatured(false);
        e13.setIsPublished(true);
        e13.setViewCount(30);
        e13.setBookmarkCount(4);
        examRepository.save(e13);

        Exam e14 = new Exam();
        e14.setName("PGCET 2026");
        e14.setConductingBody("State CET Cell");
        e14.setOfficialWebsite("https://cet.example.com");
        e14.setCategory("Engineering");
        e14.setLevel("State");
        e14.setMode("Offline");
        e14.setNotificationDate(today.minusDays(22));
        e14.setApplicationStartDate(today.minusDays(18));
        e14.setApplicationEndDate(today.plusDays(12));
        e14.setExamDate(today.plusDays(65));
        e14.setEligibilityCriteria("Bachelor's degree in relevant discipline");
        e14.setTotalMarks(100);
        e14.setDuration("180 minutes");
        e14.setNumberOfSubjects(2);
        e14.setIsFeatured(false);
        e14.setIsPublished(true);
        e14.setViewCount(22);
        e14.setBookmarkCount(3);
        examRepository.save(e14);

        Exam e15 = new Exam();
        e15.setName("JEE Advanced 2026");
        e15.setConductingBody("IIT Council");
        e15.setOfficialWebsite("https://jeeadv.ac.in");
        e15.setCategory("Engineering");
        e15.setLevel("National");
        e15.setMode("Online");
        e15.setNotificationDate(today.minusDays(28));
        e15.setApplicationStartDate(today.minusDays(20));
        e15.setApplicationEndDate(today.plusDays(2));
        e15.setExamDate(today.plusDays(30));
        e15.setEligibilityCriteria("Qualified JEE Main; Physics, Chemistry, Maths");
        e15.setTotalMarks(360);
        e15.setDuration("180 minutes");
        e15.setNumberOfSubjects(3);
        e15.setIsFeatured(true);
        e15.setIsPublished(true);
        e15.setViewCount(500);
        e15.setBookmarkCount(210);
        examRepository.save(e15);

        logger.info("Seeded additional {} exams", 8);
    }
    private void seedScholarships() {
        LocalDate today = LocalDate.now();

        Scholarship s1 = new Scholarship();
        s1.setName("National Merit Scholarship 2026");
        s1.setProvider("Ministry of Education");
        s1.setAmount("\u20B950,000/year");
        s1.setDeadline(today.plusDays(40));
        s1.setEligibilityCriteria("Merit-based; Family income below 8 LPA");
        s1.setRequiredDocuments("10th & 12th marksheets, Income certificate, Aadhaar card");
        s1.setApplicationProcess("Apply online through National Scholarship Portal");
        s1.setApplicationLink("https://scholarships.gov.in");
        s1.setIsFeatured(true);
        s1.setIsPublished(true);
        s1.setViewCount(200);
        s1.setSaveCount(55);
        scholarshipRepository.save(s1);

        Scholarship s2 = new Scholarship();
        s2.setName("SC/ST Post-Matric Scholarship");
        s2.setProvider("Government of India");
        s2.setAmount("\u20B940,000/year");
        s2.setDeadline(today.plusDays(55));
        s2.setEligibilityCriteria("SC/ST students pursuing graduation or post-graduation");
        s2.setRequiredDocuments("Caste certificate, Income certificate, Previous marksheets");
        s2.setApplicationProcess("Apply through State Scholarship Portal");
        s2.setApplicationLink("https://scholarships.gov.in");
        s2.setIsFeatured(false);
        s2.setIsPublished(true);
        s2.setViewCount(130);
        s2.setSaveCount(42);
        scholarshipRepository.save(s2);

        Scholarship s3 = new Scholarship();
        s3.setName("INSPIRE Scholarship for Higher Education");
        s3.setProvider("Department of Science & Technology");
        s3.setAmount("\u20B980,000/year");
        s3.setDeadline(today.plusDays(30));
        s3.setEligibilityCriteria("Top 1% in 12th board exams pursuing BSc/Integrated MSc");
        s3.setRequiredDocuments("12th marksheet, College admission proof, Bank details");
        s3.setApplicationProcess("Apply online at INSPIRE portal");
        s3.setApplicationLink("https://online-inspire.gov.in");
        s3.setIsFeatured(true);
        s3.setIsPublished(true);
        s3.setViewCount(175);
        s3.setSaveCount(60);
        scholarshipRepository.save(s3);

        Scholarship s4 = new Scholarship();
        s4.setName("Tata Trusts Education Grant");
        s4.setProvider("Tata Trusts");
        s4.setAmount("\u20B91,00,000");
        s4.setDeadline(today.plusDays(20));
        s4.setEligibilityCriteria("Merit-based; Engineering/Medical students; Any category");
        s4.setRequiredDocuments("Admission letter, Marksheets, Income certificate");
        s4.setApplicationProcess("Apply through Tata Trusts website");
        s4.setApplicationLink("https://www.tatatrusts.org");
        s4.setIsFeatured(true);
        s4.setIsPublished(true);
        s4.setViewCount(90);
        s4.setSaveCount(28);
        scholarshipRepository.save(s4);

        logger.info("Seeded {} scholarships", 4);
    }

    private void seedMaterials() {
        java.util.List<Exam> exams = examRepository.findAll();
        int[] count = {0};

        for (Exam exam : exams) {
            String name = exam.getName();
            String category = exam.getCategory() != null ? exam.getCategory() : "General";
            String level = exam.getLevel() != null ? exam.getLevel() : "National";
            String mode = exam.getMode() != null ? exam.getMode() : "Online";
            Long examId = exam.getId();

            String[][] materials = {
                {name + " Complete Notes PDF",
                 "Comprehensive chapter-wise study notes for " + name + " covering all topics from the " + level + " level syllabus. Includes practice questions and key formulas.",
                 "PDF",
                 "https://example.com/materials/" + examId + "/complete-notes.pdf", null,
                 category.toLowerCase() + ",notes,complete", "350"},

                {name + " Previous Year Papers (2020-2025)",
                 "Collection of " + name + " previous year question papers with detailed answers and solutions from 2020 to 2025.",
                 "PDF",
                 "https://example.com/materials/" + examId + "/pyq-2020-2025.pdf", null,
                 category.toLowerCase() + ",previous-year,practice", "420"},

                {name + " Video Lectures — Full Course",
                 "Comprehensive video lecture series for " + name + " covering all subjects. Taught by expert faculty with 10+ years of experience.",
                 "Video",
                 null, "https://youtube.com/playlist?list=" + name.toLowerCase().replace(" ", "-") + "-full",
                 category.toLowerCase() + ",video,lectures", "280"},

                {name + " Practice Question Bank",
                 "3000+ practice questions for " + name + " with topic-wise difficulty grading. Covers all sections of the exam in " + mode + " format.",
                 "PDF",
                 "https://example.com/materials/" + examId + "/question-bank.pdf", null,
                 category.toLowerCase() + ",practice,questions", "310"},

                {name + " Mock Test Series",
                 "10 full-length mock tests for " + name + " exactly mirroring the exam pattern. Includes detailed performance analytics and solutions.",
                 "Link",
                 null, "https://example.com/mock-tests/" + examId,
                 category.toLowerCase() + ",mock-test,exam-pattern", "260"},

                {name + " Syllabus & Exam Pattern Guide",
                 "Detailed breakdown of " + name + " syllabus, exam pattern, marking scheme, and weightage of each topic. Essential for structured preparation.",
                 "PDF",
                 "https://example.com/materials/" + examId + "/syllabus-guide.pdf", null,
                 category.toLowerCase() + ",syllabus,exam-pattern", "190"},

                {name + " Reasoning & Aptitude Shortcuts",
                 "Quick-revision tricks and shortcuts for Quantitative Aptitude and Logical Reasoning sections of " + name + ". Saves 40% time in the exam.",
                 "PDF",
                 "https://example.com/materials/" + examId + "/shortcuts.pdf", null,
                 category.toLowerCase() + ",reasoning,aptitude,shortcuts", "445"},

                {name + " Current Affairs Digest — 2026",
                 "Monthly current affairs compilation specifically curated for " + name + " candidates. Covers national, international, economy, sports and science.",
                 "Link",
                 null, "https://example.com/current-affairs/" + examId,
                 category.toLowerCase() + ",current-affairs,general-knowledge", "510"},

                {name + " Memory Map & Flash Cards",
                 "Visual memory maps and flash cards for rapid revision of " + name + " topics. Perfect for last-minute revision before the exam.",
                 "PDF",
                 "https://example.com/materials/" + examId + "/flashcards.pdf", null,
                 category.toLowerCase() + ",flashcards,revision,memory", "175"},

                {name + " Expert Strategy & Topper Tips",
                 "Video interviews with " + name + " toppers sharing their preparation strategies, study schedules and exam-day tips.",
                 "Video",
                 null, "https://youtube.com/playlist?list=" + name.toLowerCase().replace(" ", "-") + "-tips",
                 category.toLowerCase() + ",strategy,topper,tips", "340"}
            };

            for (String[] m : materials) {
                StudyMaterial mat = new StudyMaterial();
                mat.setTitle(m[0]);
                mat.setDescription(m[1]);
                mat.setType(m[2]);
                mat.setFileUrl(m[3]);
                mat.setExternalLink(m[4]);
                mat.setExamId(examId);
                mat.setTags(m[5]);
                mat.setIsPublished(true);
                mat.setDownloadCount(Integer.parseInt(m[6]) + (int)(Math.random() * 200));
                materialRepository.save(mat);
                count[0]++;
            }
        }

        logger.info("Seeded {} study materials linked to {} exams", count[0], exams.size());
    }
}

