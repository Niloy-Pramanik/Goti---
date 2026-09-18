package com.prokoi.timetracking;

import com.prokoi.timetracking.dto.CreateTimeLogRequest;
import com.prokoi.timetracking.dto.TimeLogResponse;
import com.prokoi.common.exception.NotFoundException;
import com.prokoi.issues.IssueRepository;
import com.prokoi.issues.Issue;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TimeLogService {

    private final TimeLogRepository timeLogRepository;
    private final IssueRepository issueRepository;

    public TimeLogService(TimeLogRepository timeLogRepository, IssueRepository issueRepository) {
        this.timeLogRepository = timeLogRepository;
        this.issueRepository = issueRepository;
    }

    public TimeLogResponse logTime(UUID userId, CreateTimeLogRequest request) {
        Issue issue = issueRepository.findById(request.getIssueId())
                .orElseThrow(() -> new NotFoundException("Issue not found"));

        TimeLog timeLog = new TimeLog();
        timeLog.setId(UUID.randomUUID());
        timeLog.setUserId(userId);
        timeLog.setIssueId(request.getIssueId());
        timeLog.setDurationMinutes(request.getDurationMinutes());
        timeLog.setDescription(request.getDescription());
        timeLog.setLoggedAt(request.getLoggedAt() != null ? request.getLoggedAt() : ZonedDateTime.now());

        TimeLog saved = timeLogRepository.save(timeLog);
        
        // Populate joined fields for the response
        saved.setIssueTitle(issue.getTitle());
        // Since we don't have projectName directly on issue without a join here, we can leave it empty or query the project.
        // For the creation response, it's fine if it's omitted as the user is likely on the issue page.
        
        return mapToResponse(saved);
    }

    public List<TimeLogResponse> getMyTimeLogs(UUID userId) {
        return timeLogRepository.findByUserIdOrderByLoggedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TimeLogResponse mapToResponse(TimeLog log) {
        TimeLogResponse response = new TimeLogResponse();
        response.setId(log.getId());
        response.setIssueId(log.getIssueId());
        response.setDurationMinutes(log.getDurationMinutes());
        response.setDescription(log.getDescription());
        response.setLoggedAt(log.getLoggedAt());
        response.setIssueTitle(log.getIssueTitle());
        response.setProjectName(log.getProjectName());
        return response;
    }
}
