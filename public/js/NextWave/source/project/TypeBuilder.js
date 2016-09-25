///////////////////////////////////////
// TypeBuilder module.
//
// Gui component responsible for showing 
// a type and all its parts and also 
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
            var functionRet = function TypeBuilder() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from DialogHost.
                    self.inherits(DialogHost);

                    ///////////////////////
                    // Public fields.

                    // The type being edited.
                    self.currentType = null;

                    ///////////////////////
                    // Public methods.

                    // Attach instance to DOM and initialize state.
                    self.create = function () {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "TypeBuilder: Instance already created!" };
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
                                                    self.currentType.owner.types,
                                                    "data",
                                                    "name");

                                                // Update GUI.
                                                var exceptionRet = localSelf.setText(strUnique);
                                                if (exceptionRet) {

                                                    throw exceptionRet;
                                                }

                                                // Update the other GUI (in the project dialog).
                                                self.currentType.listItem.name = strUnique;

                                                // Update data too.
                                                self.currentType.data.name = strUnique;
                                            }
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    }
                                },
                                baseLabel: {

                                    type: "Label",
                                    text: "Base",
                                    x: settings.general.margin,
                                    y: settings.dialog.lineHeight + 
                                        2 * settings.general.margin,
                                    width: settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight
                                },
                                baseEdit: {

                                    type: "Edit",
                                    multiline: false,
                                    x: 2 * settings.general.margin + 
                                        settings.dialog.firstColumnWidth,
                                    y: settings.dialog.lineHeight + 
                                        2 * settings.general.margin,
                                    widthType: "reserve",           // Reserve means: subtract the width from
                                                                    //  the total width on calculateLayout.
                                    width: 3 * settings.general.margin +
                                        settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight,
                                    enterFocus: function (localSelf) {

                                        try {

                                            // Save the original base, for resetting on invalid new name.
                                            localSelf.saveBase = localSelf.getText();
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    },
                                    exitFocus: function (localSelf) {

                                        try {

                                            // Ensure the current value is a valid 
                                            // type, not equal to the current type:

                                            // Get the current type name.
                                            var strCurrentTypeName = localSelf.dialog.controlObject["nameEdit"].getText();

                                            // Test it.
                                            if (localSelf.getText() === strCurrentTypeName ||
                                                !window.manager.isValidBaseTypeName(strCurrentTypeName,
                                                        localSelf.getText())) {

                                                // Reset base class on error.
                                                var exceptionRet = localSelf.setText(localSelf.saveBase);
                                                if (exceptionRet) {

                                                    throw exceptionRet;
                                                }
                                            } else {

                                                // Update its baseTypeName.
                                                self.currentType.data.baseTypeName = 
                                                    localSelf.getText();
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
                                    y: 2 * settings.dialog.lineHeight + 
                                        3 * settings.general.margin,
                                    width: settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight
                                },
                                descriptionEdit: {

                                    type: "Edit",
                                    multiline: true,
                                    x: 2 * settings.general.margin + 
                                        settings.dialog.firstColumnWidth,
                                    y: 2 * settings.dialog.lineHeight + 
                                        3 * settings.general.margin,
                                    widthType: "reserve",           // Reserve means: subtract the width from
                                                                    //  the total width on calculateLayout.
                                    width: 3 * settings.general.margin +
                                        settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight * 5,
                                    exitFocus: function (localSelf) {

                                        try {

                                            // Update it description.
                                            self.currentType.data.description = localSelf.getText();
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    }
                                }
                            };

                            // If privileged...
                            if (window.manager.userAllowedToCreateEditPurchProjs) {

                                // Add four more controls to the dialog.
                                objectConfiguration.systemTypeLabel = {

                                    type: "Label",
                                    text: "System Type",
                                    x: settings.general.margin,
                                    y: 7 * settings.dialog.lineHeight + 
                                        4 * settings.general.margin,
                                    width: settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight
                                };

                                objectConfiguration.systemTypeEdit = {

                                    type: "Edit",
                                    multiline: false,
                                    x: 2 * settings.general.margin + 
                                        settings.dialog.firstColumnWidth,
                                    y: 7 * settings.dialog.lineHeight + 
                                        4 * settings.general.margin,
                                    widthType: "reserve",           // Reserve means: subtract the width from
                                                                    //  the total width on calculateLayout.
                                    width: 3 * settings.general.margin +
                                        settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight,
                                    exitFocus: function (localSelf) {

                                        try {

                                            // Update its description.
                                            self.currentType.data.isSystemType = localSelf.getText();
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    }
                                }

                                objectConfiguration.publicLabel = {

                                    type: "Label",
                                    text: "Public",
                                    x: settings.general.margin,
                                    y: 8 * settings.dialog.lineHeight + 
                                        5 * settings.general.margin,
                                    width: settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight
                                };

                                objectConfiguration.publicEdit = {

                                    type: "Edit",
                                    multiline: false,
                                    x: 2 * settings.general.margin + 
                                        settings.dialog.firstColumnWidth,
                                    y: 8 * settings.dialog.lineHeight + 
                                        5 * settings.general.margin,
                                    widthType: "reserve",           // Reserve means: subtract the width from
                                                                    //  the total width on calculateLayout.
                                    width: 3 * settings.general.margin +
                                        settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight,
                                    exitFocus: function (localSelf) {

                                        try {

                                            // Update its description.
                                            self.currentType.data.public = localSelf.getText();
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    }
                                }

                            }

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

                            window.TypeBuilder = null;
                            m_bCreated = false;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Load type into type builder.
                    self.loadType = function (type) {

                        try {

                            // Save off state.
                            self.currentType = type;

                            // Ensure the type has the requisit attributes.
                            if (!self.currentType.data) {

                                self.currentType.data = {};
                            }
                            if (!self.currentType.data.name) {

                                self.currentType.data.name = "[name]";
                            }
                            if (!self.currentType.data.baseTypeName) {

                                self.currentType.data.baseTypeName = "";
                            }
                            if (!self.currentType.data.description) {

                                self.currentType.data.description = "[description]";
                            }
                            if (!self.currentType.data.isSystemType) {

                                self.currentType.data.isSystemType = 0;
                            }
                            if (!self.currentType.data.public) {

                                self.currentType.data.public = 0;
                            }

                            // Update controls:
                            
                            // Name edit.
                            var bProtected = false;
                            // Protect against editing Base type name in these cases:
                            //      Dad, pleae re-comment, I accidentally removed....
                            if ((self.currentType.data.typeTypeId === 1 && 
                                    self.currentType.data.name === "App") || 
                                (self.currentType.data.typeTypeId > 1 && 
                                    self.currentType.data.id && 
                                    self.currentType.data.public)) {

                                bProtected = true;
                            }
                            var exceptionRet = self.dialog.controlObject["nameEdit"].setProtected(bProtected);
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = self.dialog.controlObject["nameEdit"].setText(self.currentType.data.name);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Base edit (baseTypeName).
                            bProtected = false;
                            // Protect against editing Base type name in these cases:
                            //      App type
                            //      App type Base type
                            //      For normal user: System type
                            if ((self.currentType.data.typeTypeId === 1 && 
                                    self.currentType.data.name === "App") ||
                                (self.currentType.data.typeTypeId === 3) ||
                                (!manager.userCanWorkWithSystemTypesAndAppBaseTypes && 
                                    self.currentType.data.typeTypeId === 2)) {

                                bProtected = true;
                            }
                            exceptionRet = self.dialog.controlObject["baseEdit"].setProtected(bProtected);
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = self.dialog.controlObject["baseEdit"].setText(self.currentType.data.baseTypeName);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Description edit.
                            bProtected = false;
                            // Protect against editing Description in these cases:
                            //      For normal users: App type Base type; System type
                            //      For manager.userAllowedToCreateEditPurchProjs: System type
                            //      For manager.userCanWorkWithSystemTypesAndAppBaseTypes: no prohibition
                            if ((!manager.userCanWorkWithSystemTypesAndAppBaseTypes && 
                                    !manager.userAllowedToCreateEditPurchProjs && 
                                    type.data.typeTypeId > 1) ||
                                (!manager.userCanWorkWithSystemTypesAndAppBaseTypes && 
                                    manager.userAllowedToCreateEditPurchProjs && 
                                    type.data.typeTypeId === 2)) {
                                
                                bProtected = true;
                            }
                            exceptionRet = self.dialog.controlObject["descriptionEdit"].setProtected(bProtected);
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = self.dialog.controlObject["descriptionEdit"].setText(self.currentType.data.description);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Set the system type and the public fields to 0 or 1 if the system type field is present.
                            if (!self.dialog.controlObject["systemTypeEdit"]) {

                                return null;
                            }

                            // The System Type setting is always protected.
                            exceptionRet = self.dialog.controlObject["systemTypeEdit"].setProtected(true);
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = self.dialog.controlObject["systemTypeEdit"].setText(self.currentType.data.isSystemType.toString());
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            exceptionRet = self.dialog.controlObject["publicEdit"].setProtected(false);
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            return self.dialog.controlObject["publicEdit"].setText(self.currentType.data.public.toString());

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
