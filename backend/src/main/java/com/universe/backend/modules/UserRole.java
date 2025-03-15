package com.universe.backend.modules;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "userroles")
public class UserRole {
    @Id
    @JsonIgnore
    @Column(nullable = false)
    private Integer userId;

    @Id
    @Column(nullable = false)
    private Integer roleId;
    
    public UserRole(){}
    
    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    @JsonIgnore
    private UsersBio usersBio;

    public Integer getUserId() {
        return userId;
    }

    public UsersBio getUsersBio() {
        return usersBio;
    }

    public void setUsersBio(UsersBio usersBio) {
        this.usersBio = usersBio;
    }

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
    
}