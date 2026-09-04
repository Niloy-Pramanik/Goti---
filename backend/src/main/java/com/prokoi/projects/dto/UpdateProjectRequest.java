package com.prokoi.projects.dto;

import jakarta.validation.constraints.Size;

/**
 * Request DTO for patching project resource links.
 * All fields optional — only non-null values are applied.
 */
public class UpdateProjectLinksRequest {

    @Size(max = 500, message = "Repo link must be under 500 characters")
    private String repoLink;

    @Size(max = 500, message = "Meeting link must be under 500 characters")
    private String meetingLink;

    @Size(max = 500, message = "Storage link must be under 500 characters")
    private String storageLink;

    public UpdateProjectLinksRequest() {}

    public String getRepoLink() { return repoLink; }
    public void setRepoLink(String repoLink) { this.repoLink = repoLink; }

    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }

    public String getStorageLink() { return storageLink; }
    public void setStorageLink(String storageLink) { this.storageLink = storageLink; }
}
