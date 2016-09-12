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
    "NextWave/source/manager/ListItem"], 
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
                            self.listItem.clickHandler = m_functionClickHandler;
                            self.listItem.deleteHandler = m_functionDeleteHandler;
                            self.listItem.owner = self;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Select this Type.
                    self.select = function () {

                        // Set the ListItem to selected.
                        self.listItem.selected = true;
                        return m_functionClickHandler({});
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

                    ////////////////////////////
                    // Private methods.

                    // Invoked when the mouse is clicked over this instance.
                    var m_functionClickHandler = function (objectReference) {

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
                            return window.projectDialog.loadType(self);
                        } catch (e) {

                            return e;
                        }
                    };

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