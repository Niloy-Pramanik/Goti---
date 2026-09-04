package com.prokoi.teams.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * Request DTO for adding a member to a team.
 */
public class AddTeamMemberRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    private String email;

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "LEAD|MEMBER", message = "Role must be LEAD or MEMBER")
    private String role;

    public AddTeamMemberRequest() {}

    public AddTeamMemberRequest(String email, String role) {
        this.email = email;
        this.role = role;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
