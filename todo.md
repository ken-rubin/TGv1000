
## Ken's Issues

- Replace Blockly.

## Jerry's High Priority Issues
- From John:
    - Playing off our strength I also envision a sort of "school-net" subscription where schools all have access to the classes that teachers at other schools in the network have created on the system in some contained ecosystem that blocks out the rest of the noise that could get created in an open world like this one.  That is either a key selling point or an add on for the system.  I am thinking key selling point since the crowd sourced classes is one of our biggest differentiating factors.  I can imagine a world where we have a tag driven button (School Net) that gives them a list of all the classes that have been built in this ecosystem and they add in their other tags for Science, math, geography, etc. classes.
- Some sort of display problem in horizontal scroller in one of the image search dialogs.
- Delete (after being sure and removing references from require section at top of other modules):
    - PropertyGrid(?)
- AZUsersDialog 
    - Users tab
        - Open some fields for in-place editing: zipcode; first and last names. Timezone would be incredibly memory expensive.
        - Add reset email button? Is it necessary given that the user has a link to click on the login page?
- AZPPBuyersDialog.js
    - Buyers tab
        - Finish dropping someone from a class and optionally giving a refund thru Stripe.
        - Add an email to the user if a refund has been processed.
    - Waitlisted tab
        - Invite user, tell waitlisted user that a position has opened. Send an email with a link containing a code that has to be used within 24 hours. Only with the code can someone buy such a class. Implement all of this.
        - Allow instructor to overbook by inviting multiple waitlist people.
    - Invited tab
        - Fetch data. Do it. **Done. Test it.**
    - Display project details at top above tabs
    - Write m_setRecentRefundsTable
    - In fnRemoveBuyer add entry to m_holdData.recentRefunds and redraw that table
    - In fnInvite finish writing posting.done
    - In fnInvite if numEnrollees + numInvited < maxClassSize, suggest to admin user that class could be made active
    - Implement 1 second countdown timer in #InvitedTable
- AZProjectsDialog
    - Ability to make projects, types, methods, images, videos, sounds public, un-quarantined, etc. (AZProjectsDialog).
        - *Public* means other non-privileged users can find it.
            - What starts off as public?
            - What starts off as private?
        - All images, videos and sounds start off as *quarantined* so an admin can look at them for non-permitted content and possibly remove the quarantine.
        - All new stuff goes in as private / quarantined. If the user wants to make it public or even sell it, then they have to make a request to share it for $n. Then an admin approves and it becomes public --  with observation of quarantined material.
- Cron.js
    - Finish job2
    - Add waitlist reminder emails
    - Got a bug at 1PM.
    - 1-minute cron job to remove invited user (with email) after 24 hours and automatically invite the next person on the waitlist. **Started. Finish and test it.**
        - Handle the Accept and Decline links in the email.
    + Test the 1AM cron job that sends emails regarding upcoming classes, etc.
        * Add waitlist checking to cron. If base PP id changes, update waitlist.projectId of all matching items to new projectId.
        * Add waitlist reminders emails.
- Login++
    - Handle Accept link in invitation email: after login bring user to buy page with CC form open
- Someplace
    - Handle Decline link in invitation email
- UtilityBO.js
    - When placing charge, send our own email in addition to Stripe's
    - In routeUndoPurchase, send refund processed email if refund was processed; also probably want to return refundId with success again so that #RecentRefunds can be updated
- Finish tooltip enhancements in OpenProjectDialog.js. Actually, all that's left would involve shared public projects. A description field would be good in this case. But that whole area isn't finished or ready to be finished.
- If a privileged user is editing/saving a purchasable product that has been bought by someone (which we *do* already know in ProjectBO routeSaveProject), we need to ask the user if the changes made are breaking changes and, if so, save a new version of the project and disable the original from further purchases. Better flow: when privileged user retrieves a project that has been purchased, tell the user and have the user decide what to do before saving. This kind-of has to be up to the privileged user except in cases like deleting a comic.
    - John's idea: tell the previous buyers about the changes/bug fixes and give them the option to keep or delete the old one and get the new one for free.
- Send our own email whenever someone completes a purchase. This is in addition to the one from Stripe.
- Token/cookie expiration: After over an hour without using but with the Search for project dialog open, I get a "null" error when I try to search. This is an incorrect handling of a JWT timeout. Actually, the cookie holding the token timed out and was deleted from the client side. So no token was delivered with the Search request. This was then handled poorly. I need to do something better. See [this Stackoverflow description](http://stackoverflow.com/questions/26739167/jwt-json-web-token-automatic-prolongation-of-expiration).
    + Session extension. Should I expire JWTs in, say, 15 minutes, but issue a new one with every request? I can't find any real help about expiresIn for JWT vs maxAge for its cookie, so we'll just have to figure it out.
    + Lengthen to like 2 weeks.
    + Save project to DB with every change.

## Jerry's seldom- or non-reproducable Bugs
- I got e is not defined when trying to save a new Online Class. No error in F12. The Project was created, but when I went to save it all info beneath Search tags was missing. Created it from new again, and it worked fine. Look at SaveProjectAs.js line 274. I think specialProjectData.onlineClassData is undefined. **A bug I introduced into errorHelper caused a valid error to display this way. I've fixed that bug, so when it recurs I should be able to see what's wrong.**
- Happened several times (but not always): created new product project. Entered only name. After clicking Create Project, everything looked good (i.e., vertical scroll regions were drawn), but then got errorHelper dlg: "Cannot read property 'trim' of undefined". There is no error in the F12 console. I have no idea where this error is being thrown from. **See errorHelper bug noted above. Didn't help. Still happens sometimes to John.**
- Fetching from DB for AZUsersDialog stopped working one time after it had been working fine. Restarted server, and it worked again. Hasn't broken again.

### To consider
- Jade has been renamed to pug. Install pug in package.json instead of Jade.
- Use this code to display a Product's video (if I add that):
    ```
    <div align="center" class="embed-responsive embed-responsive-16by9">
        <video autoplay loop class="embed-responsive-item">
            <source src="http://techslides.com/demos/sample-videos/small.mp4" type="video/mp4">
        </video>
    </div>
    ```
- Consider adding paging to search results--like 100 at a time. See code sample below which shows an efficient way to do MySQL paging.
- Deleting
    + What validation is done for deleting? If a property is being used in a method, is it deletable? I know that a Type cannot be deleted if any Tool Instances exist in the Designer pane.
- Think about updating the multer npm module. We're at 0.1.8. It's up to 1.1.0.
- If a user goes from OpenProjectDialog to BuyDialog and decides not to buy and clicks the Cancel button, should I re-open OpenProjectDialog? I don't at this time.
+ Add more occurrences that display the new BootstrapDialog.confirm to make sure they want to lose possible changes to current project. Show the dialog in these cases: 
    - click "TGv1000" to return to sign-in page; should this be taken as a signout and invalidate the JWT?
    - close window or browser (possible?)
- Check that I did the radio button edits correctly in these jade files: newMethodDialog, newPropertyDialog--if they even exist in Ken's rewrite.
- **Will change with elimination of Blockly** If I drag a Tool Instance in the Designer and the App initialize method is in the Code pane, the Blockly change listener handler takes so much time that dragging is jerky--just about impossible.
    + **Ken:** With initialize blocks showing in the code pane, dragging a tool instance blanks out the code pane. It redraws after one stops dragging. This is not as desirable behavior as it was previously. Should we strive to make it display continuously?
- No projects, types, methods, properties or events can have embedded spaces. Replace with underscore. **Confirm with Ken.**
- Do we want to have to search for System Types that aren't base types for any other type? Probably. **Discuss with Ken.**
- Need rest of the dialogs to submit on Enter key.
    - These are already done:
        + EnrollDialog
        + NewEventDialog
        + NewMethodDialog
        + NewProjectDialog
        + NewPropertyDialog
        + NewTypeDialog
        + SaveProjectAsDialog
        + ImageDiskDialog
    - Still may want to do these (where it makes sense): 
        - DeleteConfirmDialog
        - GenericRenameDialog
        - ImageSearchDialog
        - ImageURLDialog
        - MethodSearchDialog
        - OpenProjectDialog
        - PropertyGrid
        - TypeSearchDialog

## A Discussion of Projects and Purchasable Projects

- A Class, a Product or an Online Class is a project that a user has to buy in order to use it. When we don't need to differentiate between the three types, we'll call them by the collective name *Purchasable Projects*.
- Free projects are called *Normal projects* or *ad hoc* projects.
- In a big change *all* projects in memory (new or searched for) contain the property specialProjectData. It contains fields that govern the UI and assist ProjectBO#routeSaveProject in knowing how to save the project. It also tells whether the project has to be bought by a normal user in order to be copied, used and saved.
- In the case of Purchasable Projects which are being edited by a privileged user or are being considered for purchase by a normal user, specialProjectData contains one of these properties: productData, classData or onlineClassData.
- specialProjectData is detailed below.
- Also note that new and searched for projects are now returned from the database with certain fields intact that used to be zeroed before. For example, project.id used to be set to 0 for a new project or a search for project belonging to another (along with the ids of just about all sub-properties of the project). This is no longer done on reading from the database, since enough information exists in specialProjectData to handle these chores back on the client side.


#### The New Project Dialog

- All new projects are created using the New Project Dialog. A privileged user will have a choice of creating a Normal project or one of the Puchasable Project types. A non-privileged user doesn't get a choice. He can create only Normal projects when using the New Project Dialog.
    + At this time all users must register to get into the site, but a registered user doesn't have to buy anything. He can create Normal projects as long as he wants.
    + Registration doesn't require a credit card. That is entered during the Purchasable Project buying process.
- A Normal project has exactly one comic. That comic contains all the help information needed to teach the clever user how to create projects starting with one of the core project types. There are currently 5 core types, but that will probably shrink to 2 or 3. I think that the comic (help) will vary a little depending upon the project type (e.g., game vs console app).
    + All projects, Normal and Purchasable, are based on one of the Core project types. These core types differ by being derived from and supplied with somewhat different System Types.
    + A core project has isCoreProject set to true, and all of isProduct, isClass and isOnlineClass are set to false.
    + The core projects are created with the database with ids 1-5. Even after editing, their ids and their comic's ids don't change.
- A normal ("non-privileged") user uses the New Project dialog to start an ad hoc project of a particular project type. That is the normal user's only choice--beyond name, tags, etc.
- When using the New Project dialog to create a new Purchasable Project, a privileged (g_profile["can_create_classes"] || g_profile["can_create_products"] || g_profile["can_create_onlineClasses"]) user selects a project type and one from: Normal project, Class, Product or Online Class. If the privileged user elects to create a Normal project, he is effectively limited to exactly what a normal user is.
- If the privileged user elects to create one of the Purchasable Project types, a specialized snippet will be inserted in the New Project Dialog. The snippet is where the privileged user enters Purchasable Project information (like schedule, cost, extended description, instructor, class location, etc., as appropriate for the Purchasable Project type).
    + While the Purchasable Project is under development, the privileged user can enter as much or as little special project data as desired. The information in the snippet is saved in clProject.data.specialProjectData.productData or .classData or .onlineClassData.
    + Saving the project results in a project being created (inserted into the DB, giving it a new id) along with a back-pointing row in classes, products or onlineclasses, as appropriate. The projects table row has one of isClass, isProduct or isOnlineProject set to true.
    + New Purchasable Projects have their active field set to 0. This means that normal users cannot buy them prematurely. An entitled user must make the project active in an AdminZone dialog before it can be accessed (searched for) by non-privleged users. This setting to active status will most likely be done by John in an AdminZone dialog.
    + Any privileged user with the correct entitlement can edit the purchasable project, adding comics, comic code, types, etc.
- **Summary**
    + A normal user creating a new project never has specialProjectData and isCoreProject, isProduct, isClass and isOnlineClass are all false.
    + A privileged user creating a new Purchasable Project will create a project with one of isProduct, isClass or isOnlineClass set to true, and at least some of specialProjectData will be filled in. A Purchasable Project cannot be made active until all requiredSpecialProject Purchasable Project data is complete and validated.
- **clProject.data.specialProjectData**
    + specialProjectData is a new property of clProject.data that exists in two cases:
        * When a privileged user creates or edits a Purchasable Project.
        * When a normal user searches for and opens a Purchasable Project before buying it.
    + specialProjectData doesn't exist in clProject.data in any other circumstance. For example, if a normal user buys a Purchasable Project, specialProjectData is removed from the project.
    + There are 2 parts to specialProjectData: (a) the data that for the project in the products, classes or onlineclasses table; and (b) information that the client side will use to enable/disable user actions in the web site along with information that will help routeSaveProject know how to save the project (i.e., insert, update, preserve ids, etc.).
        1. Data for the products, classes or onlineclasses tables is kept in clProject.data.specialProjectData.productData, ....classData or ....onlineClassData, respectively. Except for the backpointer to the project, all fields from the snippet are kept here and are written to the table. (I assume these properties will be changed/enhanced as the buying process is implemented.)
            + Class data:
            ```
                clProject.data.specialProjectData.classData = {
                    active: [bool],
                    classDescription: [str],
                    instructorFirstName: [str],
                    instructorLastName: [str],
                    instructorPhone: [str],
                    facility: [str],
                    address: [str],
                    room: [str],
                    city: [str],
                    state: [str],
                    zip: [numstr,
                    schedule: {[]},
                    level: [str],
                    difficulty: [str],
                    price: [num],
                    classNotes: [str]
                };
            ```
            + Product data:
            ```
                clProject.data.specialProjectData.productData = {
                    active: [bool],
                    productDescription: [str],
                    level: [str],
                    difficulty: [str],
                    price: [num]
                };
            ```
            + Online Class data:
            ```
                clProject.data.specialProjectData.onlineClassData = {
                    active: [bool],
                    classDescription: [str],
                    instructorFirstName: [str],
                    instructorLastName: [str],
                    instructorEmail: [str],
                    schedule: {[]},
                    level: [str],
                    difficulty: [str],
                    price: [num],
                    classNotes: [str]
                };
            ```
        2. The other information added to a new Purchasable Project looks like this:
        ```
                clProject.data.specialProjectData = {
                    privilegedUser: [bool],
                    ownedByUser: [bool],
                    othersProject: [bool],
                    normalProject: [bool],
                    coreProject: [bool],
                    classProject: [bool],
                    productProject: [bool],
                    onlineClassProject: [bool],
                    comicsEdited: [bool],
                    systemTypesEdited: [bool],
                    openMode: 'new'
                };
        ```
    + This structure is maintained whenever a Purchasable Project is opened for editing by a privileged user after initial creation and when it is opened by a normal user when making a purchase decision.


#### Use of the Open/Search for Project Dialog to find Purchasable Projects

- **Normal** users
    + Besides being able to search for one's own projects along with public projects created by others (such projects are made public only by specially entitled users--like John or an instructor), a normal user can specify that he wants to search for a Purchasable Project to consider buying it.
        * He clicks one of the Products, Classes near [zipcode] or Online Classes radio buttons. For the two types of classes, we look only for active projects scheduled to begin within 3 months. For physical classes we search within 35 miles of the zipcode that was entered.
        * He clicks Search and hopefully gets one or more projects to choose from. A fairly informative tooltip guides his choice. Remember: he hasn't bought anything yet.
        * He clicks the image of the project he wants to buy after reading a description of the project in its to-be-expanded tooltip.
        * Before he gets his copy of the Class, Product or Online Class, he, of course has to pay. But before that we'll pop up a new dialog to display a write-up of what he's chosen, play a movie, etc.
        * He clicks buy. The dialog morphs into a credit card entry form. And so forth.
        * Once he pays and the charge is approved, the user's copy of the project opens. It has already been saved to the database as that user's purchased project, so, in effect, he's now editing his own project. The project now is really a normal project, just special because it is linked to a Purchasable Project and gets its comics from that project.
    + **clProject.data.specialProjectData** for a normal user looking to buy a Purchasable Project:
        ```
                clProject.data.specialProjectData = {
                    privilegedUser: false,
                    ownedByUser: false,
                    othersProject: false,
                    normalProject: false,
                    coreProject: false,
                    classProject: [bool],
                    productProject: [bool],
                    onlineClassProject: [bool],
                    comicsEdited: false,
                    systemTypesEdited: false,
                    openMode: 'searched'
                };
        ```
- **Privileged** users
    + A privileged user has 6 choices when searching for a project to edit (he cannot buy a product):
        * A Core project--one used by users to create *ad hoc* projects.
        * One of his own projects.
        * Someone else's project, whether public or not.
        * A Class to edit (optionally entering a proximity zipcode--like the normal user, but in this case non-mandatory). This search also disregards the start date restriction.
        * A Product to edit.
        * An Online Class to edit, again disregarding the start date restriction.
    + Also, pending some more thinking, a privileged user can edit an active or inactive Purchasable Project. (See the next section for more about this.)
    + **clProject.data.specialProjectData** for a privileged user planning to edit a Purchasable Project:
        ```
                clProject.data.specialProjectData = {
                    privilegedUser: true,
                    ownedByUser: [bool],
                    othersProject: [bool],
                    normalProject: false,
                    coreProject: false,
                    classProject: [bool],
                    productProject: [bool],
                    onlineClassProject: [bool],
                    comicsEdited: false, to start
                    systemTypesEdited: false, to start
                    openMode: 'searched'
                };
        ```



#### The Save Project Dialog for Purchasable Projects

- *3 cases:*
    1. The first save of a newly created Purchasable Project by the privileged user who created it.
        + Some portion of special project data has been entered. Maybe just a little. Maybe all of it.
        + But the project is not discoverable by any but privileged users until (a) all special project data is filled in; (b) the project's comics, comic code, types, etc. have been certified as complete by Ken, John or Jerry; and (3) the project is changed to *active* by John.
        + The save consists of inserting a row into the projects table and one into one of the Purchasable Projects special tables: products, classes or onlineclasses. Rows in these tables point back to their new project.
        + When the new project was opened from one of the Core projects, it brought along that Core project's single comic. That comic can be retained, altered or deleted. Additional comics can have been added. I think it would be good to use the Core project's comic as some sort of all-inclusive help appendix and completely replace it as far as the Purchasable Project is concerned. We'll have to think about how to structure that.
        + At any rate, comics, comic code, types, etc. are all saved as **new** rows in their respective tables when the Purchasable Project is first saved.
        + project.isCoreProject is set to 0 in the database and one of isClass, isProduct or isOnlineClass is set to 1. This is what allows us to find it later when someone, for example, looks for all Products with the tag "Robot".
    2. Subsequent saves of an opened Purchasable Project when opened by a privileged user for editing. 
        + The entire project can be saved via cascading deletion and re-insertion into the database, since no one has made use of or copied the project yet.
    3. The first save of a newly purchased Purchasable Project by a normal user. 
        + This project is saved without the Purchasable Project's special project data, but a field is kept in the new project that points back to the source of the project. 
        + All 4 fields (isCoreProject, isClass, isProduct and isOnlineClass) are set to 0. 
        + The saved project also points to the comics and comic code of the Purchasable Project, but copies are made of all types, methods, etc. Since types traditionally point to comics and comics now point only to their original project, types have been modified to point to both their comic and their project.



#### Working with a Purchasable Project, whether just created or opened from search by a privileged user

- It is expected that a Purchasable Project will have multiple comics, each of which will start with the project in the final state of the comic that preceded it.
- Tools will be provided to the privileged user who has created or opened the Purchasable Project to build that project, to add additional comics and to add the comic code to each comic that will guide the user along the path of achieving the desired end state of each comic.
- As will be seen below, a normal user who buys a Purchasable Project gets a copy of the project that points back to the comics that exist only on the Purchasable Project. Therefore, when making changes to a Purchasable Project that has been bought buy one or more users, we'll have to take special steps to update those bought projects. Either that (difficult) or we don't allow editing of a Purchasable Project once anyone has bought it (not likely, since we'll probably discover problems as people use them).
- Implement purchase system for Products, Classes and Online Classes
    + Online classes will require translation from UTC
    + When project has been fetched after its selection in Hor. Scroll Strip in Search for/Open project, if it is a purchasable project with a price > 0, the Open Project Dialog will be replaced with a page that is built with the Product, Class or Online Class extra data. The page will contain everything entered by the project designer and the user will then decide whether or not to complete the purchase. If not, the project is cleared. If so, the project is saved in the background so it belongs to the user forever.
- After search for and retrieving a project, all of the new special fields have to be added to influence processing permissions. Also, these processing permissions have to be implemented.
    + Also have to record if comics or System types had been changed. This will tell ProjectBO whether or not to update them.
- Need to update routeSaveProject wrt permission, classes, etc.




## Comics / Help

- The comics:
    + Will actually be run by (interpreted by) Ken and drawn over the same canvas as his code.
    + We will use an Albert Inestine ("AI") icon to "speak" and do things.
    + A comic will be a series of steps for AI to follow.
    + Ken will put meta-information ("m-i") into his code and AI will be able to refer to that m-i to move and interact with the code pane.
    + AI will speak with the user via a text bubblenear his icon or in, say, a rectangle in the top right corner of the pane. Or maybe we'll find a text-to-speech engine.
    + AI will have several modes, depending on the amount of help the user needs.
- AI commands
    + Appear
    + Disappear
    + Move []
    + Point []
    + Say "..."
        + AI speaks in a bubble; the bubble is either a cartoon bubble or a rectangle in the corner; it has a way for the user to close it; perhaps it will have a way for the user to read the content out loud
    + Quiet [n]
        + Close the bubble after n ms; 0 means stay open until user closes bubble
    + Click []
    + ClickDrag [] to []
    + Home
    + End
    + DClk
    + Bksp
    + Bksp*
        + Erases everything to the left
    + Type "..."
    + Start comic n
    + Test code state
    + Ctrl-Z
    + Show me slowly
    + Do it for me
    + Teach me
    + Why?
- Users with can_edit_comics permission can work on comics.
    + The user opens a project.
    + The project contains 1+ comics. The comics still show up in the vertical strip on the right. A comic (in the DB) has an image and an id. There is another table, comiccode, that has these fields:
        + id
        + description
        + comicId
        + ordinal
        + JSONsteps
    + 


## To discuss

- When they click the link in the p/w reset email, there are usually two tabs open for TechGroms. (1) What harm does this do? (2) Can we close the other (or re-use it)? **How about closing it when the e-mail is generated?** Doesn't seem possible to close the windo using javascript. **Discuss with Ken & John.**
- Do we want to (or can we) round X,Y to 0, 1 or 2 decimals?
- All: If someone buys a project/type/method, we want them to be able to modify/extend it. What's to keep their friend from copying it for free? We can keep them from retrieving a project that had a price, since it points back to a classOrProduct with a price.
- A New SystemType should probably require an image. **Discuss with Ken.**
- **Ken:** If I open a new project, the App Type is the Current Type and initialize is the Current Method, but, since we don't display app_initialize or the getter and setters for X, Y, Width and Height, the App category doesn't even appear in the schema category list.
    - If I add a 2nd method to the App Type, App now shows up, since it has something useful to display.
    - The problem is that, if I then delete this method, the App category is still there, but clicking it show no draggable blocks becuae there aren't any. Does this behavior bother you?



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

### Getting (close to) real
#### Base Types (classes) and Project types
- We have decided to move toward being able to create these Project types (starting with ???):
    - Game
    - Console application
    - Web site
    - HoloLens game
    - Google maps API use
- There will be one Type in initial data for each of these Project types.
- Any Type can (but doesn't have to) be derived from a single other Type (adding a baseTypeId column). 
- App Types will be derived from one of the base Types listed above. This is what actually creates a Project of one of these types.
- The base Types will, for example, contain the physics engine, a web design framework, etc.
- *It is undecided if system types should appear in the ToolStrip for everyone.* They cannot be dropped on the Designer. But will it be necessary to make one the active type? Maybe for our dev mode, but not for regular users.
#### Methods
- Statements and Expressions
    - Statements are Methods that are visually represented in the Blockly code pane with a top triangular indentation and a bottom triangular extension. This way statements can be stacked together to provide program flow.
    - Expressions are Methods that are visually represented with a left-facing triangular extension. This way they fit into other blocks that need to provided with calculated data.
    - Statement-type Methods may take parameters, but they cannot return a value.
    - Expressions may take parameters and they return a value.
- Parameters
    - A Method's parameters are entered as a comma- or space-separated string of parameter names.
    - This string of names will be normalized, checked for duplicates and stored concatenated, space-separated in a single column of the methods DB table.
    - The parameters are used in the blockly blocks XML and JavaScript as in [this example](http://165.225.132.154/work/Coder/).
- Construct method
    - The App Type always has an *initialize* method, but up till now none of the other Types would start with a default method. We are adding the *construct* method to every Type--even the App Type. We will decide later if the method is initialized by the system or if the user just uses it as a constructor that is executed when the Type is *newed*.
- In case of manipulation of the method in the code pane by manipulating blockly blocks:
    - It's not just the workspace that has changed.
    - This method's name, parameters, even method type could have changed.
    - We will examine the workspace and adjust what needs adjusting.
    - The big problem is that the user might have changed the function name to
    - one that already exists. We'll handle this by changing the name slightly and
    - informing the user if necessary.
    - And everything has to be done quickly, because we're getting called on every keystroke, drag (pixel?), etc.
    - We have to remove any chaff--stuff that's not formally part of the method that the user might have left in.
    - For example, a second block.
    - Examples of strWorkspace:

    (1) procedures_defnoreturn with nothing extraneous:

        <xml xmlns="http://www.w3.org/1999/xhtml">
            <block type="procedures_defnoreturn">
                <mutation>
                    <arg name="self"/>
                    <arg name="Param1"/>
                </mutation>
                <field name="NAME">Print</field>
                <statement name="STACK"> (guts of the method)                
                    <block type="text_print">
                        <value name="TEXT">
                            <block type="variables_get">
                                <field name="VAR">Param1</field>
                            </block>
                        </value>
                    </block>
                </statement>
            </block>
        </xml>

    (2) procedures_defreturn with nothing extraneous:

            <xml xmlns="http://www.w3.org/1999/xhtml">
                <block type="procedures_defreturn">
                    <mutation>
                        <arg name="self"/>
                        <arg name="P1"/>
                        <arg name="P2"/>
                        <arg name="P3"/>
                    </mutation>
                    <field name="NAME">M2</field>
                    <value name="RETURN">
                        <block type="math_arithmetic">
                            <field name="OP">ADD</field>
                            <value name="A">
                                <block type="variables_get">
                                    <field name="VAR">P1</field>
                                </block>
                            </value>
                            <value name="B">
                                <block type="math_arithmetic">
                                    <field name="OP">DIVIDE</field>
                                    <value name="A">
                                        <block type="variables_get">
                                            <field name="VAR">P2</field>
                                        </block>
                                    </value>
                                    <value name="B">
                                        <block type="variables_get">
                                            <field name="VAR">P3</field>
                                        </block>
                                    </value>
                                </block>
                            </value>
                        </block>
                    </value>
                </block>
            </xml>

    (3) procedures_defreturn with an extraneous block at the end:

            <xml xmlns="http://www.w3.org/1999/xhtml">
                <block type="procedures_defreturn">
                    <mutation>
                        <arg name="self"/>
                        <arg name="P1"/>
                        <arg name="P2"/>
                        <arg name="P3"/>
                    </mutation>
                    <field name="NAME">M2</field>
                    <value name="RETURN">
                        <block type="math_arithmetic">
                            <field name="OP">ADD</field>
                            <value name="A">
                                <block type="variables_get">
                                    <field name="VAR">P1</field>
                                </block>
                            </value>
                            <value name="B">
                                <block type="math_arithmetic">
                                    <field name="OP">DIVIDE</field>
                                    <value name="A">
                                        <block type="variables_get">
                                            <field name="VAR">P2</field>
                                        </block>
                                    </value>
                                    <value name="B">
                                        <block type="variables_get">
                                            <field name="VAR">P3</field>
                                        </block>
                                    </value>
                                </block>
                            </value>
                        </block>
                    </value>
                </block>
                <block type="logic_ternary"/>    <---- ignore extra block.
            </xml>

    (4) procedures_defreturn with an internal statement (and the return):

            <xml xmlns="http://www.w3.org/1999/xhtml">
              <block type="procedures_defreturn">
                <mutation>
                  <arg name="self"></arg>
                  <arg name="P1"></arg>
                  <arg name="P2"></arg>
                  <arg name="P3"></arg>
                </mutation>
                <field name="NAME">M2</field>
                <statement name="STACK">    <----- the guts of the method
                  <block type="text_print">
                    <value name="TEXT">
                      <shadow type="text">
                        <field name="TEXT">abc</field>
                      </shadow>
                    </value>
                  </block>
                </statement>
                <value name="RETURN">       <----- the return
                  <block type="math_arithmetic">
                    <field name="OP">ADD</field>
                    <value name="A">
                      <block type="variables_get">
                        <field name="VAR">P1</field>
                      </block>
                    </value>
                    <value name="B">
                      <block type="math_arithmetic">
                        <field name="OP">DIVIDE</field>
                        <value name="A">
                          <block type="variables_get">
                            <field name="VAR">P2</field>
                          </block>
                        </value>
                        <value name="B">
                          <block type="variables_get">
                            <field name="VAR">P3</field>
                          </block>
                        </value>
                      </block>
                    </value>
                  </block>
                </value>
              </block>
            </xml>  


    So, this is the main structure:

            <xml xmlns="http://www.w3.org/1999/xhtml">
              <block type="procedures_defreturn">
                <mutation>
                    <arg> elements with parameters
                </mutation>
                <field name="NAME">method name</field>
                <statement name="STACK">
                    <block> with guts </block>
                </statement>
                
            procedures_defreturn adds the following return block here:
                <value name="RETURN">
                    <block> with return items </block>
                </value>                                

              </block>
            </xml>

#### Events
- Events are basically named pointers to Methods.
- Events support a subscribe/raise model.
#### Database changes
-  The database script changes below will necessitate dropping your current TGv1000 schema and recreating it with the updated *scriptnew.sql*.
-  Basic implementation of base types in the database to faciliate retrieving and saving projects.
    -  User-created Types may only derive from other user-created Types. As such, they will always be in the same Comic and can be retrieved by using a select with a match on comicId. (Ordering is an issue that can be handled outside the query.)


### The TypeWell

#### The TW Header and especially identification of the active Method
- There will nearly always be an active Type. Only when there is no project is there no active Type. Initially, the active Type is set to the App Type in the active Comic.
- The TypeWell header displays the name of the active Type. This changes (1) when a Tool in the left vertical toolstrip is clicked or (2) when a new Type is added (or loaded from the DB--the only possible way to add a new Type that would have methods).
- There is not always an active Method in the Active Type. But, if there are any methods, one will always be active. Only a Type with 0 Methods has no active Method. If there is no active Method, the name in the TypeWell header displays as *n/a*.
    - If there is no active Method, nothing should display in the Code pane--not the schema categories or the blocks representing a method.
    - If there is an active Method, the schema categories display down the left side of the code pane and the blocks representing the Method, if any, display in the middle of the code pane.
    - An active Method is signaled by types.m_iActiveMethodIndex > -1.
    - **When there is an active Method, any manipulation of its code blocks in the code pane must be saved to the method's workspace property whenever it changes.**
- The following table describes when there should be an active Method (and a couple of other aspects):

<table>
    <tr>
        <td>Event that just occurred</td>
        <td>Results in an active Method</td>
        <td>Results in no active Method</td>
        <td>Status</td>
    </tr>
    <tr>
        <td>Code block is manipulated</td>
        <td>X</td>
        <td></td>
        <td>Works: this results in immediate saving of XML to method.workspace.</td>
    </tr>
    <tr>
        <td>New Project</td>
        <td>X</td>
        <td></td>
        <td>Works--and App Type initialize method is clicked, displaying it in the code pane. (Even though at this point it has no blocks.)</td>
    </tr>
    <tr>
        <td>New Tool selected</td>
        <td>X</td>
        <td></td>
        <td>Works--and clicks 0th method to fill code pane if one exists; else, clears code pane block area, but displays schema categories.</td>
    </tr>
    <tr>
        <td>Add a Type</td>
        <td></td>
        <td>X</td>
        <td>Works--clears code pane if there had been an active Method or keeps it clear if not. The new Type, of course, has no Methods.</td>
    </tr>
    <tr>
        <td>Type loaded from DB</td>
        <td>X</td>
        <td>X</td>
        <td><div><strong>Delay testing for now.</strong> It will click on the Type's first method if one exists to load the code pane. If no Method exists, clears code pane.</div></td>
    </tr>
    <tr>
        <td>Click on Method in table</td>
        <td>X</td>
        <td></td>
        <td>Works. Displays code pane with schema info and, if non-empty, the method's blocks.</td>
    </tr>
    <tr>
        <td>Add new Method</td>
        <td>X</td>
        <td></td>
        <td>Works--auto-clicks the new Method; shows code pane schema info but no blocks to start.</td>
    </tr>
    <tr>
        <td>Rename active Method</td>
        <td>X</td>
        <td></td>
        <td>Works. Changes TW header (and anything in schema, etc.). Keeps the code pane loaded.</td>
    </tr>
    <tr>
        <td>Rename inactive Method</td>
        <td>X</td>
        <td></td>
        <td>Works. Does the schema mods. Clicks on the renamed Method, filling the code pane.</div></td>
    </tr>
    <tr>
        <td>Delete a Method</td>
        <td>X</td>
        <td></td>
        <td><div>Works. Selects the next method down (or up, I think, if this was the last) to display in the code pane. Clears the code pane if no more methods. <strong>Check that a method in use prevents deletion.</strong></div></td>
    </tr>
    <tr>
        <td>Open an existing Project</td>
        <td>X</td>
        <td></td>
        <td><div><strong>To be done. Or maybe it will just work.</strong> Select the App type's initialize method and display in code pane.</div></td>
    </tr>
</table>

#### TypeWell Properties

#### TypeWell Events

### Blockly schema structure and maintenance
- The default Blockly schema contains function and data blocks arranged in these categories: Global, Event, Control/If, Control/Loops, Logic, Math, Lists, Text, Variables and Functions. These blocks are dragged and combined on the Code frame to create workspace methods. The names of blocks that we create are added to self.schema in Code.js and marked *true* (meaning that they are available for use) and their corresponding code is added to self.blocks and self.javaScript.
- The App Type is structured slightly differently from subsequent Types. It is created with only this one block initially:
    - App_initialize using []
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
- **Ken: At the present time App_initialize is created. Is this needed?**
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

## How to configure MySQL Workbench access to www.techgroms.com after re-installing locally

### Wasn't necessary after I uninstalled 5.7 and installed 5.7.11. Luckily. But if it's ever necessary, I'll put everything here.