package com.prokoi.milestones.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.Instant;

public class CreateMilestoneRequest {
    @NotBlank(message = "Name is required")
    private String name;
    private Instant dueDate;
    private String description;
    private String status;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Instant getDueDate() { return dueDate; }
    public void setDueDate(Instant dueDate) { this.dueDate = dueDate; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
