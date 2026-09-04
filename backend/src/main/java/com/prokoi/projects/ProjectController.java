package com.prokoi.projects;

import com.prokoi.projects.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Project controller — thin layer per coding-rules.md.
 */
@RestController
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping("/api/teams/{teamId}/projects")
    public ResponseEntity<ProjectResponse> create(
            @PathVariable UUID teamId,
            @Valid @RequestBody CreateProjectRequest request,
            Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        ProjectResponse response = projectService.createProject(teamId, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/teams/{teamId}/projects")
    public ResponseEntity<List<ProjectResponse>> listByTeam(
            @PathVariable UUID teamId,
            Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(projectService.listProjects(teamId, userId));
    }

    @GetMapping("/api/projects/{projectId}")
    public ResponseEntity<ProjectResponse> getById(
            @PathVariable UUID projectId,
            Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(projectService.getProject(projectId, userId));
    }

    @PatchMapping("/api/projects/{projectId}")
    public ResponseEntity<ProjectResponse> updateLinks(
            @PathVariable UUID projectId,
            @Valid @RequestBody UpdateProjectLinksRequest request,
            Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        ProjectResponse response = projectService.updateProjectLinks(projectId, request, userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/api/projects/{projectId}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID projectId,
            Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        projectService.deleteProject(projectId, userId);
        return ResponseEntity.noContent().build();
    }
}
