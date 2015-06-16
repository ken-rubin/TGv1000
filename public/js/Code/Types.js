/////////////////////////////////////////
// Types
//
// Returns constructor functions.
//

// Define AMD module.
define(["Core/errorHelper", "Code/Type", "Core/ScrollRegion2", "Core/resourceHelper"],
	function (errorHelper, Type, ScrollRegion, resourceHelper) {

		try {

			// Define Types constructor function. 
			var functionConstructor = function Types() {

				try {

					var self = this;			// Uber closure.

					///////////////////////////////////
					// Public properties.

					// Selector to DOM element to wrap.
					self.rowSelector = "#typestriprow";
					// Selector to DOM element to wrap.
					self.selector = "#typestrip";

					///////////////////////////////////
					// Public methods.

					// Create the Type strip.
					// Attach to specified element.
					self.create = function () {

						try {

							// Attach scrollableregion.
							m_srTypeStrip = new ScrollRegion();
							var exceptionRet = m_srTypeStrip.create(
								"#typestrip",		// inner row selector
								200,				// item width
								function() {}		// functionClick
							);
							
						} catch (e) {

							return e;
						}
					};

					// Loop over all Types, indicate if the specified
					// string is found in any of their workspaces.
					// Returns the method referenced or null.
					self.isReferencedInWorkspace = function (strTest) {

						// Loop over the collection of types.
						for (var i = 0; i < m_arrayTypes.length; i++) {

							var typeIth = m_arrayTypes[i];

							// Get the method which references the string, if any.
							var methodReferenced = typeIth.isReferencedInWorkspace(strTest);
							if (methodReferenced) {

								return methodReferenced;
							}
						}

						return null;
					};

					// Loop over all Types, update any occurrences  
					// of the specified unique proper string.
					self.replaceInWorkspaces = function (strOld, strNew) {

						try {

							// Loop over the collection of types.
							for (var i = 0; i < m_arrayTypes.length; i++) {

								var typeIth = m_arrayTypes[i];

								// Get the method which references the string, if any.
								var exceptionRet = typeIth.replaceInWorkspaces(strOld, 
									strNew);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					// Remove item from DOM and state.
					self.removeItem = function (type) {

						try {

							// Remove the type from the collection of types.
							for (var i = 0; i < m_arrayTypes.length; i++) {

								// Splice on match.
								if (m_arrayTypes[i] === type) {

									m_arrayTypes.splice(i, 1);
									break;
								}
							}

							// Remove form GUI.
							var exceptionRet = type.destroy();
							if (exceptionRet) {

								throw exceptionRet;
							}

							// Remove from tools.
							return tools.removeItem(type);

						} catch (e) {

							return e;
						}
					};

					// Load the Type strip item collection.
					self.load = function (objectData) {

						try {

							// First destroy.
							m_srTypeStrip.empty();

							// And the collection.
							m_arrayTypes = [];

							// Create the add button.
							// var exceptionRet = m_functionCreateAddButton();
							// if (exceptionRet) {

							// 	throw exceptionRet;
							// }

							// Loop over items and insert into the DOM.
							for (var i = 0; i < objectData.items.length; i++) {

								// Extract the item (type).
								var itemIth = objectData.items[i];

								// Allocate the type object which holds/wrapps the data.
								var typeIth = new Type();
								exceptionRet = typeIth.load(itemIth);
								if (exceptionRet) {

									throw exceptionRet;
								}

						        // Add the type.
								exceptionRet = self.addItem(typeIth);
								if (exceptionRet) {

									throw exceptionRet;
								}

						        // Also add to the designer/tool strip.
								exceptionRet = tools.addItem(typeIth);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					// Unload.
					self.unload = function () {

						try {

							for (var i = 0; i < m_arrayTypes.length; i++) {

								var itemIth = m_arrayTypes[i];
								var exceptionRet = self.removeItem(itemIth);
							}

							m_srTypeStrip.empty();
							m_arrayTypes = [];

							return null;

						} catch (e) {

							return e;
						}
					}

					// Add Type to strip.
					self.addItem = function (type) {

						try {

							// Define object prototype.
							var jItem = type.generateDOM();

							// Add to the DOM.
							m_srTypeStrip.addItem(jItem);

							// Also add to the collection of comics.
							m_arrayTypes.push(type);

							// Also add to code.
							return code.addType(type);
							
						} catch (e) {

							return e;
						}
					};

					// Specify the active type.  Called from 
					// a type when a member button is clicked.
					self.select = function (typeActive) {

						try {

							m_typeActive = typeActive;
						} catch (e) {

							return e;
						}
					};

					self.getLength = function () {

						return m_arrayTypes.length;
					}

					// Update the blockly data in the active type/method.
					self.update = function (strWorkspace, strMethod) {

						try {

							// Drop out if no active item.
							if (!m_typeActive) {

								return null;
							}

							// Else, update the type.
							return m_typeActive.update(strWorkspace,
								strMethod);
						} catch (e) {

							return e;
						}
					};

					///////////////////////////////////
					// Private methods.

					// Invoked when the types dialog exist newly.
					var m_functionNewType = function () {

						try {

				    		// Allocate project.
				    		var type = new Type();
				    		var exceptionRet = type.load({ 

	    						properties: [],
	    						methods: [],
	    						events: [],
	    						dependencies: [],
	    						name: "new type",
	    						id: m_arrayTypes.length + 1,
	    						resourceId: 3
				    		});
				    		if (exceptionRet) {

				    			return exceptionRet;
				    		}

				    		// Add the type.
							exceptionRet = self.addItem(type);
							if (exceptionRet) {

								throw exceptionRet;
							}

					        // Also add to the designer/tool strip.
							exceptionRet = tools.addItem(type);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							return e;
						}
					};

					// Invoked when the types dialog exist clonely.
					// var m_functionCloneType = function (strId) {

					// 	try {

				 //    		BootstrapDialog.alert(":Clone " + strId + " type....");

					// 		return null;
					// 	} catch (e) {

					// 		return e;
					// 	}
					// };

					// Create a new type.
					// var m_functionAddNewType = function (e) {

					// 	try {

					// 		// Show the types dialog.
					// 		var exceptionRet = client.showTypesDialog(m_functionNewType,
					// 			m_functionCloneType);
					// 		if (exceptionRet) {

					// 			throw exceptionRet;
					// 		}
					// 	} catch (e) {

					// 		errorHelper.show(e);
					// 	}
					// };

					// Create the add button.
					// var m_functionCreateAddButton = function () {

					// 	try {

					// 		var jAdd = $("<img class='typestripitem' id='AddType' src='" +
					// 			resourceHelper.toURL('images', null, null, 'plus.png') +
					// 			"'></img>");

					// 		// Add to the DOM.
					// 		m_jStrip.append(jAdd);

					// 		jAdd.click(m_functionAddNewType);

					// 		return null;
					// 	} catch (e) {

					// 		return e;
					// 	}
					// };

					///////////////////////////////////
					// Private fields.

					// The container for the strip items.
					var m_arrayTypes = [];
					// Active item.
					var m_typeActive = null;
				} catch (e) {

					errorHelper.show(e);
				}
			};

			// Return the constructor function.
			return functionConstructor;
		} catch (e) {

			errorHelper.show(e);
		}
	});
