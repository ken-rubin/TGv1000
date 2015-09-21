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



## To discuss

- If someone buys a project/type/method, we want them to be able to modify/extend it. What's to keep their friend from copying it for free?We can keep them from retrieving a project that had a price, since it points back to a classOrProduct with a price.


## Documentation of various things

### General description of XML and Javascript
1. Types contain a collection of named Methods. Methods have a workspace property. This property is the representation in XML of the Method's functionality. The XML translates into actual Javascript code that executes when the method is called.
    + The Type with property isApp === true (known as the 'App Type') always has a special method called "initialize" that describes/creates the configuration in the Designer frame.
    + All other Methods, whether in the App Type or any other Types, have been constructed manually by the user by dragging components out of the code schema and manipulating their arrangement and variables.
2. The code schema setup is maintained by working with self.blocks, self.javaScript and self.objectTypes in Code.js. The code schema functions as it it is a C# or C++ class defintion. The code in the methods instantiates these classes and works with those objects. So, code schema = class definition. Method workspace = class instantiation and use.
3. Keeping the code schema and workspace XML in sync and complete while Types, Tools, Methods, Properties and Events are being manipulated by the user is really our only goal when we discuss Type, Method, etc. maintenance.


#### Types
##### Add
1. Types.js self.addItem calls code.addType(clType) after the Type is added to the m_arrayClTypes[].
2. Code.js self.addType(clType) calls:
    + m_functionAdd_Type_New. This sets: 
        + self.blocks["new_" + type.data.name]
        + self.javaScript["new_" + type.data.name]
        + objectTypes[type.data.name]
    + m_functionAdd_Type_Property for each of clType's properties--X, Y, Width and Height. This sets:
        * self.
    + m_functionAdd_Type_Method for each of clType's method--none for a new Type. But at some point it sets:
        * self.
    + events will be added (not done yet)
    + \#BlocklyFrame is reloaded.
3. The Type is added as a Property of the App Type. This causes....
##### Rename
##### Delete

#### Tool Instances
##### Create--Drop a Tool onto the Designer
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

