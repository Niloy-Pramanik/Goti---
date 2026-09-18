package com.prokoi.dashboard.dto;

public class ReportResponse {
    private int totalProjects;
    private int totalMembers;
    private int totalIssues;
    private int completedIssues;
    private int totalTimeLoggedMinutes;
    private int totalTeams;

    public ReportResponse() {}

    public ReportResponse(int totalProjects, int totalMembers, int totalIssues, int completedIssues, int totalTimeLoggedMinutes, int totalTeams) {
        this.totalProjects = totalProjects;
        this.totalMembers = totalMembers;
        this.totalIssues = totalIssues;
        this.completedIssues = completedIssues;
        this.totalTimeLoggedMinutes = totalTimeLoggedMinutes;
        this.totalTeams = totalTeams;
    }

    public int getTotalProjects() { return totalProjects; }
    public void setTotalProjects(int totalProjects) { this.totalProjects = totalProjects; }

    public int getTotalMembers() { return totalMembers; }
    public void setTotalMembers(int totalMembers) { this.totalMembers = totalMembers; }

    public int getTotalIssues() { return totalIssues; }
    public void setTotalIssues(int totalIssues) { this.totalIssues = totalIssues; }

    public int getCompletedIssues() { return completedIssues; }
    public void setCompletedIssues(int completedIssues) { this.completedIssues = completedIssues; }

    public int getTotalTimeLoggedMinutes() { return totalTimeLoggedMinutes; }
    public void setTotalTimeLoggedMinutes(int totalTimeLoggedMinutes) { this.totalTimeLoggedMinutes = totalTimeLoggedMinutes; }
    
    public int getTotalTeams() { return totalTeams; }
    public void setTotalTeams(int totalTeams) { this.totalTeams = totalTeams; }
}
