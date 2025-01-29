package com.universe.backend.exceptions;

public class UserIsDeletedExistsException extends RuntimeException {
    public UserIsDeletedExistsException(String message) {
        super(message);
    }
}
