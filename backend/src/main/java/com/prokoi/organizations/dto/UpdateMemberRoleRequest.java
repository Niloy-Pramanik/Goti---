package com.prokoi.organizations.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UpdateMemberRoleRequest {

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(ADMIN|MEMBER)$", message = "Role must be ADMIN or MEMBER")
    private String role;

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
