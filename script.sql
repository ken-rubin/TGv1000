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
    
		CREATE TABLE `TGv1000`.`user` (
		  `id` INT NOT NULL AUTO_INCREMENT,
		  `userName` VARCHAR(45) NOT NULL,
		  `pwHash` VARCHAR(16000) NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (id)
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

		INSERT INTO TGv1000.routes VALUES (1,'./modules/BOL/','ValidateBO','/BOL/ValidateBO/UserAuthenticate','post','routeUserAuthenticate',1);        
        
		UPDATE `TGv1000`.`control` set dbstate=1.0 where id=1;
		set @dbstate := 1.0;
    
    end if;

    if @dbstate = 1.0 THEN
        
		CREATE TABLE `TGv1000`.`parent` (
		  `id` INT NOT NULL AUTO_INCREMENT,
		  `email` VARCHAR(45) NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (id)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
		ALTER TABLE `TGv1000`.`user` 
		ADD COLUMN `parentId` INT(11) NULL AFTER `pwHash`;		

		INSERT INTO TGv1000.routes VALUES (67,'./modules/BOL/','ValidateBO','/BOL/ValidateBO/NewEnrollment','post','routeNewEnrollment',1);        
		INSERT INTO TGv1000.routes VALUES (133,'./modules/BOL/','ValidateBO','/BOL/ValidateBO/ForgotPassword','post','routeForgotPassword',1);        

		UPDATE `TGv1000`.`control` set dbstate=2.0 where id=1;
		set @dbstate := 2.0;
    
    end if;

    if @dbstate = 2.0 THEN

		CREATE TABLE `TGv1000`.`resources` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `createdByUserId` int(11) NOT NULL,
		  `friendlyName` varchar(255) NOT NULL,
		  `resourceTypeId` int(11) NOT NULL,
		  `public` tinyint(1) NOT NULL DEFAULT '0',
		  `ext` varchar(5) NOT NULL,
		  `quarantined` tinyint(1) NOT NULL DEFAULT '0',
		  `origext` varchar(5) DEFAULT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

		CREATE TABLE `TGv1000`.`tags` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `description` varchar(255) NOT NULL,
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
        
        insert INTO TGv1000.tags (id,description) values (1,'Chester');
        insert INTO TGv1000.resources (id,createdByUserId,friendlyName,resourceTypeId,public,ext,quarantined)
			values (1,1,'Chester',1,1,'png',0);
		insert into TGv1000.resources_tags values (1,1);
		insert TGv1000.resourceTypes (id,description) values (1,'image');
		insert TGv1000.resourceTypes (id,description) values (2,'sound');
		insert TGv1000.resourceTypes (id,description) values (3,'video');

		UPDATE `TGv1000`.`control` set dbstate=3.0 where id=1;
		set @dbstate := 3.0;

    end if;
        
    if @dbstate = 3.0 THEN
        
		INSERT INTO TGv1000.routes (path, moduleName, route, verb, method, inuse)
			VALUES ('./modules/BOL/','ResourceBO','/BOL/ResourceBO/FetchResources','post','routeFetchResources',1);
		INSERT INTO TGv1000.routes (path, moduleName, route, verb, method, inuse)
			VALUES ('./modules/BOL/','ResourceBO','/BOL/ResourceBO/SaveResource','post','routeSaveResource',1);

		UPDATE `TGv1000`.`control` set dbstate=4.0 where id=1;
		set @dbstate := 4.0;
    
    end if;

    if @dbstate = 4.0 THEN
        
		INSERT INTO TGv1000.routes (path, moduleName, route, verb, method, inuse)
			VALUES ('./modules/BOL/','ResourceBO','/BOL/ResourceBO/DeleteResource','post','routeDeleteResource',1);

		UPDATE `TGv1000`.`control` set dbstate=5.0 where id=1;
		set @dbstate := 5.0;
    
    end if;

    if @dbstate = 5.0 THEN
        
		INSERT INTO TGv1000.routes (path, moduleName, route, verb, method, inuse)
			VALUES ('./modules/BOL/','ResourceBO','/BOL/ResourceBO/SaveURLResource','post','routeSaveURLResource',1);

		UPDATE `TGv1000`.`control` set dbstate=6.0 where id=1;
		set @dbstate := 6.0;
    
    end if;

    if @dbstate = 6.0 THEN
        
		UPDATE TGv1000.resources set id=3 where id=1;
		UPDATE TGv1000.resources_tags set resourceId=3 where resourceId=1;

		UPDATE `TGv1000`.`control` set dbstate=7.0 where id=1;
		set @dbstate := 7.0;
    
    end if;

    if @dbstate = 7.0 THEN
        
		INSERT INTO TGv1000.routes (path, moduleName, route, verb, method, inuse)
			VALUES ('./modules/BOL/','UtilityBO','/BOL/UtilityBO/Search','post','routeSearch',1);

		UPDATE `TGv1000`.`control` set dbstate=8.0 where id=1;
		set @dbstate := 8.0;
    
    end if;

    if @dbstate = 8.0 THEN
        
		ALTER TABLE `TGv1000`.`resources` 
			CHANGE COLUMN `friendlyName` `friendlyName` VARCHAR(255) NULL ;

		UPDATE `TGv1000`.`control` set dbstate=9.0 where id=1;
		set @dbstate := 9.0;
    
    end if;

    if @dbstate = 9.0 THEN
        
		ALTER TABLE `TGv1000`.`resources` 
			CHANGE COLUMN `friendlyName` `friendlyName` VARCHAR(255) NOT NULL ;
		ALTER TABLE `TGv1000`.`resources` 
			CHANGE COLUMN `ext` `ext` VARCHAR(5) NULL ;            

		UPDATE TGv1000.resourceTypes set description='project' where id=3;
        INSERT TGv1000.resourceTypes values (4, 'type');

		CREATE TABLE `TGv1000`.`comics` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `projectId` int(11) NOT NULL,
          `ordinal` int(11) NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
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
        
		UPDATE `TGv1000`.`control` set dbstate=10.0 where id=1;
		set @dbstate := 10.0;
    
    end if;

    if @dbstate = 10.0 THEN
        
		ALTER TABLE `TGv1000`.`types` 
			ADD COLUMN `jsonCode` MEDIUMTEXT NOT NULL ;

		UPDATE `TGv1000`.`control` set dbstate=11.0 where id=1;
		set @dbstate := 11.0;
    
    end if;

    if @dbstate = 11.0 THEN

		ALTER TABLE `TGv1000`.`resources` 
			AUTO_INCREMENT = 100 ,
			DROP COLUMN `origext`,
			DROP COLUMN `ext`,
			DROP COLUMN `friendlyName`,
			ADD COLUMN `optnlFK` INT(11) NULL AFTER `quarantined`;

		UPDATE `TGv1000`.`control` set dbstate=12.0 where id=1;
		set @dbstate := 12.0;
        
    end if;
    
    if @dbstate = 12.0 THEN
    
        INSERT TGv1000.resourceTypes values (5, 'comic');
        INSERT TGv1000.resources (id,createdByUserId,resourceTypeId,public,quarantined,optnlFK)
			values (1,1,5,0,0,1);

		UPDATE `TGv1000`.`control` set dbstate=13.0 where id=1;
		set @dbstate := 13.0;
    
    end if;

    if @dbstate = 13.0 THEN
    
		ALTER TABLE `TGv1000`.`comics` 
			ADD COLUMN `imageResourceId` INT(11) NOT NULL AFTER `ordinal`;
            
		UPDATE `TGv1000`.`control` set dbstate=14.0 where id=1;
		set @dbstate := 14.0;
    end if;

	if @dbstate = 14.0 then

		ALTER TABLE `TGv1000`.`projects` 
			ADD COLUMN `description` VARCHAR(255) NULL AFTER `imageResourceId`;

		INSERT INTO TGv1000.routes (path, moduleName, route, verb, method, inuse)
			VALUES ('./modules/BOL/','ResourceBO','/BOL/ResourceBO/SaveProject','post','routeSaveProject',1);

		DELETE FROM TGv1000.resources;
        DELETE FROM TGv1000.tags;
        DELETE FROM TGv1000.resources_tags;

		UPDATE `TGv1000`.`control` set dbstate=15.0 where id=1;
		set @dbstate := 15.0;
    end if;

	if @dbstate = 15.0 then

		DELETE FROM TGv1000.routes where method = 'routeDeleteResource';
		DELETE FROM TGv1000.routes where method = 'routeFetchResources';

		UPDATE `TGv1000`.`control` set dbstate=16.0 where id=1;
		set @dbstate := 16.0;
    end if;

	if @dbstate = 16.0 then

		INSERT INTO TGv1000.routes (path, moduleName, route, verb, method, inuse)
			VALUES ('./modules/BOL/','ResourceBO','/BOL/ResourceBO/RetrieveProject','post','routeRetrieveProject',1);

		UPDATE `TGv1000`.`control` set dbstate=17.0 where id=1;
		set @dbstate := 17.0;
    end if;
    
	if @dbstate = 17.0 then

		UPDATE TGv1000.resourceTypes set description='comic' where id=4;
		UPDATE TGv1000.resourceTypes set description='type' where id=5;

		UPDATE `TGv1000`.`control` set dbstate=18.0 where id=1;
		set @dbstate := 18.0;
    end if;
    
	if @dbstate = 18.0 then
    
		ALTER TABLE `TGv1000`.`comics` 
			ADD COLUMN `name` VARCHAR(255) NOT NULL DEFAULT '' AFTER `imageResourceId`;

		UPDATE `TGv1000`.`control` set dbstate=19.0 where id=1;
		set @dbstate := 19.0;
    end if;
    
	if @dbstate = 19.0 then

		INSERT INTO TGv1000.routes (path, moduleName, route, verb, method, inuse)
			VALUES ('./modules/BOL/','ResourceBO','/BOL/ResourceBO/RetrieveType','post','routeRetrieveType',1);

		UPDATE `TGv1000`.`control` set dbstate=20.0 where id=1;
		set @dbstate := 20.0;
    end if;
    
    if @dbstate = 20.0 then

		ALTER TABLE `TGv1000`.`projects` 
			DROP COLUMN `template`;
		INSERT `TGv1000`.`resourceTypes` values (6,'property');
		INSERT `TGv1000`.`resourceTypes` values (7,'method');
		INSERT `TGv1000`.`resourceTypes` values (8,'event');

		CREATE TABLE `TGv1000`.`properties` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `typeId` int(11) NOT NULL,
          `name` varchar(255) NOT NULL,
          `jsonCode` mediumtext NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
		CREATE TABLE `TGv1000`.`methods` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `typeId` int(11) NOT NULL,
          `name` varchar(255) NOT NULL,
          `jsonCode` mediumtext NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
		CREATE TABLE `TGv1000`.`events` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `typeId` int(11) NOT NULL,
          `name` varchar(255) NOT NULL,
          `jsonCode` mediumtext NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
	
		UPDATE `TGv1000`.`control` set dbstate=21.0 where id=1;
		set @dbstate := 21.0;
    end if;
    
    if @dbstate = 21.0 then
    
		ALTER TABLE `TGv1000`.`properties` 
			RENAME TO  `TGv1000`.`propertys` ;
        
		UPDATE `TGv1000`.`control` set dbstate=22.0 where id=1;
		set @dbstate := 22.0;
    end if;

    if @dbstate = 22.0 then
    
		ALTER TABLE `TGv1000`.`resources` 
			ADD COLUMN `name` VARCHAR(255) NOT NULL DEFAULT '' AFTER `optnlFK`;        
		
        UPDATE `TGv1000`.`control` set dbstate=23.0 where id=1;
		set @dbstate := 23.0;
    end if;

    if @dbstate = 23.0 then
    
		ALTER TABLE `TGv1000`.`methods` 
			ADD COLUMN `ordinal` int(11) NOT NULL AFTER `name`;        
		
        UPDATE `TGv1000`.`control` set dbstate=24.0 where id=1;
		set @dbstate := 24.0;
    end if;

    if @dbstate = 24.0 then
    
		INSERT INTO TGv1000.routes (path, moduleName, route, verb, method, inuse)
			VALUES ('./modules/BOL/','ResourceBO','/BOL/ResourceBO/RetrieveMethod','post','routeRetrieveMethod',1);
		
        UPDATE `TGv1000`.`control` set dbstate=25.0 where id=1;
		set @dbstate := 25.0;
    end if;

    if @dbstate = 25.0 then
    
		DELETE FROM TGv1000.resourceTypes where id in (6,8);
        ALTER TABLE `TGv1000`.`methods` 
			CHANGE COLUMN `jsonCode` `workspace` MEDIUMTEXT NOT NULL ,
			ADD COLUMN `imageResourceId` INT(11) NOT NULL AFTER `workspace`,
			ADD COLUMN `createdByUserId` INT(11) NOT NULL AFTER `imageResourceId`,
			ADD COLUMN `price` DECIMAL(5,2) NOT NULL DEFAULT 0.0 AFTER `createdByUserId`,
            ADD COLUMN `description` VARCHAR(255) NULL AFTER `price`;
		ALTER TABLE `TGv1000`.`propertys` 
			CHANGE COLUMN `jsonCode` `propertyTypeId` INT(11) NOT NULL ,
			ADD COLUMN `initialValue` MEDIUMTEXT NOT NULL AFTER `propertyTypeId`,
			ADD COLUMN `ordinal` INT(11) NOT NULL AFTER `initialValue`;
		ALTER TABLE `TGv1000`.`events` 
			CHANGE COLUMN `jsonCode` `ordinal` INT(11) NOT NULL ;
		CREATE TABLE `TGv1000`.`propertyTypes` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `description` varchar(255) NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
		insert TGv1000.propertyTypes (id,description) values (1,'Number');
		insert TGv1000.propertyTypes (id,description) values (2,'Number range (e.g., 3-27)');
		insert TGv1000.propertyTypes (id,description) values (3,'String');
		insert TGv1000.propertyTypes (id,description) values (4,'Boolean (e.g., true or false)');
		insert TGv1000.propertyTypes (id,description) values (5,'Picklist (e.g., ''John'' or ''Jim'' or ''Paul'' or ''Henry'')');
		insert TGv1000.propertyTypes (id,description) values (6,'Type');

        UPDATE `TGv1000`.`control` set dbstate=26.0 where id=1;
		set @dbstate := 26.0;
    end if;

    if @dbstate = 26.0 then
    
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
    
        UPDATE `TGv1000`.`control` set dbstate=27.0 where id=1;
		set @dbstate := 27.0;
    end if;

    if @dbstate = 27.0 then
    
		UPDATE `TGv1000`.`routes` set moduleName='ProjectBO', route='/BOL/ProjectBO/RetrieveMethod' where method='routeRetrieveMethod';
		UPDATE `TGv1000`.`routes` set moduleName='ProjectBO', route='/BOL/ProjectBO/RetrieveType' where method='routeRetrieveType';
		UPDATE `TGv1000`.`routes` set moduleName='ProjectBO', route='/BOL/ProjectBO/RetrieveProject' where method='routeRetrieveProject';
		UPDATE `TGv1000`.`routes` set moduleName='ProjectBO', route='/BOL/ProjectBO/SaveProject' where method='routeSaveProject';
    
        UPDATE `TGv1000`.`control` set dbstate=28.0 where id=1;
		set @dbstate := 28.0;
    end if;

    if @dbstate = 28.0 then
    
		INSERT INTO TGv1000.routes (path, moduleName, route, verb, method, inuse)
			VALUES ('./modules/BOL/','ProjectBO','/BOL/ProjectBO/RetrieveCountUsersProjects','post','routeRetrieveCountUsersProjects',1);
		
        CREATE TABLE `TGv1000`.`classOrProduct` (
		  `id` INT NOT NULL AUTO_INCREMENT,
		  `name` VARCHAR(255) NOT NULL,
		  `isProduct` BIT(1) NOT NULL DEFAULT 0,
		  `price` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
		  `createdByUserId` INT NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE INDEX `id_UNIQUE` (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        
		ALTER TABLE `TGv1000`.`comics` 
			CHANGE COLUMN `projectId` `classOrProductId` INT(11) NOT NULL ;
            
		ALTER TABLE `TGv1000`.`projects` 
			ADD COLUMN `ownedByUserId` INT(11) NOT NULL AFTER `description`,
			ADD COLUMN `classOrProductId` INT(11) NOT NULL AFTER `ownedByUserId`;
            
		ALTER TABLE `TGv1000`.`types` 
			DROP COLUMN `comicId`,
			CHANGE COLUMN `jsonCode` `comicId` INT(11) NOT NULL ,
			ADD COLUMN `projectId` INT(11) NOT NULL AFTER `comicId`;
        
        UPDATE `TGv1000`.`control` set dbstate=29.0 where id=1;
		set @dbstate := 29.0;
    end if;

    if @dbstate = 29.0 then
    
		INSERT INTO TGv1000.classOrProduct (id, `name`, isProduct, price, createdByUserId)
			VALUES (1, 'New project help',0,0.00,1);
            
		INSERT INTO TGv1000.comics (id, classOrProductId, ordinal, imageResourceId, `name`)
			VALUES (1,1,0,1,'Help');
            
		INSERT INTO TGv1000.comicPanels (id, comicId, ordinal, name, url, description, thumbnail)
			VALUES (1,1,0,'Help panel 1','http://www.techgroms.com','','tn1.png');
		
        UPDATE `TGv1000`.`control` set dbstate=30.0 where id=1;
		set @dbstate := 30.0;
    end if;

end;

//

delimiter ;

-- Execute the procedure
call maintainDB();

-- Drop the procedure.
drop procedure maintainDB;
