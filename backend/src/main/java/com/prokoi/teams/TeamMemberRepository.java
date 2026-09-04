package com.prokoi.teams;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

/**
 * JdbcTemplate-based repository for team_members junction table.
 */
@Repository
public class TeamMemberRepository {

    private final JdbcTemplate jdbc;

    public TeamMemberRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final class TeamMemberRowMapper implements RowMapper<TeamMember> {
        @Override
        public TeamMember mapRow(ResultSet rs, int rowNum) throws SQLException {
            TeamMember m = new TeamMember(
                    UUID.fromString(rs.getString("team_id")),
                    UUID.fromString(rs.getString("user_id")),
                    rs.getString("role"),
                    rs.getTimestamp("created_at").toLocalDateTime()
            );
            try {
                m.setUserName(rs.getString("user_name"));
                m.setUserEmail(rs.getString("user_email"));
                if (rs.getTimestamp("joined_at") != null) {
                    m.setJoinedAt(rs.getTimestamp("joined_at").toLocalDateTime());
                } else {
                    m.setJoinedAt(rs.getTimestamp("created_at").toLocalDateTime());
                }
            } catch (SQLException ignored) {
                // Not all queries join with users table
            }
            return m;
        }
    }

    private static final TeamMemberRowMapper ROW_MAPPER = new TeamMemberRowMapper();

    public void save(UUID teamId, UUID userId, String role) {
        jdbc.update(
                "INSERT INTO team_members (team_id, user_id, role) VALUES (?, ?, ?) ON CONFLICT (team_id, user_id) DO NOTHING",
                teamId, userId, role
        );
    }

    public boolean isMember(UUID teamId, UUID userId) {
        Integer count = jdbc.queryForObject(
                "SELECT COUNT(*) FROM team_members WHERE team_id = ? AND user_id = ?",
                Integer.class, teamId, userId
        );
        return count != null && count > 0;
    }

    public String getRole(UUID teamId, UUID userId) {
        var results = jdbc.query(
                "SELECT role FROM team_members WHERE team_id = ? AND user_id = ?",
                (rs, rowNum) -> rs.getString("role"),
                teamId, userId
        );
        return results.isEmpty() ? null : results.get(0);
    }

    /**
     * List team members, enriched with user info.
     */
    public List<TeamMember> findByTeamId(UUID teamId) {
        return jdbc.query(
                "SELECT tm.team_id, tm.user_id, tm.role, tm.created_at, tm.joined_at, " +
                "u.name AS user_name, u.email AS user_email " +
                "FROM team_members tm " +
                "INNER JOIN users u ON tm.user_id = u.id " +
                "WHERE tm.team_id = ? " +
                "ORDER BY tm.created_at ASC",
                ROW_MAPPER, teamId
        );
    }
    public void updateRole(UUID teamId, UUID userId, String role) {
        jdbc.update(
                "UPDATE team_members SET role = ? WHERE team_id = ? AND user_id = ?",
                role, teamId, userId
        );
    }

    public void delete(UUID teamId, UUID userId) {
        jdbc.update(
                "DELETE FROM team_members WHERE team_id = ? AND user_id = ?",
                teamId, userId
        );
    }
}
