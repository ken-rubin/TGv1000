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
    "NextWave/source/utility/ListItem",
    "Core/errorHelper", 
    "Core/resourceHelper"
    ],
    function (prototypes, settings, Point, Size, Area, DialogHost, List, ListItem, errorHelper, resourceHelper) {

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
                    // It is an int array containing one or more of 1-6, corresponding to 
                    // 1 game project
                    // 2 console project
                    // 3 website project
                    // 4 hololens project
                    // 5 mapping project
                    // 6 empty project
                    self.create = function (arrayAvailProjTypes) {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "NewProjectDialog: Instance already created!" };
                            }

                            // Create the dialog.

                            // Creation modes:
                            //      1   For non-privileged user only. Sees horizontal scroll bar of images of available project types.
                            //          Moving mouse over the images displays a project type description tooltip.
                            //          Clicking on an image switches to mode 2 with that project type having been selected.
                            //        objectConfiguration elements:
                            //          - "Choose Project Type" header label. modes=[1,3]
                            //          - "Choose the type of Project you wish to create by clicking on its picture." label. modes=[1,3]
                            //          - Strip of images built from arrayAvailProjTypes. modes=[1]
                            //      2   Either a normal user or a privileged user who elected to create a normal project
                            //          sees this mode after selecting a project type in mode 1 or mode 3.
                            //        objectConfiguration elements:
                            //          - "New xxx Project" header label. modes=[2,4,5,6]
                            //          - "Enter details for your new Project." label. modes=[2,4,5,6]
                            //          - "Only Name is required." label. modes=[2,4,5,6]
                            //          - "Name" rt-just. label. Bold. modes=[2,4,5,6]
                            //          - "Enter project name." edit. Screened back. modes=[2,4,5,6]
                            //          - "Description" label. Bold. modes=[2,4,5,6]
                            //          - "Will be used both to describe your project and to search for it later." edit. Screened back. modes=[2,4,5,6]
                            //          - "Project image" label. Bold. modes=[2,4,5,6]
                            //          - Image for project. (May be a hor. scroll region of 1 image.) modes=[2,4,5,6]
                            //          - "Search icon" button. modes=[2,4,5,6]
                            //          - "Cloud icon" button. modes=[2,4,5,6]
                            //          - "Disk icon" button. modes=[2,4,5,6]
                            //      3   For privileged users only. Like mode 1 with the horizontal scroll bar of project type images, but with
                            //          four (initially disabled) buttons beneath: (1) Create normal project; (2) Create a class; (3) Create an online class; (4) Create a product.
                            //          In mode 3 the scroll bar of images doesn't switch modes like in mode 1. It highlights (outlines the image) and
                            //          enables the four buttons.
                            //      4   For privileged users only. Like mode 2, but with fields for a class added. Has Create Project and Cancel buttons.  
                            //      5   For privileged users only. Like mode 2, but with fields for an online class added. Has Create Project and Cancel buttons.  
                            //      6   For privileged users only. Like mode 2, but with fields for a product added. Has Create Project and Cancel buttons.
                            // Summary:
                            //      A normal user starts in mode 1 and goes to mode 2 on image click.
                            //      A privileged user starts in mode 3 and goes to mode 2, 4, 5 or 6, depending on the button clicked.

                            let exceptionRet = self.dialog.create(
                                {
                                    toggle1to3: {
                                        type: "Button",
                                        modes: [1],
                                        text: "Toggle to 3",
                                        x: settings.general.margin + 8,
                                        y: 20,
                                        width: 190,
                                        height: 40,
                                        click: function() {
                                            self.dialog.setMode(3);
                                        }
                                    },
                                    toggle3to1: {
                                        type: "Button",
                                        modes: [3],
                                        text: "Toggle to 1",
                                        x: settings.dialog.firstColumnWidth + 8,
                                        y: 20,
                                        width: 190,
                                        height: 40,
                                        click: function() {
                                            self.dialog.setMode(1);
                                        }
                                    },
                                    instructions1: {
                                        type: "Label",
                                        modes: [1,3],
                                        text: "Choose the type of Project you wish to create by clicking on its picture.",
                                        x: settings.general.margin + 8,
                                        y: 70,
                                        widthType: "reserve",
                                        width: 2 * settings.general.margin,
                                        height: settings.dialog.lineHeight                                  
                                    },
                                    projectTypes: {
                                        type: "ListHost",
                                        modes: [1,3],
                                        constructorParameterString: "false",
                                        x: settings.general.margin,
                                        y: 100,
                                        widthType: "reserve",
                                        width: 2 * settings.general.margin,
                                        height: 100,
                                        click: function() {

                                        }
                                    },
                                    instructions2: {
                                        type: "Label",
                                        modes: [3],
                                        text: "As a privileged user, besides being able to create Normal projects, you are allowed to create a Class, an Online Class or a Product. Choose here:",
                                        x: settings.general.margin + 8,
                                        y: 250,
                                        widthType: "reserve",
                                        width: 2 * settings.general.margin,
                                        height: settings.dialog.lineHeight                                  
                                    },
                                    // TODO: I want the next 4 buttons to be protected to start. Protection is removed when an image in projectTypes is clicked and highlighted.
                                    normal: {
                                        type: "Button",
                                        modes: [3],
                                        text: "Normal",
                                        x: settings.general.margin + 8,
                                        y: 300,
                                        width: 190,
                                        height: 40,
                                        click: function() {
                                            self.dialog.setMode(2);
                                        }
                                    },
                                    class: {
                                        type: "Button",
                                        modes: [3],
                                        text: "Class",
                                        x: settings.general.margin + 8,
                                        y: 350,
                                        width: 190,
                                        height: 40,
                                        click: function() {
                                            self.dialog.setMode(4);
                                        }
                                    },
                                    onlineClass: {
                                        type: "Button",
                                        modes: [3],
                                        text: "Online Class",
                                        x: settings.general.margin + 8,
                                        y: 400,
                                        width: 190,
                                        height: 40,
                                        click: function() {
                                            self.dialog.setMode(5);
                                        }
                                    },
                                    product: {
                                        type: "Button",
                                        modes: [3],
                                        text: "Product",
                                        x: settings.general.margin + 8,
                                        y: 450,
                                        width: 190,
                                        height: 40,
                                        click: function() {
                                            self.dialog.setMode(6);
                                        }
                                    },
                                    instructions3: {
                                        type: "Label",
                                        modes: [2,4,5,6],
                                        text: "Enter details for your new Project.",
                                        x: settings.general.margin + 8,
                                        y: 50,
                                        widthType: "reserve",
                                        width: 2 * settings.general.margin,
                                        height: settings.dialog.lineHeight                                  
                                    },
                                    instructions4: {
                                        type: "Label",
                                        modes: [2,4,5,6],
                                        text: "Only Name is required. However, consider changing the default image for id purposes.",
                                        x: settings.general.margin + 8,
                                        y: 50 + settings.dialog.lineHeight + 10,
                                        widthType: "reserve",
                                        width: 2 * settings.general.margin,
                                        height: settings.dialog.lineHeight                                  
                                    },
                                    nameLabel: {
                                        type: "Label",
                                        modes: [2,4,5,6],
                                        text: "Name",
                                        x: settings.general.margin + 8,
                                        y: 50 + 2 * settings.dialog.lineHeight + 30,
                                        widthType: "reserve",
                                        width: 2 * settings.general.margin,
                                        height: settings.dialog.lineHeight                                  
                                    },
                                    nameEdit: {
                                        type: "Edit",
                                        modes: [2,4,5,6],
                                        x: 2 * settings.general.margin + 
                                            settings.dialog.firstColumnWidth,
                                        y: 50 + 2 * settings.dialog.lineHeight + 30,
                                        width: settings.dialog.firstColumnWidth,
                                        height: settings.dialog.lineHeight,
                                        exitFocus: function (localSelf) {
                                            try {
                                                // Save off criteria.
                                                m_projectName = localSelf.text;
                                            } catch (e) {
                                                alert(e.message);
                                            }
                                        }
                                    },
                                    descriptionLabel: {
                                        type: "Label",
                                        modes: [2,4,5,6],
                                        text: "Description",
                                        x: settings.general.margin + 8,
                                        y: 50 + 3 * settings.dialog.lineHeight + 40,
                                        widthType: "reserve",
                                        width: 2 * settings.general.margin,
                                        height: settings.dialog.lineHeight                                  
                                    },
                                    descriptionEdit: {
                                        type: "Edit",
                                        modes: [2,4,5,6],
                                        x: 2 * settings.general.margin + 
                                            settings.dialog.firstColumnWidth,
                                        y: 50 + 3 * settings.dialog.lineHeight + 40,
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
                                        modes: [2,4,5,6],
                                        text: "Project image",
                                        x: settings.general.margin + 8,
                                        y: 50 + 8 * settings.dialog.lineHeight + 50,
                                        widthType: "reserve",
                                        width: 2 * settings.general.margin,
                                        height: settings.dialog.lineHeight                                  
                                    },
                                    willBeImage: {
                                        type: "Edit",   // TODO will change
                                        modes: [2,4,5,6],
                                        x: 2 * settings.general.margin + settings.dialog.firstColumnWidth,
                                        y: 50 + 8 * settings.dialog.lineHeight + 50,
                                        width: settings.dialog.firstColumnWidth,
                                        height: settings.dialog.lineHeight * 5
                                    },
                                    imageSearchButton: {
                                        type: "Button",
                                        modes: [2,4,5,6],
                                        text: "S",
                                        x: 2 * settings.general.margin + settings.dialog.firstColumnWidth + settings.dialog.firstColumnWidth + 20,
                                        y: 50 + 8 * settings.dialog.lineHeight + 50 + (settings.dialog.lineHeight * 5 - 40) / 2,
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
                                        modes: [2,4,5,6],
                                        text: "U",
                                        x: 2 * settings.general.margin + settings.dialog.firstColumnWidth + settings.dialog.firstColumnWidth + 70,
                                        y: 50 + 8 * settings.dialog.lineHeight + 50 + (settings.dialog.lineHeight * 5 - 40) / 2,
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
                                        modes: [2,4,5,6],
                                        text: "F",
                                        x: 2 * settings.general.margin + settings.dialog.firstColumnWidth + settings.dialog.firstColumnWidth + 120,
                                        y: 50 + 8 * settings.dialog.lineHeight + 50 + (settings.dialog.lineHeight * 5 - 40) / 2,
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
                                    // TODO: I want the next button to be protected to start. Protection is removed all fields are validate.
                                    createProjectButton: {
                                        type: "Button",
                                        modes: [2,4,5,6],
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
                                                            var iMaxClassSize = parseInt($("#MaxClassSize").val().trim(), 10);
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
                                                                maxClassSize: iMaxClassSize,
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
                                    },
                                    cancelButton: {
                                        type: "Button",
                                        modes: [2,4,5,6],
                                        text: "Cancel",
                                        xType: "reserve",
                                        x: settings.dialog.firstColumnWidth,
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
                                    }
                                },
                                !manager.userAllowedToCreateEditPurchProjs ? 1 : 3
                            );

                            if (exceptionRet) {
                                return exceptionRet;
                            }

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
                    // Private methods - will they be accessible with current structure??
					// Display the chosen image.
					var m_functionSetImageSrc = function (imageId) {

						m_imageId = imageId;
                        let imageURL = resourceHelper.toURL("resources", m_imageId, "image");

                        // Make it happen....
					}

                    ///////////////////////
                    // Private fields.

                    // Indicates this instance is already created.
                    var m_bCreated = false;
                    var m_projectName = null;
                    var m_projectDescription = null;
                    var m_imageId = null;

                } catch (e) {

                    alert(e.message);
                }
            };

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
