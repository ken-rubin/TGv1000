///////////////////////////////////////
// LayerCanvas module.
//
// Displays runtime VisualObjects.
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
        	var functionRet = function LayerCanvas() {

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

                                throw { message: "LayerCanvas: Instance already created!" };
                            }

                            // Disable this layer until running.
                            self.active = false;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Render out the layer.
                    self.innerRender = function (contextRender, iMS) {
                        
                        try {

                            // Save state of rendering context.
                            contextRender.save();

                            // Calculate the mid-point and translate.
                            var dMidX = self.extent.width / 2;
                            var dMidY = self.extent.height / 2;

                            contextRender.translate(dMidX,
                                dMidY);

                            // Loop over tg namespace, looking for visual objects.
                            var arrayInstances = window.tg.instances;

                            for (var i = 0; i < arrayInstances.length; i++) {

                                // Extract instance.
                                var instanceIth = arrayInstances[i];

                                // Just continue if it is not visual.
                                if (!window.tg ||
                                    !window.tg.VisualObject ||
                                    !(instanceIth instanceof window.tg.VisualObject)) {

                                    continue;
                                }

                                // Else, render.
                                contextRender.fillStyle = "Blue";
                                contextRender.fillRect(instanceIth.x, 
                                    instanceIth.y, 
                                    instanceIth.width, 
                                    instanceIth.height);
                            }

                            return null;
                        } catch (e) {
                            
                            return e;
                        } finally {

                            contextRender.restore();
                        }
                    };

                    //////////////////////////
                    // Private fields.

                    // Indicates this instance is already created.
                    var m_bCreated = false;
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
