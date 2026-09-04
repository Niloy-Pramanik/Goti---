package com.prokoi.projects;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * JdbcTemplate-based repository for projects table.
 */
@Repository
public class ProjectRepository {

    private final JdbcTemplate jdbc;

    public ProjectRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final class ProjectRowMapper implements RowMapper<Project> {
        @Override
        public Project mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new Project(
                    UUID.fromString(rs.getString("id")),
                    rs.getString("name"),
                    rs.getString("description"),
                    UUID.fromString(rs.getString("team_id")),
                    rs.getString("repo_link"),
                    rs.getString("meeting_link"),
                    rs.getString("storage_link"),
                    rs.getTimestamp("created_at").toLocalDateTime()
            );
        }
    }

    private static final ProjectRowMapper ROW_MAPPER = new ProjectRowMapper();

    public Project save(Project project) {
        jdbc.update(
                "INSERT INTO projects (id, name, description, team_id, repo_link, meeting_link, storage_link) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)",
                project.getId(), project.getName(), project.getDescription(),
                project.getTeamId(), project.getRepoLink(), project.getMeetingLink(),
                project.getStorageLink()
        );
        return findById(project.getId()).orElseThrow();
    }

    public Optional<Project> findById(UUID id) {
        var results = jdbc.query(
                "SELECT id, name, description, team_id, repo_link, meeting_link, storage_link, created_at " +
                "FROM projects WHERE id = ?",
                ROW_MAPPER, id
        );
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public List<Project> findByTeamId(UUID teamId) {
        return jdbc.query(
                "SELECT id, name, description, team_id, repo_link, meeting_link, storage_link, created_at " +
                "FROM projects WHERE team_id = ? ORDER BY created_at DESC",
                ROW_MAPPER, teamId
        );
    }

    /**
     * Update resource links independently (PATCH semantics).
     * Only updates non-null fields.
     */
    public void updateResourceLinks(UUID id, String repoLink, String meetingLink, String storageLink) {
        jdbc.update(
                "UPDATE projects SET " +
                "repo_link = COALESCE(?, repo_link), " +
                "meeting_link = COALESCE(?, meeting_link), " +
                "storage_link = COALESCE(?, storage_link) " +
                "WHERE id = ?",
                repoLink, meetingLink, storageLink, id
        );
    }

    public void deleteById(UUID id) {
        jdbc.update("DELETE FROM projects WHERE id = ?", id);
    }
}
