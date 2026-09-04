package com.prokoi.issues;

import com.prokoi.issues.dto.CreateIssueRequest;
import com.prokoi.issues.dto.IssueResponse;
import com.prokoi.issues.dto.UpdateIssueRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    @PostMapping("/api/projects/{projectId}/issues")
    public ResponseEntity<IssueResponse> create(
            @PathVariable UUID projectId,
            @Valid @RequestBody CreateIssueRequest request,
            Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        IssueResponse response = issueService.createIssue(projectId, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/projects/{projectId}/issues")
    public ResponseEntity<List<IssueResponse>> listByProject(
            @PathVariable UUID projectId,
            Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(issueService.listByProject(projectId, userId));
    }

    @GetMapping("/api/issues/{issueId}")
    public ResponseEntity<IssueResponse> getById(
            @PathVariable UUID issueId,
            Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(issueService.getIssue(issueId, userId));
    }

    @PatchMapping("/api/issues/{issueId}")
    public ResponseEntity<IssueResponse> update(
            @PathVariable UUID issueId,
            @Valid @RequestBody UpdateIssueRequest request,
            Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        IssueResponse response = issueService.updateIssue(issueId, request, userId);
        return ResponseEntity.ok(response);
    }
}
