///////////////////////////////////////
// Expression base module.
//
// Base class for all expressions.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["utility/prototypes",
    "manager/ListItem"],
    function (prototypes, ListItem) {

        try {

            // Constructor function.
        	var functionRet = function Expression(strName) {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from ListItem.
                    self.inherits(ListItem,
                        strName,
                        "expression");
                } catch (e) {

                    alert(e.message);
                }
        	};

            // Inherit from ListItem.
            functionRet.inheritsFrom(ListItem);

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
