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
                    self.mouseMove = function (objectReference) {

                        m_pointCursor = new Point(objectReference.event.offsetX,
                            objectReference.event.offsetY);
                        return null;
                    };

                    // Render out the layer.
                    self.render = function (contextRender, iMS) {
                        
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

                            // Output FPS.
                            contextRender.fillStyle = settings.manager.debugBackgroundFill;
                            contextRender.strokeStyle = settings.manager.debugBackgroundStroke;
                            contextRender.fillRect(8,10,140,24);
                            contextRender.strokeRect(8,10,140,24);
                            contextRender.fillStyle = settings.manager.debugFill;
                            contextRender.font = settings.manager.fontDebug;
                            contextRender.fillText("FPS: " + dFramesPerSecond.toFixed(3),
                                10,
                                10);

                            // Output mouse coordinates and size.
                            contextRender.fillStyle = settings.manager.debugBackgroundFill;
                            contextRender.fillRect(self.extent.width - 150, self.extent.height - 54,
                                142, 50);
                            contextRender.strokeRect(self.extent.width - 150, self.extent.height - 54,
                                142, 50);
                            contextRender.fillStyle = settings.manager.debugFill;
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
