package com.universe.backend.controllers;

import com.universe.backend.dto.UserRegistrationDTO;
import com.universe.backend.modules.Category;
import com.universe.backend.modules.ContactTypes;
import com.universe.backend.modules.Event;
import com.universe.backend.modules.Role;
import com.universe.backend.modules.UserInterest;
import com.universe.backend.modules.UserRole;
import com.universe.backend.modules.UsersBio;
import com.universe.backend.modules.UsersContact;
import com.universe.backend.services.user.RegistrationService;
import com.universe.backend.services.user.UserService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService us;
    private final RegistrationService rs;

    public UserController(UserService us, RegistrationService rs) {
        this.us = us;
        this.rs = rs;
    }

    @GetMapping("/id")
    public ResponseEntity<Integer> getId(@RequestParam String username) {
        Integer id = us.userIdByName(username);
        return ResponseEntity.ok(id);
    }

    @GetMapping("/username")
    public ResponseEntity<String> getUsername(@RequestParam Integer id) {
        String username = us.usernameById(id);
        return ResponseEntity.ok(username);
    }

    @GetMapping("common/contacttypes")
    public ResponseEntity<List<ContactTypes>> getContactTypes() {
        return ResponseEntity.ok(us.getContactTypes());
    }

    @GetMapping("common/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(us.getCategories());
    }

    @GetMapping("common/roles")
    public ResponseEntity<List<Role>> getRoles() {
        return ResponseEntity.ok(us.getRoles());
    }

    @PostMapping("/registration")
    public ResponseEntity<String> registration(@RequestBody @Valid UserRegistrationDTO urDTO) throws MessagingException {
        rs.registerUser(urDTO);
        return ResponseEntity.ok("A regisztráció folyamatban!<br>Kérjük erősítsd meg az emailcímed!");
    }
    
    @GetMapping("/verify")
    public ResponseEntity<String> verifyUserEmail(@RequestParam("token") String token) {
        us.verifyUserEmail(token);
        return ResponseEntity.ok("Sikeres regisztráció!");
    }

    @GetMapping("name/{username}")
    public ResponseEntity<UsersBio> getUsersBioByUsername(@PathVariable String username) {
        UsersBio usersBio = us.getUsersBioByUsername(username);
        return ResponseEntity.ok(usersBio);
    }

    @GetMapping("/all")
    public ResponseEntity<List<UsersBio>> getAllUsersBio() {
        List<UsersBio> usersBios = us.getAllUsersBio();
        return ResponseEntity.ok(usersBios);
    }

    @PostMapping("name/{username}/follow")
    public ResponseEntity<String> followUser(@PathVariable String username, Authentication authentication) {
        Integer followedId = us.userIdByName(username);

        if (followedId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("A felhasználó nem létezik!");
        }
        us.followUser(followedId, authentication);
        return ResponseEntity.ok("Sikeres követés!");
    }

    @PostMapping("name/{username}/unfollow")
    public ResponseEntity<String> unFollowUser(@PathVariable String username, Authentication authentication) {
        Integer followedId = us.userIdByName(username);

        if (followedId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("A felhasználó nem létezik!");
        }
        us.unfollowUser(followedId, authentication);
        return ResponseEntity.ok("Sikeres kikövetés!");
    }

    @PostMapping("/isFollowed")
    public ResponseEntity<Boolean> isFollowed(@RequestBody Map<String, Integer> requestBody, Authentication authentication) {
        int followedId = requestBody.get("followedId");
        Boolean isFollowed = us.isUserFollowed(followedId, authentication);
        return ResponseEntity.ok(isFollowed);
    }

    @PostMapping("/update/desc")
    public ResponseEntity<String> updateUserDesc(@RequestBody Map<String, String> requestBody, Authentication authentication) {
        String description = requestBody.get("description");
        us.updateUserDescription(description, authentication);
        return ResponseEntity.ok("A leírás frissítve!");
    }

    @PostMapping(value = "/add/contact", consumes = "application/json")
    public ResponseEntity<String> addUserContact(@RequestBody UsersContact uc, Authentication authentication) {
        us.addUserContact(uc, authentication);
        return ResponseEntity.ok("Kontakt hozzáadva!");
    }

    @PostMapping(value = "/add/role", consumes = "application/json")
    public ResponseEntity<String> addUserRole(@RequestBody UserRole ur, Authentication authentication) {
        us.addUserRole(ur, authentication);
        return ResponseEntity.ok("Szerepkör hozzáadva!");
    }

    @PostMapping(value = "/add/interest", consumes = "application/json")
    public ResponseEntity<String> addUserInterest(@RequestBody UserInterest ui, Authentication authentication) {
        us.addUserInterest(ui, authentication);
        return ResponseEntity.ok("Érdeklődés hozzáadva!");
    }

    @GetMapping("get/events_interested_in")
    public ResponseEntity<List<Integer>> getInterestingEventsForUser(Authentication authentication) {
        List<Integer> userIdes = us.getInterestingEventsForUser(authentication);
        return ResponseEntity.ok(userIdes);
    }

    @GetMapping("get/events_scheduled")
    public ResponseEntity<List<Integer>> getScheduledEventsForUser(Authentication authentication) {
        List<Integer> userIdes = us.getScheduledEventsForUser(authentication);
        return ResponseEntity.ok(userIdes);
    }

    @GetMapping("get/event")
    public ResponseEntity<Event> getEvent(@RequestParam Integer eventId) {
        Event event = us.getEvent(eventId);
        return ResponseEntity.ok(event);
    }
}