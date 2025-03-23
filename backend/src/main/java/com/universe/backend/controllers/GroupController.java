package com.universe.backend.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.universe.backend.exceptions.GroupNotFoundException;
import com.universe.backend.modules.Comment;
import com.universe.backend.modules.Event;
import com.universe.backend.modules.Groups;
import com.universe.backend.modules.Posts;
import com.universe.backend.services.ImageService;
import com.universe.backend.services.group.GroupService;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/groups")
public class GroupController {

    @Autowired
    private GroupService gs;

    @Autowired
    private ImageService imageService;

    @Autowired
    private ObjectMapper objectMapper;
    
    @GetMapping
    public ResponseEntity<List<Groups>> getAllGroups() {
        return ResponseEntity.ok(gs.getAllGroups());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Groups>> searchGroupsByName(@RequestParam("name") String name) {
        return ResponseEntity.ok(gs.searchGroupsByName(name));
    }
    
    @GetMapping("get")
    public ResponseEntity<Groups> getGroupById(@RequestParam Integer id) {
        try {
            Groups group = gs.getGroupById(id);
            return ResponseEntity.ok(group);
        } catch (GroupNotFoundException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @PostMapping("/create")
    public ResponseEntity<String> createGroup(@RequestBody Map<String, String> request, Authentication authentication) {
        String groupName = request.get("groupName");
        gs.createGroup(groupName, authentication);
        return ResponseEntity.ok("A csoport létrejött: " + groupName);
    }
    
    @PostMapping("name/{groupName}/follow")
    public ResponseEntity<String> addGroupMember(@PathVariable String groupName, Authentication authentication) {
        Integer groupId = gs.groupIdByName(groupName);
        gs.addGroupMember(groupId, authentication);
        return ResponseEntity.ok("Sikeres követés!");
    }
    
    @PostMapping("name/{groupName}/unfollow")
    public ResponseEntity<String> reduceGroupMember(@PathVariable String groupName, Authentication authentication) {
        Integer groupId = gs.groupIdByName(groupName);
        gs.reduceGroupMember(groupId, authentication);
        return ResponseEntity.ok("Sikeres kikövetés!");
    }
    
    @PostMapping("/isGroupFollowed")
    public ResponseEntity<Boolean> isGroupFollowed(@RequestBody Map<String, Integer> requestBody, Authentication authentication) {
        int groupId = requestBody.get("groupId");
        Boolean isFollowed = gs.isGroupFollowed(groupId, authentication);
        return ResponseEntity.ok(isFollowed);
    }
    
    @PostMapping("name/{groupName}/events")
    public ResponseEntity<List<Event>> getEvents(@PathVariable String groupName) {
        Integer groupId = gs.groupIdByName(groupName);
        return ResponseEntity.ok(gs.getEvents(groupId));
    }
    
    @PostMapping("name/{groupName}/newevent")
    public ResponseEntity<String> createEvent(@RequestBody Event event, @PathVariable String groupName, Authentication authentication) {
        Integer groupId = gs.groupIdByName(groupName);
        gs.createEvent(event, groupId, authentication);
        return ResponseEntity.ok("Esemény sikeresen létrehozva!");
    }
    
    @PostMapping("event/add/interest")
    public ResponseEntity<String> addInterestedUser(@RequestBody Map<String, Integer> requestBody, Authentication authentication) {
        Integer eventId = requestBody.get("eventId");
        gs.addInterestedUser(eventId, authentication);
        return ResponseEntity.ok("Érdeklödő lettél!");
    }

    @PostMapping("event/remove/interest")
    public ResponseEntity<String> reduceInterestedUser(@RequestBody Map<String, Integer> requestBody, Authentication authentication) {
        Integer eventId = requestBody.get("eventId");
        gs.reduceInterestedUser(eventId, authentication);
        return ResponseEntity.ok("Törölted az érdeklődést!");
    }
    
    @PostMapping("event/interested_users")
    public ResponseEntity<List<Integer>> getInterestedUsersForEvent(@RequestBody Map<String, Integer> requestBody) {
        Integer eventId = requestBody.get("eventId");
        List<Integer> eventIdes = gs.getInterestedUsersForEvent(eventId);
        return ResponseEntity.ok(eventIdes);
    }
    
    @PostMapping("event/add/participant")
    public ResponseEntity<String> addParticipant(@RequestBody Map<String, Integer> requestBody, Authentication authentication) {
        Integer eventId = requestBody.get("eventId");
        gs.addParticipant(eventId, authentication);
        return ResponseEntity.ok("Résztvevő lettél!");
    }

    @PostMapping("event/remove/participant")
    public ResponseEntity<String> reduceParticipant(@RequestBody Map<String, Integer> requestBody, Authentication authentication) {
        Integer eventId = requestBody.get("eventId");
        gs.reduceParticipant(eventId, authentication);
        return ResponseEntity.ok("Már nem vagy résztvevő!");
    }
    
    @PostMapping("event/users_schedule")
    public ResponseEntity<List<Integer>> getUsersScheduleForEvent(@RequestBody Map<String, Integer> requestBody) {
        Integer eventId = requestBody.get("eventId");
        List<Integer> eventIdes = gs.getUsersScheduleForEvent(eventId);
        return ResponseEntity.ok(eventIdes);
    }
    
    @PostMapping(value = "name/{groupName}/newpost", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, Object>> createPost(
            @PathVariable String groupName,
            @RequestParam("post") String postJson,
            @RequestParam(value = "image", required = false) MultipartFile image,
            Authentication authentication) {
        try {
            // Parse the post JSON
            Posts post = objectMapper.readValue(postJson, Posts.class);
            
            Integer groupId = gs.groupIdByName(groupName);
            post.setGroupId(groupId);
            Posts createdPost = gs.createPost(post, authentication);
            
            // If an image is provided, upload it
            if (image != null && !image.isEmpty()) {
                imageService.storePostImage(image, createdPost.getId());
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Poszt sikeresen létrehozva!");
            response.put("post", createdPost);
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Hiba a poszt létrehozásakor: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("name/{groupName}/posts")
    public ResponseEntity<List<Posts>> getPosts(@PathVariable String groupName) {
        Integer groupId = gs.groupIdByName(groupName);
        List<Posts> posts = gs.getPosts(groupId);
        return ResponseEntity.ok(posts);
    }
    
    @PostMapping("post/add/comment")
    public ResponseEntity<String> addComment(@RequestBody Comment comment, Authentication authentication) {
        gs.addComment(comment, authentication);
        return ResponseEntity.ok("Sikeres kommentelés!");
    }
    
    @GetMapping("post/get/comment")
    public ResponseEntity<List<Comment>> getComments(@RequestParam Integer postId) {
        List<Comment> comments = gs.getComments(postId);
        return ResponseEntity.ok(comments);
    }
    
    @PostMapping("post/add/credit")
    public ResponseEntity<String> addCredit(@RequestParam Integer postId, Authentication authentication) {
        gs.addCredit(postId, authentication);
        return ResponseEntity.ok("Kredit kézbesítve!");
    }
}