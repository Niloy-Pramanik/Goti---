package com.prokoi.milestones.dto;

import java.time.Instant;
import java.util.UUID;

public record MilestoneResponse(
    UUID id,
    UUID projectId,
    String name,
    Instant dueDate,
    Instant createdAt
) {}
