package com.universe.backend.services.group;

import com.universe.backend.exceptions.GroupNotFoundException;
import com.universe.backend.modules.Event;
import com.universe.backend.modules.Groups;
import com.universe.backend.repositories.GroupsRepository;
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
}
