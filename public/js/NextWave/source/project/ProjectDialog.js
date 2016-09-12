///////////////////////////////////////
// ProjectDialog module.
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
    "NextWave/source/manager/ListItem",
    "NextWave/source/project/Library",
    "NextWave/source/project/Type",
    "NextWave/source/project/Method",
    "NextWave/source/project/Property",
    "NextWave/source/project/Event"],
    function (prototypes, settings, Point, Size, Area, DialogHost, ListHost, ListItem, Library, Type, Method, Property, Event) {

        try {

            // Constructor function.
            var functionRet = function ProjectDialog() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from DialogHost.
                    self.inherits(DialogHost);

                    ////////////////////////
                    // Public fields.

                    // The currently loaded Project.
                    self.currentProject = null;
                    // The currently loaded Comic.
                    self.currentComic = null;
                    // The currently loaded Library.
                    self.currentLibrary = null;
                    // The currently loaded Type.
                    self.currentType = null;
                    // The currently loaded Method.
                    self.currentMethod = null;
                    // The currently loaded Property.
                    self.currentProperty = null;
                    // The currently loaded Event.
                    self.currentEvent = null;

                    ////////////////////////
                    // Public methods.

                    // Set current Library.
                    self.setCurrentLibrary = function (library) {

                        try {

                            self.currentLibrary = library;
                            self.currentType = null;
                            self.currentMethod = null;
                            self.currentProperty = null;
                            self.currentEvent = null;
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Set current Type.
                    self.setCurrentType = function (type) {

                        try {

                            self.currentType = type;
                            self.currentMethod = null;
                            self.currentProperty = null;
                            self.currentEvent = null;
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Set current Method.
                    self.setCurrentMethod = function (method) {

                        try {

                            self.currentMethod = method;
                            self.currentProperty = null;
                            self.currentEvent = null;
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Set current Property.
                    self.setCurrentProperty = function (property) {

                        try {

                            self.currentMethod = null;
                            self.currentProperty = property;
                            self.currentEvent = null;
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Set current Event.
                    self.setCurrentEvent = function (event) {

                        try {

                            self.currentMethod = null;
                            self.currentProperty = null;
                            self.currentEvent = event;
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Load project into dialog.
                    self.loadProject = function (project) {

                        try {

                            // Clear all lists.
                            var exceptionRet = self.clearProject();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Save off Project.
                            self.currentProject = project;

                            // Extract the currnet Comic.
                            var comicCurrent = project.comics[project.data.currentComicIndex];

                            // Save off Comic.
                            self.currentComic = comicCurrent;

                            // Call down.
                            return self.loadLibraries(comicCurrent.libraries);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Load libraries into dialog.
                    self.loadLibraries = function (arrayLibraries) {

                        try {

                            // Loop over libraries.
                            var libraryFirst = null;
                            for (var i = 0; i < arrayLibraries.length; i++) {

                                // Extract ith Library.
                                var libraryIth = arrayLibraries[i];

                                // Save the first Library.
                                if (!libraryFirst) {

                                    libraryFirst = libraryIth;
                                }

                                // Add the Library's ListItem to the library list.
                                var exceptionRet = self.dialog.controlObject["librariesList"].list.addItem(libraryIth.listItem);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            // If there is at least one Library, then select it.
                            if (libraryFirst) {

                                return libraryFirst.select();
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Load the specified library into dialog.
                    self.loadLibrary = function (library) {

                        try {

                            // Clear out existing types.
                            var exceptionRet = self.clearTypes();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Loop over Types in this Library.
                            var typeFirst = null;
                            for (var i = 0; i < library.types.length; i++) {

                                // Extract ith Library.
                                var typeIth = library.types[i];

                                // Save the first Type.
                                if (!typeFirst) {

                                    typeFirst = typeIth;
                                }

                                // Add the Type's ListItem to the type list.
                                exceptionRet = self.dialog.controlObject["typesList"].list.addItem(typeIth.listItem);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            // If there is at least one Library, then select it.
                            if (typeFirst) {

                                return typeFirst.select();
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Delete the specified library.
                    self.deleteLibrary = function (library) {

                        try {

                            // Remove from current Comic Library list.
                            for (var i = 0; i < self.currentComic.libraries.length; i++) {

                                var libraryIth = self.currentComic.libraries[i];
                                if (libraryIth === library) {

                                    self.currentComic.libraries.splice(i, 1);
                                    break;
                                }
                            }

                            // Reload libraries.
                            return self.loadProject(self.currentProject);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Load the specified library into dialog.
                    self.loadType = function (type) {

                        try {

                            // Clear out existing types.
                            var exceptionRet = self.clearMethods();
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = self.clearProperties();
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = self.clearEvents();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Loop over Methods in this Type.
                            var methodFirst = null;
                            for (var i = 0; i < type.methods.length; i++) {

                                // Extract ith Method.
                                var methodIth = type.methods[i];

                                // Save the first Type.
                                if (!methodFirst) {

                                    methodFirst = methodIth;
                                }

                                // Add the Method's ListItem to the type list.
                                exceptionRet = self.dialog.controlObject["methodsList"].list.addItem(methodIth.listItem);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            // Loop over Properties in this Type.
                            var propertyFirst = null;
                            for (var i = 0; i < type.properties.length; i++) {

                                // Extract ith Method.
                                var propertyIth = type.properties[i];

                                // Save the first Type.
                                if (!propertyFirst) {

                                    propertyFirst = propertyIth;
                                }

                                // Add the Method's ListItem to the type list.
                                exceptionRet = self.dialog.controlObject["propertiesList"].list.addItem(propertyIth.listItem);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            // Loop over Events in this Type.
                            var eventFirst = null;
                            for (var i = 0; i < type.events.length; i++) {

                                // Extract ith Event.
                                var eventIth = type.events[i];

                                // Save the first Event.
                                if (!eventFirst) {

                                    eventFirst = eventIth;
                                }

                                // Add the Event's ListItem to the Event list.
                                exceptionRet = self.dialog.controlObject["eventsList"].list.addItem(eventIth.listItem);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            // If there is at least one Method, then select it.
                            if (methodFirst) {

                                return methodFirst.select();
                            } else if (propertyFirst) {

                                return propertyFirst.select();
                            } else if (eventFirst) {

                                return eventFirst.select();
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Delete the specified Type.
                    self.deleteType = function (type) {

                        try {

                            // Remove from current Library Type list.
                            for (var i = 0; i < self.currentLibrary.types.length; i++) {

                                var typeIth = self.currentLibrary.types[i];
                                if (typeIth === type) {

                                    self.currentLibrary.types.splice(i, 1);
                                    break;
                                }
                            }

                            // Reload Types.
                            return self.loadLibrary(self.currentLibrary);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Delete the specified Method.
                    self.deleteMethod = function (method) {

                        try {

                            // Remove from current Type's Method list.
                            for (var i = 0; i < self.currentType.methods.length; i++) {

                                var methodIth = self.currentType.methods[i];
                                if (methodIth === method) {

                                    self.currentType.methods.splice(i, 1);
                                    break;
                                }
                            }

                            // Reload Type.
                            return self.loadType(self.currentType);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Delete the specified Property.
                    self.deleteProperty = function (property) {

                        try {

                            // Remove from current Type's Property list.
                            for (var i = 0; i < self.currentType.properties.length; i++) {

                                var propertyIth = self.currentType.properties[i];
                                if (propertyIth === property) {

                                    self.currentType.properties.splice(i, 1);
                                    break;
                                }
                            }

                            // Reload Type.
                            return self.loadType(self.currentType);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Delete the specified Event.
                    self.deleteEvent = function (event) {

                        try {

                            // Remove from current Type's Event list.
                            for (var i = 0; i < self.currentType.events.length; i++) {

                                var eventIth = self.currentType.events[i];
                                if (eventIth === event) {

                                    self.currentType.events.splice(i, 1);
                                    break;
                                }
                            }

                            // Reload Type.
                            return self.loadType(self.currentType);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Clear list of Project.
                    self.clearProject = function () {

                        try {

                            // Clear dependent lists.
                            return self.clearLibraries();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Clear list of Libraries.
                    self.clearLibraries = function () {

                        try {

                            // Clear the libraries list.
                            var exceptionRet = self.dialog.controlObject["librariesList"].list.clearItems();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Clear dependent lists too.
                            return self.clearTypes();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Clear list of Types.
                    self.clearTypes = function () {

                        try {

                            // Clear the types List.
                            var exceptionRet = self.dialog.controlObject["typesList"].list.clearItems();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Clear dependent lists too.
                            exceptionRet = self.clearMethods();
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = self.clearProperties();
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            return self.clearEvents();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Clear list of Methods.
                    self.clearMethods = function () {

                        try {

                            // Clear the methods List.
                            return self.dialog.controlObject["methodsList"].list.clearItems();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Clear list of Properties.
                    self.clearProperties = function () {

                        try {

                            // Clear the properties List.
                            return self.dialog.controlObject["propertiesList"].list.clearItems();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Clear list of Events.
                    self.clearEvents = function () {

                        try {

                            // Clear the events List.
                            return self.dialog.controlObject["eventsList"].list.clearItems();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Attach instance to DOM and initialize state.
                    self.create = function () {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "ProjectDialog: Instance already created!" };
                            }

                            // Create the dialog.
                            var exceptionRet = self.dialog.create({

                                librariesLabel: {

                                    type: "Label",
                                    text: "Libraries",
                                    x: settings.general.margin,
                                    y: settings.general.margin,
                                    width: 3 * settings.general.margin + settings.glyphs.smallWidth,
                                    widthType: "reserve",
                                    height: settings.dialog.lineHeight
                                },
                                addLibraryGlyph: {

                                    type: "GlyphHost",
                                    constructorParameterString: "'addNew'",
                                    clickHandler: m_functionAddLibrary,
                                    xType: "callback",
                                    x: function (areaMaximal) {

                                        return areaMaximal.extent.width - settings.general.margin - settings.glyphs.smallWidth;
                                    },
                                    yType: "callback",
                                    y: function (areaMaximal) {

                                        return 2 * settings.general.margin;
                                    },
                                    width: settings.glyphs.smallWidth,
                                    height: settings.glyphs.smallHeight
                                },
                                librariesList: {

                                    type: "ListHost",
                                    constructorParameterString: "false",
                                    x: 4 * settings.general.margin,
                                    y: settings.general.margin + 1 * settings.dialog.lineHeight,
                                    width: 4 * settings.general.margin,
                                    widthType: "reserve",
                                    height: 1.25 * settings.dialog.lineHeight,
                                    items:[]
                                },
                                typesLabel: {

                                    type: "Label",
                                    text: "Types",
                                    x: settings.general.margin,
                                    y: settings.general.margin + 2.25 * settings.dialog.lineHeight,
                                    width: 3 * settings.general.margin + settings.glyphs.smallWidth,
                                    widthType: "reserve",
                                    height: settings.dialog.lineHeight
                                },
                                addTypeGlyph: {

                                    type: "GlyphHost",
                                    constructorParameterString: "'addNew'",
                                    clickHandler: m_functionAddType,
                                    xType: "callback",
                                    x: function (areaMaximal) {

                                        return areaMaximal.extent.width - settings.general.margin - settings.glyphs.smallWidth;
                                    },
                                    yType: "callback",
                                    y: function (areaMaximal) {

                                        return 2 * settings.general.margin + 2.25 * settings.dialog.lineHeight;
                                    },
                                    width: settings.glyphs.smallWidth,
                                    height: settings.glyphs.smallHeight
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
                                    items:[]
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
                                    width: 10 * settings.general.margin + settings.glyphs.smallWidth,
                                    yType: "callback",
                                    y: function (areaMaximal) {

                                        return settings.general.margin + 4.25 * settings.dialog.lineHeight + 
                                            (areaMaximal.extent.height - 7.25 * settings.dialog.lineHeight - 2 * settings.general.margin) / 4;
                                    },
                                    height: settings.dialog.lineHeight
                                },
                                addMethodGlyph: {

                                    type: "GlyphHost",
                                    constructorParameterString: "'addNew'",
                                    clickHandler: m_functionAddMethod,
                                    xType: "callback",
                                    x: function (areaMaximal) {

                                        return areaMaximal.extent.width - settings.general.margin - settings.glyphs.smallWidth;
                                    },
                                    yType: "callback",
                                    y: function (areaMaximal) {

                                        return 2 * settings.general.margin + 4.25 * settings.dialog.lineHeight + 
                                            (areaMaximal.extent.height - 7.25 * settings.dialog.lineHeight - 2 * settings.general.margin) / 4;
                                    },
                                    width: settings.glyphs.smallWidth,
                                    height: settings.glyphs.smallHeight
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
                                    items:[]
                                },
                                propertiesLabel: {

                                    type: "Label",
                                    text: "Properties",
                                    x: 8 * settings.general.margin,
                                    widthType: "reserve",
                                    width: 10 * settings.general.margin + settings.glyphs.smallWidth,
                                    yType: "callback",
                                    y: function (areaMaximal) {

                                        return settings.general.margin + 5.25 * settings.dialog.lineHeight + 
                                            2 * (areaMaximal.extent.height - 7.25 * settings.dialog.lineHeight - 2 * settings.general.margin) / 4;
                                    },
                                    height: settings.dialog.lineHeight
                                },
                                addPropertyGlyph: {

                                    type: "GlyphHost",
                                    constructorParameterString: "'addNew'",
                                    clickHandler: m_functionAddProperty,
                                    xType: "callback",
                                    x: function (areaMaximal) {

                                        return areaMaximal.extent.width - settings.general.margin - settings.glyphs.smallWidth;
                                    },
                                    yType: "callback",
                                    y: function (areaMaximal) {

                                        return 2 * settings.general.margin + 5.25 * settings.dialog.lineHeight + 
                                            2 * (areaMaximal.extent.height - 7.25 * settings.dialog.lineHeight - 2 * settings.general.margin) / 4;
                                    },
                                    width: settings.glyphs.smallWidth,
                                    height: settings.glyphs.smallHeight
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
                                    items:[]
                                },
                                eventsLabel: {

                                    type: "Label",
                                    text: "Events",
                                    x: 8 * settings.general.margin,
                                    widthType: "reserve",
                                    width: 10 * settings.general.margin + settings.glyphs.smallWidth,
                                    yType: "callback",
                                    y: function (areaMaximal) {

                                        return settings.general.margin + 6.25 * settings.dialog.lineHeight + 
                                            3 * (areaMaximal.extent.height - 7.25 * settings.dialog.lineHeight - 2 * settings.general.margin) / 4;
                                    },
                                    height: settings.dialog.lineHeight
                                },
                                addEventGlyph: {

                                    type: "GlyphHost",
                                    constructorParameterString: "'addNew'",
                                    clickHandler: m_functionAddEvent,
                                    xType: "callback",
                                    x: function (areaMaximal) {

                                        return areaMaximal.extent.width - settings.general.margin - settings.glyphs.smallWidth;
                                    },
                                    yType: "callback",
                                    y: function (areaMaximal) {

                                        return 2 * settings.general.margin + 6.25 * settings.dialog.lineHeight + 
                                            3 * (areaMaximal.extent.height - 7.25 * settings.dialog.lineHeight - 2 * settings.general.margin) / 4;
                                    },
                                    width: settings.glyphs.smallWidth,
                                    height: settings.glyphs.smallHeight
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
                                    items:[]
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
                    // Private methods.

                    // Invoked when the add Library icon is clicked.
                    var m_functionAddLibrary = function () {

                        try {

                            // Must have a Comic to add a Library to it.
                            if (!self.currentComic) {

                                return null;
                            }

                            // Generate an unique name.
                            var strUnique = window.manager.getUniqueName("NewLibrary",
                                self.currentComic.libraries,
                                "data",
                                "name");

                            // Create the new Library.
                            var libraryNew = new Library(self.currentComic);
                            var exceptionRet = libraryNew.create({

                                name: strUnique,
                                types: []
                            });
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add the Library's ListItem to the library list.
                            exceptionRet = self.dialog.controlObject["librariesList"].list.addItem(libraryNew.listItem);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add to the library to the current comic.
                            self.currentComic.libraries.push(libraryNew);

                            // Scroll to the end of the list.
                            exceptionRet = self.dialog.controlObject["librariesList"].list.scrollToEndOfList();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            return libraryNew.select();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the add Type icon is clicked.
                    var m_functionAddType = function () {

                        try {

                            // Must have a Library to add a Type to it.
                            if (!self.currentLibrary) {

                                return null;
                            }

                            // Generate an unique name.
                            var strUnique = window.manager.getUniqueName("NewType",
                                self.currentLibrary.types,
                                "data",
                                "name");

                            // Create the new Type.
                            var typeNew = new Type(self.currentLibrary);
                            var exceptionRet = typeNew.create({

                                name: strUnique,
                                methods: [],
                                properties: [],
                                events: []
                            });
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add the Type's ListItem to the type list.
                            exceptionRet = self.dialog.controlObject["typesList"].list.addItem(typeNew.listItem);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add to the Type to the current Library.
                            self.currentLibrary.types.push(typeNew);

                            // Scroll to the end of the list.
                            exceptionRet = self.dialog.controlObject["typesList"].list.scrollToEndOfList();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            return typeNew.select();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the add Method icon is clicked.
                    var m_functionAddMethod = function () {

                        try {

                            // Must have a Type to add a Method to it.
                            if (!self.currentType) {

                                return null;
                            }

                            // Generate an unique name.
                            var strUnique = window.manager.getUniqueName("NewMethod",
                                self.currentType.methods,
                                "data",
                                "name");

                            // Create the new Method.
                            var methodNew = new Method(self.currentType);
                            var exceptionRet = methodNew.create({

                                name: strUnique
                            });
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add the Method's ListItem to the method list.
                            exceptionRet = self.dialog.controlObject["methodsList"].list.addItem(methodNew.listItem);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add to the Method to the current Type.
                            self.currentType.methods.push(methodNew);

                            // Scroll to the end of the list.
                            exceptionRet = self.dialog.controlObject["methodsList"].list.scrollToEndOfList();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            return methodNew.select();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the add Property icon is clicked.
                    var m_functionAddProperty = function () {

                        try {

                            // Must have a Type to add a Property to it.
                            if (!self.currentType) {

                                return null;
                            }

                            // Generate an unique name.
                            var strUnique = window.manager.getUniqueName("NewProperty",
                                self.currentType.properties,
                                "data",
                                "name");

                            // Create the new Property.
                            var propertyNew = new Property(self.currentType);
                            var exceptionRet = propertyNew.create({

                                name: strUnique
                            });
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add the Property's ListItem to the property list.
                            exceptionRet = self.dialog.controlObject["propertiesList"].list.addItem(propertyNew.listItem);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add to the Property to the current Type.
                            self.currentType.properties.push(propertyNew);

                            // Scroll to the end of the list.
                            exceptionRet = self.dialog.controlObject["propertiesList"].list.scrollToEndOfList();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            return propertyNew.select();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the add Event icon is clicked.
                    var m_functionAddEvent = function () {

                        try {

                            // Must have a Type to add an Event to it.
                            if (!self.currentType) {

                                return null;
                            }

                            // Generate an unique name.
                            var strUnique = window.manager.getUniqueName("NewEvent",
                                self.currentType.events,
                                "data",
                                "name");

                            // Create the new Event.
                            var eventNew = new Event(self.currentType);
                            var exceptionRet = eventNew.create({

                                name: strUnique
                            });
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add the Event's ListItem to the event list.
                            exceptionRet = self.dialog.controlObject["eventsList"].list.addItem(eventNew.listItem);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add to the Event to the current Type.
                            self.currentType.events.push(eventNew);

                            // Scroll to the end of the list.
                            exceptionRet = self.dialog.controlObject["eventsList"].list.scrollToEndOfList();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            return eventNew.select();
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
