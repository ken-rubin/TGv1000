delimiter //
create procedure doSystemTypes()
begin
set @guts := "SET name='Array',typeTypeId=2,imageId=0,altImagePath=,description='',ownedByUserId=1,public=0,baseTypeId=0";
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
/* Whichever case, the System Type's id is in @id1, to be used below for methods, properties and events. */
set @guts := "SET name='Boolean',typeTypeId=2,imageId=0,altImagePath=,description='',ownedByUserId=1,public=0,baseTypeId=0";
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
/* Whichever case, the System Type's id is in @id2, to be used below for methods, properties and events. */
set @guts := "SET name='Date',typeTypeId=2,imageId=0,altImagePath=,description='',ownedByUserId=1,public=0,baseTypeId=0";
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
/* Whichever case, the System Type's id is in @id3, to be used below for methods, properties and events. */
set @guts := "SET name='EventHandler',typeTypeId=2,imageId=0,altImagePath=,description='Module responsible for subscribing to and raising events.',ownedByUserId=1,public=1,baseTypeId=0";
set @id4 := (select id from types where typeTypeId=2 and name="EventHandler");
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
/* Whichever case, the System Type's id is in @id4, to be used below for methods, properties and events. */
set @guts := "SET name='Math',typeTypeId=2,imageId=0,altImagePath=,description='',ownedByUserId=1,public=0,baseTypeId=0";
set @id5 := (select id from types where typeTypeId=2 and name="Math");
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
/* Whichever case, the System Type's id is in @id5, to be used below for methods, properties and events. */
set @guts := "SET name='Number',typeTypeId=2,imageId=0,altImagePath=,description='',ownedByUserId=1,public=0,baseTypeId=0";
set @id6 := (select id from types where typeTypeId=2 and name="Number");
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
/* Whichever case, the System Type's id is in @id6, to be used below for methods, properties and events. */
set @guts := "SET name='RegExp',typeTypeId=2,imageId=0,altImagePath=,description='',ownedByUserId=1,public=0,baseTypeId=0";
set @id7 := (select id from types where typeTypeId=2 and name="RegExp");
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
/* Whichever case, the System Type's id is in @id7, to be used below for methods, properties and events. */
set @guts := "SET name='String',typeTypeId=2,imageId=0,altImagePath=,description='',ownedByUserId=1,public=0,baseTypeId=0";
set @id8 := (select id from types where typeTypeId=2 and name="String");
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
/* Whichever case, the System Type's id is in @id8, to be used below for methods, properties and events. */
set @guts := "SET name='VisualObject',typeTypeId=2,imageId=0,altImagePath=,description='',ownedByUserId=1,public=0,baseTypeId=0";
set @id9 := (select id from types where typeTypeId=2 and name="VisualObject");
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
/* Whichever case, the System Type's id is in @id9, to be used below for methods, properties and events. */
insert TGv1000.methods SET typeId=@id1,name='construct',ordinal=0,statements='[]',imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,methodTypeId=4,arguments='{\"type\":\"ParameterList\",\"parameters\":[{\"type\":\"Array\",\"parameters\":[]}]}';
insert TGv1000.methods SET typeId=@id1,name='MyMethod',ordinal=1,statements='[]',imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=2,public=1,quarantined=0,methodTypeId=4,arguments='{\"type\":\"ParameterList\",\"parameters\":[{\"type\":\"Array\",\"parameters\":[]}]}';
insert TGv1000.events SET typeId=@id1,name='MyEvent',ordinal=0;
insert TGv1000.methods SET typeId=@id2,name='construct',ordinal=0,statements='[]',imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,methodTypeId=4,arguments='{\"type\":\"ParameterList\",\"parameters\":[{\"type\":\"Array\",\"parameters\":[]}]}';
insert TGv1000.events SET typeId=@id2,name='MyEvent',ordinal=0;
insert TGv1000.methods SET typeId=@id3,name='construct',ordinal=0,statements='[]',imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,methodTypeId=4,arguments='{\"type\":\"ParameterList\",\"parameters\":[{\"type\":\"Array\",\"parameters\":[]}]}';
insert TGv1000.methods SET typeId=@id4,name='construct',ordinal=0,statements='[]',imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=2,public=1,quarantined=0,methodTypeId=4,arguments='{\"type\":\"ParameterList\",\"parameters\":[{\"type\":\"Array\",\"parameters\":[]}]}';
insert TGv1000.methods SET typeId=@id4,name='Subscribe',ordinal=1,statements='[{\"type\":\"CodeStatementFreeform\",\"parameters\":[{\"type\":\"String\",\"value\":\"window.tg.eventCollection[eventName].push({\\n\\n    target: visualObject, \\n    method: methodName\\n});\"}]}]',imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=2,public=1,quarantined=0,methodTypeId=4,arguments='{\"type\":\"ParameterList\",\"parameters\":[{\"type\":\"Array\",\"parameters\":[{\"type\":\"Parameter\",\"parameters\":[{\"type\":\"String\",\"value\":\"eventName\"},{\"type\":\"String\",\"value\":\"String\"}]},{\"type\":\"Parameter\",\"parameters\":[{\"type\":\"String\",\"value\":\"visualObject\"},{\"type\":\"String\",\"value\":\"VisualObject\"}]},{\"type\":\"Parameter\",\"parameters\":[{\"type\":\"String\",\"value\":\"methodName\"},{\"type\":\"String\",\"value\":\"String\"}]}]}]}';
insert TGv1000.methods SET typeId=@id4,name='Raise',ordinal=2,statements='[{\"type\":\"CodeStatementFreeform\",\"parameters\":[{\"type\":\"String\",\"value\":\"window.tg.raiseEvent(eventName, contextObject);\"}]}]',imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=2,public=1,quarantined=0,methodTypeId=4,arguments='{\"type\":\"ParameterList\",\"parameters\":[{\"type\":\"Array\",\"parameters\":[{\"type\":\"Parameter\",\"parameters\":[{\"type\":\"String\",\"value\":\"eventName\"},{\"type\":\"String\",\"value\":\"String\"}]},{\"type\":\"Parameter\",\"parameters\":[{\"type\":\"String\",\"value\":\"contextObject\"},{\"type\":\"String\",\"value\":\"VisualObject\"}]}]}]}';
insert TGv1000.methods SET typeId=@id5,name='construct',ordinal=0,statements='[]',imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,methodTypeId=4,arguments='{\"type\":\"ParameterList\",\"parameters\":[{\"type\":\"Array\",\"parameters\":[]}]}';
insert TGv1000.methods SET typeId=@id6,name='construct',ordinal=0,statements='[]',imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,methodTypeId=4,arguments='{\"type\":\"ParameterList\",\"parameters\":[{\"type\":\"Array\",\"parameters\":[]}]}';
insert TGv1000.methods SET typeId=@id7,name='construct',ordinal=0,statements='[]',imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,methodTypeId=4,arguments='{\"type\":\"ParameterList\",\"parameters\":[{\"type\":\"Array\",\"parameters\":[]}]}';
insert TGv1000.methods SET typeId=@id8,name='construct',ordinal=0,statements='[]',imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,methodTypeId=4,arguments='{\"type\":\"ParameterList\",\"parameters\":[{\"type\":\"Array\",\"parameters\":[]}]}';
insert TGv1000.methods SET typeId=@id9,name='construct',ordinal=0,statements='[]',imageId=0,description='[No description provided]',parentMethodId=0,parentPrice=0,priceBump=0,ownedByUserId=1,public=1,quarantined=0,methodTypeId=4,arguments='{\"type\":\"ParameterList\",\"parameters\":[{\"type\":\"Array\",\"parameters\":[]}]}';
insert TGv1000.propertys SET typeId=@id9,propertyTypeId=6,name='x',initialValue='Number',ordinal=0,isHidden=1;
insert TGv1000.propertys SET typeId=@id9,propertyTypeId=6,name='y',initialValue='Number',ordinal=1,isHidden=1;
insert TGv1000.propertys SET typeId=@id9,propertyTypeId=6,name='height',initialValue='Number',ordinal=2,isHidden=1;
insert TGv1000.propertys SET typeId=@id9,propertyTypeId=6,name='width',initialValue='Number',ordinal=3,isHidden=1;
end;
//
delimiter ;
call doSystemTypes();
drop procedure doSystemTypes;