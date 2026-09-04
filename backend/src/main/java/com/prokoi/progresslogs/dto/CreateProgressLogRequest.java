package com.prokoi.progresslogs.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;

public class CreateProgressLogRequest {
    @NotBlank(message = "Comment is required")
    private String comment;

    @Min(0)
    private int delayDays = 0;

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public int getDelayDays() { return delayDays; }
    public void setDelayDays(int delayDays) { this.delayDays = delayDays; }
}
