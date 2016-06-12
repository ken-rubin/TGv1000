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
				self.show = function (error, autoCloseMS, callback) {

					try {

						m_autoCloseMS = autoCloseMS || 0;
						m_callback = callback;

						var dispError;
						if (error.responseText) { dispError = error.responseText; 
						} else if (error.message) { dispError = error.message;
						} else { dispError = error;
						}

						if (error.hasOwnProperty('message') && error.hasOwnProperty('stack') && (manager.userAllowedToCreateEditPurchProjs)) {
							dispError += '<br><br>' + error.stack;
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

				                	// Cancel possible autoClose.
				                	if (m_timerId) {
				                		clearTimeout(m_timerId);
				                	}
				                    dialogItself.close();
				                }
				            }],
				            onshown: m_functionOnShownDialog,
				            onhidden: m_functionOnHiddenDialog
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

					m_timerId = setTimeout(
						function(){ 
									m_dialog.close(); 
								}, 
						m_autoCloseMS
					);
				}
			}

			var m_functionOnHiddenDialog = function() {

				if($.isFunction(m_callback)) {
					m_callback();
				}
			}

			var m_autoCloseMS = 0;
			var m_dialog = null;
			var m_callback = null;
			var m_timerId = null;
		}

		// Allocate and return singleton.
		return new functionErrorHelper();


	} catch (e) { alert(e.message); }
});