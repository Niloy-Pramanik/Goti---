package com.prokoi.auth;

import com.prokoi.auth.dto.AuthResponse;
import com.prokoi.auth.dto.LoginRequest;
import com.prokoi.auth.dto.RegisterRequest;
import com.prokoi.common.exception.ConflictException;
import com.prokoi.users.User;
import com.prokoi.users.UserRepository;
import com.prokoi.users.dto.UserResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Auth service — handles registration and login.
 * Passwords are bcrypt-hashed, never logged or returned.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtProvider jwtProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
    }

    /**
     * Register a new user. Throws ConflictException if email already exists.
     */
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("A user with this email already exists");
        }

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        User saved = userRepository.save(user);
        String token = jwtProvider.generateToken(saved.getId());

        return new AuthResponse(token, UserResponse.from(saved));
    }

    /**
     * Authenticate user with email/password. Returns JWT on success.
     * Throws IllegalArgumentException on invalid credentials (mapped to 400/401).
     */
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtProvider.generateToken(user.getId());
        return new AuthResponse(token, UserResponse.from(user));
    }
}
