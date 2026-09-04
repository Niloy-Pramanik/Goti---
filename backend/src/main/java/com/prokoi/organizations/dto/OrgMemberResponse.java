package com.prokoi.organizations.dto;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Response DTO for organization members.
 */
public class OrgMemberResponse {

    private UUID userId;
    private String name;
    private String email;
    private String role;
    private LocalDateTime joinedAt;

    public OrgMemberResponse() {}

    public OrgMemberResponse(UUID userId, String name, String email, String role, LocalDateTime joinedAt) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.joinedAt = joinedAt;
    }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
}
