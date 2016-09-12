/////////////////////
// Event module.
//
// Object manages loading and saving Event data to and  
// from the Type and also, integration with the TypeTree.
// 
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/manager/ListItem"], 
	function (ListItem) {
	
		try {

            // Constructor function.
			var functionConstructor = function Event(typeOwner) {

				try {

                    var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Immediate owning instance.
                    self.owner = typeOwner;
                    // Backing data for this instance.
                    self.data = null;
                    // Hold on to ListItem associated with this instance.
                    self.listItem = null;

                    ///////////////////////////
                    // Public methods.

                    // Create instance.
                    self.create = function (objectEvent) {

                        try {

                            // Save off the data.
                            self.data = objectEvent;

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

                    // Select this Event.
                    self.select = function () {

                        self.listItem.selected = true;
                        return m_functionClickHandler({});
                    };

                    // Unselect this Event.
                    self.unselect = function () {

                        self.listItem.selected = false;
                        return null;
                    };

                    ////////////////////////////
                    // Private methods.

                    // Invoked when the mouse is clicked over this instance.
                    var m_functionClickHandler = function (objectReference) {

                        try {

                            // Clear the highlight in all the 
                            // other instances of the owner.
                            var exceptionRet = self.owner.unselectAll();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Set the ListItem to selected.
                            self.listItem.selected = true;

                            // Set the current Type.
                            var exceptionRet = window.projectDialog.setCurrentEvent(self);
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Set center panel to this instance.
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is clicked over this instance's delete icon.
                    var m_functionDeleteHandler = function (objectReference) {

                        try {

                            // Delete this Type.
                            return window.projectDialog.deleteEvent(self);
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