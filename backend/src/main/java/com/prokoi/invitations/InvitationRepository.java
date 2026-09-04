package com.prokoi.invitations;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class InvitationRepository {

    private final JdbcTemplate jdbc;

    public InvitationRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Invitation> rowMapper = (rs, rowNum) -> {
        Invitation i = new Invitation();
        i.setId(rs.getObject("id", UUID.class));
        i.setOrgId(rs.getObject("org_id", UUID.class));
        i.setEmail(rs.getString("email"));
        i.setRole(rs.getString("role"));
        i.setToken(rs.getString("token"));
        i.setInvitedBy(rs.getObject("invited_by", UUID.class));
        i.setAccepted(rs.getBoolean("accepted"));
        i.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        i.setExpiresAt(rs.getTimestamp("expires_at").toLocalDateTime());
        return i;
    };

    public Invitation save(Invitation invitation) {
        jdbc.update(
            "INSERT INTO invitations (id, org_id, email, role, token, invited_by, accepted, created_at, expires_at) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            invitation.getId(), invitation.getOrgId(), invitation.getEmail(),
            invitation.getRole(), invitation.getToken(), invitation.getInvitedBy(),
            invitation.isAccepted(), invitation.getCreatedAt(), invitation.getExpiresAt()
        );
        return invitation;
    }

    public Optional<Invitation> findByToken(String token) {
        List<Invitation> results = jdbc.query(
            "SELECT * FROM invitations WHERE token = ?", rowMapper, token
        );
        return results.stream().findFirst();
    }

    public List<Invitation> findByOrgId(UUID orgId) {
        return jdbc.query(
            "SELECT * FROM invitations WHERE org_id = ? AND accepted = FALSE ORDER BY created_at DESC",
            rowMapper, orgId
        );
    }

    public void markAccepted(String token) {
        jdbc.update("UPDATE invitations SET accepted = TRUE WHERE token = ?", token);
    }

    public boolean hasPendingInvitation(UUID orgId, String email) {
        Integer count = jdbc.queryForObject(
            "SELECT COUNT(*) FROM invitations WHERE org_id = ? AND email = ? AND accepted = FALSE AND expires_at > ?",
            Integer.class, orgId, email, LocalDateTime.now()
        );
        return count != null && count > 0;
    }
}
