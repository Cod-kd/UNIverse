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
