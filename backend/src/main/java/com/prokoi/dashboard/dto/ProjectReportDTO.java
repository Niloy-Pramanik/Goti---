package com.prokoi.dashboard.dto;

import java.util.UUID;

public class ProjectReportDTO {
    private UUID id;
    private String name;
    private String orgName;
    private int totalTasks;
    private int completedTasks;
    private int totalTimeLoggedMinutes;

    public ProjectReportDTO() {}

    public ProjectReportDTO(UUID id, String name, String orgName, int totalTasks, int completedTasks, int totalTimeLoggedMinutes) {
        this.id = id;
        this.name = name;
        this.orgName = orgName;
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.totalTimeLoggedMinutes = totalTimeLoggedMinutes;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getOrgName() { return orgName; }
    public void setOrgName(String orgName) { this.orgName = orgName; }
    public int getTotalTasks() { return totalTasks; }
    public void setTotalTasks(int totalTasks) { this.totalTasks = totalTasks; }
    public int getCompletedTasks() { return completedTasks; }
    public void setCompletedTasks(int completedTasks) { this.completedTasks = completedTasks; }
    public int getTotalTimeLoggedMinutes() { return totalTimeLoggedMinutes; }
    public void setTotalTimeLoggedMinutes(int totalTimeLoggedMinutes) { this.totalTimeLoggedMinutes = totalTimeLoggedMinutes; }
}
