package com.universe.backend.repositories;

import com.universe.backend.modules.Event;
import com.universe.backend.modules.Groups;
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
}
