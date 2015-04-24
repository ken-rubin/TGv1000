/////////////////////////////////////////
// TypeStrip
//
// Returns constructor functions.
//

// Define AMD module.
define(["Core/errorHelper", "Code/Type", "Core/ScrollRegion", "Core/resourceHelper"],
	function (errorHelper, Type, ScrollRegion, resourceHelper) {

		try {

			// Define TypeStrip constructor function. 
			var functionConstructor = function TypeStrip() {

				try {

					var self = this;			// Uber closure.

					///////////////////////////////////
					// Public properties.

					// Selector to DOM element to wrap.
					self.rowSelector = "#typestriprow";
					// Selector to DOM element to wrap.
					self.selector = "#typestrip";
					// Width of item.
					self.itemWidth = 200;

					///////////////////////////////////
					// Public methods.

					// Create the Type strip.
					// Attach to specified element.
					self.create = function () {

						try {

							// Get a j-reference to the scroll container element.
							m_jStrip = $(self.selector);

							// Attach scrollableregion.
							m_srTypeStrip = new ScrollRegion();
							return m_srTypeStrip.attach(self.rowSelector);
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

							// Remove from toolStrip.
							return toolStrip.removeItem(type);
						} catch (e) {

							return e;
						}
					};

					// Load the Type strip item collection.
					self.load = function (objectData) {

						try {

							// First destroy.
							m_jStrip.empty();

							// And the collection.
							m_arrayTypes = [];

							// Create the add button.
							var exceptionRet = m_functionCreateAddButton();
							if (exceptionRet) {

								throw exceptionRet;
							}

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
								exceptionRet = toolStrip.addItem(typeIth);
								if (exceptionRet) {

									throw exceptionRet;
								}
							}

							return null;
						} catch (e) {

							return e;
						}
					};

					// Add Type to strip.
					self.addItem = function (type) {

						try {

							// Define object prototype.
							var jItem = type.generateDOM();

							// Set its position.
							jItem.css({

								left: ((m_arrayTypes.length + 1) * self.itemWidth) + "px"
							});

							// Add to the DOM.
							m_jStrip.append(jItem);

							// Also add to the collection of comics.
							m_arrayTypes.push(type);

							return null;
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
							exceptionRet = toolStrip.addItem(type);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							return e;
						}
					};

					// Invoked when the types dialog exist clonely.
					var m_functionCloneType = function (strId) {

						try {

				    		BootstrapDialog.alert(":Clone " + strId + " type....");

							return null;
						} catch (e) {

							return e;
						}
					};

					// Create a new type.
					var m_functionAddNewType = function (e) {

						try {

							// Show the types dialog.
							var exceptionRet = client.showTypesDialog(m_functionNewType,
								m_functionCloneType);
							if (exceptionRet) {

								throw exceptionRet;
							}
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Create the add button.
					var m_functionCreateAddButton = function () {

						try {

							var jAdd = $("<img class='typestripitem' id='AddType' src='" +
								resourceHelper.toURL(2) +
								"'></img>");

							// Add to the DOM.
							m_jStrip.append(jAdd);

							jAdd.click(m_functionAddNewType);

							return null;
						} catch (e) {

							return e;
						}
					};

					///////////////////////////////////
					// Private fields.

					// The container for the strip items.
					var m_jStrip = null;
					// Collection of type items.
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
