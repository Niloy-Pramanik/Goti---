package com.prokoi.teams;

import com.prokoi.teams.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Team controller — thin layer per coding-rules.md.
 */
@RestController
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @PostMapping("/api/organizations/{orgId}/teams")
    public ResponseEntity<TeamResponse> create(
            @PathVariable UUID orgId,
            @Valid @RequestBody CreateTeamRequest request,
            Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        TeamResponse response = teamService.createTeam(orgId, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/organizations/{orgId}/teams")
    public ResponseEntity<List<TeamResponse>> listByOrg(
            @PathVariable UUID orgId,
            Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(teamService.listTeams(orgId, userId));
    }

    @GetMapping("/api/teams/{teamId}")
    public ResponseEntity<TeamResponse> getById(
            @PathVariable UUID teamId,
            Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(teamService.getTeam(teamId, userId));
    }

    @PostMapping("/api/teams/{teamId}/members")
    public ResponseEntity<TeamMemberResponse> addMember(
            @PathVariable UUID teamId,
            @Valid @RequestBody AddTeamMemberRequest request,
            Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        TeamMemberResponse response = teamService.addMember(teamId, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/teams/{teamId}/members")
    public ResponseEntity<List<TeamMemberResponse>> listMembers(
            @PathVariable UUID teamId,
            Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(teamService.listMembers(teamId, userId));
    }
}
