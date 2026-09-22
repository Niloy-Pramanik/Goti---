package com.prokoi.issues.dto;

import java.util.UUID;

public class UpdateIssueRequest {
    private String title;
    private String description;
    private String type;
    private String status;
    private UUID milestoneId;
    private UUID assigneeId;
    private java.time.OffsetDateTime dueDate;
    private boolean updateMilestoneId = false;
    private boolean updateAssigneeId = false;
    private boolean updateDueDate = false;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public UUID getMilestoneId() { return milestoneId; }
    public void setMilestoneId(UUID milestoneId) { 
        this.milestoneId = milestoneId; 
        this.updateMilestoneId = true;
    }
    public boolean isUpdateMilestoneId() { return updateMilestoneId; }

    public UUID getAssigneeId() { return assigneeId; }
    public void setAssigneeId(UUID assigneeId) { 
        this.assigneeId = assigneeId; 
        this.updateAssigneeId = true;
    }
    public boolean isUpdateAssigneeId() { return updateAssigneeId; }

    public java.time.OffsetDateTime getDueDate() { return dueDate; }
    public void setDueDate(java.time.OffsetDateTime dueDate) {
        this.dueDate = dueDate;
        this.updateDueDate = true;
    }
    public boolean isUpdateDueDate() { return updateDueDate; }
}
