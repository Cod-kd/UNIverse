package com.universe.backend.controllers;

import com.universe.backend.dto.UserLoginDTO;
import com.universe.backend.services.user.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody UserLoginDTO ulDTO) {
        try {
            String token = authService.login(ulDTO);
            return ResponseEntity.ok(token); // Return JWT token directly
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/delete")
    public ResponseEntity<String> deleteUserProfile(@RequestBody @Valid UserLoginDTO ulDTO) {
        authService.deleteUserProfile(ulDTO);
        return ResponseEntity.ok("Sikeres törlés: " + ulDTO.getUsernameIn());
    }
}