///////////////////////////////////////
// Picture module.
//
// Holds information for locating and displaying an image.
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
        	var functionRet = function Picture(url) {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from Control.  Call parent Control
                    // constructor.  Pass parameters, if specified.
                    self.inherits(Control);

                    ///////////////////////
                    // Public fields.

                    // Content.
                    self.url = url || null;

                    ///////////////////////
                    // Public methods.

                    // Inner clear data.
                    self.innerClear = function () {

                        // Do nothing, images are static.
                        return null;
                    };

					// If we weren't able to set constructorParameterString when declaring the Picture:
                    self.setUrl = function (url) {

                        self.url = url;
                        return self.recreate();
                    }

                    // Inner load.
                    self.innerCreate = function () {

                        m_bCreated = false;
                        if (!self.url) {
                            return null;
                        }

                        m_image = new Image();
                        m_image.onload = function() {

                            // Mark created.
                            m_bCreated = true;
                        }
                        m_image.src = self.url;
                        return null;
                    };

                    // Render object.
                    self.render = function (contextRender) {

                        try {

                            if (!m_bCreated) {

                                // m_image isn't ready yet.
                                return;
                            }

                            // Generate the path.
                            var exceptionRet = self.position.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            try {

                                contextRender.save();
                                contextRender.clip();
                                contextRender.drawImage(m_image,
                                    self.position.location.x,
                                    self.position.location.y,
                                    self.position.extent.width,
                                    self.position.extent.height);
                            } finally {

                                contextRender.restore();
                            }

/*                            // If border, render border.
                            if (self.configuration.border) {


                                contextRender.fill();
                                contextRender.stroke();
                            }
*/
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    //////////////////////////
                    // Private fields.

                    var m_image = null;
                    var m_bCreated = false;

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
