///////////////////////////////
// Project.  A new, opened or cloned project.
//
// Return constructor function.
//

// 
define(["Core/errorHelper", "Navbar/Comics"],
	function (errorHelper, Comics) {

		try {

			// Define the project constructor function.
			var functionConstructor = function Project() {

				try {

					var self = this;		// Uber closure.

					/////////////////////////////
					// Public properties.

					self.data = null;

					//////////////////////////////
					// Public methods.

					// Attach GUI wrappers.
					self.load = function (project) {

						try {

							self.data = project;

							client.setBrowserTabAndBtns();

							return comics.load(self.data.comics);	// the global object

						} catch (e) {

							return e;
						}
					};

					self.addType = function(clType) {

						try {

							return comics.addTypeToActiveComic(clType);

						} catch (e) {

							return e;
						}
					}

					// Make like there's no project, because there soon won't be.
					// It's meant to be the opposite of self.load.
					self.unload = function () {

						try {

							var exceptionRet = comics.unload();	// the global object
							if (exceptionRet) { throw exceptionRet; }

							self.data = null;

							// exceptionRet = code.reset(true);
							// if (exceptionRet) { throw exceptionRet; }

							// return designer.unload();

							return null;

						} catch(e) {

							return e;
						}
					}

					// The following will not be called with any gaps or errors in the Project's structure.
					// All images are already resources with their id's in the items in the Project. Etc.
					self.saveToDatabase = function (bChangeableName, callback) {

						try {

							// Retrieve content of manager (in its own abridged format) for updating into active comic.
							var objContent = manager.save();
							// objContent looks like:
							// {
							// 	 types:[
							// 		{
							// 			name:"cc",
							// 			methods:[
							//				name:"zzz",
							//				arguments:[{name:"abc"},...,{name:"cab"}],
							//				statements:[{},...,{}]
							//			],
							// 			properties:[{name:"abc"}],
							// 			events:[{name:"pop"}]
							// 		}
							// 	 ],
							// 	 statements:["statementA",...,"statementZ"],
							// 	 expressions:["expressionA",...,"expressionZ"],
							// 	 literals:["literalA",...,"literalZ"]
							// }

							// TODO: We're doing this for only 1 comic ([0]). Eventually, we'll loop through all comics by surrounding the async.parallel with async.eachSeries.
							var comic = comics.getComic(0).data;

							async.parallel(
								[
									// Handle expressions, statements and literals.
									function(cb) {
										async.setImmediate(
											function() {
							                    
							                    // In most cases expressions, statements and literals won't have changed, but, just in case....
							                    comic.expressions.items = [];
							                    comic.expressions.items.push.apply(clComic.data.expressions.items, objContent.expressions);
							                    comic.statements.items = [];
							                    comic.statements.items.push.apply(clComic.data.statements.items, objContent.statements);
							                    comic.literals.items = [];
							                    comic.literals.items.push.apply(clComic.data.literals.items, objContent.literals);
							                    return cb(null);
											}
										);
									},
									// Handle types.
									function(cb) {
										async.eachSeries(
											comic.types.items,
											function(typeIth, cb) {

											},
											function(err) {
												return cb(err);
											}
										)
									}
								],
								function(err) { 
									if ($.isFunction(callback)) {
										callback(err.message);
									} else {
										errorHelper.show(err);
									}
								}
							);

							/*

							// The types, statements, expressions and literals in objContent have to be massaged and merged into clComic.data;
							// For each method in each type: arguments have to be joined and set into parameters; statements have to be set into workspace.
							//
		                    // This is basically the opposite of what goes on in manager.load();

		                    // In most cases expressions, statements and literals won't have changed, but, just in case....
		                    clComic.data.expressions.items = [];
		                    clComic.data.expressions.items.push.apply(clComic.data.expressions.items, objContent.expressions);
		                    clComic.data.statements.items = [];
		                    clComic.data.statements.items.push.apply(clComic.data.statements.items, objContent.statements);
		                    clComic.data.literals.items = [];
		                    clComic.data.literals.items.push.apply(clComic.data.literals.items, objContent.literals);

		                    // At least for now, objContent.types and their property arrays have to be merged into clComic.data.types under items.
		                    // Also, for now, we have to search and update pre-existing ones and create and set up new ones.
		                    // This is because, at least for now, all ancillary information has not been preserved by manager.

		                    // So here's the plan (which is sort of the opposite of what's done in manager.load()):
		                    // (0) Loop through clComic.data.types.items and add a "found" property initialized to false to each type. At the same level as type.data.
		                    // (1) Loop through objContent.types (typeIth). Find the type named the same in clComic.data.types.items. If found, call it ctypeJth.
		                    // 	(2a) Set ctypeJth.found = true.
		                    // 	(2b) Copy typeIth.expressions, statements and literals to ctypeJth.data.expressions, etc.
		                    // 	(2c) Loop through ctypeJth.data.methods and add a property "found" initialized to false.
		                    // 	(2d) Loop through each method in typeIth.methods (methodKth). Find the method named the same in ctypeJth.methods. If found, call it cmethodJth.
		                    // 		(2d-1) Set cmethodJth.found = true.
		                    // 		(2d-2) Set cmethodJth.parameters = methodKth.arguments.join(',');
		                    // 		(2d-3) Set cmethodJth.workspace = methodKth.statements, one level down.
		                    //		(2d-4) If not found, build a new method as described above (with found = true) and add it to ctypeJth.data.methods.
		                    //	(2e) Remove all methods from ctypeJth.methods where !found.
		                    // (3) If the type is not foundnot found, build a new type as described above (with found = true) and add it to clComic.data.types.items.
		                    // (4) Remove all types from clComic.data.types where !found.

		                    // (0)
		                    clComic.data.types.items.forEach(
		                    	function(type) {
		                    		type.found = false;
		                    	}
		                    )
		                    // (1)
		                    for (var i = 0; i < objContent.types.length; i++) {
		                    	
		                    	var typeIth = objContent.types[i];
		                    	for (j = 0; j < clComic.data.types.items.length; j++) {

		                    		var ctypeJth = clComic.data.types.items[j];
		                    		if (typeIth.name === ctypeJth.name) {

		                    			// (2a)
		                    			ctypeJth.found = true;

		                    			// (2b)
		                    			ctypeJth.data.expressions.items = [];
		                    			ctypeJth.data.expressions.items.push.apply(ctypeJth.data.expressions.items, typeIth.expressions);
		                    			ctypeJth.data.statements.items = [];
		                    			ctypeJth.data.statements.items.push.apply(ctypeJth.data.statements.items, typeIth.statements);
		                    			ctypeJth.data.literals.items = [];
		                    			ctypeJth.data.literals.items.push.apply(ctypeJth.data.literals.items, typeIth.literals);

		                    			// (2c)
		                    			ctypeJth.data.methods.forEach(
		                    				function(method) {
		                    					method.found = false;
		                    				}
		                    			);

		                    			// (2d)
		                    			for (k = 0; k < typeIth.methods.length; k++) {

		                    				var methodKth = typeIth.methods[k];
		                    				if (methodKth.name )
		                    			}
		                    		}
		                    	}
		                    }








							*/

							var data = {
									// userId: g_profile["userId"], not needed; sent in JWT
									// userName: g_profile["userName"], not needed; sent in JWT
									projectJson: self.data,
									changeableName: bChangeableName || false
							};

							// If !data.projectJson.specialProjectData.systemTypesEdited, then success and error mean that the project was or wasn't saved to the database.
							// If not saved, it was rolled back.
							//
							// If data.projectJson.specialProjectData.systemTypesEdited, the save code will collect and try to write a complete SQL script to the project root
							// directory that can be run to propagate any changes or additions to System Types. This script is written to ST.sql.
							// We attempt to write the SQL script only if the saving of the project to the database succeeded and wasn't rolled back.
							// This means that we could encounter two cases: the project was saved to the database and the script file was created successfully;
							// or the project was saved to the database and the script file wasn't created.
							// Object data is returned for both these cases with success=true.
							$.ajax({

								type: 'POST',
								url: '/BOL/ProjectBO/SaveProject',
								contentType: 'application/json',
								data: JSON.stringify(data),
								dataType: 'json',
								success: function (objectData, strTextStatus, jqxhr) {

									if (objectData.success) {

										// If callback exists, then our errorHelper will be display in callback back in BuyDialog.js.
										if (!$.isFunction(callback)) {
											if (!objectData.project.specialProjectData.systemTypesEdited) {
												errorHelper.show('Project was saved', 2000);
											} else {
												if (objectData.scriptSuccess) {
													errorHelper.show("Your project was saved to the database and the System Type script ST.sql was created.", 5000);
												} else {
													errorHelper.show("Your project was saved to the database, but the System Type script COULD NOT be created. Writing the script failed with message: " + saveError.message + ".");
												}
											}
										}

										// objectData holds a completely filled in (likely modified) project: objectData.project.
										// We need to replace this with that. Let's try:
										
										client.unloadProject(null, false);	// We just saved. No callback and block displaying the "Abandon Project" dialog.
																			// This is the only place that calls client.unloadProject with 2nd param = false.
										
										// cause whichever dialog was open to close.
										client.closeCurrentDialog();

										// Set up the modified project.
										// specialProjectData.openMode might be "new". Change to "searched". It's no longer new.
										// This will get saving to work correctly down the road.
										objectData.project.specialProjectData.openMode = "searched";
										client.load_m_clProject(objectData.project);

										client.setBrowserTabAndBtns();

										if ($.isFunction(callback)) {
											callback(null);
										}
									} else {

										// !objectData.success -- error message in objectData.message
										client.closeCurrentDialog();
										client.unloadProject(null, false);

										if ($.isFunction(callback)) {
											callback(objectData.message);
										} else {
											errorHelper.show(objectData.message);
										}
									}
								},
								error: function (jqxhr, strTextStatus, strError) {

									// Non-computational error in strError
									if ($.isFunction(callback)) {
										callback(strError);
									} else {
										errorHelper.show(strError);
									}
								}
							});

							return null;
						
						} catch (e) {

							return e;
						}
					};

					self.getStatus = function (nameInHolding) {


						var test = parseInt(g_profile['userId'], 10);
						var nih = nameInHolding || '';
						return {

							inDBAlready: (self.data.id > 0),
							userOwnsProject: (self.data.ownedByUserId === test),
							allRequiredFieldsFilled: (	nih.trim().length > 0
											&& (self.data.imageId > 0 || self.data.altImagePath.length > 0)
										),
							projectNameIsFilled: (self.data.name.trim().length > 0)
						};
					};

					//////////////////////////////
					// Private fields.

					// The strip of comic frames.
					var m_csComicStrip = null;

				} catch (e) {

					errorHelper.show(e);
				}
			};

			return functionConstructor;
			
		} catch (e) {

			errorHelper.show(e);
		}
	});
