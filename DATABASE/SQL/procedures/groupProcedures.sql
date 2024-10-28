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


-- @todo: test this:
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `addGroupPostCount`(IN `groupIdIn` MEDIUMINT)
BEGIN
UPDATE `groups` SET `postCount` = postCount + 1 WHERE groups.id = groupIdIn;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `addGroupMemberCount`(IN `groupIdIn` MEDIUMINT)
BEGIN
UPDATE `groups` SET `membersCount` = membersCount + 1 WHERE groups.id = groupIdIn;
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `reduceGroupMemberCount`(IN `groupIdIn` MEDIUMINT)
BEGIN
UPDATE `groups` SET `membersCount` = membersCount - 1 WHERE groups.id = groupIdIn;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `reduceGroupPostCount`(IN `groupIdIn` MEDIUMINT)
BEGIN
UPDATE `groups` SET `postCount` = postCount - 1 WHERE groups.id = groupIdIn;
END$$
DELIMITER ;
