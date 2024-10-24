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