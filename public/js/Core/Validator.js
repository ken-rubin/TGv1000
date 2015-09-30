///////////////////////////////
// Validator module is used to validate names of Types, Tool Instances, Methods, Properties and Events.
// It is used for new items and renames.
//
// Return constructor function.
//

// Define module and require dependencies.
define(["Core/errorHelper"],
	function (errorHelper) {

		try {

			// Define the client constructor function.
			var functionConstructor = function Validator() {

				try {

					var self = this;		// Uber closure.

					//////////////////////////////
					// Public properties.

					// The methods that check names will not return the usual true or false.
					// Rather, the will return an Error instance containing the actual text to show the user or null.


					//////////////////////////////
					// Public methods.

					// Start off the validator.
					self.create = function () {

						try {

							return null;

						} catch (e) {

							return e;
						}
					};

					self.checkReservedWords = function(strName) {

						if ($.inArray(strName, m_reservedWords) > -1) {

							return new Error(strName + " is a reserved word. Please choose a different name.");
						}

						return null;
					}

					self.checkTypeNames = function(strName, excludeThisTypeName) {

						var activeClComic = comics.getActiveComic();
						if (activeClComic) {

							var typesArray = activeClComic.getYourTypesArray();
							if (typesArray) {

								for (var i = 0; i < typesArray.length; i++) {

									var typeIth = typesArray[i];	// no data member
									if (strName === typeIth.name && excludeThisTypeName !== typeIth.name) {

										return new Error("That is the name of one of your Types. Please choose a different name.");
									}
								}
							}
						}

						return null;
					}

					self.checkReservedChars = function(strName) {


						return null;
					}

					// Tool instance name is being changed in PropertyGrid dialog or Type name is being check in comics. Is new name available?
					self.isToolInstanceIdAvailable = function (strId) {

						var toolInstances = designer.getToolInstanceArray();
						if (toolInstances) {

							for (var i = 0; i < toolInstances.length; i++) {

								if (strId === toolInstances[i].id) {

									return new Error("That is the name of one of your tool instances. Please enother a different name.");
								}
							}
						}

						return null;
					}

					//////////////////////////////
					// Moved from Types.js
					//////////////////////////////
//incomplete
					self.isEventNameAvailableInActiveType = function(strName, myIndex) {

						// If myIndex === -1, it means we're adding, and we have to check the whole array.
						// Else, we have to skip array[myIndex]
						for (var i = 0; i < m_clTypeActive.data.events.length; i++) {

							if (i !== myIndex) {

								var eventIth = m_clTypeActive.data.events[i];
								if (eventIth.name === strName) {

									return false;
								}
							}
						}

						return true;
					}

//incomplete
					self.isMethodNameAvailableInActiveType = function(strName, myIndex) {

						// If myIndex === -1, it means we're adding, and we have to check the whole array.
						// Else, we have to skip array[myIndex]
						for (var i = 0; i < m_clTypeActive.data.methods.length; i++) {

							if (i !== myIndex) {

								var methodIth = m_clTypeActive.data.methods[i];
								if (methodIth.name === strName) {

									return false;
								}
							}
						}

						return true;
					}

//incomplete
					self.isPropertyNameAvailableInActiveType = function(strName, myIndex) {

						// If myIndex === -1, it means we're adding, and we have to check the whole array.
						// Else, we have to skip array[myIndex]
						for (var i = 0; i < m_clTypeActive.data.properties.length; i++) {

							if (i !== myIndex) {

								var propertyIth = m_clTypeActive.data.properties[i];
								if (propertyIth.name === strName) {

									return false;
								}
							}
						}

						return true;
					}

					//////////////////////////////
					// Moved from Client.js
					//////////////////////////////
//incomplete
					self.isComicNameAvailable = function(strName) {

						if (m_clProject) {

							for (var i = 0; i < m_clProject.data.comics.items.length; i++) {

								var comicIth = m_clProject.data.comics.items[i];
								if (comicIth.name === strName) {

									return false;
								}

								return true;
							}
						}

						return false;
					}

//incomplete
					self.isTypeNameAvailableInActiveComic = function(strName, myIndex) {

						return comics.isTypeNameAvailableInActiveComic(strName, myIndex);
					}

//incomplete
					self.isEventNameAvailableInActiveType = function(strName, myIndex) {

						return types.isEventNameAvailableInActiveType(strName, myIndex);
					}

//incomplete
					self.isMethodNameAvailableInActiveType = function(strName, myIndex) {

						return types.isMethodNameAvailableInActiveType(strName, myIndex);
					}

//incomplete
					self.isPropertyNameAvailableInActiveType = function(strName, myIndex) {

						return types.isPropertyNameAvailableInActiveType(strName, myIndex);
					}

					//////////////////////////////
					// Moved from Comics.js
					//////////////////////////////
//incomplete
					self.isTypeNameAvailableInActiveComic = function(strName, myIndex) {

						// Check for reserved names
						if ($.inArray(strName, ['X','Y', 'Width', 'Height']) > -1) {

							return "X, Y, Width and Height are reserved words and cannot be used as a Type name.";
						}

						// Check against existing types
						// If myIndex === -1, it means we're adding, and we have to check the whole array.
						// Else, we have to skip array[myIndex]
						for (var i = 0; i < m_clComicActive.data.types.items.length; i++) {

							if (i !== myIndex) {

								var typeIth = m_clComicActive.data.types.items[i];	// No data property.
								if (typeIth.name === strName) {

									return "That name is already in use. Please enter another.";
								}
							}
						}

						// Check against existing Tool Instances.
						var exceptionRet = validator.isToolInstanceIdAvailable(strName);
						if (exceptionRet) {

							return exceptionRet.message;
						}

						return "";
					}


					//////////////////////////////
					// Private methods

					//////////////////////////////
					// Private variables.
					var m_reservedWords = ['X','Y','Width','Height'];
					var m_reservedChars = ['"'];

				} catch (e) { errorHelper.show(e); }
			};

			// Return constructor function.
			return functionConstructor;

		} catch (e) {

			errorHelper.show(e);
		}
	});
