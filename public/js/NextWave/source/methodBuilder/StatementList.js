///////////////////////////////////////
// StatementList module.
//
// Gui component responsible for showing 
//      a list of method statements.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/manager/List",
    "NextWave/source/methodBuilder/StatementDragStub"],
    function (prototypes, List, StatementDragStub) {

        try {

            // Constructor function.
        	var functionRet = function StatementList() {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from List.
                    self.inherits(List,
                    	true);

                    self.randomNumber = Math.random(10000);

                    //////////////////////
                    // Public methods.

                    // Add item to list of items.
                    self.addItem = function (itemNew, itemReplace) {

                        try {

                            // If replace item is specified, then replace the item there.
                            if (itemReplace) {

                                // Loop away!
                                for (var i = 0; i < self.items.length; i++) {

                                    // Test.
                                    if (self.items[i] === itemReplace) {

                                        // Replace.
                                        self.items.splice(i, 1, itemNew);
                                        break;
                                    }
                                }
                            } else {

                                // Just stow.
                                self.items.push(itemNew);
                            }

                            // Identify parent.
                            itemNew.collection = self;
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Get all the drag targets from all the expressions.
                    self.accumulateDragTargets = function (arrayAccumulator) {

                        try {

                            // Loop over each statement.
                            for (var i = 0; i < self.items.length; i++) {

                                var exceptionRet = self.items[i].accumulateDragTargets(arrayAccumulator);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Retrieve nameTypes from all items in self.items. They are derived from CodeStatement.
                    self.accumulateNameTypes = function (arrayNameTypes) {

                        try {

                            // Loop over each statement. Each item is inherited from CodeStatement; e.g., CodeStatementVar.
                            // Code statement has self.accumulateNameTypes which does little, but it is overridden in
                            // every derived class (like CodeStatementFor or CodeStatementVar) that holds a name declaration.
                            for (var i = 0; i < self.items.length; i++) {

                                var exceptionRet = self.items[i].accumulateNameTypes(arrayNameTypes);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    }

                    // Add in statements around all elements in the 
                    // self.methodStatements list and all sub-blocks.
                    self.accumulateDragStubInsertionPoints = function (arrayAccumulator, statementDragStub, areaMethodBuilder) {

                        try {

                            // First, check the "before all statements" location.
                            if (self.scrollOffset() === 0) {

                                // If the list is scrolled all the way to the top, then  
                                // it is always OK to add the first spot as a potential.
                                arrayAccumulator.push({

                                    index: 0,
                                    y: self.areaMaximal().location.y,
                                    collection: self,
                                    type: (self.items.length > 0 ? self.items[0].dragStub : false)
                                });
                            }

                            // Loop over each statement.
                            for (var i = 0; i < self.items.length; i++) {

                                // Extract the ith statement.
                                var statementIth = self.items[i];
                                if (!statementIth ||
                                    !statementIth.area) {

                                    continue;
                                }

                                // Check in each statement for block....
                                var exceptionRet = statementIth.accumulateDragStubInsertionPoints(arrayAccumulator,
                                    statementDragStub, 
                                    areaMethodBuilder);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }

                                // Also check after each statement.

                                // Add it if the bottom of the statement is fully visible.
                                var areaStatement = statementIth.area();
                                if (areaStatement) {

                                    if (areaStatement.location.y + areaStatement.extent.height > 
                                        self.areaMaximal().location.y) {

                                        arrayAccumulator.push({

                                            index: i + 1,
                                            y: areaStatement.location.y + areaStatement.extent.height,
                                            collection: self,
                                            type: (statementIth.dragStub ||
                                                ((self.items.length > i + 1) ? self.items[i + 1].dragStub : false))
                                        });
                                    }
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Remove statements from around all elements in 
                    // self.methodStatements list and all sub-blocks.
                    self.purgeStatementDragStubs = function () {

                        try {

                            // Loop over each statement.
                            for (var i = 0; i < self.items.length; i++) {

                                // Extract the ith element.
                                var itemIth = self.items[i];

                                // If it is a SDS...
                                if (itemIth.dragStub) {

                                    // ...then remove it (via splice, not removeItem)...
                                    self.items.splice(i, 1);
                                    // ...and adjust 'i'.
                                    i--;
                                } else {

                                    // Else, ask the statement to purge all SDSs too.
                                    var exceptionRet = itemIth.purgeStatementDragStubs();
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }
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

                    // Generates JavaScript string for this statement list.
                    self.generateJavaScript = function () {

                        var strStatements = " ";

                        for (var i = 0; i < self.items.length; i++) {

                            strStatements += self.items[i].generateJavaScript();
                        }

                        strStatements += " ";

                        return strStatements;
                    };

                    // Save.
                    self.save = function () {

                        var arrayRet = [];

                        // Save the statements.
                        for (var i = 0; i < self.items.length; i++) {

                            arrayRet.push(self.items[i].save());
                        }

                        return arrayRet;
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
