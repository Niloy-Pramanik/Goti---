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
 * JdbcTemplate-based repository for organizations table.
 */
@Repository
public class OrganizationRepository {

    private final JdbcTemplate jdbc;

    public OrganizationRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final class OrgRowMapper implements RowMapper<Organization> {
        @Override
        public Organization mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new Organization(
                    UUID.fromString(rs.getString("id")),
                    rs.getString("name"),
                    rs.getString("description"),
                    rs.getTimestamp("created_at").toLocalDateTime()
            );
        }
    }

    private static final OrgRowMapper ROW_MAPPER = new OrgRowMapper();

    public Organization save(Organization org) {
        jdbc.update(
                "INSERT INTO organizations (id, name, description) VALUES (?, ?, ?)",
                org.getId(), org.getName(), org.getDescription()
        );
        return findById(org.getId()).orElseThrow();
    }

    public Optional<Organization> findById(UUID id) {
        var results = jdbc.query(
                "SELECT id, name, description, created_at FROM organizations WHERE id = ?",
                ROW_MAPPER, id
        );
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    /**
     * List only organizations the user belongs to (via organization_members join).
     */
    public List<Organization> findByUserId(UUID userId) {
        return jdbc.query(
                "SELECT o.id, o.name, o.description, o.created_at " +
                "FROM organizations o " +
                "INNER JOIN organization_members om ON o.id = om.org_id " +
                "WHERE om.user_id = ? " +
                "ORDER BY o.created_at DESC",
                ROW_MAPPER, userId
        );
    }
}
