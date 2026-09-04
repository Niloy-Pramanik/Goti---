package com.prokoi.common.exception;

/**
 * Thrown when a resource already exists (e.g., duplicate email).
 * Mapped to HTTP 409 by GlobalExceptionHandler.
 */
public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }
}
