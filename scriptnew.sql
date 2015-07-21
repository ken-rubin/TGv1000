        CREATE TABLE `TGv1000`.`classOrProduct` (
		  `id` INT NOT NULL AUTO_INCREMENT,
		  `name` VARCHAR(255) NOT NULL,
		  `isProduct` BIT(1) NOT NULL DEFAULT 0,
		  `price` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
		  `createdByUserId` INT NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE INDEX `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
		CREATE TABLE TGv1000.comicPanels (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `comicId` INT(11) NOT NULL,
		  `ordinal` INT(11) NOT NULL,
		  `name` varchar(255) NOT NULL,
  		  `url` varchar(255) NOT NULL,
		  `description` varchar(255) NOT NULL,
		  `thumbnail` varchar(255) NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
    
		CREATE TABLE `TGv1000`.`comics` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `projectId` int(11) NOT NULL,
          `ordinal` int(11) NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
   		ALTER TABLE `TGv1000`.`comics` 
			ADD COLUMN `imageResourceId` INT(11) NOT NULL AFTER `ordinal`;
		ALTER TABLE `TGv1000`.`comics` 
			ADD COLUMN `name` VARCHAR(255) NOT NULL DEFAULT '' AFTER `imageResourceId`;
		ALTER TABLE `TGv1000`.`comics` 
			CHANGE COLUMN `projectId` `classOrProductId` INT(11) NOT NULL ;

		CREATE TABLE `TGv1000`.`events` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `typeId` int(11) NOT NULL,
          `name` varchar(255) NOT NULL,
          `jsonCode` mediumtext NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
		ALTER TABLE `TGv1000`.`events` 
			CHANGE COLUMN `jsonCode` `ordinal` INT(11) NOT NULL ;

		CREATE TABLE `TGv1000`.`logitems` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `created` datetime DEFAULT CURRENT_TIMESTAMP,
		  `logtypeId` int(11) NOT NULL,
		  `jsoncontext` longtext NOT NULL,
		  `processed` datetime DEFAULT NULL,
		  `processedbyUserId` int(11) DEFAULT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=988 DEFAULT CHARSET=utf8;

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
          `jsonCode` mediumtext NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
		ALTER TABLE `TGv1000`.`methods` 
			ADD COLUMN `ordinal` int(11) NOT NULL AFTER `name`;        
        ALTER TABLE `TGv1000`.`methods` 
			CHANGE COLUMN `jsonCode` `workspace` MEDIUMTEXT NOT NULL ,
			ADD COLUMN `imageResourceId` INT(11) NOT NULL AFTER `workspace`,
			ADD COLUMN `createdByUserId` INT(11) NOT NULL AFTER `imageResourceId`,
			ADD COLUMN `price` DECIMAL(5,2) NOT NULL DEFAULT 0.0 AFTER `createdByUserId`,
            ADD COLUMN `description` VARCHAR(255) NULL AFTER `price`;
		ALTER TABLE `TGv1000`.`methods` 
			CHANGE COLUMN `description` `description` VARCHAR(255) NULL DEFAULT NULL AFTER `imageResourceId`,
			CHANGE COLUMN `price` `priceBump` DECIMAL(9,2) NOT NULL DEFAULT '0.00' ,
			ADD COLUMN `parentMethodId` INT(11) NULL AFTER `description`,
			ADD COLUMN `parentPrice` DECIMAL(9,2) NULL DEFAULT 0.00 AFTER `parentMethodId`;

		CREATE TABLE `TGv1000`.`parent` (
		  `id` INT NOT NULL AUTO_INCREMENT,
		  `email` VARCHAR(45) NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (id)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
		CREATE TABLE `TGv1000`.`projects` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `name` varchar(255) NOT NULL,
          `createdByUserId` int(11) NOT NULL,
          `template` tinyint(1) NOT NULL DEFAULT '0',
		  `price` decimal(5,2) NOT NULL DEFAULT '0.00',
          `imageResourceId` int(11) NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
		ALTER TABLE `TGv1000`.`projects` 
			ADD COLUMN `description` VARCHAR(255) NULL AFTER `imageResourceId`;
		ALTER TABLE `TGv1000`.`projects` 
			DROP COLUMN `template`;
		ALTER TABLE `TGv1000`.`projects` 
			ADD COLUMN `ownedByUserId` INT(11) NOT NULL AFTER `description`,
			ADD COLUMN `classOrProductId` INT(11) NOT NULL AFTER `ownedByUserId`;
		ALTER TABLE `TGv1000`.`projects` 
			DROP COLUMN `ownedByUserId`,
			DROP COLUMN `price`,
			ADD COLUMN `parentProjectId` INT(11) NULL AFTER `classOrProductId`,
			ADD COLUMN `parentPrice` DECIMAL(9,2) NOT NULL DEFAULT 0.00 AFTER `parentProjectId`,
			ADD COLUMN `priceBump` DECIMAL(9,2) NOT NULL DEFAULT 0.00 AFTER `createdByUserId`,
			CHANGE COLUMN `createdByUserId` `createdByUserId` INT(11) NULL AFTER `parentPrice`;
        
		CREATE TABLE `TGv1000`.`propertys` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `typeId` int(11) NOT NULL,
          `name` varchar(255) NOT NULL,
          `jsonCode` mediumtext NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
		ALTER TABLE `TGv1000`.`propertys` 
			CHANGE COLUMN `jsonCode` `propertyTypeId` INT(11) NOT NULL ,
			ADD COLUMN `initialValue` MEDIUMTEXT NOT NULL AFTER `propertyTypeId`,
			ADD COLUMN `ordinal` INT(11) NOT NULL AFTER `initialValue`;

		CREATE TABLE `TGv1000`.`propertyTypes` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `description` varchar(255) NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
		CREATE TABLE `TGv1000`.`resources` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `createdByUserId` int(11) NOT NULL,
		  `friendlyName` varchar(255) NOT NULL,
		  `resourceTypeId` int(11) NOT NULL,
		  `public` tinyint(1) NOT NULL DEFAULT '0',
		  `ext` varchar(5) NULL,
		  `quarantined` tinyint(1) NOT NULL DEFAULT '0',
		  `origext` varchar(5) DEFAULT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
		ALTER TABLE `TGv1000`.`resources` 
			AUTO_INCREMENT = 100 ,
			DROP COLUMN `origext`,
			DROP COLUMN `ext`,
			DROP COLUMN `friendlyName`,
			ADD COLUMN `optnlFK` INT(11) NULL AFTER `quarantined`;
		ALTER TABLE `TGv1000`.`resources` 
			ADD COLUMN `name` VARCHAR(255) NOT NULL DEFAULT '' AFTER `optnlFK`;        

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
		) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8;

		CREATE TABLE `TGv1000`.`tags` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `description` varchar(255) NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
		CREATE TABLE `TGv1000`.`types` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `comicId` int(11) NOT NULL,
          `name` varchar(255) NOT NULL,
          `isApp` tinyint(1) NOT NULL DEFAULT '0',
          `imageResourceId` int(11) NOT NULL,
          `ordinal` int(11) NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
   		ALTER TABLE `TGv1000`.`types` 
			ADD COLUMN `jsonCode` MEDIUMTEXT NOT NULL ;
		ALTER TABLE `TGv1000`.`types` 
			DROP COLUMN `comicId`,
			CHANGE COLUMN `jsonCode` `comicId` INT(11) NOT NULL ,
			ADD COLUMN `projectId` INT(11) NOT NULL AFTER `comicId`;
		ALTER TABLE `TGv1000`.`types` 
			ADD COLUMN `parentTypeId` INT(11) NULL AFTER `projectId`,
			ADD COLUMN `parentPrice` DECIMAL(9,2) NOT NULL DEFAULT 0.00 AFTER `parentTypeId`,
			ADD COLUMN `createdByUserId` INT(11) NULL AFTER `parentPrice`,
			ADD COLUMN `priceBump` DECIMAL(9,2) NOT NULL DEFAULT 0.00 AFTER `createdByUserId`;

		CREATE TABLE `TGv1000`.`user` (
		  `id` INT NOT NULL AUTO_INCREMENT,
		  `userName` VARCHAR(45) NOT NULL,
		  `pwHash` VARCHAR(16000) NOT NULL,
          `parentId` INT(11) NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (id)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
        INSERT INTO `TGv1000`.`user`
			(`id`,`userName`,`pwHash`,`parentId`)
			VALUES
			(1,'techgroms@gmail.com','$2a$10$XULC/AcP/94VUb0EdiTG4eIiLI/zaW4n/qcovbRb2/SDTLmoG2BDe',NULL);
        
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

		INSERT INTO TGv1000.routes VALUES (1,'./modules/BOL/','ValidateBO','/BOL/ValidateBO/UserAuthenticate','post','routeUserAuthenticate',1);        
		INSERT INTO TGv1000.routes VALUES (67,'./modules/BOL/','ValidateBO','/BOL/ValidateBO/NewEnrollment','post','routeNewEnrollment',1);        
		INSERT INTO TGv1000.routes VALUES (133,'./modules/BOL/','ValidateBO','/BOL/ValidateBO/ForgotPassword','post','routeForgotPassword',1);        
		INSERT INTO TGv1000.routes (path, moduleName, route, verb, method, inuse)
			VALUES ('./modules/BOL/','ResourceBO','/BOL/ResourceBO/SaveResource','post','routeSaveResource',1);
		INSERT INTO TGv1000.routes (path, moduleName, route, verb, method, inuse)
			VALUES ('./modules/BOL/','ResourceBO','/BOL/ResourceBO/SaveURLResource','post','routeSaveURLResource',1);
		INSERT INTO TGv1000.routes (path, moduleName, route, verb, method, inuse)
			VALUES ('./modules/BOL/','UtilityBO','/BOL/UtilityBO/Search','post','routeSearch',1);
		INSERT INTO TGv1000.routes (path, moduleName, route, verb, method, inuse)
			VALUES ('./modules/BOL/','ResourceBO','/BOL/ResourceBO/SaveProject','post','routeSaveProject',1);
		INSERT INTO TGv1000.routes (path, moduleName, route, verb, method, inuse)
			VALUES ('./modules/BOL/','ResourceBO','/BOL/ResourceBO/RetrieveProject','post','routeRetrieveProject',1);
		INSERT INTO TGv1000.routes (path, moduleName, route, verb, method, inuse)
			VALUES ('./modules/BOL/','ResourceBO','/BOL/ResourceBO/RetrieveType','post','routeRetrieveType',1);
		INSERT INTO TGv1000.routes (path, moduleName, route, verb, method, inuse)
			VALUES ('./modules/BOL/','ResourceBO','/BOL/ResourceBO/RetrieveMethod','post','routeRetrieveMethod',1);
		UPDATE `TGv1000`.`routes` set moduleName='ProjectBO', route='/BOL/ProjectBO/RetrieveMethod' where method='routeRetrieveMethod';
		UPDATE `TGv1000`.`routes` set moduleName='ProjectBO', route='/BOL/ProjectBO/RetrieveType' where method='routeRetrieveType';
		UPDATE `TGv1000`.`routes` set moduleName='ProjectBO', route='/BOL/ProjectBO/RetrieveProject' where method='routeRetrieveProject';
		UPDATE `TGv1000`.`routes` set moduleName='ProjectBO', route='/BOL/ProjectBO/SaveProject' where method='routeSaveProject';
		INSERT INTO TGv1000.routes (path, moduleName, route, verb, method, inuse)
			VALUES ('./modules/BOL/','ProjectBO','/BOL/ProjectBO/RetrieveCountUsersProjects','post','routeRetrieveCountUsersProjects',1);

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
            
