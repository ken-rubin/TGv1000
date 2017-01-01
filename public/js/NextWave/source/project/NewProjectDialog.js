///////////////////////////////////////
// NewProjectDialog module.
//
// Gui component responsible for 
// creating a normal project or a purchasable project.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/settings",
    "NextWave/source/utility/Point",
    "NextWave/source/utility/Size",
    "NextWave/source/utility/Area",
    "NextWave/source/utility/DialogHost",
    "NextWave/source/utility/List",
    "NextWave/source/utility/PictureListItem",
    "NextWave/source/utility/RadioListItem",
    "Core/errorHelper", 
    "Core/resourceHelper"
    ],
    function (prototypes, settings, Point, Size, Area, DialogHost, List, PictureListItem, RadioListItem, errorHelper, resourceHelper) {

        try {

            // Constructor function.
            var functionRet = function NewProjectDialog() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from DialogHost.
                    self.inherits(DialogHost);

                    ///////////////////////
                    // Public methods.

                    // Attach instance to DOM and initialize state.
                    // arrayAvailProjTypes is used to get the images from which the user chooses the project type to create.
                    // It is an int array containing 1-6 (perhaps a subset for normal users; all 6 for priv. users), corresponding to 
                    // 1 game project
                    // 2 console project
                    // 3 website project
                    // 4 hololens project
                    // 5 mapping project
                    // 6 empty project
                    self.create = function (arrayAvailProjTypes) {

                        try {

                            if (!arrayAvailProjTypes) {
                                return null;
                            }

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "NewProjectDialog: Instance already created!" };
                            }

                            //      A normal user starts in mode 'Sel Proj Type-normal user' and goes to mode 'Normal proj' on image click.
                            //      A privileged user starts in mode 'Sel Proj Type-priv user' and goes to mode 'Normal proj', 'Classroom class proj1', 'Online class proj1' or 'Product proj1',
                            //      depending on the button clicked (eventually may be radio buttons and a continue button).
/*                                
Controls arranged by Mode

'Sel Proj Type-normal user'
    instructions1       Label
    projectTypes        ListHost	self.dialog.setMode('Normal proj')
    cancelButton        Button

'Sel Proj Type-priv user'
    instructions1       Label
    projectTypes        ListHost
    instructions2       Label
    If I had radio buttons for the next 4 buttons, I'd add the Next button and enable it when an image is selected and a radio choice is made.
	ncopChoice			ListHost
    nextButton          Button		self.dialog.setMode('Normal proj' or 'Classroom class proj1' or 'Online class proj1' or 'Product proj1', depending on m_projectModeId)
    cancelButton        Button

'Normal proj'
    instructions3       Label
    instructions4       Label
    nameLabel           Label
    nameEdit            Edit
    descriptionLabel    Label
    descriptionEdit     Edit-multiline
    projectImageLabel   Label
    projectImage        Picture
    imageSearchButton   Button
    urlSearchButton     Button
    fileSearchButton    Button
    backButton          Button		if (normal user) setMode('Sel Proj Type-normal user') else setMode('Sel Proj Type-priv user')
    createProjectButton Button
    cancelButton        Button

'Classroom class proj1'
    instructions3       Label
    instructions4       Label
    nameLabel           Label
    nameEdit            Edit
    descriptionLabel    Label
    descriptionEdit     Edit-multiline
    projectImageLabel   Label
    projectImage        Picture
    imageSearchButton   Button
    urlSearchButton     Button
    fileSearchButton    Button
    backButton          Button		setMode('Sel Proj Type-priv user')
    nextButton          Button
    cancelButton        Button

'Classroom class proj2'
    instructions5       Label
    nameLabel2          Label
    first set of fields for classroomClass (instructor, phone, level, difficulty, price, max class size, loaner computers available, notes)
    backButton          Button
    nextButton          Button
    cancelButton        Button

'Classroom class proj3'
    instructions6       Label
    nameLabel2          Label
    second set of fields for classroomClass (location 6 fields, class schedule)
    backButton          Button
    createProjectButton Button
    cancelButton        Button

'Online class proj1'
    instructions3       Label
    instructions4       Label
    nameLabel           Label
    nameEdit            Edit
    descriptionLabel    Label
    descriptionEdit     Edit-multiline
    projectImageLabel   Label
    projectImage        Picture
    imageSearchButton   Button
    urlSearchButton     Button
    fileSearchButton    Button
    backButton          Button		setMode('Sel Proj Type-priv user')
    nextButton          Button		setMode('Online class proj2')
    cancelButton        Button

'Online class proj2'
    instructions5       Label
    nameLabel2          Label
    first set of fields for classroomClass (instructor, email, level, difficulty, price, notes)
    backButton          Button		setMode('Online class proj1')
    nextButton          Button		setMode('Online class proj3')
    cancelButton        Button

'Online class proj3'
    instructions6       Label
    nameLabel2          Label
    second set of fields for classroomClass (location 6 fields, class schedule)
    backButton          Button		setMode('Online class proj2')
    createProjectButton Button
    cancelButton        Button

'Product proj1'
    instructions3
    instructions4
    nameLabel
    nameEdit
    descriptionLabel
    descriptionEdit
    projectImageLabel
    projectImage
    imageSearchButton
    urlSearchButton
    fileSearchButton
    backButton          Button		setMode('Sel Proj Type-priv user')
    nextButton          Button		setMode('Product proj2')
    cancelButton        Button

'Product proj2'
    instructions6       Label
    nameLabel2          Label
    fields for product proj (level, difficulty, price)
    backButton          Button		setMode('Product proj1')
    createProjectButton Button
    cancelButton        Button
*/

                            let objectConfiguration = 
                            {
                                    instructions1: {
                                        type: "Label",
                                        modes: ['Sel Proj Type-normal user','Sel Proj Type-priv user'],
                                        text: "Choose the type of Project you wish to create by clicking on its picture.",
                                        x: settings.general.margin,
                                        y: 5 * settings.general.margin,
                                        widthType: "reserve",
                                        width: 2 * settings.general.margin,
                                        height: settings.dialog.lineHeight                                  
                                    },
                                    projectTypes: {
                                        type: "ListHost",
                                        modes: ['Sel Proj Type-normal user','Sel Proj Type-priv user'],
                                        constructorParameterString: "false",
                                        x: settings.general.margin,
                                        y: settings.general.margin + 
                                            2 * settings.dialog.lineHeight,
                                        widthType: "reserve",
                                        width: 2 * settings.general.margin,
                                        height: 100
                                    },
                                    instructions2: {
                                        type: "Label",
                                        modes: ['Sel Proj Type-priv user'],
                                        text: "As a privileged user, besides being able to create Normal projects, you are allowed to create a Class, an Online Class or a Product. Choose here:",
                                        x: settings.general.margin,
                                        y: settings.general.margin + 
                                            2 * settings.dialog.lineHeight + 120,
                                        widthType: "reserve",
                                        width: 2 * settings.general.margin,
                                        height: settings.dialog.lineHeight                                  
                                    },
                                    ncopChoice: {
                                        type: "ListHost",
                                        modes: ['Sel Proj Type-priv user'],
                                        constructorParameterString: "true",
                                        x: settings.general.margin + 
                                            2 * settings.dialog.firstColumnWidth,
                                        y: settings.general.margin + 
                                            3 * settings.dialog.lineHeight + 130,
                                        width: settings.dialog.firstColumnWidth,
                                        height: 5 * settings.dialog.lineHeight                                  
                                    },
                                    instructions3: {
                                        type: "Label",
                                        modes: ['Normal proj','Classroom class proj1','Online class proj1','Product proj1'],
                                        text: "Enter details for your new Project.",
                                        x: settings.general.margin,
                                        y: 5 * settings.general.margin,
                                        widthType: "reserve",
                                        width: 2 * settings.general.margin,
                                        height: settings.dialog.lineHeight                                  
                                    },
                                    instructions4: {
                                        type: "Label",
                                        modes: ['Normal proj','Classroom class proj1','Online class proj1','Product proj1'],
                                        text: "Only Name is required. However, consider entering a description for searching and changing the default image for identification.",
                                        x: settings.general.margin,
                                        y: 5 * settings.general.margin +
                                            settings.dialog.lineHeight,
                                        widthType: "reserve",
                                        width: 2 * settings.general.margin,
                                        height: settings.dialog.lineHeight                                  
                                    },
                                    nameLabel: {
                                        type: "Label",
                                        modes: ['Normal proj','Classroom class proj1','Online class proj1','Product proj1'],
                                        text: "Name",
                                        x: settings.general.margin,
                                        y: 5 * settings.general.margin +
                                            3 * settings.dialog.lineHeight,
                                        width: settings.dialog.firstColumnWidth,
                                        height: settings.dialog.lineHeight                                  
                                    },
                                    nameEdit: {
                                        type: "Edit",
                                        modes: ['Normal proj','Classroom class proj1','Online class proj1','Product proj1'],
                                        x: 2 * settings.general.margin + 
                                            settings.dialog.firstColumnWidth,
                                        y: 5 * settings.general.margin +
                                            3 * settings.dialog.lineHeight,
                                        widthType: "reserve",           // Reserve means: subtract the width from
                                                                        //  the total width on calculateLayout.
                                        width: 3 * settings.general.margin +
                                            settings.dialog.firstColumnWidth,
                                        height: settings.dialog.lineHeight,
                                        exitFocus: function (localSelf) {
                                            try {
                                                // Save off criteria.
                                                m_projectName = localSelf.text;
                                                
                                                // Enable disable buttons.
                                                // m_functionSetBtnProtection();

                                            } catch (e) {
                                                alert(e.message);
                                            }
                                        }
                                    },
                                    descriptionLabel: {
                                        type: "Label",
                                        modes: ['Normal proj','Classroom class proj1','Online class proj1','Product proj1'],
                                        text: "Description",
                                        x: settings.general.margin,
                                        y: 6 * settings.general.margin +
                                            4 * settings.dialog.lineHeight,
                                        width: settings.dialog.firstColumnWidth,
                                        height: settings.dialog.lineHeight
                                    },
                                    descriptionEdit: {
                                        type: "Edit",
                                        modes: ['Normal proj','Classroom class proj1','Online class proj1','Product proj1'],
                                        x: 2 * settings.general.margin + 
                                            settings.dialog.firstColumnWidth,
                                        y: 6 * settings.general.margin +
                                            4 * settings.dialog.lineHeight,
                                        widthType: "reserve",           // Reserve means: subtract the width from
                                                                        //  the total width on calculateLayout.
                                        width: 3 * settings.general.margin +
                                            settings.dialog.firstColumnWidth,
                                        height: settings.dialog.lineHeight * 5,
                                        exitFocus: function (localSelf) {
                                            try {
                                                // Save off criteria.
                                                m_projectDescription = localSelf.text;
                                            } catch (e) {
                                                alert(e.message);
                                            }
                                        }
                                    },
                                    projectImageLabel: {
                                        type: "Label",
                                        modes: ['Normal proj','Classroom class proj1','Online class proj1','Product proj1'],
                                        text: "Project image",
                                        x: settings.general.margin,
                                        y: 5 * settings.general.margin +
                                            10 * settings.dialog.lineHeight,
                                        widthType: "reserve",
                                        width: 2 * settings.general.margin,
                                        height: settings.dialog.lineHeight                                  
                                    },
                                    projectImage: {
                                        type: "Picture",
                                        modes: ['Normal proj','Classroom class proj1','Online class proj1','Product proj1'],
                                        constructorParameterString: null,
                                        x: 2 * settings.general.margin + 
                                            settings.dialog.firstColumnWidth,
                                        y: 5 * settings.general.margin +
                                            10 * settings.dialog.lineHeight,
                                        width: settings.dialog.firstColumnWidth,
                                        height: settings.dialog.lineHeight * 5
                                    },
                                    imageSearchButton: {
                                        type: "Button",
                                        modes: ['Normal proj','Classroom class proj1','Online class proj1','Product proj1'],
                                        text: "S",
                                        x: 2 * settings.general.margin + settings.dialog.firstColumnWidth + settings.dialog.firstColumnWidth + 20,
                                        y: 5 * settings.general.margin +
                                            10 * settings.dialog.lineHeight +
                                            (settings.dialog.lineHeight * 5 - 40) / 2,
                                        width: 40,
                                        height: 40,
                                        click: function() {

                                            try {

                                                var exceptionRet = client.showImageSearchDialog(true, m_functionSetImageSrc);
                                                if (exceptionRet) {

                                                    throw exceptionRet;
                                                }
                                            } catch(e) {

                                                errorHelper.show(e);
                                            }
                                        }
                                    },
                                    urlSearchButton: {
                                        type: "Button",
                                        modes: ['Normal proj','Classroom class proj1','Online class proj1','Product proj1'],
                                        text: "U",
                                        x: 2 * settings.general.margin + settings.dialog.firstColumnWidth + settings.dialog.firstColumnWidth + 70,
                                        y: 5 * settings.general.margin +
                                            10 * settings.dialog.lineHeight +
                                            (settings.dialog.lineHeight * 5 - 40) / 2,
                                        width: 40,
                                        height: 40,
                                        click: function() {

                                            try {

                                                var exceptionRet = client.showImageURLDialog(true, m_functionSetImageSrc);
                                                if (exceptionRet) {

                                                    throw exceptionRet;
                                                }
                                            } catch(e) {

                                                errorHelper.show(e);
                                            }
                                        }
                                    },
                                    fileSearchButton: {
                                        type: "Button",
                                        modes: ['Normal proj','Classroom class proj1','Online class proj1','Product proj1'],
                                        text: "F",
                                        x: 2 * settings.general.margin + settings.dialog.firstColumnWidth + settings.dialog.firstColumnWidth + 120,
                                        y: 5 * settings.general.margin +
                                            10 * settings.dialog.lineHeight +
                                            (settings.dialog.lineHeight * 5 - 40) / 2,
                                        width: 40,
                                        height: 40,
                                        click: function() {

                                            try {

                                                var exceptionRet = client.showImageDiskDialog(true, m_functionSetImageSrc);
                                                if (exceptionRet) {

                                                    throw exceptionRet;
                                                }
                                            } catch(e) {

                                                errorHelper.show(e);
                                            }
                                        }
                                    },
                                    backButton: {
                                        type: "Button",
                                        modes: ['Normal proj','Classroom class proj1','Classroom class proj2','Classroom class proj3','Online class proj1','Online class proj2','Online class proj3','Product proj1','Product proj2'],
                                        text: "< Back",
                                        x: settings.general.margin,
                                        yType: "reserve",
                                        y: 100,
                                        width: 140,
                                        height: 40,
                                        click: function() {

											if (!manager.userAllowedToCreateEditPurchProjs) {

												self.dialog.setMode('Sel Proj Type-normal user');

											} else {

												let currmode = self.dialog.getMode();
												if (currmode === 'Normal proj' || currmode === 'Classroom class proj1' || currmode === 'Online class proj1' || currmode === 'Product proj1') {
													self.dialog.setMode('Sel Proj Type-priv user');
												} else if (currmode === 'Classroom class proj2') {
													self.dialog.setMode('Classroom class proj1');
												} else if (currmode === 'Classroom class proj3') {
													self.dialog.setMode('Classroom class proj2');
												} else if (currmode === 'Online class proj2') {
													self.dialog.setMode('Online class proj1');
												} else if (currmode === 'Online class proj3') {
													self.dialog.setMode('Online class proj2');
												} else if (currmode === 'Product proj2') {
													self.dialog.setMode('Product proj1');
												}
											}
                                        }
                                    },
                                    nextButton: {
                                        type: "Button",
                                        modes: ['Sel Proj Type-priv user','Classroom class proj1','Classroom class proj2','Online class proj1','Online class proj2','Product proj1'],
                                        text: "Next >",
                                        x: settings.general.margin +
                                            settings.dialog.firstColumnWidth,
                                        yType: "reserve",
                                        y: 100,
                                        width: 140,
                                        height: 40,
                                        click: function() {

											let currmode = self.dialog.getMode();
											if (currmode === 'Sel Proj Type-priv user') {

												if (m_projectModeId === 1) {
													self.dialog.setMode('Normal proj');
													manager.resetCenterPanelTitle('Normal project');
												} else if (m_projectModeId === 2) {
													self.dialog.setMode('Classroom class proj1');
												} else if (m_projectModeId === 3) {
													self.dialog.setMode('Online class proj1');
												} else if (m_projectModeId === 4) {
													self.dialog.setMode('Product proj1');
												}
											} else if (currmode === 'Classroom class proj1') {
												self.dialog.setMode('Classroom class proj2');
											} else if (currmode === 'Classroom class proj2') {
												self.dialog.setMode('Classroom class proj3');
											} else if (currmode === 'Online class proj1') {
												self.dialog.setMode('Online class proj2');
											} else if (currmode === 'Online class proj2') {
												self.dialog.setMode('Online class proj3');
											} else if (currmode === 'Product proj1') {
												self.dialog.setMode('Product proj2');
											}
                                        }
                                    },
                                    cancelButton: {
                                        type: "Button",
                                        modes: ['Sel Proj Type-normal user','Sel Proj Type-priv user','Normal proj','Classroom class proj1','Online class proj1','Product proj1'],
                                        text: "Cancel",
                                        x: settings.general.margin +
                                            2 * settings.dialog.firstColumnWidth,
                                        yType: "reserve",
                                        y: 100,
                                        width: 110,
                                        height: 40,
                                        click: function() {
                                            try {
                                                if (window.methodBuilder) {

                                                    // TODO: getting currentMethod = null even when I think there should be one. Ask Ken.
                                                    let exceptionRet = manager.selectMethod(window.methodBuilder.currentMethod);
                                                    if (exceptionRet) {
                                                        throw exceptionRet;
                                                    }
                                                }
                                            } catch (e) {
                                                errorHelper.show(e);
                                            }
                                        }
                                    },
                                    createProjectButton: {
                                        type: "Button",
                                        modes: ['Normal proj','Classroom class proj3','Online class proj3','Product proj2'],
                                        text: "Create Project",
                                        xType: "reserve",
                                        x: 2 * settings.dialog.firstColumnWidth + 20,
                                        yType: "reserve",
                                        y: 100,
                                        width: 210,
                                        height: 40,
                                        click: function() {

                                            // TODO: Adapt the following from original NewProjectDialog.js.
/*                                            try {

                                                client.unloadProject(null, true);		// In case one exists. This will ask about saving. And no callback.

                                                // Create project based on the new project dialog's fields--or lack thereof.
                                                // Call client to inject it throughout.

                                                var strProjectName = $("#ProjectName").val().trim();
                                                var strProjectDescription = $("#ProjectDescription").val().trim();
                                                var strProjectTags = $("#ProjectTags").val().trim();

                                                var exceptionRet = client.openProjectFromDB(
                                                    // 1st parameter is 1-5 based on m_projectType: "Game"-1 "Console"-2 "Web Site"-3 "HoloLens"-4 "Mapping"-5
                                                    ["Game", "Console", "Web Site", "HoloLens", "Mapping", "Empty"].indexOf(m_projectType) + 1, 
                                                    'new',
                                                    function(){	// callback is used to set fields after async fetch of empty-ish core project from db.

                                                        client.project.isCoreProject = false;

                                                        client.project.name = strProjectName;
                                                        client.project.tags = strProjectTags;
                                                        client.project.description = strProjectDescription;
                                                        client.project.imageId = m_imageId;
                                                        if (m_imageId) {
                                                            client.project.altImagePath = '';
                                                        }

                                                        // Now we'll add the fields to the project that will both tell the rest of the UI how to handle it and will affect how it gets saved to the database.
                                                        // Since there's already a client.project.specialProjectData (although it may be empty), we'll merge new stuff into the existing.
                                                        var spd = {
                                                            userAllowedToCreateEditPurchProjs: manager.userAllowedToCreateEditPurchProjs,
                                                            userCanWorkWithSystemLibsAndTypes: manager.userCanWorkWithSystemLibsAndTypes,
                                                            ownedByUser: false,
                                                            othersProjects: false,
                                                            normalProject: m_bNormalProject,
                                                            coreProject: false,
                                                            classProject: m_bClassProject,
                                                            productProject: m_bProductProject,
                                                            onlineClassProject: m_bOnlineClassProject,
                                                            comicsEdited: false,
                                                            systemTypesEdited: false,
                                                            openMode: 'new'
                                                        };

                                                        client.project.specialProjectData = Object.assign(client.project.specialProjectData, spd);

                                                        if (m_bClassProject) {

                                                            client.project.isClass = true;

                                                            // Retrieve class data from template fields. It's all optional until we're about to make the class active, actually.
                                                            var strInstructorFirst = $("#InstructorFirst").val().trim();
                                                            var strInstructorLast = $("#InstructorLast").val().trim();
                                                            var strPhone = $("#Phone").val().trim();
                                                            var strFacility = $("#Facility").val().trim();
                                                            var strAddress = $("#Address").val().trim();
                                                            var strRoom = $("#Room").val().trim();
                                                            var strCity = $("#City").val().trim();
                                                            var strState = $("#USState option:selected").text();
                                                            var strZip = $("#Zip").val().trim();
                                                            var arrWhen = [];
                                                            for (var i = 1; i <=8; i++) {
                                                                var str = $("#When" + i).val().trim();
                                                                if (str.length) { 
                                                                    arrWhen.push(m_funcWhenProcess(str)); 
                                                                } else {
                                                                    arrWhen.push({ date: '', duration: 0});
                                                                }
                                                            }
                                                            var strLevel = $("#Level option:selected").text();
                                                            var strDifficulty = $("#Difficulty option:selected").text();
                                                            var dPrice = 0.00;
                                                            var strPrice = $("#Price").val().trim();
                                                            if (strPrice.length) {
                                                                dPrice = Number(strPrice.replace(/[^0-9\.]+/g,""));
                                                            }
                                                            var strNotes = $("#Notes").val().trim();
                                                            var iMaxclassroomClassize = parseInt($("#MaxclassroomClassize").val().trim(), 10);
                                                            var iLoanComputersAvailable = $("#cb1").prop("checked") ? 1 : 0;

                                                            client.project.specialProjectData.classData = {
                                                                id: 0,
                                                                active: false,
                                                                classDescription: strProjectDescription,
                                                                instructorFirstName: strInstructorFirst,
                                                                instructorLastName: strInstructorLast,
                                                                instructorPhone: strPhone,
                                                                facility: strFacility,
                                                                address: strAddress,
                                                                room: strRoom,
                                                                city: strCity,
                                                                state: strState,
                                                                zip: strZip,
                                                                schedule: arrWhen,
                                                                level: strLevel,
                                                                difficulty: strDifficulty,
                                                                price: dPrice,
                                                                classNotes: strNotes,
                                                                maxclassroomClassize: iMaxclassroomClassize,
                                                                loanComputersAvailable: iLoanComputersAvailable,
                                                                imageId: m_imageId
                                                            };

                                                        } else if (m_bProductProject) {

                                                            client.project.isProduct = true;

                                                            // Retrieve product data from template fields. It's all optional until we're about to make the product active, actually.
                                                            var strLevel = $("#Level option:selected").text();
                                                            var strDifficulty = $("#Difficulty option:selected").text();
                                                            var dPrice = 0.00;
                                                            var strPrice = $("#Price").val().trim();
                                                            if (strPrice.length) {
                                                                dPrice = Number(strPrice.replace(/[^0-9\.]+/g,""));
                                                            }

                                                            client.project.specialProjectData.productData = {
                                                                id: 0,
                                                                active: false,
                                                                productDescription: strProjectDescription,
                                                                level: strLevel,
                                                                difficulty: strDifficulty,
                                                                price: dPrice,
                                                                imageId: m_imageId
                                                            };
                                                        } else if (m_bOnlineClassProject) {

                                                            client.project.isOnlineClass = true;

                                                            // Retrieve online class data from template fields. It's all optional until we're about to make the class active, actually.
                                                            var strInstructorFirst = $("#InstructorFirst").val().trim();
                                                            var strInstructorLast = $("#InstructorLast").val().trim();
                                                            var strEmail = $("#Email").val().trim();
                                                            var arrWhen = [];
                                                            for (var i = 1; i <=8; i++) {
                                                                var str = $("#When" + i).val().trim();
                                                                if (str.length) { 
                                                                    arrWhen.push(m_funcWhenProcess(str)); 
                                                                } else {
                                                                    arrWhen.push({ date: '', duration: 0});
                                                                }
                                                            }
                                                            var strLevel = $("#Level option:selected").text();
                                                            var strDifficulty = $("#Difficulty option:selected").text();
                                                            var dPrice = 0.00;
                                                            var strPrice = $("#Price").val().trim();
                                                            if (strPrice.length) {
                                                                dPrice = Number(strPrice.replace(/[^0-9\.]+/g,""));
                                                            }
                                                            var strNotes = $("#Notes").val().trim();

                                                            client.project.specialProjectData.onlineClassData = {
                                                                id: 0,
                                                                active: false,
                                                                classDescription: strProjectDescription,
                                                                instructorFirstName: strInstructorFirst,
                                                                instructorLastName: strInstructorLast,
                                                                instructorEmail: strEmail,
                                                                schedule: arrWhen,
                                                                level: strLevel,
                                                                difficulty: strDifficulty,
                                                                price: dPrice,
                                                                classNotes: strNotes,
                                                                imageId: m_imageId
                                                            };
                                                        }

                                                        var exceptionRet = manager.loadProject(client.project);
                                                        if (exceptionRet) { throw exceptionRet; }

                                                        client.setBrowserTabAndBtns();
                                                    }
                                                );
                                                if (exceptionRet) { throw exceptionRet; }

                                                m_dialog.close();

                                            } catch (e) {

                                                errorHelper.show(e);
                                            }
*/                                        }
                                    }
                            };

                            // Finally...create the Dialog with its controls, based on Normal or Privileged user status.
                            let exceptionRet = self.dialog.create(
                                objectConfiguration,
                                !manager.userAllowedToCreateEditPurchProjs ? 'Sel Proj Type-normal user' : 'Sel Proj Type-priv user'
                            );

                            if (exceptionRet) {
                                return exceptionRet;
                            }

                            ////////////////////////
                            // Fill self.dialog.controlObject["projectTypes"] with array of images based upon arrayAvailProjTypes.
                            m_lhProjectTypes = self.dialog.controlObject["projectTypes"];
                            let listProjectTypes = m_lhProjectTypes.list;
                            let index = 0;
                            
                            listProjectTypes.destroy(); // Don't check result because if destroy fails, that's because it hadn't been created, so it's ok.
                            let arrayOutput = arrayAvailProjTypes.map((projTypeId) => {

                                let pliNew = new PictureListItem(m_arrayProjectTypeNames[projTypeId - 1], projTypeId, index++);
                                pliNew.clickHandler = (id) => {
                                    
                                    // self is NewProjectDialog instance.
                                    m_projectTypeId = id;

                                    let i3 = self.dialog.controlObject["instructions3"];
                                    let ptName = m_arrayProjectTypeNames[projTypeId - 1];
                                    i3.text = "Enter details for your new " + ptName.charAt(0).toUpperCase() + ptName.slice(1) + (ptName === 'empty' ? " Project." : "-based Project.");
                                    
                                    let iPI = self.dialog.controlObject["projectImage"];
                                    iPI.setUrl(resourceHelper.toURL("images", null, null, m_arrayProjectTypeNames[m_projectTypeId - 1] + "Project.png"));
                                    iPI.recreate();

                                    if (self.dialog.getMode() === "Sel Proj Type-normal user") {
                                        
                                        // Normal user just switches mode to create new project.
                                        self.dialog.setMode('Normal proj');
    
                                    } else if (self.dialog.getMode() === "Sel Proj Type-priv user") {

                                        // Privileged user has selected a project type. Outline its PictureListItem in listHost (un-outline all others first).
                                        m_lhProjectTypes.removeAllOutlines();
                                        pliNew.setOutline(true);
                                        // m_functionSetBtnProtection();
                                    }
                                };
                                return pliNew;
                            });
                            listProjectTypes.create(arrayOutput);

                            if (self.dialog.getMode() === "Sel Proj Type-priv user") {

                                // Fill self.dialog.controlObject["ncopChoice"] with array of RadioListItems.
                                m_lh_ncopChoice = self.dialog.controlObject["ncopChoice"];
                                let listProjectModes = m_lh_ncopChoice.list;
                                let id = 1;

                                listProjectModes.destroy();
                                let arrayOutput = ["Normal project","Classroom project","Online class project","Product project"].map((projMode) => {

                                    let rliNew = new RadioListItem(projMode, id++);
                                    rliNew.clickHandler = (id) => {

										m_projectModeId = id;

                                        // Privileged user has selected a project type. Outline its RadioListItem in listHost (un-outline all others first).
                                        m_lh_ncopChoice.removeAllOutlines();
                                        rliNew.setOutline(true);
                                        // m_functionSetBtnProtection();
                                    };
                                    return rliNew;
                                });
                                listProjectModes.create(arrayOutput);
                            }

                            // m_functionSetBtnProtection();

                            // Because it is!
                            m_bCreated = true;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Decompose instance.
                    self.destroy = function () {

                        try {

                            // Can only destroy a created instance.
                            if (!m_bCreated) {

                                throw { message: "Instance not created!" };
                            }

                            window.newProjectDialog = null;
                            m_bCreated = false;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    ///////////////////////
                    // Private methods.

					// Display the chosen image.
					var m_functionSetImageSrc = function (imageId) {

						m_imageId = imageId;
                        let iPI = self.dialog.controlObject["projectImage"];
                        iPI.setUrl(resourceHelper.toURL("resources", m_imageId, "image"));
                        iPI.recreate();
					}

                    // Call this method when first creating dialog and after certain user actions.
                    /* Here are all the buttons and whether or not they should be protected by dialog mode:

                        'Sel Proj Type-priv user'
                            normal
                            classroomClass
                            onlineClass
                            product

                        'Normal proj'
                            createProjectButton
                            cancelButton

                        'Classroom class proj1'

                        'Online class proj1'

                        'Product proj1'

                    */
                    var m_functionSetBtnProtection = function() {

                        let currDialogMode = self.dialog.getMode();
                        if ((currDialogMode === "Sel Proj Type-priv user") && m_projectTypeId && m_projectModeId) {

                            let btn = self.dialog.controlObject["nextButton"];
                            btn.setProtected(false);

                        } else if ((currDialogMode === "Sel Proj Type-priv user") && (!m_projectTypeId || !m_projectModeId)) {
                        
                            let btn = self.dialog.controlObject["nextButton"];
                            btn.setProtected(true);

                        }
/*                         else if (currDialogMode === "Normal proj"
                                   || currDialogMode === "Class proj"
                                   || currDialogMode === "Online class proj"
                                   || currDialogMode === "Product proj") {

                            // Enable the Save Project button if validation passes, including project name is set.
                            let btn = self.dialog.controlObject["normal"];
                            btn.setProtected(!m_functionIsEverythingValid());
                        }
*/                    }

                    var m_functionIsEverythingValid = function() {

                        let bValid = false;
                        if (m_projectName.length) {

                            bValid = true;
                        }

                        // Once added, all of the fields for purchasable projects will need to be validated, too--both for correctness and completion.

                        return bValid;
                    }

                    ///////////////////////
                    // Private fields.

                    // Indicates this instance is already created.
                    var m_bCreated = false;
                    var m_projectName = null;
                    var m_projectDescription = null;
                    var m_imageId = null;
                    var m_projectTypeId = 0;
                    var m_projectModeId = 0;
                    var m_lhProjectTypes = null;
                    var m_lh_ncopChoice = null;
                    var m_arrayProjectTypeNames = ["game","console","website","hololens","mapping","empty"];

                } catch (e) {

                    alert(e.message);
                }
            };

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
