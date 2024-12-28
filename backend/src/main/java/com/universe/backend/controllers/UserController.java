package com.universe.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.universe.backend.services.UserService;

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
}
