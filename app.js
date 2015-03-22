/////////////////////////////////////
// TGv1000 applicaiton translation unit.
//

/////////////////////////////////////
console.log("Require dependencies (express, body-parser, morgan and less-middleware).");
var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var lessMiddleware = require("less-middleware");

/////////////////////////////////////
console.log("Allocate application (express).");
var app = express();

/////////////////////////////////////
app.set("development", process.argv[2] === "development");
console.log("Set development (" + app.get("development") + ").");

/////////////////////////////////////
console.log("Configure body-parser.");
app.use(bodyParser.urlencoded({ extended: true }));

/////////////////////////////////////
console.log("Configure view folder (views) and view engine (jade).");
app.set("views", __dirname + "/views");
app.set("view engine", "jade");

/////////////////////////////////////
console.log("Configure logger (morgan).");
app.use(morgan("dev"));

/////////////////////////////////////
if (app.get("development")) {

	console.log("Configure css middleware (less).");
	app.use(lessMiddleware(__dirname + "/public"));
}

/////////////////////////////////////
console.log("Map static request folder (public).");
app.use(express.static(__dirname + "/public"));

/////////////////////////////////////
// TODO: Express 4 routes...
console.log("Map projectsDialog route (projectsDialog.jade).");
app.get("/projectsDialog", function (req, res) {

	try {

		// Get some data/stuff from the DB, or 
		// where-ever, and pass into jade render.
		var objectContext = {

			// This space intentionally left blank.
			// But is could be used to customize....
		};

		// Render the jade file to the client.
		res.render("projectsDialog", 
			objectContext);
	} catch (e) {

		res.send(e.message);
	}
});

/////////////////////////////////////
console.log("Map renderJadeSnippet route.");
var objectInstantiatedModules = {};
app.post("/renderJadeSnippet", function (req, res) {

	try {

		// Look for business object--invoke to further specify the request  
		// body with arbitrary data to be passed to the jade render call.
		var objectBusinessObject = req.body.businessObject;
		if (objectBusinessObject) {

			// Get the cached business object instance, or...
			var instance = objectInstantiatedModules[objectBusinessObject.module];
			if (!instance) {

				// ...require module, and...
				var module = require("./modules/" + objectBusinessObject.module);

				// ...allocate type.
				instance = new module();
			}

			// Invoke method to augment the body property.
			var exceptionRet = instance[objectBusinessObject.method](req.body);
			if (exceptionRet) {

				throw exceptionRet;
			}
		}

		// Render the specified jade file to the client.
		res.render(req.body.templateFile, 
			req.body);
	} catch (e) {

		res.send(e.message);
	}
});

/////////////////////////////////////
console.log("Map main route (index.jade).");
app.get("/", function (req, res) {

	try {

		// Render the jade file to the client.
		res.render("index", { 

			// Pass in jade context property just for the hell of it.
	  		title : "TGv1000" 
		});
	} catch (e) {

		res.send(e.message);
	}
});

/////////////////////////////////////
console.log("Start the server (HTTP://80).");
app.listen(80);
