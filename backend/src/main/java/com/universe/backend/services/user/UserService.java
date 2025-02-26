package com.universe.backend.services.user;

import com.universe.backend.dto.UserLoginDTO;
import com.universe.backend.exceptions.UserIsDeletedExistsException;
import com.universe.backend.exceptions.UserNonExistsException;
import com.universe.backend.exceptions.UserWrongPasswordException;
import com.universe.backend.modules.UserProfiles;
import com.universe.backend.modules.UsersBio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.universe.backend.repositories.UserProfilesRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import static java.util.Objects.isNull;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UserService {
    @Autowired
    private UserProfilesRepository upRepo;
    
    public Integer userIdByName(String username){
        return upRepo.idByUsername(username);
    }
    
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
    
    @Transactional
    public UserProfiles login(UserLoginDTO ulDTO) {
        UserProfiles up = upRepo.login(ulDTO.getUsernameIn());
        
        if(isNull(up))
            throw new UserNonExistsException("A felhasználó nem létezik");
        if(!isNull(up.getDeletedAt()))
            throw new UserIsDeletedExistsException("A felhasználó már nem létezik");
        if(!encoder.matches(ulDTO.getPasswordIn(), up.getPassword()))
            throw new UserWrongPasswordException("A jelszó hibás");
        
        return up;
    }
    
    public UsersBio getUsersBioByUsername(String username) {
        return upRepo.findUsersBioByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("UsersBio not found for username: " + username));
    }
    
    public void followUser(Integer followerId, Integer followedId) {
        upRepo.addFollower(followerId, followedId);
    }
}
