package com.prokoi.milestones;

import com.prokoi.milestones.dto.MilestoneProgressResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class MilestoneRepository {

    private final JdbcTemplate jdbcTemplate;

    public MilestoneRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Milestone> milestoneRowMapper = (rs, rowNum) -> {
        Milestone milestone = new Milestone();
        milestone.setId(rs.getObject("id", UUID.class));
        milestone.setProjectId(rs.getObject("project_id", UUID.class));
        milestone.setName(rs.getString("name"));
        Timestamp dueDate = rs.getTimestamp("due_date");
        if (dueDate != null) {
            milestone.setDueDate(dueDate.toInstant());
        }
        milestone.setCreatedAt(rs.getTimestamp("created_at").toInstant());
        return milestone;
    };

    public void create(Milestone milestone) {
        String sql = "INSERT INTO milestones (id, project_id, name, due_date, created_at) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                milestone.getId(),
                milestone.getProjectId(),
                milestone.getName(),
                milestone.getDueDate() != null ? Timestamp.from(milestone.getDueDate()) : null,
                Timestamp.from(milestone.getCreatedAt())
        );
    }

    public List<Milestone> findByProjectId(UUID projectId) {
        String sql = "SELECT * FROM milestones WHERE project_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, milestoneRowMapper, projectId);
    }

    public Optional<Milestone> findById(UUID id) {
        String sql = "SELECT * FROM milestones WHERE id = ?";
        List<Milestone> results = jdbcTemplate.query(sql, milestoneRowMapper, id);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public MilestoneProgressResponse getProgress(UUID milestoneId) {
        String sql = "SELECT COUNT(*) AS total_tasks, " +
                     "COUNT(CASE WHEN status = 'DONE' THEN 1 END) AS completed_tasks " +
                     "FROM issues WHERE milestone_id = ?";
        
        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            long totalTasks = rs.getLong("total_tasks");
            long completedTasks = rs.getLong("completed_tasks");
            double progressPercentage = 0.0;
            if (totalTasks > 0) {
                progressPercentage = ((double) completedTasks / totalTasks) * 100.0;
            }
            return new MilestoneProgressResponse(totalTasks, completedTasks, progressPercentage);
        }, milestoneId);
    }
}
