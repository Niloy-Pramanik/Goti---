package com.prokoi.organizations;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * JdbcTemplate-based repository for organization_members junction table.
 */
@Repository
public class OrganizationMemberRepository {

    private final JdbcTemplate jdbc;

    public OrganizationMemberRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final class MemberRowMapper implements RowMapper<OrganizationMember> {
        @Override
        public OrganizationMember mapRow(ResultSet rs, int rowNum) throws SQLException {
            OrganizationMember m = new OrganizationMember(
                    UUID.fromString(rs.getString("org_id")),
                    UUID.fromString(rs.getString("user_id")),
                    rs.getString("role"),
                    rs.getTimestamp("created_at").toLocalDateTime()
            );
            // Enriched fields from JOIN (may not always be present)
            try {
                m.setUserName(rs.getString("user_name"));
                m.setUserEmail(rs.getString("user_email"));
                if (rs.getTimestamp("joined_at") != null) {
                    m.setJoinedAt(rs.getTimestamp("joined_at").toLocalDateTime());
                } else {
                    m.setJoinedAt(rs.getTimestamp("created_at").toLocalDateTime());
                }
            } catch (SQLException ignored) {
                // Not all queries join with users table or have joined_at
            }
            return m;
        }
    }

    private static final MemberRowMapper ROW_MAPPER = new MemberRowMapper();

    public void save(UUID orgId, UUID userId, String role) {
        jdbc.update(
                "INSERT INTO organization_members (org_id, user_id, role) VALUES (?, ?, ?)",
                orgId, userId, role
        );
    }

    public Optional<OrganizationMember> findByOrgIdAndUserId(UUID orgId, UUID userId) {
        var results = jdbc.query(
                "SELECT org_id, user_id, role, created_at, joined_at FROM organization_members " +
                "WHERE org_id = ? AND user_id = ?",
                (rs, rowNum) -> {
                    OrganizationMember m = new OrganizationMember(
                            UUID.fromString(rs.getString("org_id")),
                            UUID.fromString(rs.getString("user_id")),
                            rs.getString("role"),
                            rs.getTimestamp("created_at").toLocalDateTime()
                    );
                    if (rs.getTimestamp("joined_at") != null) {
                        m.setJoinedAt(rs.getTimestamp("joined_at").toLocalDateTime());
                    } else {
                        m.setJoinedAt(rs.getTimestamp("created_at").toLocalDateTime());
                    }
                    return m;
                },
                orgId, userId
        );
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public boolean isMember(UUID orgId, UUID userId) {
        Integer count = jdbc.queryForObject(
                "SELECT COUNT(*) FROM organization_members WHERE org_id = ? AND user_id = ?",
                Integer.class, orgId, userId
        );
        return count != null && count > 0;
    }

    public String getRole(UUID orgId, UUID userId) {
        var results = jdbc.query(
                "SELECT role FROM organization_members WHERE org_id = ? AND user_id = ?",
                (rs, rowNum) -> rs.getString("role"),
                orgId, userId
        );
        return results.isEmpty() ? null : results.get(0);
    }

    /**
     * List members of an org, enriched with user name/email.
     */
    public List<OrganizationMember> findByOrgId(UUID orgId) {
        return jdbc.query(
                "SELECT om.org_id, om.user_id, om.role, om.created_at, om.joined_at, " +
                "u.name AS user_name, u.email AS user_email " +
                "FROM organization_members om " +
                "INNER JOIN users u ON om.user_id = u.id " +
                "WHERE om.org_id = ? " +
                "ORDER BY om.created_at ASC",
                ROW_MAPPER, orgId
        );
    }
    public void updateRole(UUID orgId, UUID userId, String role) {
        jdbc.update(
                "UPDATE organization_members SET role = ? WHERE org_id = ? AND user_id = ?",
                role, orgId, userId
        );
    }

    public void delete(UUID orgId, UUID userId) {
        jdbc.update(
                "DELETE FROM organization_members WHERE org_id = ? AND user_id = ?",
                orgId, userId
        );
    }
}
