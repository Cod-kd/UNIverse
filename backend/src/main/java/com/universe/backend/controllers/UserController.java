package com.universe.backend.controllers;

import com.universe.backend.dto.UserLoginDTO;
import com.universe.backend.dto.UserRegistrationDTO;
import com.universe.backend.modules.UsersBio;
import com.universe.backend.services.user.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.universe.backend.services.user.UserService;
import jakarta.validation.Valid;

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
    
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody @Valid UserLoginDTO ulDTO) {
        us.login(ulDTO);
        return ResponseEntity.ok("Üdv, " + ulDTO.getUsernameIn() + "!");
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
}
