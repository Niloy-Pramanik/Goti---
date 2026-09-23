package com.prokoi.dashboard.dto;

import java.util.List;
import java.util.UUID;

public class TeamTimelineDTO {
    private UUID memberId;
    private String memberName;
    private String email;
    private List<TaskReportDTO> tasks;

    // Individual tracking stats
    private int totalTimeLoggedMinutes;
    private int totalTasksAssigned;
    private int totalTasksCompleted;
    private int tasksCompletedWithoutTime; // cheating flag

    public TeamTimelineDTO() {}

    public TeamTimelineDTO(UUID memberId, String memberName, String email, List<TaskReportDTO> tasks) {
        this.memberId = memberId;
        this.memberName = memberName;
        this.email = email;
        this.tasks = tasks;
    }

    public UUID getMemberId() { return memberId; }
    public void setMemberId(UUID memberId) { this.memberId = memberId; }
    public String getMemberName() { return memberName; }
    public void setMemberName(String memberName) { this.memberName = memberName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public List<TaskReportDTO> getTasks() { return tasks; }
    public void setTasks(List<TaskReportDTO> tasks) { this.tasks = tasks; }

    public int getTotalTimeLoggedMinutes() { return totalTimeLoggedMinutes; }
    public void setTotalTimeLoggedMinutes(int totalTimeLoggedMinutes) { this.totalTimeLoggedMinutes = totalTimeLoggedMinutes; }
    public int getTotalTasksAssigned() { return totalTasksAssigned; }
    public void setTotalTasksAssigned(int totalTasksAssigned) { this.totalTasksAssigned = totalTasksAssigned; }
    public int getTotalTasksCompleted() { return totalTasksCompleted; }
    public void setTotalTasksCompleted(int totalTasksCompleted) { this.totalTasksCompleted = totalTasksCompleted; }
    public int getTasksCompletedWithoutTime() { return tasksCompletedWithoutTime; }
    public void setTasksCompletedWithoutTime(int tasksCompletedWithoutTime) { this.tasksCompletedWithoutTime = tasksCompletedWithoutTime; }
}
