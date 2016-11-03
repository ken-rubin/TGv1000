SET @dropTheDB = 1;	/* Use 1 to drop and recreate TGv1001. Use 0 to preserve the DB and just run updates. That's all that needs to be done. */

DELIMITER //

-- Using this convoluted approach because if statements can exist only inside procedures, functions, etc.
USE sys//
DROP PROCEDURE IF EXISTS drop_create_TGv1001//
CREATE PROCEDURE drop_create_TGv1001(doit TINYINT(1))
begin
	if doit=1 then
		DROP SCHEMA IF EXISTS `TGv1001`;
		CREATE DATABASE IF NOT EXISTS `TGv1001`;
	end if;
end//

call drop_create_TGv1001(@dropTheDB)//

USE TGv1001//

drop function if exists soundex_match //

-- The soundex_match returns 1 if the soundex of needle = the soundex of any word in haystack. Else 0.
CREATE FUNCTION `soundex_match`(needle varchar(128), haystack text, splitChar varchar(1)) 
	RETURNS tinyint(4)
BEGIN
	declare spacePos int;
	declare searchLen int default 0;
	declare curWord varchar(128) default '';
	declare tempStr text default haystack;
	declare tmp text default '';
	declare soundx1 varchar(64) default '';
	declare soundx2 varchar(64) default '';    

	set searchLen = length(haystack);
	set spacePos  = locate(splitChar, tempStr);
	set soundx1   = soundex(needle);

	while searchLen > 0 do
		if spacePos = 0 then
			set tmp = tempStr;
			select soundex(tmp) into soundx2;
			if soundx1 = soundx2 then
				return 1;
			else
				return 0;
			end if;
		else
			set tmp = substr(tempStr, 1, spacePos-1);
			set soundx2 = soundex(tmp);
			if soundx1 = soundx2 then
				return 1;
			end if;

			set tempStr = substr(tempStr, spacePos+1);
			set searchLen = length(tempStr);
		end if;      

		set spacePos = locate(splitChar, tempStr);
	end while;  

	return 0;

END //

drop function if exists soundex_match_all //

-- The soundex_match_all returns the percentage of words in needle whose soundex matches soundex of any word in haystack.
-- needle is the search phrase entered by the user. haystack is the description entered by the object creator (project, resource or library).
-- soundex_match_all as it is written needs to be called repeatedly on a lot of candidates. That should at least be
-- optimized by restricting the number of haystacks to search.
create function soundex_match_all(needle text, haystack text, splitChar varchar(1)) RETURNS double 
begin 
	DECLARE comma INT DEFAULT 0; 
    DECLARE word TEXT;
    DECLARE total_score double;
    DECLARE total_num_words double; 
    SET comma = LOCATE(splitChar, needle); 
    SET word = TRIM(needle); 
    
    if LENGTH(haystack) = 0 then 
    	/* 0 word search term */
    	/* We could return 0 (no matches) or 1 (all match). */
    	/* Let's try it with 1. */
		return 1; 
	elseif comma = 0 then 
		/* one word search term */ 
        return soundex_match(word, haystack, splitChar); /* Same as returning soundex_match / 1. */
	end if; 
    
    SET total_score = 0;
    SET total_num_words = 0;
    SET word = trim(substr(needle, 1, comma)); 
    
    /* Insert each split variable into the word variable */ 
    REPEAT 
    	SET total_num_words = total_num_words + 1;
		SET total_score = total_score + soundex_match(word, haystack, splitChar);

        /* get the next word */ 
        SET needle = trim(substr(needle, comma)); 
        SET comma = LOCATE(splitChar, needle); 
        if comma = 0 then 
			/* last word */ 
            SET word = needle;
        else
	        SET word = trim(substr(needle, 1, comma)); 
		end if; 
        
    UNTIL length(needle) = 0 /* Used to be word. */
	END REPEAT; 

    return total_score / total_num_words; 
end // 

DROP FUNCTION IF EXISTS getUniqueProjNameForUser//
create FUNCTION getUniqueProjNameForUser(checkName varchar(255), userId int(11))
	RETURNS TEXT
begin

	set @uniqueName = checkName;
    set @iter = 1;
	
	rpt_loop: LOOP

		SET @id := (select id from projects where name=@uniqueName and ownedByUserId=userId);
        IF @id IS NULL THEN
			LEAVE rpt_loop;
		END IF;
        
        SET @iter = @iter + 1;
        SET @uniqueName = CONCAT(checkName, '(', @iter, ')');

	END LOOP;
    
    RETURN @uniqueName;
end //

DROP FUNCTION IF EXISTS getProjectsLinkedToGivenProjectByComic//
-- This function is used to find purchased projects. Input is the id of the purchasable project.
-- It returns the id's of all purchased projects since they share the same comics.
-- This implies that all PPs have a unique set of comics.
CREATE FUNCTION getProjectsLinkedToGivenProjectByComic(projectIdIn int(11))
	RETURNS TEXT
begin

    set @comicId = (select comicId from projects_comics_libraries where projectId=projectIdIn LIMIT 1);
	set @projectIds := (select group_concat(distinct projectId separator ',') from projects_comics_libraries where comicId=@comicId AND projectId<>projectIdIn);
    
    RETURN @projectIds;

end //

drop procedure if exists maintainDB//
create procedure maintainDB()
begin

	set @cnt = (select count(*) from information_schema.tables where table_schema = 'TGv1001' and table_name = 'control');
    
	if @cnt = 0 THEN

		CREATE TABLE `TGv1001`.`control` (
          `id` tinyint NOT NULL,
		  `dbstate` int(11) NOT NULL,
          PRIMARY KEY (`id`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		insert `TGv1001`.`control` (id, dbstate) values (1, 0);

	end if;
    
	set @dbstate := (select dbstate from `TGv1001`.`control` where id = 1);
        
    if @dbstate = 0 THEN

    	-- For the duration of @dbstate=0 we disable any constraint enforcement,
    	-- since we're creating the tables in alphabetical, not logical, order.
    	set FOREIGN_KEY_CHECKS = 0;

		CREATE TABLE `classes` (
		  `id` INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
		  `name` varchar(255) DEFAULT NULL,
		  `baseProjectId` INT UNSIGNED NOT NULL,
		  `instructorFirstName` varchar(255) DEFAULT NULL,
		  `instructorLastName` varchar(255) DEFAULT NULL,
		  `instructorPhone` varchar(255) DEFAULT NULL,
		  `level` varchar(255) DEFAULT NULL,
		  `difficulty` varchar(255) DEFAULT NULL,
		  `classDescription` text,
		  `imageId` int(11) DEFAULT '0',
		  `price` decimal(9,2) DEFAULT '0.00',
		  `facility` varchar(255) DEFAULT NULL,
		  `address` varchar(255) DEFAULT NULL,
		  `room` varchar(255) DEFAULT NULL,
		  `city` varchar(255) DEFAULT NULL,
		  `state` varchar(2) DEFAULT NULL,
		  `zip` varchar(10) DEFAULT NULL,
		  `schedule` json DEFAULT NULL,
		  `active` tinyint(1) DEFAULT '0',
		  `classNotes` text,
		  `maxClassSize` int(11) DEFAULT '0',
		  `loanComputersAvailable` tinyint(1) DEFAULT '0',
		  CONSTRAINT `FK_project_classes` FOREIGN KEY (`baseProjectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE
		) ENGINE=InnoDB;

		CREATE TABLE `comiccode` (
		  `id` INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
		  `comicId` INT UNSIGNED NOT NULL,
		  `ordinal` int(11) NOT NULL,
		  `description` text NOT NULL,
		  `stepsJSON` JSON NOT NULL,
		  CONSTRAINT `FK_comiccode_comic` FOREIGN KEY (`comicId`) REFERENCES `comics` (`id`) ON DELETE CASCADE
		) ENGINE=InnoDB;

		CREATE TABLE `comics` (
		  `id` INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
		  `name` varchar(255) NOT NULL,
		  `ordinal` int(11) NOT NULL,
		  `thumbnail` varchar(255) NOT NULL
		) ENGINE=InnoDB;
    
		CREATE TABLE `comics_slibraries` (
		  `comicId` INT UNSIGNED NOT NULL,
		  `libraryId` INT UNSIGNED NOT NULL,
		  PRIMARY KEY (`comicId`,`libraryId`),
		  CONSTRAINT `FK_comics_lib1` FOREIGN KEY (`comicId`) REFERENCES `comics` (`id`) ON DELETE CASCADE,
		  CONSTRAINT `FK_comics_lib2` FOREIGN KEY (`libraryId`) REFERENCES `libraries` (`id`) ON DELETE CASCADE
		) ENGINE=InnoDB;

		CREATE TABLE `comics_ulibraries` (
		  `comicId` INT UNSIGNED NOT NULL,
		  `libraryId` INT UNSIGNED NOT NULL,
		  PRIMARY KEY (`comicId`,`libraryId`),
		  CONSTRAINT `FK_comics_lib3` FOREIGN KEY (`comicId`) REFERENCES `comics` (`id`) ON DELETE CASCADE,
		  CONSTRAINT `FK_comics_lib4` FOREIGN KEY (`libraryId`) REFERENCES `libraries` (`id`) ON DELETE CASCADE
		) ENGINE=InnoDB;

		CREATE TABLE `comics_statements` (
		  `comicId` INT UNSIGNED NOT NULL,
		  `statementId` INT UNSIGNED NOT NULL,
		  PRIMARY KEY (`comicId`,`statementId`),
		  CONSTRAINT `FK_comics_stmt1` FOREIGN KEY (`comicId`) REFERENCES `comics` (`id`) ON DELETE CASCADE,
		  CONSTRAINT `FK_comics_stmt2` FOREIGN KEY (`statementId`) REFERENCES `statements` (`id`) ON DELETE CASCADE
		) ENGINE=InnoDB;

		-- id and description are columns in the table and are in libraryJSON. They are kept in sync in ProjectBO.
		CREATE TABLE `libraries` (
		  `id` INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
		  `name` varchar(255) NOT NULL,
		  `description` TEXT,
		  `createdByUserId` INT UNSIGNED NOT NULL,
		  `imageId` int(11) NOT NULL DEFAULT '0',
		  `altImagePath` varchar(255) NOT NULL DEFAULT '',
		  `libraryJSON` JSON NOT NULL,
		  FULLTEXT idx (name, description)
		) ENGINE=InnoDB;

    	-- Add library_editors table to record a library's "editors".
		CREATE TABLE `library_editors` (
		  `libraryId` INT UNSIGNED NOT NULL,
		  `userId` INT UNSIGNED NOT NULL,
		  PRIMARY KEY (`libraryId`,`userId`),
		  CONSTRAINT `FK_library_users` FOREIGN KEY (`libraryId`) REFERENCES `libraries` (`id`) ON DELETE CASCADE
		) ENGINE=InnoDB;

		CREATE TABLE `onlineclasses` (
		  `id` INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
		  `name` varchar(255) DEFAULT NULL,
		  `baseProjectId` INT UNSIGNED NOT NULL,
		  `instructorFirstName` varchar(255) DEFAULT NULL,
		  `instructorLastName` varchar(255) DEFAULT NULL,
		  `instructorEmail` varchar(255) DEFAULT NULL,
		  `level` varchar(255) DEFAULT NULL,
		  `difficulty` varchar(255) DEFAULT NULL,
		  `classDescription` text,
		  `imageId` int(11) DEFAULT '0',
		  `price` decimal(9,2) DEFAULT '0.00',
		  `schedule` json DEFAULT NULL,
		  `active` tinyint(1) DEFAULT '0',
		  `classNotes` text,
		  CONSTRAINT `FK_project_onlineclasses` FOREIGN KEY (`baseProjectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE
		) ENGINE=InnoDB;

		CREATE TABLE `permissions` (
		  `id` INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
		  `description` varchar(255) NOT NULL
		) ENGINE=InnoDB;

		CREATE TABLE `products` (
		  `id` INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
		  `name` varchar(255) NOT NULL,
		  `baseProjectId` INT UNSIGNED NOT NULL,
		  `level` varchar(255) NOT NULL,
		  `difficulty` varchar(255) NOT NULL,
		  `productDescription` text,
		  `imageId` int(11) NOT NULL DEFAULT '0',
		  `price` decimal(9,2) NOT NULL DEFAULT '0.00',
		  `active` tinyint(1) NOT NULL DEFAULT '0',
		  `videoURL` varchar(255) NOT NULL DEFAULT '',
		  CONSTRAINT `FK_project_products` FOREIGN KEY (`baseProjectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE
		) ENGINE=InnoDB;

		CREATE TABLE `projects` (
		  `id` INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
		  `name` varchar(255) NOT NULL,
		  `description` TEXT,
		  `ownedByUserId` int(11) NOT NULL,
		  `public` tinyint(1) NOT NULL DEFAULT '0',
		  `quarantined` tinyint(1) NOT NULL DEFAULT '1',
		  `imageId` int(11) NOT NULL DEFAULT '0',
		  `altImagePath` varchar(255) NOT NULL DEFAULT '',
		  `baseProjectId` INT UNSIGNED DEFAULT NULL,
		  `parentPrice` decimal(9,2) NOT NULL DEFAULT '0.00',
		  `priceBump` decimal(9,2) NOT NULL DEFAULT '0.00',
		  `projectTypeId` int(11) NOT NULL,
		  `isCoreProject` tinyint(1) NOT NULL DEFAULT '0',
		  `isProduct` tinyint(1) NOT NULL DEFAULT '0',
		  `isClass` tinyint(1) NOT NULL DEFAULT '0',
		  `isOnlineClass` tinyint(1) NOT NULL DEFAULT '0',
		  `firstSaved` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
		  `lastSaved` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
		  `chargeId` varchar(255) DEFAULT '',
		  `currentComicIndex` int(11) NOT NULL DEFAULT '0',
		  `currentComicStepIndex` int(11) NOT NULL DEFAULT '0',
		  CONSTRAINT `FK_project_projects` FOREIGN KEY (`baseProjectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
		  FULLTEXT idx (name, description)
		) ENGINE=InnoDB;

/*
		CREATE TABLE `projects_comics_libraries` (
		  `projectId` INT UNSIGNED NOT NULL,
		  `comicId` INT UNSIGNED NOT NULL,
		  `libraryId` INT UNSIGNED NOT NULL,
		  PRIMARY KEY (`projectId`,`comicId`,`libraryId`),
		  CONSTRAINT `FK_projects_comics_libraries1` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
		  CONSTRAINT `FK_projects_comics_libraries2` FOREIGN KEY (`comicId`) REFERENCES `comics` (`id`) ON DELETE CASCADE,
		  CONSTRAINT `FK_projects_comics_libraries3` FOREIGN KEY (`libraryId`) REFERENCES `libraries` (`id`) ON DELETE CASCADE
		) ENGINE=InnoDB;
*/
		CREATE TABLE `projects_comics` (
		  `projectId` INT UNSIGNED NOT NULL,
		  `comicId` INT UNSIGNED NOT NULL,
		  PRIMARY KEY (`projectId`,`comicId`),
		  CONSTRAINT `FK_comics_proj1` FOREIGN KEY (`comicId`) REFERENCES `comics` (`id`) ON DELETE CASCADE,
		  CONSTRAINT `FK_comics_proj2` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE
		) ENGINE=InnoDB;

		CREATE TABLE `projecttypes` (
		  `id` INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
		  `description` varchar(100) NOT NULL
		) ENGINE=InnoDB;

		CREATE TABLE `refunds` (
		  `id` INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
		  `userId` INT UNSIGNED NOT NULL,
		  `projectId` INT UNSIGNED NOT NULL,
		  `refundId` varchar(255) NOT NULL,
		  `dtRefund` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
		  CONSTRAINT `FK_refunds_user` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE,
		  CONSTRAINT `FK_refunds_project` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE
		) ENGINE=InnoDB;

		CREATE TABLE `resources` (
		  `id` INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
		  `name` varchar(255) NOT NULL DEFAULT '',
		  `description` TEXT,
		  `createdByUserId` int(11) NOT NULL,
		  `resourceTypeId` int(11) NOT NULL,
		  `public` tinyint(1) NOT NULL DEFAULT '0',
		  `quarantined` tinyint(1) NOT NULL DEFAULT '0',
		  KEY `idx_createdByUserId` (`createdByUserId`),
		  KEY `idx_resourceTypeId` (`resourceTypeId`)
		) ENGINE=InnoDB;

		CREATE TABLE `resourcetypes` (
		  `id` INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
		  `description` varchar(255) NOT NULL
		) ENGINE=InnoDB;

		CREATE TABLE `routes` (
		  `id` INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
		  `path` varchar(255) NOT NULL,
		  `moduleName` varchar(255) NOT NULL,
		  `route` varchar(255) NOT NULL,
		  `verb` varchar(255) NOT NULL,
		  `method` varchar(255) NOT NULL,
		  `requiresJWT` tinyint(1) NOT NULL DEFAULT '1',
		  `JWTerrorMsg` varchar(255) DEFAULT NULL
		) ENGINE=InnoDB;

		CREATE TABLE `statements` (
		  `id` INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
		  `name` varchar(255) NOT NULL
		) ENGINE=InnoDB;

		CREATE TABLE `ug_permissions` (
		  `usergroupId` INT UNSIGNED NOT NULL,
		  `permissionId` INT UNSIGNED NOT NULL,
		  PRIMARY KEY (`usergroupId`,`permissionId`),
		  CONSTRAINT `FK_ug_permissions` FOREIGN KEY (`permissionId`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
		) ENGINE=InnoDB;

		CREATE TABLE `user` (
		  `id` INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
		  `userName` varchar(45) NOT NULL,
		  `firstName` varchar(45) NOT NULL,
		  `lastName` varchar(45) NOT NULL,
		  `pwHash` varchar(16000) NOT NULL,
		  `usergroupId` INT UNSIGNED NOT NULL,
		  `zipcode` char(5) NOT NULL,
		  `timezone` mediumtext NOT NULL,
		  `lastProject` varchar(255) NOT NULL DEFAULT '',
		  `lastProjectId` INT UNSIGNED,
		  CONSTRAINT `FK_user_projects` FOREIGN KEY (`lastProjectId`) REFERENCES `projects` (`id`) ON DELETE SET NULL,
		  -- CONSTRAINT `FK_user_usergroup` FOREIGN KEY (`usergroupId`) REFERENCES `usergroups` (`id`) ON DELETE SET NULL, can never delete a usergroup without removing all users
		  FULLTEXT idx (userName)
		) ENGINE=InnoDB;

		CREATE TABLE `usergroups` (
		  `id` INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
		  `name` varchar(255) NOT NULL
		) ENGINE=InnoDB;

		CREATE TABLE `waitlist` (
		  `id` INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
		  `projectId` INT UNSIGNED NOT NULL,
		  `userId` INT UNSIGNED NOT NULL,
		  `userName` varchar(45) DEFAULT NULL,
		  `dtWaitlisted` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
		  `dtInvited` datetime DEFAULT NULL,
		  `fourHourWarningSent` tinyint(1) DEFAULT '0',
		  CONSTRAINT `FK_waitlist_projects` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
		  CONSTRAINT `FK_waitlist_user` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
		) ENGINE=InnoDB;

    	-- Re-enable constraint enforcement.
    	set FOREIGN_KEY_CHECKS = 1;

		set @dbstate := @dbstate + 1;	-- @dbstate = 1
		UPDATE control set dbstate=@dbstate where id=1;

    end if;

    if @dbstate = 1 THEN

    	-- For the duration of @dbstate = 1 disable all KEY checking, since we're in a screwy order.
    	set FOREIGN_KEY_CHECKS = 0;

    	ALTER TABLE `comics` DISABLE KEYS;
		INSERT INTO `comics` 
			VALUES 	(1,'TechGroms Game Project Help',0,'tn3.png'),
					(2,'TechGroms Console Project Help',0,'tn3.png'),
					(3,'TechGroms Website Project Help',0,'tn3.png'),
					(4,'TechGroms Hololens Project Help',0,'tn3.png'),
					(5,'TechGroms Map Project Help',0,'tn3.png'),
					(6,'Complete TechGroms Help',0,'tn3.png');
    	ALTER TABLE `comics` ENABLE KEYS;

		ALTER TABLE `comics_slibraries` DISABLE KEYS;
		INSERT INTO `comics_slibraries` 
			VALUES (1,6),(2,7),(3,8),(4,9),(5,10),(1,11),(2,11),(3,11),(4,11),(5,11),(6,11),(1,12);
		ALTER TABLE `comics_slibraries` ENABLE KEYS;

		ALTER TABLE `comics_ulibraries` DISABLE KEYS;
		INSERT INTO `comics_ulibraries` 
			VALUES (1,1),(2,2),(3,3),(4,4),(5,5),(6,13);
		ALTER TABLE `comics_ulibraries` ENABLE KEYS;

		ALTER TABLE `comics_statements` DISABLE KEYS;
		INSERT INTO `comics_statements` 
			VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(2,1),(2,2),(2,3),(2,4),(2,5),(2,6),(2,7),(2,8),(2,9),(2,10),(2,11),(2,12),(2,13),(2,14),(3,1),(3,2),(3,3),(3,4),(3,5),(3,6),(3,7),(3,8),(3,9),(3,10),(3,11),(3,12),(3,13),(3,14),(4,1),(4,2),(4,3),(4,4),(4,5),(4,6),(4,7),(4,8),(4,9),(4,10),(4,11),(4,12),(4,13),(4,14),(5,1),(5,2),(5,3),(5,4),(5,5),(5,6),(5,7),(5,8),(5,9),(5,10),(5,11),(5,12),(5,13),(5,14),(6,1),(6,2),(6,3),(6,4),(6,5),(6,6),(6,7),(6,8),(6,9),(6,10),(6,11),(6,12),(6,13),(6,14);
		ALTER TABLE `comics_statements` ENABLE KEYS;

		ALTER TABLE `libraries` DISABLE KEYS;
		INSERT INTO `libraries` (`id`,`name`,`description`,`createdByUserId`,`libraryJSON`)
			VALUES  (1,'GameAppLibrary','This library contains the types and methods needed to build ',1,'{"library": {"name": "GameAppLibrary", "id": 1, "types": [], "editors": "", "references": "", "description": ""}}'),
					(2,'ConsoleAppLibrary','This library contains the types and methods needed to build ',1,'{"library": {"name": "ConsoleAppLibrary", "id": 2, "types": [], "editors": "", "references": "", "description": ""}}'),
					(3,'WebsiteAppLibrary','This library contains the types and methods needed to build ',1,'{"library": {"name": "WebsiteAppLibrary", "id": 3, "types": [], "editors": "", "references": "", "description": ""}}'),
					(4,'HololensAppLibrary','This library contains the types and methods needed to build ',1,'{"library": {"name": "HololensAppLibrary", "id": 4, "types": [], "editors": "", "references": "", "description": ""}}'),
					(5,'MapAppLibrary','This library contains the types and methods needed to build ',1,'{"library": {"name": "MapAppLibrary", "id": 5, "types": [], "editors": "", "references": "", "description": ""}}'),
					(6,'GameBaseLibrary','This library contains the types and methods needed to build a variety of interesting visual games.',1,'{"library": {"name": "GameBaseLibrary", "id": 6, "types": [], "editors": "", "references": "", "description": "This library contains the types and methods needed to build a variety of interesting visual games."}}'),
					(7,'ConsoleBaseLibrary','This library contains the types and methods needed to build a console app. This is one where you interact through typed commands and responses.',1,'{"library": {"name": "ConsoleBaseLibrary", "id": 7, "types": [], "editors": "", "references": "", "description": "This library contains the types and methods needed to build a console app. This is one where you interact through typed commands and responses."}}'),
					(8,'WebsiteBaseLibrary','This library contains the types and methods needed to build a fully functional website.',1,'{"library": {"name": "WebsiteBaseLibrary", "id": 8, "types": [], "editors": "", "references": "", "description": "This library contains the types and methods needed to build a fully functional website."}}'),
					(9,'HololensBaseLibrary','This library contains the types and methods needed to build a Hololens 3-D app.',1,'{"library": {"name": "HololensBaseLibrary", "id": 9, "types": [], "editors": "", "references": "", "description": "This library contains the types and methods needed to build a Hololens 3-D app."}}'),
					(10,'MapBaseLibrary','This library contains the types and methods needed to build a map-based app.',1,'{"library": {"name": "MapBaseLibrary", "id": 10, "types": [], "editors": "", "references": "", "description": "This library contains the types and methods needed to build a map-based app."}}'),
					(11,'KernelTypesLibrary','This library contains the types and methods that hold and manipulate basic data variables like numbers, strings and so forth.',1,'{"library": {"name": "KernelTypesLibrary", "id": 11, "types": [], "editors": "", "references": "", "description": "This library contains the types and methods that hold and manipulate basic data variables like numbers, strings and so forth."}}'),
					(12,'VisualObjectLibrary','This library contains the types and methods needed to build any animated game or other visual presentation with drawings, movement and so forth.',1,'{"library": {"name": "VisualObjectLibrary", "id": 12, "types": [], "editors": "", "references": "", "description": "This library contains the types and methods needed to build any animated game or other visual presentation with drawings, movement and so forth."}}'),
					(13,'App_Library','This library is the place to put all your initialization code. We\'ve started you off with an App type containing a construct method. You take it from here.',1,'{"library": {"id": 13, "name": "EmptyLibrary", "types": [{"name": "App", "baseTypeName": "", "description": "This type\'s construct method will run first.", "methods": [{"name": "construct", "parameters": [], "statements": [], "comment": "All app initialization should be in this method.", "arguments": {"type": "ParameterList", "parameters": [{"type": "Array", "parameters": [{"type": "CodeLiteral", "parameters": [{"type": "String", "value": "..." }, {"type": "Boolean", "value": false}, {"type": "Boolean", "value": false}]}]}]}}],"properties": [],"events": [],"isSystemType": 0,"public": 0}],"editors": "","references": "KernelTypesLibrary","description": "This library is the place to put all your initialization code. We\'ve started you off with an App type containing a construct method. You take it from here."}}');
		ALTER TABLE `libraries` ENABLE KEYS;

		-- ALTER TABLE `library_editors` DISABLE KEYS;
		-- INSERT INTO `library_editors` 
		-- 	VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1),(11,1),(12,1),(13,1);
		-- ALTER TABLE `library_editors` ENABLE KEYS;

		ALTER TABLE `permissions` DISABLE KEYS;
		INSERT INTO `permissions` 
			VALUES (1,'can_edit_core_comics'),(2,'can_edit_base_and_system_libraries_and_types_therein'),(3,'can_make_public'),(4,'can_visit_adminzone'),(5,'can_open_free_projects'),(6,'can_buy_projects'),(7,'can_create_classes'),(8,'can_create_products'),(9,'can_create_onlineClasses'),(10,'can_edit_permissions'),(11,'can_unquarantine'),(12,'can_activate_PPs'),(13,'can_manage_site'),(14,'can_register_for_sites');
		ALTER TABLE `permissions` ENABLE KEYS;

		ALTER TABLE `projects` DISABLE KEYS;
		INSERT INTO `projects` (`id`,`name`,`description`,`ownedByUserId`,`public`,`quarantined`,`imageId`,`altImagePath`,`projectTypeId`,`isCoreProject`)
			VALUES 	(1,'New Game Project','This is the core project from which all games are derived.',1,1,1,0,'media/images/gameProject.png',1,1),
					(2,'New Console Project','This is the core project from which all console-based apps are derived.',1,1,1,0,'media/images/consoleProject.png',2,1),
					(3,'New Website Project','This is the core project from which all web sites are derived.',1,1,1,0,'media/images/websiteProject.png',3,1),
					(4,'New Hololens Project','This is the core project from which all Microsoft HoloLens projects are derived.',1,1,1,0,'media/images/hololensProject.png',4,1),
					(5,'New Map Project','This is the core project from which all mapping projects are derived.',1,1,1,0,'media/images/mappingProject.png',5,1),
					(6,'New Empty Project','This is the core project from which you should derive a project where you want full control over libraries and types. It is empty until you fill it.',1,1,1,0,'media/images/emptyProject.png',1,1);
		ALTER TABLE `projects` ENABLE KEYS;

		ALTER TABLE `projects_comics` DISABLE KEYS;
		INSERT INTO `projects_comics` 
			VALUES (1,1),(2,2),(3,3),(4,4),(5,5),(6,6);
		ALTER TABLE `projects_comics` ENABLE KEYS;

		ALTER TABLE `projecttypes` DISABLE KEYS;
		INSERT INTO `projecttypes` 
			VALUES (1,'game'),(2,'console'),(3,'website'),(4,'hololens'),(5,'map'),(6,'empty');
		ALTER TABLE `projecttypes` ENABLE KEYS;

		ALTER TABLE `resourcetypes` DISABLE KEYS;
		INSERT INTO `resourcetypes` 
			VALUES (1,'image'),(2,'sound');
		ALTER TABLE `resourcetypes` ENABLE KEYS;

		ALTER TABLE `routes` DISABLE KEYS;
		INSERT INTO `routes` (`path`,`moduleName`,`route`,`verb`,`method`,`requiresJWT`,`JWTerrorMsg`)
			VALUES ('./modules/BOL/','ValidateBO','/BOL/ValidateBO/UserAuthenticate','post','routeUserAuthenticate',0,NULL),('./modules/BOL/','ValidateBO','/BOL/ValidateBO/NewEnrollment','post','routeNewEnrollment',0,NULL),('./modules/BOL/','ResourceBO','/BOL/ResourceBO/SaveResource','post','routeSaveResource',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),('./modules/BOL/','ResourceBO','/BOL/ResourceBO/SaveURLResource','post','routeSaveURLResource',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),('./modules/BOL/','UtilityBO','/BOL/UtilityBO/SearchResources','post','routeSearchResources',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),('./modules/BOL/','UtilityBO','/BOL/UtilityBO/SearchProjects','post','routeSearchProjects',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),('./modules/BOL/','ProjectBO','/BOL/ProjectBO/SaveProject','post','routeSaveProject',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),('./modules/BOL/','ProjectBO','/BOL/ProjectBO/RetrieveProject','post','routeRetrieveProject',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),('./modules/BOL/','ValidateBO','/BOL/ValidateBO/SendPasswordResetEmail','post','routeSendPasswordResetEmail',0,NULL),('./modules/BOL/','ValidateBO','/BOL/ValidateBO/ResetPassword','post','routePasswordReset',0,NULL),('./modules/BOL/','UtilityBO','/BOL/UtilityBO/ProcessCharge','post','routeProcessCharge',1,'We encountered a session validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),('./modules/BOL/','UtilityBO','/BOL/UtilityBO/GetStripePK','post','routeGetStripePK',1,'We encountered a session validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),('./modules/BOL/','UtilityBO','/BOL/UtilityBO/PutUserOnWaitlist','post','routePutUserOnWaitlist',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),('./modules/BOL/','ProjectBO','/BOL/ProjectBO/RetrievePurchasableProjectData','post','routeRetrievePurchasableProjectData',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),('./modules/BOL/','ProjectBO','/BOL/ProjectBO/SavePPData','post','routeSavePPData',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),('./modules/BOL/','UtilityBO','/BOL/UtilityBO/GetAllUserMaintData','post','routeGetAllUserMaintData',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),('./modules/BOL/','UtilityBO','/BOL/UtilityBO/AddPermission','post','routeAddPermission',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),('./modules/BOL/','UtilityBO','/BOL/UtilityBO/AddUsergroup','post','routeAddUsergroup',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),('./modules/BOL/','UtilityBO','/BOL/UtilityBO/UpdateUserUsergroup','post','routeUpdateUserUsergroup',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),('./modules/BOL/','UtilityBO','/BOL/UtilityBO/UpdateUgPermissions','post','routeUpdateUgPermissions',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),('./modules/BOL/','UtilityBO','/BOL/UtilityBO/GetPPBuyers','post','routeGetPPBuyers',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),('./modules/BOL/','UtilityBO','/BOL/UtilityBO/UndoPurchase','post','routeUndoPurchase',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),('./modules/BOL/','UtilityBO','/BOL/UtilityBO/SendClassInvite','post','routeSendClassInvite',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),('./modules/BOL/','ProjectBO','/BOL/ProjectBO/FetchNormalUserNewProjectTypes','post','routeFetchNormalUserNewProjectTypes',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.');
		ALTER TABLE `routes` ENABLE KEYS;

		ALTER TABLE `statements` DISABLE KEYS;
		INSERT INTO `statements` 
			VALUES (1,'StatementBreak'),(2,'StatementContinue'),(3,'StatementExpression'),(4,'StatementFor'),(5,'StatementForIn'),(6,'StatementIf'),(7,'StatementReturn'),(8,'StatementThrow'),(9,'StatementTry'),(10,'StatementVar'),(11,'StatementWhile'),(12,'StatementComment'),(13,'StatementDebugger'),(14,'StatementFreeform');
		ALTER TABLE `statements` ENABLE KEYS;

		ALTER TABLE `ug_permissions` DISABLE KEYS;
		INSERT INTO `ug_permissions` 
			VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(2,3),(2,4),(2,5),(2,6),(2,7),(3,5),(3,6),(4,5),(5,13),(6,5),(6,6),(6,14);
		ALTER TABLE `ug_permissions` ENABLE KEYS;

		ALTER TABLE `user` DISABLE KEYS;
		INSERT INTO `user` VALUES 
			(1,'templates@techgroms.com','System','User','$2a$10$XULC/AcP/94VUb0EdiTG4eIiLI/zaW4n/qcovbRb2/SDTLmoG2BDe',1,'10601','America/New_York','',NULL);
		ALTER TABLE `user` ENABLE KEYS;

		ALTER TABLE `usergroups` DISABLE KEYS;
		INSERT INTO `usergroups` 
			VALUES (1,'developer'),(2,'instructor'),(3,'registered_user'),(4,'unregistered_user'),(5,'site_teacher'),(6,'site_student');
		ALTER TABLE `usergroups` ENABLE KEYS;

    	set FOREIGN_KEY_CHECKS = 1;
		set @dbstate := @dbstate + 1;	-- @dbstate = 2
		UPDATE control set dbstate=@dbstate where id=1;

    end if;
    
    if @dbstate = 222 THEN



		set @dbstate := @dbstate + 1;	-- @dbstate = 3
		UPDATE control set dbstate=@dbstate where id=1;

    end if;
    
    if @dbstate = 333 THEN

    
		set @dbstate := @dbstate + 1;	-- @dbstate = 4
		UPDATE control set dbstate=@dbstate where id=1;

    end if;
    
end//

-- Execute the procedure
call maintainDB()//

delimiter ;

DROP PROCEDURE IF EXISTS maintainDB;
select * from control;
