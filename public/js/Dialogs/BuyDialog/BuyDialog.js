////////////////////////////////////
// BuyDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/resourceHelper", "Code/Types"], 
	function (snippetHelper, errorHelper, resourceHelper, Types) {

		try {

			// Define the BuyDialog constructor function.
			var functionBuyDialog = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Buying shows a series of dialogs:
					//
					// User has already selected a candidate from the ScrollRegion in OpenProjectDialog.
					//
					// In Buy1 we will display the contents of m_clProject.specialProjectData.classData or .onlineClassData or .productData.
					//
					// If user decides to purchase, we overlay a credit card entry form, Buy2. On Purchase button click, we go to the
					// server to process the charge the credit card.
					// If unsuccessful, we show errorHelper.
					// If successful, we call the server to save the project (with specialProjectData.openMode set to 'bought').
					//
					// This returns a newly saved version of the project which we display in Buy3. Buy3 gives the user a chance to 
					// change the name, insert tags, change the picture, etc. These changes are kept in memory until the project is saved.
					// When Buy3 is closed the workspace is shown with the newly purchased project.

					self.create = function() {

						try {

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/BuyDialog/BuyDialog"
								}, 
								dataProperty: "HTML",
								method: "POST",
								url: "/renderJadeSnippet"
							}).done(m_functionRenderJadeSnippetResponse).error(errorHelper.show);

							return null;
						} catch (e) {

							return e;
						}
					};

					self.closeYourself = function() {

						m_dialog.close();
					}

					//////////////////////////////////
					// Private methods.

					// Have converted jade of dialog to HTML. Open its dialog.
					var m_functionRenderJadeSnippetResponse = function (htmlData) {

						try {

							// Show the dialog--load the content from 
							// the PropertysDialog jade HTML-snippet.
							BootstrapDialog.show({

								title: "Decide Whether or Not to Buy",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [
					            	{
					            		label: "Buy",
					            		id: 'BuyBtn',
					            		cssClass: "btn-primary",
					            		action: function(){

					            			m_functionBuy();
					            		}
					            	},
					            	{
						                label: "Nope. Don't buy.",
						                icon: "glyphicon glyphicon-remove-circle",
						                cssClass: "btn-warning",
						                action: function(dialogItself){

						                    dialogItself.close();
						                }
					            	}
					            ],
					            draggable: true,
					            onshown: m_functionOnShownDialog
					        });
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Wire up Property handlers to dialog controls.
					var m_functionOnShownDialog = function (dialogItself) {

						try {

							// Save the dailog object reference.
							m_dialog = dialogItself;

							m_clProject = client.getProject();

							// Get the appropriate snippet and display the second form of the buy dialog.

						} catch (e) {

							errorHelper.show(e);
						}
					};

					var m_functionBuyStep1 = function () {

						try {



							self.closeYourself();

						} catch (e) {

							errorHelper.show(e);
						}
					}

				} catch (e) {

					errorHelper.show(e);
				}

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_clProject;
			};

			// Return the constructor function as the module object.
			return functionBuyDialog;

		} catch (e) {

			errorHelper.show(e);
		}
	});
