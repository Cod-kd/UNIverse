package com.universe.backend.modules;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "userinterests")
public class UserInterest {
    @Id
    @JsonIgnore
    @Column(nullable = false)
    private Integer userId;

    @Id
    @Column(nullable = false)
    private Integer categoryId;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    @JsonIgnore
    private UsersBio usersBio;
    
    public UserInterest(){}

    public Integer getUserId() {
        return userId;
    }

    public UsersBio getUsersBio() {
        return usersBio;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public void setUsersBio(UsersBio usersBio) {
        this.usersBio = usersBio;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }
    
    
}