package com.universe.backend.services.group;

import com.universe.backend.modules.Groups;
import com.universe.backend.repositories.GroupsRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GroupService {
    @Autowired
    private GroupsRepository groupRepository;

    public List<Groups> getAllGroups() {
        return groupRepository.findAll();
    }
    
    public List<Groups> searchGroupsByName(String name) {
        return groupRepository.findByNameContainingIgnoreCase(name);
    }    
}
