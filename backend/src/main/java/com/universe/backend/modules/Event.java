package com.universe.backend.modules;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @Column(nullable = false)
    private Integer id;  // int(11)

    @Column(nullable = false, length = 30)
    private String name;  // varchar(30)

    @Column(nullable = false)
    private Integer creatorId;  // mediumint(9)
    
    @Column(nullable = false)
    private Integer groupId;  // mediumint(9)

    @Column
    private LocalDateTime startDate;  // timestamp

    @Column
    private LocalDateTime endDate;  // timestamp

    @Column(nullable = false, length = 255)
    private String place;  // varchar(255)

    @Column(nullable = false, length = 50)
    private String attachmentRelPath = "";  // varchar(50)

    @Column(nullable = false, length = 180)
    private String description = "";  // varchar(180)

    @Column
    private Integer participantsCount = 0;  // mediumint(9)

    @Column
    private Integer interestedUsersCount = 0;  // mediumint(9)

    @Column
    private Boolean isActual = true;  // tinyint(1) used as boolean

    // Default constructor (required by JPA)
    public Event() {}

    // Getters and Setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Integer creatorId) {
        this.creatorId = creatorId;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public String getPlace() {
        return place;
    }

    public void setPlace(String place) {
        this.place = place;
    }

    public String getAttachmentRelPath() {
        return attachmentRelPath;
    }

    public void setAttachmentRelPath(String attachmentRelPath) {
        this.attachmentRelPath = attachmentRelPath;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getParticipantsCount() {
        return participantsCount;
    }

    public void setParticipantsCount(Integer participantsCount) {
        this.participantsCount = participantsCount;
    }

    public Integer getInterestedUsersCount() {
        return interestedUsersCount;
    }

    public void setInterestedUsersCount(Integer interestedUsersCount) {
        this.interestedUsersCount = interestedUsersCount;
    }

    public Boolean getIsActual() {
        return isActual;
    }

    public void setIsActual(Boolean isActual) {
        this.isActual = isActual;
    }
    
    @JsonIgnore
    public Integer getGroupId() {
        return groupId;
    }

    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }
}