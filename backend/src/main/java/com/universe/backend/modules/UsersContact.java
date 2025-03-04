package com.universe.backend.modules;

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
    @Column(nullable = false)
    private Integer userId;

    @Id
    @Column(nullable = false)
    private Integer contactTypeId;

    @Column(nullable = false, length = 60)
    private String path;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private UsersBio usersBio;
    
    @ManyToOne
    @JoinColumn(name = "contactTypeId", nullable = false)
    private ContactTypes contacttypes;

    public ContactTypes getContacttypes() {
        return contacttypes;
    }

    public void setContacttypes(ContactTypes contacttypes) {
        this.contacttypes = contacttypes;
    }

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
    
}
