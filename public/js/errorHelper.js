///////////////////////////////////////
// ErrorHelper -- wraps up the showing of errors.
// 
// Return singleton instance.
//

define(function () {
	
	try {

		var functionErrorHelper = function ErrorHelper() {

			try {

				var self = this;				// Uber closure.

				// Expose method which displays an error to the user.
				// Parameters:
				// Error to display.
				self.show = function (error) {

					try {

						// Possibly convert from various objects to string.
						if (error.responseText) {

							error = error.responseText;
						} else if (error.message) {

							error = error.message;
						}

						// Show the dialog.
						BootstrapDialog.show({

				            title: "error",
				            message: error,
				            buttons: [{

				            	label: "Close",
				                icon: "glyphicon glyphicon-remove-circle",
				                cssClass: "btn-warning",
				                action: function(dialogItself){

				                    dialogItself.close();
				                }
				            }]
				        });
					} catch (e) {

						alert(e.message);
					}
				};
			} catch (e) {

				alert(e.message);
			}
		}

		return new functionErrorHelper();
	} catch (e) {

		alert(e.message);
	}
});