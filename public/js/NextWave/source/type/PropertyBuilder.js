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

                                throw { message: "Instance already created!" };
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
                                            localSelf.savePropertyName = localSelf.text;
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    },
                                    exitFocus: function (localSelf) {

                                        try {

                                            // If the name has changed, update the name.
                                            if (localSelf.savePropertyName !== localSelf.text) {

                                                // Extract the context type from the host.
                                                var typeContext = localSelf.dialog.host.typeContext;

                                                // Ensure the value is unique.
                                                localSelf.text = window.manager.getUniqueName(localSelf.text,
                                                    typeContext.properties.parts,
                                                    "name");

                                                // Update.
                                                window.manager.editPropertyName(typeContext,
                                                    localSelf.savePropertyName,
                                                    localSelf.text);
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
                                            localSelf.saveType = localSelf.text;
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    },
                                    exitFocus: function (localSelf) {

                                        try {

                                            // Ensure the type value is a valid type:

                                            // Test it.
                                            if (!window.manager.isValidPropertyTypeName(localSelf.text)) {

                                                // Reset base class on error.
                                                localSelf.text = localSelf.saveType;
                                            } else {

                                                // Save value.                                                                                            // Get the current type.
                                                var propertyContext = localSelf.dialog.host.propertyContext;

                                                // Update it description.
                                                propertyContext.stowage.type = localSelf.text;
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
                                            propertyContext.stowage.description = localSelf.text;
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    }
                                },
                                creatorHeaderLabel: {

                                    type: "Label",
                                    text: "Creator",
                                    x: settings.general.margin,
                                    y: 7 * settings.dialog.lineHeight + 
                                        3 * settings.general.margin,
                                    width: settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight
                                },
                                creatorLabel: {

                                    type: "Label",
                                    x: 2 * settings.general.margin + 
                                        settings.dialog.firstColumnWidth,
                                    y: 7 * settings.dialog.lineHeight + 
                                        4 * settings.general.margin,
                                    widthType: "reserve",           // Reserve means: subtract the width from
                                                                    //  the total width on calculateLayout.
                                    width: 3 * settings.general.margin +
                                        settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight
                                },
                                createdHeaderLabel: {

                                    type: "Label",
                                    text: "Created",
                                    x: settings.general.margin,
                                    y: 8 * settings.dialog.lineHeight + 
                                        5 * settings.general.margin,
                                    width: settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight
                                },
                                createdLabel: {

                                    type: "Label",
                                    x: 2 * settings.general.margin + 
                                        settings.dialog.firstColumnWidth,
                                    y: 8 * settings.dialog.lineHeight + 
                                        5 * settings.general.margin,
                                    widthType: "reserve",           // Reserve means: subtract the width from
                                                                    //  the total width on calculateLayout.
                                    width: 3 * settings.general.margin +
                                        settings.dialog.firstColumnWidth,
                                    height: settings.dialog.lineHeight
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

                            m_bCreated = false;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Load Property into property builder.
                    self.loadProperty = function (type, property) {

                        try {

                            // Ensure the type has the requisit attributes.
                            if (!property.stowage) {

                                property.stowage = {};
                            }
                            if (!property.stowage.type) {

                                property.stowage.type = "Number";
                            }
                            if (!property.stowage.description) {

                                property.stowage.description = "[description goes here]";
                            }
                            if (!property.stowage.creator) {

                                property.stowage.creator = "[creator goes here]";
                            }
                            if (!property.stowage.created) {

                                property.stowage.created = "[created goes here]";
                            }

                            // Store the context.
                            self.typeContext = type;
                            self.propertyContext = property;

                            // Update controls.
                            self.dialog.controlObject["nameEdit"].text = property.name;
                            self.dialog.controlObject["typeEdit"].text = property.stowage.type;
                            self.dialog.controlObject["descriptionEdit"].text = property.stowage.description;
                            self.dialog.controlObject["creatorLabel"].text = property.creator;
                            self.dialog.controlObject["createdLabel"].text = property.created;
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
