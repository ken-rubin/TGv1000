/////////////////////
// Library module.
//
// Object manages loading and saving Library data to and  
// from the Comic and also, integration with the TypeTree.
// 
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/project/Type",
    "NextWave/source/manager/ListItem"], 
	function (Type, ListItem) {
	
		try {

            // Constructor function.
			var functionConstructor = function Library(comicOwner) {

				try {

                    var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Immediate owning instance.
                    self.owner = comicOwner;
                    // Backing data for this instance.
                    self.data = null;
                    // Types owned by this Library.
                    self.types = [];
                    // Hold on to ListItem associated with this instance.
                    self.listItem = null;

                    ///////////////////////////
                    // Public methods.

                    // Create instance.
                    self.create = function (objectLibrary) {

                        try {

                            // First, save off the data.
                            self.data = objectLibrary;

                            // Then loop over Types and create children.
                            for (var i = 0; i < objectLibrary.types.length; i++) {

                                // Get the ith Type.
                                var objectTypeIth = objectLibrary.types[i];

                                // Allocate and create a new Type and add to collection.
                                var typeIth = new Type(self);
                                var exceptionRet = typeIth.create(objectTypeIth);
                                if (exceptionRet) {

                                    return exceptionRet;
                                }
                                self.types.push(typeIth);
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

                    // Select this Library.
                    self.select = function () {

                        // Set the ListItem to selected.
                        self.listItem.selected = true;
                        return m_functionClickHandler({});
                    };

                    // De-select this Library.
                    self.unselect = function () {

                        self.listItem.selected = false;
                        return null;
                    };

                    // Clear out the selection in all the associated Types.
                    self.unselectAllTypes = function () {

                        try {

                            // Then loop over Types and unselect them.
                            for (var i = 0; i < self.types.length; i++) {

                                // Get the ith Library.
                                var typeIth = self.types[i];

                                // Unselect it.
                                var exceptionRet = typeIth.unselect();
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
                            // other Libraries of the owner.
                            var exceptionRet = self.owner.unselectAllLibraries();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Set the ListItem to selected.
                            self.listItem.selected = true;

                            // Set the current library.
                            var exceptionRet = window.projectDialog.setCurrentLibrary(self);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Load up this library into the ProjectDialog.
                            return window.projectDialog.loadLibrary(self);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is clicked over this instance's delete icon.
                    var m_functionDeleteHandler = function (objectReference) {

                        try {

                            // Delete this library.
                            return window.projectDialog.deleteLibrary(self);
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