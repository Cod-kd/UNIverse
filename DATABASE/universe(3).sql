-- Gép: localhost:8889

/* Ranks and related are for future implementations. */

SET SQL_MODE = "";
SET GLOBAL log_bin_trust_function_creators = 1;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `universe`
--
DROP DATABASE IF EXISTS `universe`;
CREATE DATABASE IF NOT EXISTS `universe` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
USE `universe`;

DELIMITER $$
--
-- Eljárások
--

CREATE PROCEDURE `addUserContact` (IN contactTypeIdIn TINYINT, IN pathIn VARCHAR(60), IN userIdIn MEDIUMINT)   BEGIN
	INSERT INTO `userscontacts`(`contactTypeId`,`path`,`userId`) VALUES (contactTypeIdIn, pathIn, userIdIn);
END$$

CREATE PROCEDURE `addUserRole` (IN userIdIn MEDIUMINT,IN roleIdIn TINYINT)		BEGIN
    INSERT INTO userroles (userId, roleId) VALUES (userIdIn, roleIdIn);
END $$

CREATE PROCEDURE `addUserInterest` (IN userIdIn MEDIUMINT,IN categoryIdIn SMALLINT)		BEGIN
    INSERT INTO userinterests (userId, categoryId) VALUES (userIdIn, categoryIdIn);
END $$

CREATE PROCEDURE `addfollowedCount` (IN `userIdIn` MEDIUMINT)   BEGIN
	UPDATE `usersdata` SET `followedCount` = usersdata.followedCount + 1 WHERE usersdata.userId = userIdIn;
END$$

CREATE PROCEDURE `followUser` (IN `followerIdIn` MEDIUMINT, IN `followedIdIn` MEDIUMINT)   BEGIN
	INSERT INTO `followedusers`(`followerId`, `followedId`) VALUES (followerIdIn, followedIdIn);
    CALL addFollowerCount(followedIdIn);
    CALL addfollowedCount(followerIdIn);
END$$

CREATE PROCEDURE `addFollowerCount` (IN `userIdIn` MEDIUMINT)   BEGIN
	UPDATE `usersdata` SET `followerCount` = usersdata.followerCount + 1 WHERE usersdata.userId = userIdIn;
END$$

CREATE PROCEDURE `unfollowUser` (IN `followerIdIn` MEDIUMINT, IN `followedIdIn` MEDIUMINT)  
BEGIN
    DELETE FROM `followedusers` 
    WHERE `followerId` = followerIdIn AND `followedId` = followedIdIn;
    CALL reduceFollowerCount(followedIdIn);
    CALL reduceFollowedCount(followerIdIn);
END$$

CREATE PROCEDURE `reduceFollowerCount` (IN `userIdIn` MEDIUMINT)  
BEGIN
    UPDATE `usersdata` 
    SET `followerCount` = GREATEST(0, followerCount - 1) 
    WHERE `userId` = userIdIn;
END$$

CREATE PROCEDURE `reduceFollowedCount` (IN `userIdIn` MEDIUMINT)  
BEGIN
    UPDATE `usersdata` 
    SET `followedCount` = GREATEST(0, followedCount - 1) 
    WHERE `userId` = userIdIn;
END$$

CREATE PROCEDURE `addGroupActualEventCount` (IN `groupIdIn` MEDIUMINT)   BEGIN
UPDATE `groups` SET `actualEventCount` = actualEventCount + 1 WHERE groups.id = groupIdIn;
END$$

CREATE PROCEDURE `addGroupAllEventCount` (IN `groupIdIn` MEDIUMINT)   BEGIN
UPDATE `groups` SET `allEventCount` = allEventCount + 1 WHERE groups.id = groupIdIn;
END$$

CREATE PROCEDURE `addGroupMember` (IN `groupIdIn` MEDIUMINT, IN `userIdIn` MEDIUMINT)   BEGIN
INSERT INTO `membersofgroups`(`groupId`, `userId`) VALUES (groupIdIn, userIdIn);
CALL addGroupMemberCount(groupIdIn);
END$$

CREATE PROCEDURE `addGroupMemberCount` (IN `groupIdIn` MEDIUMINT)   BEGIN
UPDATE `groups` SET `membersCount` = membersCount + 1 WHERE groups.id = groupIdIn;
END$$

CREATE PROCEDURE `reduceGroupMember` (IN `groupIdIn` MEDIUMINT, IN `userIdIn` MEDIUMINT)  
BEGIN
    DELETE FROM `membersofgroups` 
    WHERE `userId` = userIdIn AND `groupId` = groupIdIn;
    CALL reduceGroupMemberCount(groupIdIn);
END$$

CREATE PROCEDURE `reduceGroupMemberCount` (IN `groupIdIn` MEDIUMINT)  
BEGIN
    UPDATE `groups` 
    SET `membersCount` = GREATEST(0, membersCount - 1) 
    WHERE `id` = groupIdIn;
END$$

CREATE PROCEDURE `addGroupPostCount` (IN `groupIdIn` MEDIUMINT)   BEGIN
UPDATE `groups` SET `postCount` = postCount + 1 WHERE groups.id = groupIdIn;
END$$

CREATE PROCEDURE `addUserbio` (IN `userIdIn` MEDIUMINT, IN `facultyIn` VARCHAR(30))   BEGIN
INSERT INTO `usersbio`(`userId`, `faculty`) VALUES (userIdIn, facultyIn);
END$$

CREATE PROCEDURE `addUserData` (IN `userIdIn` MEDIUMINT, IN `nameIn` VARCHAR(80), IN `genderIn` BOOLEAN, IN `birthDateIn` DATE, IN `universityNameIn` VARCHAR(80), IN `profilePictureExtensionIn` VARCHAR(4))   BEGIN
    INSERT INTO `usersdata`(`userId`, `name`, `gender`, `birthDate`, `universityName`, `profilePictureExtension`) VALUES (userIdIn, nameIn, genderIn, birthDateIn, universityNameIn, profilePictureExtensionIn);
END$$

CREATE PROCEDURE `createCategory` (IN `nameIn` VARCHAR(40))   BEGIN
	INSERT INTO `categories`(`name`) VALUES (nameIn);
END$$

CREATE PROCEDURE `createContactType` (IN `nameIn` VARCHAR(20), IN `domainIn` VARCHAR(64), IN `protocolIn` VARCHAR(5))   BEGIN
	INSERT INTO `contacttypes`(`name`, `domain`, `protocol`) VALUES (nameIn, domainIn, protocolIn);
END$$

CREATE PROCEDURE `createEvent` (IN `nameIn` VARCHAR(30), IN `creatorIdIn` MEDIUMINT, IN `startDateIn` TIMESTAMP, IN `endDateIn` TIMESTAMP, IN `placeIn` VARCHAR(255), IN `descriptionIn` VARCHAR(180), IN `groupIdIn` MEDIUMINT)   BEGIN
INSERT INTO `events`(`name`, `creatorId`, `startDate`, `endDate`, `place`, `description`, `groupId`) VALUES (`nameIn`, `creatorIdIn`, `startDateIn`, `endDateIn`, `placeIn`, `descriptionIn`, `groupIdIn`);
CALL addGroupActualEventCount(groupIdIn);
CALL addGroupAllEventCount(groupIdIn);
END$$

CREATE PROCEDURE `createGroup` (IN `nameIn` VARCHAR(60), IN `adminIdIn` MEDIUMINT)	BEGIN
    DECLARE `newGroupId` MEDIUMINT;
    INSERT INTO `groups` (`name`, `adminId`) VALUES (nameIn, adminIdIn);
    SET newGroupId = LAST_INSERT_ID();
    CALL addGroupMember(newGroupId, adminIdIn);
END$$

CREATE PROCEDURE `addGroupCategory` (
    IN `groupIdIn` MEDIUMINT,
    IN `categoryIdIn` SMALLINT
)
BEGIN
    INSERT INTO `groupcategories` (`groupId`, `categoryId`) 
    VALUES (groupIdIn, categoryIdIn);
END$$

CREATE PROCEDURE `createRank` (IN `nameIn` VARCHAR(30), IN `isAdminIn` BOOLEAN, IN `canViewIn` BOOLEAN, IN `canCommentIn` BOOLEAN, IN `canPostIn` BOOLEAN, IN `canModifyIn` BOOLEAN)   BEGIN
	INSERT INTO `ranks`(`name`, `isAdmin`, `canView`, `canComment`, `canPost`, `canModify`) VALUES (nameIn, isAdminIn, canViewIn, canCommentIn, canPostIn, canModifyIn);
END$$

CREATE PROCEDURE `createRole` (IN `nameIn` VARCHAR(20))   BEGIN
	INSERT INTO `roles`(`name`) VALUES (nameIn);
END$$

CREATE PROCEDURE `createUserProfile` (IN `emailIn` VARCHAR(50), IN `usernameIn` VARCHAR(12), IN `passwordIn` VARCHAR(60))   BEGIN
    INSERT INTO `userprofiles`(`email`, `username`, `password`) VALUES (emailIn, usernameIn, passwordIn);
END$$

CREATE PROCEDURE `universe`.`verifyUserByEmail` (
    IN `emailIn` VARCHAR(50),
    OUT `affectedRows` INT
)
BEGIN
    SET SQL_SAFE_UPDATES = 0;
    UPDATE `universe`.`userprofiles` 
    SET `isVerified` = TRUE 
    WHERE `email` = `emailIn` AND `isVerified` = FALSE;
    SET `affectedRows` = ROW_COUNT();
    SET SQL_SAFE_UPDATES = 1;
END$$

CREATE PROCEDURE `deleteUserProfile` (IN `usernameIn` VARCHAR(12))   BEGIN
	SET SQL_SAFE_UPDATES = 0;
	UPDATE `userprofiles` SET `deletedAt`= NOW() WHERE userprofiles.username = usernameIn;
	SET SQL_SAFE_UPDATES = 1;
END$$

CREATE PROCEDURE `getCategory` (IN `idIn` SMALLINT)   BEGIN
	SELECT `name` FROM `categories` WHERE `id` = idIn;
END$$

CREATE PROCEDURE `getContactType` (IN `idIn` TINYINT)   BEGIN
	SELECT `name`, `domain`, `protocol` FROM `contacttypes` WHERE contacttypes.id = idIn;
END$$

CREATE PROCEDURE `getGroup` (IN `idIn` MEDIUMINT)   BEGIN
	SELECT `name`, `public`, `membersCount`, `postCount`, `actualEventCount`, `allEventCount` FROM `groups` WHERE groups.id = idIn;
END$$

CREATE PROCEDURE `getRank` (IN `idIn` TINYINT)   BEGIN
	SELECT `name`, `isAdmin`, `canView`, `canComment`, `canPost`, `canModify` FROM `ranks` WHERE ranks.id = idIn;
END$$

CREATE PROCEDURE `getRole` (IN `idIn` TINYINT)   BEGIN
	SELECT `name` FROM `roles` WHERE roles.id = idIn;
END$$

CREATE PROCEDURE `idByEventName` (IN `nameIn` VARCHAR(30), OUT `eventIdOut` MEDIUMINT)   BEGIN
SELECT events.id INTO eventIdOut FROM events WHERE events.name = nameIn ORDER BY events.id DESC LIMIT 1;
END$$

CREATE PROCEDURE `idByUsername` (IN `usernameIn` VARCHAR(12), OUT `userIdOut` MEDIUMINT)   BEGIN
    SELECT userprofiles.id INTO userIdOut FROM userprofiles
    WHERE userprofiles.username = usernameIn LIMIT 1;
END$$

CREATE PROCEDURE `usernameById` (IN `userIdIn` MEDIUMINT, OUT `usernameOut` VARCHAR(12))   BEGIN
    SELECT userprofiles.username INTO usernameOut FROM userprofiles
    WHERE userprofiles.id = userIdIn LIMIT 1;
END$$

CREATE PROCEDURE `idByGroupName` (IN `groupNameIn` VARCHAR(12), OUT `groupIdOut` MEDIUMINT)   BEGIN
    SELECT `groups`.id INTO groupIdOut FROM `groups`
    WHERE `groups`.`name` = groupNameIn LIMIT 1;
END$$

CREATE PROCEDURE `login` (IN `usernameIn` VARCHAR(12))   BEGIN
	SELECT * FROM `userprofiles` WHERE userprofiles.username = usernameIn;
END$$

CREATE PROCEDURE `reduceGroupActualEventCount` (IN `groupIdIn` MEDIUMINT)   BEGIN
UPDATE `groups` SET `actualEventCount` = actualEventCount - 1 WHERE groups.id = groupIdIn;
END$$

CREATE PROCEDURE `reduceGroupAllEventCount` (IN `groupIdIn` MEDIUMINT)   BEGIN
UPDATE `groups` SET `allEventCount` = allEventCount - 1 WHERE groups.id = groupIdIn;
END$$

CREATE PROCEDURE `reduceGroupPostCount` (IN `groupIdIn` MEDIUMINT)   BEGIN
UPDATE `groups` SET `postCount` = postCount - 1 WHERE groups.id = groupIdIn;
END$$

CREATE PROCEDURE `updateUserDesc` (IN `descriptionIn` VARCHAR(85), IN `userIdIn` MEDIUMINT)   BEGIN
UPDATE `usersbio` SET `description` = descriptionIn WHERE userId = userIdIn;
END$$

CREATE PROCEDURE `registerUser` (IN `emailIn` VARCHAR(50), IN `usernameIn` VARCHAR(12), IN `passwordIn` VARCHAR(60), IN `nameIn` VARCHAR(80), IN `genderIn` BOOLEAN, IN `birthDateIn` DATE, IN `facultyIn` VARCHAR(30), IN `universityNameIn` VARCHAR(80), IN `profilePictureExtensionIn` VARCHAR(4))   BEGIN
    CALL createUserProfile(emailIn, usernameIn, passwordIn);
    SET @userId = 0;  
    CALL idByUsername(usernameIn, @userId);
    CALL addUserData(@userId, nameIn, genderIn, birthDateIn, universityNameIn, profilePictureExtensionIn);
    CALL addUserbio(@userId, facultyIn);
END$$

-- handle interested users
CREATE PROCEDURE `addInterestedUsersCount` (IN eventIdIn INT)  
BEGIN
    UPDATE `events` 
    SET `interestedUsersCount` = GREATEST(0, participantsCount + 1) 
    WHERE `id` = eventIdIn;
END$$

CREATE PROCEDURE `reduceInterestedUsersCount` (IN eventIdIn INT)  
BEGIN
    UPDATE `events` 
    SET `interestedUsersCount` = GREATEST(0, participantsCount - 1) 
    WHERE `id` = eventIdIn;
END$$

CREATE PROCEDURE `addInterestedUser` (IN eventIdIn INT, IN userIdIn MEDIUMINT)  
BEGIN  
    INSERT INTO `interestedusers` (`eventId`, `userId`) VALUES (eventIdIn, userIdIn);
    CALL addInterestedUsersCount(eventIdIn);
END$$

CREATE PROCEDURE `reduceInterestedUser` (IN eventIdIn INT, IN userIdIn MEDIUMINT)  
BEGIN  
    DELETE FROM `interestedusers` WHERE `eventId` = eventIdIn AND `userId` = userIdIn;
    CALL reduceInterestedUsersCount(eventIdIn);
END$$

CREATE PROCEDURE `getInterestingEventsForUser` (IN userIdIn MEDIUMINT)  
BEGIN  
    SELECT eventId FROM `interestedusers` WHERE userId = userIdIn;
END$$

CREATE PROCEDURE `getInterestedUsersForEvent` (IN eventIdIn INT)  
BEGIN  
    SELECT userId FROM `interestedusers` WHERE eventId = eventIdIn;
END$$

-- handle participants
CREATE PROCEDURE `addParticipantsCount` (IN eventIdIn INT)  
BEGIN
    UPDATE `events` 
    SET `participantsCount` = GREATEST(0, participantsCount + 1) 
    WHERE `id` = eventIdIn;
END$$

CREATE PROCEDURE `reduceParticipantsCount` (IN eventIdIn INT)  
BEGIN
    UPDATE `events` 
    SET `participantsCount` = GREATEST(0, participantsCount - 1) 
    WHERE `id` = eventIdIn;
END$$

CREATE PROCEDURE `addParticipant` (IN eventIdIn INT, IN userIdIn MEDIUMINT)  
BEGIN  
    INSERT INTO `participants` (`eventId`, `userId`) VALUES (eventIdIn, userIdIn);
    CALL addParticipantsCount(eventIdIn);
END$$

CREATE PROCEDURE `reduceParticipant` (IN eventIdIn INT, IN userIdIn MEDIUMINT)  
BEGIN  
    DELETE FROM `participants` WHERE `eventId` = eventIdIn AND `userId` = userIdIn;
    CALL reduceParticipantsCount(eventIdIn);
END$$

CREATE PROCEDURE `getScheduledEventsForUser` (IN userIdIn MEDIUMINT)  
BEGIN  
    SELECT eventId FROM `participants` WHERE userId = userIdIn;
END$$

CREATE PROCEDURE `getUsersScheduleForEvent` (IN eventIdIn INT)  
BEGIN  
    SELECT userId FROM `participants` WHERE eventId = eventIdIn;
END$$

CREATE PROCEDURE createPost(
    IN creatorIdIn INT,
    IN groupIdIn INT,
    IN descriptionIn TEXT,
    OUT newPostId INT
)
BEGIN
    INSERT INTO posts (creatorId, groupId, creditCount, description)
    VALUES (creatorIdIn, groupIdIn, 0, descriptionIn);
    
    SET newPostId = LAST_INSERT_ID();
END$$

CREATE PROCEDURE `addComment` (
    IN `postIdIn` INT,
    IN `userIdIn` MEDIUMINT,
    IN `commentIn` TINYTEXT
)
BEGIN
    INSERT INTO `comments` (`postId`, `userId`, `comment`)
    VALUES (postIdIn, userIdIn, commentIn);
END$$

--
-- Függvények
--
CREATE FUNCTION `isDeleted` (`deletedAtIn` TIMESTAMP) RETURNS TINYINT(1) DETERMINISTIC READS SQL DATA BEGIN
	RETURN IF(deletedAtIn IS NOT NULL, 1, 0);
END$$

CREATE FUNCTION `checkUserFollowed`(`follower` INT, `followed` INT) RETURNS BOOLEAN
    DETERMINISTIC
BEGIN
    DECLARE userRelation BOOLEAN;
    
    SELECT COUNT(*) > 0 INTO userRelation 
    FROM followedusers 
    WHERE (followerId = follower AND followedId = followed);
    RETURN userRelation;
END$$

CREATE FUNCTION `checkGroupMember`(groupIdIn INT, memberIdIn INT) RETURNS BOOLEAN
    DETERMINISTIC
BEGIN
    DECLARE isMember BOOLEAN;

    SELECT COUNT(*) > 0 INTO isMember 
    FROM membersofgroups 
    WHERE userId = memberIdIn AND groupId = groupIdIn;

    RETURN isMember;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `categories`
--

CREATE TABLE `categories` (
  `id` smallint(6) NOT NULL,
  `name` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `postId` int(11) NOT NULL,
  `userId` mediumint(9) NOT NULL,
  `comment` tinytext NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `contacttypes`
--

CREATE TABLE `contacttypes` (
  `id` tinyint(4) NOT NULL,
  `name` varchar(20) NOT NULL,
  `domain` varchar(64) NOT NULL,
  `protocol` varchar(5) NOT NULL DEFAULT 'https'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `eventcategories`
--

CREATE TABLE `eventcategories` (
  `eventId` int(11) NOT NULL,
  `categoryId` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `creatorId` mediumint(9) NOT NULL,
  `groupId` mediumint(9) NOT NULL,
  `startDate` timestamp NULL DEFAULT NULL,
  `endDate` timestamp NULL DEFAULT NULL,
  `place` varchar(255) NOT NULL,
  `description` varchar(180) NOT NULL DEFAULT '',
  `participantsCount` mediumint(9) DEFAULT '0',
  `interestedUsersCount` mediumint(9) DEFAULT '0',
  `isActual` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `followedusers`
--

CREATE TABLE `followedusers` (
  `followerId` mediumint(9) NOT NULL,
  `followedId` mediumint(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `groupcategories`
--

CREATE TABLE `groupcategories` (
  `groupId` mediumint(9) NOT NULL,
  `categoryId` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `groupranks`
--

CREATE TABLE `groupranks` (
  `groupId` mediumint(9) NOT NULL,
  `userId` mediumint(9) NOT NULL,
  `rankId` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `groups`
--

CREATE TABLE `groups` (
  `id` mediumint(9) NOT NULL,
  `name` varchar(60) NOT NULL,
  `public` tinyint(1) DEFAULT '1',
  `membersCount` mediumint(9) DEFAULT '0',
  `postCount` int(11) DEFAULT '0',
  `actualEventCount` int(11) DEFAULT '0',
  `allEventCount` int(11) DEFAULT '0',
  `adminId` mediumint(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Tábla szerkezet ehhez a táblához `interestedusers`
--

CREATE TABLE `interestedusers` (
  `eventId` int(11) NOT NULL,
  `userId` mediumint(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `membersofgroups`
--

CREATE TABLE `membersofgroups` (
  `groupId` mediumint(9) NOT NULL,
  `userId` mediumint(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `participants`
--

CREATE TABLE `participants` (
  `eventId` int(11) NOT NULL,
  `userId` mediumint(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `creatorId` mediumint(9) NOT NULL,
  `groupId` mediumint(9) NOT NULL,
  `creditCount` mediumint(9) DEFAULT '0',
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `postscategories`
--

CREATE TABLE `postscategories` (
  `postId` int(11) NOT NULL,
  `categoryId` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ranks`
--

CREATE TABLE `ranks` (
  `id` tinyint(4) NOT NULL,
  `name` varchar(30) NOT NULL,
  `isAdmin` tinyint(1) DEFAULT '0',
  `canView` tinyint(1) DEFAULT '1',
  `canComment` tinyint(1) DEFAULT '1',
  `canPost` tinyint(1) DEFAULT '1',
  `canModify` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `roles`
--

CREATE TABLE `roles` (
  `id` tinyint(4) NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `userinterests`
--

CREATE TABLE `userinterests` (
  `userId` mediumint(9) NOT NULL,
  `categoryId` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `userprofiles`
--

CREATE TABLE `userprofiles` (
  `id` mediumint(9) NOT NULL,
  `email` varchar(50) NOT NULL,
  `username` varchar(12) NOT NULL,
  `password` varchar(60) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  `isVerified` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Tábla szerkezet ehhez a táblához `userroles`
--

CREATE TABLE `userroles` (
  `userId` mediumint(9) NOT NULL,
  `roleId` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `usersbio`
--

CREATE TABLE `usersbio` (
  `userId` mediumint(9) NOT NULL,
  `faculty` varchar(30) NOT NULL,
  `description` varchar(85) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Tábla szerkezet ehhez a táblához `userscontacts`
--

CREATE TABLE `userscontacts` (
  `userId` mediumint(9) NOT NULL,
  `contactTypeId` tinyint(4) NOT NULL,
  `path` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `usersdata`
--

CREATE TABLE `usersdata` (
  `userId` mediumint(9) NOT NULL,
  `name` varchar(80) NOT NULL,
  `gender` tinyint(1) DEFAULT '-1',
  `birthDate` date NOT NULL,
  `universityName` varchar(80) NOT NULL,
  `profilePictureExtension` varchar(4) NOT NULL,
  `followerCount` mediumint(9) NOT NULL DEFAULT '0',
  `followedCount` mediumint(9) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- A tábla indexei `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `postId` (`postId`),
  ADD KEY `userId` (`userId`);

--
-- A tábla indexei `contacttypes`
--
ALTER TABLE `contacttypes`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `eventcategories`
--
ALTER TABLE `eventcategories`
  ADD KEY `eventId` (`eventId`),
  ADD KEY `categoryId` (`categoryId`);

--
-- A tábla indexei `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creatorId` (`creatorId`);

--
-- A tábla indexei `membersofgroups`
--
ALTER TABLE membersofgroups ADD PRIMARY KEY (groupId, userId);

--
-- A tábla indexei `followedusers`
--
ALTER TABLE followedusers 
ADD PRIMARY KEY (followerId, followedId), 
ADD CONSTRAINT check_no_self_follow CHECK (followerId <> followedId);

--
-- A tábla indexei `groupcategories`
--
ALTER TABLE `groupcategories`
  ADD KEY `groupId` (`groupId`),
  ADD KEY `categoryId` (`categoryId`);

--
-- A tábla indexei `groupranks`
--
ALTER TABLE `groupranks`
  ADD KEY `groupId` (`groupId`),
  ADD KEY `userId` (`userId`),
  ADD KEY `rankId` (`rankId`);

--
-- A tábla indexei `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `interestedusers`
--
ALTER TABLE `interestedusers`
  ADD PRIMARY KEY (`eventId`, `userId`);

--
-- A tábla indexei `membersofgroups`
--
ALTER TABLE `membersofgroups`
  ADD KEY `groupId` (`groupId`),
  ADD KEY `userId` (`userId`);

--
-- A tábla indexei `participants`
--
ALTER TABLE `participants`
  ADD PRIMARY KEY (`eventId`, `userId`);

--
-- A tábla indexei `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creatorId` (`creatorId`);

--
-- A tábla indexei `postscategories`
--
ALTER TABLE `postscategories`
  ADD KEY `postId` (`postId`),
  ADD KEY `categoryId` (`categoryId`);
  
--
-- A tábla indexei `ranks`
--
ALTER TABLE `ranks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- A tábla indexei `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- A tábla indexei `userinterests`
--
ALTER TABLE `userinterests`
  ADD PRIMARY KEY (`userId`, `categoryId`);

--
-- A tábla indexei `userprofiles`
--
ALTER TABLE `userprofiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- A tábla indexei `userroles`
--
ALTER TABLE `userroles`
  ADD PRIMARY KEY (`userId`, `roleId`);

--
-- A tábla indexei `usersbio`
--
ALTER TABLE `usersbio`
  ADD PRIMARY KEY (`userId`);

--
-- A tábla indexei `userscontacts`
--
ALTER TABLE `userscontacts`
  ADD PRIMARY KEY (`userId`, `contactTypeId`, `path`);

--
-- A tábla indexei `usersdata`
--
ALTER TABLE `usersdata`
  ADD PRIMARY KEY (`userId`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `categories`
--
ALTER TABLE `categories`
  MODIFY `id` smallint(6) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `contacttypes`
--
ALTER TABLE `contacttypes`
  MODIFY `id` tinyint(4) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `groups`
--
ALTER TABLE `groups`
  MODIFY `id` mediumint(9) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `ranks`
--
ALTER TABLE `ranks`
  MODIFY `id` tinyint(4) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `roles`
--
ALTER TABLE `roles`
  MODIFY `id` tinyint(4) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `userprofiles`
--
ALTER TABLE `userprofiles`
  MODIFY `id` mediumint(9) NOT NULL AUTO_INCREMENT;

--
-- Megkötések
--

--
-- Megkötések a táblához `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `userprofiles` (`id`);

--
-- Megkötések a táblához `eventcategories`
--
ALTER TABLE `eventcategories`
  ADD CONSTRAINT `eventcategories_ibfk_1` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`),
  ADD CONSTRAINT `eventcategories_ibfk_2` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`);

--
-- Megkötések a táblához `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`groupId`) REFERENCES `groups` (`id`),
  ADD CONSTRAINT `events_ibfk_2` FOREIGN KEY (`creatorId`) REFERENCES `userprofiles` (`id`);

--
-- Megkötések a táblához `followedusers`
--
ALTER TABLE `followedusers`
  ADD CONSTRAINT `followedusers_ibfk_1` FOREIGN KEY (`followerId`) REFERENCES `userprofiles` (`id`),
  ADD CONSTRAINT `followedusers_ibfk_2` FOREIGN KEY (`followedId`) REFERENCES `userprofiles` (`id`);

--
-- Megkötések a táblához `groupcategories`
--
ALTER TABLE `groupcategories`
  ADD CONSTRAINT `groupcategories_ibfk_1` FOREIGN KEY (`groupId`) REFERENCES `groups` (`id`),
  ADD CONSTRAINT `groupcategories_ibfk_2` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`);

--
-- Megkötések a táblához `groupranks`
--
ALTER TABLE `groupranks`
  ADD CONSTRAINT `groupranks_ibfk_1` FOREIGN KEY (`groupId`) REFERENCES `groups` (`id`),
  ADD CONSTRAINT `groupranks_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `userprofiles` (`id`),
  ADD CONSTRAINT `groupranks_ibfk_3` FOREIGN KEY (`rankId`) REFERENCES `ranks` (`id`);


ALTER TABLE `groups`
	ADD CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`adminId`) REFERENCES `usersdata` (`userId`);
--
-- Megkötések a táblához `interestedusers`
--
ALTER TABLE `interestedusers`
  ADD CONSTRAINT `interestedusers_ibfk_1` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`),
  ADD CONSTRAINT `interestedusers_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `usersdata` (`userId`);

--
-- Megkötések a táblához `membersofgroups`
--
ALTER TABLE `membersofgroups`
  ADD CONSTRAINT `membersofgroups_ibfk_1` FOREIGN KEY (`groupId`) REFERENCES `groups` (`id`),
  ADD CONSTRAINT `membersofgroups_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `userprofiles` (`id`);

--
-- Megkötések a táblához `participants`
--
ALTER TABLE `participants`
  ADD CONSTRAINT `participants_ibfk_1` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`),
  ADD CONSTRAINT `participants_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `usersdata` (`userId`);

--
-- Megkötések a táblához `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`creatorId`) REFERENCES `userprofiles` (`id`);

--
-- Megkötések a táblához `postscategories`
--
ALTER TABLE `postscategories`
  ADD CONSTRAINT `postscategories_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`),
  ADD CONSTRAINT `postscategories_ibfk_2` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`);

--
-- Megkötések a táblához `userinterests`
--
ALTER TABLE `userinterests`
  ADD CONSTRAINT `userinterests_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `usersbio` (`userId`),
  ADD CONSTRAINT `userinterests_ibfk_2` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`);

--
-- Megkötések a táblához `userroles`
--
ALTER TABLE `userroles`
  ADD CONSTRAINT `userroles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `usersbio` (`userId`),
  ADD CONSTRAINT `userroles_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`);

--
-- Megkötések a táblához `usersbio`
--
ALTER TABLE `usersbio`
  ADD CONSTRAINT `usersbio_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `usersdata` (`userId`);

--
-- Megkötések a táblához `userscontacts`
--
ALTER TABLE `userscontacts`
  ADD CONSTRAINT `userscontacts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `usersbio` (`userId`),
  ADD CONSTRAINT `userscontacts_ibfk_2` FOREIGN KEY (`contactTypeId`) REFERENCES `contacttypes` (`id`);

--
-- Megkötések a táblához `usersdata`
--
ALTER TABLE `usersdata`
  ADD CONSTRAINT `usersdata_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `userprofiles` (`id`);

COMMIT;

-- FACTORY
-- kategóriák generálása
CALL createCategory('Programozás');
CALL createCategory('Matematika');
CALL createCategory('Biológia');
CALL createCategory('Fizika');
CALL createCategory('Műszaki');

-- beállítható elérhetőségek típusának generálása
CALL createContactType('Facebook', 'www.facebook.com', 'https'); -- +/username
CALL createContactType('YouTube', 'www.youtube.com', 'https'); -- +/@username
CALL createContactType('LinkedIn', 'www.linkedin.com/in', 'https'); -- +/username
CALL createContactType('GitHub', 'www.github.com', 'https'); -- +/username
CALL createContactType('Tiktok', 'www.tiktok.com', 'https');  -- +/@username

-- role-ok generálása
CALL createRole('hallgató');
CALL createRole('professzor');
CALL createRole('korepetítor');
CALL createRole('adminisztrátor');
CALL createRole('kutató');
CALL createRole('magántanár');


-- Generate 5 User entities
-- password: Password123
CALL registerUser('user1@example.com', 'tuser1', '$2y$12$x9Qx33ZDWV3p.eyLSR7zXuUTyUah7/RLlq2apJTQpSEyOn7NXdQz6', 'John Doe', TRUE, '1990-01-01', 'Computer Science', 'University A', 'jpg');
CALL registerUser('user2@example.com', 'tuser2', '$2y$12$x9Qx33ZDWV3p.eyLSR7zXuUTyUah7/RLlq2apJTQpSEyOn7NXdQz6', 'Jane Smith', FALSE, '1992-02-02', 'Mathematics', 'University B', 'png');
CALL registerUser('user3@example.com', 'tuser3', '$2y$12$x9Qx33ZDWV3p.eyLSR7zXuUTyUah7/RLlq2apJTQpSEyOn7NXdQz6', 'Alice Johnson', FALSE, '1995-03-03', 'Biology', 'University C', 'gif');
CALL registerUser('user4@example.com', 'tuser4', '$2y$12$x9Qx33ZDWV3p.eyLSR7zXuUTyUah7/RLlq2apJTQpSEyOn7NXdQz6', 'Bob Brown', TRUE, '1988-04-04', 'Physics', 'University D', 'jpeg');
CALL registerUser('user5@example.com', 'tuser5', '$2y$12$x9Qx33ZDWV3p.eyLSR7zXuUTyUah7/RLlq2apJTQpSEyOn7NXdQz6', 'Charlie White', TRUE, '1991-05-05', 'Engineering', 'University E', 'bmp');

-- verify them
SET @affected = 0;
call universe.verifyUserByEmail('user1@example.com', @affected);
call universe.verifyUserByEmail('user2@example.com', @affected);
call universe.verifyUserByEmail('user3@example.com', @affected);
call universe.verifyUserByEmail('user4@example.com', @affected);
call universe.verifyUserByEmail('user5@example.com', @affected);
SET @affected = 0;

-- usercontact generálása
CALL addUserContact(1, 'johndoe', 1);
CALL addUserContact(2, 'johndoe', 1);

-- userrole generálása
CALL addUserRole(1, 1);
CALL addUserRole(1, 3);

-- userinterest generálása
CALL addUserInterest(1, 1);
CALL addUserInterest(1, 2);

-- Generate 5 Group entities
CALL createGroup('CodeMasters', 1);
CALL createGroup('NumberNinjas', 2);
CALL createGroup('BioWizards', 3);
CALL createGroup('QuantumMinds', 4);
CALL createGroup('EngineersUnited', 5);

CALL addGroupCategory(1, 1);
CALL addGroupCategory(1, 2);  
CALL addGroupCategory(3, 3);  
CALL addGroupCategory(4, 4);  
CALL addGroupCategory(5, 5);  

-- events
-- Esemény a Computer Science csoporthoz
CALL createEvent(
    'Hackathon 2024', 
    1, 
    '2024-11-15 09:00:00', 
    '2024-11-15 18:00:00', 
    'Tech Park Hall A', 
    'An intense coding competition for students and professionals.', 
    1
);

-- Esemény a Mathematics csoporthoz
CALL createEvent(
    'Pi Day Celebration', 
    2, 
    '2024-03-14 10:00:00', 
    '2024-03-14 14:00:00', 
    'Math Department, Room 101', 
    'Join us for Pi-themed activities and a pie-eating contest!', 
    2
);

-- Esemény a Biology csoporthoz
CALL createEvent(
    'Eco-Exploration Workshop', 
    3, 
    '2024-04-22 08:30:00', 
    '2024-04-22 17:00:00', 
    'University C Botanical Garden', 
    'Explore the local ecosystem with guided tours and hands-on activities.', 
    3
);

-- Esemény a Physics csoporthoz
CALL createEvent(
    'Quantum Mechanics Lecture', 
    4, 
    '2024-05-10 13:00:00', 
    '2024-05-10 15:00:00', 
    'Physics Building, Room 302', 
    'A special guest lecture on the mysteries of quantum mechanics.', 
    4
);

-- Esemény az Engineering csoporthoz
CALL createEvent(
    'Robotics Showcase', 
    5, 
    '2024-06-05 10:00:00', 
    '2024-06-05 16:00:00', 
    'Engineering Lab, Main Hall', 
    'See the latest in student-designed robots and engineering projects.', 
    5
);

-- Create posts
SET @postId = 0;
CALL createPost(1, 1, 'Ez egy új bejegyzés.', @postId);
CALL createPost(1, 1, 'Nagyon jó napom volt ma!', @postId);
CALL createPost(2, 2, 'Szeretem ezt a csoportot.', @postId);
CALL createPost(3, 3, 'Mit gondoltok erről a témáról?', @postId);
CALL createPost(4, 4, 'Csak egy gyors frissítés.', @postId);

-- Add comments
CALL addComment(1, 2, 'Nagyon jó bejegyzés!');
CALL addComment(1, 3, 'Egyetértek, ez tényleg érdekes.');
CALL addComment(2, 4, 'Köszönöm, hogy megosztottad!');
CALL addComment(3, 1, 'Mit gondoltok erről a témáról?');
CALL addComment(4, 5, 'Nagyon inspiráló gondolatok.');



/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;