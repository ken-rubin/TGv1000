## Either of us
- Get rid of bootstrap tool-tips, replace with good
- Events!
- Round X,Y to 0, 1 or 2 decimals (Are they pixels? If so, why not 0 decimals?)
- Comic should slide in from the right, taking up half the screen; slide back out to strip-size when appropriate or click away; remember where they were in comic

## Ken

- Finish and integrate Coder
- [If possible] Click on the app Type's initialize method. All the Types are listed on the left-hand side of the code window. Make them like Control; i.e., [arrowhead] Types that opens on a click to reveal all the Types or no [arrowhead] and just display them all as Blockly blocks. 
- Resizing in the two vertical scroll regions has lost aspect ratio. Toolstrip for sure.
- In Code.js m_functionAdd_Type_Event (which is commented out) the 4 called methods do not exist.


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



## To discuss

- If someone buys a project/type/method, we want them to be able to modify/extend it. What's to keep their friend from copying it for free?We can keep them from retrieving a project that had a price, since it points back to a classOrProduct with a price.


## General description of programming using our system
A Type is our equivalent of a class in a standard programming language (C# or C++). Like a class it consists of methods, properties and events. A Type's methods can use (instantiate) another Type to access or manipulate its contents.  The method also has access to a "this" reference and any specified parameters.

1. Projects are built in discreet steps called "comics". Think of comics as the steps a programmer goes through while a program is evolving. Each comic contains a set of Types. Usually comic[n+1] will contain all of the Types from comic[n] with more functionality fleshed out in certain Types. Also, comic[n+1] may have one or more additional Types than comic[n]. Every comic has an automatic Type called *App*. A new project contains one comic with one Type, the App type.
    - The App Type has a property *isApp* that is set to *true*. Only one Type in a comic can have isApp=true. The App Type can be renamed because of its isApp property.
    - The App Type can never be dragged onto the Designer surface.
2. Types contain a collection of named Methods, each of which has a *workspace* property. This property is the representation (in XML) of the Method's functionality. The XML gets translated into actual Javascript code that executes when the method is called. A Method can also be an event handler. (Parameters are going to be added to Methods soon.) The user never interacts with the XML *per se*. He "programs" methods by one or more of these techniques:
    - dragging and dropping a Type onto the Designer frame (creating a Tool instance)
    - manipulating a Tool instance's properties in code or in a property maintenance grid
    - using blockly schema actions to string operations together by dragging, dropping and arranging elements in the code pane
3. The App Type always has a special method called *initialize* that describes/creates the configuration of the Designer frame as a comic is set to run status.
4. All other Methods, whether in the App Type or any other Types, have been constructed manually by the user by dragging components out of the code schema and manipulating their arrangement and variables via Blockly functionality.
5. The code schema setup is maintained by working with self.blocks, self.javaScript and self.schema in Code.js in response to user actions in the site.

Keeping the code schema and workspace XML in sync and complete while Types, Tools, Methods, Properties and Events are being manipulated (added, removed, renamed, etc.) by the user is really our only goal when we discuss Type, Method, etc. maintenance--as we are doing in this section. Everything else is run-time detail.

To summarize, the sections below describe how our code manipulates each Method's workspace XML and the schema components (to which the XML workspaces refer) as the user performs adding, deleting, renaming, etc. actions on Types, Methods and Properties.

### Data structures and the source code
#### Schema data
- The default Blockly schema contains function and data blocks arranged in these categories: Global, Event, Control/If, Control/Loops, Logic, Math, Lists, Text, Variables and Functions. These blocks are dragged and combined on the Code frame to create workspace methods. The names of blocks that we create are added to self.schema in Code.js and marked *true* (meaning that they are available for use) and their corresponding code is added to self.blocks and self.javaScript.
- The App Type is structured slightly differently from subsequent Types. It is created with only this one block initially:
    - App_initialize using [] **Ken: should this be created in the schema?**
- Each additional Type has a block *new_typename* that is used to instantiate the type and a getter and a setter for each of its properties (X, Y, Width and Height being each Type's defualt initial properties). Since a new Type has no methods to start), there is initially no block analogous to the *App_initialize* block in the preceding list. For example, the Type named *Apple* is created with these blocks:
    - new_apple
    - Apple_getX from [var]
    - Apple_setX in [var1] to [var2]
    - Apple_getY from [var]
    - Apple_setY in [var1] to [var2]
    - Apple_getWidth from [var]
    - Apple_setWidth in [var1] to [var2]
    - Apple_getHeight from [var]
    - Apple_setHeight in [var1] to [var2]
- If the Apple Type is dragged onto the designer surface, it is added as a Property of the App Type and 2 additional blocks are added to the App category (just as any new Property of a Type results in a getter and a setter being created):
    - App_getApple
    - App_setApple to [var]
- As stated above, adding a new Method to any Type will result in adding a block to that Type similar to *typename_methodname using [method]*.
- Again, adding a Property to any Type will result in adding both a getter and a setter to that Type. The getter and setter will conform to the scheme that creates slighly different blocks for App Types and other Types.
- *As you can well imagine, renaming, deleting and adding Types, Methods and Properties all need to maintain the integrity of the abovementioned data.*
#### The *initialize* Method of the App Type
- The *initialize* Method of the App Type is special. It relects the user's actions on the Designer surface; that is, it builds what the user wants the initial state of the comic to be when it is run. Assume a comic has 3 Types: App, A and B, that A and B are minimal Types (no added Properties, Methods or Events) and that the user has dragged one each of A and B onto the Designer surface (creating Tool Instances A and B). Note: the App Type cannot be dragged onto the Designer surface. Here's a summary of what things contain:
    - A and B have been added as Properties of the App Type.
    - A and B are categories in Code.js self.schema and their 9 blocks exist in self.blocks and self.javaScript.
    - A getter and a setter for each of A and B have been added as blocks of the App Type.
    - The *initialize* Method has commands (in XML) to create A and B and to position them where the user dropped them with the size that is their default or has been adjusted by the user.
- Now let the user drag a second instance of the A Type onto the Designer surface. Each dragged Type is an instantiation of a class (or Type). This second instance of A is given a unique name (A2 for now). Here are all the actions the program takes to memorialize this action:
    - A getter and a setter for A2 are added to the App Type.
    - 5 segments of XML are added to the App Type's initialize method:
        1. App_setA2 to new A (instantiate an A and call it *A2*)
        2. A_setX in App_getA2 to [x coordinate] (use the setX method in class A to set X in instance A2)
        3. Similar for Y.
        4. Similar for Width.
        5. Similar for Height.
#### Additional Methods of the App Type and all Methods of other Types
- The blocks in Code.js self.blocks and self.javaScript are used to build up the Method workspace XML.
 
**Remember: maintenance of anything requires global maintenance of the XML workspace docs.**


#### Type - all DONE
##### Add - DONE
- types.addItem(clType)
    * code.addType(clType)
        * m_functionAdd_Type_New(clType) (skip this code for the App Type)
            * add self.blocks["new_" + clType.data.name] and set it to a function string
            * add self.javaScript["new_" + clType.data.name] and set it to a javaScript string
            * add property "new_" + clType.data.name to self.schema.Types[clType.data.name] and set = true (a Category for the Type; create self.schema.Types if it doesn't exist)
        * for each property in the Type (skipping X,Y,Width,Height for the App Type) call m_functionAdd_Type_Property(clType, property)
            * set strGetName = clType.data.name + "_get" + property.name
            * set strSetName = clType.data.name + "_set" + property.name
            * the property's getter
                - add self.blocks[strGetName] and set it to a function string (different for App Type and all other Types)
                - add self.javaScript[strGetName] and set it to a javaScript string (different for App Type and all other Types)
                - set self.schema.Types[clType.data.name][strGetName] = true
            * the property's setter
                - add self.blocks[strSetName] and set it to a function string (different for App Type and all other Types)
                - add self.javaScript[strSetName] and set it to a javaScript string (different for App Type and all other Types)
                - set self.schema.Types[clType.data.name][strSetName] = true
        * for each method in the Type call m_functionAdd_Type_Method(clType, method)
            * set strName = clType.data.name + "_" + method.name
            * add self.blocks[strName] and set to function string
            * add self.javaScript[strName] and set to javaScript string
            * set self.schema.Types[clType.data.name][strName] = true
        * for each event in the Type call m_functionAdd_Type_Event(clType, event)
            * *not finalized yet*
##### Rename - DONE
##### Delete - DONE
- Delete a Type that doesn't have a TI in the designer: looks good
- Delete a Type that does have a TI in the designer: good--makes user delete each TI from designer first

#### Tool Instance - all DONE
##### Drop a Tool onto the Designer - DONE
##### Delete (undrop) a Tool from the Designer - DONE
##### Rename - DONE

#### Method
##### Add - DONE
- For Method M in Type T, adding the method creates the "function call" T_M using [] in category T.
- This function call can then be dragged into any Method in any Type.
- **Ken: At the present time App_initialize is created. Is this needed? (same question as above)**
##### Rename
- Check Type rename - DONE
    - In schema - worked when renamed App; 
    - In workspaces - worked when renamed !App Type
- Check Method rename
    - In schema - worked
    - In workspaces - need to test more
##### Delete
- Check Type deletion
    - In schema
    - In workspaces
- Check Method deletion
    - In schema
    - In workspaces

#### Property
##### Add - DONE
##### Rename
##### Delete
##### Change property type

#### Event
##### Add
##### Rename
##### Delete


### Validator.js
Name validation is being systemetized and consolidated into /Core/Validator.js. Types of validation to be checked are: name collisions, reserved word use and reserved character use. Checks in Validator.js will be run when new items are created and when existing items are renamed. Validator.js in instantiated in main.js and is available in the global namespace as *validator*.

*I noticed I am not calling reserved character checking. I want to implement an intelligent dispatcher in Validator.js that is called once with enough information to do all proper internal calls.*
#### Name collisions
- A user's Projects must have unique names. This is checked at project save time, not in Validator.js (at this time).
- A Type name may be used only once in a comic.
- A Type name may not be the same as a Tool Instance name in the same comic.
- A Tool Instance may not 
#### Reserved words
- X, Y, Width and Height are not allowed as Type or Tool Instance names.
#### Reserved characters
- At this time the only reserved character is the double quote (\").
#### Implementation status
##### Key
- **Complete** -- complete and in Validator.js
- **Done** -- done, but not moved into Validator.js
- **Started**

<table>
    <tr>
        <td>Item</td>
        <td>New</td>
        <td>Rename</td>
    </tr>
    <tr>
        <td>Project</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>Comic</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>Type</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>Method</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>Property</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>Event</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>Tool Instance</td>
        <td></td>
        <td></td>
    </tr>
</table>


## Just saving this here for possible implementation of ScrollRegion paging

### Using Deferred Join for Paging

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

