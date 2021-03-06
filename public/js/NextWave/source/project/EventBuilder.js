///////////////////////////////////////
// EventBuilder module.
//
// Gui component responsible for showing 
// an Event and all its parts and
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
            var functionRet = function EventBuilder() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from DialogHost.
                    self.inherits(DialogHost);

                    ///////////////////////
                    // Public fields.

                    // Event being edited.
                    self.currentEvent = null;

                    ///////////////////////
                    // Public methods.

                    // Attach instance to DOM and initialize state.
                    self.create = function () {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "EventBuilder: Instance already created!" };
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
                                            localSelf.saveEventName = localSelf.getText();
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    },
                                    exitFocus: function (localSelf) {

                                        try {

                                            // If the name has changed, update the name.
                                            if (localSelf.saveEventName !== localSelf.getText()) {

                                                // Generate an unique name.
                                                var strUnique = window.manager.getUniqueName(localSelf.getText(),
                                                    self.currentEvent.owner.events,
                                                    "data",
                                                    "name");

                                                // Update GUI.
                                                var exceptionRet = localSelf.setText(strUnique);
                                                if (exceptionRet) {

                                                    throw exceptionRet;
                                                }

                                                // Update the other GUI (in the project dialog).
                                                self.currentEvent.listItem.name = strUnique;

                                                // Update data too.
                                                self.currentEvent.data.name = strUnique;
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

                                            // Update Event's description.
                                            self.currentEvent.data.description = localSelf.getText();
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

                            window.EventBuilder = null;
                            m_bCreated = false;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Load Event into Event builder.
                    self.loadEvent = function (eventPart) {

                        try {

                            // Store the context.
                            self.currentEvent = eventPart;

                            // Ensure the event has the requisit attributes.
                            if (!self.currentEvent.data) {

                                self.currentEvent.data = {};
                            }
                            if (!self.currentEvent.data.name) {

                                self.currentEvent.data.name = "[name goes here]";
                            }
                            if (!self.currentEvent.data.description) {

                                self.currentEvent.data.description = "[description goes here]";
                            }

                            // Update controls.

                            var bProtected = false;
                            // Protect against editing Event name in these cases:
                            //      if in system types or App base types and !manager.userCanWorkWithSystemTypesAndAppBaseTypes.
                            //      for all users: x, y, width, height of system type VisualObject.
                            if (!manager.userCanWorkWithSystemTypesAndAppBaseTypes && 
                                self.currentEvent.owner.data.typeTypeId > 1) {

                                bProtected = true;
                            }
                            var exceptionRet = self.dialog.controlObject["nameEdit"].setProtected(bProtected);
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = self.dialog.controlObject["nameEdit"].setText(self.currentEvent.data.name);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            bProtected = false;
                            // Protect against editing property description in these cases:
                            //      if in system types or App base types and !manager.userCanWorkWithSystemTypesAndAppBaseTypes.
                            if (!manager.userCanWorkWithSystemTypesAndAppBaseTypes && 
                                self.currentEvent.owner.data.typeTypeId > 1) {

                                bProtected = true;
                            }
                            exceptionRet = self.dialog.controlObject["descriptionEdit"].setProtected(bProtected);
                            if (exceptionRet) {
                                return exceptionRet;
                            }

                            return self.dialog.controlObject["descriptionEdit"].setText(self.currentEvent.data.description);
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
