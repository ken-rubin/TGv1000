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
                              
                            if (!manager.userAllowedToCreateEditPurchProjs) {

                                let exceptionRet = self.dialog.create(
                                    {

                                        instructions: {

                                            type: "Label",
                                            text: "Click on a project type image to begin building your own project of that type.",
                                            x: settings.general.margin + 8,
                                            y: 70,
                                            widthType: "reserve",
                                            width: 2 * settings.general.margin,
                                            height: settings.dialog.lineHeight                                  
                                        },
                                        projectTypes: {

                                            type: "ListHost",
                                            constructorParameterString: "false",
                                            x: settings.general.margin,
                                            y: 100,
                                            widthType: "reserve",
                                            width: 2 * settings.general.margin,
                                            height: 100,
                                            clickBehavior: "fetchNewProject"
                                        }
                                    },
                                    !manager.userAllowedToCreateEditPurchProjs ? 1 : 3
                                );

                                if (exceptionRet) { throw exceptionRet; }
                                
                            } else {

                                let exceptionRet = self.dialog.create({

                                    instructions: {

                                        type: "Label",
                                        text: "Click on a project type image to begin building your own project of that type. Then click a button to continue.",
                                        x: settings.general.margin + 8,
                                        y: 70,
                                        widthType: "reserve",
                                        width: 2 * settings.general.margin,
                                        height: settings.dialog.lineHeight                                    
                                    },
                                    projectTypes: {

                                        type: "ListHost",
                                        constructorParameterString: "false",
                                        x: settings.general.margin,
                                        y: 100,
                                        widthType: "reserve",
                                        width: 2 * settings.general.margin,
                                        height: 100,
                                        clickBehavior: "outlineAndWaitForButtonClick"
                                    },
                                    normal: {

                                        type: "Button",
                                        text: "Normal"
                                    },
                                    class: {

                                        type: "Button",
                                        text: "Class"
                                    },
                                    onlineClass: {

                                        type: "Button",
                                        text: "Online Class"
                                    },
                                    product: {

                                        type: "Button",
                                        text: "Product"
                                    },
                                });

                                if (exceptionRet) { throw exceptionRet; }
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
                    // Private fields.

                    // Indicates this instance is already created.
                    var m_bCreated = false;

                } catch (e) {

                    alert(e.message);
                }
            };

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
