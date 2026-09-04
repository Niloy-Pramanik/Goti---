package com.prokoi.teams;

import com.prokoi.common.exception.ConflictException;
import com.prokoi.common.exception.ForbiddenException;
import com.prokoi.common.exception.NotFoundException;
import com.prokoi.organizations.OrganizationService;
import com.prokoi.teams.dto.*;
import com.prokoi.users.User;
import com.prokoi.users.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Team service — business logic + role checks scoped to org/team.
 */
@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final OrganizationService orgService;
    private final UserService userService;

    public TeamService(TeamRepository teamRepository,
                       TeamMemberRepository teamMemberRepository,
                       OrganizationService orgService,
                       UserService userService) {
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.orgService = orgService;
        this.userService = userService;
    }

    /**
     * Create a team inside an org. Only org ADMIN can do this. (FR-3.1)
     * Team creator is auto-assigned LEAD role.
     */
    @Transactional
    public TeamResponse createTeam(UUID orgId, CreateTeamRequest request, UUID actorId) {
        // FR-3.2: org membership check, not just JWT validity
        if (!orgService.isMember(orgId, actorId)) {
            throw new ForbiddenException("You are not a member of this organization");
        }
        if (!orgService.isAdmin(orgId, actorId)) {
            throw new ForbiddenException("Only organization ADMINs can create teams");
        }

        Team team = new Team();
        team.setId(UUID.randomUUID());
        team.setName(request.getName());
        team.setOrgId(orgId);

        Team saved = teamRepository.save(team);

        // Auto-assign creator as LEAD
        teamMemberRepository.save(saved.getId(), actorId, "LEAD");

        return TeamResponse.from(saved, "LEAD");
    }

    /**
     * List teams within an org. Any org member can do this. (FR-3.3)
     */
    public List<TeamResponse> listTeams(UUID orgId, UUID userId) {
        if (!orgService.isMember(orgId, userId)) {
            throw new ForbiddenException("You are not a member of this organization");
        }

        return teamRepository.findByOrgId(orgId).stream()
                .map(team -> {
                    String role = teamMemberRepository.getRole(team.getId(), userId);
                    return TeamResponse.from(team, role);
                })
                .collect(Collectors.toList());
    }

    /**
     * Get team detail. 403 if caller has no relationship to the parent org. (FR-3.4 implied)
     */
    public TeamResponse getTeam(UUID teamId, UUID userId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new NotFoundException("Team not found"));

        if (!orgService.isMember(team.getOrgId(), userId)) {
            throw new ForbiddenException("You are not a member of the parent organization");
        }

        String role = teamMemberRepository.getRole(teamId, userId);
        return TeamResponse.from(team, role);
    }

    /**
     * Add a member to a team. Restricted to team LEAD or org ADMIN.
     * User must be an org member to be added to a team.
     */
    @Transactional
    public TeamMemberResponse addMember(UUID teamId, AddTeamMemberRequest request, UUID actorId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new NotFoundException("Team not found"));

        // Actor must be team LEAD or org ADMIN
        String actorTeamRole = teamMemberRepository.getRole(teamId, actorId);
        boolean isOrgAdmin = orgService.isAdmin(team.getOrgId(), actorId);

        if (!"LEAD".equals(actorTeamRole) && !isOrgAdmin) {
            throw new ForbiddenException("Only team LEADs or org ADMINs can add team members");
        }

        // Find user to add
        User userToAdd = userService.findByEmail(request.getEmail());

        // User must be in the org
        if (!orgService.isMember(team.getOrgId(), userToAdd.getId())) {
            throw new ForbiddenException("User must be a member of the organization first");
        }

        // Check if already a team member
        if (teamMemberRepository.isMember(teamId, userToAdd.getId())) {
            throw new ConflictException("User is already a member of this team");
        }

        teamMemberRepository.save(teamId, userToAdd.getId(), request.getRole());

        return new TeamMemberResponse(
                userToAdd.getId(), userToAdd.getName(), userToAdd.getEmail(),
                request.getRole(), null
        );
    }

    /**
     * List team members. Any org member can see this.
     */
    public List<TeamMemberResponse> listMembers(UUID teamId, UUID userId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new NotFoundException("Team not found"));

        if (!orgService.isMember(team.getOrgId(), userId)) {
            throw new ForbiddenException("You are not a member of the parent organization");
        }

        return teamMemberRepository.findByTeamId(teamId).stream()
                .map(m -> new TeamMemberResponse(
                        m.getUserId(), m.getUserName(), m.getUserEmail(),
                        m.getRole(), m.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    /**
     * Check if a user is a LEAD of the given team. Used by projects module.
     */
    public boolean isLead(UUID teamId, UUID userId) {
        return "LEAD".equals(teamMemberRepository.getRole(teamId, userId));
    }

    /**
     * Check if a user is a member of the given team. Used by projects module.
     */
    public boolean isMember(UUID teamId, UUID userId) {
        return teamMemberRepository.isMember(teamId, userId);
    }

    /**
     * Get team by ID (internal use by other modules).
     */
    public Team getTeamEntity(UUID teamId) {
        return teamRepository.findById(teamId)
                .orElseThrow(() -> new NotFoundException("Team not found"));
    }
}
