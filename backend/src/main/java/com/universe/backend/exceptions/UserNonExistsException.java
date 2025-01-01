package com.universe.backend.exceptions;

public class UserNonExistsException extends RuntimeException {
    public UserNonExistsException(String message) {
        super(message);
    }
}