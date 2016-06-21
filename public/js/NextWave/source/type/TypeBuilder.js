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

                                                // Ensure the value is unique.
                                                var strPayload = localSelf.getText();
                                                var exceptionRet = localSelf.setText(window.manager.getUniqueName(strPayload,
                                                    self.typeContext.stowage.isSystemType === 0 ? window.manager.types : window.manager.systemTypes,
                                                    "name"));
                                                if (exceptionRet) {

                                                    return exceptionRet;
                                                }

                                                // Update.
                                                if (self.typeContext.stowage.isSystemType === 0) {

                                                    return window.manager.editTypeName(localSelf.saveTypeName,
                                                        localSelf.getText());
                                                } else {

                                                    return window.manager.editSystemTypeName(localSelf.saveTypeName,
                                                        localSelf.getText());
                                                }
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

                                                // Save value.                                                                                            // Get the current type.
                                                var typeContext = localSelf.dialog.host.typeContext;

                                                // Update it description.
                                                typeContext.stowage.baseTypeName = localSelf.getText();
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

                                            // Get the current type.
                                            var typeContext = localSelf.dialog.host.typeContext;

                                            // Update it description.
                                            typeContext.stowage.description = localSelf.getText();
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    }
                                }
                            };

                            // If privileged...
                            if (window.manager.userAllowedToCreateEditPurchProjs) {

                                // Add two new controls to the dialog.
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

                                            // Get the current type.
                                            var typeContext = localSelf.dialog.host.typeContext;

                                            // Update its description.
                                            typeContext.stowage.isSystemType = localSelf.getText();
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

                            // Ensure the type has the requisit attributes.
                            if (!type.stowage) {

                                type.stowage = {};
                            }
                            if (!type.stowage.baseTypeName) {

                                type.stowage.baseTypeName = "";
                            }
                            if (!type.stowage.description) {

                                type.stowage.description = "This is a test of the emergency broadcast system.  If this had been an actual emergency....";
                            }
                            if (!type.stowage.isSystemType) {

                                type.stowage.isSystemType = 0;
                            }

                            // Store the context.
                            self.typeContext = type;

                            // Update controls.
                            
                            var bProtected = false;
                            // Protect against editing type name in these cases:
                            //      App type (type.stowage.typeTypeId === 1 && type.name === "App")
                            //      Any System type (type.stowage.typeTypeId === 2)
                            //      Any App type's Base type (type.stowage.typeTypeId === 3)
                            //      So, only types added in the types panel are editable.
                            if ( 
                                    (type.stowage.typeTypeId === 1 && type.name === "App") || 
                                    (type.stowage.typeTypeId > 1 && type.stowage.id)
                                ) {

                                bProtected = true;
                            }
                            self.dialog.controlObject["nameEdit"].setProtected(bProtected);
                            var exceptionRet = self.dialog.controlObject["nameEdit"].setText(type.name);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            bProtected = false;
                            // Protect against editing Base type name in these cases:
                            //      App type
                            //      App type Base type
                            //      For normal user: System type
                            if (
                                    (type.stowage.typeTypeId === 1 && type.name === "App") ||
                                    (type.stowage.typeTypeId === 3) ||
                                    (!manager.userCanWorkWithSystemTypesAndAppBaseTypes && type.stowage.typeTypeId === 2)
                                ) {

                                bProtected = true;
                            }
                            self.dialog.controlObject["baseEdit"].setProtected(bProtected);
                            exceptionRet = self.dialog.controlObject["baseEdit"].setText(type.stowage.baseTypeName);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            bProtected = false;
                            // Protect against editing Description in these cases:
                            //      For normal users: App type Base type; System type
                            //      For manager.userAllowedToCreateEditPurchProjs: System type
                            //      For manager.userCanWorkWithSystemTypesAndAppBaseTypes: no prohibition
                            if (
                                    (!manager.userCanWorkWithSystemTypesAndAppBaseTypes && !manager.userAllowedToCreateEditPurchProjs && type.stowage.typeTypeId > 1) ||
                                    (manager.userAllowedToCreateEditPurchProjs && type.stowage.typeTypeId === 2)
                                ) {
                                
                                bProtected = true;
                            }
                            self.dialog.controlObject["descriptionEdit"].setProtected(bProtected);
                            exceptionRet = self.dialog.controlObject["descriptionEdit"].setText(type.stowage.description);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Set the system type to 0 or 1 if the field is present.
                            if (!self.dialog.controlObject["systemTypeEdit"]) {

                                return null;
                            }

                            // The System Type setting is always protected.
                            self.dialog.controlObject["systemTypeEdit"].setProtected(true);
                            return self.dialog.controlObject["systemTypeEdit"].setText(type.stowage.isSystemType.toString());
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
