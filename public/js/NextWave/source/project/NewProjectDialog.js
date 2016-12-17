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
    "NextWave/source/utility/ListItem"
    ],
    function (prototypes, settings, Point, Size, Area, DialogHost, List, ListItem) {

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
//						$("#ProjectImage").attr("src", resourceHelper.toURL("resources", m_imageId, "image"));
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
