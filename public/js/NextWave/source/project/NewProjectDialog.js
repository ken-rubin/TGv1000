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
    "Core/errorHelper", 
    "Core/resourceHelper"
    ],
    function (prototypes, settings, Point, Size, Area, DialogHost, List, PictureListItem, errorHelper, resourceHelper) {

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



                            // Create the dialog.

                            //      A normal user starts in mode 'Sel Proj Type-normal user' and goes to mode 'Normal proj' on image click.
                            //      A privileged user starts in mode 'Sel Proj Type-priv user' and goes to mode 'Normal proj', 'Class proj', 'Online class proj' or 'Product proj', depending on the button clicked.

                            let objectConfiguration = 
                            {
                                    toggle1to3: {
                                        type: "Button",
                                        modes: ['Sel Proj Type-normal user'],
                                        text: "Toggle to 'Sel Proj Type-priv user'",
                                        x: settings.general.margin + 8,
                                        y: 20,
                                        width: 490,
                                        height: 40,
                                        click: function() {
                                            self.dialog.setMode('Sel Proj Type-priv user');
                                        }
                                    },
                                    toggle3to1: {
                                        type: "Button",
                                        modes: ['Sel Proj Type-priv user'],
                                        text: "Toggle to 'Sel Proj Type-normal user'",
                                        x: settings.dialog.firstColumnWidth * 3 + 8,
                                        y: 20,
                                        width: 490,
                                        height: 40,
                                        click: function() {
                                            self.dialog.setMode('Sel Proj Type-normal user');
                                        }
                                    },
                                    instructions1: {
                                        type: "Label",
                                        modes: ['Sel Proj Type-normal user','Sel Proj Type-priv user'],
                                        text: "Choose the type of Project you wish to create by clicking on its picture.",
                                        x: settings.general.margin + 8,
                                        y: 70,
                                        widthType: "reserve",
                                        width: 2 * settings.general.margin,
                                        height: settings.dialog.lineHeight                                  
                                    },
                                    projectTypes: {
                                        type: "ListHost",
                                        modes: ['Sel Proj Type-normal user','Sel Proj Type-priv user'],
                                        constructorParameterString: "false",
                                        x: settings.general.margin,
                                        y: 100,
                                        widthType: "reserve",
                                        width: 2 * settings.general.margin,
                                        height: 100
                                    },
                                    instructions2: {
                                        type: "Label",
                                        modes: ['Sel Proj Type-priv user'],
                                        text: "As a privileged user, besides being able to create Normal projects, you are allowed to create a Class, an Online Class or a Product. Choose here:",
                                        x: settings.general.margin + 8,
                                        y: 250,
                                        widthType: "reserve",
                                        width: 2 * settings.general.margin,
                                        height: settings.dialog.lineHeight                                  
                                    },
                                    normal: {
                                        type: "Button",
                                        modes: ['Sel Proj Type-priv user'],
                                        text: "Normal",
                                        x: settings.general.margin + 8,
                                        y: 300,
                                        width: 190,
                                        height: 40,
                                        click: function() {
                                            self.dialog.setMode('Normal proj');
                                        }
                                    },
                                    classs: {
                                        type: "Button",
                                        modes: ['Sel Proj Type-priv user'],
                                        text: "Class",
                                        x: settings.general.margin + 8,
                                        y: 350,
                                        width: 190,
                                        height: 40,
                                        click: function() {
                                            self.dialog.setMode('Class proj');
                                        }
                                    },
                                    onlineClass: {
                                        type: "Button",
                                        modes: ['Sel Proj Type-priv user'],
                                        text: "Online Class",
                                        x: settings.general.margin + 8,
                                        y: 400,
                                        width: 190,
                                        height: 40,
                                        click: function() {
                                            self.dialog.setMode('Online class proj');
                                        }
                                    },
                                    product: {
                                        type: "Button",
                                        modes: ['Sel Proj Type-priv user'],
                                        text: "Product",
                                        x: settings.general.margin + 8,
                                        y: 450,
                                        width: 190,
                                        height: 40,
                                        click: function() {
                                            self.dialog.setMode('Product proj');
                                        }
                                    },
                                    instructions3: {
                                        type: "Label",
                                        modes: ['Normal proj','Class proj','Online class proj','Product proj'],
                                        text: "Enter details for your new Project.",
                                        x: settings.general.margin + 8,
                                        y: 50,
                                        widthType: "reserve",
                                        width: 2 * settings.general.margin,
                                        height: settings.dialog.lineHeight                                  
                                    },
                                    instructions4: {
                                        type: "Label",
                                        modes: ['Normal proj','Class proj','Online class proj','Product proj'],
                                        text: "Only Name is required. However, consider changing the default image for id purposes.",
                                        x: settings.general.margin + 8,
                                        y: 50 + settings.dialog.lineHeight + 10,
                                        widthType: "reserve",
                                        width: 2 * settings.general.margin,
                                        height: settings.dialog.lineHeight                                  
                                    },
                                    nameLabel: {
                                        type: "Label",
                                        modes: ['Normal proj','Class proj','Online class proj','Product proj'],
                                        text: "Name",
                                        x: settings.general.margin + 8,
                                        y: 50 + 2 * settings.dialog.lineHeight + 30,
                                        widthType: "reserve",
                                        width: 2 * settings.general.margin,
                                        height: settings.dialog.lineHeight                                  
                                    },
                                    nameEdit: {
                                        type: "Edit",
                                        modes: ['Normal proj','Class proj','Online class proj','Product proj'],
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
                                        modes: ['Normal proj','Class proj','Online class proj','Product proj'],
                                        text: "Description",
                                        x: settings.general.margin + 8,
                                        y: 50 + 3 * settings.dialog.lineHeight + 40,
                                        widthType: "reserve",
                                        width: 2 * settings.general.margin,
                                        height: settings.dialog.lineHeight                                  
                                    },
                                    descriptionEdit: {
                                        type: "Edit",
                                        modes: ['Normal proj','Class proj','Online class proj','Product proj'],
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
                                        modes: ['Normal proj','Class proj','Online class proj','Product proj'],
                                        text: "Project image",
                                        x: settings.general.margin + 8,
                                        y: 50 + 8 * settings.dialog.lineHeight + 50,
                                        widthType: "reserve",
                                        width: 2 * settings.general.margin,
                                        height: settings.dialog.lineHeight                                  
                                    },
                                    projectImage: {
                                        type: "Picture",
                                        modes: ['Normal proj','Class proj','Online class proj','Product proj'],
                                        constructorParameterString: null,
                                        x: 2 * settings.general.margin + settings.dialog.firstColumnWidth,
                                        y: 50 + 8 * settings.dialog.lineHeight + 50,
                                        width: settings.dialog.firstColumnWidth,
                                        height: settings.dialog.lineHeight * 5
                                    },
                                    imageSearchButton: {
                                        type: "Button",
                                        modes: ['Normal proj','Class proj','Online class proj','Product proj'],
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
                                        modes: ['Normal proj','Class proj','Online class proj','Product proj'],
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
                                        modes: ['Normal proj','Class proj','Online class proj','Product proj'],
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
                                    // TODO: I want the next button to be disabled to start. It is enabled when the project has a name.
                                    createProjectButton: {
                                        type: "Button",
                                        modes: ['Normal proj','Class proj','Online class proj','Product proj'],
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
                                        modes: ['Normal proj','Class proj','Online class proj','Product proj'],
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
                                    i3.text = "Enter details for your new " + ptName.charAt(0).toUpperCase() + ptName.slice(1) + "-based Project.";
                                    
                                    let iPI = self.dialog.controlObject["projectImage"];
                                    iPI.setUrl(resourceHelper.toURL("images", null, null, m_arrayProjectTypeNames[m_projectTypeId - 1] + "Project.png"));
                                    iPI.recreate();

                                    if (self.dialog.getMode() === "Sel Proj Type-normal user") {
                                        
                                        // Normal user just switches mode to create new project.
                                        self.dialog.setMode('Normal proj');
    
                                    } else {

                                        // Privileged user has selected project type. Highlight its PictureListItem in listHost and enable the 4 project type buttons.

                                    }

                                };
                                return pliNew;
                            });
                            listProjectTypes.create(arrayOutput);

                            m_functionSetBtnProtection();

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
                        let iPI = self.dialog.controlObject["projectImage"];
                        iPI.setUrl(resourceHelper.toURL("resources", m_imageId, "image"));
                        iPI.recreate();
					}

                    // Call this method when first creating dialog and after certain user actions.
                    var m_functionSetBtnProtection = function() {

                        let currDialogMode = self.dialog.getMode();
                        if (currDialogMode === "Sel Proj Type-priv user") {

                            ////////////////////////
                            // Disable 4 project style buttons until user selects a project type.
                            let btn = self.dialog.controlObject["normal"];
                            btn.setProtected(true);
                            btn = self.dialog.controlObject["classs"];
                            btn.setProtected(true);
                            btn = self.dialog.controlObject["onlineClass"];
                            btn.setProtected(true);
                            btn = self.dialog.controlObject["product"];
                            btn.setProtected(true);
                        
                        } else if (currDialogMode === "Normal proj"
                                   || currDialogMode === "Class proj"
                                   || currDialogMode === "Online class proj"
                                   || currDialogMode === "Product proj") {

                            // Enable the Save Project button if validation passes, including project name is set.
                            let btn = self.dialog.controlObject["normal"];
                            btn.setProtected(!m_functionIsEverythingValid());
                        }
                    }

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
                    var m_lhProjectTypes = null;
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
