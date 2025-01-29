package com.universe.backend.controllers;

import com.universe.backend.modules.Groups;
import com.universe.backend.services.group.GroupService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/groups")
public class GroupController {

    @Autowired
    private GroupService gs;
    
    @GetMapping
    public ResponseEntity<List<Groups>> getAllGroups() {
        return ResponseEntity.ok(gs.getAllGroups());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Groups>> searchGroupsByName(@RequestParam("name") String name) {
        return ResponseEntity.ok(gs.searchGroupsByName(name));
    }
}