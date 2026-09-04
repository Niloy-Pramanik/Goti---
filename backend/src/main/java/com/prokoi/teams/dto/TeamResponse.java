package com.prokoi.teams.dto;

import com.prokoi.teams.Team;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Team response DTO.
 */
public class TeamResponse {

    private UUID id;
    private String name;
    private UUID orgId;
    private LocalDateTime createdAt;
    private String userRole;

    public TeamResponse() {}

    public TeamResponse(UUID id, String name, UUID orgId, LocalDateTime createdAt, String userRole) {
        this.id = id;
        this.name = name;
        this.orgId = orgId;
        this.createdAt = createdAt;
        this.userRole = userRole;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public UUID getOrgId() { return orgId; }
    public void setOrgId(UUID orgId) { this.orgId = orgId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }

    public static TeamResponse from(Team team, String userRole) {
        return new TeamResponse(team.getId(), team.getName(), team.getOrgId(),
                team.getCreatedAt(), userRole);
    }
}
