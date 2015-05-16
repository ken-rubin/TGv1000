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

    end if;
        
    if @dbstate = 3.0 THEN
        
		INSERT INTO TGv1000.routes (path, moduleName, route, verb, method, inuse)
			VALUES ('./modules/BOL/','ResourceBO','/BOL/ResourceBO/FetchResources','post','routeFetchResources',1);
		INSERT INTO TGv1000.routes (path, moduleName, route, verb, method, inuse)
			VALUES ('./modules/BOL/','ResourceBO','/BOL/ResourceBO/SaveResource','post','routeSaveResource',1);

		UPDATE `TGv1000`.`control` set dbstate=4.0 where id=1;
    
    end if;

end;

//

delimiter ;

-- Execute the procedure
call maintainDB();

-- Drop the procedure.
drop procedure maintainDB;
