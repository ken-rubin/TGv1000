/////////////////////////
// Debug layer.
//
// Displays debugging information.  
// For now, just frames per second.
//
// Return constructor function.

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/settings",
    "NextWave/source/utility/Point",
    "NextWave/source/manager/Layer"],
    function (prototypes, settings, Point, Layer) {

        try {

            // Constructor function.
        	var functionRet = function LayerDebug() {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from base class.
                    self.inherits(Layer);

                    ////////////////////////
                    // Public methods.

                    // Take mouse move--set handled in reference object if handled.
                    self.innerMouseMove = function (objectReference) {

                        m_pointCursor = new Point(objectReference.event.offsetX,
                            objectReference.event.offsetY);
                        return null;
                    };

                    // Render out the layer.
                    self.innerRender = function (contextRender, iMS) {
                        
                        try {

                        	// Calculate FPS.
                            var dTotalNumberOfSeconds = 0.0;
                            if (m_iFirstRender == -1) {

                                m_iFirstRender = iMS;
                            } else {

                                dTotalNumberOfSeconds = (iMS - m_iFirstRender) / 1000.0;
                            }
                            m_iRenderCount++;
                            var dFramesPerSecond = m_iRenderCount / dTotalNumberOfSeconds;

                            // Output mouse coordinates and size and FPS.
                            contextRender.font = settings.manager.fontDebug;
                            contextRender.strokeStyle = settings.manager.debugBackgroundStroke;
                            contextRender.fillStyle = settings.manager.debugBackgroundFill;
                            contextRender.fillRect(self.extent.width - 150, self.extent.height - 78,
                                142, 74);
                            contextRender.strokeRect(self.extent.width - 150, self.extent.height - 78,
                                142, 74);
                            contextRender.fillStyle = settings.manager.debugFill;
                            contextRender.fillText("FPS: " + dFramesPerSecond.toFixed(3),
                                self.extent.width - 148,
                                self.extent.height - 74);
                            contextRender.fillText("(" + m_pointCursor.x.toFixed(0) + "," +
                                m_pointCursor.y.toFixed(0) + ")",
                                self.extent.width - 148,
                                self.extent.height - 52);
                            contextRender.fillText("[" + self.extent.width.toFixed(0) + "," +
                                self.extent.height.toFixed(0) + "]",
                                self.extent.width - 148,
                                self.extent.height - 30);

                            return null;
                        } catch (e) {
                            
                            return e;
                        }
                    };

                    //////////////////////////
                    // Private fields.

                    // Remember the number of times render is called.
                    var m_iRenderCount = 0;
                    // Remember the first date when render was called.
                    var m_iFirstRender = -1;
                    // Location of cursor.
                    var m_pointCursor = new Point(0, 0);
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
