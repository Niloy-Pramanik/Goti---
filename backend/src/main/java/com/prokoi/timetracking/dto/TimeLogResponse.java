package com.prokoi.timetracking.dto;

import java.time.ZonedDateTime;
import java.util.UUID;

public class TimeLogResponse {
    private UUID id;
    private UUID issueId;
    private String issueTitle;
    private String projectName;
    private Integer durationMinutes;
    private String description;
    private ZonedDateTime loggedAt;
    private ZonedDateTime createdAt;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public UUID getIssueId() { return issueId; }
    public void setIssueId(UUID issueId) { this.issueId = issueId; }
    
    public String getIssueTitle() { return issueTitle; }
    public void setIssueTitle(String issueTitle) { this.issueTitle = issueTitle; }
    
    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
    
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public ZonedDateTime getLoggedAt() { return loggedAt; }
    public void setLoggedAt(ZonedDateTime loggedAt) { this.loggedAt = loggedAt; }
    
    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }
}
