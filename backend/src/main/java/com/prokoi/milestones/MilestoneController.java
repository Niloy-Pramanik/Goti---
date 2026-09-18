package com.prokoi.milestones;

import com.prokoi.milestones.dto.CreateMilestoneRequest;
import com.prokoi.milestones.dto.MilestoneProgressResponse;
import com.prokoi.milestones.dto.MilestoneResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class MilestoneController {

    private final MilestoneService milestoneService;

    public MilestoneController(MilestoneService milestoneService) {
        this.milestoneService = milestoneService;
    }

    @PostMapping("/api/projects/{projectId}/milestones")
    public ResponseEntity<MilestoneResponse> create(
            @PathVariable UUID projectId,
            @Valid @RequestBody CreateMilestoneRequest request,
            Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        MilestoneResponse response = milestoneService.createMilestone(projectId, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/projects/{projectId}/milestones")
    public ResponseEntity<List<MilestoneResponse>> listByProject(
            @PathVariable UUID projectId,
            Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(milestoneService.listByProject(projectId, userId));
    }

    @GetMapping("/api/milestones/{milestoneId}/progress")
    public ResponseEntity<MilestoneProgressResponse> getProgress(
            @PathVariable UUID milestoneId,
            Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(milestoneService.getProgress(milestoneId, userId));
    }
}
