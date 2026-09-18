package com.prokoi.inbox;

import com.prokoi.inbox.dto.NotificationResponse;
import com.prokoi.common.exception.NotFoundException;
import com.prokoi.users.User;
import com.prokoi.users.UserRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final JdbcTemplate jdbc;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, JdbcTemplate jdbc, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.jdbc = jdbc;
        this.userRepository = userRepository;
    }

    public List<NotificationResponse> getMyNotifications(UUID userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public NotificationResponse markAsRead(UUID notificationId, UUID userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotFoundException("Notification not found"));
                
        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to modify this notification");
        }
        
        notification.setIsRead(true);
        notificationRepository.update(notification);
        return mapToResponse(notification);
    }
    
    public void requestLeave(UUID userId, String reason) {
        User requester = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
        
        // Find all users who are ADMINs in organizations where the requester is a member
        List<UUID> adminIds = jdbc.queryForList(
                "SELECT DISTINCT om_admin.user_id " +
                "FROM organization_members om_admin " +
                "JOIN organization_members om_user ON om_admin.org_id = om_user.org_id " +
                "WHERE om_user.user_id = ? AND om_admin.role = 'ADMIN'",
                UUID.class,
                userId
        );

        for (UUID adminId : adminIds) {
            if (!adminId.equals(userId)) {
                createNotification(adminId, "Leave Request from " + requester.getName(), reason);
            }
        }
    }
    
    // Utility method to create a notification (to be used by other services, e.g. when an issue is assigned)
    public void createNotification(UUID userId, String title, String message) {
        Notification notification = new Notification();
        notification.setId(UUID.randomUUID());
        notification.setUserId(userId);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setIsRead(false);
        notification.setCreatedAt(ZonedDateTime.now());
        notificationRepository.save(notification);
    }

    private NotificationResponse mapToResponse(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setTitle(notification.getTitle());
        response.setMessage(notification.getMessage());
        response.setIsRead(notification.getIsRead());
        response.setCreatedAt(notification.getCreatedAt());
        return response;
    }
}
