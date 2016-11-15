///////////////////////////////////////
// LibraryBuilder module.
//
// Gui component responsible for showing 
// a Library and all its parts and also 
// allowing for their modification.
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
    "NextWave/source/utility/DialogHost"],
    function (prototypes, settings, Point, Size, Area, DialogHost) {

        try {

            // Constructor function.
            var functionRet = function LibraryBuilder() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from DialogHost.
                    self.inherits(DialogHost);

                    ///////////////////////
                    // Public fields.

                    // The Library being edited.
                    self.currentLibrary = null;

                    ///////////////////////
                    // Public methods.

                    // Attach instance to DOM and initialize state.
                    self.create = function () {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "LibraryBuilder: instance already created!" };
                            }

                            // Create the configuration object with which to initialize the type builder dialog.
                            var objectConfiguration = {

                                nameLabel: {

                                    type: "Label",
                                    text: "Name",
                                    x: settings.general.margin,
                                    y: settings.general.margin,
                                    width: settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight
                                },
                                nameEdit: {

                                    type: "Edit",
                                    multiline: false,
                                    x: 2 * settings.general.margin + 
                                        settings.dialog.firstColumnWidth,
                                    y: settings.general.margin,
                                    widthType: "reserve",           // Reserve means: subtract the width from
                                                                    //  the total width on calculateLayout.
                                    width: 3 * settings.general.margin +
                                        settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight,
                                    enterFocus: function (localSelf) {

                                        try {

                                            // Store the current value for comparison after.
                                            localSelf.saveTypeName = localSelf.getText();
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    },
                                    exitFocus: function (localSelf) {

                                        try {

                                            // If the name has changed, update the name.
                                            if (localSelf.saveTypeName !== localSelf.text) {

                                                // Generate an unique name.
                                                var strUnique = window.manager.getUniqueName(localSelf.getText(),
                                                    self.currentLibrary.owner.libraries,
                                                    "data",
                                                    "name");

                                                // Update GUI.
                                                var exceptionRet = localSelf.setText(strUnique);
                                                if (exceptionRet) {

                                                    throw exceptionRet;
                                                }

                                                // Update the other GUI (in the project dialog).
                                                self.currentLibrary.listItem.name = strUnique;

                                                // Update data too.
                                                self.currentLibrary.data.name = strUnique;
                                            }
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    }
                                },
                                descriptionLabel: {

                                    type: "Label",
                                    text: "Description",
                                    x: settings.general.margin,
                                    y: settings.dialog.lineHeight + 
                                        2 * settings.general.margin,
                                    width: settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight
                                },
                                descriptionEdit: {

                                    type: "Edit",
                                    x: 2 * settings.general.margin + 
                                        settings.dialog.firstColumnWidth,
                                    y: settings.dialog.lineHeight + 
                                        2 * settings.general.margin,
                                    widthType: "reserve",           // Reserve means: subtract the width from
                                                                    //  the total width on calculateLayout.
                                    width: 3 * settings.general.margin +
                                        settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight * 5,
                                    exitFocus: function (localSelf) {

                                        try {

                                            // Update Library's description.
                                            self.currentLibrary.data.description = localSelf.getText();
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    }
                                },
                                referencesLabel: {

                                    type: "Label",
                                    text: "References",
                                    x: settings.general.margin,
                                    y: 6 * settings.dialog.lineHeight + 
                                        3 * settings.general.margin,
                                    width: settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight
                                },
                                referencesEdit: {

                                    type: "Edit",
                                    x: 2 * settings.general.margin + 
                                        settings.dialog.firstColumnWidth,
                                    y: 6 * settings.dialog.lineHeight + 
                                        3 * settings.general.margin,
                                    widthType: "reserve",
                                    width: 3 * settings.general.margin +
                                        settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight * 3,
                                    exitFocus: function (localSelf) {

                                        try {

                                            // Update Library's references.
                                            self.currentLibrary.data.references = localSelf.getText();
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    }
                                },
                                editorsLabel: {

                                    type: "Label",
                                    text: "Editors",
                                    x: settings.general.margin,
                                    y: 9 * settings.dialog.lineHeight + 
                                        4 * settings.general.margin,
                                    width: settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight
                                },
                                editorsEdit: {

                                    type: "Edit",
                                    x: 2 * settings.general.margin + 
                                        settings.dialog.firstColumnWidth,
                                    y: 9 * settings.dialog.lineHeight + 
                                        4 * settings.general.margin,
                                    widthType: "reserve",
                                    width: 3 * settings.general.margin +
                                        settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight * 3,
                                    exitFocus: function (localSelf) {

                                        try {

                                            // Update Library's editors.
                                            self.currentLibrary.data.editors = localSelf.getText();
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    }
                                }
                            };

                            // Create the dialog.
                            var exceptionRet = self.dialog.create(objectConfiguration);

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

                            window.LibraryBuilder = null;
                            m_bCreated = false;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Load Library into type builder.
                    self.loadLibrary = function (library) {

                        try {

                            self.currentLibrary = library;

                            // Ensure the type has the requisit attributes.
                            if (!self.currentLibrary.data) {

                                self.currentLibrary.data = {};
                            }
                            if (!self.currentLibrary.data.name) {

                                self.currentLibrary.data.name = "[Name]";
                            }
                            if (!self.currentLibrary.data.description) {

                                self.currentLibrary.data.description = "[Description]";
                            }

                            // These next two are questionable. Discuss w/Ken.
                            if (!self.currentLibrary.data.references) {

                                self.currentLibrary.data.references = "KernelTypesLibrary";
                            }
                            if (!self.currentLibrary.data.editors) {

                                self.currentLibrary.data.editors = g_profile["userName"].toString();
                            }

                            // Update controls:
                            
                            // Name edit.
                            var bProtected = false;
                            var exceptionRet = self.dialog.controlObject["nameEdit"].setProtected(bProtected);
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = self.dialog.controlObject["nameEdit"].setText(self.currentLibrary.data.name);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Description.
                            bProtected = false;
                            exceptionRet = self.dialog.controlObject["descriptionEdit"].setProtected(bProtected);
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = self.dialog.controlObject["descriptionEdit"].setText(self.currentLibrary.data.description);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Description.
                            bProtected = false;
                            exceptionRet = self.dialog.controlObject["referencesEdit"].setProtected(bProtected);
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = self.dialog.controlObject["referencesEdit"].setText(self.currentLibrary.data.references);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Description.
                            bProtected = false;
                            exceptionRet = self.dialog.controlObject["editorsEdit"].setProtected(bProtected);
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            return self.dialog.controlObject["editorsEdit"].setText(self.currentLibrary.data.editors);
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

            // Inherit from Control.  Wire 
            // up prototype chain to Control.
            functionRet.inheritsFrom(DialogHost);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
