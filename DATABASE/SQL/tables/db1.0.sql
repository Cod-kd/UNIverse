CREATE TABLE `UserProfiles` (
  `id` MEDIUMINT PRIMARY KEY AUTO_INCREMENT,
  `email` VARCHAR(50) UNIQUE NOT NULL,
  `username` VARCHAR(12) UNIQUE NOT NULL,
  `password` VARCHAR(60) NOT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` TIMESTAMP NULL DEFAULT NULL
);

CREATE TABLE `UsersBio` (
  `userId` MEDIUMINT PRIMARY KEY NOT NULL,
  `faculty` VARCHAR(30) NOT NULL,
  `description` VARCHAR(85) DEFAULT ''
);

CREATE TABLE `UsersContacts` (
  `userId` MEDIUMINT NOT NULL,
  `contactTypeId` TINYINT NOT NULL,
  `path` VARCHAR(60) NOT NULL
);

CREATE TABLE `ContactTypes` (
  `id` TINYINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(20) NOT NULL,
  `domain` VARCHAR(64) NOT NULL,
  `protocol` VARCHAR(5) NOT NULL DEFAULT 'https'
);

CREATE TABLE `Roles` (
  `id` TINYINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE `UserRoles` (
  `userId` MEDIUMINT NOT NULL,
  `roleId` TINYINT NOT NULL
);

CREATE TABLE `UsersData` (
  `userId` MEDIUMINT PRIMARY KEY NOT NULL,
  `name` VARCHAR(80) NOT NULL,
  `gender` BOOLEAN DEFAULT -1,
  `birthDate` DATE NOT NULL,
  `universityName` VARCHAR(80) NOT NULL,
  `profilePictureExtension` VARCHAR(4) NOT NULL,
  `followerCount` MEDIUMINT NOT NULL DEFAULT 0,
  `followedCount` MEDIUMINT NOT NULL DEFAULT 0
);

CREATE TABLE `UserInterests` (
  `userId` MEDIUMINT NOT NULL,
  `categoryId` SMALLINT NOT NULL
);

CREATE TABLE `FollowedUsers` (
  `followerId` MEDIUMINT NOT NULL,
  `followedId` MEDIUMINT NOT NULL
);

CREATE TABLE `FollowedGroups` (
  `followerId` MEDIUMINT NOT NULL,
  `followedGroupId` MEDIUMINT NOT NULL
);

CREATE TABLE `Events` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(30) NOT NULL,
  `creatorId` MEDIUMINT NOT NULL,
  `startDate` TIMESTAMP NULL DEFAULT NULL,
  `endDate` TIMESTAMP NULL DEFAULT NULL,
  `place` VARCHAR(255) NOT NULL,
  `attachmentRelPath` VARCHAR(50) NOT NULL DEFAULT '',
  `description` VARCHAR(180) NOT NULL DEFAULT '',
  `participantsCount` MEDIUMINT DEFAULT 0,
  `interestedUsersCount` MEDIUMINT DEFAULT 0,
  `isActual` BOOL DEFAULT true
);

CREATE TABLE `Participants` (
  `eventId` INT NOT NULL,
  `userId` MEDIUMINT NOT NULL
);

CREATE TABLE `InterestedUsers` (
  `eventId` INT NOT NULL,
  `userId` MEDIUMINT NOT NULL
);

CREATE TABLE `EventCategories` (
  `eventId` INT NOT NULL,
  `categoryId` SMALLINT NOT NULL
);

CREATE TABLE `EventCalendars` (
  `userId` MEDIUMINT NOT NULL,
  `eventId` INT NOT NULL
);

CREATE TABLE `Categories` (
  `id` SMALLINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(40) UNIQUE NOT NULL
);

CREATE TABLE `Groups` (
  `id` MEDIUMINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(60) NOT NULL,
  `public` BOOLEAN DEFAULT true,
  `membersCount` MEDIUMINT DEFAULT 0,
  `postCount` INT DEFAULT 0,
  `actualEventCount` INT DEFAULT 0,
  `allEventCount` INT DEFAULT 0
  -- @todo: description
);

CREATE TABLE `MembersOfGroups` (
  `groupId` MEDIUMINT NOT NULL,
  `userId` MEDIUMINT NOT NULL
);

CREATE TABLE `PostsOfGroups` (
  `groupId` MEDIUMINT NOT NULL,
  `postId` INT NOT NULL
);

CREATE TABLE `EventsOfGroups` (
  `groupId` MEDIUMINT NOT NULL,
  `eventId` INT NOT NULL
);

CREATE TABLE `Ranks` (
  `id` TINYINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(30) UNIQUE NOT NULL,
  `isAdmin` BOOL DEFAULT false,
  `canView` BOOL DEFAULT true,
  `canComment` BOOL DEFAULT true,
  `canPost` BOOL DEFAULT true,
  `canModify` BOOL DEFAULT false
);

CREATE TABLE `GroupRanks` (
  `groupId` MEDIUMINT NOT NULL,
  `userId` MEDIUMINT NOT NULL,
  `rankId` TINYINT NOT NULL
);

CREATE TABLE `GroupCategories` (
  `groupId` MEDIUMINT NOT NULL,
  `categoryId` SMALLINT NOT NULL
);

CREATE TABLE `Posts` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `creatorId` MEDIUMINT NOT NULL,
  `likesCount` MEDIUMINT DEFAULT 0,
  `description` TEXT NOT NULL DEFAULT '',
  `attachmentsRelPath` JSON NOT NULL /*DEFAULT '{}'*/
);

CREATE TABLE `Comments` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `postId` INT NOT NULL,
  `userId` MEDIUMINT NOT NULL,
  `comment` TINYTEXT NOT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `PostsCategories` (
  `postId` INT NOT NULL,
  `categoryId` SMALLINT NOT NULL
);

ALTER TABLE `UsersContacts` ADD FOREIGN KEY (`userId`) REFERENCES `UsersBio` (`userId`);

ALTER TABLE `UsersContacts` ADD FOREIGN KEY (`contactTypeId`) REFERENCES `ContactTypes` (`id`);

ALTER TABLE `UserRoles` ADD FOREIGN KEY (`userId`) REFERENCES `UsersBio` (`userId`);

ALTER TABLE `UserRoles` ADD FOREIGN KEY (`roleId`) REFERENCES `Roles` (`id`);

ALTER TABLE `UserInterests` ADD FOREIGN KEY (`userId`) REFERENCES `UsersBio` (`userId`);

ALTER TABLE `UserInterests` ADD FOREIGN KEY (`categoryId`) REFERENCES `Categories` (`id`);

ALTER TABLE `FollowedUsers` ADD FOREIGN KEY (`followerId`) REFERENCES `UserProfiles` (`id`);

ALTER TABLE `FollowedUsers` ADD FOREIGN KEY (`followedId`) REFERENCES `UserProfiles` (`id`);

ALTER TABLE `FollowedGroups` ADD FOREIGN KEY (`followerId`) REFERENCES `UserProfiles` (`id`);

ALTER TABLE `FollowedGroups` ADD FOREIGN KEY (`followedGroupId`) REFERENCES `Groups` (`id`);

ALTER TABLE `Events` ADD FOREIGN KEY (`creatorId`) REFERENCES `UserProfiles` (`id`);

ALTER TABLE `Participants` ADD FOREIGN KEY (`eventId`) REFERENCES `Events` (`id`);

ALTER TABLE `Participants` ADD FOREIGN KEY (`userId`) REFERENCES `UsersData` (`userId`);

ALTER TABLE `InterestedUsers` ADD FOREIGN KEY (`eventId`) REFERENCES `Events` (`id`);

ALTER TABLE `InterestedUsers` ADD FOREIGN KEY (`userId`) REFERENCES `UsersData` (`userId`);

ALTER TABLE `EventCategories` ADD FOREIGN KEY (`eventId`) REFERENCES `Events` (`id`);

ALTER TABLE `EventCategories` ADD FOREIGN KEY (`categoryId`) REFERENCES `Categories` (`id`);

ALTER TABLE `EventCalendars` ADD FOREIGN KEY (`userId`) REFERENCES `UsersData` (`userId`);

ALTER TABLE `EventCalendars` ADD FOREIGN KEY (`eventId`) REFERENCES `Events` (`id`);

ALTER TABLE `MembersOfGroups` ADD FOREIGN KEY (`groupId`) REFERENCES `Groups` (`id`);

ALTER TABLE `MembersOfGroups` ADD FOREIGN KEY (`userId`) REFERENCES `UserProfiles` (`id`);

ALTER TABLE `PostsOfGroups` ADD FOREIGN KEY (`groupId`) REFERENCES `Groups` (`id`);

ALTER TABLE `PostsOfGroups` ADD FOREIGN KEY (`postId`) REFERENCES `Posts` (`id`);

ALTER TABLE `EventsOfGroups` ADD FOREIGN KEY (`groupId`) REFERENCES `Groups` (`id`);

ALTER TABLE `EventsOfGroups` ADD FOREIGN KEY (`eventId`) REFERENCES `Events` (`id`);

ALTER TABLE `GroupRanks` ADD FOREIGN KEY (`groupId`) REFERENCES `Groups` (`id`);

ALTER TABLE `GroupRanks` ADD FOREIGN KEY (`userId`) REFERENCES `UserProfiles` (`id`);

ALTER TABLE `GroupRanks` ADD FOREIGN KEY (`rankId`) REFERENCES `Ranks` (`id`);

ALTER TABLE `GroupCategories` ADD FOREIGN KEY (`groupId`) REFERENCES `Groups` (`id`);

ALTER TABLE `GroupCategories` ADD FOREIGN KEY (`categoryId`) REFERENCES `Categories` (`id`);

ALTER TABLE `Posts` ADD FOREIGN KEY (`creatorId`) REFERENCES `UserProfiles` (`id`);

ALTER TABLE `Comments` ADD FOREIGN KEY (`postId`) REFERENCES `Posts` (`id`);

ALTER TABLE `Comments` ADD FOREIGN KEY (`userId`) REFERENCES `UserProfiles` (`id`);

ALTER TABLE `PostsCategories` ADD FOREIGN KEY (`postId`) REFERENCES `Posts` (`id`);

ALTER TABLE `PostsCategories` ADD FOREIGN KEY (`categoryId`) REFERENCES `Categories` (`id`);

ALTER TABLE `UsersBio` ADD FOREIGN KEY (`userId`) REFERENCES `UsersData` (`userId`);

ALTER TABLE `UsersData` ADD FOREIGN KEY (`userId`) REFERENCES `UserProfiles` (`id`);
