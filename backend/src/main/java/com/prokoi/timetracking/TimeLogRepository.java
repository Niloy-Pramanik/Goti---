package com.prokoi.timetracking;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;

@Repository
public class TimeLogRepository {

    private final JdbcTemplate jdbc;

    public TimeLogRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<TimeLog> ROW_MAPPER_WITH_JOINS = (rs, rowNum) -> {
        TimeLog timeLog = new TimeLog();
        timeLog.setId(rs.getObject("id", UUID.class));
        timeLog.setUserId(rs.getObject("user_id", UUID.class));
        timeLog.setIssueId(rs.getObject("issue_id", UUID.class));
        timeLog.setDurationMinutes(rs.getInt("duration_minutes"));
        timeLog.setDescription(rs.getString("description"));
        Timestamp ts = rs.getTimestamp("logged_at");
        if (ts != null) {
            timeLog.setLoggedAt(ts.toInstant().atZone(ZoneId.systemDefault()));
        }
        
        // Joined fields
        timeLog.setIssueTitle(rs.getString("issue_title"));
        timeLog.setProjectName(rs.getString("project_name"));
        return timeLog;
    };

    public TimeLog save(TimeLog timeLog) {
        jdbc.update(
                "INSERT INTO time_logs (id, user_id, issue_id, duration_minutes, description, logged_at) VALUES (?, ?, ?, ?, ?, ?)",
                timeLog.getId(), timeLog.getUserId(), timeLog.getIssueId(), timeLog.getDurationMinutes(),
                timeLog.getDescription(), Timestamp.from(timeLog.getLoggedAt().toInstant())
        );
        return timeLog;
    }

    public List<TimeLog> findByUserIdOrderByLoggedAtDesc(UUID userId) {
        return jdbc.query(
                "SELECT t.*, i.title as issue_title, p.name as project_name " +
                "FROM time_logs t " +
                "JOIN issues i ON t.issue_id = i.id " +
                "JOIN projects p ON i.project_id = p.id " +
                "WHERE t.user_id = ? " +
                "ORDER BY t.logged_at DESC",
                ROW_MAPPER_WITH_JOINS, userId
        );
    }
}
