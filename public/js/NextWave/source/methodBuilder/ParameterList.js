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
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/settings",
    "NextWave/source/manager/List"],
    function (prototypes, settings, List) {

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

                    // Add in parameters around all elements in the 
                    // self.methodStatements list and all sub-blocks.
                    self.accumulateParameterDragStubInsertionPoints = function (arrayAccumulator, parameterDragStub, areaMethodBuilder) {

                        try {

                            // First, check the "before all statements" location.
                            if (self.scrollOffset() === 0) {

                                // If the list is scrolled all the way to the top, then  
                                // it is always OK to add the first spot as a potential.
                                arrayAccumulator.push({

                                    index: 0,
                                    x: self.areaMaximal().location.x,
                                    collection: self,
                                    type: (self.items.length > 0 ? self.items[0].parameterDragStub : false)
                                });
                            }

                            // Loop over each parameter.
                            for (var i = 0; i < self.items.length; i++) {

                                // Extract the ith Parameter.
                                var parameterIth = self.items[i];
                                if (!parameterIth ||
                                    !parameterIth.area) {

                                    continue;
                                }

                                // Also check after each parameters.

                                // Add after fully visible Parameters.
                                var areaParameter = parameterIth.area();
                                if (areaParameter) {

                                    if (areaParameter.location.x + areaParameter.extent.width > 
                                        self.areaMaximal().location.x) {

                                        arrayAccumulator.push({

                                            index: i + 1,
                                            x: areaParameter.location.x + areaParameter.extent.width,
                                            collection: self,
                                            type: (parameterIth.parameterDragStub ||
                                                ((self.items.length > i + 1) ? self.items[i + 1].parameterDragStub : false))
                                        });
                                    }
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Return the width if specified, otherwise extent.
                    self.getWidth = function (contextRender) {

                        return Math.max(self.getTotalExtent(contextRender) +
                            settings.general.margin * 2,
                            10 * settings.general.margin);
                    };

                    // Remove parameter stubs from around all elements.
                    self.purgeParameterDragStubs = function () {

                        try {

                            // Loop over each Parameter.
                            for (var i = 0; i < self.items.length; i++) {

                                // Extract the ith element.
                                var itemIth = self.items[i];

                                // If it is a SDS...
                                if (itemIth.parameterDragStub) {

                                    // ...then remove it (via splice, not removeItem)...
                                    self.items.splice(i, 1);
                                    // ...and adjust 'i'.
                                    i--;
                                }
                            }
                            
                            // Possibly adjust scroll offset.
                            var exceptionRet = self.possiblyAdjustScrollOffset();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

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

                    // Generates JavaScript string for this parameterlist.
                    self.generateJavaScript = function () {

                        var strParameters = " ";

                        // Clone the parameters.
                        for (var i = 0; i < self.items.length; i++) {

                            if (i > 0) {

                                strParameters += " , ";
                            }

                            strParameters += self.items[i].generateJavaScript();
                        }

                        return strParameters;
                    };

                    // Save.
                    self.save = function () {

                        // ...else return a normal, anonymously constructable 
                        // object (array) with constructor arguments.

                        // Pre-allocate array of parameters for this Array.
                        var arrayParameters = [];

                        // Add them all.
                        for (var i = 0; i < self.items.length; i++) {

                            arrayParameters.push(self.items[i].save());
                        }

                        // Return array of the name and the Array of parameters.
                        var objectRet = {

                            type: self.constructor.name,
                            parameters: [{ 
                                type: "Array",
                                parameters: arrayParameters
                            }]
                        };
                        return objectRet;
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
