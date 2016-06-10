delimiter //
create procedure doSystemTypes()
begin
set @guts := "SET name='Array',isApp=0,imageId=0,altImagePath=,ordinal=,comicId=null,description='',parentTypeId=null,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,baseTypeId=0,projectId=null";
set @id1 := (select id from types where typeTypeId=2 and name="Array");
if @id1 is not null then
   /* Existing System Types are deleted and re-inserted with the same id they had before. */
   delete from types where id=@id1;
   set @s := (select concat("insert types ",@guts,",id=@id1;"));
   prepare insstmt from @s;
   execute insstmt;
else
   /* New System Types are inserted with a new id. */
   set @s := (select concat("insert types ",@guts,";"));
   prepare insstmt from @s;
   execute insstmt;
   set @id1 := (select LAST_INSERT_ID());
end if;
/* Whichever case, the System Type's id is in @id1, to be used below for methods, properties, events and tags. */
set @guts := "SET name='Boolean',isApp=0,imageId=0,altImagePath=,ordinal=,comicId=null,description='',parentTypeId=null,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,baseTypeId=0,projectId=null";
set @id2 := (select id from types where typeTypeId=2 and name="Boolean");
if @id2 is not null then
   /* Existing System Types are deleted and re-inserted with the same id they had before. */
   delete from types where id=@id2;
   set @s := (select concat("insert types ",@guts,",id=@id2;"));
   prepare insstmt from @s;
   execute insstmt;
else
   /* New System Types are inserted with a new id. */
   set @s := (select concat("insert types ",@guts,";"));
   prepare insstmt from @s;
   execute insstmt;
   set @id2 := (select LAST_INSERT_ID());
end if;
/* Whichever case, the System Type's id is in @id2, to be used below for methods, properties, events and tags. */
set @guts := "SET name='Date',isApp=0,imageId=0,altImagePath=,ordinal=,comicId=null,description='',parentTypeId=null,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,baseTypeId=0,projectId=null";
set @id3 := (select id from types where typeTypeId=2 and name="Date");
if @id3 is not null then
   /* Existing System Types are deleted and re-inserted with the same id they had before. */
   delete from types where id=@id3;
   set @s := (select concat("insert types ",@guts,",id=@id3;"));
   prepare insstmt from @s;
   execute insstmt;
else
   /* New System Types are inserted with a new id. */
   set @s := (select concat("insert types ",@guts,";"));
   prepare insstmt from @s;
   execute insstmt;
   set @id3 := (select LAST_INSERT_ID());
end if;
/* Whichever case, the System Type's id is in @id3, to be used below for methods, properties, events and tags. */
set @guts := "SET name='Math',isApp=0,imageId=0,altImagePath=,ordinal=,comicId=null,description='',parentTypeId=null,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,baseTypeId=0,projectId=null";
set @id4 := (select id from types where typeTypeId=2 and name="Math");
if @id4 is not null then
   /* Existing System Types are deleted and re-inserted with the same id they had before. */
   delete from types where id=@id4;
   set @s := (select concat("insert types ",@guts,",id=@id4;"));
   prepare insstmt from @s;
   execute insstmt;
else
   /* New System Types are inserted with a new id. */
   set @s := (select concat("insert types ",@guts,";"));
   prepare insstmt from @s;
   execute insstmt;
   set @id4 := (select LAST_INSERT_ID());
end if;
/* Whichever case, the System Type's id is in @id4, to be used below for methods, properties, events and tags. */
set @guts := "SET name='Number',isApp=0,imageId=0,altImagePath=,ordinal=,comicId=null,description='',parentTypeId=null,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,baseTypeId=0,projectId=null";
set @id5 := (select id from types where typeTypeId=2 and name="Number");
if @id5 is not null then
   /* Existing System Types are deleted and re-inserted with the same id they had before. */
   delete from types where id=@id5;
   set @s := (select concat("insert types ",@guts,",id=@id5;"));
   prepare insstmt from @s;
   execute insstmt;
else
   /* New System Types are inserted with a new id. */
   set @s := (select concat("insert types ",@guts,";"));
   prepare insstmt from @s;
   execute insstmt;
   set @id5 := (select LAST_INSERT_ID());
end if;
/* Whichever case, the System Type's id is in @id5, to be used below for methods, properties, events and tags. */
set @guts := "SET name='RegExp',isApp=0,imageId=0,altImagePath=,ordinal=,comicId=null,description='',parentTypeId=null,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,baseTypeId=0,projectId=null";
set @id6 := (select id from types where typeTypeId=2 and name="RegExp");
if @id6 is not null then
   /* Existing System Types are deleted and re-inserted with the same id they had before. */
   delete from types where id=@id6;
   set @s := (select concat("insert types ",@guts,",id=@id6;"));
   prepare insstmt from @s;
   execute insstmt;
else
   /* New System Types are inserted with a new id. */
   set @s := (select concat("insert types ",@guts,";"));
   prepare insstmt from @s;
   execute insstmt;
   set @id6 := (select LAST_INSERT_ID());
end if;
/* Whichever case, the System Type's id is in @id6, to be used below for methods, properties, events and tags. */
set @guts := "SET name='String',isApp=0,imageId=0,altImagePath=,ordinal=,comicId=null,description='',parentTypeId=null,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,baseTypeId=0,projectId=null";
set @id7 := (select id from types where typeTypeId=2 and name="String");
if @id7 is not null then
   /* Existing System Types are deleted and re-inserted with the same id they had before. */
   delete from types where id=@id7;
   set @s := (select concat("insert types ",@guts,",id=@id7;"));
   prepare insstmt from @s;
   execute insstmt;
else
   /* New System Types are inserted with a new id. */
   set @s := (select concat("insert types ",@guts,";"));
   prepare insstmt from @s;
   execute insstmt;
   set @id7 := (select LAST_INSERT_ID());
end if;
/* Whichever case, the System Type's id is in @id7, to be used below for methods, properties, events and tags. */
set @guts := "SET name='MySystemType',isApp=0,imageId=0,altImagePath=,ordinal=undefined,comicId=null,description='[description goes here]',parentTypeId=null,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,baseTypeId=0,projectId=null";
set @id8 := (select id from types where typeTypeId=2 and name="MySystemType");
if @id8 is not null then
   /* Existing System Types are deleted and re-inserted with the same id they had before. */
   delete from types where id=@id8;
   set @s := (select concat("insert types ",@guts,",id=@id8;"));
   prepare insstmt from @s;
   execute insstmt;
else
   /* New System Types are inserted with a new id. */
   set @s := (select concat("insert types ",@guts,";"));
   prepare insstmt from @s;
   execute insstmt;
   set @id8 := (select LAST_INSERT_ID());
end if;
/* Whichever case, the System Type's id is in @id8, to be used below for methods, properties, events and tags. */
insert TGv1000.methods SET typeId=@id1,name='construct',ordinal=0,workspace=NULL,imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,methodTypeId=4,parameters=NULL;
set @idm := (select LAST_INSERT_ID());
insert TGv1000.methods SET typeId=@id2,name='construct',ordinal=0,workspace=NULL,imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,methodTypeId=4,parameters=NULL;
set @idm := (select LAST_INSERT_ID());
insert TGv1000.methods SET typeId=@id3,name='construct',ordinal=0,workspace=NULL,imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,methodTypeId=4,parameters=NULL;
set @idm := (select LAST_INSERT_ID());
insert TGv1000.methods SET typeId=@id4,name='construct',ordinal=0,workspace=NULL,imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,methodTypeId=4,parameters=NULL;
set @idm := (select LAST_INSERT_ID());
insert TGv1000.methods SET typeId=@id5,name='construct',ordinal=0,workspace=NULL,imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,methodTypeId=4,parameters=NULL;
set @idm := (select LAST_INSERT_ID());
insert TGv1000.methods SET typeId=@id6,name='construct',ordinal=0,workspace=NULL,imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,methodTypeId=4,parameters=NULL;
set @idm := (select LAST_INSERT_ID());
insert TGv1000.methods SET typeId=@id7,name='construct',ordinal=0,workspace=NULL,imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,methodTypeId=4,parameters=NULL;
set @idm := (select LAST_INSERT_ID());
end;
//
delimiter ;
call doSystemTypes();
drop procedure doSystemTypes;