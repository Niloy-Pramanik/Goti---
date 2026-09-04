package com.prokoi.organizations;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Organization member junction model (org_id + user_id + role).
 */
public class OrganizationMember {

    private UUID orgId;
    private UUID userId;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime joinedAt;

    // Enriched fields for display purposes
    private String userName;
    private String userEmail;

    public OrganizationMember() {}

    public OrganizationMember(UUID orgId, UUID userId, String role, LocalDateTime createdAt) {
        this.orgId = orgId;
        this.userId = userId;
        this.role = role;
        this.createdAt = createdAt;
    }

    public UUID getOrgId() { return orgId; }
    public void setOrgId(UUID orgId) { this.orgId = orgId; }

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

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
}
