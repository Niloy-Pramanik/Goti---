package com.prokoi.teams;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * JdbcTemplate-based repository for teams table.
 */
@Repository
public class TeamRepository {

    private final JdbcTemplate jdbc;

    public TeamRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final class TeamRowMapper implements RowMapper<Team> {
        @Override
        public Team mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new Team(
                    UUID.fromString(rs.getString("id")),
                    rs.getString("name"),
                    UUID.fromString(rs.getString("org_id")),
                    rs.getTimestamp("created_at").toLocalDateTime()
            );
        }
    }

    private static final TeamRowMapper ROW_MAPPER = new TeamRowMapper();

    public Team save(Team team) {
        jdbc.update(
                "INSERT INTO teams (id, name, org_id) VALUES (?, ?, ?)",
                team.getId(), team.getName(), team.getOrgId()
        );
        return findById(team.getId()).orElseThrow();
    }

    public Optional<Team> findById(UUID id) {
        var results = jdbc.query(
                "SELECT id, name, org_id, created_at FROM teams WHERE id = ?",
                ROW_MAPPER, id
        );
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public List<Team> findByOrgId(UUID orgId) {
        return jdbc.query(
                "SELECT id, name, org_id, created_at FROM teams WHERE org_id = ? ORDER BY created_at DESC",
                ROW_MAPPER, orgId
        );
    }
}
