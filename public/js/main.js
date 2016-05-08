////////////////////////////////////
// Main
//
// Return null--no module object.
//
// This is the entry point.  GZ globals are defined, allocated and initialized here.

// Define some index app globals.
var client = null;
var navbar = null;
var validator = null;
var g_clTypeApp = null;

var g_profile = {};

$(document).ready(function() {

	try {

		require(["Core/errorHelper", 
				"Core/Client", 
				"Navbar/Navbar", 
				"Core/Validator"], 
			function (errorHelper, 
						Client, 
						Navbar, 
						Validator) {

								try {

									var strFromURL = m_functionCheckForURLEncoding("error");
									if (strFromURL) {
										errorHelper.show(strFromURL);
									}

									// Allocate and initialize the client.
									client = new Client();
									var exceptionRet = client.create();
									if (exceptionRet) { throw exceptionRet; }

									// Allocate and initialize the client.
									validator = new Validator();
									var exceptionRet = validator.create();
									if (exceptionRet) { throw exceptionRet; }

									// Allocate and attach the navbar module.
									navbar = new Navbar();
									exceptionRet = navbar.create();
									if (exceptionRet) { throw exceptionRet; }

									// Cause the code and designer panels to size themselves. Initially, there will be no comic or panels strips because of bDisplayComics setting.
									$(window).resize();

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

