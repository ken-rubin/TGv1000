///////////////////////////////////////
// LiteralList module.
//
// Gui component responsible for showing 
//      a list of literals.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
    "NextWave/source/utility/settings",
    "NextWave/source/utility/List",
    "NextWave/source/MethodBuilder/CodeExpressionStub",
    "NextWave/source/MethodBuilder/CodeLiteral",
    "NextWave/source/MethodBuilder/CodeExpressionLiteral"],
    function (prototypes, settings, List, CodeExpressionStub, CodeLiteral, CodeExpressionLiteral) {

        try {

            // Constructor function.
        	var functionRet = function LiteralList(arrayLiterals) {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from List.
                    self.inherits(List,
                    	false);

                    // Play literals, if specified.
                    if (arrayLiterals) {

                        for (var i = 0; i < arrayLiterals.length; i++) {

                            self.addItem(arrayLiterals[i]);
                        }
                    }

                    // Always add a final, empty item.
                    let cl = new CodeLiteral("...");
                    //let cel = new CodeExpressionLiteral(cl);

                    self.addItem(cl);
                    let editor = cl.payload;
                    // Wire callback to key pressed here.
                    let functionKeyPressed = function () {

                        try {

                            // Scan for an empty stub.  If not found, add one.
                            let arrayEmptyOnes = [];
                            let bDidntRemoveToMakeThingsSimpler = false;
                            let iLength = self.items.length;
                            self.items.forEach(function (cl) {

                                // Account for this cl.
                                iLength--;

                                // Get the Editor.
                                let editor = cl.payload;
                                if (editor) {

                                    // Get the current text.
                                    let strPayload = editor.text;
                                    if (!strPayload  ||
                                        strPayload === "...") {

                                        if (iLength === 0) {

                                            bDidntRemoveToMakeThingsSimpler = true;
                                            editor.text = "...";
                                        } else {

                                            arrayEmptyOnes.push(cl);
                                        }
                                    }
                                } else {

                                    arrayEmptyOnes.push(cl);
                                }
                            });

                            // Remove all empty entries.
                            arrayEmptyOnes.forEach(function (cl) {

                                self.removeItem(cl);
                            });

                            if (!bDidntRemoveToMakeThingsSimpler) {

                                // Always add a final, empty item.
                                let cl = new CodeLiteral("...");
                                //let ces = new CodeExpressionStub(new CodeExpressionLiteral(cl));
                                self.addItem(cl);
                                let editor = cl.payload;
                                editor.onKeyPressed = functionKeyPressed;
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };
                    editor.onKeyPressed = functionKeyPressed;

                    // Expose a virtual method for  
                    // which derived classes to stub.
                    self.innerRender = function (contextRender) {

                        functionKeyPressed();
                        return null;
                    };

                    ////////////////////////
                    // Public methods.

                    // Add in literals around all elements in the 
                    // self.methodStatements list and all sub-blocks.
                    self.accumulateLiteralDragStubInsertionPoints = function (arrayAccumulator, literalDragStub, areaMethodBuilder) {

                        try {

                            // First, check the "before all statements" location.
                            if (self.scrollOffset() === 0) {

                                // If the list is scrolled all the way to the top, then  
                                // it is always OK to add the first spot as a potential.
                                arrayAccumulator.push({

                                    index: 0,
                                    x: self.areaMaximal().location.x,
                                    collection: self,
                                    type: (self.items.length > 0 ? self.items[0].literalDragStub : false)
                                });
                            }

                            // Loop over each literal.
                            for (var i = 0; i < self.items.length; i++) {

                                // Extract the ith Literal.
                                var literalIth = self.items[i];
                                if (!literalIth ||
                                    !literalIth.area) {

                                    continue;
                                }

                                // Also check after each literals.

                                // Add after fully visible Literals.
                                var areaLiteral = literalIth.area();
                                if (areaLiteral) {

                                    if (areaLiteral.location.x + areaLiteral.extent.width > 
                                        self.areaMaximal().location.x) {

                                        arrayAccumulator.push({

                                            index: i + 1,
                                            x: areaLiteral.location.x + areaLiteral.extent.width,
                                            collection: self,
                                            type: (literalIth.literalDragStub ||
                                                ((self.items.length > i + 1) ? self.items[i + 1].literalDragStub : false))
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

                    // Remove literal stubs from around all elements.
                    self.purgeLiteralDragStubs = function () {

                        try {

                            // Loop over each Literal.
                            for (var i = 0; i < self.items.length; i++) {

                                // Extract the ith element.
                                var itemIth = self.items[i];

                                // If it is a SDS...
                                if (itemIth.literalDragStub) {

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

                    // Return a new instance of a Literal.
                    self.clone = function () {

                        // Allocate the clone.
                        var plClone = new self.constructor();

                        // Clone the literals.
                        for (var i = 0; i < self.items.length; i++) {

                            plClone.items.push(self.items[i].clone());
                        }
                        return plClone;
                    };

                    // Generates JavaScript string for this literallist.
                    self.generateJavaScript = function () {

                        var strLiterals = " ";

                        // Clone the literals.
                        let bOutputALiteral = false;
                        for (var i = 0; i < self.items.length; i++) {

                            let itemIth = self.items[i];
                            if (itemIth.payload &&
                                (!itemIth.payload ||
                                    itemIth.payload.text === "...")) {

                                continue;
                            }

                            if (strLiterals.length > 1) {

                                strLiterals += " ";
                            }
                            strLiterals += itemIth.generateJavaScript();
                        }

                        return strLiterals;
                    };

                    // Save.
                    self.save = function () {

                        // Return a normal, anonymously constructable 
                        // object (array) with constructor arguments.

                        // Pre-allocate array of literals for this Array.
                        var arrayLiterals = [];

                        // Add them all.
                        for (var i = 0; i < self.items.length; i++) {

                            // Except the empties.
                            let editor = self.items[i].payload;
                            if (editor) {

                                // Get the current text.
                                let strPayload = editor.text;
                                if (!strPayload  ||
                                    strPayload === "...") {

                                    continue;
                                }
                            } else {

                                continue;
                            }

                            arrayLiterals.push(self.items[i].save());
                        }

                        // Return array of the name and the Array of literals.
                        var objectRet = {

                            type: self.constructor.name,
                            literals: [{ 
                                type: "Array",
                                literals: arrayLiterals
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
