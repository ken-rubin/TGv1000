////////////////////////////////////
// AZUsersDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/resourceHelper"], 
	function (snippetHelper, errorHelper, resourceHelper) {

		try {

			// Define the AZUsersDialog constructor function.
			var functionAZUsersDialog = function () {

				try {

					var self = this;			// Uber closure.

					//////////////////////////////////
					// Public methods.

					// Create and show Bootstrap dialog.
					self.create = function() {

						try {

							// Get the dialog DOM.
							$.ajax({

								cache: false,
								data: { 

									templateFile: "Dialogs/AZUsersDialog/AZUsersDialog"
								}, 
								dataType: "HTML",
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

							BootstrapDialog.show({

								title: "User, etc. Maintenance",
								size: BootstrapDialog.SIZE_WIDE,
					            message: $(htmlData),
					            buttons: [
					            	{
						                label: "Close",
						                icon: "glyphicon glyphicon-remove-circle",
						                cssClass: "btn-warning",
						                action: function(dialogItself){

						                    dialogItself.close();
						                }
					            	}
					            ],
					            draggable: false,
					            onshown: m_functionOnShownDialog
					        });
						} catch (e) {

							errorHelper.show(e);
						}
					};

					// Wire up event handlers to dialog controls.
					var m_functionOnShownDialog = function (dialogItself) {

						try {

							$("#tabs").tabs();
							$(".tt-selector .btn-default").powerTip({
								smartPlacement: true
							});
							
							// Save the dialog object reference.
							m_dialog = dialogItself;

							var posting = $.post("/BOL/UtilityBO/GetAllUserMaintData", 
								{},
								'json');
							posting.done(function(data){

								try {
									if (data.success) {

										m_rows = data.rows;
										m_user = data.rows[0];
										m_usergroups = data.rows[1];
										m_permissions = data.rows[2];
										m_ug_permissions = data.rows[3];

										var exceptionRet = m_functionSetUp3Tabs();
										if (exceptionRet) { throw exceptionRet; }

									} else {

										// !data.success
										 throw new Error(data.message);
									}
								} catch (e) {

									errorHelper.show(e);
								}
  							});
						} catch (e) { errorHelper.show(e); }
					};

					var m_functionSetUp3Tabs = function () {

						try {

							// Disable search for all datatables unless overridden.
							// Add more defaults here.
							$.extend( $.fn.dataTable.defaults, {
							    searching: false
							} );




							return null;
						
						} catch (e) { return e; }
					}

				} catch (e) { errorHelper.show(e.message); }

				/////////////////////////////////
				// Private fields.

				// Reference to the dialog object instance.
				var m_dialog = null;
				var m_rows;
				var m_user;
				var m_usergroups;
				var m_permissions;
				var m_ug_permissions;
			};

			// Return the constructor function as the module object.
			return functionAZUsersDialog;

		} catch (e) {

			errorHelper.show(e);
		}
	});
