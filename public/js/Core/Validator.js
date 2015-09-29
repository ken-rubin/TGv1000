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
