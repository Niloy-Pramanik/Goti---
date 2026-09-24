package com.prokoi.milestones;

import com.prokoi.common.exception.ForbiddenException;
import com.prokoi.common.exception.NotFoundException;
import com.prokoi.milestones.dto.CreateMilestoneRequest;
import com.prokoi.milestones.dto.MilestoneProgressResponse;
import com.prokoi.milestones.dto.MilestoneResponse;
import com.prokoi.projects.ProjectService;
import com.prokoi.teams.TeamService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final ProjectService projectService;
    private final TeamService teamService;

    public MilestoneService(MilestoneRepository milestoneRepository, ProjectService projectService, TeamService teamService) {
        this.milestoneRepository = milestoneRepository;
        this.projectService = projectService;
        this.teamService = teamService;
    }

    public MilestoneResponse createMilestone(UUID projectId, CreateMilestoneRequest request, UUID actorId) {
        var project = projectService.getProjectEntity(projectId);
        if (!teamService.isLead(project.getTeamId(), actorId)) {
            throw new ForbiddenException("Only team LEADs can create milestones");
        }

        Milestone milestone = new Milestone();
        milestone.setId(UUID.randomUUID());
        milestone.setProjectId(projectId);
        milestone.setName(request.getName());
        milestone.setDueDate(request.getDueDate());
        milestone.setCreatedAt(Instant.now());
        milestone.setDescription(request.getDescription());
        milestone.setStatus(request.getStatus() != null ? request.getStatus() : "PENDING");

        milestoneRepository.create(milestone);
        return mapToResponse(milestone);
    }

    public List<MilestoneResponse> listByProject(UUID projectId, UUID actorId) {
        var project = projectService.getProjectEntity(projectId);
        if (!teamService.isMember(project.getTeamId(), actorId)) {
            throw new ForbiddenException("Only team members can view milestones");
        }

        return milestoneRepository.findByProjectId(projectId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public MilestoneProgressResponse getProgress(UUID milestoneId, UUID actorId) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new NotFoundException("Milestone not found"));
        
        var project = projectService.getProjectEntity(milestone.getProjectId());
        if (!teamService.isMember(project.getTeamId(), actorId)) {
            throw new ForbiddenException("Only team members can view milestone progress");
        }

        return milestoneRepository.getProgress(milestoneId);
    }

    private MilestoneResponse mapToResponse(Milestone milestone) {
        MilestoneProgressResponse progress = milestoneRepository.getProgress(milestone.getId());
        return new MilestoneResponse(
                milestone.getId(),
                milestone.getProjectId(),
                milestone.getName(),
                milestone.getDueDate(),
                milestone.getCreatedAt(),
                milestone.getDescription(),
                milestone.getStatus(),
                (int) progress.totalTasks(),
                (int) progress.completedTasks()
        );
    }
}
