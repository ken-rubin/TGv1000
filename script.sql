CREATE SCHEMA IF NOT EXISTS `TGv1000`;

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

end;

//

delimiter ;

-- Execute the procedure
call maintainDB();

-- Drop the procedure.
drop procedure maintainDB;
