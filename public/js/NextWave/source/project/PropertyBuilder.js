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
                    // Public fields.

                    // Property being edited.
                    self.currentProperty = null;

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

                                                // Generate an unique name.
                                                var strUnique = window.manager.getUniqueName(localSelf.getText(),
                                                    self.currentProperty.owner.properties,
                                                    "data",
                                                    "name");

                                                // Update GUI.
                                                var exceptionRet = localSelf.setText(strUnique);
                                                if (exceptionRet) {

                                                    throw exceptionRet;
                                                }

                                                // Update the other GUI.
                                                self.currentProperty.listItem.name = strUnique;

                                                // Update data too.
                                                self.currentProperty.data.name = strUnique;
                                            }
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    }
                                },
                                defaultExpressionLabel: {

                                    type: "Label",
                                    text: "Default",
                                    x: settings.general.margin,
                                    y: settings.dialog.lineHeight + 
                                        2 * settings.general.margin,
                                    width: settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight
                                },
                                defaultExpressionEdit: {

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
                                    exitFocus: function (localSelf) {

                                        try {

                                            // Update it description.
                                            self.currentProperty.data.defaultExpression = localSelf.getText();
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

                                            // Update it description.
                                            self.currentProperty.data.description = localSelf.getText();
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
                    self.loadProperty = function (property) {

                        try {

                            // Store the context.
                            self.currentProperty = property;

                            // Ensure the type has the requisit attributes.
                            if (!self.currentProperty.data) {

                                self.currentProperty.data = {};
                            }
                            if (!self.currentProperty.data.name) {

                                self.currentProperty.data.name = "[name]";
                            }
                            if (!self.currentProperty.data.defaultExpression) {

                                self.currentProperty.data.defaultExpression = "";
                            }
                            if (!self.currentProperty.data.description) {

                                self.currentProperty.data.description = "[description]";
                            }

                            // Update controls.

                            var bProtected = false;
                            // Protect against editing property name in these cases:
                            //      if in system types or App base types and !manager.userCanWorkWithSystemTypesAndAppBaseTypes.
                            //      for all users: x, y, width, height of system type VisualObject.
                            if (
                                (!manager.userCanWorkWithSystemTypesAndAppBaseTypes && self.currentProperty.owner.data.typeTypeId > 1) ||
                                (self.currentProperty.owner.data.name === "VisualObject" && ['x','y','width','height'].indexOf(self.currentProperty.data.name) > -1 )
                                ) {

                                bProtected = true;
                            }
                            var exceptionRet = self.dialog.controlObject["nameEdit"].setProtected(bProtected);
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = self.dialog.controlObject["nameEdit"].setText(self.currentProperty.data.name);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            var bProtected = false;
                            // Protect against changing/editing type name of property cases:
                            //      if in system types or App base types and !manager.userCanWorkWithSystemTypesAndAppBaseTypes.
                            //      for all users: the properties x, y, width, height of system type VisualObject.
                            // Same code as above, but it mightneed tweaking some day.
                            if (
                                (!manager.userCanWorkWithSystemTypesAndAppBaseTypes && self.currentProperty.owner.data.typeTypeId > 1) ||
                                (self.currentProperty.owner.data.name === "VisualObject" && ['x','y','width','height'].indexOf(self.currentProperty.data.name) > -1 )
                                ) {

                                bProtected = true;
                            }
                            exceptionRet = self.dialog.controlObject["defaultExpression"].setProtected(bProtected);
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = self.dialog.controlObject["defaultExpression"].setText(self.currentProperty.data.defaultExpression);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            var bProtected = false;
                            // Protect against editing property description in these cases:
                            //      if in system types or App base types and !manager.userCanWorkWithSystemTypesAndAppBaseTypes.
                            if (!manager.userCanWorkWithSystemTypesAndAppBaseTypes && self.currentProperty.owner.data.typeTypeId > 1) {

                                bProtected = true;
                            }
                            exceptionRet = self.dialog.controlObject["descriptionEdit"].setProtected(bProtected);
                            if (exceptionRet) {
                                return exceptionRet;
                            }

                            return self.dialog.controlObject["descriptionEdit"].setText(self.currentProperty.data.description);
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
