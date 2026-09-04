package com.prokoi.organizations.dto;

import com.prokoi.organizations.Organization;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Organization response DTO.
 */
public class OrganizationResponse {

    private UUID id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private String userRole;

    public OrganizationResponse() {}

    public OrganizationResponse(UUID id, String name, String description,
                                 LocalDateTime createdAt, String userRole) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.userRole = userRole;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }

    public static OrganizationResponse from(Organization org, String userRole) {
        return new OrganizationResponse(
                org.getId(), org.getName(), org.getDescription(),
                org.getCreatedAt(), userRole
        );
    }
}
