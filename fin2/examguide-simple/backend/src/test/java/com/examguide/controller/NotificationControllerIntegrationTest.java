package com.examguide.controller;

import com.examguide.dto.NotificationDTO;
import com.examguide.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("NotificationController Integration Tests")
class NotificationControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private NotificationService notificationService;

    @Test
    @DisplayName("Should get user notifications successfully")
    void testGetUserNotifications() throws Exception {
        // Arrange
        NotificationDTO dto = new NotificationDTO();
        dto.setId(1L);
        dto.setTitle("Test Notification");
        dto.setMessage("Message");
        dto.setType("INFO");
        dto.setRelatedEntityType("EXAM");
        dto.setRelatedEntityId(1L);
        dto.setIsRead(false);
        dto.setCreatedAt(null);
        dto.setReadAt(null);

        List<NotificationDTO> notifications = Arrays.asList(dto);
        when(notificationService.getUserNotifications(1L)).thenReturn(notifications);

        // Act & Assert
        mockMvc.perform(get("/api/notifications"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should get unread count successfully")
    void testGetUnreadCount() throws Exception {
        // Arrange
        when(notificationService.getUnreadCount(1L)).thenReturn(3);

        // Act & Assert
        mockMvc.perform(get("/api/notifications/unread-count"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should mark notification as read successfully")
    void testMarkAsRead() throws Exception {
        // Act & Assert
        mockMvc.perform(put("/api/notifications/1/read"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should delete notification successfully")
    void testDeleteNotification() throws Exception {
        // Act & Assert
        mockMvc.perform(delete("/api/notifications/1"))
                .andExpect(status().isOk());
    }
}
