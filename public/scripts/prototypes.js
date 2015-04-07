////////////////////////////////////////
// Extend JavaScript type prototypes.
// No return.

"use strict";

define(["prototypes"],
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
                    (this.getMonth() + 1) + "-" +
                    this.getDate();
            };

            // Output date time for mysql
            Date.prototype.formatForMySQLDate = function () {

                // Helper method.
                var functionTwoDigits = function (d) {

                    if (0 <= d && d < 10) return "0" + d.toString();
                    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
                    return d.toString();
                }

                // Compose return.
                return this.getFullYear() + "-" +
                    functionTwoDigits(1 + this.getMonth()) + "-" +
                    functionTwoDigits(this.getDate()) + " " +
                    functionTwoDigits(this.getHours()) + ":" +
                    functionTwoDigits(this.getMinutes()) + ":" +
                    functionTwoDigits(this.getSeconds());
            };

            // Output date time for mysql
            String.prototype.parseMySQLDate = function () {

                var dateRet = new Date();
                if (this.length > 3) {

                    dateRet.setYear(this.substr(0, 4));
                }
                if (this.length > 6) {

                    dateRet.setMonth(parseInt(this.substr(5, 2)) - 1);
                }
                if (this.length > 9) {

                    dateRet.setDate(this.substr(8, 2));
                }
                if (this.length > 12) {

                    dateRet.setHours(this.substr(11, 2));
                }
                if (this.length > 15) {

                    dateRet.setMinutes(this.substr(14, 2));
                }
                if (this.length > 18) {

                    dateRet.setSeconds(this.substr(17, 2));
                }

                // Compose return.
                return dateRet;
            };

            var m_arraySizes = {};

            // Extend String's prototype to support measure text.
            String.prototype.size = function (strFont) {

                try {

                    var strKey = this + strFont.toString();
                    if (m_arraySizes[strKey] === undefined) {

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

                        var objectStowage = {

                            width: dWidth,
                            height: dHeight
                        };

                        m_arraySizes[strKey] = objectStowage;
                        return objectStowage;
                    } else {

                        return m_arraySizes[strKey];
                    }
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

            Object.defineProperty(Function.prototype,
                "inheritsFrom",
            {
                value: function (ParentConstructorFunction) {

                    this.prototype = new ParentConstructorFunction();
                    this.prototype.constructor = this;
                },
                enumerable: false,
                configurable: true,
                writable: true
            });



        } catch (e) {

            alert(e.message);
        }
    }
);