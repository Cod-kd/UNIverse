-- Returns 1 if deleted 0 if not
DELIMITER $$
CREATE DEFINER=`root`@`localhost` FUNCTION `isDeleted`(`deletedAtIn` TIMESTAMP) RETURNS tinyint(1)
BEGIN
	RETURN deletedAtIn IS NOT NULL;
END$$
DELIMITER ;