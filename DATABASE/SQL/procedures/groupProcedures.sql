-- Create new group
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `createGroup`(IN `nameIn` VARCHAR(60))
BEGIN
	INSERT INTO `groups`(`name`) VALUES (nameIn);
END$$
DELIMITER ;

-- Get group by id
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getGroup`(IN `idIn` MEDIUMINT)
BEGIN
	SELECT `name`, `public`, `membersCount`, `postCount`, `actualEventCount`, `allEventCount` FROM `groups` WHERE groups.id = idIn;
END$$
DELIMITER ;

-- Update group description
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `updateGroupDescription`(IN `idIn` MEDIUMINT, IN `descriptionIn` VARCHAR(120))
BEGIN
UPDATE `groups` SET `description` = descriptionIn WHERE groups.id = idIn;
END$$
DELIMITER ;

-- Add category to group
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `addGroupCategory`(IN `groupIdIn` MEDIUMINT, IN `categoryIdIn` SMALLINT)
BEGIN
INSERT INTO `groupcategories`(`groupId`, `categoryId`) VALUES (groupIdIn, categoryIdIn);
END$$
DELIMITER ;

-- Handle members
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `addGroupMember`(IN `groupIdIn` MEDIUMINT, IN `userIdIn` MEDIUMINT)
BEGIN
INSERT INTO `membersofgroups`(`groupId`, `userId`) VALUES (groupIdIn, userIdIn);
CALL addGroupMemberCount(groupIdIn);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `reduceGroupMemberCount`(IN `groupIdIn` MEDIUMINT)
BEGIN
UPDATE `groups` SET `membersCount` = membersCount - 1 WHERE groups.id = groupIdIn;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `reduceGroupMember`(IN `groupIdIn` MEDIUMINT, IN `userIdIn` MEDIUMINT)
BEGIN
DELETE FROM `membersofgroups` WHERE membersofgroups.groupId = groupIdIn AND membersofgroups.userId = userIdIn;
CALL reduceGroupMemberCount(groupIdIn);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `addGroupMemberCount`(IN `groupIdIn` MEDIUMINT)
BEGIN
UPDATE `groups` SET `membersCount` = membersCount + 1 WHERE groups.id = groupIdIn;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `addGroupRank`(IN `groupIdIn` MEDIUMINT, IN `userIdIn` MEDIUMINT, IN `rankIdIn` TINYINT)
BEGIN
INSERT INTO `groupranks`(`groupId`, `userId`, `rankId`) VALUES (groupIdIn, userIdIn, rankIdIn);
END$$
DELIMITER ;

-- Handle events
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `addGroupActualEventCount`(IN `groupIdIn` MEDIUMINT)
BEGIN
UPDATE `groups` SET `actualEventCount` = actualEventCount + 1 WHERE groups.id = groupIdIn;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `addGroupAllEventCount`(IN `groupIdIn` MEDIUMINT)
BEGIN
UPDATE `groups` SET `allEventCount` = allEventCount + 1 WHERE groups.id = groupIdIn;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `reduceGroupActualEventCount`(IN `groupIdIn` MEDIUMINT)
BEGIN
UPDATE `groups` SET `actualEventCount` = actualEventCount - 1 WHERE groups.id = groupIdIn;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `reduceGroupAllEventCount`(IN `groupIdIn` MEDIUMINT)
BEGIN
UPDATE `groups` SET `allEventCount` = allEventCount - 1 WHERE groups.id = groupIdIn;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `createEvent`(IN `nameIn` VARCHAR(30), IN `creatorIdIn` MEDIUMINT, IN `startDateIn` TIMESTAMP, IN `endDateIn` TIMESTAMP, IN `placeIn` VARCHAR(255), IN `attachmentRelPathIn` VARCHAR(50), IN `descriptionIn` VARCHAR(180), IN `groupIdIn` MEDIUMINT)
BEGIN
INSERT INTO `events`(`name`, `creatorId`, `startDate`, `endDate`, `place`, `attachmentRelPath`, `description`) VALUES (`nameIn`, `creatorIdIn`, `startDateIn`, `endDateIn`, `placeIn`, `attachmentRelPathIn`, `descriptionIn`);
SET @eventId = 0;  
CALL idByEventName(nameIn, @eventId);
CALL linkEventToGroup(groupIdIn, @eventId);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `idByEventName`(IN `nameIn` VARCHAR(30), OUT `eventIdOut` MEDIUMINT)
BEGIN
SELECT events.id INTO eventIdOut FROM events WHERE events.name = nameIn ORDER BY events.id DESC LIMIT 1;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `linkEventToGroup`(IN `groupIdIn` MEDIUMINT, IN `eventIdIn` MEDIUMINT)
BEGIN
INSERT INTO `eventsofgroups`(`groupId`, `eventId`) VALUES (groupIdIn, eventIdIn);
CALL addGroupActualEventCount(groupIdIn);
CALL addGroupAllEventCount(groupIdIn);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `addInterestedUsersCount`(IN `eventIdIn` INT)
BEGIN
UPDATE `events` SET `interestedUsersCount`= events.interestedUsersCount + 1 WHERE events.id = eventIdIn;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `addParticipantsCount`(IN `eventIdIn` INT)
BEGIN
UPDATE `events` SET `participantsCount`= events.participantsCount + 1 WHERE events.id = eventIdIn;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `reduceInterestedUsersCount`(IN `eventIdIn` INT)
BEGIN
UPDATE `events` SET `interestedUsersCount`= events.interestedUsersCount - 1 WHERE events.id = eventIdIn;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `reduceParticipantsCount`(IN `eventIdIn` INT)
BEGIN
UPDATE `events` SET `participantsCount`= events.participantsCount - 1 WHERE events.id = eventIdIn;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `addParticipant`(IN `eventIdIn` INT, IN `userIdIn` MEDIUMINT)
BEGIN
INSERT INTO `participants`(`eventId`, `userId`) VALUES (eventIdIn, userIdIn);
CALL addParticipantsCount(eventIdIn);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `removeParticipant`(IN `eventIdIn` INT, IN `userIdIn` INT)
BEGIN
DELETE FROM `participants` WHERE participants.eventId = eventIdIn AND participants.userId = userIdIn LIMIT 1;
CALL reduceParticipantsCount(eventIdIn);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `removeInterestedUser`(IN `eventIdIn` INT, IN `userIdIn` INT)
BEGIN
DELETE FROM `interestedusers` WHERE interestedusers.eventId = eventIdIn AND interestedusers.userId = userIdIn LIMIT 1;
CALL reduceInterestedUsersCount(eventIdIn);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `addInterestedUser`(IN `eventIdIn` INT, IN `userIdIn` MEDIUMINT)
BEGIN
INSERT INTO `interestedusers`(`eventId`, `userId`) VALUES (eventIdIn, userIdIn);
CALL addInterestedUsersCount(eventIdIn);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `setEventToNonActual`(IN `eventIdIn` INT)
BEGIN
UPDATE `events` SET `isActual`= 0 WHERE events.id = eventIdIn;
END$$
DELIMITER ;

/*@todoptional:
addEventCategory
DELETE event
*/

-- Handle posts
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `addGroupPostCount`(IN `groupIdIn` MEDIUMINT)
BEGIN
UPDATE `groups` SET `postCount` = postCount + 1 WHERE groups.id = groupIdIn;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `reduceGroupPostCount`(IN `groupIdIn` MEDIUMINT)
BEGIN
UPDATE `groups` SET `postCount` = postCount - 1 WHERE groups.id = groupIdIn;
END$$
DELIMITER ;

/*
@todo:
createPost
linkPostToGroup
likePost - create junction likedPost & user
addPostCategory
commentToPost
*/