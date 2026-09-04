package com.prokoi.organizations;

import com.prokoi.common.exception.ConflictException;
import com.prokoi.common.exception.ForbiddenException;
import com.prokoi.common.exception.NotFoundException;
import com.prokoi.organizations.dto.*;
import com.prokoi.users.User;
import com.prokoi.users.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Organization service — business logic + role checks.
 * Role checks are scoped to the specific org, not global roles.
 */
@Service
public class OrganizationService {

    private final OrganizationRepository orgRepository;
    private final OrganizationMemberRepository memberRepository;
    private final UserService userService;

    public OrganizationService(OrganizationRepository orgRepository,
                                OrganizationMemberRepository memberRepository,
                                UserService userService) {
        this.orgRepository = orgRepository;
        this.memberRepository = memberRepository;
        this.userService = userService;
    }

    /**
     * Create an organization. Creator is auto-assigned ADMIN role. (FR-2.1)
     */
    @Transactional
    public OrganizationResponse createOrganization(CreateOrganizationRequest request, UUID creatorId) {
        Organization org = new Organization();
        org.setId(UUID.randomUUID());
        org.setName(request.getName());
        org.setDescription(request.getDescription());

        Organization saved = orgRepository.save(org);

        // Auto-assign creator as ADMIN
        memberRepository.save(saved.getId(), creatorId, "ADMIN");

        return OrganizationResponse.from(saved, "ADMIN");
    }

    /**
     * List organizations the caller belongs to. (FR-2.2)
     */
    public List<OrganizationResponse> listUserOrganizations(UUID userId) {
        return orgRepository.findByUserId(userId).stream()
                .map(org -> {
                    String role = memberRepository.getRole(org.getId(), userId);
                    return OrganizationResponse.from(org, role);
                })
                .collect(Collectors.toList());
    }

    /**
     * Get org detail. 403 if caller isn't a member. (FR-2.4)
     */
    public OrganizationResponse getOrganization(UUID orgId, UUID userId) {
        Organization org = orgRepository.findById(orgId)
                .orElseThrow(() -> new NotFoundException("Organization not found"));

        if (!memberRepository.isMember(orgId, userId)) {
            throw new ForbiddenException("You are not a member of this organization");
        }

        String role = memberRepository.getRole(orgId, userId);
        return OrganizationResponse.from(org, role);
    }

    /**
     * Add a member to an org. Only ADMIN of that org can do this. (FR-2.3)
     * Role escalation guard: a MEMBER cannot add someone as ADMIN.
     */
    @Transactional
    public OrgMemberResponse addMember(UUID orgId, AddOrgMemberRequest request, UUID actorId) {
        // Verify org exists
        orgRepository.findById(orgId)
                .orElseThrow(() -> new NotFoundException("Organization not found"));

        // Check actor is ADMIN of this org
        String actorRole = memberRepository.getRole(orgId, actorId);
        if (!"ADMIN".equals(actorRole)) {
            throw new ForbiddenException("Only organization ADMINs can add members");
        }

        // Find the user to add by email
        User userToAdd = userService.findByEmail(request.getEmail());

        // Check if already a member
        if (memberRepository.isMember(orgId, userToAdd.getId())) {
            throw new ConflictException("User is already a member of this organization");
        }

        memberRepository.save(orgId, userToAdd.getId(), request.getRole());

        return new OrgMemberResponse(
                userToAdd.getId(), userToAdd.getName(), userToAdd.getEmail(),
                request.getRole(), null
        );
    }

    /**
     * List members of an org. Only org members can see this.
     */
    public List<OrgMemberResponse> listMembers(UUID orgId, UUID userId) {
        // Verify org exists
        orgRepository.findById(orgId)
                .orElseThrow(() -> new NotFoundException("Organization not found"));

        if (!memberRepository.isMember(orgId, userId)) {
            throw new ForbiddenException("You are not a member of this organization");
        }

        return memberRepository.findByOrgId(orgId).stream()
                .map(m -> new OrgMemberResponse(
                        m.getUserId(), m.getUserName(), m.getUserEmail(),
                        m.getRole(), m.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    /**
     * Check if a user is an admin of the given org. Used by other modules.
     */
    public boolean isAdmin(UUID orgId, UUID userId) {
        return "ADMIN".equals(memberRepository.getRole(orgId, userId));
    }

    /**
     * Check if a user is a member of the given org. Used by other modules.
     */
    public boolean isMember(UUID orgId, UUID userId) {
        return memberRepository.isMember(orgId, userId);
    }

    @Transactional
    public void updateMemberRole(UUID orgId, UUID targetUserId, String newRole, UUID actorId) {
        if (!isAdmin(orgId, actorId)) {
            throw new ForbiddenException("Only organization ADMINs can update member roles");
        }
        if (!memberRepository.isMember(orgId, targetUserId)) {
            throw new NotFoundException("User is not a member of this organization");
        }
        memberRepository.updateRole(orgId, targetUserId, newRole);
    }

    @Transactional
    public void removeMember(UUID orgId, UUID targetUserId, UUID actorId) {
        if (!isAdmin(orgId, actorId)) {
            throw new ForbiddenException("Only organization ADMINs can remove members");
        }
        if (actorId.equals(targetUserId)) {
            throw new ConflictException("Cannot remove yourself");
        }
        if (!memberRepository.isMember(orgId, targetUserId)) {
            throw new NotFoundException("User is not a member of this organization");
        }
        memberRepository.delete(orgId, targetUserId);
    }

    @Transactional
    public void deleteOrganization(UUID orgId, UUID actorId) {
        if (!isAdmin(orgId, actorId)) {
            throw new ForbiddenException("Only organization ADMINs can delete the organization");
        }
        orgRepository.delete(orgId);
    }
}
