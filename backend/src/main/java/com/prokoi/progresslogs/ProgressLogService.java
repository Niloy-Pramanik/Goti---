package com.prokoi.progresslogs;

import com.prokoi.common.exception.ForbiddenException;
import com.prokoi.issues.Issue;
import com.prokoi.issues.IssueService;
import com.prokoi.progresslogs.dto.CreateProgressLogRequest;
import com.prokoi.progresslogs.dto.ProgressLogResponse;
import com.prokoi.users.User;
import com.prokoi.users.UserService;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProgressLogService {

    private final ProgressLogRepository progressLogRepository;
    private final IssueService issueService;
    private final UserService userService;

    public ProgressLogService(ProgressLogRepository progressLogRepository, IssueService issueService, UserService userService) {
        this.progressLogRepository = progressLogRepository;
        this.issueService = issueService;
        this.userService = userService;
    }

    public ProgressLogResponse createLog(UUID issueId, CreateProgressLogRequest request, UUID actorId) {
        // Ensure user has access to issue (this will throw if they aren't in the parent team)
        issueService.getIssue(issueId, actorId);

        ProgressLog log = new ProgressLog();
        log.setId(UUID.randomUUID());
        log.setIssueId(issueId);
        log.setUserId(actorId);
        log.setComment(request.getComment());
        log.setDelayDays(request.getDelayDays());
        log.setCreatedAt(OffsetDateTime.now());

        ProgressLog saved = progressLogRepository.save(log);
        User user = userService.findById(actorId);
        
        return new ProgressLogResponse(
                saved.getId(),
                saved.getIssueId(),
                saved.getUserId(),
                user.getName(),
                saved.getComment(),
                saved.getDelayDays(),
                saved.getCreatedAt()
        );
    }

    public List<ProgressLogResponse> listByIssue(UUID issueId, UUID actorId) {
        // Ensure user has access to issue
        issueService.getIssue(issueId, actorId);

        return progressLogRepository.findByIssueId(issueId).stream()
                .map(log -> {
                    User user = userService.findById(log.getUserId());
                    return new ProgressLogResponse(
                            log.getId(),
                            log.getIssueId(),
                            log.getUserId(),
                            user.getName(),
                            log.getComment(),
                            log.getDelayDays(),
                            log.getCreatedAt()
                    );
                })
                .collect(Collectors.toList());
    }
}
