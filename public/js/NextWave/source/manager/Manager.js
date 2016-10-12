///////////////////////////////////////
// Manager module.
//
// Main interface module with the outside world.
// Responsible for the root Canvas object and
// establishing event handlers for mouse and touch
// events and propogating down through the layers.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/settings",
    "NextWave/source/manager/simulator",
    "NextWave/source/utility/Area",
    "NextWave/source/utility/Point",
    "NextWave/source/utility/Size",
    "NextWave/source/manager/Layer",
    "NextWave/source/manager/LayerBackground",
    "NextWave/source/manager/LayerCanvas",
    "NextWave/source/manager/LayerPanels",
    "NextWave/source/manager/LayerDebug",
    "NextWave/source/manager/LayerDrag",
    "NextWave/source/manager/LayerAl",
    "NextWave/source/expression/Expression",
    "NextWave/source/literal/Literal",
    "NextWave/source/statement/Statement",
    "NextWave/source/name/Name",
    "NextWave/source/methodBuilder/CodeExpression",
    "NextWave/source/methodBuilder/CodeStatement",
    "NextWave/source/methodBuilder/Parameter",
    "NextWave/source/methodBuilder/ParameterList",
    "NextWave/source/methodBuilder/StatementList",
    "NextWave/source/project/Project",
    "NextWave/source/project/Comic",
    "NextWave/source/project/Library",
    "NextWave/source/project/Type",
    "NextWave/source/project/Method",
    "NextWave/source/project/Property",
    "NextWave/source/project/Event"],
    function (prototypes, settings, simulator, Area, Point, Size, Layer, LayerBackground, LayerCanvas, LayerPanels, LayerDebug, LayerDrag, LayerAl, Expression, Literal, Statement, Name, CodeExpression, CodeStatement, Parameter, ParameterList, StatementList, Project, Comic, Library, Type, Method, Property, Event) {

        try {

            // Constructor function.
        	var functionRet = function Manager() {

                try {

            		var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public fields.

                    // Hold reference to the background layer.
                    self.backgroundLayer = null;
                    // Hold reference to the canvas layer.
                    self.canvasLayer = null;
                    // Hold reference to the drag layer.
                    self.dragLayer = null;
                    // Hold reference to the debug layer.
                    self.debugLayer = null;
                    // Holds the active panelLayer.
                    self.panelLayer = null;
                    // Holds reference to the designer layer.
                    // self.designerLayer = null;
                    // Object used to initialize this instance.
                    self.projectData = null;
                    // Directly set focus object, overrides dragObject.
                    self.alternateFocus = null;
                    // Collection of types available in the current context.
                    self.types = [];

                    // Only one of the following can be true, but both can be false.
                    // Indicates there is a project which has been loaded up into this manager.
                    self.projectLoaded = false;
                    // Holds currently displayed version of panelLayer.
                    // 0 means panelLayer has no panels at all.
                    // 1 means panels are set for normal projects with all panels present.
                    self.iPanelArrangement = 0;
                    
                    // Indicates that the current user is allowed to create or edit classes, products or online classes.
                    self.userAllowedToCreateEditPurchProjs = false;
                    // Current type/method.
                    self.context = {

                        type: null,
                        method: null
                    };

                    ////////////////////////
                    // Code interface.

                    // Method invoked by game base type.
                    self.startGame = function () {

                        try {

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    ////////////////////////
                    // Public methods.

                    // Initialze instance.
                    self.create = function () {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "Manager: Instance already created!" };
                            }

                            // Store the manager in window, 
                            // so it is universally accessible.
                            window.manager = self;

                            // Allocate and create the background layer.
                            self.backgroundLayer = new LayerBackground();
                            var exceptionRet = self.backgroundLayer.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Allocate and create the canvas layer.
                            self.canvasLayer = new LayerCanvas();
                            var exceptionRet = self.canvasLayer.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Allocate and create the debug layer.
                            self.debugLayer = new LayerDebug();
                            exceptionRet = self.debugLayer.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Allocate and create the drag layer.
                            self.dragLayer = new LayerDrag();
                            exceptionRet = self.dragLayer.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Allocate and create the 2 panel layers.
                            // [0]: No panels.
                            // [1]: Panels in the normal project configuration.
                            for (var i = 0; i < 2; i++) {

                                var pl = new LayerPanels();
                                exceptionRet = pl.create(i);
                                if (exceptionRet) { throw exceptionRet; }
                                m_arrayPanelLayers.push(pl);
                            }

                            // Allocate and create the Al layer.
                            var la = new LayerAl();
                            exceptionRet = la.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Save off the layers.
                            // The order of entries in this array serve to designate back to front.
                            // For example, panelLayer is "above" lb which is below ld.
                            // Mouse actions are passed to layers in reverse order, i.e., from front to back.
                            // If a layer doesn't see fit to handle a mouse action, the action is passed to the
                            // next lower layer for possible handling.
                            m_arrayLayers = 
                                [
                                    self.backgroundLayer,
                                    self.canvasLayer,
                                    self.panelLayer,
                                    self.debugLayer,
                                    self.dragLayer
                                ];

                            // Get the parent references.
                            m_jqParent = $(settings.manager.hostSelector);
                            if (m_jqParent.length === 0) {

                                throw { message: "Failed to select parent element: " + settings.manager.hostSelector };
                            }

                            // Create the render canvas.
                            m_canvasRender = document.createElement("canvas");
                            m_canvasRender.id = "LayerManagerSurface";
                            m_canvasRender.tabIndex = "1";
                            m_contextRender = m_canvasRender.getContext("2d");
                            m_jqCanvas = $(m_canvasRender);
                            m_jqCanvas.css({

                                    position: "absolute"
                                });
                            m_jqCanvas.on('dragstart', function(evt) {

                                return false;
                            });
                            m_jqCanvas.on('drop', function(evt) {

                                return false;
                            });
                            m_jqParent.append(m_canvasRender);

                            // Hook the resize to update the size of the dashboard when the browser is resized.
                            $(window).bind("resize",
                                m_functionWindowResize);

                            // Wire events to canvas.
                            m_jqCanvas.bind("mouseup",
                                m_functionMouseUp);
                            m_jqCanvas.bind("mousedown",
                                m_functionMouseDown);
                            m_jqCanvas.bind("mousemove",
                                m_functionMouseMove);
                            m_jqCanvas.bind("mousewheel", 
                                m_functionMouseWheel);
                            m_jqCanvas.bind("mouseout",
                                m_functionMouseOut);

                            m_jqCanvas.bind("keydown",
                                m_functionKeyDown);
                            m_jqCanvas.bind("keypress",
                                m_functionKeyPressed);
                            m_jqCanvas.bind("keyup",
                                m_functionKeyUp);

                            // Now activate the empty panelLayer.
                            exceptionRet = self.clearPanels(1);
                            if (exceptionRet) { return exceptionRet; }

                            // Start the rendering.
                            m_iAnimationFrameSequence = requestAnimationFrame(m_functionRender);

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Clear panels.
                    // iPanelArrangement = 0 for an empty panelLayer.
                    // iPanelArrangement = 1 for a normal project.
                    self.clearPanels = function (iPanelArrangement) {

                        try {

                            var exceptionRet;

                            self.iPanelArrangement = iPanelArrangement || 0;
                            self.panelLayer = m_arrayPanelLayers[self.iPanelArrangement];
                            m_arrayLayers = 
                                [
                                    self.backgroundLayer,
                                    self.canvasLayer,
                                    self.panelLayer,
                                    self.debugLayer,
                                    self.dragLayer
                                ];

                            // Collection of types available in the current context.
                            self.types = [];
                            // Current type/method.
                            self.context = {

                                type: null,
                                method: null
                            };

                            // Reset *Loaded.
                            self.projectLoaded = false;

                            // Clear panel data.
                            return self.panelLayer.clearCenter();
                        } catch (e) {

                            return e;
                        }
                    }

                    // Clear out project.
                    self.loadNoProject = function () {

                        try {

                            var exceptionRet = self.clearPanels(0);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            return null;

                        } catch (e) {

                            return e;
                        }
                    }

                    // Load all types and visible/existing panels 
                    // into this manager instance from persistence.
                    // objectprojectData is comics[i].data as loaded from database.
                    // It needs to be massaged a bit.
                    //
                    // This is basically the opposite of what goes on in project.saveToDatabase();
                    self.loadProject = function (objectProject) {

                        try {

                            var exceptionRet = self.clearPanels(1);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Save the project attributes.
                            self.projectData = objectProject;

                            if (objectProject) {

                                // Extract the comic.
                                var objectComic = objectProject.comics[objectProject.currentComicIndex];

                                // Build up an object hierarchy from the data.
                                if (!window.tg) {

                                    window.tg = {};
                                }

                                window.tg.project = new Project();
                                exceptionRet = window.tg.project.create(objectProject);
                                if (exceptionRet) { 

                                    return exceptionRet; 
                                }

                                // Load up the project into the ProjectDialog.
                                exceptionRet = window.projectDialog.loadProject(window.tg.project);
                                if (exceptionRet) { return exceptionRet; }

                                // Set loaded.
                                self.projectLoaded = true;

                                return self.panelLayer.openAndPinAllPanels();
                            }

                            return null;
                        } catch (e) { return e; }
                    }

                    // Method invoked when a project is saved.
                    self.save = function () {

                        try {

                            return window.projectDialog.save();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Force render.
                    self.forceRender = function () {

                        return m_functionRender();
                    }

                    // Run and stop running buttons.
                    self.runButtonClicked = function () {

                        try {

                            // Hide panels, ai, and drag.
                            self.canvasLayer.active = true;
                            self.panelLayer.active = false;
                            self.dragLayer.active = false;

                            // Build all javascript code.
                            var objectModules = self.generateJavaScript();
                            return simulator.start(objectModules);
                        } catch(e) {

                            return e;
                        }
                    }
                    self.stopButtonClicked = function () {

                        try {

                            // Stop simulating.
                            var exceptionRet = simulator.stop();

                            // Re-enable panels and drag.
                            self.canvasLayer.active = false;
                            self.panelLayer.active = true;
                            self.dragLayer.active = true;

                            // Cause a resize.
                            m_functionWindowResize();

                            return null;
                        } catch(e) {

                            return e;
                        }
                    }

                    // Test the provisional base type name for validity.
                    self.isValidBaseTypeName = function (strTypeName, strProvisionalBaseTypeName) {

                        return true;
                    };

                    // Test the provisional property type name for validity.
                    self.isValidPropertyTypeName = function (strProvisionalPropertyTypeName) {

                        return true;
                    };

                    // Determines if the method is selected.
                    self.getSelected = function (method) {

                        if (!self.context ||
                            !self.context.method) {

                            return false;
                        }
                        return (self.context.method === method);
                    };

                    // Build a unique name from the specified name.
                    // strName -- the initial proposed name.
                    // arrayCollection -- the collection to iterate over and ensure uniqueness.  Defaults to self.panelLayer.namesPanel.payload.items.
                    // strNameProperty -- the property-name-accessor on items in arrayCollection.
                    // strNameReferenceProperty -- the accessor property on the strNamePropety types as objects.
                    self.getUniqueName = function (strName, arrayCollection, strNameProperty, strNameRefinementProperty) {

                        try {

                            // Default collection value to names.
                            if (!arrayCollection) {

                                arrayCollection = self.panelLayer.namesPanel.payload.items;
                                strNameProperty = "name";
                                strNameRefinementProperty = null;
                            }

                            // Make sure a good JS name.
                            if (!strName) {

                                strName = "_";
                            }

                            // Check against variable name rules:

                            // Cannot start with a number:
                            strName = strName.replace(/^\d/, "_");

                            // No only letters and number and _:
                            strName = strName.replace(/[^A-Za-z0-9\_]/g, "_");

                            // Define a simple method which 
                            // searches for a matching name.
                            var functionNameExists = function (strTest) {

                                for (var i = 0; i < arrayCollection.length; i++) {

                                    var itemIth = arrayCollection[i];

                                    // Get the item in the collection.  It can be a string or an object.
                                    // If it is an object, then access its Name-Property to get the string.
                                    var strValue = ((strNameProperty) ? itemIth[strNameProperty] : itemIth);
                                    // However, the Name-Property of an object, itself, could be an object.
                                    // In which case, get the Name-Refinement-Property of that as a string!
                                    strValue = ((strNameRefinementProperty) ? strValue[strNameRefinementProperty] : strValue);
                                    if (strValue === strTest) {

                                        return true;
                                    }
                                }

                                // Also test reserved words.
                                for (var i = 0; i < m_arrayReserved.length; i++) {

                                    if (m_arrayReserved[i] === strTest) {

                                        return true;
                                    }
                                }
                                return false;
                            };

                            // Keep inc'ing the name until unique.
                            var strBaseName = strName;
                            var iCounter = 2;
                            while (functionNameExists(strName)) {

                                strName = strBaseName + (iCounter++).toString();
                            }
                            return strName;
                        } catch (e) {

                            return strName;
                        }
                    };

                    // Load up statements from list of statement constructor names.
                    self.loadStatements = function (arrayList) {

                        try {

                            return self.panelLayer.loadStatements(arrayList);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Save and return list of extant statement constructors.
                    self.saveStatements = function () {

                        return self.panelLayer.saveStatements();
                    };

                    // Load up expressions from list of expression constructor names.
                    self.loadExpressions = function (arrayList) {

                        try {

                            return self.panelLayer.loadExpressions(arrayList);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Save and return list of extant expression constructors.
                    self.saveExpressions = function () {

                        return self.panelLayer.saveExpressions();
                    };

                    // Load up literals from list of literal constructor names.
                    self.loadLiterals = function (arrayList) {

                        try {

                            return self.panelLayer.loadLiterals(arrayList);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Save and return list of extant literal constructors.
                    self.saveLiterals = function () {

                        return self.panelLayer.saveLiterals();
                    };

                    // Helper method clears out the center panel and sets it up for a Project.
                    self.selectProject = function (project) {

                        try {

                            // Clear data out from previous context.
                            var exceptionRet = self.panelLayer.clearCenter("Project");
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Load up the Project into the Project builder.
                            return window.projectBuilder.loadProject(project);
                        } catch (e) {

                            return e;
                        }
                    }

                    // Helper method clears out the center panel and sets it up for a Comic.
                    self.selectComic = function (comic) {

                        try {

                            // Clear data out from previous context.
                            var exceptionRet = self.panelLayer.clearCenter("Comic");
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Load up the Comic into the Comic builder.
                            return window.comicBuilder.loadComic(comic);
                        } catch (e) {

                            return e;
                        }
                    }

                    // Helper method clears out the center panel and sets it up for a Library.
                    self.selectLibrary = function (library) {

                        try {

                            // Clear data out from previous context.
                            var exceptionRet = self.panelLayer.clearCenter("Library");
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Load up the Library into the Library builder.
                            return window.libraryBuilder.loadLibrary(library);
                        } catch (e) {

                            return e;
                        }
                    }

                    // Helper method clears out the center panel and sets it up for a type.
                    self.selectType = function (type) {

                        try {

                            // Clear data out from previous context.
                            var exceptionRet = self.panelLayer.clearCenter("Type");
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Load up the type into the type builder.
                            return window.typeBuilder.loadType(type);
                        } catch (e) {

                            return e;
                        }
                    }

                    // Helper method clears out the center panel and sets it up for a Method.
                    self.selectMethod = function (method) {

                        try {

                            // Clear data out from previous context.
                            var exceptionRet = self.panelLayer.clearCenter("Method");
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Load up the type into the type builder.
                            return window.methodBuilder.loadMethod(method);
                        } catch (e) {

                            return e;
                        }
                    }

                    // Helper method clears out the center panel and sets it up for a Property.
                    self.selectProperty = function (property) {

                        try {

                            // Clear data out from previous context.
                            var exceptionRet = self.panelLayer.clearCenter("Property");
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Load up the type into the type builder.
                            return window.propertyBuilder.loadProperty(property);
                        } catch (e) {

                            return e;
                        }
                    }

                    // Helper method clears out the center panel and sets it up for an Event.
                    self.selectEvent = function (eventEdit) {

                        try {

                            // Clear data out from previous context.
                            var exceptionRet = self.panelLayer.clearCenter("Event");
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Load up the Event into the type builder.
                            return window.eventBuilder.loadEvent(eventEdit);
                        } catch (e) {

                            return e;
                        }
                    }

                    // Put the center panel into different modes.
                    self.switchCenterPanelMode = function (strMode) {

                        try {

                            // Just pass to the panel layer.
                            return self.panelLayer.switchCenterPanelMode(strMode);
                        } catch (e) {

                            return e;   
                        }
                    };

                    // Generates JavaScript string modules for each Type.
                    self.generateJavaScript = function () {

                        // Return all the modules.
                        return window.ProjectDialog.generateJavaScript();
                    };

                    // Test object for input focus.
                    self.hasFocus = function (objectTest) {

                        // Test alternate focus first.
                        if (self.alternateFocus) {

                            return (objectTest === self.alternateFocus);
                        }

                        // Else, test drag object.
                        return (objectTest === self.dragLayer.getDragObject());
                    };

                    // Set focus to an object--this overrides drag-object focus.
                    self.setFocus = function (objectFocus) {

                        try {

                            // Call exit focus.
                            var exceptionRet = m_functionCallAlternateFocusExit();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Set the alternate focus object.
                            self.alternateFocus = objectFocus;

                            // Call enter focus.
                            return m_functionCallAlternateFocusEnter();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Set the drag object.
                    self.setDragObject = function (objectDrag) {

                        try {

                            // Call exit focus.
                            var exceptionRet = m_functionCallAlternateFocusExit();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Clear out any alternate.
                            self.alternateFocus = null;

                            // Only certain types can drag.
                            if (objectDrag instanceof Expression ||
                                objectDrag instanceof Literal ||
                                objectDrag instanceof Parameter ||
                                objectDrag instanceof Statement ||
                                objectDrag instanceof Name ||
                                objectDrag instanceof CodeExpression ||
                                objectDrag instanceof CodeStatement ||
                                objectDrag instanceof Type ||
                                objectDrag instanceof Method ||
                                objectDrag instanceof Property ||
                                objectDrag instanceof Event) {

                                // Pass to layer.
                                return self.dragLayer.setDragObject(objectDrag);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    //////////////////////////
                    // Private methods.

                    // Chooses Type to display in center panel if one has been deleted.
                    var m_functionGetNewIndex = function (typeArray, indexRemoved) {

                        var len = typeArray.length;

                        if (len === 0) {

                            return -1;
                        }

                        if (len === indexRemoved) {

                            return len - 1;
                        }

                        return indexRemoved;
                    }

                    // Helper method.
                    var m_functionCallAlternateFocusEnter = function () {

                        try {

                            // If the alternateFocus object is a control, 
                            // then it will have a configuration.  If that 
                            // object has a enterFocus method, call it now.
                            if (self.alternateFocus &&
                                self.alternateFocus.configuration &&
                                $.isFunction(self.alternateFocus.configuration.enterFocus)) {

                                // Call event.
                                self.alternateFocus.configuration.enterFocus(self.alternateFocus);
                            } else if (self.alternateFocus &&
                                $.isFunction(self.alternateFocus.enterFocus)) {

                                // Call event.
                                self.alternateFocus.enterFocus(self.alternateFocus);
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method.
                    var m_functionCallAlternateFocusExit = function () {

                        try {

                            // If the alternateFocus object is a control, 
                            // then it will have a configuration.  If that 
                            // object has a exitFocus method, call it now.
                            if (self.alternateFocus &&
                                self.alternateFocus.configuration &&
                                $.isFunction(self.alternateFocus.configuration.exitFocus)) {

                                // Call event.
                                return self.alternateFocus.configuration.exitFocus(self.alternateFocus);
                            } else if (self.alternateFocus &&
                                $.isFunction(self.alternateFocus.exitFocus)) {

                                // Call event.
                                return self.alternateFocus.exitFocus(self.alternateFocus);
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Calculate e.offsetX and e.offsetY 
                    // if they are undefined (as in Firefox).
                    var m_functionPossibleFirefoxAdjustment = function (e) {

                        try {
                            
                            // Check...
                            if (e.offsetX !== undefined &&
                                e.offsetY !== undefined)
                                return null;

                            // ... else, calculate.
                            e.offsetX = e.pageX - m_jqParent.offset().left;
                            e.offsetY = e.pageY - m_jqParent.offset().top;

                            return null;
                        } catch (e) {
                            
                            return e;
                        }
                    };

                    // Invoked when the browser is resized.
                    // Implemented to recalculate the regions
                    // and re-render the display elements.
                    var m_functionWindowResize = function (e) {

                        try {

                            // Setting dirty causes the next render to calculate layout.
                            m_bDirty[self.iPanelArrangement] = true;
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Invoked when the mouse is moved over the canvas.
                    // Implemented to pass on to managed layers, of course.
                    var m_functionMouseMove = function (e) {

                        try {

                            // Possibly normalize input in firefox.
                            var exceptionRet = m_functionPossibleFirefoxAdjustment(e);
                            if (exceptionRet !== null) {

                                return exceptionRet;
                            }

                            // Save the point to which the cursor has moved.
                            // If this is sufficiently far, a drag has staret.
                            var pointMove = new Point(e.offsetX, e.offsetY);

                            // Pass to layers from front to back and stop when handled.
                            // Object reference holds all the data that any layer or
                            // subsequently owned object could ever need to support event.
                            var objectReference = {

                                manager: self,                      // Catch-all....
                                canvas: m_canvasRender,
                                contextRender: m_contextRender,
                                pointCursor: pointMove,
                                handled: false,
                                event: e,
                                cursor: "default"
                            };
                            for (var i = m_arrayLayers.length - 1; i >= 0; i--) {

                                if (m_arrayLayers[i]) {

                                    // Pass to the layer.
                                    exceptionRet = m_arrayLayers[i].mouseMove(objectReference);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }

                                    // Only one thing can intersect the mouse at a time.
                                    if (objectReference.handled) {

                                        break;
                                    }
                                }
                            }

                            // Test for drag start.
                            if (m_pointDown &&
                                !self.dragLayer.down) {

                                // Start dragging if move sufficiently.
                                var dDistance = m_pointDown.distance(pointMove);
                                if (dDistance > settings.manager.dragDistance) {

                                    // Start dragging.
                                    exceptionRet = self.dragLayer.startDrag(m_pointDown,
                                        pointMove);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                }
                            }

                            // Alwasys set the cursor in mouse move.
                            m_canvasRender.style.cursor = objectReference.cursor;
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Invoked when the mouse is pressed down over the canvas.
                    // Implemented to pass on to managed layers, as with move.
                    var m_functionMouseDown = function (e) {

                        try {

                            // Possibly normalize input in firefox.
                            var exceptionRet = m_functionPossibleFirefoxAdjustment(e);
                            if (exceptionRet !== null) {

                                return exceptionRet;
                            }

                            // Clear existing drag object--it will be reset, 
                            // if applicable lower down in this method.
                            exceptionRet = self.dragLayer.clearDragObject();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            // Call exit focus.
                            var exceptionRet = m_functionCallAlternateFocusExit();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            self.alternateFocus = null;

                            // Handle dragging.
                            m_pointDown = new Point(e.offsetX, e.offsetY);

                            // Pass to layers from front to back and stop when handled.
                            var objectReference = {

                                manager: self,                      // Catch-all....
                                canvas: m_canvasRender,
                                contextRender: m_contextRender,
                                pointCursor: m_pointDown,
                                handled: false,
                                event: e
                            };
                            for (var i = m_arrayLayers.length - 1; i >= 0; i--) {

                                if (m_arrayLayers[i]) {

                                    // Pass to the layers.
                                    var exceptionRet = m_arrayLayers[i].mouseDown(objectReference);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }

                                    // Only one thing can intersect the mouse at a time.
                                    if (objectReference.handled) {

                                        break;
                                    }
                                }
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Invoked when the mouse is let up over the canvas.
                    // Implemented to pass on to managed layers, as with move.
                    var m_functionMouseUp = function (e) {

                        try {

                            // Possibly normalize input in firefox.
                            var exceptionRet = m_functionPossibleFirefoxAdjustment(e);
                            if (exceptionRet !== null) {

                                return exceptionRet;
                            }

                            // Pass to layers from front to back and stop when handled.
                            var objectReference = {

                                manager: self,                      // Catch-all....
                                canvas: m_canvasRender,
                                contextRender: m_contextRender,
                                pointCursor: new Point(e.offsetX, e.offsetY),
                                handled: false,
                                event: e
                            };
                            for (var i = m_arrayLayers.length - 1; i >= 0; i--) {

                                if (m_arrayLayers[i]) {

                                    // Pass to the layers.
                                    var exceptionRet = m_arrayLayers[i].mouseUp(objectReference);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }

                                    // Only one thing can intersect the mouse at a time.
                                    if (objectReference.handled) {

                                        break;
                                    }
                                }
                            }

                            // If point down, might be dragging.
                            if (m_pointDown) {

                                // If down, then dragging.
                                if (self.dragLayer.down) {

                                    // Possibly consumate the drag.
                                    exceptionRet = self.dragLayer.consumateDrag();
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                } else {

                                    // Reset handled in case it was set in mouseUp.
                                    objectReference.handled = false;

                                    // Not dragging, raise click.
                                    for (var i = m_arrayLayers.length - 1; i >= 0; i--) {

                                        if (m_arrayLayers[i]) {

                                            // Pass to the layers.
                                            var exceptionRet = m_arrayLayers[i].click(objectReference);
                                            if (exceptionRet) {

                                                throw exceptionRet;
                                            }

                                            // Only one thing can intersect the mouse at a time.
                                            if (objectReference.handled) {

                                                break;
                                            }
                                        }
                                    }
                                }

                                // Clear point down.
                                m_pointDown = null;
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Invoked when the mouse wheel is manipulated.
                    // Implemented to pass on to managed regions.
                    var m_functionMouseWheel = function (e) {

                        try {

                            // Possibly normalize input in firefox.
                            var exceptionRet = m_functionPossibleFirefoxAdjustment(e);
                            if (exceptionRet !== null) {

                                return exceptionRet;
                            }

                            // Pass to layers from front to back and stop when handled.
                            var objectReference = {

                                manager: self,                      // Catch-all....
                                canvas: m_canvasRender,
                                contextRender: m_contextRender,
                                pointCursor: new Point(e.offsetX, e.offsetY),
                                handled: false,
                                event: e
                            };
                            for (var i = m_arrayLayers.length - 1; i >= 0; i--) {

                                if (m_arrayLayers[i]) {

                                    // Pass to the layers.
                                    var exceptionRet = m_arrayLayers[i].mouseWheel(objectReference);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }

                                    // Only one thing can intersect the mouse at a time.
                                    if (objectReference.handled) {

                                        break;
                                    }
                                }
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Invoked when the mouse is moved away from the canvas.
                    // Implemented to pass on to managed regions, in reverse.
                    var m_functionMouseOut = function (e) {

                        try {

                            // Pass to layers from front to back and stop when handled.
                            var objectReference = {

                                manager: self,                      // Catch-all....
                                canvas: m_canvasRender,
                                contextRender: m_contextRender,
                                pointCursor: new Point(e.offsetX, e.offsetY),
                                handled: false,
                                event: e
                            };

                            // Count backwards, slowly from ten, ....
                            for (var i = m_arrayLayers.length - 1; i >= 0; i--) {

                                if (m_arrayLayers[i]) {

                                    // Pass to the layer.
                                    var exceptionRet = m_arrayLayers[i].mouseOut(objectReference);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                }
                            }

                            // Clear point down.
                            if (m_pointDown) {

                                m_pointDown = null;

                                // Also stop dragging.
                                var exceptionRet = self.dragLayer.cancelDrag();
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Invoked when a key is pressed down over the canvas.
                    // Implemented to pass on to managed layers.
                    var m_functionKeyDown = function (e) {

                        try {

                            // Pass to focused object.
                            var objectFocus = self.alternateFocus;
                            if (!objectFocus) {

                                objectFocus = self.dragLayer.getDragObject();
                            }
                            if (objectFocus &&
                                $.isFunction(objectFocus.keyDown)) {

                                var objectReference = {

                                    manager: self,                      // Catch-all....
                                    canvas: m_canvasRender,
                                    contextRender: m_contextRender,
                                    handled: false,
                                    which: e.which,
                                    shiftKey: e.shiftKey,
                                    ctrlKey: e.ctrlKey,
                                    stopPropagation: function () {

                                        e.preventDefault();
                                        e.stopPropagation();
                                    },
                                    event: e
                                };
                                var exceptionRet = objectFocus.keyDown(objectReference);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Invoked when a key is let up over the canvas.
                    // Implemented to pass on to managed layers.
                    var m_functionKeyUp = function (e) {

                        try {

                            // Pass to focused object.
                            var objectFocus = self.alternateFocus;
                            if (!objectFocus) {

                                objectFocus = self.dragLayer.getDragObject();
                            }
                            if (objectFocus &&
                                $.isFunction(objectFocus.keyUp)) {

                                // Pass to focused object.
                                var objectReference = {

                                    manager: self,                      // Catch-all....
                                    canvas: m_canvasRender,
                                    contextRender: m_contextRender,
                                    handled: false,
                                    which: e.which,
                                    shiftKey: e.shiftKey,
                                    ctrlKey: e.ctrlKey,
                                    stopPropagation: function () {

                                        e.preventDefault();
                                        e.stopPropagation();
                                    },
                                    event: e
                                };
                                var exceptionRet = objectFocus.keyUp(objectReference);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Invoked when a key is pressed over the canvas.
                    // Implemented to pass on to managed layers.
                    var m_functionKeyPressed = function (e) {

                        try {

                            // Pass to focused object.
                            var objectFocus = self.alternateFocus;
                            if (!objectFocus) {

                                objectFocus = self.dragLayer.getDragObject();
                            }
                            if (objectFocus &&
                                $.isFunction(objectFocus.keyPressed)) {

                                // Pass to focused object.
                                var objectReference = {

                                    manager: self,                      // Catch-all....
                                    canvas: m_canvasRender,
                                    contextRender: m_contextRender,
                                    handled: false,
                                    which: e.which,
                                    shiftKey: e.shiftKey,
                                    ctrlKey: e.ctrlKey,
                                    stopPropagation: function () {

                                        e.preventDefault();
                                        e.stopPropagation();
                                    },
                                    event: e
                                };
                                var exceptionRet = objectFocus.keyPressed(objectReference);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Calculate the section rectangles.
                    var m_functionCalculateLayout = function () {

                        try {

                            // Get the size from the container, 
                            // if possible, or default (?).
                            m_dWidth = m_jqParent.width();
                            if (m_dWidth === undefined || 
                                m_dWidth === 0) {

                                m_dWidth = settings.manager.defaultWidth;
                            }
                            m_dHeight = m_jqParent.height();
                            if (m_dHeight === undefined || 
                                m_dHeight === 0) {

                                m_dHeight = settings.manager.defaultHeight;
                            }

                            // Update canvas sizes--do this last to minimize the time that the canvas is blank.
                            m_canvasRender.width = m_dWidth;
                            m_canvasRender.height = m_dHeight;

                            // Also adjust the CSS values so the canvas never scales.
                            m_jqCanvas.css({

                                width: m_dWidth.toString() + "px",
                                height: m_dHeight.toString() + "px"
                            });

                            // Possibly not neccessary to refresh this?
                            m_contextRender = m_canvasRender.getContext("2d");
                            m_contextRender.textBaseline = "top";
                            m_contextRender.textAlign = "left";

                            // Define the extent for the layers.
                            var sizeExtent = new Size(m_dWidth, 
                                m_dHeight);

                            // Calculate the maximal area.
                            m_areaMaximal = new Area(new Point(0, 0), 
                                sizeExtent);

                            // Update all layers.
                            for (var i = 0; i < m_arrayLayers.length; i++) {

                                if (m_arrayLayers[i]) {

                                    // Pass to layer.
                                    var exceptionRet = m_arrayLayers[i].calculateLayout(sizeExtent, m_contextRender);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                }
                            }

                            // These pipes are clean!
                            m_bDirty[self.iPanelArrangement] = false;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Render out the application.
                    var m_functionRender = function () {
                        
                        try {

                            // Get "now".
                            var iMS = (new Date()).getTime();
 
                            // Calculate the layout whenever dirty.
                            var exceptionRet = null;
                            if (m_bDirty[self.iPanelArrangement]) {

                                exceptionRet = m_functionCalculateLayout();
                                if (exceptionRet !== null) {

                                    throw exceptionRet;
                                }
                            }

                            // Render each layer.  From back to front.
                            for (var i = 0; i < m_arrayLayers.length; i++) {

                                if (m_arrayLayers[i]) {

                                    // Render out the layer.
                                    exceptionRet = m_arrayLayers[i].render(m_contextRender,
                                        iMS);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                }
                            }
                        } catch (e) {
                            
                            alert(e.message);
                        } finally {

                            // Continue the rendering.
                            m_iAnimationFrameSequence = requestAnimationFrame(m_functionRender);
                        }
                    };

                    //////////////////////////
                    // Private fields.

                    // Hold reference to the panel layer array. See self.create here and LayerPanels for explanations.
                    var m_arrayPanelLayers = [];
                    // Cookie for animation callback.
                    var m_iAnimationFrameSequence = 0;
                    // jQuery object wrapping the parent DOM element.
                    var m_jqParent = null;
                    // jQuery object wrapping the child (render) DOM element.
                    var m_jqCanvas = null;
                    // The rendering canvas.
                    var m_canvasRender = null;
                    // The rendering canvas's render context.
                    var m_contextRender = null;
                    // Indicates this instance is already created.
                    var m_bCreated = false;
                    // Define the dirty state.
                    var m_bDirty = [true, true, true];
                    // Width of object.
                    var m_dWidth = 0;
                    // Height of object.
                    var m_dHeight = 0;
                    // The whole area.
                    var m_areaMaximal = null;
                    // Collection of layers to render in order.
                    var m_arrayLayers = null;
                    // Size of entire manager.
                    var m_areaMaximal = null;
                    // Point of click down.  Used to determine dragging.
                    var m_pointDown = null;
                    // Reserved JS words--for building good, unique variable names.
                    var m_arrayReserved = [

                        "abstract", "alert", "all", "anchor", "anchors", "area", "Array", "assign",
                        "Boolean", "break", "byte", "blur", "button", 
                        "case", "catch", "char", "class", "const", "continue", "checkbox", "clearInterval", "clearTimeout", "clientInformation", "close", "closed", "confirm", "constructor", "crypto",
                        "debugger", "default", "delete", "do", "double", "Date", "decodeURI", "decodeURIComponent", "defaultStatus", "document", 
                        "else", "enum", "export", "extends", "element", "elements", "embed", "encodeURI", "encodeURIComponent", "escape", "eval", "event",
                        "false", "final", "finally", "float", "for", "function", "fileUpload", "focus", "form", "forms", "frame", "frames", "frameRate",
                        "goto", "getClass",
                        "hasOwnProperty", "hidden", "history", 
                        "if", "implements", "import", "in", "instanceof", "int", "interface", "image", "images", "Infinity", "isFinite", "isNaN", "isPrototypeOf", "innerHeight", "innerWidth", 
                        "java", "JavaArray", "JavaClass", "JavaObject", "JavaPackage",
                        "let", "long", "layer", "laysers", "length", "link", "location",
                        "Math", "mimeTypes", 
                        "native", "new", "null", "name", "NaN", "navigate", "navigator",
                        "Object", "offscreenBuffering", "open", "opener", "option", "outerHeight", "outerWidth", "onbeforeunload", "onblur", "ondragdrop", "onclick", "oncontextmenu", "onerror", "onfocus", "onkeydown", "onkeypress", "onkeyup", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onreset", "onsubmit", "onunload",
                        "package", "private", "protected", "public", "packages", "pageXOffset", "pageYOffset", "parent", "pargeFloat", "parseInt", "password", "pkcs11", "plugin", "prompt", "propertyIsEnum", "prototype",
                        "return", "radio", "reset",
                        "short", "static", "super", "switch", "synchronized", "screenX", "screenY", "scroll", "secure", "select", "self", "setInterval", "setTimeout", "status", "String", "submit", 
                        "this", "throw", "throws", "transient", "true", "try", "typeof", "taint", "text", "textarea", "top", "toString", 
                        "undefined", "unescape", "untaint", 
                        "var", "void", "volatile", "valueOf", 
                        "while", "with" 
                    ];
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });




                    /* Method adds a new name to NameList and to NamesPanel.
                    self.addName = function (strName) {

                        try {

                            return self.panelLayer.addName(strName);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Method changes a name of a CodeVar or a parameter.
                    // In both of these cases change the name everyplace it's used in the current method.
                    self.changeName = function (strOriginalName, strNewName) {

                        try {

                            // Update in the names panel by getting panelLayer to do the work.
                            var exceptionRet = self.panelLayer.changeName(strOriginalName, 
                                strNewName);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Propagate the name change throughout the current method.
                            for (var i = 0; i < self.context.method.statements.items.length; i++) {

                                var stmt = self.context.method.statements.items[i];

                                var expressionRet = stmt.changeName(strOriginalName, strNewName);
                                if (expressionRet) {

                                    return expressionRet;
                                }
                            }

                            return null;

                        } catch (e) {

                            return e;
                        }
                    };

                    // Create a new, empty type.
                    self.createType = function () {

                        try {

                            // Generate a new type-name.
                            var strName = self.getUniqueName("MyType",
                                self.types,
                                "name");

                            // Create type.
                            var typeNew = new Type();
                            var exceptionRet = typeNew.create({

                                name: strName,
                                ownedByUserId: parseInt(g_profile["userId"], 10),
                                typeTypeId: 1
                            });
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            exceptionRet = self.addType(typeNew);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Select it into the GUI.
                            return self.selectType(typeNew);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Create a new, empty method.
                    self.createMethod = function (typeContaining) {

                        try {

                            // Generate a new method-name.
                            var strName = self.getUniqueName("MyMethod",
                                typeContaining.methods.parts,
                                "name");

                            // Create method.
                            var methodNew = new Method(typeContaining,
                                strName);

                            // Specify some default values...:
                            var exceptionRet = methodNew.create({

                                name: strName,
                                ownedByUserId: parseInt(g_profile["userId"], 10)
                            });
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            exceptionRet = typeContaining.methods.addPart(methodNew);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Select it into the GUI.
                            return self.setContext(typeContaining, 
                                methodNew);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Create a new, empty property.
                    self.createProperty = function (typeContaining) {

                        try {

                            // Generate a new property-name.
                            var strName = self.getUniqueName("MyProperty",
                                typeContaining.properties.parts,
                                "name");

                            // Create type.
                            var propertyNew = new Property(typeContaining,
                                strName);

                            // Specify some default values...:
                            var exceptionRet = propertyNew.create({

                                name: strName,
                                ownedByUserId: parseInt(g_profile["userId"], 10)
                            });
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            exceptionRet = typeContaining.properties.addPart(propertyNew);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Select it into the GUI.
                            return self.selectProperty(typeContaining, 
                                propertyNew);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Create a new, empty Event.
                    self.createEvent = function (typeContaining) {

                        try {

                            // Generate a new Event-name.
                            var strName = self.getUniqueName("MyEvent",
                                typeContaining.events.parts,
                                "name");

                            // Create Event.
                            var eventNew = new Event(typeContaining,
                                strName);

                            // Specify some default values...:
                            var exceptionRet = eventNew.create({

                                name: strName,
                                ownedByUserId: parseInt(g_profile["userId"], 10)
                            });
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            exceptionRet = typeContaining.events.addPart(eventNew);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Select it into the GUI.
                            return self.selectEvent(typeContaining, 
                                eventNew);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Method changes a type name.
                    self.changeTypeName = function (strOriginalName, strNewName) {

                        try {

                            var type = null;

                            // Cannot use the concat trick here because the concatenated array doesn't maintain reference.
                            for (var i = 0; i < self.types.length; i++) {

                                var typeIth = self.types[i];

                                // Find match...
                                if (self.types[i].name === strOriginalName) {

                                    // ...and update.
                                    typeIth.name = strNewName;
                                    type = typeIth;
                                    break;
                                }
                            }

                            if (!type) {

                                return new Error("Strangely, could not locate type with name: " + strOriginalName + ".");
                            }

                            var j = type.stowage.typeTypeId;
                            // 1 for App type or normal (user-added type)
                            // 3 for App base types
                            // The construct and initialize methods cannot be renamed.

                            // Always do self.types.
                            for (var i = 0; i < self.types.length; i++) {

                                var exceptionRet = self.types[i].changeTypeName(strOriginalName, strNewName);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Remove type from manager/project.
                    self.removeType = function (typeToRemove) {

                        try {

                            var indexRemoved;
                            var nameRemoved = typeToRemove.name;

                            // Search for type.
                            for (var i = 0; i < self.types.length; i++) {

                                // Find match...
                                if (self.types[i].name === nameRemoved) {

                                    // ...and remove.
                                    self.types.splice(i, 1);
                                    indexRemoved = i;
                                    break;
                                }
                            }

                            // Also remove from panel layer.
                            var exceptionRet = self.panelLayer.removeType(typeToRemove);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Select a different type if the deleted one was the one in the center panel.
                            if (window.typeBuilder.typeContext.name === nameRemoved) {

                                var newTypeIndex = m_functionGetNewIndex(self.types, indexRemoved);
                                if (newTypeIndex > -1) {

                                    return self.selectType(self.types[newTypeIndex]);
                                }

                                // Nothing left -- cannot happen in Types, actually, because no one can delete App type.
                                // But can happen in similar code in types panel.
                                self.panelLayer.clearCenter("Type");
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Remove method from specified type.
                    self.removeMethod = function (typeOwner, methodToRemove) {

                        try {

                            // Will have to see if this way works.
                            return typeOwner.methods.removePart(methodToRemove);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Remove property from specified type.
                    self.removeProperty = function (typeOwner, propertyToRemove) {

                        try {

                            // Will have to see if this way works.
                            return typeOwner.properties.removePart(propertyToRemove);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Remove event from specified type.
                    self.removeEvent = function (typeOwner, eventToRemove) {

                        try {

                            // Will have to see if this way works.
                            return typeOwner.events.removePart(eventToRemove);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Changes a Method name.
                    // It then has to loop through all Types
                    // or through all types (if Method is in a user or App type) and update
                    // uses throughout.
                    self.changeMethodName = function (type, strOriginalMethodName, strNewMethodName) {

                        try {

                            var bMethodNameChanged = false;

                            // Update in place.
                            for (var i = 0; i < type.methods.parts.length; i++) {

                                // Find match...
                                if (type.methods.parts[i].name === strOriginalMethodName) {

                                    // ...and update.
                                    type.methods.parts[i].name = strNewMethodName;
                                    bMethodNameChanged = true;
                                    break;
                                }
                            }

                            if (bMethodNameChanged) {

                                // Propagate the method name change.

                                var j = type.stowage.typeTypeId;
                                // 1 for App type or normal (user-added type)
                                // 3 for App base types
                                // The construct and initialize methods cannot be renamed.

                                // Always do self.types.
                                for (var i = 0; i < self.types.length; i++) {

                                    var exceptionRet = self.types[i].changeMethodName(type.name,
                                        strOriginalMethodName,
                                        strNewMethodName);
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Method edits a Property name.
                    self.editPropertyName = function (type, strOriginalName, strNewName) {

                        try {

                            // Update in place.
                            for (var i = 0; i < type.properties.parts.length; i++) {

                                // Find match...
                                if (type.properties.parts[i].name === strOriginalName) {

                                    // ...and update.
                                    type.properties.parts[i].name = strNewName;

                                    break;
                                }
                            }

                            // TODO: Update any allocation associated with this property.

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Method edits an Event name.
                    self.editEventName = function (type, strOriginalName, strNewName) {

                        try {

                            // Update in place.
                            for (var i = 0; i < type.events.parts.length; i++) {

                                // Find match...
                                if (type.events.parts[i].name === strOriginalName) {

                                    // ...and update.
                                    type.events.parts[i].name = strNewName;

                                    break;
                                }
                            }

                            // TODO: Update any allocation associated with this property.

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Method removes an existing name.
                    self.removeName = function (strName) {

                        try {

                            // Update in the panel.
                            return self.panelLayer.removeName(strName);
                        } catch (e) {

                            return e;
                        }
                    };
*/

                    /* Set a new context.  A type and the index into its method collection, 
                    // or iIndex can be mis-used as the name of the method for which to search.
                    self.setContext = function (type, method) {

                        try {

                            // Setting dirty causes the next render to calculate layout.
                            m_bDirty[self.iPanelArrangement] = true;

                            // Set context, load method builder.
                            self.context = {

                                type: type,
                                method: method
                            };

                            // Clear data out from previous context.
                            var exceptionRet = self.panelLayer.clearCenter("Method");
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Load up the method into the method builder.
                            exceptionRet = window.methodBuilder.loadTypeMethod(self.context);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Method adds a new Type.
                    self.addType = function (typeNew) {

                        try {

                            // If there are no types, then set context to this type,
                            // unless this type has no methods, in which case, wait.
                            if (self.context.type === null &&
                                typeNew &&
                                typeNew.methods &&
                                typeNew.methods.parts &&
                                typeNew.methods.parts.length > 0) {

                                // Set context.
                                var exceptionRet = self.setContext(typeNew,
                                    0);
                                if (exceptionRet) { return exceptionRet; }
                            }

                            // Add to list.
                            self.types.push(typeNew);

                            return self.panelLayer.addType(typeNew);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Clear the list of types.
                    self.clearTypes = function () {

                        try {

                            self.types = [];

                            return self.panelLayer.clearTypes();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Load up a set of types.
                    self.loadTypes = function (arrayList) {

                        try {

                            // Start with a clean slate.
                            var exceptionRet = self.clearTypes();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // "Play" the list of Types.
                            for (var i = 0; i < arrayList.length; i++) {

                                // Extract the type.
                                var objectTypeIth = arrayList[i];

                                var typeNew = new Type();
                                exceptionRet = typeNew.create(objectTypeIth);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }

                                // Add it to the system.
                                exceptionRet = self.addType(typeNew);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    }*/

