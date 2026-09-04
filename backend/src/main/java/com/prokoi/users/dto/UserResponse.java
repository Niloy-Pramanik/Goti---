package com.prokoi.users.dto;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * User response DTO — never includes password_hash.
 */
public class UserResponse {

    private UUID id;
    private String name;
    private String email;
    private LocalDateTime createdAt;

    public UserResponse() {}

    public UserResponse(UUID id, String name, String email, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static UserResponse from(com.prokoi.users.User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getCreatedAt());
    }
}
