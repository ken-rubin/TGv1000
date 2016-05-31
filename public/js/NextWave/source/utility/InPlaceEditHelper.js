///////////////////////////////////////
// InPlaceEditHelper module.
//
// Instance added to a GUI module will help 
// enable in-place editing with minimal effort.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/settings"],
    function (prototypes, settings) {

        try {

            // Constructor function.
        	var functionRet = function InPlaceEditHelper(owner, strPayloadElement, strFocusElement) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // The GUI element in place edited.
                    self.owner = owner;
                    // The name of the "payload element".
                    self.payloadElement = strPayloadElement || "payload";
                    // The name of the "payload element".
                    self.focusElement = strFocusElement || "collection";

                    ///////////////////////
                    // Public methods.

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
                            if (e.which >= " ".charCodeAt(0) &&
                                e.which <= "~".charCodeAt(0)) {

                                // Only update if length less than max.
                                if (self.owner[self.payloadElement].length < settings.general.maximumCharacters) {
               
                                    // Fix up the selection length if negative.
                                    if (m_iSelectionLength < 0) {

                                        m_iSelectionStart += m_iSelectionLength;
                                        m_iSelectionLength *= -1;
                                    }

                                    // Set the value to three parts: the range before the selection, the character typed and the part after the selection.
                                    self.owner[self.payloadElement] = self.owner[self.payloadElement].substr(0, m_iSelectionStart) +
                                        String.fromCharCode(e.which) +
                                        self.owner[self.payloadElement].substr(m_iSelectionStart + m_iSelectionLength);
               
                                    // Move the selection over one place and ensure narrow selection.
                                    m_iSelectionStart++;
                                    m_iSelectionLength = 0;
                                }
                            }

                            // If not defined, then don't call.
                            if (!$.isFunction(self.owner.afterChange)) {

                                return null;
                            }

                            // Let derived class do something  
                            // after handling the key press.
                            return self.owner.afterChange();
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

                            if ($.isFunction(self.owner.beforeChange)) {

                                exceptionRet = self.owner.beforeChange();
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
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
                            if (e.which === 8) {

                                // Fix up the selection length if negative.
                                if (m_iSelectionLength < 0) {

                                    m_iSelectionStart += m_iSelectionLength;
                                    m_iSelectionLength *= -1;
                                }

                                // If there is a selection to clear out, then do so.
                                if (m_iSelectionLength > 0) {

                                    // Set the cell value to the un-selected ranges before and after the selection.
                                    self.owner[self.payloadElement] = self.owner[self.payloadElement].substr(0,
                                        m_iSelectionStart) + self.owner[self.payloadElement].substr(m_iSelectionStart + m_iSelectionLength);

                                    // Reset the selection length after delete complete.
                                    m_iSelectionLength = 0;
                                } else {

                                    // Process normal overwriting backspace: erase the character just before the (narrow) selection start.
                                    if (m_iSelectionStart > 0) {

                                        // Set the cell value to the range before the selection - 1 and after the selection.
                                        self.owner[self.payloadElement] = self.owner[self.payloadElement].substr(0,
                                            m_iSelectionStart - 1) + self.owner[self.payloadElement].substr(m_iSelectionStart);

                                        // Move the selection back one place.
                                        m_iSelectionStart--;
                                    }
                                }

                                // If defined, call.
                                if ($.isFunction(self.owner.afterChange)) {

                                    // Let derived class do something  
                                    // after handling the key press.
                                    var exceptionRet = self.owner.afterChange();
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }
                                }

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
                                    self.owner[self.payloadElement] = self.owner[self.payloadElement].substr(0,
                                        m_iSelectionStart) + self.owner[self.payloadElement].substr(m_iSelectionStart + m_iSelectionLength);

                                    // Reset the selection length after delete complete.
                                    m_iSelectionLength = 0;
                                }

                                // Let derived class do something  
                                // after handling the key press.
                                // If defined, call.
                                if ($.isFunction(self.owner.afterChange)) {

                                    // Let derived class do something  
                                    // after handling the key press.
                                    var exceptionRet = self.owner.afterChange();
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }
                                }

                                // Cause a render since this is a handled key.
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

                                // Cause a render since this is a handled key.
                                e.stopPropagation();
                            } else if (e.which === 39) {              // Right arrow.

                                // Always want to show the cursor after a character is typed.
                                m_bShowCursor = true;

                                // Resize the selection if shift.
                                if (bShift) {

                                    // Only allow resize to continue if not off the end of the string.
                                    if (m_iSelectionStart + m_iSelectionLength < self.owner[self.payloadElement].length) {

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
                                        if (m_iSelectionStart < self.owner[self.payloadElement].length) {

                                            m_iSelectionStart++;
                                        }
                                    } else {

                                        // Snap to the right and make narrow.
                                        m_iSelectionStart += m_iSelectionLength;
                                        m_iSelectionLength = 0;
                                    }
                                }

                                // Cause a render since this is a handled key.
                                e.stopPropagation();
                            } else if (e.which === " ".charCodeAt(0)) {
               
                                // Intercept the dredded space key!

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

                    // Render out this type.
                    self.render = function (contextRender, areaRender, functionNonFocused) {

                        try {

                            // Determine if the focus element has focus to determine 
                            // whether or not to defer to the non-focused callback.
                            var bFocused = false;

                            // If self, don't access property.
                            if (self.focusElement === "self") {

                                bFocused = window.manager.hasFocus(self.owner);
                            } else {

                                bFocused = window.manager.hasFocus(self.owner[self.focusElement]);
                            }

                            // Render the selection if focused...
                            if (bFocused) {

                                var strBefore = null;
                                var strDuring = null;
                                var strAfter = null;
                                var dStartOffset = 0;
                                var dLengthOffset = 0;

                                // If the timer is not going, then start it.
                                if (!m_cookieBlinkTimer) {

                                    // Start off showing.
                                    m_bShowCursor = true;   

                                    // Select all text.
                                    m_iSelectionStart = 0;
                                    m_iSelectionLength = self.owner[self.payloadElement] ? self.owner[self.payloadElement].length : 0;                                 

                                    // Do startup work.
                                    m_cookieBlinkTimer = setInterval(m_functionBlinkTimerTick,
                                        settings.general.blinkMS);
                                }

                                // Invert the selection if already negative, but don't
                                // update object state as it would cause problems....
                                var iStart = m_iSelectionStart;
                                var iLength = m_iSelectionLength;
                                if (iLength < 0) {

                                    iStart += iLength;
                                    iLength *= -1;
                                }

                                // Figure out the position of the beginning and end of the selection.
                                strBefore = self.owner[self.payloadElement].substr(0,
                                    iStart);
                                strDuring = self.owner[self.payloadElement].substr(iStart,
                                    iLength);
                                strAfter = self.owner[self.payloadElement].substr(iStart + iLength);

                                dStartOffset = contextRender.measureText(strBefore).width;
                                dLengthOffset = contextRender.measureText(strDuring).width;
                                var dNominalLength = contextRender.measureText(self.owner[self.payloadElement]).width;

                                // Get the total, normal width of the string -> dNominalWidth.
                                // If dNominalWidth > maxWidth:
                                // Calculate the ratio:
                                // maxWidth / dNominalWidth -> dRatio
                                // There are two critical points:
                                // dStartOffset * dRatio -> dStartOffset, dLengthOffset * dRatio -> dLengthOffset.
                                // These new offsets can be used to calculate fillText max render widths.
                                // Only specify a max render width if maxWidth is set.
                                if (self.owner.maxWidth) {

                                    if (dNominalLength > areaRender.extent.width - 2 * settings.general.margin) {

                                        var dRatio = (areaRender.extent.width - 2 * settings.general.margin) / dNominalLength;
                                        dStartOffset *= dRatio;
                                        dLengthOffset *= dRatio;
                                        dNominalLength *= dRatio;
                                    }
                                }

                                // If selecting a select cell, then color differently to instruct the user.
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
                                    areaRender.location.y,
                                    dStartOffset);
                                contextRender.fillText(strAfter,
                                    areaRender.location.x + settings.general.margin + dStartOffset + dLengthOffset,
                                    areaRender.location.y,
                                    dNominalLength - (dLengthOffset + dStartOffset));

                                // Now render the selected label.
                                contextRender.fillStyle = "#fff";
                                contextRender.fillText(strDuring,
                                    areaRender.location.x + settings.general.margin + dStartOffset,
                                    areaRender.location.y,
                                    dLengthOffset);
                            } else {

                                // If the timer is going, then stop it.
                                if (m_cookieBlinkTimer) {

                                    // Do startup work.
                                    clearInterval(m_cookieBlinkTimer);
                                    m_cookieBlinkTimer = null;
                                }

                                // Call the non-focus callback, if specified.
                                if ($.isFunction(functionNonFocused)) {

                                    return functionNonFocused();
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    ///////////////////////
                    // Private methods.

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

                    ///////////////////////
                    // Private fields.

                    // Start of the selection.
                    var m_iSelectionStart = 0;
                    // Selection length.
                    var m_iSelectionLength = 0;
                    // Indicates that the cursor should be shown.
                    var m_bShowCursor = true;
                    // The blink timer cookie.
                    var m_cookieBlinkTimer = null;

                    ///////////////////////
                    // Perform owner injection!

                    self.owner.keyDown = self.keyDown;
                    self.owner.keyPressed = self.keyPressed;
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
