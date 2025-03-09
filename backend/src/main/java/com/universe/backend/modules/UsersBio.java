package com.universe.backend.modules;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

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
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    @JsonManagedReference
    private UsersData usersData;
    
    @OneToMany(mappedBy = "usersBio", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<UsersContact> contacts = new ArrayList<>();

    @OneToMany(mappedBy = "usersBio", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserRole> roles = new ArrayList<>();

    @OneToMany(mappedBy = "usersBio", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserInterest> interests = new ArrayList<>();

    public void setContacts(List<UsersContact> contacts) {
        this.contacts = contacts;
    }

    public void setRoles(List<UserRole> roles) {
        this.roles = roles;
    }

    public void setInterests(List<UserInterest> interests) {
        this.interests = interests;
    }

    public List<UsersContact> getContacts() {
        return contacts;
    }

    public List<UserRole> getRoles() {
        return roles;
    }

    public List<UserInterest> getInterests() {
        return interests;
    }

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
