///////////////////////////////////////
// ExpressionList module.
//
// Gui component responsible for showing 
//      a list of expression objects.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/List",
    "NextWave/source/expression/ExpressionAdd",
    "NextWave/source/expression/ExpressionAssignment",
    "NextWave/source/expression/ExpressionDelete",
    "NextWave/source/expression/ExpressionDivide",
    "NextWave/source/expression/ExpressionEqual",
    "NextWave/source/expression/ExpressionGreater",
    "NextWave/source/expression/ExpressionGreaterOrEqual",
    "NextWave/source/expression/ExpressionLess",
    "NextWave/source/expression/ExpressionLessOrEqual",
    "NextWave/source/expression/ExpressionLogicalAnd",
    "NextWave/source/expression/ExpressionLogicalNot",
    "NextWave/source/expression/ExpressionLogicalOr",
    "NextWave/source/expression/ExpressionModulo",
    "NextWave/source/expression/ExpressionMultiply",
    "NextWave/source/expression/ExpressionNegate",
    "NextWave/source/expression/ExpressionIncrement",
    "NextWave/source/expression/ExpressionDecrement",
    "NextWave/source/expression/ExpressionNew",
    "NextWave/source/expression/ExpressionNotEqual",
    "NextWave/source/expression/ExpressionParentheses",
    "NextWave/source/expression/ExpressionRefinement",
    "NextWave/source/expression/ExpressionSubtract",
    "NextWave/source/expression/ExpressionInvocation",
    "NextWave/source/expression/ExpressionTernary"],
    function (prototypes, List, ExpressionAdd, ExpressionAssignment, ExpressionDelete, ExpressionDivide, ExpressionEqual, ExpressionGreater, ExpressionGreaterOrEqual, ExpressionLess, ExpressionLessOrEqual, ExpressionLogicalAnd, ExpressionLogicalNot, ExpressionLogicalOr, ExpressionModulo, ExpressionMultiply, ExpressionNegate, ExpressionIncrement, ExpressionDecrement, ExpressionNew, ExpressionNotEqual, ExpressionParentheses, ExpressionRefinement, ExpressionSubtract, ExpressionInvocation, ExpressionTernary) {

        try {

            // Constructor function.
        	var functionRet = function ExpressionList() {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from List.
                    self.inherits(List,
                        true);

                    ///////////////////////
                    // Public methods.

                    // Add expressions to collection.
                    self.load = function (objectExpressions) {

                        try {

                            // Add the Expressions.
                            var arrayItems = [/*
                                new ExpressionAdd(),
                                new ExpressionAssignment(),
                                new ExpressionDecrement(),
                                new ExpressionDelete(),
                                new ExpressionDivide(),
                                new ExpressionEqual(),
                                new ExpressionGreater(),
                                new ExpressionGreaterOrEqual(),
                                new ExpressionIncrement(),
                                new ExpressionInvocation(),
                                new ExpressionLess(),
                                new ExpressionLessOrEqual(),
                                new ExpressionLogicalAnd(),
                                new ExpressionLogicalNot(),
                                new ExpressionLogicalOr(),
                                new ExpressionModulo(),
                                new ExpressionMultiply(),
                                new ExpressionNegate(),
                                new ExpressionNew(),
                                new ExpressionNotEqual(),
                                new ExpressionParentheses(),
                                new ExpressionRefinement(),
                                new ExpressionSubtract(),
                                new ExpressionTernary()
                                */];

                            // Build each included expression.
                            for (var i = 0; i < objectExpressions.length; i++) {

                                var strExpressionIth = objectExpressions[i];

                                // Allocate and add.
                                arrayItems.push(eval("new " + strExpressionIth + "();"));
                            }

                            // Add the Expressions.
                            for (var i = 0; i < arrayItems.length; i++) {

                                var exceptionRet = self.addItem(arrayItems[i]);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Save the list of expressions.
                    self.save = function () {

                        var arrayItems = [];

                        // Loop over items, save the name of the constructor.
                        for (var i = 0; i < self.items.length; i++) {

                            arrayItems.push(self.items[i].constructor.name);
                        }

                        return arrayItems;
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
