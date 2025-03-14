package com.universe.backend.modules;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "usersdata")
public class UsersData {
    @Id
    @JsonIgnore
    private Integer userId;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(nullable = true)
    private Boolean gender;

    @Column(nullable = false)
    private LocalDate birthDate;

    @Column(nullable = false, length = 80)
    private String universityName;

    @Column(nullable = false, length = 4)
    private String profilePictureExtension;

    @Column(nullable = false)
    private int followerCount;

    @Column(nullable = false)
    private int followedCount;

    @OneToOne(mappedBy = "usersData")
    @JsonBackReference
    private UserProfiles userProfiles;

    @OneToOne
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    @JsonBackReference
    private UsersBio userBio;

    public Integer getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public Boolean getGender() {
        return gender;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public String getUniversityName() {
        return universityName;
    }

    public String getProfilePictureExtension() {
        return profilePictureExtension;
    }

    public int getFollowerCount() {
        return followerCount;
    }

    public int getFollowedCount() {
        return followedCount;
    }

    public UserProfiles getUserProfiles() {
        return userProfiles;
    }

    public UsersBio getUserBio() {
        return userBio;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setGender(Boolean gender) {
        this.gender = gender;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public void setUniversityName(String universityName) {
        this.universityName = universityName;
    }

    public void setProfilePictureExtension(String profilePictureExtension) {
        this.profilePictureExtension = profilePictureExtension;
    }

    public void setFollowerCount(int followerCount) {
        this.followerCount = followerCount;
    }

    public void setFollowedCount(int followedCount) {
        this.followedCount = followedCount;
    }

    public void setUserProfile(UserProfiles userProfiles) {
        this.userProfiles = userProfiles;
    }

    public void setUserBio(UsersBio userBio) {
        this.userBio = userBio;
    }

    
}