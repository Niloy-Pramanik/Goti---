package com.prokoi.issues;

import com.prokoi.common.exception.ForbiddenException;
import com.prokoi.common.exception.NotFoundException;
import com.prokoi.issues.dto.CreateIssueRequest;
import com.prokoi.issues.dto.IssueResponse;
import com.prokoi.issues.dto.UpdateIssueRequest;
import com.prokoi.projects.ProjectService;
import com.prokoi.teams.TeamService;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class IssueService {

    private final IssueRepository issueRepository;
    private final ProjectService projectService;
    private final TeamService teamService;

    public IssueService(IssueRepository issueRepository, ProjectService projectService, TeamService teamService) {
        this.issueRepository = issueRepository;
        this.projectService = projectService;
        this.teamService = teamService;
    }

    public IssueResponse createIssue(UUID projectId, CreateIssueRequest request, UUID actorId) {
        var project = projectService.getProjectEntity(projectId);
        if (!teamService.isMember(project.getTeamId(), actorId)) {
            throw new ForbiddenException("Only team members can create issues in this project");
        }
        
        if (request.getAssigneeId() != null) {
            if (!teamService.isMember(project.getTeamId(), request.getAssigneeId())) {
                throw new ForbiddenException("Assignee must be a member of the team");
            }
        }

        Issue issue = new Issue();
        issue.setId(UUID.randomUUID());
        issue.setProjectId(projectId);
        issue.setMilestoneId(request.getMilestoneId());
        issue.setAssigneeId(request.getAssigneeId());
        issue.setType(request.getType());
        issue.setStatus("TO_DO"); // Default status
        issue.setTitle(request.getTitle());
        issue.setDescription(request.getDescription());
        issue.setCreatedAt(OffsetDateTime.now());

        Issue saved = issueRepository.save(issue);
        return mapToResponse(saved);
    }

    public List<IssueResponse> listByProject(UUID projectId, UUID actorId) {
        var project = projectService.getProjectEntity(projectId);
        if (!teamService.isMember(project.getTeamId(), actorId)) {
            throw new ForbiddenException("Only team members can view issues");
        }

        return issueRepository.findByProjectId(projectId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public IssueResponse updateIssue(UUID issueId, UpdateIssueRequest request, UUID actorId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new NotFoundException("Issue not found"));
        
        var project = projectService.getProjectEntity(issue.getProjectId());
        if (!teamService.isMember(project.getTeamId(), actorId)) {
            throw new ForbiddenException("Only team members can update issues");
        }

        if (request.getTitle() != null) issue.setTitle(request.getTitle());
        if (request.getDescription() != null) issue.setDescription(request.getDescription());
        if (request.getType() != null) issue.setType(request.getType());
        if (request.getStatus() != null) issue.setStatus(request.getStatus());
        
        if (request.isUpdateMilestoneId()) {
            issue.setMilestoneId(request.getMilestoneId());
        }
        
        if (request.isUpdateAssigneeId()) {
            if (request.getAssigneeId() != null && !teamService.isMember(project.getTeamId(), request.getAssigneeId())) {
                throw new ForbiddenException("Assignee must be a member of the team");
            }
            issue.setAssigneeId(request.getAssigneeId());
        }

        issueRepository.update(issue);
        return mapToResponse(issue);
    }
    
    public IssueResponse getIssue(UUID issueId, UUID actorId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new NotFoundException("Issue not found"));
                
        var project = projectService.getProjectEntity(issue.getProjectId());
        if (!teamService.isMember(project.getTeamId(), actorId)) {
            throw new ForbiddenException("Only team members can view this issue");
        }
        
        return mapToResponse(issue);
    }

    private IssueResponse mapToResponse(Issue issue) {
        return new IssueResponse(
                issue.getId(),
                issue.getProjectId(),
                issue.getMilestoneId(),
                issue.getAssigneeId(),
                issue.getType(),
                issue.getStatus(),
                issue.getTitle(),
                issue.getDescription(),
                issue.getCreatedAt()
        );
    }
}
