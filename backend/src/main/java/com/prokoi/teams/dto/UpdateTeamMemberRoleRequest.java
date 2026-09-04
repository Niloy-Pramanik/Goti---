package com.prokoi.teams.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UpdateTeamMemberRoleRequest {

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(LEAD|MEMBER)$", message = "Role must be LEAD or MEMBER")
    private String role;

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
