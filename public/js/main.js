////////////////////////////////////
// Main
//
// Return null--no module object.
//
// This is the entry point.  GZ globals are defined, allocated and initialized here.

// Define some index app globals.
var client = null;
var navbar = null;
var manager = null;
var g_profile = {};

$(document).ready(function() {

	try {

		require(["Core/errorHelper", 
				"Core/Client", 
				"Navbar/Navbar", 
			    "NextWave/source/utility/prototypes",
			    "NextWave/source/utility/settings",
			    "NextWave/source/utility/glyphs",
			    "NextWave/source/manager/Manager",
			    "NextWave/source/utility/settings"], 
			function (errorHelper, 
						Client, 
						Navbar, 
						prototypes,
						settings,
						glyphs,
						Manager,
						settings) {

				try {

					var strFromURL = m_functionCheckForURLEncoding("error");
					if (strFromURL) {
						errorHelper.show(strFromURL);
					}

					// Set global profile for everyone to use.
					var profileJSON = localStorage.getItem("profile");
					g_profile = JSON.parse(profileJSON);

					// Allocate and attach the manager/glyph objects.
		            // Create the glyphs module first, its 
		            // complete callback will contiue things.
		            glyphs.create(function () {

		                try {

		                    // Allocate and create the layer manager.
		                    manager = new Manager();

							// Calculate user privileges; set in manager. They are used during manager.create().
                            manager.userAllowedToCreateEditPurchProjs = (g_profile["can_create_classes"] || 
                                g_profile["can_create_products"] || 
                                g_profile["can_create_onlineClasses"]) || false;
                            manager.userCanWorkWithSystemLibsAndTypes = g_profile["can_edit_base_and_system_libraries_and_types_therein"] || false;

                            // Want to fetch complete lists of expressions, literals and statements (now only statements are used) and pass them into
                            // manager.create in the callback. Although each project's comics comes with its own lists of these strings, they might be pruned,
                            // so this is the only way for manager to have complete lists.

							var posting = $.post("/BOL/ProjectBO/FetchStrings_E_L_S", 
								{},
								'json');
							posting.done(function(data){

								if (data.success) {

				                    var exceptionRet = manager.create(data.data);
									if (exceptionRet) {

										errorHelper.show(exceptionRet);
									} 

									// Allocate and initialize the client.
									// For a normal user this will load last accessed project, if any or create an empty designer if not.
									// For a user who can edit system types, this will load all system types into manager.
									client = new Client();
									exceptionRet = client.create(
										function() {

											// Allocate and attach the navbar module.
											navbar = new Navbar();
											exceptionRet = navbar.create();
											if (exceptionRet) { 
												errorHelper.show(exceptionRet);
												return;
											}

											client.setBrowserTabAndBtns();
										}
									);
								} else {

									// !data.success
									errorHelper.show(data.message);
								}
							});
		                } catch (e) { errorHelper.show(e); }
		            });
				} catch(e) { errorHelper.show(e); }
			});
	} catch(e) { errorHelper.show(e); }
});

var m_functionCheckForURLEncoding = function( name ) {
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( window.location.href );
	if( results == null ) {
		return "";
	}

	return decodeURI(results[1]);
}

