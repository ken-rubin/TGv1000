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
    "NextWave/source/utility/Accordion",
    "NextWave/source/utility/List",
    "NextWave/source/utility/ListHost",
    "NextWave/source/utility/ListItem",
    "NextWave/source/project/Project",
    "NextWave/source/project/Comic",
    "NextWave/source/project/Library",
    "NextWave/source/project/Type",
    "NextWave/source/project/Method",
    "NextWave/source/project/Property",
    "NextWave/source/project/Event"],
    function (prototypes, settings, Point, Size, Area, DialogHost, Accordion, List, ListHost, ListItem, Project, Comic, Library, Type, Method, Property, Event) {

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

                    // Load project into dialog.
                    self.loadProject = function (project) {

                        try {

                            // Clear all comics.
                            var exceptionRet = self.clearComics();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Loop over Comics in this Project.
                            for (var i = 0; i < project.comics.length; i++) {

                                // Extract ith Comics.
                                var comicIth = project.comics[i];

                                // Add the Comic's ListItem to the Comics list.
                                exceptionRet = m_listComics.addItem(comicIth.listItem);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            // Save the current project.
                            self.currentProject = project;

                            // Extract the current Comic.
                            var comicCurrent = project.comics[project.data.currentComicIndex];

                            // If there is at least one Library, then select it.
                            if (comicCurrent) {

                                return comicCurrent.select();
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Load the specified Comic into dialog.
                    self.loadComic = function (comic) {

                        try {

                            // Clear out existing types.
                            var exceptionRet = self.clearLibraries();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Loop over Libraries in this Comic.
                            var libraryFirst = null;
                            for (var i = 0; i < comic.libraries.length; i++) {

                                // Extract ith Library.
                                var libraryIth = comic.libraries[i];

                                // Save the first Type.
                                if (!libraryFirst) {

                                    libraryFirst = libraryIth;
                                }

                                // Add the Library's ListItem to the Library list.
                                exceptionRet = m_listLibraries.addItem(libraryIth.listItem);
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

                    // Delete the specified Comic.
                    self.deleteComic = function (comic) {

                        try {

                            // Clear the selected comics.
                            let exceptionRet = self.setCurrentComic(null);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Remove from current Project data Comic list.
                            for (var i = 0; i < self.currentProject.data.comics.length; i++) {

                                var comicIth = self.currentProject.data.comics[i];
                                if (comicIth === comic.data) {

                                    self.currentProject.data.comics.splice(i, 1);
                                    break;
                                }
                            }

                            // Also remove from current Project Comic list.
                            for (var i = 0; i < self.currentProject.comics.length; i++) {

                                var comicIth = self.currentProject.comics[i];
                                if (comicIth === comic) {

                                    self.currentProject.comics.splice(i, 1);
                                    break;
                                }
                            }

                            // Reload project.
                            return self.loadProject(self.currentProject);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Set current Comic.
                    self.setCurrentComic = function (comic) {

                        try {

                            self.currentComic = comic;
                            self.currentLibrary = null;
                            self.currentType = null;
                            self.currentMethod = null;
                            self.currentProperty = null;
                            self.currentEvent = null;
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Clear list of Comics.
                    self.clearComics = function () {

                        try {

                            // Clear the comics list.
                            var exceptionRet = m_listComics.clearItems();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Clear dependent lists.
                            return self.clearLibraries();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Loop over the current Comic's Libraries, 
                    // loop over the Libraries Types and match.
                    self.getLibrary = function (strType) {

                        // Scan the Libraries in the current Comic.
                        for (var i = 0; i < self.currentComic.libraries.length; i++) {

                            // Extract ith Library.
                            var libraryIth = self.currentComic.libraries[i];

                            for (var j = 0; j < libraryIth.types.length; j++) {

                                // Extract jth Type.
                                var typeJth = libraryIth.types[j];

                                if (typeJth.data.name === strType) {

                                    return libraryIth.data.name;
                                }
                            }
                        }

                        // Failed.
                        return null;
                    };

                    // Method causes the Library section to open.
                    self.openLibrarysSection = function () {

                        try {

                            return self.dialog.controlObject["projectAccordion"].openSection("libraries");
                        } catch (e) {

                            return e;
                        }
                    };

                    // Merge the specified library into dialog.
                    self.mergeLibrary = function (library) {

                        try {

                            return m_functionAddLibrary(library);
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
                                exceptionRet = m_listTypes.addItem(typeIth.listItem);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            // If there is at least one Type, then select it.
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

                            // Clear the selected library.
                            let exceptionRet = self.setCurrentLibrary(null);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Remove from current Comic data Library list.
                            for (var i = 0; i < self.currentComic.data.libraries.length; i++) {

                                var libraryIth = self.currentComic.data.libraries[i];
                                if (libraryIth === library.data) {

                                    self.currentComic.data.libraries.splice(i, 1);
                                    break;
                                }
                            }

                            // Remove from current Comic Library list.
                            for (var i = 0; i < self.currentComic.libraries.length; i++) {

                                var libraryIth = self.currentComic.libraries[i];
                                if (libraryIth === library) {

                                    self.currentComic.libraries.splice(i, 1);
                                    break;
                                }
                            }

                            // Reload Comic.
                            return self.loadComic(self.currentComic);
                        } catch (e) {

                            return e;
                        }
                    };

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

                    // Clear list of Libraries.
                    self.clearLibraries = function () {

                        try {

                            // Clear the libraries list.
                            var exceptionRet = m_listLibraries.clearItems();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Clear dependent lists too.
                            return self.clearTypes();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Method causes the types section to open.
                    self.openTypesSection = function () {

                        try {

                            return self.dialog.controlObject["projectAccordion"].openSection("types");
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
                                exceptionRet = m_listMethods.addItem(methodIth.listItem);
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
                                exceptionRet = m_listProperties.addItem(propertyIth.listItem);
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
                                exceptionRet = m_listEvents.addItem(eventIth.listItem);
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

                            // Clear the selected type.
                            let exceptionRet = self.setCurrentType(null);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Remove from current Library data Type list.
                            for (var i = 0; i < self.currentLibrary.data.types.length; i++) {

                                var typeIth = self.currentLibrary.data.types[i];
                                if (typeIth === type.data) {

                                    self.currentLibrary.data.types.splice(i, 1);
                                    break;
                                }
                            }

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

                    // Clear list of Types.
                    self.clearTypes = function () {

                        try {

                            // Clear the types List.
                            var exceptionRet = m_listTypes.clearItems();
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

                    // Delete the specified Method.
                    self.deleteMethod = function (method) {

                        try {

                            // Clear the selected method.
                            let exceptionRet = self.setCurrentMethod(null);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Remove from current Type's data Method list.
                            for (var i = 0; i < self.currentType.data.methods.length; i++) {

                                var methodIth = self.currentType.data.methods[i];
                                if (methodIth === method.data) {

                                    self.currentType.data.methods.splice(i, 1);
                                    break;
                                }
                            }

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

                    // Clear list of Methods.
                    self.clearMethods = function () {

                        try {

                            // Clear the methods List.
                            return m_listMethods.clearItems();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Delete the specified Property.
                    self.deleteProperty = function (property) {

                        try {

                            // Clear the selected Property.
                            let exceptionRet = self.setCurrentProperty(null);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Remove from current Type's data Property list.
                            for (var i = 0; i < self.currentType.data.properties.length; i++) {

                                var propertyIth = self.currentType.data.properties[i];
                                if (propertyIth === property.data) {

                                    self.currentType.data.properties.splice(i, 1);
                                    break;
                                }
                            }

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

                    // Clear list of Properties.
                    self.clearProperties = function () {

                        try {

                            // Clear the properties List.
                            return m_listProperties.clearItems();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Delete the specified Event.
                    self.deleteEvent = function (event) {

                        try {

                            // Clear the selected Event.
                            let exceptionRet = self.setCurrentEvent(null);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Remove from current Type's datt Event list.
                            for (var i = 0; i < self.currentType.data.events.length; i++) {

                                var eventIth = self.currentType.data.events[i];
                                if (eventIth === event.data) {

                                    self.currentType.data.events.splice(i, 1);
                                    break;
                                }
                            }

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

                    // Clear list of Events.
                    self.clearEvents = function () {

                        try {

                            // Clear the events List.
                            return m_listEvents.clearItems();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Build and return a collection of types.
                    self.generateJavaScript = function () {

                        // Allocate an object to return.
                        var objectRet = {};

                        // Allocate array which holds module strings.
                        objectRet.types = [];

                        // Always just relative to a comic.
                        var exceptionRet = self.currentComic.generateJavaScript(objectRet.types);
                        if (exceptionRet) {

                            throw exceptionRet;
                        }

                        return objectRet;
                    };

                    // Loop down to save each method of each type.
                    self.save = function () {

                        try {

                            // Always relative to the current comic (for now...).
                            return self.currentComic.save();
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

                            // Add input element.
                            let elementInput = document.createElement("input");
                            elementInput.id = "ProjectDialogInput";
                            elementInput.type = "file";
                            elementInput.style = "display:none;";
                            elementInput.addEventListener("change", 
                                function (event) {

                                    try {

                                        // .
                                        var reader = new FileReader();

                                        reader.onload = function(e) {

                                            var text = reader.result;
                                            let objectLibrary = JSON.parse(text);
                                            //alert(text);
                                            m_functionAddLibrary(objectLibrary);
                                        }

                                        reader.readAsText(this.files[0]);
                                        this.value = "";

                                    } catch (e) {

                                        alert(e.message);
                                    }
                                });
                            document.body.appendChild(elementInput);

                            // Create the dialog.
                            var exceptionRet = self.dialog.create({

                                projectAccordion: {

                                    type: "Accordion",
                                    x: settings.general.margin,
                                    y: 2 * settings.general.margin,
                                    widthType: "reserve",
                                    width: settings.general.margin,
                                    heightType: "callback",
                                    height: function (areaMaximal) {

                                        return (areaMaximal.extent.height - 
                                            6 * settings.general.margin) / 2;
                                    },
                                    title: "Project",
                                    sections: [{

                                        name: "comics",
                                        title: "Comics",
                                        selectionAccessorProperty: "currentComic",
                                        addGlyphClickHandler: m_functionAddComic
                                    }, {

                                        name: "libraries",
                                        title: "Libraries",
                                        selectionAccessorProperty: "currentLibrary",
                                        addGlyphClickHandler: m_functionAddLibrary,
                                        saveGlyphClickHandler: m_functionSaveLibrary,
                                        searchGlyphClickHandler: m_functionSearchLibrary
                                    }, {

                                        name: "types",
                                        title: "Types",
                                        selectionAccessorProperty: "currentType",
                                        addGlyphClickHandler: m_functionAddType
                                    }]
                                },
                                typeAccordion: {

                                    type: "Accordion",
                                    x: settings.general.margin,
                                    yType: "callback",
                                    y: function (areaMaximal) {

                                        return 4 * settings.general.margin +
                                            (areaMaximal.extent.height - 
                                            6 * settings.general.margin) / 2;
                                    },
                                    widthType: "reserve",
                                    width: settings.general.margin,
                                    heightType: "callback",
                                    height: function (areaMaximal) {

                                        return (areaMaximal.extent.height - 
                                            6 * settings.general.margin) / 2;
                                    },
                                    title: "Details",
                                    sections: [{

                                        name: "methods",
                                        title: "Methods",
                                        selectionAccessorProperty: "currentMethod",
                                        addGlyphClickHandler: m_functionAddMethod
                                    }, {

                                        name: "properties",
                                        title: "Properties",
                                        selectionAccessorProperty: "currentProperty",
                                        addGlyphClickHandler: m_functionAddProperty
                                    }, {

                                        name: "events",
                                        title: "Events",
                                        selectionAccessorProperty: "currentEvent",
                                        addGlyphClickHandler: m_functionAddEvent
                                    }]
                                }
                            });
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Save controls:
                            var accordianProject = self.dialog.controlObject["projectAccordion"];
                            if (accordianProject) {

                                m_listProjects = accordianProject.projects || new List();
                                m_listComics = accordianProject.comics || new List();
                                m_listLibraries = accordianProject.libraries || new List();
                                m_listTypes = accordianProject.types || new List();
                            } else {

                                m_listProjects = new List();
                                m_listComics = new List();
                                m_listLibraries = new List();
                                m_listTypes = new List();
                            }
                            var accordianType = self.dialog.controlObject["typeAccordion"];
                            if (accordianType) {

                                m_listMethods = accordianType.methods || new List();
                                m_listProperties = accordianType.properties || new List();
                                m_listEvents = accordianType.events || new List();
                            } else {

                                m_listMethods = new List();
                                m_listProperties = new List();
                                m_listEvents = new List();
                            }

                            // Because it is!
                            m_bCreated = true;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    ///////////////////////
                    // Private methods.

                    // Invoked when the add Comic icon is clicked.
                    var m_functionAddComic = function () {

                        try {

                            // Must have a Project to add a Comic to it.
                            if (!self.currentProject) {

                                return null;
                            }

                            // Generate an unique name.
                            var strUnique = window.manager.getUniqueName("NewComic",
                                self.currentProject.comics,
                                "data",
                                "name");

                            // Create the new Comic.
                            var comicNew = new Comic(self.currentProject);
                            var exceptionRet = comicNew.create({

                                id: 0,
                                name: strUnique,
                                libraries: [],
                                ownedByUserId: parseInt(g_profile["userId"], 10),
                                description: ""
                            });
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add the Comic's ListItem to the Comic list.
                            exceptionRet = m_listComics.addItem(comicNew.listItem);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add the comic to the current Project.
                            self.currentProject.comics.push(comicNew);
                            self.currentProject.data.comics.push(comicNew.data);

                            // Scroll to the end of the list.
                            exceptionRet = m_listComics.scrollToEndOfList();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            return comicNew.select();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the add Library icon is clicked.
                    var m_functionAddLibrary = function (objectLibrary) {

                        try {

                            // Must have a Comic to add a Library to it.
                            if (!self.currentComic) {

                                return null;
                            }

                            // Generate an unique name.
                            var strUnique = window.manager.getUniqueName(objectLibrary.name || "NewLibrary",
                                self.currentComic.libraries,
                                "data",
                                "name");

                            // Create the new Library.
                            var libraryNew = new Library(self.currentComic);
                            if (!objectLibrary ||
                                !objectLibrary.hasOwnProperty("id")) {

                                objectLibrary = {

                                    id: 0,
                                    name: strUnique,
                                    types: [],
                                    ownedByUserId: parseInt(g_profile["userId"], 10),
                                    isSystemLibrary: false,
                                    isBaseLibrary: false,
                                    isAppLibrary: false,
                                    references: "",
                                    editors: "",
                                    description: ""
                                };
                            } else {

                                objectLibrary.name = strUnique;
                            }
                            var exceptionRet = libraryNew.create(objectLibrary);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add the Library's ListItem to the library list.
                            exceptionRet = m_listLibraries.addItem(libraryNew.listItem);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add to the library to the current comic.
                            self.currentComic.libraries.push(libraryNew);
                            self.currentComic.data.libraries.push(libraryNew.data);

                            // Scroll to the end of the list.
                            exceptionRet = m_listLibraries.scrollToEndOfList();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            return libraryNew.select();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the save Library icon is clicked.
                    var m_functionSaveLibrary = function () {

                        try {

                            // Save the current library.
                            let exceptionRet = self.currentLibrary.save();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            let jsonArray = JSON.stringify(self.currentLibrary.data, undefined, 4).split('\r\n');
                            let file = new File(jsonArray, self.currentLibrary.data.name + ".json", {type: "text/plain;charset=utf-8"});
                            saveAs(file);

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the seach Library icon is clicked.
                    var m_functionSearchLibrary = function () {

                        try {

                            // Click the hidden input to dropdown the select file browser facility.
                            document.getElementById("ProjectDialogInput").click();

                            return null;
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
                                baseTypeName: "",
                                description: "",

                                methods: [],
                                properties: [],
                                events: [],
                                ownedByUserId: parseInt(g_profile["userId"], 10)
                            });
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add the Type's ListItem to the type list.
                            exceptionRet = m_listTypes.addItem(typeNew.listItem);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add to the Type to the current Library.
                            self.currentLibrary.types.push(typeNew);
                            self.currentLibrary.data.types.push(typeNew.data);

                            // Scroll to the end of the list.
                            exceptionRet = m_listTypes.scrollToEndOfList();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Select the Type, but only to allow the method to be added to it.
                            exceptionRet = typeNew.select();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add constructor.
                            exceptionRet = m_functionAddMethod("constructor");
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Select the Type, this time for the GUI.
                            return typeNew.select();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the add Method icon is clicked.
                    var m_functionAddMethod = function (strName) {

                        try {

                            // Must have a Type to add a Method to it.
                            if (!self.currentType) {

                                return null;
                            }

                            // If substr is not defined, then undefined out the parameter.
                            if (!strName.substr) {

                                strName = undefined;
                            }

                            // Set unique to name.
                            var strUnique = strName;

                            // If no name specified, generate an unique sequencial one.
                            if (strUnique === undefined) {

                                strUnique = window.manager.getUniqueName("NewMethod",
                                    self.currentType.methods,
                                    "data",
                                    "name");
                            }

                            // Create the new Method.
                            var methodNew = new Method(self.currentType);
                            var exceptionRet = methodNew.create({

                                name: strUnique,
                                ownedByUserId: parseInt(g_profile["userId"], 10),
                                parameters: [],
                                statements: []
                            });
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add the Method's ListItem to the method list.
                            exceptionRet = m_listMethods.addItem(methodNew.listItem);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add to the Method to the current Type.
                            self.currentType.methods.push(methodNew);
                            self.currentType.data.methods.push(methodNew.data);

                            // Scroll to the end of the list.
                            exceptionRet = m_listMethods.scrollToEndOfList();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // If no name specified, select the method.
                            if (strName === undefined) {

                                return methodNew.select();
                            } else {

                                return null;
                            }
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

                                name: strUnique,
                                defaultExpression: "",
                                ownedByUserId: parseInt(g_profile["userId"], 10)
                            });
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add the Property's ListItem to the property list.
                            exceptionRet = m_listProperties.addItem(propertyNew.listItem);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add to the Property to the current Type.
                            self.currentType.properties.push(propertyNew);
                            self.currentType.data.properties.push(propertyNew.data);

                            // Scroll to the end of the list.
                            exceptionRet = m_listProperties.scrollToEndOfList();
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

                                name: strUnique,
                                ownedByUserId: parseInt(g_profile["userId"], 10)
                            });
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add the Event's ListItem to the event list.
                            exceptionRet = m_listEvents.addItem(eventNew.listItem);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add to the Event to the current Type.
                            self.currentType.events.push(eventNew);
                            self.currentType.data.events.push(eventNew.data);

                            // Scroll to the end of the list.
                            exceptionRet = m_listEvents.scrollToEndOfList();
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
                    // Lists from dialog.
                    var m_listProjects = null;
                    var m_listComics = null;
                    var m_listLibraries = null;
                    var m_listTypes = null;
                    var m_listMethods = null;
                    var m_listProperties = null;
                    var m_listEvents = null;
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
