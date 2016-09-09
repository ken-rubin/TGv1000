///////////////////////////////////////
// TypeTree module.
//
// Gui component responsible for showing 
// the list of method parameters and 
// events associated with a set of types.
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
    "NextWave/source/utility/ListHost",
    "NextWave/source/manager/ListItem"],
    function (prototypes, settings, Point, Size, Area, DialogHost, ListHost, ListItem) {

        try {

            // Constructor function.
            var functionRet = function TypeTree() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from DialogHost.
                    self.inherits(DialogHost);

                    ////////////////////////
                    // Public methods.

                    // Method adds a new Type.
                    self.addType = function (typeNew) {

                        try {

                            //self.items.push(typeNew);
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Remove type.
                    self.removeType = function (typeRemove) {

                        try {

                            /* Find type....
                            for (var i = 0; i < self.items.length; i++) {

                                // If found, remove it.
                                if (self.items[i].name === typeRemove.name) {

                                    self.items.splice(i, 1);
                                    break;
                                }
                            }*/
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Remove all types.
                    self.clearItems = function () {

                        try {

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Attach instance to DOM and initialize state.
                    self.create = function () {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "PropertyBuilder: Instance already created!" };
                            }

                            // Create the dialog.
                            var exceptionRet = self.dialog.create({

                                librariesLabel: {

                                    type: "Label",
                                    text: "Libraries",
                                    x: settings.general.margin,
                                    y: settings.general.margin,
                                    width: 2 * settings.general.margin,
                                    widthType: "reserve",
                                    height: settings.dialog.lineHeight
                                },
                                librariesList: {

                                    type: "ListHost",
                                    constructorParameterString: "false",
                                    x: 4 * settings.general.margin,
                                    y: settings.general.margin + 1 * settings.dialog.lineHeight,
                                    width: 4 * settings.general.margin,
                                    widthType: "reserve",
                                    height: 1.25 * settings.dialog.lineHeight,
                                    items:[

                                        new ListItem("James"), 
                                        new ListItem("Everett"), 
                                        new ListItem("Sammy"), 
                                        new ListItem("Hagar"), 
                                        new ListItem("Christoff"), 
                                        new ListItem("Ellen")
                                    ]
                                },
                                typesLabel: {

                                    type: "Label",
                                    text: "Types",
                                    x: settings.general.margin,
                                    y: settings.general.margin + 2.25 * settings.dialog.lineHeight,
                                    width: 2 * settings.general.margin,
                                    widthType: "reserve",
                                    height: settings.dialog.lineHeight
                                },
                                typesList: {

                                    type: "ListHost",
                                    constructorParameterString: "true",
                                    x: 8 * settings.general.margin,
                                    y: settings.general.margin + 3.25 * settings.dialog.lineHeight,
                                    width: 8 * settings.general.margin,
                                    widthType: "reserve",
                                    heightType: "callback",
                                    height: function (areaMaximal) {

                                        return (areaMaximal.extent.height - 7.25 * settings.dialog.lineHeight - 2 * settings.general.margin) / 4;
                                    },
                                    items:[

                                        new ListItem("Fred"), 
                                        new ListItem("Sally"), 
                                        new ListItem("George"), 
                                        new ListItem("Larry"), 
                                        new ListItem("Bill")
                                    ]
                                },
                                detailLabel: {

                                    type: "Label",
                                    text: "Detail",
                                    x: settings.general.margin,
                                    widthType: "reserve",
                                    width: 2 * settings.general.margin,
                                    yType: "callback",
                                    y: function (areaMaximal) {

                                        return settings.general.margin + 3.25 * settings.dialog.lineHeight + 
                                            (areaMaximal.extent.height - 7.25 * settings.dialog.lineHeight - 2 * settings.general.margin) / 4;
                                    },
                                    height: settings.dialog.lineHeight
                                },
                                methodsLabel: {

                                    type: "Label",
                                    text: "Methods",
                                    x: 8 * settings.general.margin,
                                    widthType: "reserve",
                                    width: 8 * settings.general.margin,
                                    yType: "callback",
                                    y: function (areaMaximal) {

                                        return settings.general.margin + 4.25 * settings.dialog.lineHeight + 
                                            (areaMaximal.extent.height - 7.25 * settings.dialog.lineHeight - 2 * settings.general.margin) / 4;
                                    },
                                    height: settings.dialog.lineHeight
                                },
                                methodsList: {

                                    type: "ListHost",
                                    constructorParameterString: "true",
                                    x: 12 * settings.general.margin,
                                    widthType: "reserve",
                                    width: 12 * settings.general.margin,
                                    yType: "callback",
                                    y: function (areaMaximal) {

                                        return settings.general.margin + 5.25 * settings.dialog.lineHeight + 
                                            (areaMaximal.extent.height - 7.25 * settings.dialog.lineHeight - 2 * settings.general.margin) / 4;
                                    },
                                    heightType: "callback",
                                    height: function (areaMaximal) {

                                        return (areaMaximal.extent.height - 7.25 * settings.dialog.lineHeight - 2 * settings.general.margin) / 4;
                                    },
                                    items:[

                                        new ListItem("Fred"), 
                                        new ListItem("Sally"), 
                                        new ListItem("George"), 
                                        new ListItem("Larry"), 
                                        new ListItem("Bill")
                                    ]
                                },
                                propertiesLabel: {

                                    type: "Label",
                                    text: "Properties",
                                    x: 8 * settings.general.margin,
                                    widthType: "reserve",
                                    width: 8 * settings.general.margin,
                                    yType: "callback",
                                    y: function (areaMaximal) {

                                        return settings.general.margin + 5.25 * settings.dialog.lineHeight + 
                                            2 * (areaMaximal.extent.height - 7.25 * settings.dialog.lineHeight - 2 * settings.general.margin) / 4;
                                    },
                                    height: settings.dialog.lineHeight
                                },
                                propertiesList: {

                                    type: "ListHost",
                                    constructorParameterString: "true",
                                    x: 12 * settings.general.margin,
                                    widthType: "reserve",
                                    width: 12 * settings.general.margin,
                                    yType: "callback",
                                    y: function (areaMaximal) {

                                        return settings.general.margin + 6.25 * settings.dialog.lineHeight + 
                                            2 * (areaMaximal.extent.height - 7.25 * settings.dialog.lineHeight - 2 * settings.general.margin) / 4;
                                    },
                                    heightType: "callback",
                                    height: function (areaMaximal) {

                                        return (areaMaximal.extent.height - 7.25 * settings.dialog.lineHeight - 2 * settings.general.margin) / 4;
                                    },
                                    items:[

                                        new ListItem("Fred"), 
                                        new ListItem("Sally"), 
                                        new ListItem("George"), 
                                        new ListItem("Larry"), 
                                        new ListItem("Bill")
                                    ]
                                },
                                eventsLabel: {

                                    type: "Label",
                                    text: "Events",
                                    x: 8 * settings.general.margin,
                                    widthType: "reserve",
                                    width: 8 * settings.general.margin,
                                    yType: "callback",
                                    y: function (areaMaximal) {

                                        return settings.general.margin + 6.25 * settings.dialog.lineHeight + 
                                            3 * (areaMaximal.extent.height - 7.25 * settings.dialog.lineHeight - 2 * settings.general.margin) / 4;
                                    },
                                    height: settings.dialog.lineHeight
                                },
                                eventsList: {

                                    type: "ListHost",
                                    constructorParameterString: "true",
                                    x: 12 * settings.general.margin,
                                    widthType: "reserve",
                                    width: 12 * settings.general.margin,
                                    yType: "callback",
                                    y: function (areaMaximal) {

                                        return settings.general.margin + 7.25 * settings.dialog.lineHeight + 
                                            3 * (areaMaximal.extent.height - 7.25 * settings.dialog.lineHeight - 2 * settings.general.margin) / 4;
                                    },
                                    heightType: "callback",
                                    height: function (areaMaximal) {

                                        return (areaMaximal.extent.height - 7.25 * settings.dialog.lineHeight - 2 * settings.general.margin) / 4;
                                    },
                                    items:[

                                        new ListItem("Fred"), 
                                        new ListItem("Sally"), 
                                        new ListItem("George"), 
                                        new ListItem("Larry"), 
                                        new ListItem("Bill")
                                    ]
                                }
                            });
                            if (exceptionRet) {

                                return exceptionRet;
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

                            window.TypeTree = null;
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

            // Inherit from List.
            functionRet.inheritsFrom(DialogHost);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
