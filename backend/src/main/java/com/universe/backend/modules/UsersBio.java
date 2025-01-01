package com.universe.backend.modules;

import jakarta.persistence.*;

@Entity
@Table(name = "usersbio")
public class UsersBio {
    @Id
    private Integer userId;

    @Column(nullable = false, length = 30)
    private String faculty;

    @Column(length = 85)
    private String description = "";

    @OneToOne
    @MapsId
    @JoinColumn(name = "userId")
    private UsersData usersData;

    public Integer getUserId() {
        return userId;
    }

    public String getFaculty() {
        return faculty;
    }

    public String getDescription() {
        return description;
    }

    public UsersData getUsersData() {
        return usersData;
    }

    public void setFaculty(String faculty) {
        this.faculty = faculty;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setUsersData(UsersData usersData) {
        this.usersData = usersData;
    }
}
