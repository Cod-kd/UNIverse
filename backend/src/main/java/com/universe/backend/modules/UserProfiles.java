package com.universe.backend.modules;

import jakarta.persistence.*; //important!
import java.time.LocalDateTime;

@Entity
@Table(name = "userprofiles")
public class UserProfiles {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 50)
    private String email;

    @Column(nullable = false, unique = true, length = 12)
    private String username;

    @Column(nullable = false, length = 60)
    private String password;

    @Column(name = "createdAt", nullable = true, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = true)
    private LocalDateTime deletedAt;

    @OneToOne(mappedBy = "userProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private UsersData usersData;

    public void setEmail(String email) {
        this.email = email;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }

    public void setUsersData(UsersData usersData) {
        this.usersData = usersData;
    }

    public Integer getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public UsersData getUsersData() {
        return usersData;
    }
}