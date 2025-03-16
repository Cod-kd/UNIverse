package com.universe.backend.exceptions;

public class UserNotVerifyedException extends RuntimeException {
    public UserNotVerifyedException(String message) {
        super(message);
    }
}
