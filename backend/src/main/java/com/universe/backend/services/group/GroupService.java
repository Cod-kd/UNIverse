package com.universe.backend.services.group;

import com.universe.backend.config.CustomUserPrincipal;
import com.universe.backend.exceptions.AuthenticationFailedException;
import com.universe.backend.exceptions.GroupNotFoundException;
import com.universe.backend.modules.Event;
import com.universe.backend.modules.Groups;
import com.universe.backend.repositories.GroupsRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import static java.util.Objects.isNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class GroupService {
    @Autowired
    private GroupsRepository groupRepository;
    
    private CustomUserPrincipal getPrincipal(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AuthenticationFailedException("Felhasználó nincs bejelentkezve!");
        }
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof CustomUserPrincipal)) {
            throw new IllegalStateException("Érvénytelen felhasználói principal!");
        }
        return (CustomUserPrincipal) principal;
    }
    
    public Integer groupIdByName(String groupName){
        Integer gId = groupRepository.idByGroupName(groupName);
        if(isNull(gId)){
            throw new GroupNotFoundException("A csoport nem létezik!");
        }
        return gId;
    }
    
    public void createGroup(String groupName, Authentication authentication){
        Integer adminId = getPrincipal(authentication).getUserId();
        groupRepository.createGroup(groupName, adminId);
    }

    public List<Groups> getAllGroups() {
        return groupRepository.findAll();
    }
    
    public List<Groups> searchGroupsByName(String name) {
        return groupRepository.findByNameContainingIgnoreCase(name);
    }
    
    public void addGroupMember(Integer groupId, Authentication authentication) {
        Integer userId = getPrincipal(authentication).getUserId();
        groupRepository.addGroupMember(groupId, userId);
    }
    
    public void reduceGroupMember(Integer groupId, Authentication authentication) {
        Integer userId = getPrincipal(authentication).getUserId();
        groupRepository.reduceGroupMember(groupId, userId);
    }
    
    public Boolean isGroupFollowed(Integer groupId, Authentication authentication) {
        Integer userId = getPrincipal(authentication).getUserId();
        return groupRepository.isGroupFollowed(groupId, userId);
    }
    
    public List<Event> getEvents(Integer groupId) {
        return groupRepository.getEvents(groupId);
    }
    
    public void createEvent(Event event, Integer groupId, Authentication authentication) {
        Integer userId = getPrincipal(authentication).getUserId();
        event.setCreatorId(userId);
        groupRepository.createEvent(
            event.getName(),
            event.getCreatorId(),
            event.getStartDate(),
            event.getEndDate(),
            event.getPlace(),
            event.getDescription(),
            groupId
        );
    }
    
    public void addInterestedUser(Integer eventId, Authentication authentication) {
        Integer userId = getPrincipal(authentication).getUserId();
        groupRepository.addInterestedUser(eventId, userId);
    }

    public void reduceInterestedUser(Integer eventId, Authentication authentication) {
        Integer userId = getPrincipal(authentication).getUserId();
        groupRepository.reduceInterestedUser(eventId, userId);
    }
    
    @Transactional
    public List<Integer> getInterestedUsersForEvent(Integer eventId){
        return groupRepository.getInterestedUsersForEvent(eventId);
    }
    
    public void addParticipant(Integer eventId, Authentication authentication) {
        Integer userId = getPrincipal(authentication).getUserId();
        groupRepository.addParticipant(eventId, userId);
    }

    public void reduceParticipant(Integer eventId, Authentication authentication) {
        Integer userId = getPrincipal(authentication).getUserId();
        groupRepository.reduceParticipant(eventId, userId);
    }
    
    @Transactional
    public List<Integer> getUsersScheduleForEvent(Integer eventId){
        return groupRepository.getUsersScheduleForEvent(eventId);
    }
}
