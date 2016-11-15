///////////////////////////////////////
// ComicBuilder module.
//
// Gui component responsible for showing 
// a Comic and all its parts and
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
            var functionRet = function ComicBuilder() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from DialogHost.
                    self.inherits(DialogHost);

                    ///////////////////////
                    // Public fields.

                    // Comic being edited.
                    self.currentComic = null;

                    ///////////////////////
                    // Public methods.

                    // Attach instance to DOM and initialize state.
                    self.create = function () {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "ComicBuilder: Instance already created!" };
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
                                            localSelf.saveComicName = localSelf.getText();
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    },
                                    exitFocus: function (localSelf) {

                                        try {

                                            // If the name has changed, update the name.
                                            if (localSelf.saveComicName !== localSelf.getText()) {

                                                // Generate an unique name.
                                                var strUnique = window.manager.getUniqueName(localSelf.getText(),
                                                    self.currentComic.owner.comics,
                                                    "data",
                                                    "name");

                                                // Update GUI.
                                                var exceptionRet = localSelf.setText(strUnique);
                                                if (exceptionRet) {

                                                    throw exceptionRet;
                                                }

                                                // Update the other GUI (in the project dialog).
                                                self.currentComic.listItem.name = strUnique;

                                                // Update data too.
                                                self.currentComic.data.name = strUnique;
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

                                            // Update Comic's description.
                                            self.currentComic.data.description = localSelf.getText();
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

                            window.comicBuilder = null;
                            m_bCreated = false;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Load Comic into Comic builder.
                    self.loadComic = function (comicPart) {

                        try {

                            // Store the context.
                            self.currentComic = comicPart;

                            // Ensure the Comic has the requisit attributes.
                            if (!self.currentComic.data) {

                                self.currentComic.data = {};
                            }
                            if (!self.currentComic.data.name) {

                                self.currentComic.data.name = "[name goes here]";
                            }
                            if (!self.currentComic.data.description) {

                                self.currentComic.data.description = "[description goes here]";
                            }

                            // Update controls.

                            var bProtected = false;
                            var exceptionRet = self.dialog.controlObject["nameEdit"].setProtected(bProtected);
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = self.dialog.controlObject["nameEdit"].setText(self.currentComic.data.name);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            bProtected = false;
                            exceptionRet = self.dialog.controlObject["descriptionEdit"].setProtected(bProtected);
                            if (exceptionRet) {
                                return exceptionRet;
                            }

                            return self.dialog.controlObject["descriptionEdit"].setText(self.currentComic.data.description);
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
