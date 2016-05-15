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
    "NextWave/source/utility/Area",
    "NextWave/source/utility/Point",
    "NextWave/source/utility/Size",
    "NextWave/source/utility/attributeHelper",
    "NextWave/source/manager/Layer",
    "NextWave/source/manager/LayerBackground",
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
    "NextWave/source/type/Type",
    "NextWave/source/type/Methods",
    "NextWave/source/type/Method",
    "NextWave/source/type/Properties",
    "NextWave/source/type/Property"],
    function (prototypes, settings, Area, Point, Size, attributeHelper, Layer, LayerBackground, LayerPanels, LayerDebug, LayerDrag, LayerAl, Expression, Literal, Statement, Name, CodeExpression, CodeStatement, Parameter, ParameterList, StatementList, Type, Methods, Method, Properties, Property) {

        try {

            // Constructor function.
        	var functionRet = function Manager() {

                try {

            		var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public fields.

                    // Hold reference to the drag layer.
                    self.dragLayer = null;
                    // Hold reference to the panel layer.
                    self.panelLayer = null;
                    // Object used to initialize this instance.
                    self.initializer = null;
                    // Directly set focus object, overrides dragObject.
                    self.alternateFocus = null;
                    // Collection of named object pertinent to the current context.
                    self.names = [];
                    // Collection of types available in the current context.
                    self.types = [];
                    // Indicates there is a project which has been loaded up into this manager.
                    self.loaded = false;
                    // Current type/method.
                    self.context = {

                        type: null,
                        method: null
                    };

                    ////////////////////////
                    // Public methods.

                    // Method adds a new name.
                    self.addName = function (strName) {

                        try {

                            self.names.push(strName);

                            return self.panelLayer.addName(strName);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Method edits a new name.
                    self.editName = function (strOriginalName, strNewName) {

                        try {

                            // Update in place.
                            for (var i = 0; i < self.names.length; i++) {

                                // Find match...
                                if (self.names[i] === strOriginalName) {

                                    // ...and splice in place.
                                    self.names.splice(i, 1, strNewName);

                                    break;
                                }
                            }

                            // Update the panel too.
                            return self.panelLayer.editName(strOriginalName, 
                                strNewName);
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
                                "name",
                                "payload");;

                            // Create type.
                            var typeNew = new Type();
                            var exceptionRet = typeNew.create({

                                name: strName
                            });
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            return self.addType(typeNew);
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

                            // Create type.
                            var methodNew = new Method(typeContaining,
                                strName);
                            return typeContaining.methods.addPart(methodNew);
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
                            return typeContaining.properties.addPart(propertyNew);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Method edits a type name.
                    self.getTypeFromName = function (strTypeName) {

                        try {

                            // Find it.
                            for (var i = 0; i < self.types.length; i++) {

                                if (self.types[i].name.payload === strTypeName) {

                                    // ...and return it.
                                    return self.types[i];
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Method edits a type name.
                    self.editTypeName = function (strOriginalName, strNewName) {

                        try {

                            // Update in place.
                            for (var i = 0; i < self.types.length; i++) {

                                // Find match...
                                if (self.types[i].name.payload === strOriginalName) {

                                    // ...and update.
                                    self.types[i].name.payload = strNewName;

                                    break;
                                }
                            }

                            // TODO: Update any allocation associated with this type.
                            // Also, update the type name in the method builder.
                            // Not sure if this will conflict with the type-name 
                            // editing if done directly from the type name....

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Remove type from manager/project.
                    self.removeType = function (typeToRemove) {

                        try {

                            // Search for type.
                            for (var i = 0; i < self.types.length; i++) {

                                // Find match...
                                if (self.types[i].name.payload === typeToRemove.name.payload) {

                                    // ...and remove.
                                    self.types.splice(i, 1);

                                    break;
                                }
                            }

                            // Also remove from panel layer.
                            return self.panelLayer.removeType(typeToRemove);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Remove method from specified type.
                    self.removeMethod = function (typeOwner, methodToRemove) {

                        try {

                            // Search for type.
                            for (var i = 0; i < self.types.length; i++) {

                                // Find match...
                                if (self.types[i].name.payload === typeOwner.name.payload) {

                                    // ...and remove.
                                    return self.types[i].methods.removePart(methodToRemove);
                                }
                            }
                            return null
                        } catch (e) {

                            return e;
                        }
                    };

                    // Remove property from specified type.
                    self.removeProperty = function (typeOwner, propertyToRemove) {

                        try {

                            // Search for type.
                            for (var i = 0; i < self.types.length; i++) {

                                // Find match...
                                if (self.types[i].name.payload === typeOwner.name.payload) {

                                    // ...and remove.
                                    return self.types[i].properties.removePart(propertyToRemove);
                                }
                            }
                            return null
                        } catch (e) {

                            return e;
                        }
                    };

                    // Method edits a Method name.
                    self.editMethodName = function (type, strOriginalName, strNewName) {

                        try {

                            // Update in place.
                            for (var i = 0; i < type.methods.parts.length; i++) {

                                // Find match...
                                if (type.methods.parts[i].name === strOriginalName) {

                                    // ...and update.
                                    type.methods.parts[i].name = strNewName;

                                    break;
                                }
                            }

                            // TODO: Update any allocation associated with this type.

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Method removes an existing name.
                    self.removeName = function (strName) {

                        try {

                            // Remove in place.
                            for (var i = 0; i < self.names.length; i++) {

                                // Find match...
                                if (self.names[i] === strName) {

                                    // ...and splace in place.
                                    self.names.splice(i, 1);

                                    break;
                                }
                            }

                            // Update the panel too.
                            return self.panelLayer.removeName(strName);
                        } catch (e) {

                            return e;
                        }
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
                    // arrayCollection -- the collection to iterate over and ensure uniqueness.  Defaults to self.names.
                    // strNameProperty -- the property-name-accessor on items in arrayCollection.
                    // strNameReferenceProperty -- the accessor property on the strNamePropety types as objects.
                    self.getUniqueName = function (strName, arrayCollection, strNameProperty, strNameRefinementProperty) {

                        // Default collection value to names.
                        if (!arrayCollection) {

                            arrayCollection = self.names;
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
                    };

                    // Set a new context.  A type and the index into its method collection, 
                    // or iIndex can be mis-used as the name of the method for which to search.
                    self.setContext = function (type, iIndex) {

                        try {

                            // Setting dirty causes the next render to calculate layout.
                            m_bDirty = true;

                            // If iIndex is a string, find its matching index.
                            if (iIndex.substring) {

                                for (var i = 0; i < type.methods.parts.length; i++) {

                                    var methodIth = type.methods.parts[i];
                                    if (methodIth.name === iIndex) {

                                        iIndex = i;
                                        break;
                                    }
                                }
                            }

                            // If did not find an index, set to 0.
                            if (iIndex.substring) {

                                iIndex = 0;
                            }

                            // Set context, load method builder.
                            self.context = {

                                type: type,
                                method: type.methods.parts[iIndex]
                            };

                            // Load up the method into the method builder.
                            var exceptionRet = window.methodBuilder.loadTypeMethod(self.context);
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
                                if (exceptionRet) {

                                    return exceptionRet;
                                }

                            }

                            // Add to list.
                            self.types.push(typeNew);

                            return self.panelLayer.addType(typeNew);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Initialze instance.
                    self.create = function (objectInitializer) {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "Instance already created!" };
                            }

                            // Store the manager in window, 
                            // so it is universally accessible.
                            window.manager = self;

                            // Allocate and create the background layer.
                            var lb = new LayerBackground();
                            var exceptionRet = lb.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Allocate and create the regions layer.
                            // Pass in statements, expressions and literals.
                            // Types will be "played" later on in create.
                            self.panelLayer = new LayerPanels();
                            exceptionRet = self.panelLayer.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Allocate and create the debug layer.
                            var ld = new LayerDebug();
                            exceptionRet = ld.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Allocate and create the drag layer.
                            self.dragLayer = new LayerDrag();
                            exceptionRet = self.dragLayer.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Allocate and create the Al layer.
                            var la = new LayerAl();
                            exceptionRet = la.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Save off the layers.
                            m_arrayLayers = [lb, self.panelLayer, ld, self.dragLayer];//, la];

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

                            // Start the rendering.
                            m_iAnimationFrameSequence = requestAnimationFrame(m_functionRender);

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Clear panels.
                    self.clearPanels = function () {

                        try {

                            // Reset loaded.
                            self.loaded = false;

                            // Clear panel data.
                            var exceptionRet = self.panelLayer.clearTypes();
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = self.panelLayer.clearStatements();
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = self.panelLayer.clearExpressions();
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = self.panelLayer.clearNames();
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = self.panelLayer.clearCenter();
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            return self.panelLayer.clearLiterals();
                        } catch (e) {

                            return e;
                        }
                    }

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
                    }

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

                    // Load all types and visible/existing panels 
                    // into this manager instance from persistence.
                    // objectInitializer is comics[i].data as loaded from database.
                    // It needs to be massaged a bit.
                    //
                    // This is basically the opposite of what goes on in project.saveToDatabase();
                    self.load = function (objectProject) {

                        try {

                            // First, clear out any detritus.
                            var exceptionRet = self.clearPanels();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Save the project attributes.
                            self.initializer = objectProject;

                            // Massage objectInitializer into the format manager requires.
                            // Clone it into self.initializer.
                            var objectComic = objectProject.comics[objectProject.currentComicIndex];

                            // Load up panels.
                            exceptionRet = self.loadLiterals(objectComic.literals);
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = self.loadExpressions(objectComic.expressions);
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = self.loadStatements(objectComic.statements);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add the types from the initializer into this intance.
                            exceptionRet = self.loadTypes(objectComic.types);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Set loaded.
                            self.loaded = true;

                            return null;
                        } catch (e) { return e; }
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

                        var objectRet = {};

                        // Allocate array which holds module strings.
                        objectRet.modules = [];

                        // Generate a module for each Type.
                        for (var i = 0; i < self.types.length; i++) {

                            // Extract and save the type.
                            var typeIth = self.types[i];
                            var strModule = typeIth.generateJavaScript();

                            // Add it to the result object.
                            objectRet.modules.push(strModule);
                        }

                        // Return all the modules.
                        return objectRet;
                    };

                    // Save all types and visible/existing panels 
                    // from this manager instance for persistence.
                    self.save = function () {

                        // Extract the saved off project.
                        var objectRet = self.initializer;

                        // For now, only handling first comic.
                        var objectComic = objectRet.comics[objectRet.currentComicIndex];

                        // First, types.
                        objectComic.types = [];

                        // Add the list of Type objects to the types collection.
                        for (var i = 0; i < self.types.length; i++) {

                            // Extract and save the type.
                            var typeIth = self.types[i];
                            var objectType = typeIth.save();

                            // Add it to the result object.
                            objectComic.types.push(objectType);
                        }

                        // Return the fully qualified manager state object.
                        return objectRet;
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

                            // Set the alternate focus object.
                            self.alternateFocus = objectFocus;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Set the drag object.
                    self.setDragObject = function (objectDrag) {

                        try {

                            // Clear out any alternate.
                            self.alternateFocus = null;

                            // Only certain types can drag.
                            if (objectDrag instanceof Expression ||
                                objectDrag instanceof Literal ||
                                objectDrag instanceof Statement ||
                                objectDrag instanceof Name ||
                                objectDrag instanceof CodeExpression ||
                                objectDrag instanceof CodeStatement ||
                                objectDrag instanceof Type ||
                                objectDrag instanceof Method ||
                                objectDrag instanceof Property) {

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
                            m_bDirty = true;
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

                                // Pass to the layer.
                                var exceptionRet = m_arrayLayers[i].mouseOut(objectReference);
                                if (exceptionRet) {

                                    throw exceptionRet;
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

                                // Pass to layer.
                                var exceptionRet = m_arrayLayers[i].calculateLayout(sizeExtent, m_contextRender);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }

                            // These pipes are clean!
                            m_bDirty = false;

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
                            if (m_bDirty) {

                                exceptionRet = m_functionCalculateLayout();
                                if (exceptionRet !== null) {

                                    throw exceptionRet;
                                }
                            }

                            // Render each layer.  From back to front.
                            for (var i = 0; i < m_arrayLayers.length; i++) {

                                // Render out the layer.
                                exceptionRet = m_arrayLayers[i].render(m_contextRender,
                                    iMS);
                                if (exceptionRet) {

                                    throw exceptionRet;
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
                    var m_bDirty = true;
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
                        "boolean", "break", "byte", "blur", "button", 
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
                        "native", "new", "null", "name", "NaN", "navigate", "navigator", "Number",
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
