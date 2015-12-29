///////////////////////////////////////
// ErrorHelper -- wraps up the showing of errors.
// 
// Return singleton instance.
//

// 
define(function () {
	
	try {

		// Define module to allocate upon return.
		var functionErrorHelper = function ErrorHelper() {

			try {

				var self = this;				// Uber closure.

				// Expose method which displays an error to the user.
				// Parameters:
				// Error to display. Can be an exception, {responseText: 'xxx'}, 'xxx'
				self.show = function (error, autoCloseMS) {

					try {

						m_autoCloseMS = autoCloseMS || 0;

						var dispError;
						if (error.responseText) { dispError = error.responseText; 
						} else if (error.message) { dispError = error.message;
						} else { dispError = error;
						}

						// Show the dialog.
						BootstrapDialog.show({

				            title: m_autoCloseMS === 0 ? "Error" : "Note",
				            message: dispError,
				            buttons: [{

				            	label: "Close",
				                icon: "glyphicon glyphicon-remove-circle",
				                cssClass: "btn-warning",
				                action: function(dialogItself){

				                    dialogItself.close();
				                }
				            }],
				            onshown: m_functionOnShownDialog
				        });
					} catch (e) {

						alert(e.message);
					}
				};
			} catch (e) {

				alert(e.message);
			}

			var m_functionOnShownDialog = function(dialogItself) {

				m_dialog = dialogItself;

				if (m_autoCloseMS > 0) {

					setTimeout(
						function(){ 
									m_dialog.close(); 
								}, 
						m_autoCloseMS
					);
				}
			}

			var m_autoCloseMS = 0;
			var m_dialog = null;
		}

		// Allocate and return singleton.
		return new functionErrorHelper();


	} catch (e) { alert(e.message); }
});