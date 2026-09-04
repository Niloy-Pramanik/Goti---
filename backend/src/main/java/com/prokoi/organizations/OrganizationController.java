package com.prokoi.organizations;

import com.prokoi.organizations.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Organization controller — thin layer per coding-rules.md.
 */
@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {

    private final OrganizationService orgService;

    public OrganizationController(OrganizationService orgService) {
        this.orgService = orgService;
    }

    @PostMapping
    public ResponseEntity<OrganizationResponse> create(
            @Valid @RequestBody CreateOrganizationRequest request,
            Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        OrganizationResponse response = orgService.createOrganization(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<OrganizationResponse>> list(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(orgService.listUserOrganizations(userId));
    }

    @GetMapping("/{orgId}")
    public ResponseEntity<OrganizationResponse> getById(
            @PathVariable UUID orgId,
            Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(orgService.getOrganization(orgId, userId));
    }

    @PostMapping("/{orgId}/members")
    public ResponseEntity<OrgMemberResponse> addMember(
            @PathVariable UUID orgId,
            @Valid @RequestBody AddOrgMemberRequest request,
            Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        OrgMemberResponse response = orgService.addMember(orgId, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{orgId}/members")
    public ResponseEntity<List<OrgMemberResponse>> listMembers(
            @PathVariable UUID orgId,
            Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(orgService.listMembers(orgId, userId));
    }
}
