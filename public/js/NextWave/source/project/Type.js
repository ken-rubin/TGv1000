/////////////////////
// Type module.
//
// Object manages loading and saving Type data to and  
// from the Library and also, integration with the TypeTree.
// 
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/project/Method",
    "NextWave/source/project/Property",
    "NextWave/source/project/Event",
    "NextWave/source/utility/ListItem"], 
	function (Method, Property, Event, ListItem) {
	
		try {

            // Constructor function.
			var functionConstructor = function Type(libraryOwner) {

				try {

                    var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Immediate owning instance.
                    self.owner = libraryOwner;
                    // Backing data for this instance.
                    self.data = null;
                    // Methods owned by this Type.
                    self.methods = [];
                    // Properties owned by this Type.
                    self.properties = [];
                    // Events owned by this Type.
                    self.events = [];
                    // Hold on to ListItem associated with this instance.
                    self.listItem = null;

                    ///////////////////////////
                    // Public methods.

                    // Create instance.
                    self.create = function (objectType) {

                        try {

                            // First, save off the data.
                            self.data = objectType;

                            // Then loop over Methods and create children.
                            self.methods = [];
                            for (var i = 0; i < objectType.methods.length; i++) {

                                // Get the ith Method.
                                var objectMethodIth = objectType.methods[i];

                                // Allocate and create a new Method and add to collection.
                                var methodIth = new Method(self);
                                var exceptionRet = methodIth.create(objectMethodIth);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                                self.methods.push(methodIth);
                            }

                            // And loop over Properties and create children.
                            for (var i = 0; i < objectType.properties.length; i++) {

                                // Get the ith Property.
                                var objectPropertyIth = objectType.properties[i];

                                // Allocate and create a new Property and add to collection.
                                var propertyIth = new Property(self);
                                var exceptionRet = propertyIth.create(objectPropertyIth);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                                self.properties.push(propertyIth);
                            }

                            // And loop over Events and create children.
                            for (var i = 0; i < objectType.events.length; i++) {

                                // Get the ith Event.
                                var objectEventIth = objectType.events[i];

                                // Allocate and create a new Event and add to collection.
                                var eventIth = new Event(self);
                                var exceptionRet = eventIth.create(objectEventIth);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                                self.events.push(eventIth);
                            }

                            // Generate ListItem for this instance.
                            self.listItem = new ListItem(self.data.name);
                            self.listItem.clickHandler = self.select;
                            self.listItem.deleteHandler = m_functionDeleteHandler;
                            self.listItem.owner = self;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Select this Type.
                    self.select = function (objectReference) {

                        try {

                            // Clear the highlight in all the 
                            // other Types of the owner.
                            var exceptionRet = self.owner.unselectAllTypes();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Set the ListItem to selected.
                            self.listItem.selected = true;

                            // Set the current Type.
                            var exceptionRet = window.projectDialog.setCurrentType(self);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Load up this library into the ProjectDialog.
                            exceptionRet = window.projectDialog.loadType(self);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Select into gui.
                            return window.manager.selectType(self);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Unselect this Type.
                    self.unselect = function () {

                        // Set the ListItem to selected.
                        self.listItem.selected = false;
                        return null;
                    };

                    // Deselect all methods, properties and events.
                    self.unselectAll = function () {

                        try {

                            // Then loop over Methods and unselect them.
                            for (var i = 0; i < self.methods.length; i++) {

                                // Get the ith Method.
                                var methodIth = self.methods[i];

                                // Unselect it.
                                var exceptionRet = methodIth.unselect();
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            // Then loop over Properties and unselect them.
                            for (var i = 0; i < self.properties.length; i++) {

                                // Get the ith Properties.
                                var propertyIth = self.properties[i];

                                // Unselect it.
                                var exceptionRet = propertyIth.unselect();
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }

                            // Then loop over Events and unselect them.
                            for (var i = 0; i < self.events.length; i++) {

                                // Get the ith Event.
                                var eventIth = self.events[i];

                                // Unselect it.
                                var exceptionRet = eventIth.unselect();
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Generates JavaScript string module for this Type.
                    self.generateJavaScript = function (arrayTypes) {

                        try {

                            // Fix base type name because it still has spaces?!
                            // TODO: remove this and fix db.
                            self.data.name = self.data.name.replace(/ /g, "");

                            // Build the constructor function for the type.
                            var strConstructorFunction = //"debugger;\n\n" +
                                "window.tg." + self.owner.data.name + "." + self.data.name + " = function () {\n\n" +
                                "    // Closure.\n" +
                                "    var self = this;\n\n";

                            // Call parent constructor.
                            if (self.data.baseTypeName) {

                                // Fix base type name because it still has spaces?!
                                // TODO: remove this and fix db.
                                self.data.baseTypeName = self.data.baseTypeName.replace(/ /g, "");

                                strConstructorFunction += 
                                    "    // Inherit from Base.\n" +
                                    "    self.inherits(window.tg." + self.data.baseTypeLibraryName + "." + self.data.baseTypeName + ");\n\n";                            
                            }
                            strConstructorFunction += 
                                "    // Register with system.\n" +
                                "    if (arguments.length) { window.tg.instances.push(self); }\n\n";

                            // Add Properties.
                            if (self.properties &&
                                self.properties.legnth > 0) {

                                strConstructorFunction += 
                                    "\n" +
                                    "    /* Properties */\n\n";

                                // Loop over all Properties
                                for (var i = 0; i < self.properties.length; i++) {

                                    // Add it to the result object.
                                    strConstructorFunction += self.properties[i].generateJavaScript() + "\n";
                                }
                            }

                            // Add Events.
                            if (self.events &&
                                self.events.length > 0) {

                                strConstructorFunction += 
                                    "\n" +
                                    "    /* Events */\n\n";

                                // Loop over all Events
                                for (var i = 0; i < self.events.length; i++) {

                                    // Add it to the result object.
                                    strConstructorFunction += self.events[i].generateJavaScript() + "\n";
                                }
                            }

                            // Add Methods.
                            if (self.methods &&
                                self.methods.length > 0) {

                                strConstructorFunction += 
                                    "\n" +
                                    "    /* Methods */\n\n";

                                // Loop over all Methods
                                for (var i = 0; i < self.methods.length; i++) {

                                    // Add it to the result object.
                                    strConstructorFunction += self.methods[i].generateJavaScript() + "\n";
                                }
                            }

                            // Invoke constructor--but only if this == the type and an argument is passed.
                            strConstructorFunction += 
                                "    // Invoke construct-chain.\n" +
                                "    if ((this instanceof window.tg." + self.owner.data.name + "." + self.data.name + ") && (arguments.length)) { this.construct(); }\n"

                            strConstructorFunction += "};\n";

                            // Wire the prototype chain.
                            if (self.data.baseTypeName) {

                                strConstructorFunction += 
                                    "// Complete inheritance from base.\n" +
                                    "window.tg." + self.owner.data.name + "." + self.data.name + ".inheritsFrom(window.tg." + self.data.baseTypeLibraryName + "." + self.data.baseTypeName + ");\n\n";                            
                            }

                            // Stow.
                            arrayTypes.push(strConstructorFunction);

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Update all methods--other "types" update "in-place".
                    self.save = function () {

                        try {

                            // If there are methods, then save them up.
                            if (self.methods &&
                                self.methods.length > 0) {

                                // Loop over each method and caue it to save itself.
                                for (var i = 0; i < self.methods.length; i++) {

                                    // Add it to the result object.
                                    var exceptionRet = self.methods[i].save();
                                    if (exceptionRet) {

                                        return exceptionRet;
                                    }
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    ////////////////////////////
                    // Private methods.

                    // Invoked when the mouse is clicked over this instance's delete icon.
                    var m_functionDeleteHandler = function (objectReference) {

                        try {

                            // Delete this Type.
                            return window.projectDialog.deleteType(self);
                        } catch (e) {

                            return e;
                        }
                    };
				} catch (e) {

					alert(e.message);
				}				
			};

			return functionConstructor;
		} catch (e) {

			alert(e.message);
		}
	});