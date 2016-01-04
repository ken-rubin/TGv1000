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

					// The methods that check names will return an Error instance containing the actual text to show the user--or null.

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

						var strRegexCharsRequiringEscaping = ".\\+*?[^]$(){}=!<>|:-";

						var strRegex = "";
						m_reservedChars.forEach(function(char) {

							if (strRegex.length > 0) {

								strRegex += "|";	// Or
							}

							if (strName.indexOf(char) > -1) {

								// The char is reserved and requires escaping.
								strRegex += "\\" + char;

							} else {

								// Char isn't reserved and can just be added.
								strRegex += char;
							}
						});

						var re = new RegExp(strRegex);
						if (re.test(strName)) {

							return new Error("Your name contains a character that is not allowed. Reserved characters are: " + m_reservedChars.join() + ".");
						}

						return null;
					}

					// Tool instance name is being changed in PropertyGrid dialog or Type name is being check in comics. Is new name available?
					self.isToolInstanceIdAvailable = function (strId) {

						var toolInstances = designer.getToolInstanceArray();
						if (toolInstances) {

							for (var i = 0; i < toolInstances.length; i++) {

								if (strId === toolInstances[i].id) {

									return new Error("That is the name of one of your tool instances. Please enter a different name.");
								}
							}
						}

						return null;
					}

					self.isEventNameAvailableInActiveType = function(strName, myIndex) {

						// If myIndex === -1 (or isn't present), it means we're adding, and we have to check the whole array.
						// Else, we have to skip array[myIndex] since we're editing.
						myIndex = myIndex || -1;

						var clTypeActive = types.getActiveClType();
						if (clTypeActive) {

							for (var i = 0; i < clTypeActive.data.events.length; i++) {

								if (i !== myIndex) {

									var eventIth = clTypeActive.data.events[i];
									if (eventIth.name === strName) {

										return new Error("That name is already used for an event in this type. Please enter another.");
									}
								}
							}
						}

						return null;
					}

					self.isMethodNameAvailableInActiveType = function(strName, myIndex) {

						// If myIndex === -1, it means we're adding, and we have to check the whole array.
						// Else, we have to skip array[myIndex] since we're editing.
						myIndex = myIndex || -1;

						var clTypeActive = types.getActiveClType();
						if (clTypeActive) {

							for (var i = 0; i < clTypeActive.data.methods.length; i++) {

								if (i !== myIndex) {

									var methodIth = clTypeActive.data.methods[i];
									if (methodIth.name === strName) {

										return new Error("That name is already used for a method in this type. Please enter another.");
									}
								}
							}
						}

						return null;
					}

					self.isPropertyNameAvailableInActiveType = function(strName, myIndex) {

						// If myIndex === -1, it means we're adding, and we have to check the whole array.
						// Else, we have to skip array[myIndex] since we're editing.
						myIndex = myIndex || -1;

						var clTypeActive = types.getActiveClType();
						if (clTypeActive) {

							for (var i = 0; i < clTypeActive.data.properties.length; i++) {

								if (i !== myIndex) {

									var propertyIth = clTypeActive.data.properties[i];
									if (propertyIth.name === strName) {

										return new Error("That name is already used for a property in this type. Please enter another.");
									}
								}
							}
						}

						return null;
					}

					self.isComicNameAvailable = function(strName) {

						var clProject = client.getProject();
						if (clProject) {

							for (var i = 0; i < clProject.data.comics.items.length; i++) {

								var comicIth = clProject.data.comics.items[i];
								if (comicIth.name === strName) {

										return new Error("That name is already used for a comic in this project. Please enter another.");
								}
							}
						}

						return null;
					}

					self.isTypeNameAvailableInActiveComic = function(strName, myIndex) {

						// Check for reserved names
						if ($.inArray(strName, ['X','Y', 'Width', 'Height']) > -1) {

							return new Error("X, Y, Width and Height are reserved words and cannot be used as a Type name.");
						}

						var clComicActive = comics.getActiveComic();

						if (clComicActive) {

							// Check against existing types
							// If myIndex === -1, it means we're adding, and we have to check the whole array.
							// Else, we have to skip array[myIndex]
							for (var i = 0; i < clComicActive.data.types.items.length; i++) {

								if (i !== myIndex) {

									var typeIth = clComicActive.data.types.items[i];	// No data property.
									if (typeIth.name === strName) {

										return new Error("That name is already in use. Please enter another.");
									}
								}
							}
						}

						// Check against existing Tool Instances.
						return self.isToolInstanceIdAvailable(strName);
					}

					self.isTypeNameAvailableForSystemType = function(strName, myIndex) {

						// Check for reserved names
						if ($.inArray(strName, ['X','Y', 'Width', 'Height']) > -1) {

							return new Error("X, Y, Width and Height are reserved words and cannot be used as a Type name.");
						}

						var clComicActive = comics.getActiveComic();

						if (clComicActive) {

							// Check against existing types
							// If myIndex === -1, it means we're adding, and we have to check the whole array.
							// Else, we have to skip array[myIndex].
							// Also, just check against other STs (ordinal===10000).
							for (var i = 0; i < clComicActive.data.types.items.length; i++) {

								var typeIth = clComicActive.data.types.items[i];	// No data property of typeIth.
								if (i !== myIndex && typeIth.ordinal === 10000 && typeIth.name === strName) {

									return new Error("That name is already in use. Please enter another.");
								}
							}
						}

						// Check against existing Tool Instances.
						return self.isToolInstanceIdAvailable(strName);
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
