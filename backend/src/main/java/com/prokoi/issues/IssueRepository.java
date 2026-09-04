package com.prokoi.issues;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class IssueRepository {

    private final JdbcTemplate jdbc;

    public IssueRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<Issue> ROW_MAPPER = (rs, rowNum) -> {
        Issue issue = new Issue();
        issue.setId(rs.getObject("id", UUID.class));
        issue.setProjectId(rs.getObject("project_id", UUID.class));
        issue.setMilestoneId(rs.getObject("milestone_id", UUID.class));
        issue.setAssigneeId(rs.getObject("assignee_id", UUID.class));
        issue.setType(rs.getString("type"));
        issue.setStatus(rs.getString("status"));
        issue.setTitle(rs.getString("title"));
        issue.setDescription(rs.getString("description"));
        issue.setCreatedAt(rs.getObject("created_at", OffsetDateTime.class));
        return issue;
    };

    public Issue save(Issue issue) {
        jdbc.update(
                "INSERT INTO issues (id, project_id, milestone_id, assignee_id, type, status, title, description, created_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                issue.getId(), issue.getProjectId(), issue.getMilestoneId(), issue.getAssigneeId(),
                issue.getType(), issue.getStatus(), issue.getTitle(), issue.getDescription(), issue.getCreatedAt()
        );
        return issue;
    }

    public Optional<Issue> findById(UUID id) {
        return jdbc.query(
                "SELECT * FROM issues WHERE id = ?",
                ROW_MAPPER, id
        ).stream().findFirst();
    }

    public List<Issue> findByProjectId(UUID projectId) {
        return jdbc.query(
                "SELECT * FROM issues WHERE project_id = ? ORDER BY created_at DESC",
                ROW_MAPPER, projectId
        );
    }
    
    public List<Issue> findByAssigneeId(UUID assigneeId) {
        return jdbc.query(
                "SELECT * FROM issues WHERE assignee_id = ? ORDER BY created_at DESC",
                ROW_MAPPER, assigneeId
        );
    }

    public void update(Issue issue) {
        jdbc.update(
                "UPDATE issues SET milestone_id = ?, assignee_id = ?, type = ?, status = ?, title = ?, description = ? WHERE id = ?",
                issue.getMilestoneId(), issue.getAssigneeId(), issue.getType(), issue.getStatus(), 
                issue.getTitle(), issue.getDescription(), issue.getId()
        );
    }
}
