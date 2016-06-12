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

                    // Reset format.
                    self.innerCalculateLayout = function (areaMaximal, contextRender) {

                        try {

                            // Reset lines--to cause the next render to reformat.
                            self.lines = "requireFormat";

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

                            // Reset lines--to cause the next render to reformat.
                            self.lines = "requireFormat";

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
                            } else if (e.which === 13) {
               
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
                        }
                    };

                    // Render object.
                    self.render = function (contextRender) {

                        try {

                            // Set the font up front, before 
                            // potentially formatting lines.
                            contextRender.font = settings.general.font;

                            // If lines require formatting, then format.
                            var exceptionRet = null;
                            if (self.lines == "requireFormat") {

                                exceptionRet = m_functionFormatLines(contextRender);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }

                            // Generate the path.
                            var exceptionRet = self.position.generateRoundedRectPath(contextRender);
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

                            // Determine if the focus element has focus.
                            var bFocused = window.manager.hasFocus(self);

                            // Render all the lines.
                            return m_functionRenderLines(contextRender,
                                bFocused);
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

                            // Measure a space.
                            var dSpaceWidth = contextRender.measureText(" ").width;

                            // The width of a single line.
                            var dLineWidth = self.position.extent.width - 2 * settings.general.margin;

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
                                if (dCursor + dWordWidth >= dLineWidth) {

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
                                    var objectLine = {

                                        text: strCurrentLine,
                                        endOfLine: 0
                                    };
                                    self.lines.push(objectLine);

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

                            ////////////////////
                            // Handle selection.
                            for (var i = 0; i < self.lines.length; i++) {

                                // Get ith line.
                                var objectLine = self.lines[i];

                                // iLocalSelectionStart is set to -1 when the end of the selection 
                                // span has been reached and all subsequent lines should be left alone.
                                if (iLocalSelectionStart === -1) {

                                    delete objectLine.selectionStart;
                                    delete objectLine.selectionLength;
                                } else if (iLocalSelectionStart <= objectLine.text.length) {

                                    objectLine.selectionStart = iLocalSelectionStart;

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

                                        // If self.text[m_iSelectionStart + m_iSelectionLength - 1] = \n or [space], put a "fake" o-length cursor on the next line, if there is one.
                                        var strLastFullySelectedCharacter = self.text[m_iSelectionStart + m_iSelectionLength - 1];
                                        if ((strLastFullySelectedCharacter === '\n' ||
                                            strLastFullySelectedCharacter === ' ') &&
                                            (i < self.lines.length - 1) &&
                                            (m_iSelectionLength > 0)) {

                                            self.lines[i + 1].selectionStart = 0;
                                            self.lines[i + 1].selectionLength = 0;
                                        }

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
                                    new Area(new Point(self.position.location.x,
                                            self.position.location.y + i * settings.dialog.lineHeight),
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

                    // Start of the selection.
                    var m_iSelectionStart = 0;
                    // Selection length.
                    var m_iSelectionLength = 0;
                    // Indicates that the cursor should be shown.
                    var m_bShowCursor = true;
                    // The blink timer cookie.
                    var m_cookieBlinkTimer = null;
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
