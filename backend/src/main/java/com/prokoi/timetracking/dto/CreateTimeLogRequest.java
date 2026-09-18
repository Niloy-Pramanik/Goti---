package com.prokoi.timetracking.dto;

import java.time.ZonedDateTime;
import java.util.UUID;

public class CreateTimeLogRequest {
    private UUID issueId;
    private Integer durationMinutes;
    private String description;
    private ZonedDateTime loggedAt;

    public UUID getIssueId() { return issueId; }
    public void setIssueId(UUID issueId) { this.issueId = issueId; }
    
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public ZonedDateTime getLoggedAt() { return loggedAt; }
    public void setLoggedAt(ZonedDateTime loggedAt) { this.loggedAt = loggedAt; }
}
