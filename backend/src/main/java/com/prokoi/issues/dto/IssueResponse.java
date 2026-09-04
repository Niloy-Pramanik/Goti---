package com.prokoi.issues.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record IssueResponse(
        UUID id,
        UUID projectId,
        UUID milestoneId,
        UUID assigneeId,
        String type,
        String status,
        String title,
        String description,
        OffsetDateTime createdAt
) {}
