///////////////////////////////////////
// CodeStatementList module.
//
// Gui component responsible for showing 
//      a list of method statements.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "manager/List",
    "methodBuilder/StatementDragStub"],
    function (prototypes, List, StatementDragStub) {

        try {

            // Constructor function.
        	var functionRet = function CodeStatementList() {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from List.
                    self.inherits(List,
                    	true);

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

                    // Get all the drag targets from all the statements.
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

                    // Add in statements around all elements in the 
                    // self.methodStatements list and all sub-blocks.
                    self.addStatementDragStubs = function (arrayAccumulator) {

                        try {

                            // Add as the first element.
                            var sdsNew = new StatementDragStub();
                            sdsNew.collection = self;
                            arrayAccumulator.push(sdsNew);

                            // Assuming it does not matter that addItem is not called here....
                            self.items.splice(0, 0, sdsNew);

                            // Loop over each statement.
                            for (var i = 1; i < self.items.length; i+=2) {

                                var exceptionRet = self.items[i].addStatementDragStubs(arrayAccumulator);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }

                                // Also add after each statement.
                                sdsNew = new StatementDragStub();
                                sdsNew.collection = self;
                                arrayAccumulator.push(sdsNew);

                                // Assuming it does not matter that addItem is not called here....
                                self.items.splice(i + 1, 0, sdsNew);
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
                                if (itemIth instanceof StatementDragStub) {

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
                            return null;
                        } catch (e) {

                            return e;
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
