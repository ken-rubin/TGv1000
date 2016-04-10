///////////////////////////////////////
// Prototypes module.
// 
// Extend JavaScript type prototypes.
//
// Returns object instance.

"use strict";

define([],
    function () {

        try {

            // Extend canvas with dashedLine.
            CanvasRenderingContext2D.prototype.dashedLine = function (x1, y1, x2, y2, dashLen) {
                if (dashLen == undefined) dashLen = 2;

                this.beginPath();
                this.moveTo(x1, y1);

                var dX = x2 - x1;
                var dY = y2 - y1;
                var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
                var dashX = dX / dashes;
                var dashY = dY / dashes;

                var q = 0;
                while (q++ < dashes) {
                    x1 += dashX;
                    y1 += dashY;
                    this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
                }
                this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x2, y2);

                this.stroke();
                this.closePath();
            };

            // Test date for validity.
            Date.prototype.isValid = function () {

                return isFinite(this);
            };

            // Output just the date for output.
            Date.prototype.formatDateForDisplay = function () {

                return this.getFullYear() + "-" +
                    this.getMonth() + "-" +
                    this.getDay();
            };

            // Extend String's prototype to support measure text.
            String.prototype.size = function (strFont) {

                try {
                    // Create an element with which to measure.
                    var jqMeasurer = $("<div style='position:absolute;float:left;visibility:hidden'>" + this + "</div>");

                    // Set font, if specified.
                    if (strFont !== undefined &&
                        strFont !== null) {

                        jqMeasurer.css("font",
                            strFont);
                    }

                    jqMeasurer.appendTo($(document.body));

                    // Extract dimension from element.
                    var dWidth = jqMeasurer.width();
                    var dHeight = jqMeasurer.height();

                    // Remove the measurer from DOM.
                    jqMeasurer.remove();

                    return {

                        width: dWidth,
                        height: dHeight
                    };
                } catch (e) {

                    return -1;
                }
            };

            // Extend Object's prototype to support OOP.
            Object.defineProperty(Object.prototype,
                "inherits",
                {
                    value: function (parent) {

                        // Call the parent constructor in the 
                        // context of "this" (the object instance)
                        // to link the two objects together.
                        if (arguments.length > 1) {

                            // Pass extra constructor parameters.
                            parent.apply(this, Array.prototype.slice.call(arguments, 1));
                        }
                        else {

                            // Just call default constuctor.
                            parent.call(this);
                        }
                    },
                    enumerable: false,
                    configurable: true,
                    writable: true
                });

            // Extend Object's prototype to support object merging.
            Object.defineProperty(Object.prototype,
                "inject",
                {
                    value: function (objectSource) {

                        // Define recursive object merger.
                        var functionMerge = function (objectTarget,
                            objectSource) {

                            // Can't merge undefineds.
                            if (objectSource === undefined) {

                                return objectTarget;
                            }
                            // Can't merge nulls either.
                            if (objectSource === null) {

                                return objectTarget;
                            }
                            // Target can't be undefined or null because it is "this" in calling block.

                            // Must handle arrays and objects differently.
                            if (objectSource instanceof Array) {

                                // Loop over all source items.
                                for (var i = 0; i < objectSource.length; i++) {

                                    if (objectTarget.length > i) {

                                        // Recurse down.
                                        functionMerge(objectTarget[i],
                                            objectSource[i]);
                                    } else {

                                        objectTarget.push(objectSource[i]);
                                    }
                                }
                            } else if (objectSource instanceof Object) {

                                    // Loop over all source properties.
                                for (var strKey in objectSource) {

                                    // Do not handle base properties.
                                    if (objectSource.hasOwnProperty(strKey) === false) {

                                        continue;
                                    }

                                    // If the target does not have a source property, add, else...
                                    if (objectTarget[strKey] === undefined) {

                                        objectTarget[strKey] = objectSource[strKey];
                                    } else {

                                        // Recurse down if object or array, otherwise assign.

                                        if (objectTarget[strKey] instanceof Array ||
                                            objectTarget[strKey] instanceof Object) {

                                            // Recurse down.
                                            functionMerge(objectTarget[strKey],
                                                objectSource[strKey]);
                                        } else {

                                            // Even though target has a value here, need
                                            // To over-write since the type is a kernel.
                                            objectTarget[strKey] = objectSource[strKey];
                                        }
                                    }
                                }
                            } else /* Kernel type */ {

                                objectTarget = objectSource;
                            }

                            // Return the target for chaining purposes.
                            return objectTarget;
                        };

                        // Invoke merger function with this and specified object.
                        return functionMerge(this,
                            objectSource);
                    },
                    enumerable: false,
                    configurable: true,
                    writable: true
                });

            // Extend Function's prototype to support OOP.
            Function.prototype.inheritsFrom = function (ParentConstructorFunction) {

                // Set the prototype for "this" function.
                // This injects ParentConstructorFunction
                // into "this", which is another function.
                this.prototype = new ParentConstructorFunction();

                // Also set the prototype's constructor to this.
                // This has the effect of circumventing some
                // behavior of JavaScript which would otherwise
                // cause problems for the new this.prototype.
                this.prototype.constructor = this;
            };
            
//            Function.defineProperty(Function.prototype,
//                "inherits",
//                {
//            		value: function (ParentConstructorFunction) {
//            			
//                        this.prototype = new ParentConstructorFunction();
//                        this.prototype.constructor = this;
//            		},
//                    enumerable: false,
//                    configurable: true,
//                    writable: true
//                });

        } catch (e) {

            alert(e.message);
        }
    }
);
