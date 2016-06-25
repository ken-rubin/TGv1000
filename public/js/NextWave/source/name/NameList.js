///////////////////////////////////////
// NameList module.
//
// Gui component responsible for showing 
//      a list of name objects.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/manager/List",
    "NextWave/source/name/Name"],
    function (prototypes, List, Name) {

        try {

            // Constructor function.
            var functionRet = function NameList() {

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

                            // Add the Names.
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

                    // Add a nameType object.
                    self.addNameType = function (objNameType) {

                        try {

                            return self.addItem(new Name(objNameType));
                        } catch (e) {

                            return e;
                        }
                    };

                    // Remove existing names and set to these names.
                    self.setNames = function (arrayNameTypes) {

                        try {

                            var exceptionRet;

                            for (var i = 0; i < arrayNameTypes.length; i++) {

                                exceptionRet = self.addNameType(arrayNameTypes[i]);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            return null;

                        } catch (e) {

                            return e;
                        }
                    }

                    // Method edits an existing name.
                    self.editName = function (strOriginalName, strNewName) {

                        try {

                            // Update in place.
                            for (var i = 0; i < self.items.length; i++) {

                                // Find match...
                                if (self.items[i].name === strOriginalName) {

                                    // ...and splace in place.
                                    self.items[i].name = strNewName;

                                    break;
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Method removes an existing name.
                    self.removeNameType = function (strName) {

                        try {

                            // Update in place.
                            for (var i = 0; i < self.items.length; i++) {

                                // Find match...
                                if (self.items[i].name.name === strName) {

                                    // ...and splice in place.
                                    self.items.splice(i, 1);

                                    break;
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
