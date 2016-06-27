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

                            var exceptionRet;

                            // Add the Names.
                            for (var i = 0; i < arrayItems.length; i++) {

                                exceptionRet = self.addItem(arrayItems[i]);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Uniquifies and sorts nameTypes stored in self.items in List.js.
                    self.uAndS = function () {

                        var uniqueArray = [];
                        if (self.items.length) {

                            // Uniquify (although duplicates wouldn't be allowed--or shouldn't).
                            uniqueArray.push(self.items[0]);
                            for (var i = 1; i < self.items.length; i++) {
                                var compIth = self.items[i];
                                var found = false;
                                for (var j = 0; j < uniqueArray.length; j++) {
                                    if (uniqueArray[j].name.name === compIth.name.name){
                                        found = true;
                                        break;
                                    }
                                }
                                if (!found) {
                                    uniqueArray.push(compIth);
                                }
                            }

                            self.items = uniqueArray;

                            // And sort.
                            self.items.sort(function(a,b){

                                if (a.name.name > b.name.name)
                                    return 1;
                                if (a.name.name < b.name.name)
                                    return -1;
                                return 0;
                            });
                        }
                    }

                    // Add a nameType object in a manner that retains sorting by name.
                    self.addNameType = function (objNameType, bDoNotSort) {

                        try {

                            var doNotSort = bDoNotSort || false;

                            var exceptionRet = self.addItem(new Name(objNameType));
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            if (!doNotSort) {
                                self.uAndS();
                            }

                            return null;

                        } catch (e) {

                            return e;
                        }
                    };

                    // Remove existing names and set to these names. Then uniquify and sort.
                    self.setNameTypes = function (arrayNameTypes) {

                        try {

                            var exceptionRet;

                            for (var i = 0; i < arrayNameTypes.length; i++) {

                                exceptionRet = self.addNameType(arrayNameTypes[i], true);   // Tells self.addNameType to hold off on sorting. We'll do it at the end.
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            self.uAndS();
                            return null;

                        } catch (e) {

                            return e;
                        }
                    }

                    // Method changes an existing name in a manner that retains sorting by name.
                    self.changeNameOfNameType = function (strOriginalName, strNewName) {

                        try {

                            // Update in place.
                            for (var i = 0; i < self.items.length; i++) {

                                // Find match...
                                if (self.items[i].name.name === strOriginalName) {

                                    // ...and splace in place.
                                    self.items[i].name.name = strNewName;

                                    break;
                                }
                            }

                            self.uAndS();
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
