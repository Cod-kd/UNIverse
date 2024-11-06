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
CREATE DEFINER=`root`@`localhost` PROCEDURE `reduceGroupMembers`(IN `groupIdIn` MEDIUMINT, IN `userIdIn` MEDIUMINT)
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

/*@todo:
addParticipant
addInterested
removeParticipant
removeInterested
setEventToNonActual
*/

-- @todo: DELETE event

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
