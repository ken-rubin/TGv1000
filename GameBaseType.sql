delimiter //
create procedure doSystemTypes()
begin
set @guts := "SET name='GameBaseType',typeTypeId=3,imageId=0,altImagePath=media/images/gameProject.png,description='null',ownedByUserId=1,public=1,baseTypeId=0";
set @id1 := (select id from types where typeTypeId=3 and name="GameBaseType");
if @id1 is not null then
   /* Existing Base Types are deleted and re-inserted with the same id they had before. */
   delete from types where id=@id1;
   set @s := (select concat("insert types ",@guts,",id=@id1;"));
   prepare insstmt from @s;
   execute insstmt;
else
   /* New Base Types are inserted with a new id. */
   set @s := (select concat("insert types ",@guts,";"));
   prepare insstmt from @s;
   execute insstmt;
   set @id1 := (select LAST_INSERT_ID());
end if;
/* Whichever case, the System Type's id is in @id1, to be used below for methods, properties and events. */
insert TGv1000.methods SET typeId=@id1,name='construct',ordinal=0,statements='[]',imageId=0,description='',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,methodTypeId=4,arguments='{\"type\":\"ParameterList\",\"parameters\":[{\"type\":\"Array\",\"parameters\":[]}]}';
end;
//
delimiter ;
call doSystemTypes();
drop procedure doSystemTypes;