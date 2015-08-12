
CREATE SCHEMA IF NOT EXISTS `TGv1000`;
USE TGv1000;

delimiter //

create procedure maintainDB()

begin

	set @cnt := (select count(*) from information_schema.tables where table_schema = 'TGv1000' and table_name = 'control');

	if @cnt = 0 THEN

		CREATE TABLE `TGv1000`.`control` (
          `id` tinyint NOT NULL,
		  `dbstate` decimal(5,2) NOT NULL
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		insert `TGv1000`.`control` (id, dbstate) values (1, 0.0);
        
	end if;
    set @dbstate := (select dbstate from `TGv1000`.`control` where id = 1);
    
    if @dbstate = 0.0 THEN
    
		CREATE TABLE `TGv1000`.`tags` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `description` varchar(255) NOT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
		CREATE TABLE `TGv1000`.`projects` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `name` varchar(255) NOT NULL,
          `ownedByUserId` int(11) NOT NULL,
		  `public` tinyint(1) NOT NULL DEFAULT '0',
		  `quarantined` tinyint(1) NOT NULL DEFAULT '0',
          `description` VARCHAR(255) NULL,
          `imageId` int(11) NOT NULL,
          `isProduct` TINYINT(1) NOT NULL,
          `parentProjectId` INT(11) NULL,
          `parentPrice` DECIMAL(9,2) NOT NULL DEFAULT 0.00,
          `priceBump` DECIMAL(9,2) NOT NULL DEFAULT 0.00,
		  PRIMARY KEY (`id`),
          INDEX idx_ownedByUserId (ownedByUserId)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
		CREATE TABLE `TGv1000`.`project_tags` (
		  `projectId` int(11) NOT NULL,
		  `tagId` int(11) NOT NULL,
		  PRIMARY KEY (`projectId`,`tagId`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;
        
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
          `url` VARCHAR(255) NOT NULL,
		  PRIMARY KEY (`id`),
          INDEX idx_projectId (projectId)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
        ALTER TABLE `TGv1000`.`comics`
			ADD CONSTRAINT FK_comics
            FOREIGN KEY (projectId) REFERENCES projects(id)
            ON DELETE CASCADE;

		CREATE TABLE `TGv1000`.`types` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
          `name` varchar(255) NOT NULL,
		  `comicId` int(11) NOT NULL,
          `ordinal` int(11) NOT NULL,
          `ownedByUserId` int(11) NOT NULL,
		  `public` tinyint(1) NOT NULL DEFAULT '0',
		  `quarantined` tinyint(1) NOT NULL DEFAULT '0',
          `isApp` tinyint(1) NOT NULL DEFAULT '0',
          `imageId` int(11) NOT NULL,
          `description` mediumtext NULL,
          `parentTypeId` INT(11) NULL,
          `parentPrice` DECIMAL(9,2) NOT NULL DEFAULT 0.00,
          `priceBump` DECIMAL(9,2) NOT NULL DEFAULT 0.00,
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
		  `logtypeId` int(11) NOT NULL,
		  `jsoncontext` longtext NOT NULL,
		  `processed` datetime DEFAULT NULL,
		  `processedbyUserId` int(11) DEFAULT NULL,
		  PRIMARY KEY (`id`),
          INDEX idx_logtypeId (logtypeId)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

		CREATE TABLE `TGv1000`.`logtypes` (
		  `id` int(11) NOT NULL,
		  `description` varchar(100) NOT NULL,
		  `severity` tinyint(4) NOT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		CREATE TABLE `TGv1000`.`parent` (
		  `id` INT NOT NULL AUTO_INCREMENT,
		  `email` VARCHAR(45) NOT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
		CREATE TABLE `TGv1000`.`propertyTypes` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `description` varchar(255) NOT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
		CREATE TABLE `TGv1000`.`resourceTypes` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `description` varchar(255) NOT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
		CREATE TABLE `TGv1000`.`routes` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `path` varchar(255) NOT NULL,
		  `moduleName` varchar(255) NOT NULL,
		  `route` varchar(255) NOT NULL,
		  `verb` varchar(255) NOT NULL,
		  `method` varchar(255) NOT NULL,
		  `inuse` tinyint(1) NOT NULL DEFAULT '1',
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

		CREATE TABLE `TGv1000`.`user` (
		  `id` INT NOT NULL AUTO_INCREMENT,
		  `userName` VARCHAR(45) NOT NULL,
		  `pwHash` VARCHAR(16000) NOT NULL,
          `parentId` INT(11) NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
		INSERT INTO `TGv1000`.`parent` (id, email) VALUES (1,'techgroms@gmail.com');
        
        INSERT INTO `TGv1000`.`user` (`id`,`userName`,`pwHash`,`parentId`) VALUES (1,'templates@techgroms.com','$2a$10$XULC/AcP/94VUb0EdiTG4eIiLI/zaW4n/qcovbRb2/SDTLmoG2BDe',1);
            
		insert TGv1000.propertyTypes (id,description) values (1,'Number');
		insert TGv1000.propertyTypes (id,description) values (2,'Number range (e.g., 3-27)');
		insert TGv1000.propertyTypes (id,description) values (3,'String');
		insert TGv1000.propertyTypes (id,description) values (4,'Boolean (e.g., true or false)');
		insert TGv1000.propertyTypes (id,description) values (5,'Picklist (e.g., ''John'' or ''Jim'' or ''Paul'' or ''Henry'')');
		insert TGv1000.propertyTypes (id,description) values (6,'Type');

		insert TGv1000.resourceTypes (id,description) values (1,'image');
		insert TGv1000.resourceTypes (id,description) values (2,'sound');

		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,inuse) VALUES ('./modules/BOL/','ValidateBO','/BOL/ValidateBO/UserAuthenticate','post','routeUserAuthenticate',1);        
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,inuse) VALUES ('./modules/BOL/','ValidateBO','/BOL/ValidateBO/NewEnrollment','post','routeNewEnrollment',1);        
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,inuse) VALUES ('./modules/BOL/','ValidateBO','/BOL/ValidateBO/ForgotPassword','post','routeForgotPassword',1);        
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,inuse) VALUES ('./modules/BOL/','ResourceBO','/BOL/ResourceBO/SaveResource','post','routeSaveResource',1);
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,inuse) VALUES ('./modules/BOL/','ResourceBO','/BOL/ResourceBO/SaveURLResource','post','routeSaveURLResource',1);
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,inuse) VALUES ('./modules/BOL/','UtilityBO','/BOL/UtilityBO/SearchResources','post','routeSearchResources',1);
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,inuse) VALUES ('./modules/BOL/','UtilityBO','/BOL/UtilityBO/SearchProjects','post','routeSearchProjects',1);
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,inuse) VALUES ('./modules/BOL/','UtilityBO','/BOL/UtilityBO/SearchTypes','post','routeSearchTypes',1);
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,inuse) VALUES ('./modules/BOL/','UtilityBO','/BOL/UtilityBO/SearchMethods','post','routeSearchMethods',1);
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,inuse) VALUES ('./modules/BOL/','ProjectBO','/BOL/ProjectBO/SaveProject','post','routeSaveProject',1);
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,inuse) VALUES ('./modules/BOL/','ProjectBO','/BOL/ProjectBO/RetrieveProject','post','routeRetrieveProject',1);
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,inuse) VALUES ('./modules/BOL/','ProjectBO','/BOL/ProjectBO/RetrieveType','post','routeRetrieveType',1);
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,inuse) VALUES ('./modules/BOL/','ProjectBO','/BOL/ProjectBO/RetrieveMethod','post','routeRetrieveMethod',1);
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,inuse) VALUES ('./modules/BOL/','ProjectBO','/BOL/ProjectBO/RetrieveCountUsersProjects','post','routeRetrieveCountUsersProjects',1);

        UPDATE `TGv1000`.`control` set dbstate=1.0 where id=1;
		set @dbstate := 1.0;
    end if;

    if @dbstate = 1.0 THEN
    
		insert TGv1000.projects (id,`name`,ownedByUserId,description,imageId,isProduct,parentProjectId,parentPrice,priceBump,public)
			VALUES (1,'New Project',1,'',0,1,0,0.00,0.00,1);
            
		INSERT INTO TGv1000.comics (id, projectId, ordinal, thumbnail, `name`, url)
			VALUES (1,1,0,'tn3.png','TechGroms Help','http://www.techgroms.com');
            
		insert into TGv1000.`types` (id,`name`,ownedByUserId,isApp,imageId,ordinal,comicId,description,parentTypeId,parentPrice,priceBump,public)
			VALUES (1,'App',1,1,0,0,1,'',0,0.00,0.00,1);
            
		insert TGv1000.methods (id,typeId,ownedByUserId,`name`,ordinal,workspace,imageId,description,parentMethodId,parentPrice,priceBump,public)
			VALUES
				(1,1,1,'initialize',0,'',0,'',0,0.00,0.00,1)
			;
            
		insert TGv1000.propertys (id,typeId,`name`,initialValue,ordinal)
			VALUES
				(1,1,'X','0',0),
				(2,1,'Y','0',1),
				(3,1,'Width','0',2),
				(4,1,'Height','0',3)
			;
            
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
				(1,1),
				(1,2),
				(1,3);
            
		insert TGv1000.type_tags (typeId,tagId)
			VALUES
                (1,1),
                (1,5),
                (1,4);
            
		insert TGv1000.method_tags (methodId,tagId)
			VALUES
                (1,1),
                (1,6),
                (1,7);
		
        UPDATE `TGv1000`.`control` set dbstate=2.0 where id=1;
		set @dbstate := 2.0;
    end if;

    if @dbstate = 2.0 THEN

    	/* The project added in @dbstate = 1.0 is more or less permanent. What follows is test data. */

		/* Adding 2 more projects: a multi-comic product and a user-owned enhanced version of it. */    
        /* start with id=2 */
		insert TGv1000.projects (id,`name`,ownedByUserId,description,imageId,isProduct,parentProjectId,parentPrice,priceBump,public)
			VALUES
				(2,'Mission to Mars',1,'In this project you will create....',0,1,0,0.00,12.00,1),
				(3,'Mission to Mars enhanced',2,'Did some work on MtM.',0,0,2,12.00,0.00,1),
				(4,'Another enhanced MtM',3,'Other work on MtM.',0,0,2,12.00,0.00,1)
			;
            
        /* need same comics for project 2 and 3: 'how to' and 2 more */
        /* start with id=2 */
        /* Using tn3.png for all, because its a nice aspect ratio. */
		INSERT INTO TGv1000.comics (id, projectId, ordinal, thumbnail, `name`, url)
			VALUES 
				(2,2,0,'tn3.png','MtM: How to TechGrom','http://www.techgroms.com'),
				(3,2,1,'tn3.png','MTM: Step 1','http://www.bing.com'),
				(4,2,2,'tn3.png','MTM: Step 2','http://www.microsoft.com'),
				(5,3,0,'tn3.png','MtM: How to TechGrom','http://www.techgroms.com'),
				(6,3,1,'tn3.png','MTM: Step 1','http://www.bing.com'),
				(7,3,2,'tn3.png','MTM: Step 2','http://www.microsoft.com'),
				(8,4,0,'tn3.png','MtM: How to TechGrom','http://www.techgroms.com'),
				(9,4,1,'tn3.png','MTM: Step 1','http://www.bing.com'),
				(10,4,2,'tn3.png','MTM: Step 2','http://www.microsoft.com')
			;
            
        /* need at least an App type for each comic (although not sure about the 'how to' comic) */
        /* start with id=2 */
		insert into TGv1000.`types` (id,`name`,ownedByUserId,isApp,imageId,ordinal,comicId,description,parentTypeId,parentPrice,priceBump,public)
			VALUES
				(2,'App',1,1,0,0,2,'App type',0,0,0,1),
				(3,'App',1,1,0,0,3,'App type',0,0,0,1),
				(4,'App',1,1,0,0,4,'App type',0,0,0,1),
				(5,'App',2,1,0,0,5,'App type',0,0,0,1),
				(6,'App',2,1,0,0,6,'App type',0,0,0,1),
				(7,'App',2,1,0,0,7,'App type',0,0,0,1),
				(8,'App',3,1,0,0,8,'App type',0,0,0,1),
				(9,'App',3,1,0,0,9,'App type',0,0,0,1),
				(10,'App',3,1,0,0,10,'App type',0,0,0,1)
			;
            
		/* need at least an 'initialize' method for each App type */
		/* start with id=2 */         
		insert TGv1000.methods (id,typeId,ownedByUserId,`name`,ordinal,workspace,imageId,description,parentMethodId,parentPrice,priceBump,public)
			VALUES
				(2,2,1,'initialize',0,'',0,'',0,0.00,0.00,1),
				(3,3,1,'initialize',0,'',0,'',0,0.00,0.00,1),
				(4,4,1,'initialize',0,'',0,'',0,0.00,0.00,1),
				(5,5,2,'initialize',0,'',0,'',0,0.00,0.00,1),
				(6,6,2,'initialize',0,'',0,'',0,0.00,0.00,1),
				(7,7,2,'initialize',0,'',0,'',0,0.00,0.00,1),
				(8,8,3,'initialize',0,'',0,'',0,0.00,0.00,1),
				(9,9,3,'initialize',0,'',0,'',0,0.00,0.00,1),
				(10,10,3,'initialize',0,'',0,'',0,0.00,0.00,1)
			;
            
        /* need 4 properties for each type: X, Y, Width, Height */
        /* start with id=5 */
		insert TGv1000.propertys (id,typeId,`name`,initialValue,ordinal)
			VALUES
				(5,2,'X','0',0),
				(6,2,'Y','0',1),
				(7,2,'Width','0',2),
				(8,2,'Height','0',3),
				(9,3,'X','0',0),
				(10,3,'Y','0',1),
				(11,3,'Width','0',2),
				(12,3,'Height','0',3),
				(13,4,'X','0',0),
				(14,4,'Y','0',1),
				(15,4,'Width','0',2),
				(16,4,'Height','0',3),
				(17,5,'X','0',0),
				(18,5,'Y','0',1),
				(19,5,'Width','0',2),
				(20,5,'Height','0',3),
				(21,6,'X','0',0),
				(22,6,'Y','0',1),
				(23,6,'Width','0',2),
				(24,6,'Height','0',3),
				(25,7,'X','0',0),
				(26,7,'Y','0',1),
				(27,7,'Width','0',2),
				(28,7,'Height','0',3),
				(29,8,'X','0',0),
				(30,8,'Y','0',1),
				(31,8,'Width','0',2),
				(32,8,'Height','0',3),
				(33,9,'X','0',0),
				(34,9,'Y','0',1),
				(35,9,'Width','0',2),
				(36,9,'Height','0',3),
				(37,10,'X','0',0),
				(38,10,'Y','0',1),
				(39,10,'Width','0',2),
				(40,10,'Height','0',3)
			;

		/* add an event just for the heck of it */
		/* start with id=1 since we didn't create one before */
		insert TGv1000.events (id,typeId,`name`,ordinal)
			VALUES
				(1,3,'event1',0)
			;
            
        /* need tags to link to every resource: userName, resourceType, resource name + optional tags */
        /* tags are all lower case and have spaces replaced by '_' */
        /* start with id=8 */
        insert TGv1000.tags (id,description)
			VALUES
				(8,'jerry@rubintech.com'),
				(9,'mission_to_mars'),
				(10,'mission_to_mars_enhanced'),
				(11,'a'),
				(12,'b'),
				(13,'c'),
				(14,'d'),
				(15,'e'),
				(16,'f'),
				(17,'g'),
				(18,'h'),
				(19,'i'),
				(20,'j'),
				(21,'k'),
				(22,'l'),
                (23,'misc@abc.com'),
                (24,'another_enhanced_mtm')
			;
            
		insert TGv1000.project_tags (projectId,tagId)
			VALUES
				(2,1),
				(2,2),
				(2,9),
				(3,8),
				(3,2),
				(3,10),
                (4,23),
                (4,2),
                (4,24)
                ;
            
		insert TGv1000.type_tags (typeId,tagId)
			VALUES
				(2,4),(2,1),(2,5),
				(3,4),(3,1),(3,5),
				(4,4),(4,1),(4,5),
				(5,4),(5,8),(5,5),
				(6,4),(6,8),(6,5),
				(7,4),(7,8),(7,5),
				(8,4),(8,23),(8,5),
				(9,4),(9,23),(9,5),
				(10,4),(10,23),(10,5)
                ;
            
		insert TGv1000.method_tags (methodId,tagId)
			VALUES
				(2,6),(2,1),(2,7),
				(3,6),(3,1),(3,7),
				(4,6),(4,1),(4,7),
				(5,6),(5,8),(5,7),
				(6,6),(6,8),(6,7),
                (7,6),(7,8),(7,7),
				(8,6),(8,23),(8,7),
				(9,6),(9,23),(9,7),
                (10,6),(10,23),(10,7)
                ;
		
        UPDATE `TGv1000`.`control` set dbstate=3.0 where id=1;
		set @dbstate := 3.0;
    end if;

    if @dbstate = 333.0 THEN


        UPDATE `TGv1000`.`control` set dbstate=4.0 where id=1;
		set @dbstate := 4.0;
    end if;

end;

//

delimiter ;

-- Execute the procedure
call maintainDB();

-- Drop the procedure.
drop procedure maintainDB;
