package com.universe.backend.modules;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "contacttypes")
public class ContactTypes {
    @Id
    private Integer id;

    @Column(nullable = false, length = 20)
    private String name;
    
    @Column(nullable = false, length = 64)
    private String domain;
    
    @Column(nullable = false, length = 5)
    private String protocol;

    @OneToMany(mappedBy = "contacttypes", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UsersContact> contacts = new ArrayList<>();

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getProtocol() {
        return protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

    public List<UsersContact> getContacts() {
        return contacts;
    }

    public void setContacts(List<UsersContact> contacts) {
        this.contacts = contacts;
    }
    
}
