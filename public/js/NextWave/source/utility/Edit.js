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
        	var functionRet = function Edit() {

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
                    self.text = "";
                    // Either the token: "requireFormat", or an array of lines.
                    self.lines = "requireFormat";
                    // Indicates that the corresponding scroll stud is visible--set in render.
                    self.scrollStubVisible = [false, false];
                    // Indicates that the corresponding scroll stud is visible--set in render.
                    self.scrollStubArea = [null, null];
                    // Indicates how things are measured and how they scroll.
                    self.vertical = true;
                    // Access this property based on orientation.
                    self.propertyAccessor = (self.vertical ? "height" : "width");
                    // Access this method based on orientation.
                    self.methodAccessor = (self.vertical ? "getHeight" : "getWidth");
                    // Access scroll cursor based on orientation.
                    self.scrollCursor = [(self.vertical ? "n-resize" : "w-resize"),
                        (self.vertical ? "s-resize" : "e-resize")];

                    ///////////////////////
                    // Public methods.

                    // Get the text in this control.
                    self.getText = function () {

                        return self.text;
                    };

                    // Set the text in this control.
                    self.setText = function (strText) {

                        try {

                            // Store the information.
                            self.text = strText;

                            // Reset lines--to cause the next render to reformat.
                            self.lines = "requireFormat";

                            m_iSelectionStart = 0;
                            m_iSelectionLength = self.text.length;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method calculates usable total extent of list.
                    self.getTotalExtent = function (contextRender) {

                        if (self.vertical) {

                            // Sum each line.
                            if (self.lines === "requireFormat") {

                                return 0;
                            }
                            return settings.dialog.lineHeight * self.lines.length;
                        } else {

                            return contextRender.measureText(self.text).width;                            
                        }
                    };

                    // Reset format.
                    self.innerCalculateLayout = function (areaMaximal, contextRender) {

                        try {

                            // Reset lines--to cause the next render to reformat.
                            self.lines = "requireFormat";

                            if (self.vertical) {

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

                    // Inner clear data.
                    self.innerClear = function () {

                        self.lines = [];
                        return null;
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

                                    // Calculate the total height.
                                    var dTotalExtent = self.getTotalExtent(objectReference.contextRender);

                                    // Set the scroll function to "down".
                                    m_functionScroll = function () {

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
                            var strDeltaAccessor = (self.vertical ? "deltaY" : "deltaY");

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

                    // Expose private field.
                    self.scrollOffset = function () {

                        return m_dScrollOffset;
                    };

                    // Handle the keypress, either backspace, delete, or normal keys.
                    self.keyPressed = function (e) {

                        try {

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

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Handle key-down to pre-process for tab and backspace keys.
                    // Funnells other requests off to handleKeyPress to process.
                    self.keyDown = function (e) {

                        try {

                            // Let derived class do something  
                            // before handling the key press.
                            var exceptionRet = null;

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
                            if (e.which === 8) {

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

                                // If there is a selection to clear out, then do so.
                                if (m_iSelectionLength > 0) {

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
                                    // But do, incidentally, allow negative lengths.
                                    if (m_iSelectionStart + m_iSelectionLength > 0) {

                                        m_iSelectionLength--;
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
                                    } else {

                                        // If the selection is wide, then make it narrow before moving selection.
                                        m_iSelectionLength = 0;
                                    }
                                }

                                // Key is handled.
                                e.stopPropagation();
                            } else if (e.which === 38) {                     // Up arrow.

                                // Figure out where the "end of selection" marker is.
                                var iLine = (m_iSelectionLength < 0 ? self.startingLine : self.endingLine);
                                var iColumn = (m_iSelectionLength < 0 ? self.startingColumn : self.endingColumn);

                                if (iLine === 0) {

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

                                        m_iSelectionStart -= (lineWork.text.length + 1 - m_iSelectionLength);
                                        m_iSelectionLength = 0;
                                    }
                                } else {

                                    if (bShift) {

                                        m_iSelectionLength -= (iColumn + 1);
                                    } else {

                                        m_iSelectionStart -= (iColumn + 1);
                                        m_iSelectionLength = 0;
                                    }
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
                                    }
                                } else {

                                    // No shift means move the selection start.

                                    // Fix up the selection length if negative.
                                    if (m_iSelectionLength < 0) {

                                        m_iSelectionStart += m_iSelectionLength;
                                        m_iSelectionLength *= -1;
                                    }

                                    // Only move the selection if narrow.
                                    if (m_iSelectionLength === 0) {

                                        // Only set the start if less than the end of the string.
                                        if (m_iSelectionStart < self.text.length) {

                                            m_iSelectionStart++;
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

                                // Figure out where the "end of selection" marker is.
                                var iLine = (m_iSelectionLength < 0 ? self.startingLine : self.endingLine);
                                var iColumn = (m_iSelectionLength < 0 ? self.startingColumn : self.endingColumn);

                                if ((iLine >= self.lines.length - 1) ||
                                    ((!bShift) &&
                                        (iLine === self.lines.length - 2) && 
                                        (self.lines[self.lines.length - 1].text.length === 0))) {  // -2 because there is technically always an extra line, but it is only accessible in certain circumstances.

                                    // Key is handled.
                                    e.stopPropagation();
                                    return null;
                                }

                                // Try to get the equivalent column in the previous line.
                                var lineWork = self.lines[iLine + 1];
                                if (lineWork.text.length >= iColumn) {

                                    var lineCurrent = self.lines[iLine];
                                    if (bShift) {

                                        m_iSelectionLength += (lineCurrent.text.length + 1);
                                    } else {

                                        m_iSelectionStart += (lineCurrent.text.length + 1 - m_iSelectionLength);
                                        m_iSelectionLength = 0;
                                    }
                                } else {

                                    var lineCurrent = self.lines[iLine];
                                    if (bShift) {

                                        m_iSelectionLength += (lineWork.text.length + 1 + lineCurrent.text.length - iColumn);
                                    } else {

                                        m_iSelectionStart += (lineWork.text.length + 1 + lineCurrent.text.length - iColumn);
                                        m_iSelectionLength = 0;
                                    }
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
                    self.render = function (contextRender) {

                        try {

                            // Set the font up front, before 
                            // potentially formatting lines.
                            contextRender.font = settings.general.monoSpaceFont;

                            // If lines require formatting, then format.
                            var exceptionRet = null;
                            if (self.lines == "requireFormat") {

                                exceptionRet = m_functionFormatLines(contextRender);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }

                            // If scrolling, then scroll first.
                            if (m_functionScroll) {

                                // Just call it.
                                m_functionScroll();
                            }

                            // If previously instructed, possibly adjust scroll offsets here.
                            if (m_bPossiblyAdjustScrollOffsets) {

                                // Calculate the total extent.
                                var dTotalExtent = self.getTotalExtent(contextRender);

                                // Adjust down the scroll, if necessary.
                                if (m_dScrollOffset > (dTotalExtent - self.position.extent[self.propertyAccessor])) {

                                    m_dScrollOffset = Math.max(0, 
                                        dTotalExtent - self.position.extent[self.propertyAccessor]);
                                }
                            }

                            // Generate the path.
                            exceptionRet = self.position.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Draw focus recangle if highlighted.
                            if (self.highlight) {

                                contextRender.fillStyle = settings.general.fillBackgroundHighlight;
                                contextRender.fill();
                                contextRender.strokeStyle = settings.general.strokeBackgroundHighlight;
                                contextRender.stroke();
                            } else {

                                contextRender.fillStyle = settings.general.fillBackground;
                                contextRender.fill();
                            }

                            // Save canvas state.
                            contextRender.save();

                            // Set clip to background shape
                            contextRender.clip();

                            // Determine if the focus element has focus.
                            var bFocused = window.manager.hasFocus(self);

                            // Render all the lines.
                            exceptionRet = m_functionRenderLines(contextRender,
                                bFocused);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            var dCursor = self.getTotalExtent();

                            self.scrollStubVisible[0] = false;
                            self.scrollStubVisible[1] = false;
                            // Only show scroll stubs if can scroll.
                            if (dCursor + m_dScrollOffset > self.position.extent[self.propertyAccessor]) {

                                // Render the scroll up region.
                                if (Math.floor(self.position.extent[self.propertyAccessor]) < Math.floor(dCursor)) {

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
                            var dCharacterWidth = contextRender.measureText("W").width;

                            // The width of a single line.
                            var dLineWidth = self.position.extent.width - 2 * settings.general.margin;

                            // Save this for up and down key accounting.
                            self.charactersPerLine = Math.floor(dLineWidth / dCharacterWidth);

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
                            if (strCurrentLine.length > 0) {

                                // This is the *All that's left* new-line.
                                self.lines.push({ 

                                    text: strCurrentLine,
                                    endOfLine: 0
                                });
                            }

                            // Always add one extra line for the "last line is blank"-case.
                            self.lines.push({ 

                                text: "",
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

                            return null;
                        } catch(e) {

                            return e;
                        }
                    };

                    // Method invoked to change blink state and cause re-draw.
                    var m_functionBlinkTimerTick = function () {

                        try {

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
                                    m_bShowCursor = true;   

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
                                    new Area(new Point(self.position.location.x - (!self.vertical ? m_dScrollOffset : 0),
                                            self.position.location.y + i * settings.dialog.lineHeight - (self.vertical ? m_dScrollOffset : 0)),
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
