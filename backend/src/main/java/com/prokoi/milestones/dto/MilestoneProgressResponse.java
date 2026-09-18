package com.prokoi.milestones.dto;

public record MilestoneProgressResponse(
    long totalTasks,
    long completedTasks,
    double progressPercentage
) {}
