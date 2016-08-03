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
        "NextWave/source/type/EventBuilder",
        "NextWave/source/name/NameList",
        "NextWave/source/name/Name",
        "NextWave/source/statement/StatementList",
        "NextWave/source/expression/ExpressionList",
        "NextWave/source/literal/LiteralList",
        "NextWave/source/methodBuilder/MethodBuilder"
    ],
    function(prototypes, settings, orientation, Area, Point, Size, Layer, Panel, TypeTree, Type, TypeSection, Methods, Properties, Events, SectionPart, Method, Property, Event, TypeBuilder, PropertyBuilder, EventBuilder, NameList, Name, StatementListPayload, ExpressionList, LiteralList, MethodBuilder) {

        try {

            // Constructor function.
            var functionRet = function LayerPanels() {

                try {

                    var self = this; // Uber closure.

                    // Inherit from base class.
                    self.inherits(Layer);

                    ////////////////////////
                    // Public fields.

                    // Panel of types.
                    self.typesPanel = null;
                    // Panel of systemTypes.
                    self.systemTypesPanel = null;
                    // Panel of names.
                    self.namesPanel = null;
                    // Panel of statements.
                    self.statementsPanel = null;
                    // Panel of expressions.
                    self.expressionsPanel = null;
                    // Panel of literals.
                    self.literalsPanel = null;
                    // Panel of centers.
                    self.centerPanel = null;
                    // Save configuration.
                    self.iPanelConfiguration = null;

                    ////////////////////////
                    // Public methods.

                    // Initialze instance.
                    self.create = function(iPanelConfiguration) {
                        // iPanelConfiguration: 0 = no panels; 1 = normal project; 2 = system types project
                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw {
                                    message: "LayerPanels: Instance already created!"
                                };
                            }

                            self.iPanelConfiguration = iPanelConfiguration;

                            switch (iPanelConfiguration) {

                                case 0:

                                    m_arrayPanels = [];
                                    break;

                                case 1:

                                    // self.namesPanel = new Panel("Names", 
                                    //     orientation.north, 
                                    //     new Point(settings.layerPanels.namesPanel.x, 0), 
                                    //     new Size(settings.layerPanels.namesPanel.width, settings.layerPanels.namesPanel.height));
                                    self.statementsPanel = new Panel("Statements",
                                        orientation.north,
                                        new Point(settings.layerPanels.statementsPanel.x, 0),
                                        new Size(settings.layerPanels.statementsPanel.width, settings.layerPanels.statementsPanel.height));
                                    // self.expressionsPanel = new Panel("Expressions", 
                                    //     orientation.north, 
                                    //     new Point(settings.layerPanels.expressionsPanel.x, 0), 
                                    //     new Size(settings.layerPanels.expressionsPanel.width, settings.layerPanels.expressionsPanel.height));
                                    // self.literalsPanel = new Panel("Literals", 
                                    //     orientation.north, 
                                    //     new Point(settings.layerPanels.literalsPanel.x, 0), 
                                    //     new Size(settings.layerPanels.literalsPanel.width, settings.layerPanels.literalsPanel.height));
                                    self.centerPanel = new Panel("Method",
                                        orientation.south,
                                        new Point(settings.layerPanels.centerPanel.x, 0),
                                        new Size(settings.layerPanels.centerPanel.width, settings.layerPanels.centerPanel.height));

                                    // Only in iPanelConfiguration 1
                                    self.typesPanel = new Panel("Types",
                                        orientation.west,
                                        new Point(0, settings.layerPanels.typesPanel.y),
                                        new Size(settings.layerPanels.typesPanel.width, settings.layerPanels.typesPanel.height));
                                    self.typesPanel.addNew = function() {

                                        try {

                                            // What to do when the icon is clicked....
                                            return window.manager.createType();
                                        } catch (e) {

                                            return e;
                                        }
                                    };
                                    self.systemTypesPanel = new Panel("System Types",
                                        orientation.west,
                                        new Point(0, settings.layerPanels.systemTypesPanel.y),
                                        new Size(settings.layerPanels.systemTypesPanel.width, settings.layerPanels.systemTypesPanel.height));
                                    if (manager.userCanWorkWithSystemTypesAndAppBaseTypes) {
                                        self.systemTypesPanel.addNew = function() {

                                            try {

                                                // What to do when the icon is clicked....
                                                return window.manager.createSystemType();
                                            } catch (e) {

                                                return e;
                                            }
                                        };
                                    }
                                    // Add the TypeTree to the types Panel.
                                    var exceptionRet = m_functionAddTypeTreeToTypesPanel(self.typesPanel);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }

                                    // Compile to generic list of panels for looping operations.
                                    m_arrayPanels = [
                                        // self.namesPanel, 
                                        self.statementsPanel,
                                        // self.expressionsPanel, 
                                        // self.literalsPanel, 
                                        self.typesPanel,
                                        self.systemTypesPanel,
                                        self.centerPanel
                                    ];

                                    // Add the SystemTypeTree to the systemTypes Panel.
                                    var exceptionRet = m_functionAddSystemTypeTreeToSystemTypesPanel(self.systemTypesPanel);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }

                                    // Add the NameList to the names Panel.
                                    // exceptionRet = m_functionAddNameListToNamesPanel(self.namesPanel);
                                    // if (exceptionRet) {

                                    //     throw exceptionRet;
                                    // }

                                    // Add the StatmentList to the statements Panel.
                                    exceptionRet = m_functionAddStatementListToStatementsPanel(self.statementsPanel);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }

                                    // Add the ExpressionList to the expressions Panel.
                                    // exceptionRet = m_functionAddExpressionListToExpressionsPanel(self.expressionsPanel);
                                    // if (exceptionRet) {

                                    //     throw exceptionRet;
                                    // }

                                    // Add the LiteralList to the literals Panel.
                                    // exceptionRet = m_functionAddLiteralListToLiteralsPanel(self.literalsPanel);
                                    // if (exceptionRet) {

                                    //     throw exceptionRet;
                                    // }

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
                                    exceptionRet = m_functionAllocateEventBuilder();
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }

                                    // To be replaced by: load type/method.
                                    // Add the MethodBuilder to the center Panel.
                                    exceptionRet = self.switchCenterPanelMode("Method");
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                    break;

                                case 2:

                                    // self.namesPanel = new Panel("Names", 
                                    //     orientation.north, 
                                    //     new Point(settings.layerPanels.namesPanel.x, 0), 
                                    //     new Size(settings.layerPanels.namesPanel.width, settings.layerPanels.namesPanel.height));
                                    self.statementsPanel = new Panel("Statements",
                                        orientation.north,
                                        new Point(settings.layerPanels.statementsPanel.x, 0),
                                        new Size(settings.layerPanels.statementsPanel.width, settings.layerPanels.statementsPanel.height));
                                    // self.expressionsPanel = new Panel("Expressions", 
                                    //     orientation.north, 
                                    //     new Point(settings.layerPanels.expressionsPanel.x, 0), 
                                    //     new Size(settings.layerPanels.expressionsPanel.width, settings.layerPanels.expressionsPanel.height));
                                    // self.literalsPanel = new Panel("Literals", 
                                    //     orientation.north, 
                                    //     new Point(settings.layerPanels.literalsPanel.x, 0), 
                                    //     new Size(settings.layerPanels.literalsPanel.width, settings.layerPanels.literalsPanel.height));
                                    self.centerPanel = new Panel("Method",
                                        orientation.south,
                                        new Point(settings.layerPanels.centerPanel.x, 0),
                                        new Size(settings.layerPanels.centerPanel.width, settings.layerPanels.centerPanel.height));

                                    // Special for iPanelConfiguration 2
                                    self.systemTypesPanel = new Panel("System Types",
                                        orientation.west,
                                        new Point(0, settings.layerPanels.systemTypesPanelSpecial.y),
                                        new Size(settings.layerPanels.systemTypesPanelSpecial.width, settings.layerPanels.systemTypesPanelSpecial.height));
                                    self.systemTypesPanel.addNew = function() {

                                        try {

                                            // What to do when the icon is clicked....
                                            return window.manager.createSystemType();
                                        } catch (e) {

                                            return e;
                                        }
                                    };

                                    // Compile to generic list of panels for looping operations.
                                    m_arrayPanels = [
                                        // self.namesPanel, 
                                        self.statementsPanel,
                                        // self.expressionsPanel, 
                                        // self.literalsPanel, 
                                        self.systemTypesPanel,
                                        self.centerPanel
                                    ];

                                    // Add the SystemTypeTree to the systemTypes Panel.
                                    var exceptionRet = m_functionAddSystemTypeTreeToSystemTypesPanel(self.systemTypesPanel);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }

                                    // Add the NameList to the names Panel.
                                    // exceptionRet = m_functionAddNameListToNamesPanel(self.namesPanel);
                                    // if (exceptionRet) {

                                    //     throw exceptionRet;
                                    // }

                                    // Add the StatmentList to the statements Panel.
                                    exceptionRet = m_functionAddStatementListToStatementsPanel(self.statementsPanel);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }

                                    // Add the ExpressionList to the expressions Panel.
                                    // exceptionRet = m_functionAddExpressionListToExpressionsPanel(self.expressionsPanel);
                                    // if (exceptionRet) {

                                    //     throw exceptionRet;
                                    // }

                                    // Add the LiteralList to the literals Panel.
                                    // exceptionRet = m_functionAddLiteralListToLiteralsPanel(self.literalsPanel);
                                    // if (exceptionRet) {

                                    //     throw exceptionRet;
                                    // }

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
                                    exceptionRet = m_functionAllocateEventBuilder();
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }

                                    // To be replaced by: load type/method.
                                    // Add the MethodBuilder to the center Panel.
                                    exceptionRet = self.switchCenterPanelMode("Method");
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                    break;
                            }

                            // Indicate current state.
                            m_bCreated = true;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Destroy LayerPanels--we're about to create a new one with a different configuration.
                    self.destroy = function() {

                        m_arrayPanels.forEach(
                            function(panelIth) {
                                if (panelIth) {
                                    panelIth.destroy();
                                }
                            }
                        );

                        window.methodBuilder.destroy();
                        window.typeBuilder.destroy();
                        window.propertyBuilder.destroy();

                        // self.typesPanel = null;
                        // self.systemTypesPanel = null;
                        // self.namesPanel = null;
                        // self.statementsPanel = null;
                        // self.expressionsPanel = null;
                        // self.literalsPanel = null;
                        // self.centerPanel = null;
                        // self.iPanelConfiguration = null;
                    }

                    // Method replaces what's in namesPanel with a whole new set of names.
                    // arrayNames has been sorted and uniquified.
                    self.setNames = function(arrayNames) {

                        return null;
                        // try {

                        //     var exceptionRet = self.clearNames();
                        //     if (exceptionRet) {

                        //         return exceptionRet;
                        //     }

                        //     return self.namesPanel.payload.setNames(arrayNames);

                        // } catch (e) {

                        //     return e;
                        // }
                    }

                    // Method adds a new name.
                    self.addName = function(strName) {

                        return null;
                        // try {

                        //     // Skip Panel in this object-chain so all panels 
                        //     // can just be generic instances of the base class.
                        //     return self.namesPanel.payload.addName(strName);
                        // } catch (e) {

                        //     return e;
                        // }
                    };

                    // Method changes an existing name.
                    self.changeName = function(strOriginalName, strNewName) {

                        return null;
                        // try {

                        //     // Skip Panel in this object-chain so all panels 
                        //     // can just be generic instances of the base class.
                        //     return self.namesPanel.payload.changeName(strOriginalName,
                        //         strNewName);
                        // } catch (e) {

                        //     return e;
                        // }
                    };

                    // Method removes an existing name.
                    self.removeName = function(strName) {

                        return null;
                        // try {

                        //     // Skip Panel in this object-chain so all panels 
                        //     // can just be generic instances of the base class.
                        //     return self.namesPanel.payload.removeName(strName);
                        // } catch (e) {

                        //     return e;
                        // }
                    };

                    // Method adds a new Type.
                    self.addType = function(typeNew) {

                        try {

                            if (!self.typesPanel) {
                                return null;
                            }

                            // Skip Panel in this object-chain so all panels 
                            // can just be generic instances of the base class.
                            return self.typesPanel.payload.addType(typeNew);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Method removes an existing Type.
                    self.removeType = function(typeToRemove) {

                        try {

                            if (!self.typesPanel) {
                                return null;
                            }

                            // Skip Panel in this object-chain so all panels 
                            // can just be generic instances of the base class.
                            return self.typesPanel.payload.removeType(typeToRemove);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Clear the list of types.
                    self.clearTypes = function() {

                        try {

                            if (!self.typesPanel) {
                                return null;
                            }

                            // Skip Panel in this object-chain so all panels 
                            // can just be generic instances of the base class.
                            return self.typesPanel.payload.clearItems();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Method adds a new SystemType.
                    self.addSystemType = function(typeNew) {

                        try {

                            // Skip Panel in this object-chain so all panels 
                            // can just be generic instances of the base class.
                            return self.systemTypesPanel.payload.addType(typeNew);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Method removes an existing SystemType.
                    self.removeSystemType = function(typeToRemove) {

                        try {

                            // Skip Panel in this object-chain so all panels 
                            // can just be generic instances of the base class.
                            return self.systemTypesPanel.payload.removeType(typeToRemove);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Clear the list of systemTypes.
                    self.clearSystemTypes = function() {

                        try {

                            if (!self.systemTypesPanel) {
                                return null;
                            }

                            // Skip Panel in this object-chain so all panels 
                            // can just be generic instances of the base class.
                            return self.systemTypesPanel.payload.clearItems();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Clear the list of names.
                    self.clearNames = function() {

                        return null;
                        // try {

                        //     if (!self.namesPanel) { return null; }

                        //     // Skip Panel in this object-chain so all panels 
                        //     // can just be generic instances of the base class.
                        //     return self.namesPanel.payload.clearItems();
                        // } catch (e) {

                        //     return e;
                        // }
                    };

                    // Clear the center panel.
                    self.clearCenter = function(strActiveCenterPanel) {

                        try {

                            if (!self.centerPanel) {
                                return null;
                            }

                            // Ensure there is always a good active center panel.
                            if (!strActiveCenterPanel) {

                                strActiveCenterPanel = "Method";
                            }
                            window.methodBuilder = null;
                            window.typeBuilder = null;
                            window.propertyBuilder = null;

                            // Clear out the three possible 
                            // payloads for the center panel.
                            var exceptionRet = m_functionAllocateMethodBuilder();
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = m_functionAllocateTypeBuilder();
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = m_functionAllocatePropertyBuilder();
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = m_functionAllocateEventBuilder();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Set the active section.
                            return self.switchCenterPanelMode(strActiveCenterPanel);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Clear the list of Statements.
                    self.clearStatements = function() {

                        try {

                            if (!self.statementsPanel) {
                                return null;
                            }

                            // Skip Panel in this object-chain so all panels 
                            // can just be generic instances of the base class.
                            return self.statementsPanel.payload.clearItems();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Load up statements from list of statement constructor names.
                    self.loadStatements = function(arrayList) {

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
                    self.saveStatements = function() {

                        return self.statementsPanel.payload.save();
                    };

                    // Clear the list of Expressions.
                    self.clearExpressions = function() {

                        return null;
                        // try {

                        //     if (!self.expressionsPanel) { return null; }

                        //     // Skip Panel in this object-chain so all panels 
                        //     // can just be generic instances of the base class.
                        //     return self.expressionsPanel.payload.clearItems();
                        // } catch (e) {

                        //     return e;
                        // }
                    };

                    // Load up Expressions from list of Expression constructor names.
                    self.loadExpressions = function(arrayList) {

                        return null;
                        // try {

                        //     // Clear the old.
                        //     var exceptionRet = self.clearExpressions();
                        //     if (exceptionRet) {

                        //         return exceptionRet;
                        //     }

                        //     // Add the new.
                        //     return self.expressionsPanel.payload.load(arrayList);
                        // } catch (e) {

                        //     return e;
                        // }
                    };

                    // Save and return list of extant Expression constructors.
                    self.saveExpressions = function() {

                        return null;
                        // return self.expressionsPanel.payload.save();
                    };

                    // Clear the list of Literals.
                    self.clearLiterals = function() {

                        return null;
                        // try {

                        //     if (!self.literalsPanel) { return null; }

                        //     // Skip Panel in this object-chain so all panels 
                        //     // can just be generic instances of the base class.
                        //     return self.literalsPanel.payload.clearItems();
                        // } catch (e) {

                        //     return e;
                        // }
                    };

                    // Load up Literals from list of Literal constructor names.
                    self.loadLiterals = function(arrayList) {

                        return null;
                        // try {

                        //     // Clear the old.
                        //     var exceptionRet = self.clearLiterals();
                        //     if (exceptionRet) {

                        //         return exceptionRet;
                        //     }

                        //     // Add the new.
                        //     return self.literalsPanel.payload.load(arrayList);
                        // } catch (e) {

                        //     return e;
                        // }
                    };

                    // Save and return list of extant Literals constructors.
                    self.saveLiterals = function() {

                        return null;
                        // return self.literalsPanel.payload.save();
                    };

                    // Put the center panel into different modes.
                    self.switchCenterPanelMode = function(strMode) {

                        try {

                            // Switch out the payload of the center panel.
                            if (strMode === "Type") {

                                return m_functionSetTypeBuilderInCenterPanel();
                            } else if (strMode === "Method") {

                                return m_functionSetMethodBuilderInCenterPanel();
                            } else if (strMode === "Property") {

                                return m_functionSetPropertyBuilderInCenterPanel();
                            } else if (strMode === "Event") {

                                return m_functionSetEventBuilderInCenterPanel();
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Open and Pin all panels.
                    self.openAndPinAllPanels = function() {

                        m_arrayPanels.forEach(
                            function(panelIth) {
                                if (panelIth) {
                                    panelIth.openAndPin();
                                }
                            }
                        );
                    }

                    // Unpin all panels. They are cleared.
                    self.unpinAllPanels = function() {

                        m_arrayPanels.forEach(
                            function(panelIth) {
                                if (panelIth) {
                                    panelIth.unpin();
                                }
                            }
                        );
                    }

                    // Take mouse move--set handled in reference object if handled.
                    self.innerMouseMove = function(objectReference) {

                        try {

                            // Must be created.
                            if (!m_bCreated) {

                                return null;
                            }


                            // Save off the current active panel, if.
                            var panelOriginal = m_panelActive;

                            // Clear the active panel.
                            m_panelActive = null;

                            // Test all the panels.
                            for (var i = 0; i < m_arrayPanels.length; i++) {

                                if (m_arrayPanels[i]) {

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
                    self.innerMouseDown = function(objectReference) {

                        try {

                            // Must be created to have panels.
                            if (!m_bCreated) {

                                return null;
                            }

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
                    self.innerMouseUp = function(objectReference) {

                        try {

                            // Must be created to have panels.
                            if (!m_bCreated) {

                                return null;
                            }

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
                    self.innerMouseWheel = function(objectReference) {

                        try {

                            // Must be created to have panels.
                            if (!m_bCreated) {

                                return null;
                            }

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
                    self.innerMouseOut = function(objectReference) {

                        try {

                            // Must be created to have panels.
                            if (!m_bCreated) {

                                return null;
                            }

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
                    self.innerClick = function(objectReference) {

                        try {

                            // Must be created to have panels.
                            if (!m_bCreated) {

                                return null;
                            }

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
                    self.innerCalculateLayout = function(sizeExtent, contextRender) {

                        try {

                            // Must be created to have panels.
                            if (!m_bCreated) {

                                return null;
                            }

                            // Set the extents of the panels.
                            for (var i = 0; i < m_arrayPanels.length; i++) {

                                if (m_arrayPanels[i]) {

                                    var exceptionRet = m_arrayPanels[i].calculateLayout(sizeExtent, contextRender);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Render out the layer.
                    self.innerRender = function(contextRender, iMS) {

                        try {

                            // Must be created to have panels.
                            if (!m_bCreated) {

                                return null;
                            }

                            // Render the panels.
                            for (var i = m_arrayPanels.length - 1; i >= 0; i--) {

                                if (m_arrayPanels[i]) {

                                    var exceptionRet = m_arrayPanels[i].render(contextRender);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
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
                    var m_functionAllocateTypeBuilder = function() {

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
                    var m_functionAllocatePropertyBuilder = function() {

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

                    // Allocate Event builder instance.
                    var m_functionAllocateEventBuilder = function() {

                        try {

                            // For now, only allocate once.
                            if (window.eventBuilder) {

                                return null;
                            }

                            // Allocate and create the Event builder.
                            // Store globally.
                            window.eventBuilder = new EventBuilder();
                            var exceptionRet = window.eventBuilder.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Allocate method builder instance.
                    var m_functionAllocateMethodBuilder = function() {

                        try {

                            // For now, only allocate once.
                            if (window.methodBuilder) {

                                return null;
                            }

                            // Allocate and create the object list.
                            // Store globally so the drag layer can access.
                            window.methodBuilder = new MethodBuilder();
                            var exceptionRet = window.methodBuilder.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method adds typetree to types panel.
                    var m_functionAddTypeTreeToTypesPanel = function(panelTypes) {

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

                    // Helper method adds systemtypetree to systemTypes panel.
                    var m_functionAddSystemTypeTreeToSystemTypesPanel = function(panelSystemTypes) {

                        try {

                            // Some dummy data for now....
                            var arraySystemTypes = [];

                            // Allocate and create the object tree, passing the initialization object.
                            var tt = new TypeTree();
                            var exceptionRet = tt.create(arraySystemTypes);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Set it.
                            panelSystemTypes.payload = tt;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method adds NameList to names panel.
                    // var m_functionAddNameListToNamesPanel = function (panelNames) {

                    //     try {

                    //         // Some dummy data for now....
                    //         var arrayNames = [];

                    //         // Allocate and create the object list, passing the initialization object.
                    //         var nl = new NameList();
                    //         var exceptionRet = nl.create(arrayNames);
                    //         if (exceptionRet) {

                    //             throw exceptionRet;
                    //         }

                    //         // Set it.
                    //         panelNames.payload = nl;

                    //         return null;
                    //     } catch (e) {

                    //         return e;
                    //     }
                    // };

                    // Helper method adds StatementList to statements panel.
                    var m_functionAddStatementListToStatementsPanel = function(panelStatements) {

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
                    // var m_functionAddExpressionListToExpressionsPanel = function (panelExpressions) {

                    //     try {

                    //         // Allocate and create the object list.
                    //         var el = new ExpressionList();
                    //         var exceptionRet = el.create([]);
                    //         if (exceptionRet) {

                    //             throw exceptionRet;
                    //         }

                    //         // Set it.
                    //         panelExpressions.payload = el;

                    //         return null;
                    //     } catch (e) {

                    //         return e;
                    //     }
                    // };

                    // Helper method adds LiteralList to literals panel.
                    // var m_functionAddLiteralListToLiteralsPanel = function (panelLiterals) {

                    //     try {

                    //         // Allocate and create the object list.
                    //         var ll = new LiteralList();
                    //         var exceptionRet = ll.create([]);
                    //         if (exceptionRet) {

                    //             throw exceptionRet;
                    //         }

                    //         // Set it.
                    //         panelLiterals.payload = ll;

                    //         return null;
                    //     } catch (e) {

                    //         return e;
                    //     }
                    // };

                    // Helper method sets MethodBuilder in the method panel.
                    var m_functionSetMethodBuilderInCenterPanel = function() {

                        try {

                            // Set visible to property builder.
                            window.eventBuilder.visible = false;
                            window.propertyBuilder.visible = false;
                            window.methodBuilder.visible = true;
                            window.typeBuilder.visible = false;

                            // Set it in the center panel.
                            return self.centerPanel.setPayload("Method",
                                window.methodBuilder);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method sets TypeBuilder in the method panel.
                    var m_functionSetTypeBuilderInCenterPanel = function() {

                        try {

                            // Set visible to property builder.
                            window.eventBuilder.visible = false;
                            window.propertyBuilder.visible = false;
                            window.methodBuilder.visible = false;
                            window.typeBuilder.visible = true;

                            // Set it in the center panel.
                            return self.centerPanel.setPayload("Type",
                                window.typeBuilder);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method sets PropertyBuilder in the method panel.
                    var m_functionSetPropertyBuilderInCenterPanel = function() {

                        try {

                            // Set visible to property builder.
                            window.eventBuilder.visible = false;
                            window.propertyBuilder.visible = true;
                            window.methodBuilder.visible = false;
                            window.typeBuilder.visible = false;

                            // Set it in the center panel.
                            return self.centerPanel.setPayload("Property",
                                window.propertyBuilder);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method sets EventBuilder in the center panel.
                    var m_functionSetEventBuilderInCenterPanel = function() {

                        try {

                            // Set visible to property builder.
                            window.eventBuilder.visible = true;
                            window.propertyBuilder.visible = false;
                            window.methodBuilder.visible = false;
                            window.typeBuilder.visible = false;

                            // Set it in the center panel.
                            return self.centerPanel.setPayload("Event",
                                window.eventBuilder);
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