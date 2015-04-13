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

end;

//

delimiter ;

-- Execute the procedure
call maintainDB();

-- Drop the procedure.
drop procedure maintainDB;
