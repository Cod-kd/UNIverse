package com.universe.backend.controllers;

import com.universe.backend.dto.UserLoginDTO;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.universe.backend.services.user.UserService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService us;

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
    
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody @Valid UserLoginDTO ulDTO) {
        us.login(ulDTO);
        return ResponseEntity.ok("Üdv, " + ulDTO.getUsernameIn() + "!");
    }
    
    @PostMapping("/delete")
    public ResponseEntity<String> deleteUserProfile(@RequestBody @Valid UserLoginDTO ulDTO) {
        us.deleteUserProfile(ulDTO);
        return ResponseEntity.ok("Sikeres törlés: " + ulDTO.getUsernameIn());
    }

    @Autowired
    private RegistrationService rs;

    @PostMapping("/registration")
    public ResponseEntity<String> registration(@RequestBody @Valid UserRegistrationDTO urDTO) {
        rs.registerUser(urDTO);
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
    public ResponseEntity<String> followUser(@PathVariable String username, @RequestBody Map<String, Integer> request) {
        Integer followerId = request.get("followerId");
        Integer followedId = us.userIdByName(username);

        if (followedId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("A felhasználó nem létezik!");
        }
        us.followUser(followerId, followedId);
        return ResponseEntity.ok("Sikeres követés!");
    }
    
    @PostMapping("name/{username}/unfollow")
    public ResponseEntity<String> unFollowUser(@PathVariable String username, @RequestBody Map<String, Integer> request) {
        Integer followerId = request.get("followerId");
        Integer followedId = us.userIdByName(username);

        if (followedId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("A felhasználó nem létezik!");
        }
        us.unfollowUser(followerId, followedId);
        return ResponseEntity.ok("Sikeres kikövetés!");
    }
    
    @PostMapping("/isFollowed")
    public ResponseEntity<Boolean> isFollowed(@RequestBody Map<String, Integer> requestBody) {
        int followerId = requestBody.get("followerId");
        int followedId = requestBody.get("followedId");
        Boolean isFollowed = us.isUserFollowed(followerId, followedId);
        return ResponseEntity.ok(isFollowed);
    }

    @PostMapping("/update/desc")
    public ResponseEntity<String> updateUserDesc(@RequestBody Map<String, Object> requestBody) {
        String description = (String) requestBody.get("description");
        Integer userId = (Integer) requestBody.get("userId");
        us.updateUserDescription(description, userId);
        return ResponseEntity.ok("A leírás frissítve!");
    }
    
    @PostMapping(value = "/add/contact", consumes = "application/json")
    public ResponseEntity<String> addUserContact(@RequestBody UsersContact uc) {
        try {
            us.addUserContact(uc);
            return ResponseEntity.ok("Kontakt hozzáadva!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Hiba történt: " + e.getMessage());
        }
    }
    
    @PostMapping(value = "/add/role", consumes = "application/json")
    public ResponseEntity<String> addUserRole(@RequestBody UserRole ur) {
        try {
            us.addUserRole(ur);
            return ResponseEntity.ok("Szerepkör hozzáadva!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Hiba történt: " + e.getMessage());
        }
    }
    
    @PostMapping(value = "/add/interest", consumes = "application/json")
    public ResponseEntity<String> addUserInterest(@RequestBody UserInterest ui) {
        try {
            us.addUserInterest(ui);
            return ResponseEntity.ok("Érdeklődés hozzáadva!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Hiba történt: " + e.getMessage());
        }
    }
    
    @GetMapping("get/events_interested_in")
    public ResponseEntity<List<Integer>> getInterestingEventsForUser(@RequestParam Integer userId) {
        List<Integer> userIdes = us.getInterestingEventsForUser(userId);
        return ResponseEntity.ok(userIdes);
    }
    
    @GetMapping("get/events_scheduled")
    public ResponseEntity<List<Integer>> getScheduledEventsForUser(@RequestParam Integer userId) {
        List<Integer> userIdes = us.getScheduledEventsForUser(userId);
        return ResponseEntity.ok(userIdes);
    }
    
    @GetMapping("get/event")
    public ResponseEntity<Event> getEvent(@RequestParam Integer eventId) {
        Event event = us.getEvent(eventId);
        return ResponseEntity.ok(event);
    }
}
