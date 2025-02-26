-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Gép: localhost:8889
-- Létrehozás ideje: 2024. Dec 28. 18:18
-- Kiszolgáló verziója: 5.7.24
-- PHP verzió: 8.3.11

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
CREATE DEFINER=`root`@`localhost` PROCEDURE `addfollowedCount` (IN `userIdIn` MEDIUMINT)   BEGIN
	UPDATE `usersdata` SET `followedCount` = usersdata.followedCount + 1 WHERE usersdata.userId = userIdIn;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `addFollower` (IN `followerIdIn` MEDIUMINT, IN `followedIdIn` MEDIUMINT)   BEGIN
	INSERT INTO `followedusers`(`followerId`, `followedId`) VALUES (followerIdIn, followedIdIn);
    CALL addFollowerCount(followedIdIn);
    CALL addfollowedCount(followerIdIn);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `addFollowerCount` (IN `userIdIn` MEDIUMINT)   BEGIN
	UPDATE `usersdata` SET `followerCount` = usersdata.followerCount + 1 WHERE usersdata.userId = userIdIn;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `addGroupActualEventCount` (IN `groupIdIn` MEDIUMINT)   BEGIN
UPDATE `groups` SET `actualEventCount` = actualEventCount + 1 WHERE groups.id = groupIdIn;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `addGroupAllEventCount` (IN `groupIdIn` MEDIUMINT)   BEGIN
UPDATE `groups` SET `allEventCount` = allEventCount + 1 WHERE groups.id = groupIdIn;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `addGroupMember` (IN `groupIdIn` MEDIUMINT, IN `userIdIn` MEDIUMINT)   BEGIN
INSERT INTO `membersofgroups`(`groupId`, `userId`) VALUES (groupIdIn, userIdIn);
CALL addGroupMemberCount(groupIdIn);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `addGroupMemberCount` (IN `groupIdIn` MEDIUMINT)   BEGIN
UPDATE `groups` SET `membersCount` = membersCount + 1 WHERE groups.id = groupIdIn;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `addGroupPostCount` (IN `groupIdIn` MEDIUMINT)   BEGIN
UPDATE `groups` SET `postCount` = postCount + 1 WHERE groups.id = groupIdIn;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `addUserbio` (IN `userIdIn` MEDIUMINT, IN `facultyIn` VARCHAR(30))   BEGIN
INSERT INTO `usersbio`(`userId`, `faculty`) VALUES (userIdIn, facultyIn);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `addUserData` (IN `userIdIn` MEDIUMINT, IN `nameIn` VARCHAR(80), IN `genderIn` BOOLEAN, IN `birthDateIn` DATE, IN `universityNameIn` VARCHAR(80), IN `profilePictureExtensionIn` VARCHAR(4))   BEGIN
    INSERT INTO `usersdata`(`userId`, `name`, `gender`, `birthDate`, `universityName`, `profilePictureExtension`) VALUES (userIdIn, nameIn, genderIn, birthDateIn, universityNameIn, profilePictureExtensionIn);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `createCategory` (IN `nameIn` VARCHAR(40))   BEGIN
	INSERT INTO `categories`(`name`) VALUES (nameIn);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `createContactType` (IN `nameIn` VARCHAR(20), IN `domainIn` VARCHAR(64), IN `protocolIn` VARCHAR(5))   BEGIN
	INSERT INTO `contacttypes`(`name`, `domain`, `protocol`) VALUES (nameIn, domainIn, protocolIn);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `createEvent` (IN `nameIn` VARCHAR(30), IN `creatorIdIn` MEDIUMINT, IN `startDateIn` TIMESTAMP, IN `endDateIn` TIMESTAMP, IN `placeIn` VARCHAR(255), IN `attachmentRelPathIn` VARCHAR(50), IN `descriptionIn` VARCHAR(180), IN `groupIdIn` MEDIUMINT)   BEGIN
INSERT INTO `events`(`name`, `creatorId`, `startDate`, `endDate`, `place`, `attachmentRelPath`, `description`) VALUES (`nameIn`, `creatorIdIn`, `startDateIn`, `endDateIn`, `placeIn`, `attachmentRelPathIn`, `descriptionIn`);
SET @eventId = 0;  
CALL idByEventName(nameIn, @eventId);
CALL linkEventToGroup(groupIdIn, @eventId);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `createGroup` (IN `nameIn` VARCHAR(60))   BEGIN
	INSERT INTO `groups`(`name`) VALUES (nameIn);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `createRank` (IN `nameIn` VARCHAR(30), IN `isAdminIn` BOOLEAN, IN `canViewIn` BOOLEAN, IN `canCommentIn` BOOLEAN, IN `canPostIn` BOOLEAN, IN `canModifyIn` BOOLEAN)   BEGIN
	INSERT INTO `ranks`(`name`, `isAdmin`, `canView`, `canComment`, `canPost`, `canModify`) VALUES (nameIn, isAdminIn, canViewIn, canCommentIn, canPostIn, canModifyIn);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `createRole` (IN `nameIn` VARCHAR(20))   BEGIN
	INSERT INTO `roles`(`name`) VALUES (nameIn);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `createUserProfile` (IN `emailIn` VARCHAR(50), IN `usernameIn` VARCHAR(12), IN `passwordIn` VARCHAR(60))   BEGIN
    INSERT INTO `userprofiles`(`email`, `username`, `password`) VALUES (emailIn, usernameIn, passwordIn);  -- @todo: hash passwordIn
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteUserprofile` (IN `usernameIn` VARCHAR(12), IN `passwordIn` VARCHAR(60))   BEGIN
	UPDATE `userprofiles` SET `deletedAt`= NOW() WHERE userprofiles.username = usernameIn AND userprofiles.password = passwordIn;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getCategory` (IN `idIn` SMALLINT)   BEGIN
	SELECT `name` FROM `categories` WHERE `id` = idIn;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getContactType` (IN `idIn` TINYINT)   BEGIN
	SELECT `name`, `domain`, `protocol` FROM `contacttypes` WHERE contacttypes.id = idIn;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getGroup` (IN `idIn` MEDIUMINT)   BEGIN
	SELECT `name`, `public`, `membersCount`, `postCount`, `actualEventCount`, `allEventCount` FROM `groups` WHERE groups.id = idIn;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getRank` (IN `idIn` TINYINT)   BEGIN
	SELECT `name`, `isAdmin`, `canView`, `canComment`, `canPost`, `canModify` FROM `ranks` WHERE ranks.id = idIn;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getRole` (IN `idIn` TINYINT)   BEGIN
	SELECT `name` FROM `roles` WHERE roles.id = idIn;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `idByEventName` (IN `nameIn` VARCHAR(30), OUT `eventIdOut` MEDIUMINT)   BEGIN
SELECT events.id INTO eventIdOut FROM events WHERE events.name = nameIn ORDER BY events.id DESC LIMIT 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `idByUsername` (IN `usernameIn` VARCHAR(12), OUT `userIdOut` MEDIUMINT)   BEGIN
    SELECT userprofiles.id INTO userIdOut FROM userprofiles
    WHERE userprofiles.username = usernameIn LIMIT 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `linkEventToGroup` (IN `groupIdIn` MEDIUMINT, IN `eventIdIn` MEDIUMINT)   BEGIN
INSERT INTO `eventsofgroups`(`groupId`, `eventId`) VALUES (groupIdIn, eventIdIn);
CALL addGroupActualEventCount(groupIdIn);
CALL addGroupAllEventCount(groupIdIn);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `login` (IN `usernameIn` VARCHAR(12))   BEGIN
	SELECT * FROM `userprofiles` WHERE userprofiles.username = usernameIn;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `reduceGroupActualEventCount` (IN `groupIdIn` MEDIUMINT)   BEGIN
UPDATE `groups` SET `actualEventCount` = actualEventCount - 1 WHERE groups.id = groupIdIn;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `reduceGroupAllEventCount` (IN `groupIdIn` MEDIUMINT)   BEGIN
UPDATE `groups` SET `allEventCount` = allEventCount - 1 WHERE groups.id = groupIdIn;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `reduceGroupMemberCount` (IN `groupIdIn` MEDIUMINT)   BEGIN
UPDATE `groups` SET `membersCount` = membersCount - 1 WHERE groups.id = groupIdIn;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `reduceGroupMembers` (IN `groupIdIn` MEDIUMINT, IN `userIdIn` MEDIUMINT)   BEGIN
DELETE FROM `membersofgroups` WHERE membersofgroups.groupId = groupIdIn AND membersofgroups.userId = userIdIn;
CALL reduceGroupMemberCount(groupIdIn);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `reduceGroupPostCount` (IN `groupIdIn` MEDIUMINT)   BEGIN
UPDATE `groups` SET `postCount` = postCount - 1 WHERE groups.id = groupIdIn;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `registerUser` (IN `emailIn` VARCHAR(50), IN `usernameIn` VARCHAR(12), IN `passwordIn` VARCHAR(60), IN `nameIn` VARCHAR(80), IN `genderIn` BOOLEAN, IN `birthDateIn` DATE, IN `facultyIn` VARCHAR(30), IN `universityNameIn` VARCHAR(80), IN `profilePictureExtensionIn` VARCHAR(4))   BEGIN
    CALL createUserProfile(emailIn, usernameIn, passwordIn);
    SET @userId = 0;  
    CALL idByUsername(usernameIn, @userId);
    CALL addUserData(@userId, nameIn, genderIn, birthDateIn, universityNameIn, profilePictureExtensionIn);
    CALL addUserbio(@userId, facultyIn);
END$$

--
-- Függvények
--
CREATE DEFINER=`root`@`localhost` FUNCTION `isDeleted` (`deletedAtIn` TIMESTAMP) RETURNS TINYINT(1) DETERMINISTIC READS SQL DATA BEGIN
	RETURN IF(deletedAtIn IS NOT NULL, 1, 0);
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
-- Tábla szerkezet ehhez a táblához `eventcalendars`
--

CREATE TABLE `eventcalendars` (
  `userId` mediumint(9) NOT NULL,
  `eventId` int(11) NOT NULL
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
  `startDate` timestamp NULL DEFAULT NULL,
  `endDate` timestamp NULL DEFAULT NULL,
  `place` varchar(255) NOT NULL,
  `attachmentRelPath` varchar(50) NOT NULL DEFAULT '',
  `description` varchar(180) NOT NULL DEFAULT '',
  `participantsCount` mediumint(9) DEFAULT '0',
  `interestedUsersCount` mediumint(9) DEFAULT '0',
  `isActual` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- A tábla adatainak kiíratása `events`
--

INSERT INTO `events` (`id`, `name`, `creatorId`, `startDate`, `endDate`, `place`, `attachmentRelPath`, `description`, `participantsCount`, `interestedUsersCount`, `isActual`) VALUES
(5, 'Hackathon 2024', 1, '2024-11-15 08:00:00', '2024-11-15 17:00:00', 'Tech Park Hall A', 'hackathon2024.jpg', 'An intense coding competition for students and professionals.', 0, 0, 1),
(6, 'Pi Day Celebration', 2, '2024-03-14 09:00:00', '2024-03-14 13:00:00', 'Math Department, Room 101', 'piday2024.png', 'Join us for Pi-themed activities and a pie-eating contest!', 0, 0, 1),
(7, 'Eco-Exploration Workshop', 3, '2024-04-22 06:30:00', '2024-04-22 15:00:00', 'University C Botanical Garden', 'ecoexploration.gif', 'Explore the local ecosystem with guided tours and hands-on activities.', 0, 0, 1),
(8, 'Quantum Mechanics Lecture', 4, '2024-05-10 11:00:00', '2024-05-10 13:00:00', 'Physics Building, Room 302', 'quantumlecture.jpeg', 'A special guest lecture on the mysteries of quantum mechanics.', 0, 0, 1),
(9, 'Robotics Showcase', 5, '2024-06-05 08:00:00', '2024-06-05 14:00:00', 'Engineering Lab, Main Hall', 'roboticshowcase.bmp', 'See the latest in student-designed robots and engineering projects.', 0, 0, 1),
(10, 'Hackathon 2024', 1, '2024-11-15 08:00:00', '2024-11-15 17:00:00', 'Tech Park Hall A', 'hackathon2024.jpg', 'An intense coding competition for students and professionals.', 0, 0, 1),
(11, 'Pi Day Celebration', 2, '2024-03-14 09:00:00', '2024-03-14 13:00:00', 'Math Department, Room 101', 'piday2024.png', 'Join us for Pi-themed activities and a pie-eating contest!', 0, 0, 1),
(12, 'Eco-Exploration Workshop', 3, '2024-04-22 06:30:00', '2024-04-22 15:00:00', 'University C Botanical Garden', 'ecoexploration.gif', 'Explore the local ecosystem with guided tours and hands-on activities.', 0, 0, 1),
(13, 'Quantum Mechanics Lecture', 4, '2024-05-10 11:00:00', '2024-05-10 13:00:00', 'Physics Building, Room 302', 'quantumlecture.jpeg', 'A special guest lecture on the mysteries of quantum mechanics.', 0, 0, 1),
(14, 'Robotics Showcase', 5, '2024-06-05 08:00:00', '2024-06-05 14:00:00', 'Engineering Lab, Main Hall', 'roboticshowcase.bmp', 'See the latest in student-designed robots and engineering projects.', 0, 0, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `eventsofgroups`
--

CREATE TABLE `eventsofgroups` (
  `groupId` mediumint(9) NOT NULL,
  `eventId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- A tábla adatainak kiíratása `eventsofgroups`
--

INSERT INTO `eventsofgroups` (`groupId`, `eventId`) VALUES
(1, 5),
(2, 6),
(3, 7),
(4, 8),
(5, 9),
(1, 10),
(2, 11),
(3, 12),
(4, 13),
(5, 14);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `followedgroups`
--

CREATE TABLE `followedgroups` (
  `followerId` mediumint(9) NOT NULL,
  `followedGroupId` mediumint(9) NOT NULL
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
  `allEventCount` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- A tábla adatainak kiíratása `groups`
--

INSERT INTO `groups` (`id`, `name`, `public`, `membersCount`, `postCount`, `actualEventCount`, `allEventCount`) VALUES
(1, 'Code Masters - Computer Science', 1, 0, 0, 2, 2),
(2, 'Number Ninjas - Mathematics', 1, 0, 0, 2, 2),
(3, 'BioWizards - Biology', 1, 0, 0, 2, 2),
(4, 'Quantum Minds - Physics', 1, 0, 0, 2, 2),
(5, 'Engineers United - Engineering', 1, 0, 0, 2, 2);

-- --------------------------------------------------------

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
  `likesCount` mediumint(9) DEFAULT '0',
  `description` text NOT NULL,
  `attachmentsRelPath` json NOT NULL
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
-- Tábla szerkezet ehhez a táblához `postsofgroups`
--

CREATE TABLE `postsofgroups` (
  `groupId` mediumint(9) NOT NULL,
  `postId` int(11) NOT NULL
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
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- A tábla adatainak kiíratása `userprofiles`
--

INSERT INTO `userprofiles` (`id`, `email`, `username`, `password`, `createdAt`, `deletedAt`) VALUES
(1, 'user1@example.com', 'user1', 'password1', '2024-10-29 06:38:21', NULL),
(2, 'user2@example.com', 'user2', 'password2', '2024-10-29 06:38:21', NULL),
(3, 'user3@example.com', 'user3', 'password3', '2024-10-29 06:38:21', NULL),
(4, 'user4@example.com', 'user4', 'password4', '2024-10-29 06:38:21', NULL),
(5, 'user5@example.com', 'user5', 'password5', '2024-10-29 06:38:21', NULL);

-- --------------------------------------------------------

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
-- A tábla adatainak kiíratása `usersbio`
--

INSERT INTO `usersbio` (`userId`, `faculty`, `description`) VALUES
(1, 'Computer Science', ''),
(2, 'Mathematics', ''),
(3, 'Biology', ''),
(4, 'Physics', ''),
(5, 'Engineering', '');

-- --------------------------------------------------------

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
-- A tábla adatainak kiíratása `usersdata`
--

INSERT INTO `usersdata` (`userId`, `name`, `gender`, `birthDate`, `universityName`, `profilePictureExtension`, `followerCount`, `followedCount`) VALUES
(1, 'John Doe', 1, '1990-01-01', 'University A', 'jpg', 0, 0),
(2, 'Jane Smith', 0, '1992-02-02', 'University B', 'png', 0, 0),
(3, 'Alice Johnson', 0, '1995-03-03', 'University C', 'gif', 0, 0),
(4, 'Bob Brown', 1, '1988-04-04', 'University D', 'jpeg', 0, 0),
(5, 'Charlie White', 1, '1991-05-05', 'University E', 'bmp', 0, 0);

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
-- A tábla indexei `eventcalendars`
--
ALTER TABLE `eventcalendars`
  ADD KEY `userId` (`userId`),
  ADD KEY `eventId` (`eventId`);

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
-- A tábla indexei `eventsofgroups`
--
ALTER TABLE `eventsofgroups`
  ADD KEY `groupId` (`groupId`),
  ADD KEY `eventId` (`eventId`);

--
-- A tábla indexei `followedgroups`
--
ALTER TABLE `followedgroups`
  ADD KEY `followerId` (`followerId`),
  ADD KEY `followedGroupId` (`followedGroupId`);

--
-- A tábla indexei `followedusers`
--
ALTER TABLE `followedusers`
  ADD KEY `followerId` (`followerId`),
  ADD KEY `followedId` (`followedId`);

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
  ADD KEY `eventId` (`eventId`),
  ADD KEY `userId` (`userId`);

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
  ADD KEY `eventId` (`eventId`),
  ADD KEY `userId` (`userId`);

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
-- A tábla indexei `postsofgroups`
--
ALTER TABLE `postsofgroups`
  ADD KEY `groupId` (`groupId`),
  ADD KEY `postId` (`postId`);

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
  ADD KEY `userId` (`userId`),
  ADD KEY `categoryId` (`categoryId`);

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
  ADD KEY `userId` (`userId`),
  ADD KEY `roleId` (`roleId`);

--
-- A tábla indexei `usersbio`
--
ALTER TABLE `usersbio`
  ADD PRIMARY KEY (`userId`);

--
-- A tábla indexei `userscontacts`
--
ALTER TABLE `userscontacts`
  ADD KEY `userId` (`userId`),
  ADD KEY `contactTypeId` (`contactTypeId`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT a táblához `groups`
--
ALTER TABLE `groups`
  MODIFY `id` mediumint(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  MODIFY `id` mediumint(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `userprofiles` (`id`);

--
-- Megkötések a táblához `eventcalendars`
--
ALTER TABLE `eventcalendars`
  ADD CONSTRAINT `eventcalendars_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `usersdata` (`userId`),
  ADD CONSTRAINT `eventcalendars_ibfk_2` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`);

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
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`creatorId`) REFERENCES `userprofiles` (`id`);

--
-- Megkötések a táblához `eventsofgroups`
--
ALTER TABLE `eventsofgroups`
  ADD CONSTRAINT `eventsofgroups_ibfk_1` FOREIGN KEY (`groupId`) REFERENCES `groups` (`id`),
  ADD CONSTRAINT `eventsofgroups_ibfk_2` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`);

--
-- Megkötések a táblához `followedgroups`
--
ALTER TABLE `followedgroups`
  ADD CONSTRAINT `followedgroups_ibfk_1` FOREIGN KEY (`followerId`) REFERENCES `userprofiles` (`id`),
  ADD CONSTRAINT `followedgroups_ibfk_2` FOREIGN KEY (`followedGroupId`) REFERENCES `groups` (`id`);

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
-- Megkötések a táblához `postsofgroups`
--
ALTER TABLE `postsofgroups`
  ADD CONSTRAINT `postsofgroups_ibfk_1` FOREIGN KEY (`groupId`) REFERENCES `groups` (`id`),
  ADD CONSTRAINT `postsofgroups_ibfk_2` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`);

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

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
