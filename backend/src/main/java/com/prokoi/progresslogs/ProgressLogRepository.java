package com.prokoi.progresslogs;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public class ProgressLogRepository {

    private final JdbcTemplate jdbc;

    public ProgressLogRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<ProgressLog> ROW_MAPPER = (rs, rowNum) -> {
        ProgressLog log = new ProgressLog();
        log.setId(rs.getObject("id", UUID.class));
        log.setIssueId(rs.getObject("issue_id", UUID.class));
        log.setUserId(rs.getObject("user_id", UUID.class));
        log.setComment(rs.getString("comment"));
        log.setDelayDays(rs.getInt("delay_days"));
        log.setCreatedAt(rs.getObject("created_at", OffsetDateTime.class));
        return log;
    };

    public ProgressLog save(ProgressLog log) {
        jdbc.update(
                "INSERT INTO progress_logs (id, issue_id, user_id, comment, delay_days, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                log.getId(), log.getIssueId(), log.getUserId(), log.getComment(), log.getDelayDays(), log.getCreatedAt()
        );
        return log;
    }

    public List<ProgressLog> findByIssueId(UUID issueId) {
        return jdbc.query(
                "SELECT * FROM progress_logs WHERE issue_id = ? ORDER BY created_at ASC",
                ROW_MAPPER, issueId
        );
    }
}
