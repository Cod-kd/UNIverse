-- Create new category
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `createCategory`(IN `nameIn` VARCHAR(40))
BEGIN
	INSERT INTO `categories`(`name`) VALUES (nameIn);
END$$
DELIMITER ;

-- Get category by id
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getCategory`(IN `idIn` SMALLINT)
BEGIN
	SELECT `name` FROM `categories` WHERE `id` = idIn;
END$$
DELIMITER ;

-- Create new contact
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `createContactType`(IN `nameIn` VARCHAR(20), IN `domainIn` VARCHAR(64), IN `protocolIn` VARCHAR(5))
BEGIN
	INSERT INTO `contacttypes`(`name`, `domain`, `protocol`) VALUES (nameIn, domainIn, protocolIn);
END$$
DELIMITER ;

-- Get contact by id
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getContactType`(IN `idIn` TINYINT)
BEGIN
	SELECT `name`, `domain`, `protocol` FROM `contacttypes` WHERE contacttypes.id = idIn;
END$$
DELIMITER ;

-- Create new rank
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `createRank`(IN `nameIn` VARCHAR(30), IN `isAdminIn` BOOLEAN, IN `canViewIn` BOOLEAN, IN `canCommentIn` BOOLEAN, IN `canPostIn` BOOLEAN, IN `canModifyIn` BOOLEAN)
BEGIN
	INSERT INTO `ranks`(`name`, `isAdmin`, `canView`, `canComment`, `canPost`, `canModify`) VALUES (nameIn, isAdminIn, canViewIn, canCommentIn, canPostIn, canModifyIn);
END$$
DELIMITER ;

-- Get rank by id
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getRank`(IN `idIn` TINYINT)
BEGIN
	SELECT `name`, `isAdmin`, `canView`, `canComment`, `canPost`, `canModify` FROM `ranks` WHERE ranks.id = idIn;
END$$
DELIMITER ;
