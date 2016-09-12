///////////////////////////////////////
// GlyphHost module.
//
// Hosts a Glyph.
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
    "NextWave/source/utility/Control",
    "NextWave/source/utility/glyphs"],
    function (prototypes, settings, Point, Size, Area, Control, glyphs) {

        try {

            // Constructor function.
        	var functionRet = function GlyphHost(objectParameters) {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from Control.  Call parent Control
                    // constructor.  Pass parameters, if specified.
                    self.inherits(Control);

                    ///////////////////////
                    // Public fields.

                    // Indicates so.
                    self.highlight = false;
                    // The hosted object.
                    self.glyph = glyphs[objectParameters];

                    ///////////////////////
                    // Public methods.

                    // Render object.
                    self.render = function (contextRender) {

                        // Render Glyph.
                        return glyphs.render(contextRender,
                            self.position,
                            self.glyph,
                            settings.manager.showIconBackgrounds);
                    };

                    // Pass to payload.
                    self.mouseMove = function (objectReference) {

                        objectReference.cursor = "cell";
                        return null;
                    };

                    // Pass to payload.
                    self.click = function (objectReference) {

                        if ($.isFunction(self.configuration.clickHandler)) {

                            return self.configuration.clickHandler(objectReference);
                        }
                        return null;
                    };
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
