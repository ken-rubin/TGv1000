///////////////////////////////////////
// Type module.
//
// A data entity composed of methods, properties, and events.
// Here, contained as a main element of the TypeTree GUI element.
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
    "NextWave/source/utility/glyphs",
    "NextWave/source/utility/attributeHelper",
    "NextWave/source/type/TypeSection",
    "NextWave/source/type/Methods",
    "NextWave/source/type/Method",
    "NextWave/source/type/Properties",
    "NextWave/source/type/Property",
    "NextWave/source/type/Events",
    "NextWave/source/type/Event",
    "NextWave/source/methodBuilder/CodeStatementVar",
    "NextWave/source/methodBuilder/CodeExpressionInfix",
    "NextWave/source/methodBuilder/CodeExpressionName",
    "NextWave/source/methodBuilder/CodeExpressionType",
    "NextWave/source/methodBuilder/CodeName",
    "NextWave/source/methodBuilder/CodeType",
    "NextWave/source/methodBuilder/CodeExpressionPrefix",
    "NextWave/source/methodBuilder/CodeExpressionInvocation"],
    function (prototypes, settings, Point, Size, Area, glyphs, attributeHelper, TypeSections, Methods, Method, Properties, Property, Events, Event, CodeStatementVar, CodeExpressionInfix, CodeExpressionName, CodeExpressionType, CodeName, CodeType, CodeExpressionPrefix, CodeExpressionInvocation) {

        try {

            // Constructor function.
        	var functionRet = function Type(ctName) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Name of this type object.
                    self.name = ctName || new CodeType();
                    // Colleciton of methods.
                    self.methods = new Methods(self);
                    // Colleciton of properties.
                    self.properties = new Properties(self);
                    // Collection of events.
                    self.events = new Events(self);
                    // Collection of contained method objects.
                    self.typeSections = [self.methods, 
                        self.properties];
                    // Indicates the type is open.
                    self.open = false;
                    // Indicates the type is highlighted.
                    self.highlight = false;
                    // Get the node containing settings for this type.
                    self.settingsNode = settings.tree.type;
                    // Object holds data members which are 
                    // not differentiated by this client.
                    self.stowage = {};

                    ///////////////////////////
                    // Public methods.

                    // Create instance.
                    self.create = function (objectType) {

                        try {

                            // Save the attributes along with this object.
                            var exceptionRet = attributeHelper.fromJSON(objectType,
                                self,
                                ["name", "methods", "properties", "events"]);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Set the name.
                            self.name = new CodeType(objectType.name);

                            // Build the methods.
                            if (objectType.methods && objectType.methods.length) {

                                for (var j = 0; j < objectType.methods.length; j++) {

                                    var objectMethodIth = objectType.methods[j];

                                    var methodNew = new Method(self,
                                        objectMethodIth.name);
                                    exceptionRet = methodNew.create(objectMethodIth);
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }
                                    exceptionRet = self.methods.addPart(methodNew);
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }
                                }
                            } else {

                                // This Type doesn't have a 'construct' method. It must be new, since all Types have a construct method.
                                // Let's add one.
                                var methodContruct = new Method(self,
                                    'construct');   // No parameters; no statements.

                                exceptionRet = methodContruct.create({
                                    name: 'construct',
                                    ownedByUserId: parseInt(g_profile["userId"], 10)
                                });
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                                
                                exceptionRet = self.methods.addPart(methodContruct);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            // Build the properties.
                            if (objectType.properties) {

                                for (var j = 0; j < objectType.properties.length; j++) {

                                    var objectPropertyIth = objectType.properties[j];

                                    var propertyNew = new Property(self,
                                        objectPropertyIth.name);
                                    exceptionRet = propertyNew.create(objectPropertyIth);
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }
                                    exceptionRet = self.properties.addPart(propertyNew);
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }
                                }
                            }

                            // Build the events.
                            if (objectType.events) {

                                for (var j = 0; j < objectType.events.length; j++) {

                                    var objectEventIth = objectType.events[j];

                                    var eventNew = new Event(self,
                                        objectEventIth.name);
                                    exceptionRet = eventNew.create(objectEventIth);
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }
                                    exceptionRet = self.events.addPart(eventNew);
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

                    // Return a code instance
                    self.allocateCodeInstance = function () {

                        var strName = self.name.payload.substring(0, 1).toLowerCase() + self.name.payload.substring(1);
                        strName = window.manager.getUniqueName(strName);
                        var csvRet = new CodeStatementVar(
                            new CodeExpressionInfix(
                                new CodeExpressionName(
                                    new CodeName(
                                        strName
                                    )
                                ),
                                "=",
                                new CodeExpressionPrefix(
                                    "new", 
                                    new CodeExpressionInvocation(
                                        new CodeExpressionType(
                                            new CodeType(
                                                self.name.payload
                                            )
                                        )
                                    )
                                )
                            )
                        );
                        csvRet.addNameInDragConsumate = true;
                        csvRet.consumateName = strName;
                        return csvRet;
                    };

                    // Method closes up the type.
                    self.close = function () {

                        try {

                            // Close up type.
                            self.open = false;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Returns the height of this type.
                    self.getHeight = function () {

                        var dHeight = self.settingsNode.lineHeight + 2 * settings.general.margin;
                        if (self.open && self.typeSections.length > 0) {

                            // Add in child height and borders....
                            for (var i = 0; i < self.typeSections.length; i++) {

                                dHeight += self.typeSections[i].getHeight();
                            }
                            dHeight += settings.general.margin * (self.typeSections.length - 1);
                        }

                        return dHeight;
                    };

                    // Returns the height of this type with all blocks closed.
                    // Used by dragging because all dragged items are closed.
                    self.getClosedHeight = function () {

                        var dHeight = self.settingsNode.lineHeight + 2 * settings.general.margin;
                        return dHeight;
                    };

                    // Clear area.
                    self.clearArea = function () {

                        try {

                            m_area = null;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Return the area for dragging rendering.
                    self.getDragArea = function () {

                        return m_area.clone();
                    };

                    // Generates JavaScript string module for this Type.
                    self.generateJavaScript = function () {

                        // Build the constructor function for the type.
                        var strConstructorFunction = " window." + self.name.payload + 
                            " = function (app) { " + 
                            " /* Closure. */ var self = this; " + 
                            " /* Register with system. */ window.instances.push(self); " + 
                            " /* Reference to the application object. */ self.app = app; ";

                        // Add properties.
                        if (self.properties) {

                            strConstructorFunction += self.properties.generateJavaScript();
                        }

                        // Add methods.
                        if (self.methods) {

                            strConstructorFunction += self.methods.generateJavaScript();
                        }

                        strConstructorFunction += " };";

                        // Return the module.
                        return strConstructorFunction;
                    };

                    // Save type to JSON.
                    self.save = function () {

                        var objectRet = {};

                        // Save the attributes along with this object.
                        var exceptionRet = attributeHelper.toJSON(self,
                            objectRet);
                        if (exceptionRet) {

                            throw exceptionRet;
                        }

                        // Save name.
                        objectRet.name = self.name.payload;

                        // If there are methods, then save them up.
                        if (self.methods) {

                            objectRet.methods = self.methods.save();
                        }

                        // If there are properties, then save them up.
                        if (self.properties) {

                            objectRet.properties = self.properties.save();
                        }

                        // If there are events, then save them up.
                        if (self.events) {

                            objectRet.events = self.events.save();
                        }

                        return objectRet;
                    };

                    // Invoked when the mouse is moved over the type.
                    self.mouseMove = function (objectReference) {

                        try {

                            // Can't do much if no area.
                            if (!m_area) {

                                return null;
                            }

                            // Reset highlight.
                            var exceptionRet = self.mouseOut(objectReference);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Test the two icons.
                            var bIn = m_areaOpenCloseIcon.pointInArea(objectReference.contextRender,
                                objectReference.pointCursor);
                            if (bIn) {

                                m_objectHighlight = m_areaOpenCloseIcon;
                                objectReference.cursor = "cell";
                            } else {

                                // Then test the other icon.
                                bIn = m_areaDeleteIcon.pointInArea(objectReference.contextRender,
                                    objectReference.pointCursor);
                                if (bIn) {

                                    m_objectHighlight = m_areaDeleteIcon;
                                    objectReference.cursor = "cell";
                                } else {

                                    // Then test the name CodeType.
                                    bIn = self.name.pointIn(objectReference.contextRender,
                                        objectReference.pointCursor);
                                    if (bIn) {

                                        m_objectHighlight = self.name;
                                        //self.name.highlight = true;
                                    } else {

                                        // Then test the Methods.
                                        bIn = self.methods.pointIn(objectReference.contextRender,
                                            objectReference.pointCursor);
                                        if (bIn) {

                                            m_objectHighlight = self.methods;
                                            self.methods.highlight = true;

                                            return self.methods.mouseMove(objectReference);
                                        } else {

                                            // Finally properties, to be replaced by events....
                                            bIn = self.properties.pointIn(objectReference.contextRender,
                                                objectReference.pointCursor);
                                            if (bIn) {

                                                m_objectHighlight = self.properties;
                                                self.properties.highlight = true;

                                                return self.properties.mouseMove(objectReference);
                                            }
                                        }
                                    }
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is pressed down over the type.
                    self.mouseDown = function (objectReference) {

                        try {

                            // Only care about mouse down if over some regon.
                            if (m_objectHighlight) {

                                if (m_objectHighlight === m_areaOpenCloseIcon) {

                                    if (self.open) {

                                        self.open = false;
                                    } else {

                                        self.open = true;
                                    }
                                } else if (m_objectHighlight === m_areaDeleteIcon) {

                                    if (!self.stowage.isSystemType) {
                                        return window.manager.removeType(self);
                                    } else {
                                        return window.manager.removeSystemType(self);
                                    }

//                                } else if (m_objectHighlight === self.name) {

//                                    return window.manager.selectType(self);
                                } else if ($.isFunction(m_objectHighlight.mouseDown)) {

                                    return m_objectHighlight.mouseDown(objectReference);
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is moved out of the type.
                    self.mouseOut = function (objectReference) {

                        try {

                            // Reset highlight.
                            if (m_objectHighlight) {

                                // Don't check return...just a mouse out.
                                if ($.isFunction(m_objectHighlight.mouseOut)) {

                                    m_objectHighlight.mouseOut(objectReference);
                                }
                                if (m_objectHighlight.hasOwnProperty("highlight")) {

                                    m_objectHighlight.highlight = false;
                                }
                                m_objectHighlight = null;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is clicked over the Type.
                    self.click = function (objectReference) {

                        try {

                            // Reset highlight.
                            if (m_objectHighlight) {

                                // Process click as a "enter type mode".
                                if (m_objectHighlight === self.name) {

                                    var exceptionRet = window.manager.selectType(self);
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }
                                }
                                if ($.isFunction(m_objectHighlight.click)) {

                                    // Pass down.
                                    return m_objectHighlight.click(objectReference);
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Test if the point is in this Type.
                    self.pointIn = function (contextRender, point) {

                        // Return false if never rendered.
                        if (!m_area) {

                            return false;
                        }

                        // Return hit-test against generated path.
                        return m_area.pointInArea(contextRender,
                            point);
                    }

                    // Render out this type.
                    self.render = function (contextRender, areaRender, dY) {

                        try {

                            // Define the containing area.
                            m_area = new Area(
                                new Point(areaRender.location.x + settings.general.margin, 
                                    areaRender.location.y + settings.general.margin + dY),
                                new Size(areaRender.extent.width - 2 * settings.general.margin, 
                                    self.getHeight() - 2 * settings.general.margin)
                            );

                            // Generate the path.
                            var exceptionRet = m_area.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Fill and stroke the path.
                            if (window.draggingStatement || window.draggingExpression) {

                                contextRender.fillStyle = settings.general.fillDrag;
                                contextRender.strokeStyle = settings.general.strokeDrag;
                            } else if (self.highlight) {

                                contextRender.fillStyle = settings.general.fillBackgroundHighlight;
                                contextRender.strokeStyle = settings.general.strokeBackgroundHighlight;
                            } else {

                                contextRender.fillStyle = self.settingsNode.fillBackground;
                                contextRender.strokeStyle = settings.general.strokeBackground;
                            }
                            contextRender.fill();
                            contextRender.stroke();

                            // Render the name.
                            contextRender.font = self.settingsNode.font;

                            // Render the type CodeType.
                            var areaName = new Area(m_area.location.clone(),
                                new Size(m_area.extent.width - 2 * settings.glyphs.width + settings.general.margin, 
                                    self.settingsNode.lineHeight));
                            self.name.maxWidth = areaName.extent.width;
                            exceptionRet = self.name.render(contextRender, 
                                areaName,
                                0);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // If open, render methods and properties.
                            var glyph = glyphs.expand;
                            if (self.open) {

                                // Figure out which.
                                var dYOffset = self.settingsNode.lineHeight;
                                for (var i = 0; i < self.typeSections.length; i++) {

                                    var typeSectionIth = self.typeSections[i];

                                    // Render type section.
                                    exceptionRet = typeSectionIth.render(contextRender, 
                                        m_area,
                                        dYOffset);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }

                                    // Adjust for the next typesection.
                                    dYOffset += typeSectionIth.getHeight() + settings.general.margin;
                                }
                                glyph = glyphs.contract;
                            }

                            // Draw the open/close glyphs.
                            m_areaOpenCloseIcon = new Area(
                                new Point(m_area.location.x + m_area.extent.width - settings.glyphs.width,
                                    m_area.location.y + settings.general.margin),
                                new Size(settings.glyphs.width, 
                                    settings.glyphs.height));

                            // Render glyph.
                            exceptionRet = glyphs.render(contextRender,
                                m_areaOpenCloseIcon,
                                glyph, 
                                settings.manager.showIconBackgrounds);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Draw the delete glyphs.
                            m_areaDeleteIcon = new Area(
                                new Point(m_areaOpenCloseIcon.location.x - settings.glyphs.width,
                                    m_areaOpenCloseIcon.location.y),
                                new Size(settings.glyphs.width, 
                                    settings.glyphs.height));

                            // Render glyph.
                            exceptionRet = glyphs.render(contextRender,
                                m_areaDeleteIcon,
                                glyphs.remove, 
                                settings.manager.showIconBackgrounds);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    //////////////////////////
                    // Private fields.

                    // The area, relative to the canvas, occupied by this instance.
                    var m_area = null;
                    // The area of the open/close glyph.
                    var m_areaOpenCloseIcon = null;
                    // The area of the delete glyph.
                    var m_areaDeleteIcon = null;
                    // Remember which object has the highlight.
                    var m_objectHighlight = null;
                    // The type name before it is edited.
                    var m_strTypeBefore = null;
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
