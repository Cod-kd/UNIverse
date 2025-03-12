package com.universe.backend.repositories;

import com.universe.backend.modules.Category;
import com.universe.backend.modules.ContactTypes;
import com.universe.backend.modules.Role;
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
    
    @Procedure(procedureName = "usernameById")
    String usernameById(@Param("userIdIn") Integer id);
    
    @Query(value = "SELECT * FROM contacttypes", nativeQuery = true)
    List<ContactTypes> getContactTypes();
    
    @Query(value = "SELECT * FROM categories", nativeQuery = true)
    List<Category> getCategories();
    
    @Query(value = "SELECT * FROM roles", nativeQuery = true)
    List<Role> getRoles();
    
    @Procedure(procedureName = "login")
    UserProfiles login(@Param("usernameIn") String usernameIn);
    
    @Procedure(procedureName = "deleteUserProfile")
    void deleteUserProfile(@Param("usernameIn") String usernameIn);

    @Query("SELECT b FROM UsersBio b " +
           "JOIN b.usersData d " +
           "JOIN d.userProfiles p " +
           "WHERE p.username = :username AND p.deletedAt IS NULL")
    Optional<UsersBio> findUsersBioByUsername(@Param("username") String username);
    
    @Query("SELECT b FROM UsersBio b " +
           "JOIN b.usersData d " +
           "JOIN d.userProfiles p " +
           "WHERE p.deletedAt IS NULL")
    List<UsersBio> findAllUsersBio();
    
    @Procedure(name = "followUser")
    void followUser(@Param("followerIdIn") Integer followerId, @Param("followedIdIn") Integer followedId);
    
    @Procedure(name = "unfollowUser")
    void unfollowUser(@Param("followerIdIn") Integer followerId, @Param("followedIdIn") Integer followedId);
    
    @Query(value = "SELECT checkUserFollowed(:followerId, :followedId)", nativeQuery = true)
    Boolean isUserFollowed(@Param("followerId") int followerId, @Param("followedId") int followedId);
    
    @Procedure(name = "updateUserDesc")
    void updateUserDesc(@Param("descriptionIn") String description, @Param("userIdIn") int userId);
    
    
    @Procedure(procedureName = "addUserContact")
    void addUserContact(
        @Param("contactTypeIdIn") Integer contactTypeId, 
        @Param("pathIn") String path, 
        @Param("userIdIn") Integer userId
    );
    
    @Procedure(procedureName = "addUserRole")
    void addUserRole(
        @Param("userIdIn") Integer userId, 
        @Param("roleIdIn") Integer roleId
    );
    
    @Procedure(procedureName = "addUserInterest")
    void addUserInterest(
        @Param("userIdIn") Integer userId, 
        @Param("categoryIdIn") Integer categoryId
    );
    
    @Procedure(procedureName = "getInterestingEventsForUser")
    List<Integer> getInterestingEventsForUser(@Param("userIdIn") Integer userIdIn);
}
