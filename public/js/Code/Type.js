///////////////////////////////
// Type.  A sort of thing.
//
// Return constructor function.
//

// 
define(["Core/errorHelper", "Core/resourceHelper"],
	function (errorHelper, resourceHelper) {

		try {

			// Define the type constructor function.
			var functionConstructor = function Type() {

				try {

					var self = this;		// Uber closure.

					/////////////////////////////
					// Public properties.

					// The data this instance wrapps.
					// Schema:
					// add -- indicates this is the addtype type.
					// app -- indicates this is the app type.
					// properties -- collection of properties of type.
					// methods -- collection of methods of type.
					// events -- collection of events of type.
					// dependencies -- collection of dependencies of type.
					// id -- the DB id of type.
					// name -- the name of type.
					// resourceId -- the resource id.
					self.data = null;

					// Height of a line in the GUI in pixlels.
					self.lineHeight = 30;
					// Height of a button in the GUI in pixlels.
					self.buttonHeight = 26;

					/////////////////////////////
					// Public methods.

					// Create this instance.
					self.load = function (objectData) {

						try {

							// Save data.
							self.data = objectData;

							// process properties methods events and dependencies collections.

							return null;
						} catch (e) {

							return e;
						}
					};

					// Return the DOM element representing a prototypical item.
					self.generateDOM = function () {

						// Allocate the type.
						m_jType = $("<div id='" + 
							self.data.name + 
							"' class='typestripitem' style='background:black;'></div>");

						// Add the contents to the newly allocated type.
						var exceptionRet = m_functionGenerateTypeContents();
						if (exceptionRet) {

							throw exceptionRet;
						}

						return m_jType;
					};
				} catch (e) {

					errorHelper.show(e);
				};

				///////////////////////////////////////
				// Private methods

				// Helper method builds or rebuilds the type contents and replaces the types contents.
				var m_functionGenerateTypeContents = function () {

					try {

						// Start empty.
						m_jType.empty();

						// Generate the name to add to the type.
						var jTypeName = $("<div style='position:absolute;left:8px;top:8px;right:72px'>" + 
							self.data.name + 
							"</div>");
						m_jType.append(jTypeName);

						// Generate the image for the type.
						var jTypeImage = $("<img src='" + 
							resourceHelper.toURL(self.data.resourceId) + 
							"' style='position:absolute;width:64px;top:8px;height:64px;right:8px'></img>");
						m_jType.append(jTypeImage);

						/////////////////////////
						// Properties.
						var jTypeProperties = $("<div style='color:rgb(250,250,200);position:absolute;left:8px;top:72px;right:8px;height:" + 
							self.buttonHeight + 
							"px;'>" + 
							"properties" + 
							"</div>");
						m_jType.append(jTypeProperties);

						// Add Properties.
						var jTypeAddProperties = $("<button class='typebutton' style='color:rgb(250,250,200);position:absolute;left:8px;top:102px;right:8px;height:" +
							self.buttonHeight +
							"px;width:26px;'>" + 
							"<img class='typestripitem' id='AddType' style='position:absolute;left:0px;top:0px;width:24px;height:24px;' src='" +
							resourceHelper.toURL(2) +
							"'></img>" + 
							"</button>");
						m_jType.append(jTypeAddProperties);
						jTypeAddProperties.click(m_functionAddPropertyClick);

						// Loop over and add the properties.
						var iCursorY = 132;
						for (var i = 0; i < self.data.properties.length; i++) {

							var propertyIth = self.data.properties[i];

							// Add the property.
							var jTypeProperty = $("<button class='typebutton' style='color:rgb(250,250,200);position:absolute;left:8px;top:" + 
								iCursorY +
								"px;right:8px;height:" + 
								self.buttonHeight + 
								"px;'>" + 
								propertyIth.name + 
								"</button>");
							m_jType.append(jTypeProperty);

							// Move to the next row.
							iCursorY += self.lineHeight;
						}

						/////////////////////////
						// Space before methods.
						iCursorY += self.lineHeight;

						// Methods.
						var jTypeMethods = $("<div style='position:absolute;left:8px;top:" + 
							iCursorY + 
							"px;right:8px;height:" + 
							self.buttonHeight + 
							"px;'>" + 
							"methods" + 
							"</div>");
						m_jType.append(jTypeMethods);
						iCursorY += self.lineHeight;

						// Add Methods.
						var jTypeAddMethods = $("<button class='typebutton' style='color:rgb(250,250,200);position:absolute;left:8px;top:" + 
							iCursorY + 
							"px;right:8px;height:" +
							self.buttonHeight +
							"px;width:26px;'>" + 
							"<img class='typestripitem' id='AddType' style='position:absolute;left:0px;top:0px;width:24px;height:24px;' src='" +
							resourceHelper.toURL(2) +
							"'></img>" + 
							"</button>");
						m_jType.append(jTypeAddMethods);
						iCursorY += self.lineHeight;
						jTypeAddMethods.click(m_functionAddMethodClick);

						// Loop over and add the methods.
						for (var i = 0; i < self.data.methods.length; i++) {

							var methodIth = self.data.methods[i];

							// Add the property.
							var jTypeMethod = $("<button class='typebutton' style='position:absolute;left:8px;top:" + 
								iCursorY +
								"px;right:8px;height:" + 
								self.buttonHeight + 
								"px;'>" + 
								methodIth.name + 
								"</button>");
							m_jType.append(jTypeMethod);

							// Move to the next row.
							iCursorY += self.lineHeight;
						}

						/////////////////////////
						// Space before events.
						iCursorY += self.lineHeight;

						// Events.
						var jTypeEvents = $("<div style='color:rgb(250,250,200);position:absolute;left:8px;top:" + 
							iCursorY + 
							"px;right:8px;height:" + 
							self.buttonHeight + 
							"px;'>" + 
							"events" + 
							"</div>");
						m_jType.append(jTypeEvents);
						iCursorY += self.lineHeight;

						// Add Events.
						var jTypeAddEvents = $("<button class='typebutton' style='color:rgb(250,250,200);position:absolute;left:8px;top:" + 
						 	iCursorY + 
						 	"px;right:8px;height:" +
							self.buttonHeight +
							"px;width:26px;'>" + 
							"<img class='typestripitem' id='AddType' style='position:absolute;left:0px;top:0px;width:24px;height:24px;' src='" +
							resourceHelper.toURL(2) +
							"'></img>" + 
							"</button>");
						m_jType.append(jTypeAddEvents);
						iCursorY += self.lineHeight;
						jTypeAddEvents.click(m_functionAddEventClick);

						// Loop over and add the events.
						for (var i = 0; i < self.data.events.length; i++) {

							var eventsIth = self.data.events[i];

							// Add the Events.
							var jTypeEvent = $("<button class='typebutton' style='color:rgb(250,250,200);position:absolute;left:8px;top:" + 
								iCursorY +
								"px;right:8px;height:" + 
								self.buttonHeight + 
								"px;'>" + 
								eventsIth.name + 
								"</button>");
							m_jType.append(jTypeEvent);

							// Move to the next row.
							iCursorY += self.lineHeight;
						}
						return null;
					} catch (e) {

						return e;
					}
				};

				// Invoked when the add property button is clicked in this type.
				var m_functionAddPropertyClick = function (e) {

					try {

						self.data.properties.push({ name: "new property", codeDOM: "" });

						// Add the contents to the newly allocated type.
						var exceptionRet = m_functionGenerateTypeContents();
						if (exceptionRet) {

							throw exceptionRet;
						}
					} catch (e) {

						errorHelper.show(e);
					}
				};

				// Invoked when the add method button is clicked in this type.
				var m_functionAddMethodClick = function (e) {

					try {

						self.data.methods.push({ name: "new method", codeDOM: "" });

						// Add the contents to the newly allocated type.
						var exceptionRet = m_functionGenerateTypeContents();
						if (exceptionRet) {

							throw exceptionRet;
						}
					} catch (e) {

						errorHelper.show(e);
					}
				};

				// Invoked when the add event button is clicked in this type.
				var m_functionAddEventClick = function (e) {

					try {

						self.data.events.push({ name: "new event", codeDOM: "" });

						// Add the contents to the newly allocated type.
						var exceptionRet = m_functionGenerateTypeContents();
						if (exceptionRet) {

							throw exceptionRet;
						}
					} catch (e) {

						errorHelper.show(e);
					}
				};

				///////////////////////////////////////
				// Private fields.

				// The root GUI container object.
				var m_jType = null;
			};

			return functionConstructor;
		} catch (e) {

			errorHelper.show(e);
		}
	});
