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
    "NextWave/source/manager/List"],
    function (prototypes, settings, List) {

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

                            self.addItem(arrayArguments[i]);
                        }
                    }

                    ////////////////////////
                    // Public methods.

                    // Add in expressions around all 
                    // elements in the argument list.
                    self.accumulateExpressionDragStubInsertionPoints = function (arrayAccumulator, expressionDragStub, areaMethodBuilder) {

                        try {

                            // First, check the "before all expressions" location.
                            if (self.scrollOffset() === 0) {

                                // If the list is scrolled all the way to the top, then  
                                // it is always OK to add the first spot as a potential.
                                arrayAccumulator.push({

                                    index: 0,
                                    x: self.areaMaximal().location.x,
                                    collection: self,
                                    type: (self.items.length > 0 ? self.items[0].expressionDragStub : false)
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

                                // Also check after each Expression.

                                // Add after fully visible Expression.
                                var areaExpression = expressionIth.area();
                                if (areaExpression) {

                                    if (areaExpression.location.x + areaExpression.extent.width > 
                                        self.areaMaximal().location.x) {

                                        arrayAccumulator.push({

                                            index: i + 1,
                                            x: areaExpression.location.x + areaExpression.extent.width,
                                            collection: self,
                                            type: (expressionIth.expressionDragStub ||
                                                ((self.items.length > i + 1) ? self.items[i + 1].expressionDragStub : false))
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

                    // Remove Expression stubs from around all elements.
                    self.purgeExpressionDragStubs = function () {

                        try {

                            // Loop over each Expression.
                            for (var i = 0; i < self.items.length; i++) {

                                // Extract the ith element.
                                var itemIth = self.items[i];

                                // If it is a SDS...
                                if (itemIth.expressionDragStub) {

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
