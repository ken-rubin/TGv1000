delimiter //

-- This file should also be saved to git with the commented out sections commented out.
-- If necessary to start TGv1000 from scratch, uncomment the 3 sections below. But don't push it that way to git.




/* 
	DROP SCHEMA IF EXISTS `TGv1000`//
	CREATE DATABASE IF NOT EXISTS `TGv1000`//
 */



USE TGv1000//
SELECT database()//



-- If necessary to change doTags or if re-creating the DB, uncomment the following:
/* 

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
			else
				insert method_tags values (itemIdVarName, @id);
			end if;
		END IF;
		SET @inipos = @endpos + 1;
	UNTIL @inipos >= @maxlen END REPEAT;
end //

 */


-- If necessary to change getUniqueProjNameForUser or if re-creating the DB, uncomment the following:
/* 

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

 */

create procedure maintainDB()
begin

	select @cnt := count(*) from information_schema.tables where table_schema = 'TGv1000' and table_name = 'control';
    
	if @cnt = 0 THEN

		CREATE TABLE `TGv1000`.`control` (
          `id` tinyint NOT NULL,
		  `dbstate` int(11) NOT NULL,
          PRIMARY KEY (`id`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		insert `TGv1000`.`control` (id, dbstate) values (1, 0);

	end if;
    
	set @dbstate := (select dbstate from `TGv1000`.`control` where id = 1);
        
    if @dbstate = 0 THEN
    
		CREATE TABLE `TGv1000`.`tags` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `description` varchar(255) NOT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
		CREATE TABLE `TGv1000`.`projects` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `name` varchar(255) NOT NULL,
          `ownedByUserId` int(11) NOT NULL,
		  `public` tinyint(1) NOT NULL DEFAULT FALSE,
		  `quarantined` tinyint(1) NOT NULL DEFAULT TRUE,
          `description` VARCHAR(255) NULL,
          `imageId` int(11) NOT NULL DEFAULT '0',
          `altImagePath` varchar(255) NOT NULL DEFAULT '',
          `parentProjectId` INT(11) NULL,
          `parentPrice` DECIMAL(9,2) NOT NULL DEFAULT 0.00,
          `priceBump` DECIMAL(9,2) NOT NULL DEFAULT 0.00,
          `projectTypeId` int(11) NOT NULL,
          `comicProjectId` int(11) NOT NULL DEFAULT 0,
          `isCoreProject` TINYINT(1) NOT NULL DEFAULT FALSE,
          `isProduct` TINYINT(1) NOT NULL DEFAULT FALSE,
          `isClass` TINYINT(1) NOT NULL DEFAULT FALSE,
		  `firstSaved` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		  `lastSaved` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		  PRIMARY KEY (`id`),
          INDEX idx_ownedByUserId (ownedByUserId)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
		CREATE TABLE `TGv1000`.`project_tags` (
		  `projectId` int(11) NOT NULL,
		  `tagId` int(11) NOT NULL,
		  PRIMARY KEY (`projectId`,`tagId`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;
        
		CREATE TABLE `TGv1000`.`classes` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `name` varchar(255),
          `baseProjectId` int(11) DEFAULT '0',
          `instructorFirstName` VARCHAR(255),
          `instructorLastName` VARCHAR(255),
          `instructorPhone` VARCHAR(255),
          `level` VARCHAR(255),
          `difficulty` VARCHAR(255),
          `classDescription` TEXT,
          `imageId` int(11) DEFAULT '0',
          `price` DECIMAL(9,2) DEFAULT 0.00,
          `facility` VARCHAR(255),
          `address` VARCHAR(255),
          `room` VARCHAR(255),
          `city` VARCHAR(255),
          `state` VARCHAR(2),
          `zip` VARCHAR(10),
          `schedule` JSON,
		  `active` tinyint(1) DEFAULT FALSE,
		  `classNotes` TEXT NULL DEFAULT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
		CREATE TABLE `TGv1000`.`products` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `name` varchar(255) NOT NULL,
          `baseProjectId` int(11) NOT NULL DEFAULT '0',
          `level` VARCHAR(255) NOT NULL,
          `difficulty` VARCHAR(255) NOT NULL,
          `productDescription` TEXT NULL,
          `imageId` int(11) NOT NULL DEFAULT '0',
          `price` DECIMAL(9,2) NOT NULL DEFAULT 0.00,
          `active` TINYINT(1) NOT NULL DEFAULT FALSE,
		  `videoURL` VARCHAR(255) NOT NULL DEFAULT '',
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
        ALTER TABLE `TGv1000`.`project_tags`
			ADD CONSTRAINT FK_project_tags
            FOREIGN KEY (projectId) REFERENCES projects(id)
            ON DELETE CASCADE;
        
		CREATE TABLE `TGv1000`.`comics` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
          `name` VARCHAR(255) NOT NULL,
          `projectId` int(11) NOT NULL,
          `ordinal` int(11) NOT NULL,
          `thumbnail` VARCHAR(255) NOT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
        ALTER TABLE `TGv1000`.`comics`
			ADD CONSTRAINT FK_comics
            FOREIGN KEY (projectId) REFERENCES projects(id)
            ON DELETE CASCADE;

		CREATE TABLE TGv1000.comiccode (
		  `id` int(11) NOT NULL,
		  `comicId` int(11) NOT NULL,
		  `ordinal` int(11) NOT NULL,
		  `description` text NOT NULL,
		  `JSONsteps` mediumtext NOT NULL,
		  PRIMARY KEY (`id`, `comicId`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		CREATE TABLE `TGv1000`.`types` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
          `name` varchar(255) NOT NULL,
          `projectId` int(11) NULL,
		  `comicId` int(11) NULL,
          `ordinal` int(11) NULL,
          `ownedByUserId` int(11) NULL,
		  `public` tinyint(1) NOT NULL DEFAULT '0',
		  `quarantined` tinyint(1) NOT NULL DEFAULT '0',
          `isApp` tinyint(1) NOT NULL DEFAULT '0',
          `imageId` int(11) NOT NULL DEFAULT '0',
          `altImagePath` varchar(255) NOT NULL DEFAULT '',
          `description` mediumtext NULL,
          `parentTypeId` INT(11) NULL,
          `parentPrice` DECIMAL(9,2) NOT NULL DEFAULT 0.00,
          `priceBump` DECIMAL(9,2) NOT NULL DEFAULT 0.00,
          `baseTypeId` int(11) NULL,
          `isToolStrip` tinyint(1) NOT NULL DEFAULT '0',
		  PRIMARY KEY (`id`),
          INDEX idx_comicId (comicId)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
        ALTER TABLE `TGv1000`.`types`
			ADD CONSTRAINT FK_types
            FOREIGN KEY (comicId) REFERENCES comics(id)
            ON DELETE CASCADE;

		CREATE TABLE `TGv1000`.`type_tags` (
		  `typeId` int(11) NOT NULL,
		  `tagId` int(11) NOT NULL,
		  PRIMARY KEY (`typeId`,`tagId`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;
        
        ALTER TABLE `TGv1000`.`type_tags`
			ADD CONSTRAINT FK_type_tags
            FOREIGN KEY (typeId) REFERENCES types(id)
            ON DELETE CASCADE;
        
		CREATE TABLE `TGv1000`.`methods` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
          `name` varchar(255) NOT NULL,
		  `typeId` int(11) NOT NULL,
          `ordinal` int(11) NOT NULL,
          `ownedByUserId` int(11) NOT NULL,
		  `public` tinyint(1) NOT NULL DEFAULT '0',
		  `quarantined` tinyint(1) NOT NULL DEFAULT '0',
          `workspace` mediumtext NOT NULL,
          `imageId` INT(11) NOT NULL,
          `description` VARCHAR(255) NULL DEFAULT NULL,
          `parentMethodId` INT(11) NULL,
          `parentPrice` DECIMAL(9,2) NULL DEFAULT 0.00,
          `priceBump` DECIMAL(9,2) NOT NULL DEFAULT 0.00,
          `methodTypeId` int(11) NOT NULL,
          `parameters` MEDIUMTEXT NOT NULL,
		  PRIMARY KEY (`id`),
          INDEX idx_typeId (typeId)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

        ALTER TABLE `TGv1000`.`methods`
			ADD CONSTRAINT FK_methods
            FOREIGN KEY (typeId) REFERENCES types(id)
            ON DELETE CASCADE;

		CREATE TABLE `TGv1000`.`method_tags` (
		  `methodId` int(11) NOT NULL,
		  `tagId` int(11) NOT NULL,
		  PRIMARY KEY (`methodId`,`tagId`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;
        
        ALTER TABLE `TGv1000`.`method_tags`
			ADD CONSTRAINT FK_method_tags
            FOREIGN KEY (methodId) REFERENCES methods(id)
            ON DELETE CASCADE;
        
		CREATE TABLE `TGv1000`.`propertys` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
          `name` varchar(255) NOT NULL,
		  `typeId` int(11) NOT NULL,
          `ordinal` INT(11) NOT NULL,
		  `propertyTypeId` INT(11) NOT NULL DEFAULT 1,
	      `initialValue` MEDIUMTEXT NOT NULL,
          `isHidden` INT(1) NOT NULL DEFAULT '0',
		  PRIMARY KEY (`id`),
          INDEX idx_typeId (typeId)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

        ALTER TABLE `TGv1000`.`propertys`
			ADD CONSTRAINT FK_propertys
            FOREIGN KEY (typeId) REFERENCES types(id)
            ON DELETE CASCADE;

		CREATE TABLE `TGv1000`.`events` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
          `name` varchar(255) NOT NULL,
		  `typeId` int(11) NOT NULL,
          `ordinal` int(11) NOT NULL,
		  PRIMARY KEY (`id`),
          INDEX idx_typeId (typeId)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

        ALTER TABLE `TGv1000`.`events`
			ADD CONSTRAINT FK_events
            FOREIGN KEY (typeId) REFERENCES types(id)
            ON DELETE CASCADE;

		CREATE TABLE `TGv1000`.`resources` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `name` VARCHAR(255) NOT NULL DEFAULT '',
		  `createdByUserId` int(11) NOT NULL,
		  `resourceTypeId` int(11) NOT NULL,
		  `public` tinyint(1) NOT NULL DEFAULT '0',
		  `quarantined` tinyint(1) NOT NULL DEFAULT '0',
		  PRIMARY KEY (`id`),
          INDEX idx_createdByUserId (createdByUserId),
          INDEX idx_resourceTypeId (resourceTypeId)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

		CREATE TABLE `TGv1000`.`resources_tags` (
		  `resourceId` int(11) NOT NULL,
		  `tagId` int(11) NOT NULL,
		  PRIMARY KEY (`resourceId`,`tagId`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;
        
		CREATE TABLE `TGv1000`.`logitems` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `created` datetime DEFAULT CURRENT_TIMESTAMP,
		  `logTypeId` int(11) NOT NULL,
		  `jsoncontext` longtext NOT NULL,
		  `processed` datetime DEFAULT NULL,
		  `processedbyUserId` int(11) DEFAULT NULL,
		  PRIMARY KEY (`id`),
          INDEX idx_logTypeId (logTypeId)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

		CREATE TABLE `TGv1000`.`logTypes` (
		  `id` int(11) NOT NULL,
		  `description` varchar(100) NOT NULL,
		  `severity` tinyint(4) NOT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		CREATE TABLE `TGv1000`.`projectTypes` (
		  `id` int(11) NOT NULL,
		  `description` varchar(100) NOT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		CREATE TABLE `TGv1000`.`methodTypes` (
		  `id` int(11) NOT NULL,
		  `description` varchar(100) NOT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		CREATE TABLE `TGv1000`.`propertyTypes` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `description` varchar(255) NOT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
		CREATE TABLE `TGv1000`.`resourceTypes` (
		  `id` int(11) NOT NULL,
		  `description` varchar(255) NOT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;
        
		CREATE TABLE `TGv1000`.`routes` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `path` varchar(255) NOT NULL,
		  `moduleName` varchar(255) NOT NULL,
		  `route` varchar(255) NOT NULL,
		  `verb` varchar(255) NOT NULL,
		  `method` varchar(255) NOT NULL,
		  `requiresJWT` tinyint(1) NOT NULL DEFAULT '1',
		  `JWTerrorMsg` varchar(255) NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

		CREATE TABLE `TGv1000`.`user` (
		  `id` INT NOT NULL AUTO_INCREMENT,
		  `userName` VARCHAR(45) NOT NULL,	/* an e-mail address */
		  `firstName` VARCHAR(45) NOT NULL,
		  `lastName` VARCHAR(45) NOT NULL,
		  `pwHash` VARCHAR(16000) NOT NULL,
          `usergroupId` INT(11) NOT NULL,
          `zipcode` CHAR(5) NOT NULL,
          `timezone` MEDIUMTEXT NOT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

        INSERT INTO `TGv1000`.`user` (`id`,`userName`,`firstName`,`lastName`,`pwHash`,`usergroupId`,`zipcode`,`timezone`) VALUES (1,'templates@techgroms.com','System','User','$2a$10$XULC/AcP/94VUb0EdiTG4eIiLI/zaW4n/qcovbRb2/SDTLmoG2BDe',1,'10601','America/New_York');
            
		insert TGv1000.propertyTypes (id,description) values (1,'Number');
		insert TGv1000.propertyTypes (id,description) values (2,'Number range (e.g., 3-27)');
		insert TGv1000.propertyTypes (id,description) values (3,'String');
		insert TGv1000.propertyTypes (id,description) values (4,'Boolean (e.g., true or false)');
		insert TGv1000.propertyTypes (id,description) values (5,'Picklist (e.g., ''John'' or ''Jim'' or ''Paul'' or ''Henry'')');
		insert TGv1000.propertyTypes (id,description) values (6,'Type');

		insert TGv1000.resourceTypes (id,description) values (1,'image');
		insert TGv1000.resourceTypes (id,description) values (2,'sound');
        
		insert TGv1000.projectTypes (id,description) values (1,'game');
		insert TGv1000.projectTypes (id,description) values (2,'console');
		insert TGv1000.projectTypes (id,description) values (3,'website');
		insert TGv1000.projectTypes (id,description) values (4,'hololens');
		insert TGv1000.projectTypes (id,description) values (5,'map');
        
		insert TGv1000.methodTypes (id,description) values (1,'statement');
		insert TGv1000.methodTypes (id,description) values (2,'expression');
		insert TGv1000.methodTypes (id,description) values (3,'initialize');
		insert TGv1000.methodTypes (id,description) values (4,'construct');
        
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT) VALUES ('./modules/BOL/','ValidateBO','/BOL/ValidateBO/UserAuthenticate','post','routeUserAuthenticate',0);        
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT) VALUES ('./modules/BOL/','ValidateBO','/BOL/ValidateBO/NewEnrollment','post','routeNewEnrollment',0);        
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT,JWTerrorMsg) VALUES ('./modules/BOL/','ResourceBO','/BOL/ResourceBO/SaveResource','post','routeSaveResource',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.');
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT,JWTerrorMsg) VALUES ('./modules/BOL/','ResourceBO','/BOL/ResourceBO/SaveURLResource','post','routeSaveURLResource',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.');
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT,JWTerrorMsg) VALUES ('./modules/BOL/','UtilityBO','/BOL/UtilityBO/SearchResources','post','routeSearchResources',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.');
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT,JWTerrorMsg) VALUES ('./modules/BOL/','UtilityBO','/BOL/UtilityBO/SearchProjects','post','routeSearchProjects',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.');
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT,JWTerrorMsg) VALUES ('./modules/BOL/','UtilityBO','/BOL/UtilityBO/SearchTypes','post','routeSearchTypes',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.');
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT,JWTerrorMsg) VALUES ('./modules/BOL/','UtilityBO','/BOL/UtilityBO/SearchMethods','post','routeSearchMethods',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.');
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT,JWTerrorMsg) VALUES ('./modules/BOL/','ProjectBO','/BOL/ProjectBO/SaveProject','post','routeSaveProject',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.');
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT,JWTerrorMsg) VALUES ('./modules/BOL/','ProjectBO','/BOL/ProjectBO/RetrieveProject','post','routeRetrieveProject',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.');
		/*INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT) VALUES ('./modules/BOL/','ValidateBO','/BOL/ValidateBO/RetrieveProjectsForLists','post','routeRetrieveProjectsForLists',0);*/
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT,JWTerrorMsg) VALUES ('./modules/BOL/','ProjectBO','/BOL/ProjectBO/RetrieveType','post','routeRetrieveType',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.');
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT,JWTerrorMsg) VALUES ('./modules/BOL/','ProjectBO','/BOL/ProjectBO/RetrieveMethod','post','routeRetrieveMethod',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.');
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT) VALUES ('./modules/BOL/','ValidateBO','/BOL/ValidateBO/SendPasswordResetEmail','post','routeSendPasswordResetEmail',0);        
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT) VALUES ('./modules/BOL/','ValidateBO','/BOL/ValidateBO/ResetPassword','post','routePasswordReset',0);        

		insert TGv1000.projects (id,`name`,ownedByUserId,description,altImagePath,parentProjectId,parentPrice,priceBump,public,projectTypeId,comicProjectId,isCoreProject)
			VALUES 
				(1,'New Game Project',1,'','media/images/gameProject.png',0,0.00,0.00,1,1,1,TRUE),
				(2,'New Console Project',1,'','media/images/consoleProject.png',0,0.00,0.00,1,2,2,TRUE),
				(3,'New Website Project',1,'','media/images/websiteProject.png',0,0.00,0.00,1,3,3,TRUE),
				(4,'New Hololens Project',1,'','media/images/hololensProject.png',0,0.00,0.00,1,4,4,TRUE),
				(5,'New Map Project',1,'','media/images/mappingProject.png',0,0.00,0.00,1,5,5,TRUE)
                ;
            
		INSERT INTO TGv1000.comics (id, `name`,  projectId, ordinal, thumbnail)
			VALUES 
				(1,'TechGroms Game Project Help',1,0,'tn3.png'),
				(2,'TechGroms Console Project Help',2,0,'tn3.png'),
				(3,'TechGroms Website Project Help',3,0,'tn3.png'),
				(4,'TechGroms Hololens Project Help',4,0,'tn3.png'),
				(5,'TechGroms Map Project Help',5,0,'tn3.png')
				;
            
		/* These system Types will be skipped in initial loads by comicId being null; after being retrieved, they will be recognized by having ordinal set to 10000. */
		insert into TGv1000.`types` (id,`name`,altImagePath,ordinal)
			VALUES 
				(1,'Game Base Type','media/images/gameProject.png',10000),
				(2,'Console Base Type','media/images/consoleProject.png',10000),
				(3,'Website Base Type','media/images/websiteProject.png',10000),
				(4,'Hololens Base Type','media/images/hololensProject.png',10000),
				(5,'Map Base Type','media/images/mappingProject.png',10000)
                ;
            
		insert into TGv1000.`types` (id,`name`,projectId,ownedByUserId,isApp,imageId,ordinal,comicId,description,parentTypeId,parentPrice,priceBump,public,baseTypeId,isToolStrip)
			VALUES 
				(6,'App',1,1,1,0,0,1,'',0,0.00,0.00,1,1,1),
				(7,'App',2,1,1,0,0,2,'',0,0.00,0.00,1,2,1),
				(8,'App',3,1,1,0,0,3,'',0,0.00,0.00,1,3,1),
				(9,'App',4,1,1,0,0,4,'',0,0.00,0.00,1,4,1),
				(10,'App',5,1,1,0,0,5,'',0,0.00,0.00,1,5,1)
                ;
                
		insert TGv1000.methods (id,typeId,ownedByUserId,`name`,ordinal,workspace,imageId,description,parentMethodId,parentPrice,priceBump,public,methodTypeId,parameters)
			VALUES
				(1,6,1,'initialize',0,'<xml xmlns="http://www.w3.org/1999/xhtml"><block type="procedures_defnoreturn"><mutation><arg name="self"></arg></mutation><field name="NAME">initialize</field></block></xml>',0,'',0,0.00,0.00,1,3,''),
				(2,7,1,'initialize',0,'<xml xmlns="http://www.w3.org/1999/xhtml"><block type="procedures_defnoreturn"><mutation><arg name="self"></arg></mutation><field name="NAME">initialize</field></block></xml>',0,'',0,0.00,0.00,1,3,''),
				(3,8,1,'initialize',0,'<xml xmlns="http://www.w3.org/1999/xhtml"><block type="procedures_defnoreturn"><mutation><arg name="self"></arg></mutation><field name="NAME">initialize</field></block></xml>',0,'',0,0.00,0.00,1,3,''),
				(4,9,1,'initialize',0,'<xml xmlns="http://www.w3.org/1999/xhtml"><block type="procedures_defnoreturn"><mutation><arg name="self"></arg></mutation><field name="NAME">initialize</field></block></xml>',0,'',0,0.00,0.00,1,3,''),
				(5,10,1,'initialize',0,'<xml xmlns="http://www.w3.org/1999/xhtml"><block type="procedures_defnoreturn"><mutation><arg name="self"></arg></mutation><field name="NAME">initialize</field></block></xml>',0,'',0,0.00,0.00,1,3,''),
				(6,1,1,'construct',0,'<xml xmlns="http://www.w3.org/1999/xhtml"><block type="procedures_defnoreturn"><mutation><arg name="self"></arg></mutation><field name="NAME">construct</field></block></xml>',0,'',0,0.00,0.00,1,4,''),
				(7,2,1,'construct',0,'<xml xmlns="http://www.w3.org/1999/xhtml"><block type="procedures_defnoreturn"><mutation><arg name="self"></arg></mutation><field name="NAME">construct</field></block></xml>',0,'',0,0.00,0.00,1,4,''),
				(8,3,1,'construct',0,'<xml xmlns="http://www.w3.org/1999/xhtml"><block type="procedures_defnoreturn"><mutation><arg name="self"></arg></mutation><field name="NAME">construct</field></block></xml>',0,'',0,0.00,0.00,1,4,''),
				(9,4,1,'construct',0,'<xml xmlns="http://www.w3.org/1999/xhtml"><block type="procedures_defnoreturn"><mutation><arg name="self"></arg></mutation><field name="NAME">construct</field></block></xml>',0,'',0,0.00,0.00,1,4,''),
				(10,5,1,'construct',0,'<xml xmlns="http://www.w3.org/1999/xhtml"><block type="procedures_defnoreturn"><mutation><arg name="self"></arg></mutation><field name="NAME">construct</field></block></xml>',0,'',0,0.00,0.00,1,4,''),
				(11,6,1,'construct',1,'<xml xmlns="http://www.w3.org/1999/xhtml"><block type="procedures_defnoreturn"><mutation><arg name="self"></arg></mutation><field name="NAME">construct</field></block></xml>',0,'',0,0.00,0.00,1,4,''),
				(12,7,1,'construct',1,'<xml xmlns="http://www.w3.org/1999/xhtml"><block type="procedures_defnoreturn"><mutation><arg name="self"></arg></mutation><field name="NAME">construct</field></block></xml>',0,'',0,0.00,0.00,1,4,''),
				(13,8,1,'construct',1,'<xml xmlns="http://www.w3.org/1999/xhtml"><block type="procedures_defnoreturn"><mutation><arg name="self"></arg></mutation><field name="NAME">construct</field></block></xml>',0,'',0,0.00,0.00,1,4,''),
				(14,9,1,'construct',1,'<xml xmlns="http://www.w3.org/1999/xhtml"><block type="procedures_defnoreturn"><mutation><arg name="self"></arg></mutation><field name="NAME">construct</field></block></xml>',0,'',0,0.00,0.00,1,4,''),
				(15,10,1,'construct',1,'<xml xmlns="http://www.w3.org/1999/xhtml"><block type="procedures_defnoreturn"><mutation><arg name="self"></arg></mutation><field name="NAME">construct</field></block></xml>',0,'',0,0.00,0.00,1,4,'')
			;
           
		/* not going to add X,Y,Width,Height props to the 5+5 initial Types,
           because they can't be dragged onto the Designer.
		insert TGv1000.propertys (id,typeId,`name`,initialValue,ordinal)
			VALUES
				(1,1,'X','0',0),
				(2,1,'Y','0',1),
				(3,1,'Width','0',2),
				(4,1,'Height','0',3)
			;
		*/
            
		/* need resources/tags for every project, type and method */            
        insert TGv1000.tags (id,description)
			VALUES
				(1,'templates@techgroms.com'),
				(2,'project'),
				(3,'new_project'),
                (4,'type'),
                (5,'app'),
                (6,'method'),
                (7,'initialize')
			;
            
		insert TGv1000.project_tags (projectId,tagId)
			VALUES
				(1,2),
				(2,2),
				(3,2),
				(4,2),
				(5,2)
				;
            
		insert TGv1000.type_tags (typeId,tagId)
			VALUES
                (1,4),
                (2,4),
                (3,4),
                (4,4),
                (5,4),
                (6,4),
                (7,4),
                (8,4),
                (9,4),
                (10,4)
                ;
            
		insert TGv1000.method_tags (methodId,tagId)
			VALUES
                (1,6),
                (2,6),
                (3,6),
                (4,6),
                (5,6),
                (6,6),
                (7,6),
                (8,6),
                (9,6),
                (10,6),
                (11,6),
                (12,6),
                (13,6),
                (14,6),
                (15,6)
                ;

		CREATE TABLE TGv1000.usergroups (
		  `id` int(11) NOT NULL,
		  `name` varchar(255) NOT NULL,
		  PRIMARY KEY (id),
		  UNIQUE KEY `id_UNIQUE` (id)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		CREATE TABLE TGv1000.permissions (
		  `id` int(11) NOT NULL,
		  `description` varchar(255) NOT NULL,
		  PRIMARY KEY (id),
		  UNIQUE KEY `id_UNIQUE` (id)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		CREATE TABLE TGv1000.ug_permissions (
		  `usergroupId` int(11) NOT NULL,
		  `permissionId` int(11) NOT NULL,
		  PRIMARY KEY (`usergroupId`, `permissionId`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		INSERT TGv1000.usergroups (`id`, `name`) VALUES (1, 'developer');
		INSERT TGv1000.usergroups (`id`, `name`) VALUES (2, 'instructor');
		INSERT TGv1000.usergroups (`id`, `name`) VALUES (3, 'registered_user');
		INSERT TGv1000.usergroups (`id`, `name`) VALUES (4, 'unregistered_user');

		INSERT TGv1000.permissions (`id`, `description`) VALUES (1, 'can_edit_core_comics');
		INSERT TGv1000.permissions (`id`, `description`) VALUES (2, 'can_edit_system_types');
		INSERT TGv1000.permissions (`id`, `description`) VALUES (3, 'can_make_public');
		INSERT TGv1000.permissions (`id`, `description`) VALUES (4, 'can_visit_adminzone');
		INSERT TGv1000.permissions (`id`, `description`) VALUES (5, 'can_open_free_projects');
		INSERT TGv1000.permissions (`id`, `description`) VALUES (6, 'can_buy_projects');
		INSERT TGv1000.permissions (`id`, `description`) VALUES (7, 'can_create_classes');
		INSERT TGv1000.permissions (`id`, `description`) VALUES (8, 'can_create_products');

		INSERT TGv1000.ug_permissions (usergroupId, permissionId) VALUES (1,1);
		INSERT TGv1000.ug_permissions (usergroupId, permissionId) VALUES (1,2);
		INSERT TGv1000.ug_permissions (usergroupId, permissionId) VALUES (1,3);
		INSERT TGv1000.ug_permissions (usergroupId, permissionId) VALUES (1,4);
		INSERT TGv1000.ug_permissions (usergroupId, permissionId) VALUES (1,5);
		INSERT TGv1000.ug_permissions (usergroupId, permissionId) VALUES (1,6);
		INSERT TGv1000.ug_permissions (usergroupId, permissionId) VALUES (1,7);
		INSERT TGv1000.ug_permissions (usergroupId, permissionId) VALUES (1,8);
		INSERT TGv1000.ug_permissions (usergroupId, permissionId) VALUES (2,3);
		INSERT TGv1000.ug_permissions (usergroupId, permissionId) VALUES (2,4);
		INSERT TGv1000.ug_permissions (usergroupId, permissionId) VALUES (2,5);
		INSERT TGv1000.ug_permissions (usergroupId, permissionId) VALUES (2,6);
		INSERT TGv1000.ug_permissions (usergroupId, permissionId) VALUES (2,7);
		INSERT TGv1000.ug_permissions (usergroupId, permissionId) VALUES (3,5);
		INSERT TGv1000.ug_permissions (usergroupId, permissionId) VALUES (3,6);
		INSERT TGv1000.ug_permissions (usergroupId, permissionId) VALUES (4,5);

		ALTER TABLE `tgv1000`.`projects` 
		ADD COLUMN `isOnlineClass` TINYINT(1) NOT NULL DEFAULT '0' AFTER `isClass`;
        
		CREATE TABLE `TGv1000`.`onlineclasses` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `name` varchar(255),
          `baseProjectId` int(11) DEFAULT '0',
          `instructorFirstName` VARCHAR(255),
          `instructorLastName` VARCHAR(255),
          `instructorEmail` VARCHAR(255),
          `level` VARCHAR(255),
          `difficulty` VARCHAR(255),
          `classDescription` TEXT,
          `imageId` int(11) DEFAULT '0',
          `price` DECIMAL(9,2) DEFAULT 0.00,
          `schedule` JSON,
		  `active` tinyint(1) DEFAULT FALSE,
		  `classNotes` TEXT NULL DEFAULT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
   		INSERT TGv1000.permissions (`id`, `description`) VALUES (9, 'can_create_onlineClasses');
		INSERT TGv1000.ug_permissions (usergroupId, permissionId) VALUES (1,9);
        
        ALTER TABLE `TGv1000`.`classes`
			ADD CONSTRAINT FK_project_classes
            FOREIGN KEY (baseProjectId) REFERENCES projects(id)
            ON DELETE CASCADE;
        
        ALTER TABLE `TGv1000`.`products`
			ADD CONSTRAINT FK_project_products
            FOREIGN KEY (baseProjectId) REFERENCES projects(id)
            ON DELETE CASCADE;
        
        ALTER TABLE `TGv1000`.`onlineclasses`
			ADD CONSTRAINT FK_project_onlineclasses
            FOREIGN KEY (baseProjectId) REFERENCES projects(id)
            ON DELETE CASCADE;
        
        ALTER TABLE `TGv1000`.`comiccode`
			ADD CONSTRAINT FK_comiccode
            FOREIGN KEY (comicId) REFERENCES comics(id)
            ON DELETE CASCADE;

		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT,JWTerrorMsg) VALUES ('./modules/BOL/','UtilityBO','/BOL/UtilityBO/ProcessCharge','post','routeProcessCharge',1,'We encountered a session validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.');
    
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT,JWTerrorMsg) VALUES ('./modules/BOL/','UtilityBO','/BOL/UtilityBO/GetStripePK','post','routeGetStripePK',1,'We encountered a session validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.');
    
		UPDATE control set dbstate=1 where id=1;
        set @dbstate := 1;
    end if;

    if @dbstate = 1 THEN
    
   		INSERT TGv1000.permissions (`id`, `description`) VALUES (10, 'can_edit_permissions');
   		INSERT TGv1000.permissions (`id`, `description`) VALUES (11, 'can_unquarantine');
   		INSERT TGv1000.permissions (`id`, `description`) VALUES (12, 'can_activate_PPs');
		INSERT TGv1000.ug_permissions (usergroupId, permissionId) VALUES (1,10);
		INSERT TGv1000.ug_permissions (usergroupId, permissionId) VALUES (1,11);
		INSERT TGv1000.ug_permissions (usergroupId, permissionId) VALUES (1,12);

		UPDATE control set dbstate=3 where id=1;
        set @dbstate := 3;
    end if;

    if @dbstate = 3 THEN
    
		ALTER TABLE `tgv1000`.`classes` 
			ADD COLUMN `maxClassSize` INT(11) NULL DEFAULT 0 AFTER `classNotes`;

		UPDATE control set dbstate=4 where id=1;
        set @dbstate := 4;
    end if;

    if @dbstate = 4 THEN
    
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT,JWTerrorMsg) VALUES ('./modules/BOL/','UtilityBO','/BOL/UtilityBO/PutUserOnWaitlist','post','routePutUserOnWaitlist',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.');

		CREATE TABLE `TGv1000`.`waitlist` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
          `projectId` VARCHAR(255) NOT NULL,
          `userId` int(11) NOT NULL,
          `userName`  VARCHAR(45),
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

		UPDATE control set dbstate=5 where id=1;
        set @dbstate := 5;
    end if;

    if @dbstate = 5 THEN
    
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT,JWTerrorMsg) VALUES ('./modules/BOL/','ProjectBO','/BOL/ProjectBO/RetrievePurchasableProjectData','post','routeRetrievePurchasableProjectData',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.');

		UPDATE control set dbstate=6 where id=1;
        set @dbstate := 6;
    end if;

    if @dbstate = 6 THEN
    
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT,JWTerrorMsg) VALUES ('./modules/BOL/','ProjectBO','/BOL/ProjectBO/SavePPData','post','routeSavePPData',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.');

		UPDATE control set dbstate=7 where id=1;
        set @dbstate := 7;
    end if;

    if @dbstate = 7 THEN
    
		ALTER TABLE `tgv1000`.`classes` 
		ADD COLUMN `loanComputersAvailable` TINYINT(1) NULL DEFAULT FALSE AFTER `maxClassSize`;

		UPDATE control set dbstate=8 where id=1;
        set @dbstate := 8;
    end if;

    if @dbstate = 8 THEN
    
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT,JWTerrorMsg) VALUES ('./modules/BOL/','UtilityBO','/BOL/UtilityBO/GetAllUserMaintData','post','routeGetAllUserMaintData',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.');

		UPDATE control set dbstate=9 where id=1;
        set @dbstate := 9;
    end if;

    if @dbstate = 9 THEN
    
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT,JWTerrorMsg) VALUES ('./modules/BOL/','UtilityBO','/BOL/UtilityBO/AddPermission','post','routeAddPermission',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.');

		UPDATE control set dbstate=10 where id=1;
        set @dbstate := 10;
    end if;
    
    if @dbstate = 10 THEN
    
		ALTER TABLE `tgv1000`.`permissions` 
		CHANGE COLUMN `id` `id` INT(11) NOT NULL AUTO_INCREMENT ,
		DROP INDEX `id_UNIQUE` ;

		UPDATE control set dbstate=11 where id=1;
        set @dbstate := 11;
    end if;
    
    if @dbstate = 11 THEN
    
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT,JWTerrorMsg) VALUES ('./modules/BOL/','UtilityBO','/BOL/UtilityBO/AddUsergroup','post','routeAddUsergroup',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.');
		ALTER TABLE `tgv1000`.`usergroups` 
		CHANGE COLUMN `id` `id` INT(11) NOT NULL AUTO_INCREMENT ;

		UPDATE control set dbstate=12 where id=1;
        set @dbstate := 12;
    end if;
    
    if @dbstate = 12 THEN
    
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT,JWTerrorMsg) VALUES ('./modules/BOL/','UtilityBO','/BOL/UtilityBO/UpdateUserUsergroup','post','routeUpdateUserUsergroup',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.');

		UPDATE control set dbstate=13 where id=1;
        set @dbstate := 13;
    end if;
    
    if @dbstate = 13 THEN
    
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT,JWTerrorMsg) VALUES ('./modules/BOL/','UtilityBO','/BOL/UtilityBO/UpdateUgPermissions','post','routeUpdateUgPermissions',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.');

		UPDATE control set dbstate=14 where id=1;
        set @dbstate := 14;
    end if;
    
    if @dbstate = 14 THEN
    
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT,JWTerrorMsg) VALUES ('./modules/BOL/','UtilityBO','/BOL/UtilityBO/GetPPBuyers','post','routeGetPPBuyers',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.');

		UPDATE control set dbstate=15 where id=1;
        set @dbstate := 15;
    end if;
    
    if @dbstate = 15 THEN
    
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT,JWTerrorMsg) VALUES ('./modules/BOL/','UtilityBO','/BOL/UtilityBO/UndoPurchase','post','routeUndoPurchase',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.');
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,requiresJWT,JWTerrorMsg) VALUES ('./modules/BOL/','UtilityBO','/BOL/UtilityBO/SendClassInvite','post','routeSendClassInvite',1,'We encountered a validation error. Please try one more time. If you receive this message again, re-login and retry. Sorry.');

		UPDATE control set dbstate=16 where id=1;
        set @dbstate := 16;
    end if;
    
    if @dbstate = 16 THEN
    
		ALTER TABLE `tgv1000`.`waitlist` 
			ADD COLUMN `dtWaitlisted` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `userName`,
			ADD COLUMN `dtInvited` DATETIME NULL AFTER `dtWaitlisted`;

		ALTER TABLE `tgv1000`.`projects` 
			ADD COLUMN `chargeId` VARCHAR(255) NULL DEFAULT '' AFTER `lastSaved`;
    
		UPDATE control set dbstate=17 where id=1;
        set @dbstate := 17;
    end if;
    
end//


-- Execute the procedure
call maintainDB()//

-- Drop the procedure.
drop procedure maintainDB;//

delimiter ;
select * from control;
