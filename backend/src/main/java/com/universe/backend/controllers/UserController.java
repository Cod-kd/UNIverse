package com.universe.backend.controllers;

import com.universe.backend.dto.UserRegistrationDTO;
import com.universe.backend.exceptions.UserAlreadyExistsException;
import com.universe.backend.services.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.universe.backend.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService us;
    
    @GetMapping("/id")
    public ResponseEntity<Integer> getId(@RequestParam String username) {
        Integer id = us.fetchUserId(username);
        return ResponseEntity.ok(id);
    }
    
    @Autowired
    private RegistrationService rs;
            
    @PostMapping("/registration")
    public ResponseEntity<String> userRegistration(@RequestBody @Valid UserRegistrationDTO urDTO) {
        try {
            rs.registerUser(urDTO);
            return ResponseEntity.ok("Sikeres regisztráció!");
        } catch (UserAlreadyExistsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("A felhasználó már létezik: " + ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Váratlan Error regisztráció közben...");
        }
    }
}
