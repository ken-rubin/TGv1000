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
                    self.create = function () {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "NewProjectDialog: Instance already created!" };
                            }

                            // Create the dialog.
                            if (!manager.userAllowedToCreateEditPurchProjs) {

                                let exceptionRet = self.dialog.create({

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
                                });
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
