package com.universe.backend.config;

public class CustomUserPrincipal {
    private final String username;
    private final Integer userId;

    public CustomUserPrincipal(String username, Integer userId) {
        this.username = username;
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public Integer getUserId() {
        return userId;
    }
}