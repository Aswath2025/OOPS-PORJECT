package com.examguide.service;

import com.examguide.entity.Bookmark;
import com.examguide.entity.Exam;
import com.examguide.entity.Scholarship;
import com.examguide.repository.BookmarkRepository;
import com.examguide.repository.ExamRepository;
import com.examguide.repository.ScholarshipRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("BookmarkService Unit Tests")
class BookmarkServiceTest {

    @Mock
    private BookmarkRepository bookmarkRepository;

    @InjectMocks
    private BookmarkService bookmarkService;

    private Long userId;
    private Long examId;
    private Long scholarshipId;
    private Bookmark bookmark;

    @BeforeEach
    void setUp() {
        userId = 1L;
        examId = 1L;
        scholarshipId = 1L;

        bookmark = new Bookmark();
        bookmark.setId(1L);
        bookmark.setUserId(userId);
        bookmark.setExamId(examId);
        bookmark.setEntityType("EXAM");
    }

    @Test
    @DisplayName("Should add an exam bookmark successfully")
    void testBookmarkExam() {
        when(bookmarkRepository.save(any(Bookmark.class))).thenReturn(bookmark);

        Bookmark result = bookmarkService.bookmarkExam(userId, examId);

        assertNotNull(result);
        verify(bookmarkRepository, times(1)).save(any(Bookmark.class));
    }

    @Test
    @DisplayName("Should add a scholarship bookmark successfully")
    void testBookmarkScholarship() {
        Bookmark scholarshipBookmark = new Bookmark();
        scholarshipBookmark.setId(2L);
        scholarshipBookmark.setUserId(userId);
        scholarshipBookmark.setScholarshipId(scholarshipId);
        scholarshipBookmark.setEntityType("SCHOLARSHIP");

        when(bookmarkRepository.save(any(Bookmark.class))).thenReturn(scholarshipBookmark);

        Bookmark result = bookmarkService.bookmarkScholarship(userId, scholarshipId);

        assertNotNull(result);
        assertEquals("SCHOLARSHIP", result.getEntityType());
        verify(bookmarkRepository, times(1)).save(any(Bookmark.class));
    }

    @Test
    @DisplayName("Should check if exam is bookmarked")
    void testIsExamBookmarked() {
        when(bookmarkRepository.findByUserIdAndExamIdAndEntityType(userId, examId, "EXAM"))
                .thenReturn(Optional.of(bookmark));

        boolean isBookmarked = bookmarkService.isExamBookmarked(userId, examId);

        assertTrue(isBookmarked);
    }

    @Test
    @DisplayName("Should return false when exam is not bookmarked")
    void testIsExamNotBookmarked() {
        when(bookmarkRepository.findByUserIdAndExamIdAndEntityType(userId, examId, "EXAM"))
                .thenReturn(Optional.empty());

        boolean isBookmarked = bookmarkService.isExamBookmarked(userId, examId);

        assertFalse(isBookmarked);
    }

    @Test
    @DisplayName("Should check if scholarship is bookmarked")
    void testIsScholarshipBookmarked() {
        when(bookmarkRepository.findByUserIdAndScholarshipIdAndEntityType(userId, scholarshipId, "SCHOLARSHIP"))
                .thenReturn(Optional.empty());

        boolean isBookmarked = bookmarkService.isScholarshipBookmarked(userId, scholarshipId);

        assertFalse(isBookmarked);
    }

    @Test
    @DisplayName("Should get all bookmarked exams for user")
    void testGetUserExamBookmarks() {
        List<Bookmark> bookmarks = Arrays.asList(bookmark);
        when(bookmarkRepository.findByUserIdAndEntityType(userId, "EXAM"))
                .thenReturn(bookmarks);

        List<Bookmark> result = bookmarkService.getUserExamBookmarks(userId);

        assertEquals(1, result.size());
        verify(bookmarkRepository, times(1)).findByUserIdAndEntityType(userId, "EXAM");
    }

    @Test
    @DisplayName("Should get all bookmarked scholarships for user")
    void testGetUserScholarshipBookmarks() {
        when(bookmarkRepository.findByUserIdAndEntityType(userId, "SCHOLARSHIP"))
                .thenReturn(Arrays.asList());

        List<Bookmark> result = bookmarkService.getUserScholarshipBookmarks(userId);

        assertEquals(0, result.size());
        verify(bookmarkRepository, times(1)).findByUserIdAndEntityType(userId, "SCHOLARSHIP");
    }

    @Test
    @DisplayName("Should remove an exam bookmark")
    void testRemoveExamBookmark() {
        bookmarkService.removeExamBookmark(userId, examId);

        verify(bookmarkRepository, times(1))
                .deleteByUserIdAndExamIdAndEntityType(userId, examId, "EXAM");
    }

    @Test
    @DisplayName("Should remove a scholarship bookmark")
    void testRemoveScholarshipBookmark() {
        bookmarkService.removeScholarshipBookmark(userId, scholarshipId);

        verify(bookmarkRepository, times(1))
                .deleteByUserIdAndScholarshipIdAndEntityType(userId, scholarshipId, "SCHOLARSHIP");
    }
}
