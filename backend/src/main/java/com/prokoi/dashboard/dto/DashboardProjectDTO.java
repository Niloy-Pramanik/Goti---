package com.prokoi.dashboard.dto;

import java.util.UUID;

public class DashboardProjectDTO {
    private UUID id;
    private String name;
    private UUID teamId;
    private UUID orgId;

    public DashboardProjectDTO() {}

    public DashboardProjectDTO(UUID id, String name, UUID teamId, UUID orgId) {
        this.id = id;
        this.name = name;
        this.teamId = teamId;
        this.orgId = orgId;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public UUID getTeamId() { return teamId; }
    public void setTeamId(UUID teamId) { this.teamId = teamId; }
    public UUID getOrgId() { return orgId; }
    public void setOrgId(UUID orgId) { this.orgId = orgId; }
}
