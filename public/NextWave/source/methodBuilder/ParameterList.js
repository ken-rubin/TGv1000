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
        	var functionRet = function ParameterList() {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from List.
                    self.inherits(List,
                    	false);
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
