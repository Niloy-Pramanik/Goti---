package com.prokoi.projects;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Project domain model.
 */
public class Project {

    private UUID id;
    private String name;
    private String description;
    private UUID teamId;
    private String repoLink;
    private String meetingLink;
    private String storageLink;
    private LocalDateTime createdAt;

    public Project() {}

    public Project(UUID id, String name, String description, UUID teamId,
                   String repoLink, String meetingLink, String storageLink,
                   LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.teamId = teamId;
        this.repoLink = repoLink;
        this.meetingLink = meetingLink;
        this.storageLink = storageLink;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public UUID getTeamId() { return teamId; }
    public void setTeamId(UUID teamId) { this.teamId = teamId; }

    public String getRepoLink() { return repoLink; }
    public void setRepoLink(String repoLink) { this.repoLink = repoLink; }

    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }

    public String getStorageLink() { return storageLink; }
    public void setStorageLink(String storageLink) { this.storageLink = storageLink; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
