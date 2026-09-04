package com.prokoi.common.exception;

/**
 * Thrown when a user attempts an action they are not authorized for.
 * Mapped to HTTP 403 by GlobalExceptionHandler.
 */
public class ForbiddenException extends RuntimeException {

    public ForbiddenException(String message) {
        super(message);
    }
}
