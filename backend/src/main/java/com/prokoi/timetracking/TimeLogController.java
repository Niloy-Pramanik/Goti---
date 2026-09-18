package com.prokoi.timetracking;

import com.prokoi.timetracking.dto.CreateTimeLogRequest;
import com.prokoi.timetracking.dto.TimeLogResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
}
