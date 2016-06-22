///////////////////////////////////////
// Simulator module.
//
// Module loads types and plays a simulation.
//
// Return object instance.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/settings"],
    function (prototypes, settings) {

        try {

            // Constructor function.
        	var functionRet = function Simulator() {

                try {

            		var self = this;                        // Uber closure.

                    ////////////////////////
                    // Public methods.

                    // Begin simulation.
                    self.start = function (objectModules) {

                        try {

                            // Declare namespace.
                            window.tg = {};
                            window.tg.instances = [];

                            // Ensure that types are instantiated
                            // in reverse dependency order.

                            // Load each module into the environment.
                            for (var i = 0; i < objectModules.systemTypes.length; i++) {

                                var strTypeIth = objectModules.systemTypes[i];
                                eval(strTypeIth);
                            }

                            // Load each module into the environment.
                            for (var i = 0; i < objectModules.types.length; i++) {

                                var strTypeIth = objectModules.types[i];
                                eval(strTypeIth);
                            }

                            // Allocate app.
                            window.tg.app = new window.tg.App();
                            window.tg.app.initialize();

                            /* Begin the rendering.
                            print("Begin step-loop.");
                            if (m_renderCookie) {

                                var exceptionRet = self.stop();
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }
                            m_renderCookie = setInterval(m_functionAnimate,
                                self.refreshInterval);*/

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // End simulation.
                    self.stop = function () {

                        try {

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    ///////////////////////////
                    // Private field.

                    ///////////////////////////
                    // Private field.

                    // .
                    var m_renderCookie = null;

                } catch (e) {

                    alert(e.message);
                }
        	};

        	return new functionRet();
        } catch (e) {

            alert(e.message);
        }
    });
