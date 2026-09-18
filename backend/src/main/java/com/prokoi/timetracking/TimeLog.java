package com.prokoi.timetracking;

import java.time.ZonedDateTime;
import java.util.UUID;

public class TimeLog {
    private UUID id;
    private UUID userId;
    private UUID issueId;
    private Integer durationMinutes;
    private String description;
    private ZonedDateTime loggedAt;
    
    // Virtual fields joined from DB
    private String issueTitle;
    private String projectName;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    
    public UUID getIssueId() { return issueId; }
    public void setIssueId(UUID issueId) { this.issueId = issueId; }
    
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public ZonedDateTime getLoggedAt() { return loggedAt; }
    public void setLoggedAt(ZonedDateTime loggedAt) { this.loggedAt = loggedAt; }

    public String getIssueTitle() { return issueTitle; }
    public void setIssueTitle(String issueTitle) { this.issueTitle = issueTitle; }

    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
}
