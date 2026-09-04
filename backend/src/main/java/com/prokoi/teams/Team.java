package com.prokoi.teams;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Team domain model.
 */
public class Team {

    private UUID id;
    private String name;
    private UUID orgId;
    private LocalDateTime createdAt;

    public Team() {}

    public Team(UUID id, String name, UUID orgId, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.orgId = orgId;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public UUID getOrgId() { return orgId; }
    public void setOrgId(UUID orgId) { this.orgId = orgId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
