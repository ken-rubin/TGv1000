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
                            window.tg.eventCollection = [];
                            window.tg.raiseCollection = [];
                            window.tg.app = null;
                            window.tg.manager = window.manager;
                            window.tg.typeNames = new Set();

                            // Load up/allocate all the Type constructor functions.
                            let libraryApp = null;
                            for (var i = 0; i < objectModules.types.length; i++) {

                                let typeIth = objectModules.types[i];

                                // Test the base class, if specified,  
                                // to ensure it has already been loaded.
                                let strBaseTypeName = typeIth.type.data.baseTypeName;
                                if (strBaseTypeName) {

                                    // Test....
                                    if (!window.tg.typeNames.has(strBaseTypeName)) {

                                        // Move this Type to the end of the Array of Types.
                                        objectModules.types.splice(i, 1);
                                        objectModules.types.push(typeIth);

                                        // Adjust i, ...
                                        i--;

                                        // ...because about to:
                                        continue;
                                    }
                                }

                                // Actuate the constructor function.
                                eval(typeIth.constructor);

                                // If this is an "App"-type, then remember
                                // the library--it is used later to auto-allocate.
                                if (typeIth.type.data.name === "App") {

                                    libraryApp = typeIth.library;
                                }

                                // Add to typeNames Set.
                                window.tg.typeNames.add(typeIth.type.data.name)
                            }

                            // Allocate app.
                            if (libraryApp) {

                                window.tg.app = new window.tg[libraryApp.data.name].App(true);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // End simulation.
                    self.stop = function () {

                        try {

                            // If the app was found and allocated, call its destruct, if defined.
                            if (window.tg.app &&
                                window.tg.app.destruct) {

                                window.tg.app.destruct();
                            }

                            // Clear namespace.
                            window.tg = {};
                            window.tg.instances = [];
                            window.tg.eventCollection = [];
                            window.tg.raiseCollection = [];
                            window.tg.app = null;
                            window.tg.typeNames = null;
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    ///////////////////////////
                    // Private field.

                    // .
                    var m_functionAnimate = function () {

                        try {

                            var exceptionRet = m_functionUpdate();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            /* Clear the surface before rendering everything.
                            m_context.clearRect(0,0,800,600);

                            exceptionRet = m_functionRender();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }*/

                            /*exceptionRet = m_functionDoEvents();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }*/
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // .
                    var m_functionDoEvents = function () {

                        try {

                            // Process each of the cached raise collection elements.
                            var arrayKeys = Object.keys(window.tg.raiseCollection);
                            for (var i = 0; i < arrayKeys.length; i++) {

                                var strEvent = arrayKeys[i];

                                // Get the correct collections.
                                var objectContext = window.tg.raiseCollection[strEvent];
                                var listCallbacks = window.tg.eventCollection[strEvent];

                                // Process each callback.
                                for (var i = 0; i < listCallbacks.length; i++) {

                                    var callback = listCallbacks[i];
                                    var target = callback.target;
                                    var method = callback.method;
                                    setTimeout(function (target, method) {

                                        try {

                                            target[method](objectContext);
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    }(target, method), 10);
                                }
                            }

                            // Clear collection.
                            window.tg.raiseCollection = {};

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // .
                    var m_functionUpdate = function () {

                        try {

                            // Update each of the objects that has an update.
                            for (var i = 0; i < window.tg.instances.length; i++) {

                                // Get the ith instance.
                                var instanceIth = window.tg.instances[i];
                                if (!instanceIth) {

                                    continue;
                                }

                                // Check if it has an update.
                                if (instanceIth.update) {

                                    // Call update if it exists.
                                    var exceptionRet = instanceIth.update();
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    /* .
                    var m_functionRender = function () {

                        try {

                            // Render each of the objects that has a render.
                            for (var i = 0; i < window.instances.length; i++) {

                                // Get the ith instance.
                                var instanceIth = window.instances[i];
                                if (!instanceIth) {

                                    continue;
                                }

                                // Check if it has an render.
                                if (instanceIth.render) {

                                    // Call update if it exists.
                                    var exceptionRet = instanceIth.render(m_context);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };*/

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
