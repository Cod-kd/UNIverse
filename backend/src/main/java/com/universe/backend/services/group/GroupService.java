package com.universe.backend.services.group;

import com.universe.backend.config.CustomUserPrincipal;
import com.universe.backend.exceptions.AuthenticationFailedException;
import com.universe.backend.exceptions.GroupNotFoundException;
import com.universe.backend.modules.Comment;
import com.universe.backend.modules.Event;
import com.universe.backend.modules.Groups;
import com.universe.backend.modules.Posts;
import com.universe.backend.repositories.GroupsRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import static java.util.Objects.isNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
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
    
    public Integer groupIdByName(String groupName) {
        Integer gId = groupRepository.idByGroupName(groupName);
        if (isNull(gId)) {
            throw new GroupNotFoundException("A csoport nem létezik!");
        }
        return gId;
    }
    
    public void createGroup(String groupName, Authentication authentication) {
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
    public List<Integer> getInterestedUsersForEvent(Integer eventId) {
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
    public List<Integer> getUsersScheduleForEvent(Integer eventId) {
        return groupRepository.getUsersScheduleForEvent(eventId);
    }
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Transactional
    public Posts createPost(Posts post, Authentication authentication) {
        Integer userId = getPrincipal(authentication).getUserId();
        post.setCreatorId(userId);
        
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("createPost");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("creatorIdIn", post.getCreatorId())
                .addValue("groupIdIn", post.getGroupId())
                .addValue("descriptionIn", post.getDescription());

        Map<String, Object> out = jdbcCall.execute(in);
        post.setId((Integer) out.get("newPostId"));
        return post;
    }

    public List<Posts> getPosts(Integer groupId) {
        return groupRepository.getPosts(groupId);
    }
    
    public void addComment(Comment comment, Authentication authentication) {
        Integer userId = getPrincipal(authentication).getUserId();
        comment.setUserId(userId);
        groupRepository.addComment(comment.getPostId(), comment.getUserId(), comment.getComment());
    }
    
    public List<Comment> getComments(Integer postId) {
        return groupRepository.getComments(postId);
    }
}