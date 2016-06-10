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
set @guts := "SET name='MySystemType',isApp=0,imageId=0,altImagePath=,ordinal=,comicId=null,description='[description goes here]',parentTypeId=null,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,baseTypeId=0,projectId=null";
set @id5 := (select id from types where typeTypeId=2 and name="MySystemType");
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
set @guts := "SET name='MySystemType2',isApp=0,imageId=0,altImagePath=,ordinal=,comicId=null,description='[description goes here]',parentTypeId=null,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,baseTypeId=0,projectId=null";
set @id6 := (select id from types where typeTypeId=2 and name="MySystemType2");
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
set @guts := "SET name='MySystemType3',isApp=0,imageId=0,altImagePath=,ordinal=,comicId=null,description='[description goes here]',parentTypeId=null,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,baseTypeId=0,projectId=null";
set @id7 := (select id from types where typeTypeId=2 and name="MySystemType3");
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
set @guts := "SET name='Number',isApp=0,imageId=0,altImagePath=,ordinal=,comicId=null,description='',parentTypeId=null,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,baseTypeId=0,projectId=null";
set @id8 := (select id from types where typeTypeId=2 and name="Number");
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
set @guts := "SET name='RegExp',isApp=0,imageId=0,altImagePath=,ordinal=,comicId=null,description='',parentTypeId=null,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,baseTypeId=0,projectId=null";
set @id9 := (select id from types where typeTypeId=2 and name="RegExp");
if @id9 is not null then
   /* Existing System Types are deleted and re-inserted with the same id they had before. */
   delete from types where id=@id9;
   set @s := (select concat("insert types ",@guts,",id=@id9;"));
   prepare insstmt from @s;
   execute insstmt;
else
   /* New System Types are inserted with a new id. */
   set @s := (select concat("insert types ",@guts,";"));
   prepare insstmt from @s;
   execute insstmt;
   set @id9 := (select LAST_INSERT_ID());
end if;
/* Whichever case, the System Type's id is in @id9, to be used below for methods, properties, events and tags. */
set @guts := "SET name='String',isApp=0,imageId=0,altImagePath=,ordinal=,comicId=null,description='',parentTypeId=null,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,baseTypeId=0,projectId=null";
set @id10 := (select id from types where typeTypeId=2 and name="String");
if @id10 is not null then
   /* Existing System Types are deleted and re-inserted with the same id they had before. */
   delete from types where id=@id10;
   set @s := (select concat("insert types ",@guts,",id=@id10;"));
   prepare insstmt from @s;
   execute insstmt;
else
   /* New System Types are inserted with a new id. */
   set @s := (select concat("insert types ",@guts,";"));
   prepare insstmt from @s;
   execute insstmt;
   set @id10 := (select LAST_INSERT_ID());
end if;
/* Whichever case, the System Type's id is in @id10, to be used below for methods, properties, events and tags. */
set @guts := "SET name='MySystemType4',isApp=0,imageId=0,altImagePath=,ordinal=undefined,comicId=null,description='[description goes here]',parentTypeId=null,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,baseTypeId=0,projectId=null";
set @id11 := (select id from types where typeTypeId=2 and name="MySystemType4");
if @id11 is not null then
   /* Existing System Types are deleted and re-inserted with the same id they had before. */
   delete from types where id=@id11;
   set @s := (select concat("insert types ",@guts,",id=@id11;"));
   prepare insstmt from @s;
   execute insstmt;
else
   /* New System Types are inserted with a new id. */
   set @s := (select concat("insert types ",@guts,";"));
   prepare insstmt from @s;
   execute insstmt;
   set @id11 := (select LAST_INSERT_ID());
end if;
/* Whichever case, the System Type's id is in @id11, to be used below for methods, properties, events and tags. */
insert TGv1000.methods SET typeId=@id1,name='construct',ordinal=0,workspace=NULL,imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,methodTypeId=4,parameters=NULL;
set @idm := (select LAST_INSERT_ID());
insert TGv1000.methods SET typeId=@id2,name='construct',ordinal=0,workspace=NULL,imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,methodTypeId=4,parameters=NULL;
set @idm := (select LAST_INSERT_ID());
insert TGv1000.methods SET typeId=@id3,name='construct',ordinal=0,workspace=NULL,imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,methodTypeId=4,parameters=NULL;
set @idm := (select LAST_INSERT_ID());
insert TGv1000.methods SET typeId=@id4,name='construct',ordinal=0,workspace=NULL,imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,methodTypeId=4,parameters=NULL;
set @idm := (select LAST_INSERT_ID());
insert TGv1000.methods SET typeId=@id5,name='construct',ordinal=0,workspace=NULL,imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=2,public=0,quarantined=1,methodTypeId=2,parameters=NULL;
set @idm := (select LAST_INSERT_ID());
insert TGv1000.methods SET typeId=@id6,name='construct',ordinal=0,workspace=NULL,imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=2,public=0,quarantined=1,methodTypeId=2,parameters=NULL;
set @idm := (select LAST_INSERT_ID());
insert TGv1000.methods SET typeId=@id7,name='construct',ordinal=0,workspace=NULL,imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=2,public=0,quarantined=1,methodTypeId=2,parameters=NULL;
set @idm := (select LAST_INSERT_ID());
insert TGv1000.methods SET typeId=@id8,name='construct',ordinal=0,workspace=NULL,imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,methodTypeId=4,parameters=NULL;
set @idm := (select LAST_INSERT_ID());
insert TGv1000.methods SET typeId=@id9,name='construct',ordinal=0,workspace=NULL,imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,methodTypeId=4,parameters=NULL;
set @idm := (select LAST_INSERT_ID());
insert TGv1000.methods SET typeId=@id10,name='construct',ordinal=0,workspace=NULL,imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,methodTypeId=4,parameters=NULL;
set @idm := (select LAST_INSERT_ID());
insert TGv1000.methods SET typeId=@id11,name='construct',ordinal=0,workspace=NULL,imageId=undefined,description=NULL,parentMethodId=undefined,parentPrice=undefined,priceBump=undefined,ownedByUserId=2,public=undefined,quarantined=undefined,methodTypeId=undefined,parameters=NULL;
set @idm := (select LAST_INSERT_ID());
end;
//
delimiter ;
call doSystemTypes();
drop procedure doSystemTypes;