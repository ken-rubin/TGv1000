## Either of us
- Get rid of bootstrap tool-tips, replace with good
- Events!
- Round X,Y to 0, 1 or 2 decimals (Are they pixels? If so, why not 0 decimals?)
- Comic should slide in from the right, taking up half the screen; slide back out to strip-size when appropriate or click away; remember where they were in comic

## Ken

- Finish and integrate Coder
- [If possible] Click on the app Type's initialize method. All the Types are listed on the left-hand side of the code window. Make them like Control; i.e., [arrowhead] Types that opens on a click to reveal all the Types or no [arrowhead] and just display them all as Blockly blocks. 
- Resizing in the two vertical scroll regions has lost aspect ratio. Toolstrip for sure.


## Jerry

- Consider adding paging to search results--like 100 at a time. See code sample below which shows an efficient way to do MySQL paging.
- Regarding duplicate project name within userId: I can see a scenario where a user goes into the save as dialog, changes the name to one already used (which does update the project in memory on the blur event), backs out (which doesn't reset the project's name back) and then uses straight Save with this duplicate name. This must be prevented.
    - I think that the blur handlers in Save As need to update the project only if Save Project is called. Otherwise, they set member variables. That will handle this.
- I show the current project in the browser tab. I'm not sure I clear it if a project is closed, etc. So tighten this up. Shows the project name, if entered, for New Project. Check the Search for Project case.
- Add more occurences that display the new BootstrapDialog.confirm to make sure they want to lose possible changes to current project. Show the dialog in these cases: 
    - go to AdminZone; 
    - click "TGv1000" to return to sign-in page; 
    - close window or browser (possible?)
- Call client.projectIsDirty() after ANYTHING the user does while in a project. Anything at all. Is there s better way to do this than putting the call in dozens of places??? What does Ken have to do here?
- Deleting
    + Need to finish delete Property, Method and Event. They don't call code to clean up Blockly. This is in Types.js.
- Write event loader in Code.js#self.addType.
- PropertyGrid:
	- apply property value changes on each keystroke and remove the Save buttons
- Project / Quick Save may save twice--it flashes the Save is complete pop-up twice and the self-closing pop-up doesn't go away the second time.
- Remove requirement for images in project, type, method (maybe later, says John; maybe for project we generate a designer thumbnail)
- Play button:
	- place a canvas over the designer to show the project playing
	- change Play button to Pause and Stop buttons when playing (is there a 1-button sequence for this that works? Like Play -> Pause -> Stop. I doubt it.)
- Comic click
    - Slide full panel over half (resizable) the main window
    - CLick off the comic resizes back to scroll strip 
- Implement grid of available classes (and projects?) on login page. Buy from there. Probably enroll, too. How would that work? Go right to new project(?). Needs new DB tables (take from e4Groms schema in large part), admin stuff, etc.
- When user logs in, open most recent project (or new one if just bought).
- Give parent ability to play child's projects but not modify them. If >1 child, present a list of children first. This implies a parent login. 
    - having a parent password wouldn't be a bad idea, but I wouldn't auto-assign it.
- Passport authentication???
    - Use user sessions to make sure someone can't jump into the middle of the site without logging in.
- coder.js line 203 (var strInstanceType = "App_get" + strInstance;): change hardcoded "App" to isApp Type name. Same with line 143 (type: "App_get" + strInstance,) and anyplace else that needs it throughout. Add a method to types(?) to get the isApp Type's name more easily.
- A Type cannot be named X, Y, Width or Height or the same as any tool instance. Also, the unique namer of tool instances must check against existing type names.



## To discuss

- If someone buys a project/type/method, we want them to be able to modify/extend it. What's to keep their friend from copying it for free?We can keep them from retrieving a project that had a price, since it points back to a classOrProduct with a price.


## Documentation of various things

### General description of programming using our system
A Type is our the equivalent of a class in a standard programming language (C# or C++). Like a class it consists of methods and properties. A Type's methods can use (instantiate) another Type to access or manipulate its contents.

1. Projects are built in discreet steps called "comics". Think of comics as the steps a programmer goes through while a program is evolving. Each comic contains a set of Types. Usually comic[n+1] will contain all of the Types from comic[n] with more functionality fleshed out in certain Types. Also, comic[n+1] may have one or more additional Types than comic[n]. Every comic has an automatic Type called *App*. A new project contains one comic with one Type, the App type.
    - The App type has a property *isApp* that is set to *true*. Only one Type in a comic can have isApp=true. The App Type can be renamed because of its isApp property.
2. Types contain a collection of named Methods, each of which has a *workspace* property. This property is the representation (in XML) of the Method's functionality. The XML gets translated into actual Javascript code that executes when the method is called. A Method can also be an event handler. (Parameters are going to be added to Methods soon.) The user never interacts with the XML *per se*. He "programs" methods by one or more of these techniques:
    - dragging and dropping a Type onto the Designer frame (creating a Tool instance)
    - manipulating a Tool instance's properties in code or in a property maintenance grid
    - using blockly schema actions to string operations together by dragging, dropping and arranging elements in the code pane
3. The App Type always has a special method called *initialize* that describes/creates the configuration of the Designer frame as a comic is set to run status.
4. All other Methods, whether in the App Type or any other Types, have been constructed manually by the user by dragging components out of the code schema and manipulating their arrangement and variables via Blockly functionality.
5. The code schema setup is maintained by working with self.blocks, self.javaScript and self.objectTypes in Code.js in response to user actions in the site.

Keeping the code schema and workspace XML in sync and complete while Types, Tools, Methods, Properties and Events are being manipulated (added, removed, renamed, etc.) by the user is really our only goal when we discuss Type, Method, etc. maintenance--as we are doing in this section. Everything else is run-time detail.

To summarize, the sections below describe how our code manipulates each Method's workspace XML and the schema components (to which the XML workspaces refer) as the user performs adding, deleting, renaming, etc. actions on Types, Methods and Properties.

### Data structures and the source code
#### Schema data
- The default Blockly schema contains function and data blocks arranged in these categories: Global, Event, Control/If, Control/Loops, Logic, Math, Lists, Text, Variables and Functions. These blocks are dragged and combined on the Code frame to create workspace methods.
- As Types are added (including the App Type that each comic has by default), they are stored in Code.js in self.schema to be appended to the default schema list just described as if they are Categories. The App Type is created slightly differently from subsequent Types. It is created with these blocks:
    - new_App
    - App_getX
    - App_setX to [var]
    - App_getY
    - App_setY to [var]
    - App_getWidth
    - App_setWidth to [var]
    - App_getHeight
    - App_setHeight to [var]
    - App_initialize using [method]
- Each additional Type has a block *new_typename* that is used to instantiate the type and a getter and a setter for each of its properties (X, Y, Width and Height are defualt initial properties). Since a new Type has no methods to start), there is initially no block analogous to the *App_initialize* block in the preceding list. For example, the Type named *Apple* is created with these blocks:
    - new_apple
    - Apple_getX from [var]
    - Apple_setX in [var1] to [var2]
    - Apple_getY from [var]
    - Apple_setY in [var1] to [var2]
    - Apple_getWidth from [var]
    - Apple_setWidth in [var1] to [var2]
    - Apple_getHeight from [var]
    - Apple_setHeight in [var1] to [var2]
- If the Apple Type is dragged onto the designer surface, it is added as a Property of the App Type and 2 additional blocks are added to the App category:
    - App_getApple
    - App_setApple to [var]
- As stated above, adding a new method to any Type will result in adding a block to that Type similar to typename_methodname using [method].
- Similarly, adding a Property to any Type will result in adding both a getter and a setter to that Type. The getter and setter will conform to the scheme that creates slighly different blocks for App Types and other Types.
- *As you can well imagine, renaming, deleting and adding Types, Methods and Properties all need to maintain the integrity of the abovementioned data.*
#### Method workspaces
- These  blocks are used to build up the Method workspace XML docs. Again, maintenance of anything requires global maintenance of the XML docs.


#### Types
##### Add
##### Rename
##### Delete

#### Tool Instances
##### Create--Drag & Drop a Tool onto the Designer
##### Rename
##### Delete


#### Methods
##### Rename
##### Delete

#### Properties
##### Rename
##### Delete
##### Change property type

#### Events
##### Rename
##### Delete






## Just saving this here for possible ScrollRegion paging

#### Using Deferred Join for Paging

This is an interesting trick. Suppose you have pages of customers. Each page displays ten customers. The query will use LIMIT to get ten records, and OFFSET to skip all the previous page results. When you get to the 100th page, it's doing LIMIT 10 OFFSET 990. So the server has to go and read all those records, then discard them.

Also: AirBNB didn't have to fail during an AWS outage.

```
SELECT id, name, address, phone FROM customers ORDER BY name LIMIT 10 OFFSET 990;
```

MySQL is first scanning an index then retrieving rows in the table by primary key id. So it's doing double lookups and so forth. Turns out you can make this faster with a tricky thing called a deferred join.

The inside piece just uses the primary key. An explain plan shows us "using index" which we love!

```
SELECT id
FROM customers
ORDER BY name25
LIMIT 10 OFFSET 990;
```

Now combine this using an INNER JOIN to get the ten rows and data you want:

```
SELECT id, name, address, phone
FROM customers
INNER JOIN (
SELECT id
FROM customers
ORDER BY name
LIMIT 10 OFFSET 990)
AS my_results USING(id);
```

