package com.universe.backend.repositories;

import com.universe.backend.modules.UserProfiles;
import com.universe.backend.modules.UsersBio;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserProfilesRepository extends JpaRepository<UserProfiles, Integer>{
    @Procedure(procedureName = "idByUsername")
    Integer idByUsername(@Param("usernameIn") String username);
    
    @Procedure(procedureName = "login")
    UserProfiles login(@Param("usernameIn") String usernameIn);
    
    @Query("SELECT b FROM UsersBio b " +
           "JOIN b.usersData d " +
           "JOIN d.userProfiles p " +
           "WHERE p.username = :username")
    Optional<UsersBio> findUsersBioByUsername(@Param("username") String username);
    
    @Query("SELECT b FROM UsersBio b ")
    List<UsersBio> findAllUsersBio();
    
    @Procedure(name = "followUser")
    void followUser(@Param("followerIdIn") Integer followerId, @Param("followedIdIn") Integer followedId);
    
    @Procedure(name = "unfollowUser")
    void unfollowUser(@Param("followerIdIn") Integer followerId, @Param("followedIdIn") Integer followedId);
}
