package com.prokoi.invitations.dto;

import com.prokoi.invitations.Invitation;

import java.time.LocalDateTime;

public class InvitationResponse {

    private String email;
    private String role;
    private String inviteLink;
    private String organizationName;
    private String invitedByName;
    private LocalDateTime expiresAt;
    private String teamName;

    public InvitationResponse(String email, String role, String inviteLink,
                              String organizationName, String invitedByName,
                              LocalDateTime expiresAt, String teamName) {
        this.email = email;
        this.role = role;
        this.inviteLink = inviteLink;
        this.organizationName = organizationName;
        this.invitedByName = invitedByName;
        this.expiresAt = expiresAt;
        this.teamName = teamName;
    }

    public static InvitationResponse from(Invitation invitation, String orgName, String inviterName, String baseUrl) {
        return new InvitationResponse(
            invitation.getEmail(),
            invitation.getRole(),
            baseUrl + "/invite/" + invitation.getToken(),
            orgName,
            inviterName,
            invitation.getExpiresAt(),
            null
        );
    }

    public static InvitationResponse from(Invitation invitation, String orgName, String inviterName, String baseUrl, String teamName) {
        return new InvitationResponse(
            invitation.getEmail(),
            invitation.getRole(),
            baseUrl + "/invite/" + invitation.getToken(),
            orgName,
            inviterName,
            invitation.getExpiresAt(),
            teamName
        );
    }

    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getInviteLink() { return inviteLink; }
    public String getOrganizationName() { return organizationName; }
    public String getInvitedByName() { return invitedByName; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public String getTeamName() { return teamName; }
}
