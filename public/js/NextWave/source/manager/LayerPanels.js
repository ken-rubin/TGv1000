///////////////////////////////////////
// LayerPanels module.
//
// Maintains collection of panels (one of which can be active, e.g. has focus).
// Also responsible for scaling to the display dimension (e.g. responsiveness).
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/settings",
    "NextWave/source/utility/orientation",
    "NextWave/source/utility/Area",
    "NextWave/source/utility/Point",
    "NextWave/source/utility/Size",
    "NextWave/source/manager/Layer",
    "NextWave/source/manager/Panel",
    "NextWave/source/type/TypeTree",
    "NextWave/source/type/Type",
    "NextWave/source/type/TypeSection",
    "NextWave/source/type/Methods",
    "NextWave/source/type/Properties",
    "NextWave/source/type/Events",
    "NextWave/source/type/SectionPart",
    "NextWave/source/type/Method",
    "NextWave/source/type/Property",
    "NextWave/source/type/Event",
    "NextWave/source/type/TypeBuilder",
    "NextWave/source/type/PropertyBuilder",
    "NextWave/source/name/NameList",
    "NextWave/source/name/Name",
    "NextWave/source/statement/StatementList",
    "NextWave/source/expression/ExpressionList",
    "NextWave/source/literal/LiteralList",
    "NextWave/source/methodBuilder/MethodBuilder",
    "NextWave/source/methodBuilder/ParameterList",
    "NextWave/source/methodBuilder/Parameter",
    "NextWave/source/methodBuilder/StatementList",
    "NextWave/source/methodBuilder/TypeMethodPair"],
    function (prototypes, settings, orientation, Area, Point, Size, Layer, Panel, TypeTree, Type, TypeSection, Methods, Properties, Events, SectionPart, Method, Property, Event, TypeBuilder, PropertyBuilder, NameList, Name, StatementListPayload, ExpressionList, LiteralList, MethodBuilder, ParameterList, Parameter, StatementList, TypeMethodPair) {

        try {

            // Constructor function.
        	var functionRet = function LayerPanels() {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from base class.
                    self.inherits(Layer);

                    ////////////////////////
                    // Public fields.

                    // Panel of types.
                    self.typesPanel = null;
                    // Panel of names.
                    self.namesPanel = null;
                    // Panel of statements.
                    self.statementsPanel = null;
                    // Panel of expressions.
                    self.expressionsPanel = null;
                    // Panel of literal.
                    self.literalsPanel = null;

                    ////////////////////////
                    // Public methods.

                    // Method adds a new name.
                    self.addName = function (strName) {

                        try {

                            // Skip Panel in this object-chain so all panels 
                            // can just be generic instances of the base class.
                            return self.namesPanel.payload.addName(strName);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Method edits an existing name.
                    self.editName = function (strOriginalName, strNewName) {

                        try {

                            // Skip Panel in this object-chain so all panels 
                            // can just be generic instances of the base class.
                            return self.namesPanel.payload.editName(strOriginalName,
                                strNewName);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Method removes an existing name.
                    self.removeName = function (strName) {

                        try {

                            // Skip Panel in this object-chain so all panels 
                            // can just be generic instances of the base class.
                            return self.namesPanel.payload.removeName(strName);
                        } catch (e) {

                            return e;
                        }
                    };




/*


                    // Clear the tree of Types.
                    self.clearTypes = function () {

                        try {

                            // Skip Panel in this object-chain so all panels 
                            // can just be generic instances of the base class.
                            return self.typesPanel.payload.clearItems();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Load up Types from list of Types.
                    self.loadTypes = function (arrayList) {

                        try {

                            // Clear the old.
                            var exceptionRet = self.clearTypes();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add the new.
                            return self.typesPanel.payload.load(arrayList);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Save and return list of extant Types.
                    self.saveTypes = function () {

                        return self.typesPanel.payload.save();
                    };





*/



                    // Method adds a new Type.
                    self.addType = function (typeNew) {

                        try {

                            // Skip Panel in this object-chain so all panels 
                            // can just be generic instances of the base class.
                            return self.typesPanel.payload.addType(typeNew);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Method removes an existing Type.
                    self.removeType = function (typeToRemove) {

                        try {

                            // Skip Panel in this object-chain so all panels 
                            // can just be generic instances of the base class.
                            return self.typesPanel.payload.removeType(typeToRemove);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Clear the list of types.
                    self.clearTypes = function () {

                        try {

                            // Skip Panel in this object-chain so all panels 
                            // can just be generic instances of the base class.
                            return self.typesPanel.payload.clearItems();
                        } catch (e) {

                            return e;
                        }
                    };








                    // Clear the list of Statements.
                    self.clearStatements = function () {

                        try {

                            // Skip Panel in this object-chain so all panels 
                            // can just be generic instances of the base class.
                            return self.statementsPanel.payload.clearItems();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Load up statements from list of statement constructor names.
                    self.loadStatements = function (arrayList) {

                        try {

                            // Clear the old.
                            var exceptionRet = self.clearStatements();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add the new.
                            return self.statementsPanel.payload.load(arrayList);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Save and return list of extant statement constructors.
                    self.saveStatements = function () {

                        return self.statementsPanel.payload.save();
                    };

                    // Clear the list of Expressions.
                    self.clearExpressions = function () {

                        try {

                            // Skip Panel in this object-chain so all panels 
                            // can just be generic instances of the base class.
                            return self.expressionsPanel.payload.clearItems();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Load up Expressions from list of Expression constructor names.
                    self.loadExpressions = function (arrayList) {

                        try {

                            // Clear the old.
                            var exceptionRet = self.clearExpressions();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add the new.
                            return self.expressionsPanel.payload.load(arrayList);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Save and return list of extant Expression constructors.
                    self.saveExpressions = function () {

                        return self.expressionsPanel.payload.save();
                    };

                    // Clear the list of Literals.
                    self.clearLiterals = function () {

                        try {

                            // Skip Panel in this object-chain so all panels 
                            // can just be generic instances of the base class.
                            return self.literalsPanel.payload.clearItems();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Load up Literals from list of Literal constructor names.
                    self.loadLiterals = function (arrayList) {

                        try {

                            // Clear the old.
                            var exceptionRet = self.clearLiterals();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Add the new.
                            return self.literalsPanel.payload.load(arrayList);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Save and return list of extant Literals constructors.
                    self.saveLiterals = function () {

                        return self.literalsPanel.payload.save();
                    };

                    // Initialze instance.
                    self.create = function () {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "Instance already created!" };
                            }

                            self.namesPanel = new Panel("Names", 
                                orientation.north, 
                                new Point(settings.layerPanels.namesPanel.x, 0), 
                                new Size(settings.layerPanels.namesPanel.width, settings.layerPanels.namesPanel.height));
                            self.statementsPanel = new Panel("Statements", 
                                orientation.north, 
                                new Point(settings.layerPanels.statementsPanel.x, 0), 
                                new Size(settings.layerPanels.statementsPanel.width, settings.layerPanels.statementsPanel.height));
                            self.expressionsPanel = new Panel("Expressions", 
                                orientation.north, 
                                new Point(settings.layerPanels.expressionsPanel.x, 0), 
                                new Size(settings.layerPanels.expressionsPanel.width, settings.layerPanels.expressionsPanel.height));
                            self.literalsPanel = new Panel("Literals", 
                                orientation.north, 
                                new Point(settings.layerPanels.literalsPanel.x, 0), 
                                new Size(settings.layerPanels.literalsPanel.width, settings.layerPanels.literalsPanel.height));
                            self.typesPanel = new Panel("Types", 
                                orientation.west, 
                                new Point(0, settings.layerPanels.typesPanel.y), 
                                new Size(settings.layerPanels.typesPanel.width, settings.layerPanels.typesPanel.height));
                            self.typesPanel.addNew = function () {

                                try {

                                    // What to do when the icon is clicked....
                                    return window.manager.createType();
                                } catch (e) {

                                    return e;
                                }
                            };
                            self.centerPanel = new Panel("Method", 
                                orientation.south, 
                                new Point(settings.layerPanels.centerPanel.x, 0), 
                                new Size(settings.layerPanels.centerPanel.width, settings.layerPanels.centerPanel.height));

                            // Add the TypeTree to the types Panel.
                            var exceptionRet = m_functionAddTypeTreeToTypesPanel(self.typesPanel);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Add the NameList to the names Panel.
                            exceptionRet = m_functionAddNameListToNamesPanel(self.namesPanel);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Add the StatmentList to the statements Panel.
                            exceptionRet = m_functionAddStatementListToStatementsPanel(self.statementsPanel);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Add the ExpressionList to the expressions Panel.
                            exceptionRet = m_functionAddExpressionListToExpressionsPanel(self.expressionsPanel);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Add the LiteralList to the literals Panel.
                            exceptionRet = m_functionAddLiteralListToLiteralsPanel(self.literalsPanel);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Allocate the payloads of the center panel:
                            exceptionRet = m_functionAllocateMethodBuilder();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            exceptionRet = m_functionAllocateTypeBuilder();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            exceptionRet = m_functionAllocatePropertyBuilder();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // To be replaced by: load type/method.
                            // Add the MethodBuilder to the center Panel.
                            exceptionRet = self.switchCenterPanelMode("Method");
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Compile to generic list of panels for looping operations.
                            m_arrayPanels = [
                                self.namesPanel, 
                                self.statementsPanel, 
                                self.expressionsPanel, 
                                self.literalsPanel, 
                                self.typesPanel,
                                self.centerPanel
                            ];

                            // Indicate current state.
                            m_bCreated = true;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Put the center panel into different modes.
                    self.switchCenterPanelMode = function (strMode) {

                        try {

                            // Switch out the payload of the center panel.
                            if (strMode === "Type") {

                                return m_functionSetTypeBuilderInCenterPanel();
                            } else if (strMode === "Method") {

                                return m_functionSetMethodBuilderInCenterPanel();
                            } else if (strMode === "Property") {

                                return m_functionSetPropertyBuilderInCenterPanel();
                            }
                            return null;
                        } catch (e) {

                            return e;   
                        }
                    };

                    // Take mouse move--set handled in reference object if handled.
                    self.mouseMove = function (objectReference) {

                        try {

                            // Must be created to handle move.
                            if (!m_bCreated) {

                                return null;
                            }

                            // Save off the current active panel, if.
                            var panelOriginal = m_panelActive;

                            // Clear the active panel.
                            m_panelActive = null;

                            // Test all the panels.
                            for (var i = 0; i < m_arrayPanels.length; i++) {

                                var exceptionRet = m_arrayPanels[i].mouseMove(objectReference);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }

                                // If handled, then drop out.
                                if (objectReference.handled) {

                                    m_panelActive = m_arrayPanels[i];
                                    break;
                                }
                            }

                            // Deactivate the old activation in  
                            // the current panel, if it changed.
                            if (panelOriginal &&
                                m_panelActive !== panelOriginal) {

                                var exceptionRet = panelOriginal.mouseOut(objectReference);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Handle mouse down.
                    self.mouseDown = function (objectReference) {

                        try {

                            // If active panel, just pass to it.
                            if (m_panelActive) {

                                // Panel handles down--even if not over a control.
                                objectReference.handled = true;

                                return m_panelActive.mouseDown(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Handle mouse up.
                    self.mouseUp = function (objectReference) {

                        try {

                            // If active panel, just pass to it.
                            if (m_panelActive) {

                                // Panel handles down--even if not over a control.
                                objectReference.handled = true;

                                return m_panelActive.mouseUp(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Handle mouse wheel.
                    self.mouseWheel = function (objectReference) {

                        try {

                            // If active panel, just pass to it.
                            if (m_panelActive) {

                                // Panel handles down--even if not over a control.
                                objectReference.handled = true;

                                return m_panelActive.mouseWheel(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Handle mouse out.
                    self.mouseOut = function (objectReference) {

                        try {

                            // Deactivate the activation in  
                            // the current panel, if activated.
                            if (m_panelActive) {

                                var exceptionRet = m_panelActive.mouseOut(objectReference);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }

                            // Reset active state.
                            m_panelActive = null;
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Handle click.
                    self.click = function (objectReference) {

                        try {

                            // If active panel, just pass to it.
                            if (m_panelActive) {

                                // Panel handles down--even if not over a control.
                                objectReference.handled = true;

                                return m_panelActive.click(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Set the size of this layer and children.
                    // Also handle responsiveness of application.
                    self.calculateLayout = function (sizeExtent, contextRender) {

                        try {

                            // Must be created to have panels.
                            if (!m_bCreated) {

                                return null;
                            }

                            // Set the extents of the panels.
                            for (var i = 0; i < m_arrayPanels.length; i++) {

                                var exceptionRet = m_arrayPanels[i].calculateLayout(sizeExtent, contextRender);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Render out the layer.
                    self.render = function (contextRender, iMS) {
                        
                        try {

                            // Must be created to have panels.
                            if (!m_bCreated) {

                                return null;
                            }

                            // Render the panels.
                            for (var i = m_arrayPanels.length - 1; i >= 0; i--) {

                                var exceptionRet = m_arrayPanels[i].render(contextRender);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }

                            return null;
                        } catch (e) {
                            
                            return e;
                        }
                    };

                    //////////////////////////
                    // Private methods.

                    // Allocate type builder instance.
                    var m_functionAllocateTypeBuilder = function () {

                        try {

                            // For now, only allocate once.
                            if (window.typeBuilder) {

                                return null;
                            }

                            // Allocate and create the type builder.
                            // Store globally.
                            window.typeBuilder = new TypeBuilder();
                            var exceptionRet = window.typeBuilder.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Allocate property builder instance.
                    var m_functionAllocatePropertyBuilder = function () {

                        try {

                            // For now, only allocate once.
                            if (window.propertyBuilder) {

                                return null;
                            }

                            // Allocate and create the type builder.
                            // Store globally.
                            window.propertyBuilder = new PropertyBuilder();
                            var exceptionRet = window.propertyBuilder.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Allocate method builder instance.
                    var m_functionAllocateMethodBuilder = function () {

                        try {

                            // For now, only allocate once.
                            if (window.methodBuilder) {

                                return null;
                            }

                            // Allocate type-name object.
                            var tmp = new TypeMethodPair();
                            var exceptionRet = tmp.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            var pl = new ParameterList();
                            exceptionRet = pl.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            var sl = new StatementList();
                            exceptionRet = sl.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Allocate and create the object list.
                            // Store globally so the drag layer can access.
                            window.methodBuilder = new MethodBuilder();
                            exceptionRet = window.methodBuilder.create(tmp, pl, sl);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method adds typetree to types panel.
                    var m_functionAddTypeTreeToTypesPanel = function (panelTypes) {

                        try {

                            // Some dummy data for now....
                            var arrayTypes = [];

                            // Allocate and create the object tree, passing the initialization object.
                            var tt = new TypeTree();
                            var exceptionRet = tt.create(arrayTypes);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Set it.
                            panelTypes.payload = tt;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method adds NameList to names panel.
                    var m_functionAddNameListToNamesPanel = function (panelNames) {

                        try {

                            // Some dummy data for now....
                            var arrayNames = [];

                            // Allocate and create the object list, passing the initialization object.
                            var nl = new NameList();
                            var exceptionRet = nl.create(arrayNames);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Set it.
                            panelNames.payload = nl;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method adds StatementList to statements panel.
                    var m_functionAddStatementListToStatementsPanel = function (panelStatements) {

                        try {

                            // Allocate and create the object list.
                            var sl = new StatementListPayload();
                            var exceptionRet = sl.create([]);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Set it.
                            panelStatements.payload = sl;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method adds ExpressionList to expressions panel.
                    var m_functionAddExpressionListToExpressionsPanel = function (panelExpressions) {

                        try {

                            // Allocate and create the object list.
                            var el = new ExpressionList();
                            var exceptionRet = el.create([]);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Set it.
                            panelExpressions.payload = el;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method adds LiteralList to literals panel.
                    var m_functionAddLiteralListToLiteralsPanel = function (panelLiterals) {

                        try {

                            // Allocate and create the object list.
                            var ll = new LiteralList();
                            var exceptionRet = ll.create([]);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Set it.
                            panelLiterals.payload = ll;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method sets MethodBuilder in the method panel.
                    var m_functionSetMethodBuilderInCenterPanel = function () {

                        try {

                            // Set it in the center panel.
                            return self.centerPanel.setPayload("Method",
                                window.methodBuilder);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method sets TypeBuilder in the method panel.
                    var m_functionSetTypeBuilderInCenterPanel = function () {

                        try {

                            // Set it in the center panel.
                            return self.centerPanel.setPayload("Type",
                                window.typeBuilder);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method sets PropertyBuilder in the method panel.
                    var m_functionSetPropertyBuilderInCenterPanel = function () {

                        try {

                            // Set it in the center panel.
                            return self.centerPanel.setPayload("Property",
                                window.propertyBuilder);
                        } catch (e) {

                            return e;
                        }
                    };

                    //////////////////////////
                    // Private fields.

                    // Indicates this instance is already created.
                    var m_bCreated = false;
                    // Collection of managed panels.
                    var m_arrayPanels = null;
                    // Panel in which the mouse is located.
                    var m_panelActive = null;
                } catch (e) {

                    alert(e.message);
                }
        	};

            // Do function injection.
            functionRet.inheritsFrom(Layer);

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
