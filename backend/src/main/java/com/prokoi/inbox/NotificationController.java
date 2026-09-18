package com.prokoi.inbox;

import com.prokoi.inbox.dto.LeaveRequestDto;
import com.prokoi.inbox.dto.NotificationResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(notificationService.getMyNotifications(userId));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(Authentication auth, @PathVariable UUID id) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(notificationService.markAsRead(id, userId));
    }

    @PostMapping("/leave-request")
    public ResponseEntity<Void> requestLeave(Authentication auth, @RequestBody LeaveRequestDto request) {
        UUID userId = (UUID) auth.getPrincipal();
        notificationService.requestLeave(userId, request.getReason());
        return ResponseEntity.ok().build();
    }
}
