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
				            // ,
				            // onshow: function() {

				            // 	var jQ = $(".navbar-fixed-top");
				            // 	jQ.removeClass("headroom--top");
				            // 	jQ.addClass("headroom--not-top headroom--unpinned");
				            // }
				        });
					} catch (e) {

						alert(e.message);
					}
				};
			} catch (e) {

				alert(e.message);
			}
		}

		// Allocate and return singleton.
		return new functionErrorHelper();
	} catch (e) {

		alert(e.message);
	}
});