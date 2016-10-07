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

DROP PROCEDURE IF EXISTS doTags//
create procedure doTags(tagsconcat varchar(255), itemIdVarName varchar(20), strItemType varchar(20))
begin

	set @delim = '~';
	set @inipos = 1;
	set @fullstr = tagsconcat;
	set @maxlen = LENGTH(@fullstr);
	
	REPEAT
		set @endpos = LOCATE(@delim, @fullstr, @inipos);
		set @tag = SUBSTR(@fullstr, @inipos, @endpos - @inipos);
		
		if @tag <> '' AND @tag IS NOT NULL THEN
			set @id := (select id from tags where description=@tag);
			if @id IS NULL THEN
				insert tags (description) values (@tag);
				set @id := (select LAST_INSERT_ID());
			end if;
			
			if strItemType = 'project' THEN
				insert project_tags values (itemIdVarName, @id);
			elseif strItemType = 'type' THEN
				insert type_tags values (itemIdVarName, @id);
			elseif strItemType = 'method' THEN
				insert method_tags values (itemIdVarName, @id);
			else
				insert library_tags values (itemIdVarName, @id);
			end if;
		END IF;
		SET @inipos = @endpos + 1;
	UNTIL @inipos >= @maxlen END REPEAT;
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

DROP FUNCTION IF EXISTS getProjectsLinkedToComic0OfProject//
CREATE FUNCTION getProjectsLinkedToComic0OfProject(projectIdIn int(11))
	RETURNS TEXT
begin

	-- Note: this returns projectIdIn, too.
	-- set @projectId := (select distinct pcl.projectId from projects_comics_libraries pcl inner join comics c on c.id=pcl.comicId where pcl.projectId=projectIdIn AND c.ordinal=0);
    set @comicId = (select comicId from projects_comics_libraries where projectId=projectIdIn LIMIT 1);
	set @projectIds := (select group_concat(distinct projectId separator ',') from projects_comics_libraries where comicId=@comicId AND projectId<>projectIdIn);
    
    RETURN @projectIds;

end //

drop procedure if exists maintainDB//
create procedure maintainDB()
begin

	select @cnt := count(*) from information_schema.tables where table_schema = 'TGv1001' and table_name = 'control';
    
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

    	-- For the duration of @dbstate 0 disable any constraint enforcement,
    	-- since we're creating the tables in alphabetical, not logical, order.
    	set FOREIGN_KEY_CHECKS = 0;

		CREATE TABLE `classes` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `name` varchar(255) DEFAULT NULL,
		  `baseProjectId` int(11) DEFAULT '0',
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
		  PRIMARY KEY (`id`),
		  KEY `FK_project_classes` (`baseProjectId`),
		  CONSTRAINT `FK_project_classes` FOREIGN KEY (`baseProjectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		CREATE TABLE `comiccode` (
		  `id` int(11) NOT NULL,
		  `comicId` int(11) NOT NULL,
		  `ordinal` int(11) NOT NULL,
		  `description` text NOT NULL,
		  `JSONsteps` mediumtext NOT NULL,
		  PRIMARY KEY (`id`,`comicId`),
		  KEY `FK_comiccode` (`comicId`),
		  CONSTRAINT `FK_comiccode` FOREIGN KEY (`comicId`) REFERENCES `comics` (`id`) ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		CREATE TABLE `comics` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `name` varchar(255) NOT NULL,
		  `ordinal` int(11) NOT NULL,
		  `thumbnail` varchar(255) NOT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
    
		CREATE TABLE `comics_statements` (
		  `comicId` int(11) NOT NULL,
		  `statementId` int(11) NOT NULL,
		  PRIMARY KEY (`comicId`,`statementId`),
		  CONSTRAINT `FK_comicsstmt` FOREIGN KEY (`comicId`) REFERENCES `comics` (`id`) ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		CREATE TABLE `libraries` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `name` varchar(255) NOT NULL,
		  `createdByUserId` int(11) DEFAULT NULL,
		  `isSystemLibrary` tinyint(1) NOT NULL DEFAULT '0',
          `isBaseLibrary` tinyint(1) NOT NULL DEFAULT '0',
          `isAppLibrary` tinyint(1) NOT NULL DEFAULT '0',
		  `imageId` int(11) NOT NULL DEFAULT '0',
		  `altImagePath` varchar(255) NOT NULL DEFAULT '',
		  `libraryJSON` JSON NOT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

		CREATE TABLE `onlineclasses` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `name` varchar(255) DEFAULT NULL,
		  `baseProjectId` int(11) DEFAULT '0',
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
		  PRIMARY KEY (`id`),
		  KEY `FK_project_onlineclasses` (`baseProjectId`),
		  CONSTRAINT `FK_project_onlineclasses` FOREIGN KEY (`baseProjectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		CREATE TABLE `permissions` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `description` varchar(255) NOT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

		CREATE TABLE `products` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `name` varchar(255) NOT NULL,
		  `baseProjectId` int(11) NOT NULL DEFAULT '0',
		  `level` varchar(255) NOT NULL,
		  `difficulty` varchar(255) NOT NULL,
		  `productDescription` text,
		  `imageId` int(11) NOT NULL DEFAULT '0',
		  `price` decimal(9,2) NOT NULL DEFAULT '0.00',
		  `active` tinyint(1) NOT NULL DEFAULT '0',
		  `videoURL` varchar(255) NOT NULL DEFAULT '',
		  PRIMARY KEY (`id`),
		  KEY `FK_project_products` (`baseProjectId`),
		  CONSTRAINT `FK_project_products` FOREIGN KEY (`baseProjectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		CREATE TABLE `project_tags` (
		  `projectId` int(11) NOT NULL,
		  `tagId` int(11) NOT NULL,
		  PRIMARY KEY (`projectId`,`tagId`),
		  CONSTRAINT `FK_project_tags` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		CREATE TABLE `projects` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `name` varchar(255) NOT NULL,
		  `ownedByUserId` int(11) NOT NULL,
		  `public` tinyint(1) NOT NULL DEFAULT '0',
		  `quarantined` tinyint(1) NOT NULL DEFAULT '1',
		  `description` varchar(255) DEFAULT NULL,
		  `imageId` int(11) NOT NULL DEFAULT '0',
		  `altImagePath` varchar(255) NOT NULL DEFAULT '',
		  `parentProjectId` int(11) DEFAULT NULL,
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
		  PRIMARY KEY (`id`),
		  KEY `idx_ownedByUserId` (`ownedByUserId`)
		) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

		CREATE TABLE `projects_comics_libraries` (
		  `projectId` int(11) NOT NULL,
		  `comicId` int(11) NOT NULL,
		  `libraryId` int(11) NOT NULL,
		  PRIMARY KEY (`projectId`,`comicId`,`libraryId`),
		  CONSTRAINT `FK_projects_comics_libraries` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		CREATE TABLE `projecttypes` (
		  `id` int(11) NOT NULL,
		  `description` varchar(100) NOT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		CREATE TABLE `refunds` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `userId` int(11) NOT NULL,
		  `projectId` int(11) NOT NULL,
		  `refundId` varchar(255) NOT NULL,
		  `dtRefund` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		CREATE TABLE `resources` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `name` varchar(255) NOT NULL DEFAULT '',
		  `createdByUserId` int(11) NOT NULL,
		  `resourceTypeId` int(11) NOT NULL,
		  `public` tinyint(1) NOT NULL DEFAULT '0',
		  `quarantined` tinyint(1) NOT NULL DEFAULT '0',
		  PRIMARY KEY (`id`),
		  KEY `idx_createdByUserId` (`createdByUserId`),
		  KEY `idx_resourceTypeId` (`resourceTypeId`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		CREATE TABLE `resources_tags` (
		  `resourceId` int(11) NOT NULL,
		  `tagId` int(11) NOT NULL,
		  PRIMARY KEY (`resourceId`,`tagId`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		CREATE TABLE `resourcetypes` (
		  `id` int(11) NOT NULL,
		  `description` varchar(255) NOT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		CREATE TABLE `routes` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `path` varchar(255) NOT NULL,
		  `moduleName` varchar(255) NOT NULL,
		  `route` varchar(255) NOT NULL,
		  `verb` varchar(255) NOT NULL,
		  `method` varchar(255) NOT NULL,
		  `requiresJWT` tinyint(1) NOT NULL DEFAULT '1',
		  `JWTerrorMsg` varchar(255) DEFAULT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;

		CREATE TABLE `statements` (
		  `id` int(11) NOT NULL,
		  `name` varchar(255) NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		CREATE TABLE `tags` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `description` varchar(255) NOT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8;

		CREATE TABLE `ug_permissions` (
		  `usergroupId` int(11) NOT NULL,
		  `permissionId` int(11) NOT NULL,
		  PRIMARY KEY (`usergroupId`,`permissionId`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		CREATE TABLE `user` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `userName` varchar(45) NOT NULL,
		  `firstName` varchar(45) NOT NULL,
		  `lastName` varchar(45) NOT NULL,
		  `pwHash` varchar(16000) NOT NULL,
		  `usergroupId` int(11) NOT NULL,
		  `zipcode` char(5) NOT NULL,
		  `timezone` mediumtext NOT NULL,
		  `lastProject` varchar(255) NOT NULL DEFAULT '',
		  `lastProjectId` int(11) NOT NULL DEFAULT '0',
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

		CREATE TABLE `usergroups` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `name` varchar(255) NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

		CREATE TABLE `waitlist` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `projectId` varchar(255) NOT NULL,
		  `userId` int(11) NOT NULL,
		  `userName` varchar(45) DEFAULT NULL,
		  `dtWaitlisted` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
		  `dtInvited` datetime DEFAULT NULL,
		  `fourHourWarningSent` tinyint(1) DEFAULT '0',
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    	-- Re-enable constraint enforcement.
    	set FOREIGN_KEY_CHECKS = 1;

		set @dbstate := @dbstate + 1;	-- @dbstate = 1
		UPDATE control set dbstate=@dbstate where id=1;

    end if;

    if @dbstate = 1 THEN

    	set FOREIGN_KEY_CHECKS = 0;

    	ALTER TABLE `comics` DISABLE KEYS;
		INSERT INTO `comics` VALUES (1,'TechGroms Game Project Help',0,'tn3.png'),(2,'TechGroms Console Project Help',0,'tn3.png'),(3,'TechGroms Website Project Help',0,'tn3.png'),(4,'TechGroms Hololens Project Help',0,'tn3.png'),(5,'TechGroms Map Project Help',0,'tn3.png');
    	ALTER TABLE `comics` ENABLE KEYS;

		ALTER TABLE `comics_statements` DISABLE KEYS;
		INSERT INTO `comics_statements` VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(2,1),(2,2),(2,3),(2,4),(2,5),(2,6),(2,7),(2,8),(2,9),(2,10),(2,11),(2,12),(2,13),(2,14),(3,1),(3,2),(3,3),(3,4),(3,5),(3,6),(3,7),(3,8),(3,9),(3,10),(3,11),(3,12),(3,13),(3,14),(4,1),(4,2),(4,3),(4,4),(4,5),(4,6),(4,7),(4,8),(4,9),(4,10),(4,11),(4,12),(4,13),(4,14),(5,1),(5,2),(5,3),(5,4),(5,5),(5,6),(5,7),(5,8),(5,9),(5,10),(5,11),(5,12),(5,13),(5,14);
		ALTER TABLE `comics_statements` ENABLE KEYS;

		ALTER TABLE `libraries` DISABLE KEYS;
		INSERT INTO `libraries` VALUES (1,'GameAppLibrary',3,0,0,1,0,'','{"library": {"name": "GameAppLibrary", "id": 1, "types": [], "editors": [], "references": [], "description": ""}}'),(2,'ConsoleAppLibrary',1,0,0,1,0,'','{"library": {"name": "ConsoleAppLibrary", "id": 2, "types": [], "editors": [], "references": [], "description": ""}}'),(3,'WebsiteAppLibrary',1,0,0,1,0,'','{"library": {"name": "WebsiteAppLibrary", "id": 3, "types": [], "editors": [], "references": [], "description": ""}}'),(4,'HololensAppLibrary',1,0,0,1,0,'','{"library": {"name": "HololensAppLibrary", "id": 4, "types": [], "editors": [], "references": [], "description": ""}}'),(5,'MapAppLibrary',2,0,0,1,0,'','{"library": {"name": "MapAppLibrary", "id": 5, "types": [], "editors": [], "references": [], "description": ""}}'),(6,'GameBaseLibrary',3,0,1,0,0,'','{"library": {"name": "GameBaseLibrary", "id": 6, "types": [], "editors": [], "references": [], "description": ""}}'),(7,'ConsoleBaseLibrary',1,0,1,0,0,'','{"library": {"name": "ConsoleBaseLibrary", "id": 7, "types": [], "editors": [], "references": [], "description": ""}}'),(8,'WebsiteBaseLibrary',1,0,1,0,0,'','{"library": {"name": "WebsiteBaseLibrary", "id": 8, "types": [], "editors": [], "references": [], "description": ""}}'),(9,'HololensBaseLibrary',1,0,1,0,0,'','{"library": {"name": "HololensBaseLibrary", "id": 9, "types": [], "editors": [], "references": [], "description": ""}}'),(10,'MapBaseLibrary',2,0,1,0,0,'','{"library": {"name": "MapBaseLibrary", "id": 10, "types": [], "editors": [], "references": [], "description": ""}}'),(11,'KernelTypesLibrary',3,1,0,0,0,'','{"library": {"name": "KernelTypesLibrary", "id": 11, "types": [], "editors": [], "references": [], "description": ""}}'),(12,'VisualObjectLibrary',3,1,0,0,0,'','{"library": {"name": "VisualObjectLibrary", "id": 12, "types": [], "editors": [], "references": [], "description": ""}}');
		ALTER TABLE `libraries` ENABLE KEYS;

		ALTER TABLE `permissions` DISABLE KEYS;
		INSERT INTO `permissions` VALUES (1,'can_edit_core_comics'),(2,'can_edit_base_and_system_libraries_and_types_therein'),(3,'can_make_public'),(4,'can_visit_adminzone'),(5,'can_open_free_projects'),(6,'can_buy_projects'),(7,'can_create_classes'),(8,'can_create_products'),(9,'can_create_onlineClasses'),(10,'can_edit_permissions'),(11,'can_unquarantine'),(12,'can_activate_PPs'),(13,'can_manage_site'),(14,'can_register_for_sites');
		ALTER TABLE `permissions` ENABLE KEYS;

		ALTER TABLE `project_tags` DISABLE KEYS;
		-- INSERT INTO `project_tags` VALUES (6,9),(6,10),(7,9),(7,32);
		ALTER TABLE `project_tags` ENABLE KEYS;

		ALTER TABLE `projects` DISABLE KEYS;
		INSERT INTO `projects` VALUES (1,'New Game Project',1,1,1,'',0,'media/images/gameProject.png',0,0.00,0.00,1,1,0,0,0,'2016-09-27 08:17:00','2016-09-27 08:17:00','',0),(2,'New Console Project',1,1,1,'',0,'media/images/consoleProject.png',0,0.00,0.00,2,1,0,0,0,'2016-09-27 08:17:00','2016-09-27 08:17:00','',0),(3,'New Website Project',1,1,1,'',0,'media/images/websiteProject.png',0,0.00,0.00,3,1,0,0,0,'2016-09-27 08:17:00','2016-09-27 08:17:00','',0),(4,'New Hololens Project',1,1,1,'',0,'media/images/hololensProject.png',0,0.00,0.00,4,1,0,0,0,'2016-09-27 08:17:00','2016-09-27 08:17:00','',0),(5,'New Map Project',1,1,1,'',0,'media/images/mappingProject.png',0,0.00,0.00,5,1,0,0,0,'2016-09-27 08:17:00','2016-09-27 08:17:00','',0);
		ALTER TABLE `projects` ENABLE KEYS;

		ALTER TABLE `projects_comics_libraries` DISABLE KEYS;
		INSERT INTO `projects_comics_libraries` VALUES (1,1,1),(1,1,6),(1,1,11),(1,1,12),(2,2,2),(2,2,7),(2,2,11),(2,2,12),(3,3,3),(3,3,8),(3,3,11),(3,3,12),(4,4,4),(4,4,9),(4,4,11),(4,4,12),(5,5,5),(5,5,10),(5,5,11),(5,5,12);
		ALTER TABLE `projects_comics_libraries` ENABLE KEYS;

		ALTER TABLE `projecttypes` DISABLE KEYS;
		INSERT INTO `projecttypes` VALUES (1,'game'),(2,'console'),(3,'website'),(4,'hololens'),(5,'map');
		ALTER TABLE `projecttypes` ENABLE KEYS;

		ALTER TABLE `resourcetypes` DISABLE KEYS;
		INSERT INTO `resourcetypes` VALUES (1,'image'),(2,'sound');
		ALTER TABLE `resourcetypes` ENABLE KEYS;

		ALTER TABLE `routes` DISABLE KEYS;
		INSERT INTO `routes` VALUES (1,'./modules/BOL/','ValidateBO','/BOL/ValidateBO/UserAuthenticate','post','routeUserAuthenticate',0,NULL),(2,'./modules/BOL/','ValidateBO','/BOL/ValidateBO/NewEnrollment','post','routeNewEnrollment',0,NULL),(3,'./modules/BOL/','ResourceBO','/BOL/ResourceBO/SaveResource','post','routeSaveResource',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),(4,'./modules/BOL/','ResourceBO','/BOL/ResourceBO/SaveURLResource','post','routeSaveURLResource',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),(5,'./modules/BOL/','UtilityBO','/BOL/UtilityBO/SearchResources','post','routeSearchResources',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),(6,'./modules/BOL/','UtilityBO','/BOL/UtilityBO/SearchProjects','post','routeSearchProjects',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),(7,'./modules/BOL/','UtilityBO','/BOL/UtilityBO/SearchTypes','post','routeSearchTypes',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),(8,'./modules/BOL/','UtilityBO','/BOL/UtilityBO/SearchMethods','post','routeSearchMethods',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),(9,'./modules/BOL/','ProjectBO','/BOL/ProjectBO/SaveProject','post','routeSaveProject',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),(10,'./modules/BOL/','ProjectBO','/BOL/ProjectBO/RetrieveProject','post','routeRetrieveProject',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),(11,'./modules/BOL/','ProjectBO','/BOL/ProjectBO/RetrieveType','post','routeRetrieveType',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),(12,'./modules/BOL/','ProjectBO','/BOL/ProjectBO/RetrieveMethod','post','routeRetrieveMethod',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),(13,'./modules/BOL/','ValidateBO','/BOL/ValidateBO/SendPasswordResetEmail','post','routeSendPasswordResetEmail',0,NULL),(14,'./modules/BOL/','ValidateBO','/BOL/ValidateBO/ResetPassword','post','routePasswordReset',0,NULL),(15,'./modules/BOL/','UtilityBO','/BOL/UtilityBO/ProcessCharge','post','routeProcessCharge',1,'We encountered a session validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),(16,'./modules/BOL/','UtilityBO','/BOL/UtilityBO/GetStripePK','post','routeGetStripePK',1,'We encountered a session validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),(17,'./modules/BOL/','UtilityBO','/BOL/UtilityBO/PutUserOnWaitlist','post','routePutUserOnWaitlist',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),(18,'./modules/BOL/','ProjectBO','/BOL/ProjectBO/RetrievePurchasableProjectData','post','routeRetrievePurchasableProjectData',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),(19,'./modules/BOL/','ProjectBO','/BOL/ProjectBO/SavePPData','post','routeSavePPData',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),(20,'./modules/BOL/','UtilityBO','/BOL/UtilityBO/GetAllUserMaintData','post','routeGetAllUserMaintData',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),(21,'./modules/BOL/','UtilityBO','/BOL/UtilityBO/AddPermission','post','routeAddPermission',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),(22,'./modules/BOL/','UtilityBO','/BOL/UtilityBO/AddUsergroup','post','routeAddUsergroup',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),(23,'./modules/BOL/','UtilityBO','/BOL/UtilityBO/UpdateUserUsergroup','post','routeUpdateUserUsergroup',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),(24,'./modules/BOL/','UtilityBO','/BOL/UtilityBO/UpdateUgPermissions','post','routeUpdateUgPermissions',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),(25,'./modules/BOL/','UtilityBO','/BOL/UtilityBO/GetPPBuyers','post','routeGetPPBuyers',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),(26,'./modules/BOL/','UtilityBO','/BOL/UtilityBO/UndoPurchase','post','routeUndoPurchase',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),(27,'./modules/BOL/','UtilityBO','/BOL/UtilityBO/SendClassInvite','post','routeSendClassInvite',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.'),(30,'./modules/BOL/','ProjectBO','/BOL/ProjectBO/FetchNormalUserNewProjectTypes','post','routeFetchNormalUserNewProjectTypes',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.');
		ALTER TABLE `routes` ENABLE KEYS;

		ALTER TABLE `statements` DISABLE KEYS;
		INSERT INTO `statements` VALUES (1,'StatementBreak'),(2,'StatementContinue'),(3,'StatementExpression'),(4,'StatementFor'),(5,'StatementForIn'),(6,'StatementIf'),(7,'StatementReturn'),(8,'StatementThrow'),(9,'StatementTry'),(10,'StatementVar'),(11,'StatementWhile'),(12,'StatementComment'),(13,'StatementDebugger'),(14,'StatementFreeform');
		ALTER TABLE `statements` ENABLE KEYS;

		ALTER TABLE `tags` DISABLE KEYS;
		INSERT INTO `tags` VALUES (8,'library'),(9,'project'),(10,'mapping'),(11,'mapapplibrary'),(12,'type'),(13,'app'),(14,'method'),(15,'initialize'),(16,'construct'),(17,'mapbaselibrary'),(18,'mapbasetype'),(19,'kerneltypeslibrary'),(20,'array'),(21,'boolean'),(22,'date'),(23,'math'),(24,'number'),(25,'regexp'),(26,'string'),(27,'visualobjectlibrary'),(28,'visualobject'),(29,'newlibrary'),(30,'newtype'),(31,'constuct'),(32,'agame'),(33,'gameapplibrary'),(34,'gamebaselibrary'),(35,'gamebasetype');
		ALTER TABLE `tags` ENABLE KEYS;

		ALTER TABLE `ug_permissions` DISABLE KEYS;
		INSERT INTO `ug_permissions` VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(2,3),(2,4),(2,5),(2,6),(2,7),(3,5),(3,6),(4,5),(5,13),(6,5),(6,6),(6,14);
		ALTER TABLE `ug_permissions` ENABLE KEYS;

		ALTER TABLE `user` DISABLE KEYS;
		INSERT INTO `user` VALUES (1,'templates@techgroms.com','System','User','$2a$10$XULC/AcP/94VUb0EdiTG4eIiLI/zaW4n/qcovbRb2/SDTLmoG2BDe',1,'10601','America/New_York','',0);
		ALTER TABLE `user` ENABLE KEYS;

		ALTER TABLE `usergroups` DISABLE KEYS;
		INSERT INTO `usergroups` VALUES (1,'developer'),(2,'instructor'),(3,'registered_user'),(4,'unregistered_user'),(5,'site_teacher'),(6,'site_student');
		ALTER TABLE `usergroups` ENABLE KEYS;



    	set FOREIGN_KEY_CHECKS = 1;
		set @dbstate := @dbstate + 1;	-- @dbstate = 2
		UPDATE control set dbstate=@dbstate where id=1;

    end if;
    
end//

-- Execute the procedure
call maintainDB()//

delimiter ;
select * from control;
