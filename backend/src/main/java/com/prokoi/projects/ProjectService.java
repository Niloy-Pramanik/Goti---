package com.prokoi.projects;

import com.prokoi.common.exception.ForbiddenException;
import com.prokoi.common.exception.NotFoundException;
import com.prokoi.projects.dto.*;
import com.prokoi.teams.Team;
import com.prokoi.teams.TeamService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Project service — business logic + team-scoped role checks.
 */
@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TeamService teamService;

    public ProjectService(ProjectRepository projectRepository, TeamService teamService) {
        this.projectRepository = projectRepository;
        this.teamService = teamService;
    }

    /**
     * Create a project under a team. Team LEAD only. (FR-4.1)
     */
    @Transactional
    public ProjectResponse createProject(UUID teamId, CreateProjectRequest request, UUID actorId) {
        // Verify team exists (also validates org membership)
        teamService.getTeam(teamId, actorId);

        if (!teamService.isLead(teamId, actorId)) {
            throw new ForbiddenException("Only team LEADs can create projects");
        }

        Project project = new Project();
        project.setId(UUID.randomUUID());
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setTeamId(teamId);
        project.setRepoLink(request.getRepoLink());
        project.setMeetingLink(request.getMeetingLink());
        project.setStorageLink(request.getStorageLink());

        Project saved = projectRepository.save(project);
        return ProjectResponse.from(saved);
    }

    /**
     * List projects belonging to a team. Any team member can do this. (FR-4.2)
     */
    public List<ProjectResponse> listProjects(UUID teamId, UUID userId) {
        // Verify team membership (via org membership check in TeamService)
        teamService.getTeam(teamId, userId);

        return projectRepository.findByTeamId(teamId).stream()
                .map(ProjectResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * Get project detail. Team member of parent team. (FR-4.2)
     */
    public ProjectResponse getProject(UUID projectId, UUID userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("Project not found"));

        // Verify user is in parent org (via team check)
        Team team = teamService.getTeamEntity(project.getTeamId());
        if (!teamService.isMember(project.getTeamId(), userId)) {
            // Fallback: check if user is at least in the org
            teamService.getTeam(project.getTeamId(), userId);
        }

        return ProjectResponse.from(project);
    }

    /**
     * Update resource links. LEAD only. (FR-4.3)
     */
    @Transactional
    public ProjectResponse updateProjectLinks(UUID projectId, UpdateProjectLinksRequest request, UUID actorId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("Project not found"));

        if (!teamService.isLead(project.getTeamId(), actorId)) {
            throw new ForbiddenException("Only team LEADs can update project resource links");
        }

        projectRepository.updateResourceLinks(
                projectId,
                request.getRepoLink(),
                request.getMeetingLink(),
                request.getStorageLink()
        );

        return ProjectResponse.from(
                projectRepository.findById(projectId).orElseThrow()
        );
    }

    /**
     * Delete a project. LEAD only. (FR-4.4)
     */
    @Transactional
    public void deleteProject(UUID projectId, UUID actorId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("Project not found"));

        if (!teamService.isLead(project.getTeamId(), actorId)) {
            throw new ForbiddenException("Only team LEADs can delete projects");
        }

        projectRepository.deleteById(projectId);
    }
    
    /**
     * Get project entity by ID for internal use.
     */
    public Project getProjectEntity(UUID projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("Project not found"));
    }
}
