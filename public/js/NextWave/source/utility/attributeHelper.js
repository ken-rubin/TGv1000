///////////////////////////////////////
// attributeHelper module.
//
// Wraps the operations of extracting attributes from JSON to stow them and the reverse.
//
// Return instance.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes"],
    function (prototypes) {

        try {

            // Constructor function.
        	var functionRet = function attributeHelper() {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////////////
                    // Public methods.

                    // Extract properties from source object and store 
                    // under a particular property in the target object.
                    self.fromJSON = function (objectSource, objectTarget, arrayExclusion, strTargetProperty) {

                        try {

                            // Default target property to "stowage".
                            if (!strTargetProperty) {

                                strTargetProperty = "stowage";
                            }

                            // Default exclusion array.
                            if (!arrayExclusion) {

                                arrayExclusion = [];
                            }

                            // Allocate and store or extract 
                            // the stowage object from the target.
                            var objectStowage = null;
                            if (!objectTarget.hasOwnProperty(strTargetProperty)) {

                                objectStowage = {};
                                objectTarget[strTargetProperty] = objectStowage;
                            } else {

                                objectStowage = objectTarget[strTargetProperty];
                            }

                            // Process each property of the source.
                            var arrayKeys = Object.keys(objectSource);
                            for (var i = 0; i < arrayKeys.length; i++) {

                                // Get the ith property key.
                                var strKeyIth = arrayKeys[i];
                                if (objectSource.hasOwnProperty(strKeyIth) &&
                                    arrayExclusion.indexOf(strKeyIth) === -1) {

                                    // Set the property in a like named 
                                    // property under the stowage object.
                                    objectStowage[strKeyIth] = objectSource[strKeyIth];
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Extract properties a particular property 
                    // in the source object and stow in the target.
                    self.toJSON = function (objectSource, objectTarget, strTargetProperty) {

                        try {

                            // Default target property to "stowage".
                            if (!strTargetProperty) {

                                strTargetProperty = "stowage";
                            }

                            // Get the stowage object from the source.
                            var objectStowage = objectSource[strTargetProperty];

                            // Process each property of the source.
                            var arrayKeys = Object.keys(objectStowage);
                            for (var i = 0; i < arrayKeys.length; i++) {

                                // Get the ith property key.
                                var strKeyIth = arrayKeys[i];
                                if (objectStowage.hasOwnProperty(strKeyIth)) {

                                    // Set the property in a like named 
                                    // property under the target object.
                                    objectTarget[strKeyIth] = objectStowage[strKeyIth];
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

        	return new functionRet();
        } catch (e) {

            alert(e.message);
        }
    });
