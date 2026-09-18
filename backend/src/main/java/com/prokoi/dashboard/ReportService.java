package com.prokoi.dashboard;

import com.prokoi.dashboard.dto.ReportResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ReportService {

    private final JdbcTemplate jdbc;

    public ReportService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public ReportResponse getAdminReports(UUID userId) {
        // First check if user is an ADMIN in ANY organization
        Integer adminOrgCount = jdbc.queryForObject(
                "SELECT COUNT(*) FROM organization_members WHERE user_id = ? AND role = 'ADMIN'",
                Integer.class,
                userId
        );

        if (adminOrgCount == null || adminOrgCount == 0) {
            // Throw exception or just return 0s so the frontend can handle it gracefully. 
            // We'll throw an exception and let the controller handle it if needed, or better just return 403.
            throw new RuntimeException("User is not an admin of any organization");
        }

        // Get total teams across all organizations where the user is an admin
        Integer totalTeams = jdbc.queryForObject(
                "SELECT COUNT(t.id) FROM teams t " +
                "JOIN organization_members om ON t.org_id = om.org_id " +
                "WHERE om.user_id = ? AND om.role = 'ADMIN'",
                Integer.class,
                userId
        );

        // Get total projects
        Integer totalProjects = jdbc.queryForObject(
                "SELECT COUNT(p.id) FROM projects p " +
                "JOIN teams t ON p.team_id = t.id " +
                "JOIN organization_members om ON t.org_id = om.org_id " +
                "WHERE om.user_id = ? AND om.role = 'ADMIN'",
                Integer.class,
                userId
        );
        
        // Get total distinct members in these organizations
        Integer totalMembers = jdbc.queryForObject(
                "SELECT COUNT(DISTINCT om_all.user_id) FROM organization_members om_all " +
                "JOIN organization_members om_admin ON om_all.org_id = om_admin.org_id " +
                "WHERE om_admin.user_id = ? AND om_admin.role = 'ADMIN'",
                Integer.class,
                userId
        );

        // Get total issues
        Integer totalIssues = jdbc.queryForObject(
                "SELECT COUNT(i.id) FROM issues i " +
                "JOIN projects p ON i.project_id = p.id " +
                "JOIN teams t ON p.team_id = t.id " +
                "JOIN organization_members om ON t.org_id = om.org_id " +
                "WHERE om.user_id = ? AND om.role = 'ADMIN'",
                Integer.class,
                userId
        );

        // Get total completed issues
        Integer completedIssues = jdbc.queryForObject(
                "SELECT COUNT(i.id) FROM issues i " +
                "JOIN projects p ON i.project_id = p.id " +
                "JOIN teams t ON p.team_id = t.id " +
                "JOIN organization_members om ON t.org_id = om.org_id " +
                "WHERE om.user_id = ? AND om.role = 'ADMIN' AND i.status = 'DONE'",
                Integer.class,
                userId
        );

        // Get total time logged across all issues
        Integer totalTimeLogged = jdbc.queryForObject(
                "SELECT SUM(tl.duration_minutes) FROM time_logs tl " +
                "JOIN issues i ON tl.issue_id = i.id " +
                "JOIN projects p ON i.project_id = p.id " +
                "JOIN teams t ON p.team_id = t.id " +
                "JOIN organization_members om ON t.org_id = om.org_id " +
                "WHERE om.user_id = ? AND om.role = 'ADMIN'",
                Integer.class,
                userId
        );

        return new ReportResponse(
                totalProjects == null ? 0 : totalProjects,
                totalMembers == null ? 0 : totalMembers,
                totalIssues == null ? 0 : totalIssues,
                completedIssues == null ? 0 : completedIssues,
                totalTimeLogged == null ? 0 : totalTimeLogged,
                totalTeams == null ? 0 : totalTeams
        );
    }

    public List<com.prokoi.dashboard.dto.ProjectReportDTO> getProjectsReport(UUID userId) {
        verifyAdmin(userId);
        return jdbc.query(
                "SELECT p.id, p.name, o.name as org_name, " +
                "  COUNT(i.id) as total_tasks, " +
                "  SUM(CASE WHEN i.status = 'DONE' THEN 1 ELSE 0 END) as completed_tasks, " +
                "  (SELECT COALESCE(SUM(duration_minutes), 0) FROM time_logs tl JOIN issues i2 ON tl.issue_id = i2.id WHERE i2.project_id = p.id) as time_logged " +
                "FROM projects p " +
                "JOIN teams t ON p.team_id = t.id " +
                "JOIN organizations o ON t.org_id = o.id " +
                "JOIN organization_members om ON o.id = om.org_id " +
                "LEFT JOIN issues i ON p.id = i.project_id " +
                "WHERE om.user_id = ? AND om.role = 'ADMIN' " +
                "GROUP BY p.id, p.name, o.name " +
                "ORDER BY o.name, p.name",
                (rs, rowNum) -> new com.prokoi.dashboard.dto.ProjectReportDTO(
                        UUID.fromString(rs.getString("id")),
                        rs.getString("name"),
                        rs.getString("org_name"),
                        rs.getInt("total_tasks"),
                        rs.getInt("completed_tasks"),
                        rs.getInt("time_logged")
                ),
                userId
        );
    }

    public List<com.prokoi.dashboard.dto.TaskReportDTO> getTasksReport(UUID userId) {
        verifyAdmin(userId);
        return jdbc.query(
                "SELECT i.id, i.title, i.status, i.priority, u.name as assignee_name, p.name as project_name, t.name as team_name, o.name as org_name, i.due_date " +
                "FROM issues i " +
                "JOIN projects p ON i.project_id = p.id " +
                "JOIN teams t ON p.team_id = t.id " +
                "JOIN organizations o ON t.org_id = o.id " +
                "JOIN organization_members om ON o.id = om.org_id " +
                "LEFT JOIN users u ON i.assignee_id = u.id " +
                "WHERE om.user_id = ? AND om.role = 'ADMIN' " +
                "ORDER BY i.created_at DESC",
                (rs, rowNum) -> new com.prokoi.dashboard.dto.TaskReportDTO(
                        UUID.fromString(rs.getString("id")),
                        rs.getString("title"),
                        rs.getString("status"),
                        rs.getString("priority"),
                        rs.getString("assignee_name"),
                        rs.getString("project_name"),
                        rs.getString("team_name"),
                        rs.getString("org_name"),
                        rs.getTimestamp("due_date") != null ? rs.getTimestamp("due_date").toLocalDateTime() : null
                ),
                userId
        );
    }

    public List<com.prokoi.dashboard.dto.TeamTimelineDTO> getTeamTimeline(UUID userId) {
        verifyAdmin(userId);
        
        // 1. Get all unique members in admin's organizations
        List<com.prokoi.dashboard.dto.TeamTimelineDTO> members = jdbc.query(
                "SELECT DISTINCT u.id, u.name, u.email " +
                "FROM users u " +
                "JOIN organization_members om_all ON u.id = om_all.user_id " +
                "JOIN organization_members om_admin ON om_all.org_id = om_admin.org_id " +
                "WHERE om_admin.user_id = ? AND om_admin.role = 'ADMIN' " +
                "ORDER BY u.name",
                (rs, rowNum) -> new com.prokoi.dashboard.dto.TeamTimelineDTO(
                        UUID.fromString(rs.getString("id")),
                        rs.getString("name"),
                        rs.getString("email"),
                        java.util.Collections.emptyList()
                ),
                userId
        );

        // 2. For each member, get their active tasks (not DONE) in these orgs
        for (com.prokoi.dashboard.dto.TeamTimelineDTO member : members) {
            List<com.prokoi.dashboard.dto.TaskReportDTO> tasks = jdbc.query(
                    "SELECT i.id, i.title, i.status, i.priority, u.name as assignee_name, p.name as project_name, t.name as team_name, o.name as org_name, i.due_date " +
                    "FROM issues i " +
                    "JOIN projects p ON i.project_id = p.id " +
                    "JOIN teams t ON p.team_id = t.id " +
                    "JOIN organizations o ON t.org_id = o.id " +
                    "JOIN organization_members om ON o.id = om.org_id " +
                    "JOIN users u ON i.assignee_id = u.id " +
                    "WHERE om.user_id = ? AND om.role = 'ADMIN' AND i.assignee_id = ? AND i.status != 'DONE' " +
                    "ORDER BY i.due_date ASC NULLS LAST",
                    (rs, rowNum) -> new com.prokoi.dashboard.dto.TaskReportDTO(
                            UUID.fromString(rs.getString("id")),
                            rs.getString("title"),
                            rs.getString("status"),
                            rs.getString("priority"),
                            rs.getString("assignee_name"),
                            rs.getString("project_name"),
                            rs.getString("team_name"),
                            rs.getString("org_name"),
                            rs.getTimestamp("due_date") != null ? rs.getTimestamp("due_date").toLocalDateTime() : null
                    ),
                    userId, member.getMemberId()
            );
            member.setTasks(tasks);
        }

        return members;
    }
    
    private void verifyAdmin(UUID userId) {
        Integer adminOrgCount = jdbc.queryForObject(
                "SELECT COUNT(*) FROM organization_members WHERE user_id = ? AND role = 'ADMIN'",
                Integer.class,
                userId
        );
        if (adminOrgCount == null || adminOrgCount == 0) {
            throw new RuntimeException("User is not an admin of any organization");
        }
    }
}
