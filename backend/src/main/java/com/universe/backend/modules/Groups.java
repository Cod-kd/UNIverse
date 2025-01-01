package com.universe.backend.modules;

import jakarta.persistence.*;

@Entity
@Table(name = "groups")
public class Groups {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false, length = 60)
    private String name;

    @Column(name = "public", nullable = false)
    private Boolean isPublic;

    @Column(name = "membersCount", nullable = false)
    private Integer membersCount;

    @Column(name = "postCount", nullable = false)
    private Integer postCount;

    @Column(name = "actualEventCount", nullable = false)
    private Integer actualEventCount;

    @Column(name = "allEventCount", nullable = false)
    private Integer allEventCount;

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public Integer getMembersCount() {
        return membersCount;
    }

    public Integer getPostCount() {
        return postCount;
    }

    public Integer getActualEventCount() {
        return actualEventCount;
    }

    public Integer getAllEventCount() {
        return allEventCount;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public void setMembersCount(Integer membersCount) {
        this.membersCount = membersCount;
    }

    public void setPostCount(Integer postCount) {
        this.postCount = postCount;
    }

    public void setActualEventCount(Integer actualEventCount) {
        this.actualEventCount = actualEventCount;
    }

    public void setAllEventCount(Integer allEventCount) {
        this.allEventCount = allEventCount;
    }
}
