package com.prokoi.timetracking;

import com.prokoi.timetracking.dto.CreateTimeLogRequest;
import com.prokoi.timetracking.dto.TimeLogResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.prokoi.users.User;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/time-logs")
public class TimeLogController {

    private final TimeLogService timeLogService;

    public TimeLogController(TimeLogService timeLogService) {
        this.timeLogService = timeLogService;
    }

    @PostMapping
    public ResponseEntity<TimeLogResponse> logTime(Authentication auth, @RequestBody CreateTimeLogRequest request) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(timeLogService.logTime(userId, request));
    }

    @GetMapping("/me")
    public ResponseEntity<List<TimeLogResponse>> getMyTimeLogs(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(timeLogService.getMyTimeLogs(userId));
    }

    @GetMapping("/issue/{issueId}")
    public ResponseEntity<List<TimeLogResponse>> getTimeLogsForIssue(@PathVariable UUID issueId) {
        return ResponseEntity.ok(timeLogService.getTimeLogsForIssue(issueId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTimeLog(Authentication auth, @PathVariable UUID id) {
        UUID userId = (UUID) auth.getPrincipal();
        
        // Try to get global role if possible. The principal is just UUID, so we may not have role directly here.
        // Actually, if we cast auth to UsernamePasswordAuthenticationToken and get principal, it might be User object.
        // Wait, in JwtAuthenticationFilter it sets the principal as UUID. 
        // We'll just pass null for userGlobalRole, and the service will only allow the owner to delete for now,
        // or we fetch the user's role in the service. Let's keep it simple: pass "MEMBER" and we'll fix it if needed.
        // Actually, it's better to get the role from authorities or just let the owner delete.
        String role = auth.getAuthorities().stream().findFirst().map(a -> a.getAuthority()).orElse("");

        timeLogService.deleteTimeLog(userId, id, role);
        return ResponseEntity.noContent().build();
    }
}
