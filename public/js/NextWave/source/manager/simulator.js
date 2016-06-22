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

                            // Load each module into the environment.
                            for (var i = 0; i < objectModules.types.length; i++) {

                                var strTypeIth = objectModules.types[i];
                                alert(strTypeIth);
                            }

                            // Load each module into the environment.
                            for (var i = 0; i < objectModules.systemTypes.length; i++) {

                                var strTypeIth = objectModules.systemTypes[i];
                                alert(strTypeIth);
                            }

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

                } catch (e) {

                    alert(e.message);
                }
        	};

        	return new functionRet();
        } catch (e) {

            alert(e.message);
        }
    });
