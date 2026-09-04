package com.prokoi.invitations;

import com.prokoi.common.exception.ConflictException;
import com.prokoi.common.exception.ForbiddenException;
import com.prokoi.common.exception.NotFoundException;
import com.prokoi.invitations.dto.CreateInvitationRequest;
import com.prokoi.invitations.dto.InvitationResponse;
import com.prokoi.organizations.Organization;
import com.prokoi.organizations.OrganizationRepository;
import com.prokoi.teams.Team;
import com.prokoi.teams.TeamRepository;
import com.prokoi.teams.TeamMemberRepository;
import com.prokoi.users.User;
import com.prokoi.users.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;

@Service
public class InvitationService {

    private final InvitationRepository invitationRepository;
    private final OrganizationRepository orgRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserService userService;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    private static final int TOKEN_LENGTH = 32;
    private static final int EXPIRY_DAYS = 7;

    public InvitationService(InvitationRepository invitationRepository,
                             OrganizationRepository orgRepository,
                             TeamRepository teamRepository,
                             TeamMemberRepository teamMemberRepository,
                             UserService userService) {
        this.invitationRepository = invitationRepository;
        this.orgRepository = orgRepository;
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.userService = userService;
    }

    @Transactional
    public InvitationResponse createOrgInvitation(UUID orgId, CreateInvitationRequest request, UUID actorId) {
        Organization org = orgRepository.findById(orgId)
                .orElseThrow(() -> new NotFoundException("Organization not found"));

        if (invitationRepository.hasPendingInvitation(orgId, request.getEmail())) {
            throw new ConflictException("A pending invitation already exists for this email");
        }

        User actor = userService.findById(actorId);
        String token = generateToken();

        Invitation invitation = new Invitation();
        invitation.setId(UUID.randomUUID());
        invitation.setOrgId(orgId);
        invitation.setEmail(request.getEmail());
        invitation.setRole(request.getRole());
        invitation.setToken(token);
        invitation.setInvitedBy(actorId);
        invitation.setAccepted(false);
        invitation.setCreatedAt(LocalDateTime.now());
        invitation.setExpiresAt(LocalDateTime.now().plusDays(EXPIRY_DAYS));

        invitationRepository.save(invitation);

        return InvitationResponse.from(invitation, org.getName(), actor.getName(), frontendUrl);
    }

    @Transactional
    public InvitationResponse createTeamInvitation(UUID teamId, CreateInvitationRequest request, UUID actorId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new NotFoundException("Team not found"));

        Organization org = orgRepository.findById(team.getOrgId())
                .orElseThrow(() -> new NotFoundException("Organization not found"));

        if (invitationRepository.hasPendingTeamInvitation(teamId, request.getEmail())) {
            throw new ConflictException("A pending invitation already exists for this email");
        }

        User actor = userService.findById(actorId);
        String token = generateToken();

        Invitation invitation = new Invitation();
        invitation.setId(UUID.randomUUID());
        invitation.setOrgId(team.getOrgId());
        invitation.setTeamId(teamId);
        invitation.setEmail(request.getEmail());
        invitation.setRole(request.getRole());
        invitation.setToken(token);
        invitation.setInvitedBy(actorId);
        invitation.setAccepted(false);
        invitation.setCreatedAt(LocalDateTime.now());
        invitation.setExpiresAt(LocalDateTime.now().plusDays(EXPIRY_DAYS));

        invitationRepository.save(invitation);

        return InvitationResponse.from(invitation, org.getName(), actor.getName(), frontendUrl, team.getName());
    }

    @Transactional
    public void acceptInvitation(String token, UUID userId) {
        Invitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(() -> new NotFoundException("Invalid invitation link"));

        if (invitation.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ForbiddenException("This invitation has expired");
        }

        // No email check — anyone with the link can accept
        // Add user to organization (idempotent — ON CONFLICT DO NOTHING)
        addMemberToOrg(invitation.getOrgId(), userId, invitation.getRole());

        // If it's a team invitation, also add to team
        if (invitation.getTeamId() != null) {
            addMemberToTeam(invitation.getTeamId(), userId, "MEMBER");
        }
    }

    private void addMemberToOrg(UUID orgId, UUID userId, String role) {
        orgRepository.addMember(orgId, userId, role);
    }

    private void addMemberToTeam(UUID teamId, UUID userId, String role) {
        teamMemberRepository.save(teamId, userId, role);
    }

    public InvitationDetails getByToken(String token) {
        Invitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(() -> new NotFoundException("Invalid invitation link"));

        Organization org = orgRepository.findById(invitation.getOrgId())
                .orElseThrow(() -> new NotFoundException("Organization not found"));

        InvitationDetails details = new InvitationDetails();
        details.setOrganizationName(org.getName());
        details.setOrganizationDescription(org.getDescription());
        details.setEmail(invitation.getEmail());
        details.setRole(invitation.getRole());
        details.setExpiresAt(invitation.getExpiresAt());
        details.setAccepted(invitation.isAccepted());
        details.setTeamInvite(invitation.getTeamId() != null);

        if (invitation.getTeamId() != null) {
            Team team = teamRepository.findById(invitation.getTeamId())
                    .orElseThrow(() -> new NotFoundException("Team not found"));
            details.setTeamName(team.getName());
        }

        return details;
    }

    private String generateToken() {
        byte[] bytes = new byte[TOKEN_LENGTH];
        new SecureRandom().nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    public static class InvitationDetails {
        private String organizationName;
        private String organizationDescription;
        private String email;
        private String role;
        private LocalDateTime expiresAt;
        private boolean accepted;
        private boolean teamInvite;
        private String teamName;

        public String getOrganizationName() { return organizationName; }
        public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }
        public String getOrganizationDescription() { return organizationDescription; }
        public void setOrganizationDescription(String organizationDescription) { this.organizationDescription = organizationDescription; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public LocalDateTime getExpiresAt() { return expiresAt; }
        public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
        public boolean isAccepted() { return accepted; }
        public void setAccepted(boolean accepted) { this.accepted = accepted; }
        public boolean isTeamInvite() { return teamInvite; }
        public void setTeamInvite(boolean teamInvite) { this.teamInvite = teamInvite; }
        public String getTeamName() { return teamName; }
        public void setTeamName(String teamName) { this.teamName = teamName; }
    }
}
