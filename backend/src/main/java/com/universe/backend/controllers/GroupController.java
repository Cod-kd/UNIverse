package com.universe.backend.controllers;

import com.universe.backend.modules.Event;
import com.universe.backend.modules.Groups;
import com.universe.backend.services.group.GroupService;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
    
    @PostMapping("name/{groupName}/follow")
    public ResponseEntity<String> addGroupMember(@PathVariable String groupName, @RequestBody Map<String, Integer> request) {
        Integer userId = request.get("userId");
        Integer groupId = gs.groupIdByName(groupName);
        gs.addGroupMember(groupId, userId);
        return ResponseEntity.ok("Sikeres követés!");
    }
    
    @PostMapping("name/{groupName}/unfollow")
    public ResponseEntity<String> reduceGroupMember(@PathVariable String groupName, @RequestBody Map<String, Integer> request) {
        Integer userId = request.get("userId");
        Integer groupId = gs.groupIdByName(groupName);
        gs.reduceGroupMember(groupId, userId);
        return ResponseEntity.ok("Sikeres kikövetés!");
    }
    
    @PostMapping("/isGroupFollowed")
    public ResponseEntity<Boolean> isGroupFollowed(@RequestBody Map<String, Integer> requestBody) {
        int userId = requestBody.get("userId");
        int groupId = requestBody.get("groupId");
        Boolean isFollowed = gs.isGroupFollowed(groupId, userId);
        return ResponseEntity.ok(isFollowed);
    }
    
    @PostMapping("name/{groupName}/events")
    public ResponseEntity<List<Event> > getEvents(@PathVariable String groupName) {
        Integer groupId = gs.groupIdByName(groupName);
        return ResponseEntity.ok(gs.getEvents(groupId));
    }
    
    @PostMapping("name/{groupName}/newevent")
    public ResponseEntity<String> createEvent(@RequestBody Event event, @PathVariable String groupName) {
        Integer groupId = gs.groupIdByName(groupName);
        gs.createEvent(event,groupId);
        return ResponseEntity.ok("Esemény sikeresen létrehozva!");
    }
    
    @PostMapping("event/add/interest")
    public ResponseEntity<String> addInterestedUser(@RequestBody Map<String, Integer> requestBody) {
        Integer eventId = requestBody.get("eventId");
        Integer userId = requestBody.get("userId");
        gs.addInterestedUser(eventId, userId);
        return ResponseEntity.ok("Érdeklödő lettél!");
    }

    @PostMapping("event/remove/interest")
    public ResponseEntity<String> reduceInterestedUser(@RequestBody Map<String, Integer> requestBody) {
        Integer eventId = requestBody.get("eventId");
        Integer userId = requestBody.get("userId");
        gs.reduceInterestedUser(eventId, userId);
        return ResponseEntity.ok("Törölted az érdeklődést!");
    }
    
    @PostMapping("event/interested_users")
    public ResponseEntity<List<Integer>> getInterestedUsersForEvent(@RequestBody Map<String, Integer> requestBody) {
        Integer eventId = requestBody.get("eventId");
        List<Integer> eventIdes = gs.getInterestedUsersForEvent(eventId);
        return ResponseEntity.ok(eventIdes);
    }
    
    @PostMapping("event/add/participant")
    public ResponseEntity<String> addParticipant(@RequestBody Map<String, Integer> requestBody) {
        Integer eventId = requestBody.get("eventId");
        Integer userId = requestBody.get("userId");
        gs.addParticipant(eventId, userId);
        return ResponseEntity.ok("Résztvevő lettél!");
    }

    @PostMapping("event/remove/participant")
    public ResponseEntity<String> reduceParticipant(@RequestBody Map<String, Integer> requestBody) {
        Integer eventId = requestBody.get("eventId");
        Integer userId = requestBody.get("userId");
        gs.reduceParticipant(eventId, userId);
        return ResponseEntity.ok("Már nem vagy résztvevő!");
    }
    
    @PostMapping("event/users_schedule")
    public ResponseEntity<List<Integer>> getUsersScheduleForEvent(@RequestBody Map<String, Integer> requestBody) {
        Integer eventId = requestBody.get("eventId");
        List<Integer> eventIdes = gs.getUsersScheduleForEvent(eventId);
        return ResponseEntity.ok(eventIdes);
    }
}