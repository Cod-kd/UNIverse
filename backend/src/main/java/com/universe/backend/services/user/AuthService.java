package com.universe.backend.services.user;

import com.universe.backend.dto.UserLoginDTO;
import com.universe.backend.exceptions.UserIsDeletedExistsException;
import com.universe.backend.exceptions.UserNonExistsException;
import com.universe.backend.exceptions.UserWrongPasswordException;
import com.universe.backend.modules.UserProfiles;
import com.universe.backend.repositories.UserProfilesRepository;
import com.universe.backend.utils.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserProfilesRepository upRepo;
    private final BCryptPasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserProfilesRepository upRepo, JwtUtil jwtUtil) {
        this.upRepo = upRepo;
        this.encoder = new BCryptPasswordEncoder(12);
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public String login(UserLoginDTO ulDTO) {
        UserProfiles up = upRepo.login(ulDTO.getUsernameIn());

        if (up == null) {
            throw new UserNonExistsException("A felhasználó nem létezik");
        }
        if (up.getDeletedAt() != null) {
            throw new UserIsDeletedExistsException("A felhasználó már nem létezik");
        }
        if (!encoder.matches(ulDTO.getPasswordIn(), up.getPassword())) {
            throw new UserWrongPasswordException("A jelszó hibás");
        }

        // Generate JWT token with username and userId
        return jwtUtil.generateToken(up.getUsername(), up.getId());
    }
    
    @Transactional
    public UserProfiles deleteUserProfile(UserLoginDTO ulDTO) {
        UserProfiles up = upRepo.login(ulDTO.getUsernameIn());
        upRepo.deleteUserProfile(ulDTO.getUsernameIn());
        return up;
    }
}