///////////////////////////////////////
// LayerBackground module.
//
// Displays background bitmap.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/settings",
    "NextWave/source/utility/Area",
    "NextWave/source/utility/Point",
    "NextWave/source/utility/Size",
    "NextWave/source/manager/Layer"],
    function (prototypes, settings, Area, Point, Size, Layer) {

        try {

            // Constructor function.
        	var functionRet = function LayerBackground() {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from base class.
                    self.inherits(Layer);

                    ////////////////////////
                    // Public methods.

                    // Initialze instance.
                    self.create = function () {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "Instance already created!" };
                            }

                            // Load up background image.
                            m_imageBackground = new Image();
                            m_imageBackground.onload = m_functionBackgroundImageLoaded;
                            var i = Math.floor(Math.random() * 8);
                            m_imageBackground.src = settings.background.imageURLs[i];

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Render out the layer.
                    self.render = function (contextRender, iMS) {
                        
                        try {

                            // Render the background by way of clearing the canvas.
                            if (m_bCreated) {

                                contextRender.drawImage(m_imageBackground,
                                    Math.max((m_imageBackground.width - self.extent.width) / 2, 0),
                                    Math.max((m_imageBackground.height - self.extent.height) / 2, 0),
                                    Math.min(self.extent.width, m_imageBackground.width),
                                    Math.min(self.extent.height, m_imageBackground.height),
                                    0, 
                                    0,
                                    self.extent.width,
                                    self.extent.height);
                            }
                            return null;
                        } catch (e) {
                            
                            return e;
                        }
                    };

                    //////////////////////////
                    // Private methods.

                    // Continuation of create, after the background image is loaded.
                    var m_functionBackgroundImageLoaded = function () {

                        try {

                            // Because it is!
                            m_bCreated = true;
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    //////////////////////////
                    // Private fields.

                    // Indicates this instance is already created.
                    var m_bCreated = false;
                    // Background image.
                    var m_imageBackground = null;
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
