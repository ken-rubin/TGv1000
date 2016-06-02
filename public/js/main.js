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
			    "NextWave/source/manager/Manager"], 
			function (errorHelper, 
						Client, 
						Navbar, 
						prototypes,
						settings,
						glyphs,
						Manager) {

								try {

									var strFromURL = m_functionCheckForURLEncoding("error");
									if (strFromURL) {
										errorHelper.show(strFromURL);
									}

									// Allocate and attach the manager/glyph objects.
						            // Create the glyphs module first, its 
						            // complete callback will contiue things.
						            glyphs.create(function () {

						                try {

						                    // Allocate and create the layer manager.
						                    manager = new Manager();
						                    var exceptionRet = manager.create();
						                    if (exceptionRet) { throw exceptionRet; }

											// Allocate and initialize the client.
											client = new Client();
											exceptionRet = client.create();
											if (exceptionRet) { throw exceptionRet; }

											// Allocate and attach the navbar module.
											navbar = new Navbar();
											exceptionRet = navbar.create();
											if (exceptionRet) { throw exceptionRet; }

											// Calculate if the user is privileged, set in manager.
				                            manager.privileged = (g_profile["can_create_classes"] || 
				                                g_profile["can_create_products"] || 
				                                g_profile["can_create_onlineClasses"]) || false;

				                            // Now that manager and client are ready:
				                            exceptionRet = client.postCreate();
				                            if (exceptionRet) { throw exceptionRet; }

						                } catch (e) {

						                    alert(e.message);
						                }
						            });


								} catch(e) { errorHelper.show(e); }
							});
	} catch(e) { alert(e.message);}
});

var m_functionCheckForURLEncoding = function( name ) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return decodeURI(results[1]);
}

