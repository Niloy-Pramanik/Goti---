package com.prokoi.dashboard.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record MyIssueResponse(
        UUID id,
        UUID projectId,
        String projectName,
        UUID teamId,
        String teamName,
        UUID orgId,
        String orgName,
        UUID milestoneId,
        UUID assigneeId,
        String type,
        String status,
        String title,
        String description,
        OffsetDateTime createdAt
) {}
