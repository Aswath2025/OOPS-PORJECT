package com.examguide.service;

import com.examguide.dto.NotificationDTO;
import com.examguide.entity.Notification;
import com.examguide.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("NotificationService Unit Tests")
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationService notificationService;

    private Notification notification;
    private Long userId;
    private Long notificationId;

    @BeforeEach
    void setUp() {
        userId = 1L;
        notificationId = 1L;

        notification = new Notification();
        notification.setId(notificationId);
        notification.setUserId(userId);
        notification.setTitle("Test Notification");
        notification.setMessage("This is a test notification");
        notification.setType("INFO");
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());
    }

    @Test
    @DisplayName("Should create a new notification successfully")
    void testCreateNotification() {
        // Arrange
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        // Act
        Notification created = notificationService.createNotification(
                userId, "Test Notification", "Message", "INFO", "EXAM", 1L);

        // Assert
        assertNotNull(created);
        assertEquals(notification.getTitle(), created.getTitle());
        assertEquals(notification.getType(), created.getType());
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    @DisplayName("Should retrieve all user notifications")
    void testGetUserNotifications() {
        // Arrange
        List<Notification> notifications = Arrays.asList(notification);
        when(notificationRepository.findByUserIdOrderByCreatedAtDesc(userId))
                .thenReturn(notifications);

        // Act
        List<NotificationDTO> result = notificationService.getUserNotifications(userId);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(notificationRepository, times(1)).findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Test
    @DisplayName("Should retrieve only unread notifications")
    void testGetUnreadNotifications() {
        // Arrange
        List<Notification> unreadNotifications = Arrays.asList(notification);
        when(notificationRepository.findByUserIdAndIsReadFalse(userId))
                .thenReturn(unreadNotifications);

        // Act
        List<NotificationDTO> result = notificationService.getUnreadNotifications(userId);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(notificationRepository, times(1)).findByUserIdAndIsReadFalse(userId);
    }

    @Test
    @DisplayName("Should count unread notifications")
    void testGetUnreadCount() {
        // Arrange
        when(notificationRepository.countByUserIdAndIsReadFalse(userId)).thenReturn(3);

        // Act
        int count = notificationService.getUnreadCount(userId);

        // Assert
        assertEquals(3, count);
        verify(notificationRepository, times(1)).countByUserIdAndIsReadFalse(userId);
    }

    @Test
    @DisplayName("Should mark notification as read")
    void testMarkAsRead() {
        // Arrange
        when(notificationRepository.findById(notificationId))
                .thenReturn(Optional.of(notification));
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        // Act
        notificationService.markAsRead(notificationId);

        // Assert
        verify(notificationRepository, times(1)).findById(notificationId);
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    @DisplayName("Should mark all user notifications as read")
    void testMarkAllAsRead() {
        // Arrange
        List<Notification> notifications = Arrays.asList(notification);
        when(notificationRepository.findByUserIdAndIsReadFalse(userId))
                .thenReturn(notifications);

        // Act
        notificationService.markAllAsRead(userId);

        // Assert
        verify(notificationRepository, times(1)).findByUserIdAndIsReadFalse(userId);
    }

    @Test
    @DisplayName("Should delete a notification")
    void testDeleteNotification() {
        // Arrange
        when(notificationRepository.existsById(notificationId)).thenReturn(true);

        // Act
        notificationService.deleteNotification(notificationId);

        // Assert
        verify(notificationRepository, times(1)).deleteById(notificationId);
    }

    @Test
    @DisplayName("Should delete all user notifications")
    void testDeleteAllUserNotifications() {
        // Act
        notificationService.deleteAllUserNotifications(userId);

        // Assert
        verify(notificationRepository, times(1)).deleteByUserId(userId);
    }

    @Test
    @DisplayName("Should return empty list when user has no notifications")
    void testGetNotificationsWhenEmpty() {
        // Arrange
        when(notificationRepository.findByUserIdOrderByCreatedAtDesc(userId))
                .thenReturn(Arrays.asList());

        // Act
        List<NotificationDTO> result = notificationService.getUserNotifications(userId);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(notificationRepository, times(1)).findByUserIdOrderByCreatedAtDesc(userId);
    }
}
