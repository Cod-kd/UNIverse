package com.universe.backend.services.group;

import com.universe.backend.exceptions.GroupNotFoundException;
import com.universe.backend.modules.Event;
import com.universe.backend.modules.Groups;
import com.universe.backend.repositories.GroupsRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import static java.util.Objects.isNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GroupService {
    @Autowired
    private GroupsRepository groupRepository;
    
    public Integer groupIdByName(String groupName){
        Integer gId = groupRepository.idByGroupName(groupName);
        if(isNull(gId)){
            throw new GroupNotFoundException("A csoport nem létezik!");
        }
        return gId;
    }

    public List<Groups> getAllGroups() {
        return groupRepository.findAll();
    }
    
    public List<Groups> searchGroupsByName(String name) {
        return groupRepository.findByNameContainingIgnoreCase(name);
    }
    
    public void addGroupMember(Integer groupId, Integer userId) {
        groupRepository.addGroupMember(groupId, userId);
    }
    
    public void reduceGroupMember(Integer groupId, Integer userId) {
        groupRepository.reduceGroupMember(groupId, userId);
    }
    
    public Boolean isGroupFollowed(int groupId, int userId) {
        return groupRepository.isGroupFollowed(groupId, userId);
    }
    
    public List<Event> getEvents(Integer groupId) {
        return groupRepository.getEvents(groupId);
    }
    
    public void createEvent(Event event, Integer groupId) {
        groupRepository.createEvent(
            event.getName(),
            event.getCreatorId(),
            event.getStartDate(),
            event.getEndDate(),
            event.getPlace(),
            event.getAttachmentRelPath(),
            event.getDescription(),
            groupId
        );
    }
    
    public void addInterestedUser(Integer eventId, Integer userId) {
        groupRepository.addInterestedUser(eventId, userId);
    }

    public void reduceInterestedUser(Integer eventId, Integer userId) {
        groupRepository.reduceInterestedUser(eventId, userId);
    }
    
    @Transactional
    public List<Integer> getInterestedUsersForEvent(Integer eventId){
        return groupRepository.getInterestedUsersForEvent(eventId);
    }
    
    public void addParticipant(Integer eventId, Integer userId) {
        groupRepository.addParticipant(eventId, userId);
    }

    public void reduceParticipant(Integer eventId, Integer userId) {
        groupRepository.reduceParticipant(eventId, userId);
    }
    
    @Transactional
    public List<Integer> getUsersScheduleForEvent(Integer eventId){
        return groupRepository.getUsersScheduleForEvent(eventId);
    }
}
