package com.prokoi.users;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;
import java.util.UUID;

/**
 * JdbcTemplate-based repository for users table.
 * All queries use parameterized SQL — no string concatenation.
 */
@Repository
public class UserRepository {

    private final JdbcTemplate jdbc;

    public UserRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final class UserRowMapper implements RowMapper<User> {
        @Override
        public User mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new User(
                    UUID.fromString(rs.getString("id")),
                    rs.getString("name"),
                    rs.getString("email"),
                    rs.getString("password_hash"),
                    rs.getTimestamp("created_at").toLocalDateTime()
            );
        }
    }

    private static final UserRowMapper ROW_MAPPER = new UserRowMapper();

    public User save(User user) {
        jdbc.update(
                "INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)",
                user.getId(), user.getName(), user.getEmail(), user.getPasswordHash()
        );
        return findById(user.getId()).orElseThrow();
    }

    public Optional<User> findById(UUID id) {
        var results = jdbc.query(
                "SELECT id, name, email, password_hash, created_at FROM users WHERE id = ?",
                ROW_MAPPER, id
        );
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public Optional<User> findByEmail(String email) {
        var results = jdbc.query(
                "SELECT id, name, email, password_hash, created_at FROM users WHERE email = ?",
                ROW_MAPPER, email
        );
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public boolean existsByEmail(String email) {
        Integer count = jdbc.queryForObject(
                "SELECT COUNT(*) FROM users WHERE email = ?",
                Integer.class, email
        );
        return count != null && count > 0;
    }
}
