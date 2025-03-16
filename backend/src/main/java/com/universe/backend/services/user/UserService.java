package com.universe.backend.services.user;

import com.universe.backend.config.CustomUserPrincipal;
import com.universe.backend.exceptions.AuthenticationFailedException;
import com.universe.backend.modules.Category;
import com.universe.backend.modules.ContactTypes;
import com.universe.backend.modules.Event;
import com.universe.backend.modules.Role;
import com.universe.backend.modules.UserInterest;
import com.universe.backend.modules.UserRole;
import com.universe.backend.modules.UsersBio;
import com.universe.backend.modules.UsersContact;
import com.universe.backend.repositories.UserProfilesRepository;
import com.universe.backend.utils.JwtUtilForEmail;
import jakarta.persistence.EntityNotFoundException;
import java.sql.CallableStatement;
import java.sql.Types;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.JdbcTemplate;

@Service
public class UserService {
    private final UserProfilesRepository upRepo;
    private final JwtUtilForEmail jwtUtilEmail;
    private final JdbcTemplate jdbcTemplate;

    public UserService(UserProfilesRepository upRepo, JwtUtilForEmail jwtUtilEmail, JdbcTemplate jdbcTemplate) {
        this.upRepo = upRepo;
        this.jwtUtilEmail = jwtUtilEmail;
        this.jdbcTemplate = jdbcTemplate;
    }
    
    @Transactional
    public void verifyUserEmail(String token) {
        String email = jwtUtilEmail.validateVerificationToken(token);
        System.out.println(email);
        if (email == null) {
            throw new EntityNotFoundException("Érvénytelen vagy lejárt token!");
        }
        Integer affectedRows = jdbcTemplate.execute(
            (CallableStatementCreator) conn -> {
                CallableStatement cs = conn.prepareCall("{CALL universe.verifyUserByEmail(?, ?)}");
                cs.setString(1, email);
                cs.registerOutParameter(2, Types.INTEGER);
                return cs;
            },
            cs -> {
                cs.execute();
                return cs.getInt(2);
            }
        );

        if (affectedRows == null || affectedRows <= 0) {
            throw new EntityNotFoundException("A verifikáció sikertelen! A felhasználó nem található vagy már ellenőrzött.");
        }
    }
    
    public void sendEmail(String email) {
        jwtUtilEmail.generateVerificationToken(email);
    }

    private CustomUserPrincipal getPrincipal(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AuthenticationFailedException("Felhasználó nincs bejelentkezve!");
        }
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof CustomUserPrincipal)) {
            throw new IllegalStateException("Érvénytelen felhasználói principal!");
        }
        return (CustomUserPrincipal) principal;
    }

    public Integer userIdByName(String username) {
        return upRepo.idByUsername(username);
    }

    public String usernameById(Integer id) {
        return upRepo.usernameById(id);
    }

    @Transactional
    public List<ContactTypes> getContactTypes() {
        return upRepo.getContactTypes();
    }

    @Transactional
    public List<Category> getCategories() {
        return upRepo.getCategories();
    }

    @Transactional
    public List<Role> getRoles() {
        return upRepo.getRoles();
    }

    public UsersBio getUsersBioByUsername(String username) {
        return upRepo.findUsersBioByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("A felhasználó nem létezik: " + username));
    }

    public List<UsersBio> getAllUsersBio() {
        List<UsersBio> usersBios = upRepo.findAllUsersBio();
        if (usersBios.isEmpty()) {
            throw new EntityNotFoundException("Váratlan hiba a felhasználók lekérésénél!");
        }
        return usersBios;
    }

    public void followUser(Integer followedId, Authentication authentication) {
        Integer followerId = getPrincipal(authentication).getUserId();
        upRepo.followUser(followerId, followedId);
    }

    public void unfollowUser(Integer followedId, Authentication authentication) {
        Integer followerId = getPrincipal(authentication).getUserId();
        upRepo.unfollowUser(followerId, followedId);
    }

    public Boolean isUserFollowed(Integer followedId, Authentication authentication) {
        Integer followerId = getPrincipal(authentication).getUserId();
        return upRepo.isUserFollowed(followerId, followedId);
    }

    public void updateUserDescription(String description, Authentication authentication) {
        Integer userId = getPrincipal(authentication).getUserId();
        upRepo.updateUserDesc(description, userId);
    }

    @Transactional
    public void addUserContact(UsersContact uc, Authentication authentication) {
        if (uc.getContactTypeId() == null || uc.getPath() == null) {
            throw new IllegalArgumentException("Az elérhetőség nem lehet üres!");
        }
        Integer userId = getPrincipal(authentication).getUserId();
        uc.setUserId(userId);
        upRepo.addUserContact(uc.getContactTypeId(), uc.getPath(), uc.getUserId());
    }

    @Transactional
    public void addUserRole(UserRole ur, Authentication authentication) {
        if (ur.getRoleId() == null) {
            throw new IllegalArgumentException("A szerepkör nem lehet üres!");
        }
        Integer userId = getPrincipal(authentication).getUserId();
        if (userId == null) {
            throw new IllegalStateException("Felhasználó ID nem lehet üres!");
        }
        ur.setUserId(userId);
        upRepo.addUserRole(ur.getUserId(), ur.getRoleId());
    }

    @Transactional
    public void addUserInterest(UserInterest ui, Authentication authentication) {
        if (ui.getCategoryId() == null) {
            throw new IllegalArgumentException("A kategória nem lehet üres!");
        }
        Integer userId = getPrincipal(authentication).getUserId();
        if (userId == null) {
            throw new IllegalStateException("Felhasználó ID nem lehet üres!");
        }
        ui.setUserId(userId);
        upRepo.addUserInterest(ui.getUserId(), ui.getCategoryId());
    }

    @Transactional
    public List<Integer> getInterestingEventsForUser(Authentication authentication) {
        Integer userId = getPrincipal(authentication).getUserId();
        return upRepo.getInterestingEventsForUser(userId);
    }

    @Transactional
    public List<Integer> getScheduledEventsForUser(Authentication authentication) {
        Integer userId = getPrincipal(authentication).getUserId();
        return upRepo.getScheduledEventsForUser(userId);
    }

    public Event getEvent(Integer eventId) {
        return upRepo.getEvent(eventId);
    }
}