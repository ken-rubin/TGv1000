///////////////////////////////////////
// Accordion module.
//
// Shows an accordion of sections.
// A section is a header (String) and 
// collection (List) of items (ListItems).
//
// The Accordion is a Control.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
        "NextWave/source/utility/settings",
        "NextWave/source/utility/glyphs",
        "NextWave/source/utility/Point",
        "NextWave/source/utility/Size",
        "NextWave/source/utility/Area",
        "NextWave/source/utility/Control",
        "NextWave/source/utility/List"],
    function(prototypes, settings, glyphs, Point, Size, Area, Control, List) {

        try {

            // Constructor function.
            var functionRet = function Accordion(objectParameters) {

                try {

                    var self = this; // Uber closure.

                    // Inherit from Control.  Call parent Control
                    // constructor.  Pass parameters, if specified.
                    self.inherits(Control);

                    ///////////////////////
                    // Public fields.

                    // Accordion sectons.
                    self.sections = [];

                    ////////////////////////
                    // Public methods.

                    // Give derived modules a crack at the create pipeline.
                    self.innerCreate = function () {

                        try {

                            // Save off sections.
                            self.sections = self.configuration.sections;

                            // Process each section.
                            var bFirst = true;
                            self.sections.forEach(function (section) {

                                try {

                                    // Allocate section list.
                                    section.list = new List(true);

                                    // Set the open-ness.
                                    if (bFirst) {

                                        bFirst = false;

                                        section.openPercent = 1;
                                    } else {

                                        section.openPercent = 0;
                                    }

                                    section.opening = false;
                                    section.closing = false;

                                    // Add an accessor directly to self.
                                    self[section.name] = section.list;
                                } catch (e) {

                                    alert(e.message);
                                }
                            });
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Give this object a crack at the layout pipeline.
                    self.innerCalculateLayout = function (areaMaximal, contextRender) {

                        try {

                            m_area = areaMaximal;

                            // Indicate that the next render 
                            // has to recalculate the lists.
                            m_bRecalculateLists = true;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Render object.
                    self.render = function (contextRender) {

                        try {

                            // Generate the path.
                            var exceptionRet = m_area.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Fill and stroke the path.
                            contextRender.fillStyle = "rgba(255,100,100,0.3)";
                            contextRender.strokeStyle = settings.general.strokeBackground;
                            contextRender.fill();
                            contextRender.stroke();

                            // Render the sections:

                            // Start at the top.
                            var dY = m_area.location.y;

                            // Get total height of this Control.
                            var dTotalHeight = m_area.extent.height;

                            // Each section is at least a line-height header high,
                            // so calcuate the height of all the open and partially
                            // open sections from that assumption and what's left.
                            var dRemainingHeight = dTotalHeight - 
                                self.sections.length * settings.dialog.lineHeight;

                            // Loop over each section.
                            var exceptionRet = null;
                            self.sections.forEach(function (section) {

                                try {

                                    // Open if opening, close if closing.
                                    var bHeightChanged = false;
                                    if (section.opening) {

                                        section.openPercent += 0.05;
                                        bHeightChanged = true;
                                        if (section.openPercent >= 1) {

                                            section.openPercent = 1;
                                            section.opening = false;
                                        }
                                    } else if (section.closing) {

                                        section.openPercent -= 0.05;
                                        bHeightChanged = true;
                                        if (section.openPercent <= 0) {

                                            section.openPercent = 0;
                                            section.closing = false;
                                        }
                                    }

                                    // Always calc height from the open percent.
                                    section.height = dRemainingHeight * section.openPercent;

                                    // Render the add glyph, if specified.
                                    var dSpaceForAddGlyph = 0;
                                    if ($.isFunction(section.addGlyphClickHandler)) {

                                        dSpaceForAddGlyph = settings.glyphs.width + settings.general.margin;

                                        // Calculate where the icon is, also used for hittesting.
                                        section.addGlyphArea = new Area(
                                            new Point(m_area.location.x + m_area.extent.width - dSpaceForAddGlyph,
                                                dY + settings.general.margin),
                                            new Size(settings.glyphs.smallWidth,
                                                settings.glyphs.smallHeight));

                                        // Render pushpin.
                                        exceptionRet = glyphs.render(contextRender,
                                            section.addGlyphArea,
                                            glyphs.addNew,
                                            settings.manager.showIconBackgrounds);
                                        if (exceptionRet) {

                                            throw exceptionRet;
                                        }
                                    } else {

                                        section.addGlyphArea = null;
                                    }

                                    // Render the save glyph, if specified.
                                    if ($.isFunction(section.saveGlyphClickHandler)) {

                                        dSpaceForAddGlyph += settings.glyphs.width + settings.general.margin;

                                        // Calculate where the icon is, also used for hittesting.
                                        section.saveGlyphArea = new Area(
                                            new Point(m_area.location.x + m_area.extent.width - dSpaceForAddGlyph,
                                                dY + settings.general.margin),
                                            new Size(settings.glyphs.smallWidth,
                                                settings.glyphs.smallHeight));

                                        // Render pushpin.
                                        exceptionRet = glyphs.render(contextRender,
                                            section.saveGlyphArea,
                                            glyphs.save,
                                            settings.manager.showIconBackgrounds);
                                        if (exceptionRet) {

                                            throw exceptionRet;
                                        }
                                    } else {

                                        section.saveGlyphArea = null;
                                    }

                                    // Render the search glyph, if specified.
                                    if ($.isFunction(section.searchGlyphClickHandler)) {

                                        dSpaceForAddGlyph += settings.glyphs.width + settings.general.margin;

                                        // Calculate where the icon is, also used for hittesting.
                                        section.searchGlyphArea = new Area(
                                            new Point(m_area.location.x + m_area.extent.width - dSpaceForAddGlyph,
                                                dY + settings.general.margin),
                                            new Size(settings.glyphs.smallWidth,
                                                settings.glyphs.smallHeight));

                                        // Render pushpin.
                                        exceptionRet = glyphs.render(contextRender,
                                            section.searchGlyphArea,
                                            glyphs.search,
                                            settings.manager.showIconBackgrounds);
                                        if (exceptionRet) {

                                            throw exceptionRet;
                                        }
                                    } else {

                                        section.searchGlyphArea = null;
                                    }

                                    // Draw the current selection if one is mapped and specified.
                                    if (section.selectionAccessorProperty) {

                                        // Get the selected item.
                                        let objectSelected = window.projectDialog[section.selectionAccessorProperty];
                                        if (objectSelected) {

                                            contextRender.font = settings.general.smallFont;
                                            contextRender.fillStyle = settings.general.fillText;

                                            let dTextWidth = contextRender.measureText(objectSelected.data.name).width;
                                            dSpaceForAddGlyph += dTextWidth + settings.general.margin;

                                            section.selectedArea = new Area(
                                                    new Point(m_area.location.x  + m_area.extent.width - dSpaceForAddGlyph,
                                                        dY + settings.general.margin),
                                                    new Size(dTextWidth,
                                                        settings.dialog.lineHeight));
                                            contextRender.fillText(objectSelected.data.name,
                                                section.selectedArea.location.x,
                                                section.selectedArea.location.y,
                                                section.selectedArea.extent.width);
                                        }
                                    }

                                    // Draw the title.
                                    contextRender.font = settings.general.font;
                                    contextRender.fillStyle = settings.general.fillText;
                                    section.titleArea = new Area(
                                            new Point(m_area.location.x + settings.general.margin,
                                                dY),
                                            new Size(m_area.extent.width - 2 * settings.general.margin - dSpaceForAddGlyph,
                                                settings.dialog.lineHeight));
                                    contextRender.fillText(section.title,
                                        section.titleArea.location.x,
                                        section.titleArea.location.y,
                                        section.titleArea.extent.width);

                                    // Draw the header-separator line.
                                    if (section.height > 0 ||
                                        section !== self.sections[self.sections.length - 1]) {

                                        contextRender.beginPath();
                                        contextRender.moveTo(m_area.location.x,
                                            dY + settings.dialog.lineHeight);
                                        contextRender.lineTo(m_area.location.x + 
                                                m_area.extent.width,
                                            dY + settings.dialog.lineHeight);

                                        contextRender.strokeStyle = settings.general.strokeBackground;
                                        contextRender.stroke();
                                    }

                                    dY += settings.dialog.lineHeight;

                                    // If the height is > 0, then render the list.
                                    if (section.height > 0) {

                                        section.listArea = new Area(
                                            new Point(m_area.location.x + settings.general.margin,
                                                dY),
                                            new Size(m_area.extent.width - 2 * settings.general.margin,
                                                section.height));

                                        // If the height changed, then need to recalculate the list.
                                        // CalculateLayout is used for all other recalulate scenarios.
                                        if (bHeightChanged || m_bRecalculateLists) {

                                            exceptionRet = section.list.calculateLayout(section.listArea, 
                                                contextRender);
                                            if (exceptionRet) {

                                                throw exceptionRet;
                                            }
                                        }

                                        // Render the list.
                                        exceptionRet = section.list.render(contextRender);
                                        if (exceptionRet) {

                                            throw exceptionRet;
                                        }

                                        dY += section.height;
                                    } else {

                                        section.listArea = null;
                                    }

                                } catch (e) {

                                    alert(e.message);
                                }
                            });

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Pass to payload.
                    self.mouseMove = function (objectReference) {

                        try {

                            // Figure out if over an important area.
                            try {

                                m_objectMoveState = null;
                                self.sections.forEach(function (section) {

                                    try {

                                        // Each section can have 3 regions:
                                        // 1) The title,
                                        // 2) The add glyph,
                                        // 3) The list.

                                        // As soon as over one of these, drop out.
                                        if (section.titleArea &&
                                            section.titleArea.pointInArea(objectReference.contextRender,
                                                objectReference.pointCursor,
                                                true)) {

                                            m_objectMoveState = {

                                                section: section,
                                                type: "title"
                                            };
                                            objectReference.cursor = "cell";
                                        } else if (section.addGlyphArea &&
                                            section.addGlyphArea.pointInArea(objectReference.contextRender,
                                                objectReference.pointCursor,
                                                true)) {

                                            m_objectMoveState = {

                                                section: section,
                                                type: "addGlyph"
                                            };
                                            objectReference.cursor = "cell";
                                        } else if (section.saveGlyphArea &&
                                            section.saveGlyphArea.pointInArea(objectReference.contextRender,
                                                objectReference.pointCursor,
                                                true)) {

                                            m_objectMoveState = {

                                                section: section,
                                                type: "saveGlyph"
                                            };
                                            objectReference.cursor = "cell";
                                        } else if (section.searchGlyphArea &&
                                            section.searchGlyphArea.pointInArea(objectReference.contextRender,
                                                objectReference.pointCursor,
                                                true)) {

                                            m_objectMoveState = {

                                                section: section,
                                                type: "searchGlyph"
                                            };
                                            objectReference.cursor = "cell";
                                        } else if (section.selectedArea &&
                                            section.selectedArea.pointInArea(objectReference.contextRender,
                                                objectReference.pointCursor,
                                                true)) {

                                            m_objectMoveState = {

                                                section: section,
                                                type: "title"
                                            };
                                            objectReference.cursor = "cell";

                                        } else if (section.listArea &&
                                            section.listArea.pointInArea(objectReference.contextRender,
                                                objectReference.pointCursor,
                                                true)) {

                                            m_objectMoveState = {

                                                section: section,
                                                type: "list"
                                            };
                                            // Pass to list.
                                            return section.list.mouseMove(objectReference);
                                        }
                                    } catch (e) {

                                        alert(e.message);
                                    }
                                });
                            } catch (e) {

                                // Do nothing...
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Pass to payload.
                    self.mouseDown = function (objectReference) {

                        try {

                            // If the move state is set, then  
                            // cursor over some "important" area.
                            if (m_objectMoveState) {

                                var section = m_objectMoveState.section;

                                // For title, start opening the 
                                // section if it is not open already.
                                if (m_objectMoveState.type === "title") {

                                    if (section.openPercent < 1) {

                                        // Close all other sections.
                                        self.sections.forEach(function (section) {

                                            section.opening = false;
                                            section.closing = true;
                                        });
                                        section.opening = true;
                                        section.closing = false;
                                    }
                                } else if (m_objectMoveState.type === "addGlyph") {

                                    // Call the callback.
                                    section.addGlyphClickHandler(objectReference);

                                    // Also, open this section, if not open.
                                    if (section.openPercent < 1) {

                                        // Close all other sections.
                                        self.sections.forEach(function (section) {

                                            section.opening = false;
                                            section.closing = true;
                                        });
                                        section.opening = true;
                                        section.closing = false;
                                    }
                                } else if (m_objectMoveState.type === "saveGlyph") {

                                    // Call the callback.
                                    section.saveGlyphClickHandler(objectReference);

                                    // Also, open this section, if not open.
                                    if (section.openPercent < 1) {

                                        // Close all other sections.
                                        self.sections.forEach(function (section) {

                                            section.opening = false;
                                            section.closing = true;
                                        });
                                        section.opening = true;
                                        section.closing = false;
                                    }
                                } else if (m_objectMoveState.type === "searchGlyph") {

                                    // Call the callback.
                                    section.searchGlyphClickHandler(objectReference);

                                    // Also, open this section, if not open.
                                    if (section.openPercent < 1) {

                                        // Close all other sections.
                                        self.sections.forEach(function (section) {

                                            section.opening = false;
                                            section.closing = true;
                                        });
                                        section.opening = true;
                                        section.closing = false;
                                    }
                                } else {

                                    // Pass to the list.
                                    var exceptionRet = section.list.mouseDown(objectReference);
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

                    // Pass to payload.
                    self.mouseUp = function (objectReference) {

                        try {

                            // If the move state is set, then  
                            // cursor over some "important" area.
                            if (m_objectMoveState) {

                                var section = m_objectMoveState.section;

                                if (m_objectMoveState.type === "title") {

                                } else if (m_objectMoveState.type === "addGlyph") {

                                } else if (m_objectMoveState.type === "saveGlyph") {

                                } else {

                                    // Pass to the list.
                                    var exceptionRet = section.list.mouseUp(objectReference);
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

                    // Pass to payload.
                    self.mouseOut = function (objectReference) {

                        try {

                            // If the move state is set, then  
                            // cursor over some "important" area.
                            if (m_objectMoveState) {

                                var section = m_objectMoveState.section;

                                if (m_objectMoveState.type === "title") {

                                } else if (m_objectMoveState.type === "addGlyph") {

                                } else if (m_objectMoveState.type === "saveGlyph") {

                                } else {

                                    // Pass to the list.
                                    var exceptionRet = section.list.mouseOut(objectReference);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                } 
                            }
                            return null;
                        } catch (e) {

                            return e;
                        } finally {

                            m_objectMoveState = null;
                        }
                    };

                    // Pass to payload.
                    self.mouseWheel = function (objectReference) {

                        try {

                            // If the move state is set, then  
                            // cursor over some "important" area.
                            if (m_objectMoveState) {

                                var section = m_objectMoveState.section;

                                if (m_objectMoveState.type === "title") {

                                } else if (m_objectMoveState.type === "addGlyph") {

                                } else if (m_objectMoveState.type === "saveGlyph") {

                                } else {

                                    // Pass to the list.
                                    var exceptionRet = section.list.mouseWheel(objectReference);
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

                    // Pass to payload.
                    self.click = function (objectReference) {

                        try {

                            // If the move state is set, then  
                            // cursor over some "important" area.
                            if (m_objectMoveState) {

                                var section = m_objectMoveState.section;

                                if (m_objectMoveState.type === "title") {

                                } else if (m_objectMoveState.type === "addGlyph") {

                                } else if (m_objectMoveState.type === "saveGlyph") {

                                } else {

                                    // Pass to the list.
                                    var exceptionRet = section.list.click(objectReference);
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
                    // Private fields.

                    // Placement of this instance.
                    var m_area = null;
                    // Indicates that the lists have to be recalculated.
                    var m_bRecalculateLists = false;
                    // Holds the "over" state set by the move event.
                    var m_objectMoveState = null;
                } catch (e) {

                    alert(e.message);
                }
            };

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });