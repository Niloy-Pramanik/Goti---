package com.prokoi.teams;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Team member junction model (team_id + user_id + role).
 */
public class TeamMember {

    private UUID teamId;
    private UUID userId;
    private String role;
    private LocalDateTime createdAt;

    // Enriched fields for display
    private String userName;
    private String userEmail;

    public TeamMember() {}

    public TeamMember(UUID teamId, UUID userId, String role, LocalDateTime createdAt) {
        this.teamId = teamId;
        this.userId = userId;
        this.role = role;
        this.createdAt = createdAt;
    }

    public UUID getTeamId() { return teamId; }
    public void setTeamId(UUID teamId) { this.teamId = teamId; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
}
