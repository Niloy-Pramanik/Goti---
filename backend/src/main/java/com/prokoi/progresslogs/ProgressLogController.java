package com.prokoi.progresslogs;

import com.prokoi.progresslogs.dto.CreateProgressLogRequest;
import com.prokoi.progresslogs.dto.ProgressLogResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class ProgressLogController {

    private final ProgressLogService progressLogService;

    public ProgressLogController(ProgressLogService progressLogService) {
        this.progressLogService = progressLogService;
    }

    @PostMapping("/api/issues/{issueId}/progress")
    public ResponseEntity<ProgressLogResponse> create(
            @PathVariable UUID issueId,
            @Valid @RequestBody CreateProgressLogRequest request,
            Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        ProgressLogResponse response = progressLogService.createLog(issueId, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/issues/{issueId}/progress")
    public ResponseEntity<List<ProgressLogResponse>> listByIssue(
            @PathVariable UUID issueId,
            Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(progressLogService.listByIssue(issueId, userId));
    }
}
