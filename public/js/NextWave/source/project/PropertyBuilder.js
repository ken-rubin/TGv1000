///////////////////////////////////////
// PropertyBuilder module.
//
// Gui component responsible for showing 
// a property and all its parts and
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
            var functionRet = function PropertyBuilder() {

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

                                throw { message: "PropertyBuilder: Instance already created!" };
                            }

                            // Create the dialog.
                            var exceptionRet = self.dialog.create({

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
                                            localSelf.savePropertyName = localSelf.getText();
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    },
                                    exitFocus: function (localSelf) {

                                        try {

                                            // If the name has changed, update the name.
                                            if (localSelf.savePropertyName !== localSelf.getText()) {

                                                // Extract the context type from the host.
                                                var typeContext = localSelf.dialog.host.typeContext;

                                                // Ensure the value is unique.
                                                var exceptionRet = localSelf.setText(window.manager.getUniqueName(localSelf.getText(),
                                                    typeContext.properties.parts,
                                                    "name"));
                                                if (exceptionRet) {

                                                    throw exceptionRet;
                                                }

                                                // Update.
                                                window.manager.editPropertyName(typeContext,
                                                    localSelf.savePropertyName,
                                                    localSelf.getText());
                                            }
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    }
                                },
                                typeLabel: {

                                    type: "Label",
                                    text: "Type",
                                    x: settings.general.margin,
                                    y: settings.dialog.lineHeight + 
                                        2 * settings.general.margin,
                                    width: settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight
                                },
                                typeEdit: {

                                    type: "Edit",
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
                                            localSelf.saveType = localSelf.getText();
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    },
                                    exitFocus: function (localSelf) {

                                        try {

                                            // Ensure the type value is a valid type:

                                            // Test it.
                                            if (!window.manager.isValidPropertyTypeName(localSelf.getText())) {

                                                // Reset base class on error.
                                                var exceptionRet = localSelf.setText(localSelf.saveType);
                                                if (exceptionRet) {

                                                    throw exceptionRet;
                                                }
                                            } else {

                                                // Save value.                                                                                            // Get the current type.
                                                var propertyContext = localSelf.dialog.host.propertyContext;

                                                // Update it description.
                                                propertyContext.stowage.typeName = localSelf.getText();
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
                                            var propertyContext = localSelf.dialog.host.propertyContext;

                                            // Update it description.
                                            propertyContext.stowage.description = localSelf.getText();
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    }
                                }
                            });

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

                            window.PropertyBuilder = null;
                            m_bCreated = false;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Load Property into property builder.
                    self.loadProperty = function (type, property) {

                        try {

                            // With no method currently selected, clear out namesPanel.
                            window.manager.panelLayer.clearNames();

                            // Ensure the type has the requisit attributes.
                            if (!property.stowage) {

                                property.stowage = {};
                            }
                            if (!property.stowage.typeName) {

                                property.stowage.typeName = "Number";
                            }
                            if (!property.stowage.description) {

                                property.stowage.description = "[description goes here]";
                            }

                            // Store the context.
                            self.typeContext = type;
                            self.propertyContext = property;


                            // Update controls.

                            var bProtected = false;
                            // Protect against editing property name in these cases:
                            //      if in system types or App base types and !manager.userCanWorkWithSystemLibsAndTypes.
                            //      for all users: x, y, width, height of system type VisualObject.
                            if (
                                (!manager.userCanWorkWithSystemLibsAndTypes && type.stowage.typeTypeId > 1) ||
                                (type.name === "VisualObject" && ['x','y','width','height'].indexOf(property.name) > -1 )
                                ) {

                                bProtected = true;
                            }
                            var exceptionRet = self.dialog.controlObject["nameEdit"].setProtected(bProtected);
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = self.dialog.controlObject["nameEdit"].setText(property.name);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            var bProtected = false;
                            // Protect against changing/editing type name of property cases:
                            //      if in system types or App base types and !manager.userCanWorkWithSystemLibsAndTypes.
                            //      for all users: the properties x, y, width, height of system type VisualObject.
                            // Same code as above, but it mightneed tweaking some day.
                            if (
                                (!manager.userCanWorkWithSystemLibsAndTypes && type.stowage.typeTypeId > 1) ||
                                (type.name === "VisualObject" && ['x','y','width','height'].indexOf(property.name) > -1 )
                                ) {

                                bProtected = true;
                            }
                            exceptionRet = self.dialog.controlObject["typeEdit"].setProtected(bProtected);
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = self.dialog.controlObject["typeEdit"].setText(property.stowage.typeName);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            var bProtected = false;
                            // Protect against editing property description in these cases:
                            //      if in system types or App base types and !manager.userCanWorkWithSystemLibsAndTypes.
                            if (!manager.userCanWorkWithSystemLibsAndTypes && type.stowage.typeTypeId > 1) {

                                bProtected = true;
                            }
                            exceptionRet = self.dialog.controlObject["descriptionEdit"].setProtected(bProtected);
                            if (exceptionRet) {
                                return exceptionRet;
                            }

                            return self.dialog.controlObject["descriptionEdit"].setText(property.stowage.description);
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

            // Inherit from List.
            functionRet.inheritsFrom(DialogHost);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
