package com.universe.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.universe.backend.repositories.UserProfilesRepository;

@Service
public class UserService {
    @Autowired
    private UserProfilesRepository upRepo;
    
    public Integer fetchUserId(String username){
        return upRepo.idByUsername(username);
    }
}
