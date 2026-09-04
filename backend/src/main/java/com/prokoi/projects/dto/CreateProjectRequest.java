package com.prokoi.projects.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for creating a project.
 */
public class CreateProjectRequest {

    @NotBlank(message = "Project name is required")
    @Size(min = 2, max = 255, message = "Name must be between 2 and 255 characters")
    private String name;

    private String description;

    @Size(max = 500, message = "Repo link must be under 500 characters")
    private String repoLink;

    @Size(max = 500, message = "Meeting link must be under 500 characters")
    private String meetingLink;

    @Size(max = 500, message = "Storage link must be under 500 characters")
    private String storageLink;

    public CreateProjectRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRepoLink() { return repoLink; }
    public void setRepoLink(String repoLink) { this.repoLink = repoLink; }

    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }

    public String getStorageLink() { return storageLink; }
    public void setStorageLink(String storageLink) { this.storageLink = storageLink; }
}
