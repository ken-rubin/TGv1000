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
define(["utility/prototypes",
    "manager/List",
    "expression/ExpressionAdd",
    "expression/ExpressionAssignment",
    "expression/ExpressionDelete",
    "expression/ExpressionDivide",
    "expression/ExpressionEqual",
    "expression/ExpressionGreater",
    "expression/ExpressionGreaterOrEqual",
    "expression/ExpressionLess",
    "expression/ExpressionLessOrEqual",
    "expression/ExpressionLogicalAnd",
    "expression/ExpressionLogicalNot",
    "expression/ExpressionLogicalOr",
    "expression/ExpressionModulo",
    "expression/ExpressionMultiply",
    "expression/ExpressionNegate",
    "expression/ExpressionIncrement",
    "expression/ExpressionDecrement",
    "expression/ExpressionNew",
    "expression/ExpressionNotEqual",
    "expression/ExpressionParentheses",
    "expression/ExpressionRefinement",
    "expression/ExpressionSubtract",
    "expression/ExpressionInvocation",
    "expression/ExpressionTernary"],
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
                    self.innerCreate = function (arrayItems) {

                        try {

                            // Add the Expressions.
                            arrayItems = [
                                new ExpressionAdd(),
                                new ExpressionSubtract(),
                                new ExpressionMultiply(),
                                new ExpressionDivide(),
                                new ExpressionModulo(),

                                new ExpressionNegate(),
                                new ExpressionIncrement(),
                                new ExpressionDecrement(),

                                new ExpressionEqual(),
                                new ExpressionNotEqual(),
                                new ExpressionGreater(),
                                new ExpressionGreaterOrEqual(),
                                new ExpressionLess(),
                                new ExpressionLessOrEqual(),

                                new ExpressionLogicalAnd(),
                                new ExpressionLogicalOr(),
                                new ExpressionLogicalNot(),

                                new ExpressionNew(),
                                new ExpressionDelete(),

                                new ExpressionParentheses(),
                                new ExpressionRefinement(),
                                new ExpressionInvocation(),
                                new ExpressionAssignment(),

                                new ExpressionTernary()
                                ];

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
