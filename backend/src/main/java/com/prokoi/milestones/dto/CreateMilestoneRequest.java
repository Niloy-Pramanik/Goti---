package com.prokoi.milestones.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.Instant;

public class CreateMilestoneRequest {
    @NotBlank(message = "Name is required")
    private String name;
    private Instant dueDate;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Instant getDueDate() { return dueDate; }
    public void setDueDate(Instant dueDate) { this.dueDate = dueDate; }
}
