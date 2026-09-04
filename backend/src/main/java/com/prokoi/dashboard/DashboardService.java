package com.prokoi.dashboard;

import com.prokoi.dashboard.dto.MyIssueResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DashboardService {

    private final JdbcTemplate jdbc;

    public DashboardService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<MyIssueResponse> ROW_MAPPER = (rs, rowNum) -> new MyIssueResponse(
            rs.getObject("id", UUID.class),
            rs.getObject("project_id", UUID.class),
            rs.getString("project_name"),
            rs.getObject("team_id", UUID.class),
            rs.getString("team_name"),
            rs.getObject("org_id", UUID.class),
            rs.getString("org_name"),
            rs.getObject("milestone_id", UUID.class),
            rs.getObject("assignee_id", UUID.class),
            rs.getString("type"),
            rs.getString("status"),
            rs.getString("title"),
            rs.getString("description"),
            rs.getObject("created_at", OffsetDateTime.class)
    );

    public List<MyIssueResponse> getMyAssignedIssues(UUID userId) {
        return jdbc.query(
                "SELECT i.*, p.name as project_name, t.id as team_id, t.name as team_name, o.id as org_id, o.name as org_name " +
                "FROM issues i " +
                "JOIN projects p ON i.project_id = p.id " +
                "JOIN teams t ON p.team_id = t.id " +
                "JOIN organizations o ON t.org_id = o.id " +
                "WHERE i.assignee_id = ? " +
                "ORDER BY i.created_at DESC",
                ROW_MAPPER, userId
        );
    }
}
