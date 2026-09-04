package com.prokoi.progresslogs.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ProgressLogResponse(
        UUID id,
        UUID issueId,
        UUID userId,
        String userName,
        String comment,
        int delayDays,
        OffsetDateTime createdAt
) {}
