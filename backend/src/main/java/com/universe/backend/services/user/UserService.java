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
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {
    private final UserProfilesRepository upRepo;

    public UserService(UserProfilesRepository upRepo) {
        this.upRepo = upRepo;
    }

    public CustomUserPrincipal getPrincipal(Authentication authentication) {
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

    public void followUser(Integer followerId, Integer followedId) {
        upRepo.followUser(followerId, followedId);
    }

    public void unfollowUser(Integer followerId, Integer followedId) {
        upRepo.unfollowUser(followerId, followedId);
    }

    public Boolean isUserFollowed(int followerId, int followedId) {
        return upRepo.isUserFollowed(followerId, followedId);
    }

    public void updateUserDescription(String description, int userId) {
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
    public List<Integer> getInterestingEventsForUser(Integer userId) {
        return upRepo.getInterestingEventsForUser(userId);
    }

    @Transactional
    public List<Integer> getScheduledEventsForUser(Integer userId) {
        return upRepo.getScheduledEventsForUser(userId);
    }

    public Event getEvent(Integer eventId) {
        return upRepo.getEvent(eventId);
    }
}