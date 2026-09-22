package com.prokoi.dashboard;

import com.prokoi.dashboard.dto.MyIssueResponse;
import com.prokoi.dashboard.dto.DashboardProjectDTO;
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
            rs.getObject("created_at", OffsetDateTime.class),
            rs.getObject("due_date", OffsetDateTime.class)
    );

    private static final RowMapper<DashboardProjectDTO> PROJECT_ROW_MAPPER = (rs, rowNum) -> new DashboardProjectDTO(
            rs.getObject("id", UUID.class),
            rs.getString("name"),
            rs.getObject("team_id", UUID.class),
            rs.getObject("org_id", UUID.class)
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

    public List<DashboardProjectDTO> getMyProjects(UUID userId) {
        return jdbc.query(
                "SELECT p.id, p.name, p.team_id, t.org_id " +
                "FROM projects p " +
                "JOIN teams t ON p.team_id = t.id " +
                "JOIN team_members tm ON t.id = tm.team_id " +
                "WHERE tm.user_id = ? " +
                "ORDER BY p.name ASC",
                PROJECT_ROW_MAPPER, userId
        );
    }
}
