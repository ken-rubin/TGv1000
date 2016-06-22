///////////////////////////////////////
// Edit module.
//
// Allows typed input of user data.
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
    "NextWave/source/utility/Control"],
    function (prototypes, settings, Point, Size, Area, Control) {

        try {

            // Constructor function.
        	var functionRet = function Edit(strText, bMultiline) {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from Control.  Call parent Control
                    // constructor.  Pass parameters, if specified.
                    self.inherits(Control);

                    ///////////////////////
                    // Public fields.

                    // Indicate if this object is highlighted.
                    self.highlight = false;
                    // Content.  Lines of objects, each of which has selection information.
                    self.text = strText || "";
                    // Either the token: "requireFormat", or an array of lines.
                    self.lines = "requireFormat";
                    // Indicates that the corresponding scroll stud is visible--set in render.
                    self.scrollStubVisible = [false, false];
                    // Indicates that the corresponding scroll stud is visible--set in render.
                    self.scrollStubArea = [null, null];
                    // Indicates how things are measured and how they scroll.
                    self.multiline = bMultiline || false;
                    // Access this property based on orientation.
                    self.propertyAccessor = (self.multiline ? "height" : "width");
                    // Access scroll cursor based on orientation.
                    self.scrollCursor = [(self.multiline ? "n-resize" : "w-resize"),
                        (self.multiline ? "s-resize" : "e-resize")];
                    // Width of a single character.
                    self.characterWidth = 20;
                    // If protected, no editing is allowed.
                    self.protected = false;

                    ///////////////////////
                    // Public methods.

                    // Get the text in this control.
                    self.getText = function () {

                        return self.text;
                    };

                    // Set the text in this control.
                    self.setText = function (strText, bProtected) {

                        try {

                            self.protected = bProtected || false;

                            // Store the information.
                            self.text = strText;

                            // Reset lines--to cause the next render to reformat.
                            self.lines = "requireFormat";

                            m_iSelectionStart = 0;
                            m_iSelectionLength = 0;//self.text.length;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    self.getWidth = function (contextRender) {

                        contextRender.font = settings.general.monoSpaceFont;
                        return contextRender.measureText(self.text).width + 4 * settings.general.margin;                            
                    }

                    self.getHeight = function () {

                        return self.position.extent.height + 2 * settings.general.margin;                            
                    }

                    // Helper method calculates usable total extent of list.
                    self.getTotalExtent = function (contextRender) {

                        if (self.multiline) {

                            // Sum each line.
                            if (self.lines === "requireFormat") {

                                return 0;
                            }
                            return settings.dialog.lineHeight * self.lines.length;
                        } else {

                            return self.getWidth(contextRender);
                        }
                    };

                    // Reset format.
                    self.innerCalculateLayout = function (areaMaximal, contextRender) {

                        try {

                            // Reset lines--to cause the next render to reformat.
                            self.lines = "requireFormat";

                            // Position scroll stubs--they may not be visible.
                            if (self.multiline) {

                                self.scrollStubArea[0] = new Area(new Point(areaMaximal.location.x + (areaMaximal.extent.width - settings.general.scrollStub.width) / 2, 
                                        areaMaximal.location.y + settings.general.scrollStub.yOffset), 
                                    new Size(settings.general.scrollStub.width, settings.general.scrollStub.height));

                                self.scrollStubArea[1] = new Area(new Point(areaMaximal.location.x + (areaMaximal.extent.width - settings.general.scrollStub.width) / 2, 
                                        areaMaximal.location.y + areaMaximal.extent.height + settings.general.scrollStub.yOffset), 
                                    new Size(settings.general.scrollStub.width, settings.general.scrollStub.height));
                            } else {

                                self.scrollStubArea[0] = new Area(new Point(areaMaximal.location.x - settings.general.scrollStub.height / 2, 
                                        areaMaximal.location.y - settings.general.scrollStub.yOffset / 5), 
                                    new Size(settings.general.scrollStub.height /* this one is on its side */, 
                                        areaMaximal.extent.height + 2 * settings.general.scrollStub.yOffset / 5));

                                self.scrollStubArea[1] = new Area(new Point(areaMaximal.location.x + areaMaximal.extent.width - settings.general.scrollStub.height / 2, 
                                        areaMaximal.location.y - settings.general.scrollStub.yOffset / 5), 
                                    new Size(settings.general.scrollStub.height /* this one is on its side */, 
                                        areaMaximal.extent.height + 2 * settings.general.scrollStub.yOffset / 5));
                            }

                            // Adjust scroll offset, if necessary.
                            return self.possiblyAdjustScrollOffset();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Set values as opposed to via the constructor.
                    self.innerCreate = function () {

                        try {

                            // Configuration data in self.configuration.

                            // Set multiline and comcamitant properties.
                            self.multiline = self.configuration.multiline;
                            if (self.multiline === undefined) {

                                self.multiline = true;
                            }
                            self.propertyAccessor = (self.multiline ? "height" : "width");
                            self.scrollCursor = [(self.multiline ? "n-resize" : "w-resize"),
                                (self.multiline ? "s-resize" : "e-resize")];

                            // Also update the text, possibly.
                            if (self.configuration.text) {

                                return self.setText(self.configuration.text);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Inner clear data.
                    self.innerClear = function () {

                        self.lines = [];
                        return null;
                    };

                    // Stop scrolling if scrolling.
                    self.mouseOut = function (objectReference) {

                        try {

                            // Stop scrolling, if scrolling.
                            if (m_functionScroll) {

                                m_functionScroll = null;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Process double click.
                    self.click = function (objectReference) {

                        try {

                            if (self.protected) {

                                m_bShowCursor = false;
                                return null;
                            }

                            // First select the local word on a double click,
                            // then select everything on a triple click.
                            var iNow = (new Date()).getTime();
                            if (iNow - m_iLast < 500) {

                                // If the selection length is 
                                // 0 then select the local word.
                                if (m_iSelectionLength === 0) {

                                    while ((m_iSelectionStart > 0) &&
                                        ( self.text[m_iSelectionStart - 1].match(/\w/g) )) {

                                        m_iSelectionStart--;
                                        m_iSelectionLength++;
                                    }
                                    while ((m_iSelectionStart + m_iSelectionLength < self.text.length) &&
                                        ( self.text[m_iSelectionStart + m_iSelectionLength].match(/\w/g) )) {

                                        m_iSelectionLength++;
                                    }
                                    self.possiblyAdjustScrollOffset();
                                    self.possiblyEnsureCaretVisible();
                                    self.lines = "requireFormat";
                                }
                                if (iNow - m_iLastLast < 250) {

                                    m_iSelectionStart = 0;
                                    m_iSelectionLength = self.text.length;
                                    self.possiblyAdjustScrollOffset();
                                    self.possiblyEnsureCaretVisible();
                                    self.lines = "requireFormat";
                                }
                                m_iLastLast = iNow;
                            }
                            m_iLast = iNow;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Set caret position on mouse down.
                    self.mouseDown = function (objectReference) {

                        try {

                            if (self.protected) {

                                m_bShowCursor = false;
                                return null;
                            }

                            // Don't reset the selection if just clicked.
                            if ((new Date().getTime()) - m_iLast < 500) {

                                return null;
                            }

                            // Figure out the position as close to the mouse down as possible.
                            if (self.multiline) {

                                // For multiline, figure out the line and column:
                                // Line has scroll-logic associated.
                                var iLine = Math.floor( (objectReference.pointCursor.y + m_dScrollOffset - self.position.location.y) / settings.dialog.lineHeight );
                                if (iLine < 0) {

                                    iLine = 0;
                                }
                                if (iLine > self.lines.length - 1) {

                                    iLine = self.lines.length - 1;
                                }
                                var lineClick = self.lines[iLine];

                                var iColumn = Math.floor( (objectReference.pointCursor.x + self.characterWidth / 2 - self.position.location.x - settings.general.margin) / self.characterWidth );
                                if (iColumn < 0) {

                                    iColumn = 0;
                                }
                                if (iColumn > lineClick.text.length) {

                                    iColumn = lineClick.text.length;
                                }

                                // Set the start to the column index at the row.
                                m_iSelectionStart = lineClick.startIndex + iColumn;                            
                            } else {

                                // Just figure out the column.
                                var iColumn = Math.floor( (objectReference.pointCursor.x + self.characterWidth / 2 + m_dScrollOffset - self.position.location.x - settings.general.margin) / self.characterWidth );
                                if (iColumn < 0) {

                                    iColumn = 0;
                                }
                                if (iColumn > self.text.length) {

                                    iColumn = self.text.length;
                                }

                                // Set the start to the column index.
                                m_iSelectionStart = iColumn;                            
                            }

                            // Always set selection length to 0.
                            m_iSelectionLength = 0;
                            self.possiblyAdjustScrollOffset();
                            self.possiblyEnsureCaretVisible();
                            self.lines = "requireFormat";

                            // Always want to show the cursor after mouse click.
                            m_bShowCursor = true;

                            // Cancel the blink timer so it is started again, but
                            // gives the whole duration of shown-ness before hiding.
                            if (m_cookieBlinkTimer) {

                                clearInterval(m_cookieBlinkTimer);
                                m_cookieBlinkTimer = null;
                            }
                            // Do timer startup work.
                            m_cookieBlinkTimer = setInterval(m_functionBlinkTimerTick,
                                settings.general.blinkMS);

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is moved over the list.
                    self.mouseMove = function (objectReference) {

                        try {

                            // Test for scrolling.
                            if (self.scrollStubVisible[0] &&
                                self.scrollStubArea[0].pointInArea(objectReference.contextRender,
                                    objectReference.pointCursor)) {

                                // Start scrolling, if not already.
                                if (!m_functionScroll) {

                                    // Set the scroll function to "up".
                                    m_functionScroll = function () {

                                        // Special case, scroll down.
                                        if (m_dScrollOffset > 0) {

                                            m_dScrollOffset -= settings.general.scrollStub.amount;
                                        }
                                        // Pin to bounds.
                                        if (m_dScrollOffset < 0) {

                                            m_dScrollOffset = 0;
                                        }
                                    };
                                }

                                // Set the cursor.
                                objectReference.cursor = self.scrollCursor[0];

                                return null;
                            } else if (self.scrollStubVisible[1] &&
                                self.scrollStubArea[1].pointInArea(objectReference.contextRender,
                                    objectReference.pointCursor)) {

                                // Start scrolling, if not already.
                                if (!m_functionScroll) {

                                    // Set the scroll function to "down".
                                    m_functionScroll = function () {

                                        // Calculate the total extent.
                                        var dTotalExtent = self.getTotalExtent(objectReference.contextRender);

                                        // Special case, scroll up.
                                        if (m_dScrollOffset < (dTotalExtent - self.position.extent[self.propertyAccessor])) {

                                            m_dScrollOffset += settings.general.scrollStub.amount;
                                        }
                                        // Pin to bounds.
                                        if (m_dScrollOffset > (dTotalExtent - self.position.extent[self.propertyAccessor])) {

                                            m_dScrollOffset = (dTotalExtent - self.position.extent[self.propertyAccessor]);
                                        }
                                    };
                                }

                                // Set the cursor.
                                objectReference.cursor = self.scrollCursor[1];

                                // Possibly mouseout selection....
                                return null;
                            } else {

                                // Stop all scrolling.
                                m_functionScroll = null;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse wheel is scrolled over the canvas.
                    self.mouseWheel = function (objectReference) {

                        try {

                            // Calculate the total extent.
                            var dTotalExtent = self.getTotalExtent(objectReference.contextRender);

                            // Do nothing if nothing to scroll.
                            if (dTotalExtent < self.position.extent[self.propertyAccessor]) {

                                return null;
                            }

                            // Get the direction of scrolling based on wheel change.
                            // For now, I don't think you can scroll to ther side...test....
                            var strDeltaAccessor = (self.multiline ? "deltaY" : "deltaY");

                            // Calculate distance.
                            var dAmount = -objectReference.event[strDeltaAccessor] * objectReference.event.deltaFactor;

                            // Scroll up if negative, else, down.
                            if (dAmount < 0) {

                                // Move it.
                                if (m_dScrollOffset > 0) {

                                    m_dScrollOffset += dAmount;
                                }
                                // Pin to bounds.
                                if (m_dScrollOffset < 0) {

                                    m_dScrollOffset = 0;
                                }
                            } else {

                                // Move it.
                                if (m_dScrollOffset < (dTotalExtent - self.position.extent[self.propertyAccessor])) {

                                    m_dScrollOffset += dAmount;
                                }
                                // Pin to bounds.
                                if (m_dScrollOffset > (dTotalExtent - self.position.extent[self.propertyAccessor])) {

                                    m_dScrollOffset = (dTotalExtent - self.position.extent[self.propertyAccessor]);
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Adjust the scroll offset if sizes have changed on next render.
                    self.possiblyAdjustScrollOffset = function () {

                        try {

                            m_bPossiblyAdjustScrollOffsets = true;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Set a flag so that the caret is checked for visibility on the next render.
                    self.possiblyEnsureCaretVisible = function () {

                        if (self.protected) {

                            return false;
                        }

                        try {

                            m_bPossiblyEnsureCaretVisible = true;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Expose private field.
                    self.scrollOffset = function () {

                        return m_dScrollOffset;
                    };

                    // Handle the keypress, either backspace, delete, or normal keys.
                    self.keyPressed = function (e) {

                        try {

                            if (self.protected) {
                                e.stopPropagation();
                                return null;
                            }

                            // Always want to show the cursor after a character is typed.
                            m_bShowCursor = true;

                            // Cancel the blink timer so it is started again, but
                            // gives the whole duration of shown-ness before hiding.
                            if (m_cookieBlinkTimer) {

                                clearInterval(m_cookieBlinkTimer);
                                m_cookieBlinkTimer = null;
                            }
                            // Do startup work.
                            m_cookieBlinkTimer = setInterval(m_functionBlinkTimerTick,
                                settings.general.blinkMS);

                            // If normal character....
                            if ((e.which >= " ".charCodeAt(0) &&
                                e.which <= "~".charCodeAt(0)) ||
                                (e.which === "\n".charCodeAt(0))) {

                                // Fix up the selection length if negative.
                                if (m_iSelectionLength < 0) {

                                    m_iSelectionStart += m_iSelectionLength;
                                    m_iSelectionLength *= -1;
                                }

                                // Set the value to three parts: the range before the selection, the character typed and the part after the selection.
                                self.text = self.text.substr(0, m_iSelectionStart) +
                                    String.fromCharCode(e.which) +
                                    self.text.substr(m_iSelectionStart + m_iSelectionLength);
           
                                // Move the selection over one place and ensure narrow selection.
                                m_iSelectionStart++;
                                m_iSelectionLength = 0;
                            }

                            // Ensure caret is visible.
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Keep track of the command key.
                    self.keyUp = function (e) {

                        if (self.protected) {
                            e.stopPropagation();
                            return;
                        }

                        // Check if the key let up is the command key,
                        // if so, mark the command-state as now up.
                        if (e.which === 91 || e.which === 224) {

                            m_bCommand = false;
                        }
                    };

                    // Handle key-down to pre-process for tab and backspace keys.
                    // Funnells other requests off to handleKeyPress to process.
                    self.keyDown = function (e) {

                        try {

                            if (self.protected) {
                                e.stopPropagation();
                                return null;
                            }

                            // Let derived class do something  
                            // before handling the key press.
                            var exceptionRet = self.possiblyEnsureCaretVisible();
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = self.possiblyAdjustScrollOffset();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Save this state.
                            var bShift = (e.shiftKey);
                            var bCtrl = (e.ctrlKey);

                            // Always want to show the cursor after a character is typed.
                            m_bShowCursor = true;

                            // Cancel the blink timer so it is started again, but
                            // gives the whole duration of shown-ness before hiding.
                            if (m_cookieBlinkTimer) {

                                clearInterval(m_cookieBlinkTimer);
                                m_cookieBlinkTimer = null;
                            }
                            // Do startup work.
                            m_cookieBlinkTimer = setInterval(m_functionBlinkTimerTick,
                                settings.general.blinkMS);

                            // Never change pages on a backspace and keep focus on tabs.
                            if (e.which === 91 || e.which === 224) {

                                m_bCommand = true;
                                // Key is handled.
                                e.stopPropagation();
                            } else if (e.which === 8) {

                                // Fix up the selection length if negative.
                                if (m_iSelectionLength < 0) {

                                    m_iSelectionStart += m_iSelectionLength;
                                    m_iSelectionLength *= -1;
                                }

                                // If there is a selection to clear out, then do so.
                                if (m_iSelectionLength > 0) {

                                    // Set the cell value to the un-selected ranges before and after the selection.
                                    self.text = self.text.substr(0,
                                        m_iSelectionStart) + self.text.substr(m_iSelectionStart + m_iSelectionLength);

                                    // Reset the selection length after delete complete.
                                    m_iSelectionLength = 0;
                                } else {

                                    // Process normal overwriting backspace: erase the character just before the (narrow) selection start.
                                    if (m_iSelectionStart > 0) {

                                        // Set the cell value to the range before the selection - 1 and after the selection.
                                        self.text = self.text.substr(0,
                                            m_iSelectionStart - 1) + self.text.substr(m_iSelectionStart);

                                        // Move the selection back one place.
                                        m_iSelectionStart--;
                                    }
                                }

                                // Key is handled.
                                e.stopPropagation();
                            } else if (e.which === 46) {                      // Delete.
               
                                // Fix up the selection length if negative.
                                if (m_iSelectionLength < 0) {

                                    m_iSelectionStart += m_iSelectionLength;
                                    m_iSelectionLength *= -1;
                                }

                                if (m_iSelectionLength === 0) {

                                    // If the caret is blinking between characters and not after the final character, delete the character to the right of the caret.
                                    if (m_iSelectionStart < self.text.length) {

                                        self.text = self.text.substr(0,
                                            m_iSelectionStart) + self.text.substr(m_iSelectionStart + 1);
                                    }
                                } else if (m_iSelectionLength > 0) {

                                    // If there is a selection to clear out, then do so.
                                    // Set the cell value to the un-selected ranges before and after the selection.
                                    self.text = self.text.substr(0,
                                        m_iSelectionStart) + self.text.substr(m_iSelectionStart + m_iSelectionLength);

                                    // Reset the selection length after delete complete.
                                    m_iSelectionLength = 0;
                                }

                                // Key is handled.
                                e.stopPropagation();
                            } else if (e.which === 37) {                     // Left arrow.

                                // Resize the selection if shift.
                                if (bShift) {

                                    // Don't allow stretch that can go before the first character.  
                                    // But do, incidentally, allow for negative length values.
                                    if (m_iSelectionStart + m_iSelectionLength > 0) {

                                        m_iSelectionLength--;

                                        // If the control key is down, move across a word. 
                                        if (bCtrl) {

                                            while ((m_iSelectionStart + m_iSelectionLength > 0) &&
                                                ( self.text[m_iSelectionStart + m_iSelectionLength - 1].match(/\w/g) )) {

                                                m_iSelectionLength--;
                                            }
                                        }
                                    }
                                } else {

                                    // No shift means move the selection start.

                                    // Fix up the selection length if negative.
                                    if (m_iSelectionLength < 0) {

                                        m_iSelectionStart += m_iSelectionLength;
                                        m_iSelectionLength *= -1;
                                    }

                                    // Move the selection start if just a line (0 width).
                                    if (m_iSelectionLength === 0) {

                                        // Only allow move back if not at the first character.
                                        if (m_iSelectionStart > 0) {

                                            m_iSelectionStart--;
                                        }

                                        // If the control key is down, move across a word. 
                                        if (bCtrl) {

                                            while ((m_iSelectionStart > 0) &&
                                                ( self.text[m_iSelectionStart - 1].match(/\w/g) )) {

                                                m_iSelectionStart--;
                                            }
                                        }
                                    } else {

                                        // If the selection is wide, then make it narrow before moving selection.
                                        m_iSelectionLength = 0;
                                    }
                                }

                                // Key is handled.
                                e.stopPropagation();
                            } else if (e.which === 38) {                     // Up arrow.

                                // Convert down and up in the non-multiline case.
                                if (self.multiline === false) {

                                    // Convert to a left arrow and call into self.
                                    e.which = 37;
                                    return self.keyDown(e);
                                }

                                // Figure out where the "end of selection" marker is.
                                var iLine = (m_iSelectionLength < 0 ? self.startingLine : self.endingLine);
                                var iColumn = (m_iSelectionLength < 0 ? self.startingColumn : self.endingColumn);

                                if (iLine <= 0) {

                                    // Key is handled.
                                    e.stopPropagation();
                                    return null;
                                }

                                // Try to get the equivalent column in the previous line.
                                var lineWork = self.lines[iLine - 1];
                                if (lineWork.text.length >= iColumn) {

                                    if (bShift) {

                                        m_iSelectionLength -= (lineWork.text.length + 1);
                                    } else {

                                        m_iSelectionStart += m_iSelectionLength;
                                        m_iSelectionStart -= (lineWork.text.length + 1);
                                        m_iSelectionLength = 0;
                                    }
                                } else {

                                    if (bShift) {

                                        m_iSelectionLength -= (iColumn + 1);
                                    } else {

                                        m_iSelectionStart += m_iSelectionLength;
                                        m_iSelectionStart -= (iColumn + 1);
                                        m_iSelectionLength = 0;
                                    }
                                }

                                // Don't go too far.
                                if (m_iSelectionStart < 0) {

                                    m_iSelectionStart = 0;
                                }

                                // Key is handled.
                                e.stopPropagation();
                            } else if (e.which === 39) {              // Right arrow.

                                // Always want to show the cursor after a character is typed.
                                m_bShowCursor = true;

                                // Resize the selection if shift.
                                if (bShift) {

                                    // Only allow resize to continue if not off the end of the string.
                                    if (m_iSelectionStart + m_iSelectionLength < self.text.length) {

                                        m_iSelectionLength++;

                                        // If the control key is down, move across a word. 
                                        if (bCtrl) {

                                            while ((m_iSelectionStart + m_iSelectionLength < self.text.length) &&
                                                ( self.text[m_iSelectionStart + m_iSelectionLength].match(/\w/g) )) {

                                                m_iSelectionLength++;
                                            }
                                        }
                                    }
                                } else {

                                    // No shift means move the selection start.

                                    // Fix up the selection length if negative.
                                    if (m_iSelectionLength < 0) {

                                        m_iSelectionStart += m_iSelectionLength;
                                        m_iSelectionLength *= -1;
                                    }

                                    // Only move the start if narrow.
                                    if (m_iSelectionLength === 0) {

                                        // Only set the start if less than the end of the string.
                                        if (m_iSelectionStart < self.text.length) {

                                            m_iSelectionStart++;

                                            // If the control key is down, move across a word. 
                                            if (bCtrl) {

                                                while ((m_iSelectionStart < self.text.length) &&
                                                    ( self.text[m_iSelectionStart].match(/\w/g) )) {

                                                    m_iSelectionStart++;
                                                }
                                            }                                        
                                        }
                                    } else {

                                        // Snap to the right and make narrow.
                                        m_iSelectionStart += m_iSelectionLength;
                                        m_iSelectionLength = 0;
                                    }
                                }

                                // Key is handled.
                                e.stopPropagation();
                            } else if (e.which === 40) {                     // Down arrow.

                                // Convert down and up in the non-multiline case.
                                if (self.multiline === false) {

                                    // Convert to a right arrow and call into self.
                                    e.which = 39;
                                    return self.keyDown(e);
                                }

                                // Figure out where the "end of selection" marker is.
                                var iLine = (m_iSelectionLength < 0 ? self.startingLine : self.endingLine);
                                var iColumn = (m_iSelectionLength < 0 ? self.startingColumn : self.endingColumn);

                                if (iLine >= self.lines.length - 1) {

                                    // Key is handled.
                                    e.stopPropagation();
                                    return null;
                                }

                                // Try to get the equivalent column in the next line.
                                var lineWork = self.lines[iLine + 1];
                                if (lineWork.text.length >= iColumn) {

                                    var lineCurrent = self.lines[iLine];
                                    if (bShift) {

                                        m_iSelectionLength += (lineCurrent.text.length + 1);
                                    } else {

                                        m_iSelectionStart += m_iSelectionLength;
                                        m_iSelectionStart += (lineCurrent.text.length + 1);
                                        m_iSelectionLength = 0;
                                    }
                                } else {

                                    var lineCurrent = self.lines[iLine];
                                    if (bShift) {

                                        m_iSelectionLength += (lineWork.text.length + 1 + lineCurrent.text.length - iColumn);
                                    } else {

                                        m_iSelectionStart += m_iSelectionLength;
                                        m_iSelectionStart += (lineWork.text.length + 1 + lineCurrent.text.length - iColumn);
                                        m_iSelectionLength = 0;
                                    }
                                }

                                // Don't go too far.
                                if (m_iSelectionStart > self.text.length) {

                                    m_iSelectionStart > self.text.length;                                    
                                }

                                // Key is handled.
                                e.stopPropagation();
                            } else if (e.which === 13) {                    // Enter.
               
                                // Intercept the dredded enter key!

                                // Stop browser from doing what it might other wise so--that is, scroll.
                                e.stopPropagation();

                                e.which = "\n".charCodeAt(0);

                                // Call manually.
                                return self.keyPressed(e);
                            } else if (e.which === 67) {                    // c.

                                if (bCtrl || m_bCommand) {

                                    // Stop browser from doing what it might other wise so.
                                    e.stopPropagation();

                                    // Fix up the selection length if negative.
                                    if (m_iSelectionLength < 0) {

                                        m_iSelectionStart += m_iSelectionLength;
                                        m_iSelectionLength *= -1;
                                    }
                                    // Copy to clipboard.
                                    window.clipboardString = self.text.substr(m_iSelectionStart,
                                        m_iSelectionLength);
                                }
                            } else if (e.which === 86) {                    // v.

                                if (bCtrl || m_bCommand) {

                                    // Stop browser from doing what it might other wise so.
                                    e.stopPropagation();

                                    // Fix up the selection length if negative.
                                    if (m_iSelectionLength < 0) {

                                        m_iSelectionStart += m_iSelectionLength;
                                        m_iSelectionLength *= -1;
                                    }
                                    // Paste from clipboard.
                                    self.text = self.text.substr(0, 
                                            m_iSelectionStart) + 
                                        window.clipboardString + 
                                        self.text.substr(m_iSelectionStart +
                                            m_iSelectionLength);
                                    m_iSelectionStart += window.clipboardString.length;
                                    m_iSelectionLength = 0;
                                    self.possiblyAdjustScrollOffset();
                                    self.possiblyEnsureCaretVisible();
                                    self.lines = "requireFormat";
                                }
                            } else if (e.which === " ".charCodeAt(0)) {
               
                                // Intercept the dredded space key too!

                                // Stop browser from doing what it might other wise so--that is, scroll.
                                e.stopPropagation();

                                // Call manually.
                                return self.keyPressed(e);
                            }

                            return null;
                        } catch (e) {

                            return e;
                        } finally {

                            // Reset lines--to cause the next render to reformat.
                            self.lines = "requireFormat";
                        }
                    };

                    // Render object.
                    self.render = function (contextRender, bRenderBackground, areaRender) {

                        try {

                            // If render area is specified, use this
                            // to call calculateLayout if ever different.
                            if (areaRender &&
                                (m_areaLast === null || (
                                    areaRender.location.x !== m_areaLast.location.x ||
                                    areaRender.location.y !== m_areaLast.location.y ||
                                    areaRender.extent.width !== m_areaLast.extent.width ||
                                    areaRender.extent.height !== m_areaLast.extent.height
                                    ))) {

                                // Call calculate layout.
                                var exceptionRet = self.calculateLayout(areaRender, 
                                    contextRender);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }

                                // Save m_areaLast.
                                m_areaLast = areaRender;
                            }

                            // Default to true.
                            if (bRenderBackground === undefined) {

                                bRenderBackground = true;
                            }

                            // Set the font up front, before 
                            // potentially formatting lines.
                            contextRender.font = settings.general.monoSpaceFont;

                            // If lines require formatting, then format.
                            var exceptionRet = null;
                            if (self.lines == "requireFormat") {

                                if (self.multiline) {

                                    exceptionRet = m_functionFormatLines(contextRender);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                } else {

                                    self.characterWidth = contextRender.measureText("w").width;
                                    self.lines = [{ 

                                        text: self.text, 
                                        selectionStart: m_iSelectionStart, 
                                        selectionLength: m_iSelectionLength
                                    }]
                                }
                            }

                            // If scrolling, then scroll first.
                            if (m_functionScroll) {

                                // Just call it.
                                m_functionScroll();
                            }

                            // Determine if the focus element has focus.
                            var bFocused = window.manager.hasFocus(self) && 
                                !window.draggingObject;

                            // Caret should always be visible if focused.
                            if (m_bPossiblyEnsureCaretVisible) {

                                exceptionRet = m_functionEnsureCaretIsVisible();
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                                m_bPossiblyEnsureCaretVisible = false;
                            }

                            // If previously instructed, possibly adjust scroll offsets here.
                            if (m_bPossiblyAdjustScrollOffsets) {

                                // Calculate the total extent.
                                var dTotalExtent = self.getTotalExtent(contextRender);

                                // Adjust down the scroll, if necessary.
                                if (m_dScrollOffset > (dTotalExtent - self.position.extent[self.propertyAccessor])) {

                                    m_dScrollOffset = Math.max(0, 
                                        dTotalExtent - self.position.extent[self.propertyAccessor]);
                                } else if (m_dScrollOffset < 0) {

                                    m_dScrollOffset = 0;
                                }
                                m_bPossiblyAdjustScrollOffsets = false;
                            }

                            // Generate the path.
                            exceptionRet = self.position.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Draw focus recangle if highlighted and window is not dragging.
                            if ((self.highlight || bFocused) &&
                                (!window.draggingObject)) {

                                contextRender.fillStyle = settings.general.fillBackgroundHighlight;
                                contextRender.fill();
                                contextRender.strokeStyle = settings.general.strokeBackgroundHighlight;
                                contextRender.stroke();
                            } else if (bRenderBackground) {

                                contextRender.fillStyle = settings.general.fillBackground;
                                contextRender.fill();
                            }

                            // Save canvas state.
                            contextRender.save();

                            // Set clip to background shape
                            contextRender.clip();

                            var dExtent = self.getTotalExtent(contextRender);

                            // Render all the lines.
                            if (self.multiline) {

                                exceptionRet = m_functionRenderLines(contextRender,
                                    bFocused);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            } else {

                                var exceptionRet = m_functionRenderLine(contextRender,
                                    self.lines[0],
                                    bFocused,
                                    new Area(new Point(self.position.location.x - m_dScrollOffset,
                                            self.position.location.y +
                                            (self.position.extent.height - 
                                                settings.dialog.lineHeight) / 2),
                                        new Size(dExtent,
                                            settings.dialog.lineHeight)));
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            // help: for horizontal, index-zero goes to the right

                            self.scrollStubVisible[0] = false;
                            self.scrollStubVisible[1] = false;
                            // Only show scroll stubs if can scroll.
                            if (dExtent > self.position.extent[self.propertyAccessor]) {

                                // Render the scroll up region.
                                if (Math.floor(self.position.extent[self.propertyAccessor]) < Math.floor(dExtent - m_dScrollOffset)) {

                                    exceptionRet = self.scrollStubArea[1].generateRoundedRectPath(contextRender);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                    contextRender.fillStyle = settings.general.scrollStub.fillBackground;
                                    contextRender.fill();
                                    contextRender.strokeStyle = settings.general.strokeBackground;
                                    contextRender.stroke();

                                    self.scrollStubVisible[1] = true;
                                }

                                // Render the scroll down region.
                                if (m_dScrollOffset > 0) {

                                    exceptionRet = self.scrollStubArea[0].generateRoundedRectPath(contextRender);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                    contextRender.fillStyle = settings.general.scrollStub.fillBackground;
                                    contextRender.fill();
                                    contextRender.strokeStyle = settings.general.strokeBackground;
                                    contextRender.stroke();

                                    self.scrollStubVisible[0] = true;
                                }
                            }

                            // Restore original canvas state.
                            contextRender.restore();
                            
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    ///////////////////////
                    // Private methods.

                    // Scroll to ensure the caret is 
                    // visible called after a keypress.
                    var m_functionEnsureCaretIsVisible = function () {

                        try {

                            // If multiline, ensure the end-of-selection location is 
                            // visible vertically, else horizontally.
                            if (self.multiline) {

                                // Figure out where the "end of selection" marker is.
                                var iLine = (m_iSelectionLength < 0 ? self.startingLine : self.endingLine);

                                // Vertical:
                                // Calculate the y-coordinate of the line.
                                var dY = iLine * settings.dialog.lineHeight;
                                if (dY < m_dScrollOffset) {

                                    m_dScrollOffset = Math.max(0, dY);
                                    self.possiblyAdjustScrollOffset();
                                } else if (dY - m_dScrollOffset + settings.dialog.lineHeight  >= self.position.extent.height) {

                                    m_dScrollOffset = dY - self.position.extent.height + settings.dialog.lineHeight ;
                                    self.possiblyAdjustScrollOffset();
                                }
                            } else {

                                // Calculate the x-coordinate of the column.
                                var dX = Math.max(m_iSelectionStart, m_iSelectionStart + m_iSelectionLength) * self.characterWidth;
                                if (dX < m_dScrollOffset) {

                                    m_dScrollOffset = Math.max(0, dX);
                                    self.possiblyAdjustScrollOffset()
                                } else if (dX - m_dScrollOffset + self.characterWidth >= self.position.extent.width) {

                                    m_dScrollOffset = dX - self.position.extent.width + self.characterWidth;
                                    self.possiblyAdjustScrollOffset()
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Format text in lines.
                    var m_functionFormatLines = function (contextRender) {

                        try {

                            // Need to apply selection to lines 
                            // so make an updateable copy here.
                            var iLocalSelectionStart = m_iSelectionStart;
                            var iLocalSelectionLength = m_iSelectionLength;
                            if (iLocalSelectionLength < 0) {

                                iLocalSelectionStart += iLocalSelectionLength;
                                iLocalSelectionLength *= -1;
                            }

                            // Measure a character.
                            self.characterWidth = contextRender.measureText("W").width;

                            // The width of a single line.
                            var dLineWidth = self.position.extent.width - 2 * settings.general.margin;

                            // Save this for up and down key accounting.
                            self.charactersPerLine = Math.floor(dLineWidth / self.characterWidth);

                            // Split based on space.  Space characters
                            // are the only separators that matter here.
                            // CrLf's are handled in-loop differently.
                            var arrayWords = self.text.split(" ");

                            // Reset lines collection.
                            self.lines = [];

                            // Process each word.
                            var bEndLineAfterWordRegardlessOfCursor = false;
                            var strCurrentLine = "";
                            var dCursor = 0.0;
                            for (var i = 0; i < arrayWords.length; i++) {

                                // Get the next word.
                                var strWordIth = arrayWords[i];

                                // If this is not the first word, then prefix it 
                                // with a space to separate it from the rest of
                                // the words on this line.  Removed each new line.
                                if (i > 0 &&
                                    !bEndLineAfterWordRegardlessOfCursor) {

                                    strWordIth = " " + strWordIth;
                                }

                                // Does this word contain a new-line?
                                bEndLineAfterWordRegardlessOfCursor = false;
                                var iIndexOfNewLineCharacter = strWordIth.indexOf("\n");
                                if (iIndexOfNewLineCharacter !== -1) {

                                    bEndLineAfterWordRegardlessOfCursor = true;
                                    var strNextWord = strWordIth.substr(iIndexOfNewLineCharacter + 1);
                                    arrayWords.splice(i + 1, 0, strNextWord);
                                    strWordIth = strWordIth.substr(0, 
                                        iIndexOfNewLineCharacter);
                                }

                                // Measure the width of this word.
                                var dWordWidth = contextRender.measureText(strWordIth).width;

                                // Test for new line.
                                if ((dCursor + dWordWidth >= dLineWidth) &&
                                    (strCurrentLine.length > 0)) {

                                    // Add it:
                                    // This is the *normal* new-line wrap.
                                    var objectLine = {

                                        text: strCurrentLine, // Add the space because notepad does.
                                        endOfLine: 1                // Set to zero because of the space.
                                    };
                                    self.lines.push(objectLine);

                                    // Prepare for next line:

                                    // Strip off space separator from word and set as current line.
                                    strCurrentLine = strWordIth.substr(1);

                                    // Seed width of line with the current width.
                                    dCursor = contextRender.measureText(strCurrentLine).width;
                                } else {

                                    // Just keep accumulating for the current line.
                                    strCurrentLine += strWordIth;
                                    dCursor += dWordWidth;
                                }

                                // Have to check if the line is too wide here, again,
                                // because the word might be a run-on in which case
                                // it has to be broken up into multiple lines by char.
                                while (contextRender.measureText(strCurrentLine).width >= dLineWidth) {

                                    // Remove characters until the current line actually fits.
                                    var strAccumulator = strCurrentLine.substr(strCurrentLine.length - 1);
                                    strCurrentLine = strCurrentLine.substr(0, strCurrentLine.length - 1);
                                    while (contextRender.measureText(strCurrentLine).width >= dLineWidth) {

                                        strAccumulator = strCurrentLine.substr(strCurrentLine.length - 1) + strAccumulator;
                                        strCurrentLine = strCurrentLine.substr(0, strCurrentLine.length - 1);
                                    }

                                    // Add the part-word as a line:
                                    // This is the *run-on* word wrap.
                                    if (strCurrentLine.length > 0) {

                                        var objectLine = {

                                            text: strCurrentLine,
                                            endOfLine: 0
                                        };
                                        self.lines.push(objectLine);
                                    }

                                    // Prepare for next line:
                                    strCurrentLine = strAccumulator;
                                    dCursor = contextRender.measureText(strAccumulator).width;
                                }

                                // Now deal with end of line after this word--which may 
                                // have been too long as above, but must also end a line:
                                // This is the *CRLF* new-line.
                                if (bEndLineAfterWordRegardlessOfCursor) {

                                    // Add it.
                                    var objectLine = {

                                        text: strCurrentLine,
                                        endOfLine: 1
                                    };
                                    self.lines.push(objectLine);

                                    // Prepare for next line:
                                    strCurrentLine = "";
                                    dCursor = 0;
                                }
                            }

                            // Complete final line.
                            // This is the *All that's left* new-line.
                            self.lines.push({ 

                                text: strCurrentLine,
                                endOfLine: 0
                            });

                            ////////////////////
                            // Handle selection.
                            self.startingLine = -1;
                            var bHandledSelection = false;
                            for (var i = 0; i < self.lines.length; i++) {

                                // Get ith line.
                                var objectLine = self.lines[i];

                                // iLocalSelectionStart is set to -1 when the end of the selection 
                                // span has been reached and all subsequent lines should be left alone.
                                if (iLocalSelectionStart === -1) {

                                    delete objectLine.selectionStart;
                                    delete objectLine.selectionLength;
                                } else if (iLocalSelectionStart <= objectLine.text.length) {

                                    bHandledSelection = true;
                                    objectLine.selectionStart = iLocalSelectionStart;

                                    // Save for up and down arrow keys.
                                    if (self.startingLine === -1) {

                                        self.startingLine = i;
                                        self.startingColumn = objectLine.selectionStart;
                                    }

                                    // Just use the entire length--if it is too long, 
                                    // it will be adjusted on the next statement.
                                    objectLine.selectionLength = iLocalSelectionLength;

                                    // Test if the selection length is too long.
                                    if (objectLine.selectionLength > objectLine.text.length - objectLine.selectionStart) {

                                        // Adjust the selection length to just 
                                        // cover the remaining text in this line.
                                        objectLine.selectionLength = objectLine.text.length - objectLine.selectionStart;
                                    }

                                    // Here, reduce the remaining selection 
                                    // length by the width of the line.
                                    iLocalSelectionLength -= (objectLine.selectionLength + objectLine.endOfLine);

                                    // If their is no selection length 
                                    // left, then stop selecting lines
                                    // otherwise always set back to 0.
                                    if (iLocalSelectionLength <= 0) {

                                        // Stop selecting lines.
                                        // *This is where selection processing ends*.
                                        iLocalSelectionStart = -1;

                                        // Save for up and down arrow keys.
                                        self.endingLine = i;
                                        self.endingColumn = objectLine.selectionStart + objectLine.selectionLength;

                                        // If self.text[m_iSelectionStart + m_iSelectionLength - 1] = \n or [space], put a "fake" o-length cursor on the next line, if there is one.
                                        var strLastFullySelectedCharacter = self.text[m_iSelectionStart + m_iSelectionLength - 1];
                                        if ((objectLine.selectionStart + objectLine.selectionLength >= objectLine.text.length) &&
                                            (strLastFullySelectedCharacter === '\n' ||
                                            strLastFullySelectedCharacter === ' ') &&
                                            (i < self.lines.length - 1) &&
                                            (m_iSelectionLength > 0)) {

                                            self.lines[i + 1].selectionStart = 0;
                                            self.lines[i + 1].selectionLength = 0;

                                            // Save for up and down arrow keys.
                                            self.endingLine = i + 1;
                                            self.endingColumn = 0;
                                        }

                                        console.log("(" + self.startingLine + ", " + self.startingColumn + ") (" + self.endingLine + ", " + self.endingColumn + ")");

                                        break;
                                    } else {

                                        // Update the iLocalSelectionStart so that 
                                        // the next line will immediately begin.
                                        iLocalSelectionStart = 0;
                                    }
                                } else {

                                    // Lines before selection begin:
                                    // Just subtract off the length of the line's text plus the separator length
                                    // from iLocalSelectionStart (this is why the local copies exist at all).
                                    iLocalSelectionStart -= (objectLine.text.length + objectLine.endOfLine);
                                    if (iLocalSelectionStart < 0) {

                                        iLocalSelectionStart = 0;
                                    }
                                }
                            }

                            // Process selection start point.
                            var iStartIndex = 0;
                            for (var i = 0; i < self.lines.length; i++) {

                                var lineIth = self.lines[i];
                                lineIth.startIndex = iStartIndex;
                                iStartIndex += (lineIth.endOfLine + lineIth.text.length);
                            }

                            return null;
                        } catch(e) {

                            return e;
                        }
                    };

                    // Method invoked to change blink state and cause re-draw.
                    var m_functionBlinkTimerTick = function () {

                        try {

                            if (self.protected) {

                                return;
                            }

                            // Invert the cursor.
                            if (m_bShowCursor) {

                                m_bShowCursor = false;
                            } else {

                                m_bShowCursor = true;
                            }
                        } catch(e) {

                            alert(e.message);
                        }
                    };

                    // Render each line--either focused or not.
                    var m_functionRenderLines = function (contextRender, bFocused) {

                        try {

                            if (!bFocused) {

                                // If the timer is going, then stop it.
                                if (m_cookieBlinkTimer) {

                                    // Do startup work.
                                    clearInterval(m_cookieBlinkTimer);
                                    m_cookieBlinkTimer = null;
                                }
                            } else {

                                // If the timer is not going, then start it.
                                if (!m_cookieBlinkTimer) {

                                    // Start off showing.
                                    m_bShowCursor = true && (!self.protected);

                                    // Do startup work.
                                    m_cookieBlinkTimer = setInterval(m_functionBlinkTimerTick,
                                        settings.general.blinkMS);
                                }
                            }

                            // Loop over each line.
                            for (var i = 0; i < self.lines.length; i++) {

                                // Get the ith line.
                                var objectLine = self.lines[i];
                                var exceptionRet = m_functionRenderLine(contextRender,
                                    objectLine,
                                    bFocused,
                                    new Area(new Point(self.position.location.x - (!self.multiline ? m_dScrollOffset : 0),
                                                self.position.location.y + 
                                                i * settings.dialog.lineHeight - 
                                                (self.multiline ? m_dScrollOffset : 0)),
                                        new Size(self.position.extent.width,
                                            settings.dialog.lineHeight)));
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Render a line--either focused or not.
                    var m_functionRenderLine = function (contextRender, objectLine, bFocused, areaRender) {

                        try {

                            // Render line with focus or not.
                            if (bFocused) {

                                var strBefore = null;
                                var strDuring = null;
                                var strAfter = null;
                                var dStartOffset = 0;
                                var dLengthOffset = 0;

                                if (objectLine.selectionStart === undefined) {

                                    contextRender.fillStyle = settings.general.fillText;
                                    contextRender.fillText(objectLine.text,
                                        areaRender.location.x + settings.general.margin,
                                        areaRender.location.y,
                                        areaRender.extent.width - 2 * settings.general.margin);
                                    return null;
                                }

                                // Invert the selection if already negative, but don't
                                // update object state as it would cause problems....
                                var iStart = objectLine.selectionStart;
                                var iLength = objectLine.selectionLength;
                                if (objectLine.selectionLength === undefined) {

                                    iLength = 0;
                                }
                                if (iLength < 0) {

                                    iStart += iLength;
                                    iLength *= -1;
                                }

                                // Figure out the position of the beginning and end of the selection.
                                strBefore = objectLine.text.substr(0,
                                    iStart);
                                strDuring = objectLine.text.substr(iStart,
                                    iLength);
                                strAfter = objectLine.text.substr(iStart + iLength);

                                dStartOffset = contextRender.measureText(strBefore).width;
                                dLengthOffset = contextRender.measureText(strDuring).width;

                                // If selecting a region, then color differently to instruct the user.
                                if (m_bShowCursor ||
                                    m_iSelectionLength !== 0) {
               
                                    contextRender.fillStyle = "rgba(0,0,0,0.7)";
                                    contextRender.fillRect(areaRender.location.x + settings.general.margin + dStartOffset - 1,
                                        areaRender.location.y + 0.5 * settings.general.margin,
                                        dLengthOffset + 2,
                                        areaRender.extent.height - settings.general.margin);
                                }

                                // Render the normal label.
                                contextRender.fillStyle = "#000";
                                contextRender.fillText(strBefore,
                                    areaRender.location.x + settings.general.margin,
                                    areaRender.location.y);
                                contextRender.fillText(strAfter,
                                    areaRender.location.x + settings.general.margin + dStartOffset + dLengthOffset,
                                    areaRender.location.y);

                                // Now render the selected label.
                                contextRender.fillStyle = "#fff";
                                contextRender.fillText(strDuring,
                                    areaRender.location.x + settings.general.margin + dStartOffset,
                                    areaRender.location.y);
                            } else {

                                // Now render the line.
                                contextRender.fillStyle = settings.general.fillText;
                                contextRender.fillText(objectLine.text,
                                    areaRender.location.x + settings.general.margin,
                                    areaRender.location.y,
                                    areaRender.extent.width - 2 * settings.general.margin);
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    ////////////////////////////
                    // Private fields.

                    // How far the tree is scrolled.
                    var m_dScrollOffset = 0;
                    // Start of the selection.
                    var m_iSelectionStart = 0;
                    // Selection length.
                    var m_iSelectionLength = 0;
                    // Indicates that the cursor should be shown.
                    var m_bShowCursor = true;
                    // The blink timer cookie.
                    var m_cookieBlinkTimer = null;
                    // Scroll callback--set for up or down when cursor over stub.
                    var m_functionScroll = null;
                    // Update the scroll offset if necessary.
                    var m_bPossiblyAdjustScrollOffsets = false;
                    // Update caret visiblity on next render.
                    var m_bPossiblyEnsureCaretVisible = false;
                    // Cached Area for Edits which are passed an Area 
                    // in render--to minimally call calculateLayout.
                    var m_areaLast = null;
                    // Time of the previous last click--used to calculate triple-click.
                    var m_iLastLast = 0;
                    // Time of the last click--used to calculate double-click.
                    var m_iLast = 0;
                    // Indicates that the OSX command key is down.
                    var m_bCommand = false;
                } catch (e) {

                    alert(e.message);
                }
        	};

            // Inherit from Control.  Wire 
            // up prototype chain to Control.
            functionRet.inheritsFrom(Control);

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
