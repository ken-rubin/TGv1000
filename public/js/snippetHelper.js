///////////////////////////////////////
// SnippetHelper -- wraps the ugly code necessary to inject a snippet 
// and require the concamitant client-side event handler module.
// 
// Return singleton instance.
//

define(["errorHelper"], function (errorHelper) {
	
	try {

		var functionSnippetHelper = function SnippetHelper() {

			try {

				var self = this;				// Uber closure.

				// Expose method which wraps the necessary functionality to inject.
				// Parameters:
				// objectContext, which is an arbitrary object passed from the caller to the callee.
				// htmlData, which is the snippet of HTML code.
				// strWellSelector, which references the object into which the code snippet in injected.
				// strModuleDefinitionElementSelector, which references the element that holds  
				//	the data-module attribute which specifies the name of the module to require.
				self.process = function (objectContext, htmlData, strWellSelector, strModuleDefinitionElementSelector) {

					try {

						// Clear out the TypeWell.
						$(strWellSelector).empty();

						// Add snippet into the well.
						$(strWellSelector).append(htmlData);

						// Extract out the data- attribute 
						// which specifiesthe name of the 
						// module to require to handle the 
						// events and behavior for this snippet of code.
						var strModule = $(strModuleDefinitionElementSelector).attr("data-module");

						// Require the specified module, and...
						require([strModule], function (module) {

							try {

								// ...allocate and create.
								var moduleInstance = new module();
								var exceptionRet = moduleInstance.create(objectContext);
								if (exceptionRet) {

									throw exceptionRet;
								}
							} catch (e) {

								errorHelper.show(e.message);
							}
						})

						return null;
					} catch (e) {

						return e;
					}
				};
			} catch (e) {

				errorHelper.show(e.message);
			}
		}

		return new functionSnippetHelper();
	} catch (e) {

		errorHelper.show(e.message);
	}
});