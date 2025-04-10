package com.universe.backend.modules;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "userscontacts")
public class UsersContact {
    @Id
    @JsonIgnore
    @Column(nullable = false)
    private Integer userId;

    @Id
    @Column(nullable = false)
    private Integer contactTypeId;

    @Column(nullable = false, length = 60)
    private String path;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    @JsonIgnore
    private UsersBio usersBio;
    
    public UsersContact() {}

    public Integer getUserId() {
        return userId;
    }
    
    public UsersBio getUsersBio() {
        return usersBio;
    }

    public void setUsersBio(UsersBio usersBio) {
        this.usersBio = usersBio;
    }

    public Integer getContactTypeId() {
        return contactTypeId;
    }

    public void setContactTypeId(Integer contactTypeId) {
        this.contactTypeId = contactTypeId;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
    
}
