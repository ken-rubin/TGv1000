///////////////////////////////////////
// Module runs TG simulation update/render loop. 
//
// Return constructor function.
//

"use strict";

// Define module.
define(["Core/EnvironmentBuilder"],
    function (EnvironmentBuilder) {

        // Define constructor function.
        var functionRet = function Simulator() {

            var self = this;

            ///////////////////////////
            // Public fields.

            // Duration of delay 
            self.refreshInterval = 1;

            ///////////////////////////
            // Public methods.

            // Initialize object.
            self.create = function (objectProject,
                strCanvasSelector) {

                try {

                    // Possibly default selector.
                    if (!strCanvasSelector) {

                        strCanvasSelector = "#surfacecanvas";
                    }

                    // Save payload.
                    m_objectProject = objectProject;

                    // Get reference to canvas.
//                    m_jCanvas = $(strCanvasSelector);

                    // Get a reference to the context object.
//                    m_context = m_jCanvas[0].getContext("2d");

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Begin simulation.
            self.start = function (iComicIndex) {

                try {

                    // Possibly default comic index to the first.
                    if (!iComicIndex) {

                        iComicIndex = 0;
                    }

                    // Setup event raise.
                    window.raiseCollection = {};
                    window.raiseEvent = function (strEvent, objectContext) {

                        try {

                            // Add event to the list of events to invoke.
                            window.raiseCollection[strEvent] = objectContext;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Setup the event collection.
                    window.eventCollection = {

                        'keypress': []
                    };

                    // Wire up the events.
                    $(document).keypress(function (e) {

                        try {

                            // Get the correct collection.
                            var listKeypress = window.eventCollection["keypress"];

                            // Process each.
                            for (var i = 0; i < listKeypress.length; i++) {

                                var registration = listKeypress[i];
                                var target = registration.target;
                                var method = registration.method;
                                setTimeout(function () {

                                    try {

                                        // Call the callback, pass the event args that is know for keypress.
                                        target[method]({ 

                                            key: String.fromCharCode(e.which)
                                        });
                                    } catch (e) {

                                        alert(e.message);
                                    }
                                }, 10);
                                // { target: self.ship, method: 'HandleKeyPress' }

                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    });

                    // Initialize the workspace.
                    var eb = new EnvironmentBuilder();
                    var exceptionRet = eb.activate(m_objectProject,
                        iComicIndex);
                    if (exceptionRet) {

                        throw exceptionRet;
                    }

                    // Allocate the app.
                    window.app = new window.App();
                    window.app.initialize();
//                    window.app.context = m_context;

                    // Begin the rendering.
                    if (m_renderCookie) {

                        var exceptionRet = self.stop();
                        if (exceptionRet) {

                            return exceptionRet;
                        }
                    }
                    m_renderCookie = setInterval(m_functionAnimate,
                        self.refreshInterval);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Stop simulation.
            self.stop = function () {

                try {

                    // Stop the animator interval.
                    if (m_renderCookie) {

                        clearInterval(m_renderCookie);
                        m_renderCookie = null;
                    }

                    // Clean up the workspace.
                    var eb = new EnvironmentBuilder();
                    var exceptionRet = eb.deactivate(m_objectProject,
                        0);
                    if (exceptionRet) {

                        throw exceptionRet;
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ///////////////////////////
            // Private methods.

            // .
            var m_functionAnimate = function () {

                try {

                    var exceptionRet = m_functionUpdate();
                    if (exceptionRet) {

                        throw exceptionRet;
                    }

                    // Clear the surface before rendering everything.
                    window.app.PreRender();
//                    m_context.clearRect(0,0,800,600);

                    exceptionRet = m_functionRender();
                    if (exceptionRet) {

                        throw exceptionRet;
                    }

                    exceptionRet = m_functionDoEvents();
                    if (exceptionRet) {

                        throw exceptionRet;
                    }
                } catch (e) {

                    alert(e.message);
                }
            };

            // .
            var m_functionDoEvents = function () {

                try {

                    // Process each of the cached raise collection elements.
                    var arrayKeys = Object.keys(window.raiseCollection);
                    for (var i = 0; i < arrayKeys.length; i++) {

                        var strEvent = arrayKeys[i];

                        // Get the correct collections.
                        var objectContext = window.raiseCollection[strEvent];
                        var listCallbacks = window.eventCollection[strEvent];

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
                    window.raiseCollection = {};

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // .
            var m_functionUpdate = function () {

                try {

                    // Update each of the objects that has an update.
                    for (var i = 0; i < window.instances.length; i++) {

                        // Get the ith instance.
                        var instanceIth = window.instances[i];
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

            // .
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
                            var exceptionRet = instanceIth.render();
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

            ///////////////////////////
            // Private fields.

            // .
            var m_renderCookie = null;
            // .
            var m_objectProject = null;
        };

        // Return constructor.
        return functionRet;
    });
