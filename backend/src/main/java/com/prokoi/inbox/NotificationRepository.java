package com.prokoi.inbox;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class NotificationRepository {

    private final JdbcTemplate jdbc;

    public NotificationRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<Notification> ROW_MAPPER = (rs, rowNum) -> {
        Notification notification = new Notification();
        notification.setId(rs.getObject("id", UUID.class));
        notification.setUserId(rs.getObject("user_id", UUID.class));
        notification.setTitle(rs.getString("title"));
        notification.setMessage(rs.getString("message"));
        notification.setIsRead(rs.getBoolean("is_read"));
        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) {
            notification.setCreatedAt(ts.toInstant().atZone(ZoneId.systemDefault()));
        }
        return notification;
    };

    public Notification save(Notification notification) {
        jdbc.update(
                "INSERT INTO notifications (id, user_id, title, message, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                notification.getId(), notification.getUserId(), notification.getTitle(), notification.getMessage(),
                notification.getIsRead(), Timestamp.from(notification.getCreatedAt().toInstant())
        );
        return notification;
    }

    public List<Notification> findByUserIdOrderByCreatedAtDesc(UUID userId) {
        return jdbc.query(
                "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
                ROW_MAPPER, userId
        );
    }
    
    public Optional<Notification> findById(UUID id) {
        return jdbc.query(
                "SELECT * FROM notifications WHERE id = ?",
                ROW_MAPPER, id
        ).stream().findFirst();
    }
    
    public void update(Notification notification) {
        jdbc.update(
                "UPDATE notifications SET is_read = ? WHERE id = ?",
                notification.getIsRead(), notification.getId()
        );
    }
}
