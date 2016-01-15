////////////////////////////////////
// Main
//
// Return null--no module object.
//
// This is the entry point.  GZ globals are defined, allocated and initialized here.

// Define some index app globals.
var client = null;
var navbar = null;
var comics = null;
var designer = null;
var tools = null;
var code = null;
var types = null;
var validator = null;
var g_clTypeApp = null;

var g_profile = {};

$(document).ready(function() {

	try {

		require(["Core/errorHelper", 
				"Core/Client", 
				"Code/Code", 
				"Code/Types", 
				"Designer/Designer", 
				"Designer/Tools", 
				"Navbar/Navbar", 
				"Navbar/Comics",
				"Core/Validator"], 
			function (errorHelper, 
						Client, 
						Code, 
						Types, 
						Designer, 
						Tools, 
						Navbar, 
						Comics,
						Validator) {

								try {

									// Allocate and initialize the client.
									client = new Client();
									var exceptionRet = client.create();
									if (exceptionRet) { throw exceptionRet; }

									// Allocate and initialize the client.
									validator = new Validator();
									var exceptionRet = validator.create();
									if (exceptionRet) { throw exceptionRet; }

									// Allocate and attach the designer.
									designer = new Designer();
									exceptionRet = designer.create();
									if (exceptionRet) { throw exceptionRet; }

									// Allocate and attach the code module.
									code = new Code();
									exceptionRet = code.create();
									if (exceptionRet) { throw exceptionRet; }

									// Allocate and attach the navbar module.
									navbar = new Navbar();
									exceptionRet = navbar.create();
									if (exceptionRet) { throw exceptionRet; }

									// Allocate the strips too.
									comics = new Comics();
									exceptionRet = comics.create();
									if (exceptionRet) { throw exceptionRet; }

									// Allocate the strips too.
									tools = new Tools();
									exceptionRet = tools.create();
									if (exceptionRet) { throw exceptionRet; }

									// Allocate the strips too.
									types = new Types();
									exceptionRet = types.create();
									if (exceptionRet) { throw exceptionRet; }

									// Disable all the TypeWell icons, since there is current no project loaded.
									$(".disabledifnoproj").prop("disabled", true);
									$(".hiddenifnotrunning").css("display", "none");

									// Cause the code and designer panels to size themselves. Initially, there will be no comic or panels strips because of bDisplayComics setting.
									$(window).resize();

								} catch(e) { errorHelper.show(e); }
							});
	} catch(e) { alert(e.message);}
});
