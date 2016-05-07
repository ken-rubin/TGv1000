///////////////////////////////////////
// ParameterList module.
//
// Gui component responsible for showing 
//      a list of method parameters.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "manager/List"],
    function (prototypes, List) {

        try {

            // Constructor function.
        	var functionRet = function ParameterList(arrayParameters) {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from List.
                    self.inherits(List,
                    	false);

                    // Play parameters, if specified.
                    if (arrayParameters) {

                        for (var i = 0; i < arrayParameters.length; i++) {

                            self.addItem(arrayParameters[i]);
                        }
                    }

                    ////////////////////////
                    // Public methods.

                    // Return a new instance of a Parameter.
                    self.clone = function () {

                        // Allocate the clone.
                        var plClone = new self.constructor();

                        // Clone the parameters.
                        for (var i = 0; i < self.items.length; i++) {

                            plClone.items.push(self.items[i].clone());
                        }
                        return plClone;
                    };

                    // Save.
                    self.save = function (bStraight) {

                        // Straight is for methods, ...
                        if (bStraight) {

                            var arrayRet = [];

                            // Clone the parameters.
                            for (var i = 0; i < self.items.length; i++) {

                                arrayRet.push(self.items[i].save());
                            }

                            return arrayRet;
                        } else {

                            // ...else return a normal, anonymously constructable 
                            // object (array) with constructor arguments.

                            // Pre-allocate array of parameters for this Array.
                            var arrayParameters = [];

                            // Add them all.
                            for (var i = 0; i < self.items.length; i++) {

                                arrayParameters.push(self.items[i].save());
                            }

                            // Return array of the name and the Array of parameters.
                            return [{

                                    type: "Array",
                                    parameters: arrayParameters
                                }
                            ];
                        }
                    };
                } catch (e) {

                    alert(e.message);
                }
        	};

            // Inherit from List.
            functionRet.inheritsFrom(List);

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
