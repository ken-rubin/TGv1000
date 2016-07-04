///////////////////////////////////////
// ArgumentList module.
//
// Gui component responsible for showing 
//      a list of method arguments (Expressions).
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/settings",
    "NextWave/source/manager/List",
    "NextWave/source/methodBuilder/CodeExpressionStub"],
    function (prototypes, settings, List, CodeExpressionStub) {

        try {

            // Constructor function.
        	var functionRet = function ArgumentList(arrayArguments) {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from List.
                    self.inherits(List,
                    	false);

                    // Play arguments, if specified.
                    if (arrayArguments) {

                        for (var i = 0; i < arrayArguments.length; i++) {

                            self.addItem(new CodeExpressionStub(arrayArguments[i]));
                        }
                    }

                    ////////////////////////
                    // Public methods.

                    // Get all argument lists of this argument list.
                    self.accumulateExpressionPlacements = function (arrayAccumulator) {

                        try {

                            // Loop over each statement.
                            for (var i = 0; i < self.items.length; i++) {

                                var exceptionRet = self.items[i].accumulateExpressionPlacements(arrayAccumulator);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Add in all placements 
                    // for this ArgumentList.
                    self.accumulateInsertionPoints = function (arrayAccumulator) {

                        try {

                            // First, check the "before all expressions" location.
                            if (self.scrollOffset() === 0) {

                                // If the list is scrolled all the way to the top, then  
                                // it is always OK to add the first spot as a potential.
                                arrayAccumulator.push({

                                    index: 0,
                                    x: self.areaMaximal().location.x
                                });
                            }

                            // Loop over each expression.
                            for (var i = 0; i < self.items.length; i++) {

                                // Extract the ith Expression.
                                var expressionIth = self.items[i];
                                if (!expressionIth ||
                                    !expressionIth.area) {

                                    continue;
                                }

                                // Add after fully visible Expression.
                                var areaExpression = null;
                                if ($.isFunction(expressionIth.area)) {

                                    areaExpression = expressionIth.area();
                                } else {

                                    areaExpression = expressionIth.area;
                                }
                                if (areaExpression) {

                                    if (areaExpression.location.x + areaExpression.extent.width > 
                                        self.areaMaximal().location.x) {

                                        arrayAccumulator.push({

                                            index: i + 1,
                                            x: areaExpression.location.x + areaExpression.extent.width
                                        });
                                    }
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Remove Expression stubs from around all elements.
                    self.purgeExpressionPlacements = function () {

                        try {

                            // Loop over each Expression.
                            for (var i = 0; i < self.items.length; i++) {

                                // Extract the ith element.
                                var itemIth = self.items[i];

                                // If it is a SDS...
                                if (itemIth.placement) {

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

                    // Get all the drag targets from all the statements.
                    self.accumulateDragTargets = function (arrayAccumulator) {

                        try {

                            // Loop over each expression stub.
                            for (var i = 0; i < self.items.length; i++) {

                                // Extract the ith Expression.
                                var expressionStubIth = self.items[i];

                                // If the expression stub does not have a payload, then add.
                                if (!expressionStubIth.payload) {

                                    arrayAccumulator.push(expressionStubIth);
                                } else {

                                    // Recurse.
                                    var exceptionRet = expressionStubIth.payload.accumulateDragTargets(arrayAccumulator);
                                    if (exceptionRet) {

                                        return exceptionRet;
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

                        // Return a normal, anonymously constructable 
                        // object (array) with constructor arguments.

                        // Pre-allocate array of expressions for this Array.
                        var arrayExpressions = [];

                        // Add them all.
                        for (var i = 0; i < self.items.length; i++) {

                            arrayExpressions.push(self.items[i].save());
                        }

                        // Return array of the name and the Array of Expressions.
                        var objectRet = {

                            type: self.constructor.name,
                            parameters: [{ 
                                type: "Array",
                                parameters: arrayExpressions
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
