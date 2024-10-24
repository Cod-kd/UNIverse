-- Create new userprofile
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `createUserProfile`(IN `emailIn` VARCHAR(50), IN `usernameIn` VARCHAR(12), IN `passwordIn` VARCHAR(60))
BEGIN
    INSERT INTO `userprofiles`(`email`, `username`, `password`) VALUES (emailIn, usernameIn, passwordIn);  /*@todo: hash passwordIn*/
END$$
DELIMITER ;

-- Add datas to user who exists
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `addUserData`(IN `userIdIn` MEDIUMINT, IN `nameIn` VARCHAR(80), IN `genderIn` BOOLEAN, IN `birthDateIn` DATE, IN `universityNameIn` VARCHAR(80), IN `profilePictureExtensionIn` VARCHAR(4))
BEGIN
    INSERT INTO `usersdata`(`userId`, `name`, `gender`, `birthDate`, `universityName`, `profilePictureExtension`) VALUES (userIdIn, nameIn, genderIn, birthDateIn, universityNameIn, profilePictureExtensionIn);
END$$
DELIMITER ;

-- Get id by username
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `idByUsername`(IN `usernameIn` VARCHAR(12), OUT `userIdOut` MEDIUMINT)
BEGIN
    SELECT userprofiles.id INTO userIdOut FROM userprofiles
    WHERE userprofiles.username = usernameIn LIMIT 1;
END$$
DELIMITER ;

-- Add bio to User
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `addUserbio`(IN `userIdIn` MEDIUMINT, IN `facultyIn` VARCHAR(30))
BEGIN
INSERT INTO `usersbio`(`userId`, `faculty`) VALUES (userIdIn, facultyIn);
END$$
DELIMITER ;

-- Registration
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `registerUser`(IN `emailIn` VARCHAR(50), IN `usernameIn` VARCHAR(12), IN `passwordIn` VARCHAR(60), IN `nameIn` VARCHAR(80), IN `genderIn` BOOLEAN, IN `birthDateIn` DATE, IN `facultyIn` VARCHAR(30), IN `universityNameIn` VARCHAR(80), IN `profilePictureExtensionIn` VARCHAR(4))
BEGIN
    CALL createUserProfile(emailIn, usernameIn, passwordIn);
    SET @userId = 0;  
    CALL idByUsername(usernameIn, @userId);
    CALL addUserData(@userId, nameIn, genderIn, birthDateIn, universityNameIn, profilePictureExtensionIn);
    CALL addUserbio(@userId, facultyIn);
END$$
DELIMITER ;

-- Softdelete Userprofile
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteUserprofile`(IN `usernameIn` VARCHAR(12), IN `passwordIn` VARCHAR(60))
BEGIN
	UPDATE `userprofiles` SET `deletedAt`= NOW() WHERE userprofiles.username = usernameIn AND userprofiles.password = passwordIn;
END$$
DELIMITER ;

