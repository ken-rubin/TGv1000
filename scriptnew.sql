
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
    
		CREATE TABLE `TGv1000`.`comics` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `projectId` int(11) NOT NULL,
          `ordinal` int(11) NOT NULL,
          `thumbnail` VARCHAR(255) NOT NULL,
          `name` VARCHAR(255) NOT NULL,
          `url` VARCHAR(255) NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

		CREATE TABLE `TGv1000`.`events` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `typeId` int(11) NOT NULL,
          `name` varchar(255) NOT NULL,
          `ordinal` int(11) NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

		CREATE TABLE `TGv1000`.`logitems` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `created` datetime DEFAULT CURRENT_TIMESTAMP,
		  `logtypeId` int(11) NOT NULL,
		  `jsoncontext` longtext NOT NULL,
		  `processed` datetime DEFAULT NULL,
		  `processedbyUserId` int(11) DEFAULT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

		CREATE TABLE `TGv1000`.`logtypes` (
		  `id` int(11) NOT NULL,
		  `description` varchar(100) NOT NULL,
		  `severity` tinyint(4) NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

		CREATE TABLE `TGv1000`.`methods` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `typeId` int(11) NOT NULL,
          `name` varchar(255) NOT NULL,
          `ordinal` int(11) NOT NULL,
          `workspace` mediumtext NOT NULL,
          `imageId` INT(11) NOT NULL,
          `description` VARCHAR(255) NULL DEFAULT NULL,
          `parentMethodId` INT(11) NULL,
          `parentPrice` DECIMAL(9,2) NULL DEFAULT 0.00,
          `priceBump` DECIMAL(9,2) NOT NULL DEFAULT 0.00,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

		CREATE TABLE `TGv1000`.`parent` (
		  `id` INT NOT NULL AUTO_INCREMENT,
		  `email` VARCHAR(45) NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (id)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
		CREATE TABLE `TGv1000`.`projects` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `name` varchar(255) NOT NULL,
          `ownedByUserId` int(11) NOT NULL,
          `description` VARCHAR(255) NULL,
          `imageId` int(11) NOT NULL,
          `isProduct` TINYINT(1) NOT NULL,
          `parentProjectId` INT(11) NULL,
          `parentPrice` DECIMAL(9,2) NOT NULL DEFAULT 0.00,
          `priceBump` DECIMAL(9,2) NOT NULL DEFAULT 0.00,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
		CREATE TABLE `TGv1000`.`propertys` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `typeId` int(11) NOT NULL,
          `name` varchar(255) NOT NULL,
          `initialValue` MEDIUMTEXT NOT NULL,
          `ordinal` INT(11) NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

		CREATE TABLE `TGv1000`.`propertyTypes` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `description` varchar(255) NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
		CREATE TABLE `TGv1000`.`resources` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `name` VARCHAR(255) NOT NULL DEFAULT '',
		  `createdByUserId` int(11) NOT NULL,
		  `resourceTypeId` int(11) NOT NULL,
		  `public` tinyint(1) NOT NULL DEFAULT '0',
		  `quarantined` tinyint(1) NOT NULL DEFAULT '0',
		  `optionalFK` INT(11) NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

		CREATE TABLE `TGv1000`.`resources_tags` (
		  `resourceId` int(11) NOT NULL,
		  `tagId` int(11) NOT NULL,
		  PRIMARY KEY (`resourceId`,`tagId`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;
        
		CREATE TABLE `TGv1000`.`resourceTypes` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `description` varchar(255) NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
		CREATE TABLE `TGv1000`.`routes` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `path` varchar(255) NOT NULL,
		  `moduleName` varchar(255) NOT NULL,
		  `route` varchar(255) NOT NULL,
		  `verb` varchar(255) NOT NULL,
		  `method` varchar(255) NOT NULL,
		  `inuse` tinyint(1) NOT NULL DEFAULT '1',
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

		CREATE TABLE `TGv1000`.`tags` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `description` varchar(255) NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
		CREATE TABLE `TGv1000`.`types` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
          `name` varchar(255) NOT NULL,
          `isApp` tinyint(1) NOT NULL DEFAULT '0',
          `imageId` int(11) NOT NULL,
          `ordinal` int(11) NOT NULL,
		  `comicId` int(11) NOT NULL,
          `description` mediumtext NULL,
          `parentTypeId` INT(11) NULL,
          `parentPrice` DECIMAL(9,2) NOT NULL DEFAULT 0.00,
          `priceBump` DECIMAL(9,2) NOT NULL DEFAULT 0.00,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

		CREATE TABLE `TGv1000`.`user` (
		  `id` INT NOT NULL AUTO_INCREMENT,
		  `userName` VARCHAR(45) NOT NULL,
		  `pwHash` VARCHAR(16000) NOT NULL,
          `parentId` INT(11) NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (id)
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
		insert TGv1000.resourceTypes (id,description) values (3,'project');
        INSERT TGv1000.resourceTypes values (4, 'classOrProduct');
        INSERT TGv1000.resourceTypes values (5, 'type');
        INSERT TGv1000.resourceTypes values (6, 'unused');
		INSERT `TGv1000`.`resourceTypes` values (7,'method');

		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,inuse) VALUES ('./modules/BOL/','ValidateBO','/BOL/ValidateBO/UserAuthenticate','post','routeUserAuthenticate',1);        
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,inuse) VALUES ('./modules/BOL/','ValidateBO','/BOL/ValidateBO/NewEnrollment','post','routeNewEnrollment',1);        
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,inuse) VALUES ('./modules/BOL/','ValidateBO','/BOL/ValidateBO/ForgotPassword','post','routeForgotPassword',1);        
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,inuse) VALUES ('./modules/BOL/','ResourceBO','/BOL/ResourceBO/SaveResource','post','routeSaveResource',1);
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,inuse) VALUES ('./modules/BOL/','ResourceBO','/BOL/ResourceBO/SaveURLResource','post','routeSaveURLResource',1);
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,inuse) VALUES ('./modules/BOL/','UtilityBO','/BOL/UtilityBO/Search','post','routeSearch',1);
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,inuse) VALUES ('./modules/BOL/','ProjectBO','/BOL/ProjectBO/SaveProject','post','routeSaveProject',1);
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,inuse) VALUES ('./modules/BOL/','ProjectBO','/BOL/ProjectBO/RetrieveProject','post','routeRetrieveProject',1);
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,inuse) VALUES ('./modules/BOL/','ProjectBO','/BOL/ProjectBO/RetrieveType','post','routeRetrieveType',1);
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,inuse) VALUES ('./modules/BOL/','ProjectBO','/BOL/ProjectBO/RetrieveMethod','post','routeRetrieveMethod',1);
		INSERT INTO TGv1000.routes (path,moduleName,route,verb,method,inuse) VALUES ('./modules/BOL/','ProjectBO','/BOL/ProjectBO/RetrieveCountUsersProjects','post','routeRetrieveCountUsersProjects',1);

        UPDATE `TGv1000`.`control` set dbstate=1.0 where id=1;
		set @dbstate := 1.0;
    end if;

    if @dbstate = 1.0 THEN
    
		insert TGv1000.projects (id,`name`,ownedByUserId,description,imageId,isProduct,parentProjectId,parentPrice,priceBump)
			VALUES (1,'New Project',1,'',0,0,0,0.00,0.00);
            
		INSERT INTO TGv1000.comics (id, projectId, ordinal, thumbnail, `name`, url)
			VALUES (1,1,0,'tn3.png','TechGroms Help','http://www.techgroms.com');
            
		insert into TGv1000.`types` (id,`name`,isApp,imageId,ordinal,comicId,description,parentTypeId,parentPrice,priceBump)
			VALUES (1,'App',1,0,0,1,'',0,0.00,0.00);
            
		insert TGv1000.resources (id,`name`,createdByUserId,resourceTypeId,public,quarantined,optionalFK)
			VALUES 
				(1,'New Project',1,3,1,0,1),
                (2,'App',1,5,1,0,1),
                (3,'initialize',1,7,1,0,1);
            
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
            
		insert TGv1000.resources_tags (resourceId,tagId)
			VALUES
				(1,1),
				(1,2),
				(1,3),
                (2,1),
                (2,5),
                (2,4),
                (3,1),
                (3,6),
                (3,7);
		
		insert TGv1000.propertys (id,typeId,`name`,initialValue,ordinal)
			VALUES
				(1,1,'X','0',0),
				(2,1,'Y','0',1),
				(3,1,'Width','0',2),
				(4,1,'Height','0',3)
			;
            
		insert TGv1000.methods (id,typeId,`name`,ordinal,workspace,imageId,description,parentMethodId,parentPrice,priceBump)
			VALUES
				(1,1,'initialize',0,'',0,'',0,0.00,0.00)
			;
            
        UPDATE `TGv1000`.`control` set dbstate=2.0 where id=1;
		set @dbstate := 2.0;
    end if;

    if @dbstate = 12.0 THEN
    
		INSERT INTO TGv1000.comics (id, classOrProductId, ordinal, imageResourceId, `name`)
			VALUES 
				(1,1,0,1,'TechGroms Help'),
				(2,2,0,2,'MtM: How to TechGrom'),
				(3,2,1,3,'MTM: Sessopm 1'),
				(4,2,2,4,'MTM: Sessopm 2')
			;
            
		INSERT INTO TGv1000.comicPanels (id, comicId, ordinal, `name`, url, description, thumbnail)
			VALUES 
				(1,1,0,'FAQs','http://www.techgroms.com','TechGroms FAQs','tn3.png'),
				(2,2,0,'FAQs','http://www.techgroms.com','TechGroms FAQs','tn3.png'),
				(3,3,0,'Step 1','http://www.bing.com','Session 1 Step 1','tn1.png'),
				(4,3,1,'Step 2','http://www.microsoft.com','Session 1 Step 2','tn2.jpg'),
				(5,4,0,'Step 1','http://www.google.com','Session 2 Step 1','tn4.png'),
				(6,4,1,'Step 2','http://www.github.com','Session 2 Step 2','tn5.png'),
				(7,4,2,'Step 3','http://www.sourcetree.com','Session 2 Step 3','tn6.png')
			;
            
		insert into TGv1000.`types` (id,`name`,isApp,imageResourceId,ordinal,comicId,projectId)
			VALUES
				(1,'App',1,0,0,1,1),
				(2,'App',1,0,0,2,2),
				(3,'App',1,0,0,3,3),
				(4,'Type1',0,0,1,3,3),
				(5,'Type2',0,0,2,3,3),
				(6,'App',1,0,0,4,3)
			;
            
		insert TGv1000.resources (id,createdByUserId,resourceTypeId,public,quarantined,optnlFK,`name`)
			VALUES
				(1,1,1,1,0,NULL,'default'),
				(2,1,4,1,0,2,'Mission_to_Mars'),
				(3,1,3,1,0,2,'Mission_to_Mars'),
				(4,1,3,1,0,3,'mine'),
				(5,1,5,1,0,1,'a'),
				(6,1,5,1,0,2,'b'),
				(7,1,5,1,0,3,'c'),
				(8,1,5,1,0,4,'d'),
				(9,1,5,1,0,5,'e'),
				(10,1,5,2,0,6,'f')
			;
            
		insert TGv1000.projects (id,`name`,createdByUserId,price,imageResourceId,description,ownedByUserId,classOrProductId)
			VALUES
				(1,'New Project',1,0,0,NULL,1,1),
				(2,'Mission to Mars',1,13.99,0,'In this project you will create....',1,2),
				(3,'Mission to Mars',1,13.99,0,'Did some work on MtM.',1,2)
			;
		UPDATE `TGv1000`.`projects` set createdByUserId=NULL where id=2;
		UPDATE `TGv1000`.`projects` set parentProjectId=2 where id=3;
            
		insert TGv1000.resources_tags (resourceId,tagId)
			VALUES
				(1,1),
				(1,2),
				(1,3),
				(3,1),
				(3,3),
				(3,5),
				(4,1),
				(4,5),
				(5,1),
				(5,6),
				(6,1),
				(6,6),
				(7,1),
				(7,6),
				(8,1),
				(8,6),
				(9,1),
				(9,6),
				(10,1),
				(10,6)
			;
		
        insert TGv1000.tags (id,description)
			VALUES
				(1,'jerry'),
				(2,'product'),
				(3,'mission_to_mars'),
				(4,'image'),
				(5,'project'),
				(6,'type')
			;
            
		insert TGv1000.propertys (id,typeId,`name`,propertyTypeId,initialValue,ordinal)
			VALUES
				(1,1,'X',1,'0',0),
				(2,1,'Y',1,'0',0),
				(3,1,'Width',1,'0',0),
				(4,1,'Height',1,'0',0),
				(5,2,'X',1,'0',0),
				(6,2,'Y',1,'0',0),
				(7,2,'Width',1,'0',0),
				(8,2,'Height',1,'0',0),
				(9,3,'X',1,'0',0),
				(10,3,'Y',1,'0',0),
				(11,3,'Width',1,'0',0),
				(12,3,'Height',1,'0',0),
				(13,4,'X',1,'0',0),
				(14,4,'Y',1,'0',0),
				(15,4,'Width',1,'0',0),
				(16,4,'Height',1,'0',0),
				(17,5,'X',1,'0',0),
				(18,5,'Y',1,'0',0),
				(19,5,'Width',1,'0',0),
				(20,5,'Height',1,'0',0),
				(21,6,'X',1,'0',0),
				(22,6,'Y',1,'0',0),
				(23,6,'Width',1,'0',0),
				(24,6,'Height',1,'0',0)
			;
            
		insert TGv1000.methods (id,typeId,`name`,ordinal,workspace,imageResourceId,createdByUserId,price,description)
			VALUES
				(1,1,'initialize',0,'',0,1,0,''),
				(2,2,'initialize',0,'',0,1,0,''),
				(3,3,'initialize',0,'',0,1,0,''),
				(4,6,'initialize',0,'',0,1,0,'')
			;
            
		insert TGv1000.events (id,typeId,`name`,ordinal)
			VALUES
				(1,3,'event1',0)
			;
            
		insert TGv1000.resources (id,createdByUserId,resourceTypeId,public,quarantined,optnlFK,`name`)
			VALUES
				(11,1,7,1,0,1,'g'),
				(12,1,7,1,0,2,'h'),
				(13,1,7,1,0,3,'i'),
				(14,1,7,1,0,4,'j')
			;
            
        insert TGv1000.tags (id,description)
			VALUES
				(7,'method')
			;
            
		insert TGv1000.resources_tags (resourceId,tagId)
			VALUES
				(11,1),
                (11,7),
				(12,1),
                (12,7),
				(13,1),
                (13,7),
				(14,1),
                (14,7)
			;

        UPDATE `TGv1000`.`control` set dbstate=3.0 where id=1;
		set @dbstate := 3.0;
    end if;

end;

//

delimiter ;

-- Execute the procedure
call maintainDB();

-- Drop the procedure.
drop procedure maintainDB;
