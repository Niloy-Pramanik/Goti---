package com.prokoi.dashboard.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class TaskReportDTO {
    private UUID id;
    private String title;
    private String status;
    private String priority;
    private String assigneeName;
    private String projectName;
    private String teamName;
    private String orgName;
    private LocalDateTime dueDate;

    public TaskReportDTO() {}

    public TaskReportDTO(UUID id, String title, String status, String priority, String assigneeName, String projectName, String teamName, String orgName, LocalDateTime dueDate) {
        this.id = id;
        this.title = title;
        this.status = status;
        this.priority = priority;
        this.assigneeName = assigneeName;
        this.projectName = projectName;
        this.teamName = teamName;
        this.orgName = orgName;
        this.dueDate = dueDate;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getAssigneeName() { return assigneeName; }
    public void setAssigneeName(String assigneeName) { this.assigneeName = assigneeName; }
    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }
    public String getOrgName() { return orgName; }
    public void setOrgName(String orgName) { this.orgName = orgName; }
    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }
}
