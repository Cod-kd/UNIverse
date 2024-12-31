package com.universe.backend.repositories;

import com.universe.backend.modules.UserProfiles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserProfilesRepository extends JpaRepository<UserProfiles, Integer>{
    @Procedure(procedureName = "idByUsername")
    Integer idByUsername(@Param("usernameIn") String username);
    
    @Procedure(procedureName = "login")
    UserProfiles login(@Param("usernameIn") String usernameIn);
}
