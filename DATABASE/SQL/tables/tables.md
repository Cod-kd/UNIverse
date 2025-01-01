# UNIverse Database Tables

This document describes the tables in the UNIverse social media platform's database. The tables are categorized into **main (entity) tables** and **junction (relationship) tables**. Each table serves a specific role in managing user data, interactions, and content.

## Main (Entity) Tables

These tables store primary entities in the system such as users, groups, events, posts, and other individual objects. 

1. **UserProfiles**  
   Stores the core user profile data (e.g.: username, email).

2. **UsersBio**  
   Stores biographical details of users (e.g.: description).

3. **ContactTypes**  
   Defines the types of contact information (e.g.: email, social media links).

4. **Roles**  
   Stores the different user roles available (e.g.: student, tutor).

5. **UsersData**  
   Stores additional user-related data, for analytics or extended profile attributes.

6. **Events**  
   Stores information about events created within the platform (e.g.: event name, description, date).

7. **Categories**  
   Stores various categories that can be applied to posts, events, groups, and other entities.

8. **Groups**  
   Stores the details of user-created groups within the platform.

9. **Ranks**  
   Stores rank information (e.g.: admin, moderator).

10. **Posts**  
    Stores user-created posts that may be shared within groups or publicly.

11. **Comments**  
    Stores user comments on posts.

## Junction (Relationship) Tables

These tables manage many-to-many or one-to-many relationships between entities, such as user roles, group memberships, event participants, etc.

1. **UsersContacts**  
   Links users to their contact details (e.g.: emails).

2. **UserRoles**  
   Links users to their roles.

3. **UserInterests**  
   Links users to categories that represent their interests (e.g.: technology, sports).

4. **FollowedUsers**  
   Tracks the relationship between users who follow other users.

5. **FollowedGroups**  
   Tracks which groups a user follows.

6. **Participants**  
   Links users who are participating in events.

7. **InterestedUsers**  
   Links users who have expressed interest in events.

8. **MembersOfGroups**  
   Links users to groups they are members of.

9. **PostsOfGroups**  
   Links posts to the groups they belong to.

10. **EventsOfGroups**  
    Links events to the groups that host them.

11. **GroupRanks**  
    Links ranks to specific groups.

12. **GroupCategories**  
    Links groups to specific categories (e.g.: interests or themes of the group).

13. **PostsCategories**  
    Links posts to categories that classify the content.

14. **EventCategories**  
    Links events to specific categories.

15. **EventCalendars**  
    Links events to users whoes are associated with.

## Summary

This database schema supports user interactions, group management, event participation, and categorization of content in the UNIverse platform. The **entity tables** store individual items such as users, groups, events, and posts, while the **relationship tables** manage the connections between these entities, allowing for complex interactions and structured data organization.