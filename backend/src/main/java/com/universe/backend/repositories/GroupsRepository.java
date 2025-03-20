package com.universe.backend.repositories;

import com.universe.backend.modules.Comment;
import com.universe.backend.modules.Event;
import com.universe.backend.modules.Groups;
import com.universe.backend.modules.Posts;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupsRepository extends JpaRepository<Groups, Integer>{
    
    @Procedure(procedureName = "idByGroupName")
    Integer idByGroupName(@Param("groupNameIn") String groupName);
    
    @Procedure(procedureName = "createGroup")
    void createGroup(@Param("nameIn") String groupName, @Param("adminIdIn") Integer adminId);
    
    @Override
    List<Groups> findAll();
    
    List<Groups> findByNameContainingIgnoreCase(String name);
    
    @Procedure(name = "addGroupMember")
    void addGroupMember(@Param("groupIdIn") Integer groupId, @Param("userIdIn") Integer userId);
    
    @Procedure(name = "reduceGroupMember")
    void reduceGroupMember(@Param("groupIdIn") Integer groupId, @Param("userIdIn") Integer userId);
    
    @Query(value = "SELECT checkGroupMember(:groupIdIn, :userIdIn)", nativeQuery = true)
    Boolean isGroupFollowed(@Param("groupIdIn") Integer groupId, @Param("userIdIn") Integer userId);
    
    @Query(value = "SELECT * FROM events WHERE groupId = :groupIdIn", nativeQuery = true)
    List<Event> getEvents(@Param("groupIdIn") Integer groupId);
    
    @Procedure(procedureName = "createEvent")
    void createEvent(
        @Param("nameIn") String name,
        @Param("creatorIdIn") Integer creatorId,
        @Param("startDateIn") LocalDateTime startDate,
        @Param("endDateIn") LocalDateTime endDate,
        @Param("placeIn") String place,
        @Param("descriptionIn") String description,
        @Param("groupIdIn") Integer groupId
    );
    
    @Procedure(procedureName = "addInterestedUser")
    void addInterestedUser(@Param("eventIdIn") Integer eventId, @Param("userIdIn") Integer userId);

    @Procedure(procedureName = "reduceInterestedUser")
    void reduceInterestedUser(@Param("eventIdIn") Integer eventId, @Param("userIdIn") Integer userId);
    
    @Procedure(procedureName = "getInterestedUsersForEvent")
    List<Integer> getInterestedUsersForEvent(@Param("eventIdIn") Integer eventId);
    
    @Procedure(procedureName = "addParticipant")
    void addParticipant(@Param("eventIdIn") Integer eventId, @Param("userIdIn") Integer userId);

    @Procedure(procedureName = "reduceParticipant")
    void reduceParticipant(@Param("eventIdIn") Integer eventId, @Param("userIdIn") Integer userId);
    
    @Procedure(procedureName = "getUsersScheduleForEvent")
    List<Integer> getUsersScheduleForEvent(@Param("eventIdIn") Integer eventId);

    @Query(value = "SELECT * FROM posts WHERE groupId = :groupIdIn ORDER BY id DESC", nativeQuery = true)
    List<Posts> getPosts(@Param("groupIdIn") Integer groupId);
    
    @Procedure(procedureName = "addComment")
    void addComment(@Param("postIdIn") Integer postId, @Param("userIdIn") Integer userId, @Param("commentIn") String comment);

    @Query(value = "SELECT * FROM comments WHERE postId = :postIdIn ORDER BY id", nativeQuery = true)
    List<Comment> getComments(@Param("postIdIn") Integer postId);
}
