package com.prokoi.invitations;

import com.prokoi.common.exception.ForbiddenException;
import com.prokoi.invitations.dto.CreateInvitationRequest;
import com.prokoi.invitations.dto.InvitationResponse;
import com.prokoi.organizations.OrganizationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
public class InvitationController {

    private final InvitationService invitationService;
    private final OrganizationService orgService;

    public InvitationController(InvitationService invitationService, OrganizationService orgService) {
        this.invitationService = invitationService;
        this.orgService = orgService;
    }

    @PostMapping("/organizations/{orgId}/invitations")
    public ResponseEntity<InvitationResponse> createInvitation(
            @PathVariable UUID orgId,
            @Valid @RequestBody CreateInvitationRequest request,
            Authentication auth) {

        UUID actorId = (UUID) auth.getPrincipal();

        if (!orgService.isAdmin(orgId, actorId)) {
            throw new ForbiddenException("Only organization ADMINs can send invitations");
        }

        InvitationResponse response = invitationService.createInvitation(orgId, request, actorId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/invites/{token}")
    public ResponseEntity<InvitationService.InvitationDetails> getInvitationDetails(@PathVariable String token) {
        InvitationService.InvitationDetails details = invitationService.getByToken(token);
        return ResponseEntity.ok(details);
    }

    @PostMapping("/invites/{token}/accept")
    public ResponseEntity<Void> acceptInvitation(
            @PathVariable String token,
            Authentication auth) {

        UUID userId = (UUID) auth.getPrincipal();
        invitationService.acceptInvitation(token, userId);
        return ResponseEntity.ok().build();
    }
}
