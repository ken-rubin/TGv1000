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
app.set("dbname","TGv1000.");
console.log("dbname is " +  app.get("dbname"));

////////////////////////////////////////////
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
		res.render("Dialogs/ProjectsDialog/projectsDialog", 
			objectContext);
	} catch (e) {

		res.send(e.message);
	}
});

console.log("Map loginDialog route (projectsDialog.jade).");
app.get("/loginDialog", function (req, res) {

	try {

		// Get some data/stuff from the DB, or 
		// where-ever, and pass into jade render.
		var objectContext = {

			// This space intentionally left blank.
			// But is could be used to customize....
		};

		// Render the jade file to the client.
		res.render("Dialogs/LoginDialog/loginDialog", 
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
				var module = require("./modules/" + 
					objectBusinessObject.module);

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
		res.render("Index/index", { 

			// Pass in jade context property just for the hell of it.
	  		title : "TGv1000" 
		});
	} catch (e) {

		res.send(e.message);
	}
});

/////////////////////////////////////
console.log("Set up SQL module.");
var SQL = require("./modules/SQL");
var sql = new SQL(app);
sql.setPool('root', '');

////////////////////////////////////
app.set("portnum",80);
console.log('Server will be listening on port ' + app.get("portnum") + ".");

/////////////////////////////////////
console.log("Setting up routes from database.");
var moduleInstances = {};
sql.execute("select * from " + app.get("dbname") + "routes order by id asc;",
    function(rows){

        var moduleInstance = null;

        for (var i = 0; i < rows.length; i++) {

            var rowi = rows[i];
            if (rowi.inuse) {

                try {

                    if (moduleInstances.hasOwnProperty(rowi.moduleName)) {

                        moduleInstance = moduleInstances[rowi.moduleName];

                    } else {

                        var mod = require(rowi.path + rowi.moduleName);
                        moduleInstance = new mod(app, sql);
                        moduleInstances[rowi.moduleName] = moduleInstance;
                    }

                    var methodInstance = moduleInstance[rowi.method];
                    app[rowi.verb](rowi.route, methodInstance);

                } catch (e) {

                    console.log(' ');
                    console.log('*************** ERROR ****************');
                    console.log('Error setting up route for ' + rowi.route + '; skipping it.');
                    console.log('*************** ERROR ****************');
                    console.log(' ');
                }
            }
        }

        console.log("Database routes handlers are allocated....");
        console.log("Set up all special route handlers.");

        // catch 404 and forward to error handler
        app.use(function(req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        // error handlers

        // development error handler
        // will print stacktrace
        if (app.get('env') === 'development') {
            app.use(function(err, req, res, next) {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });

        app.listen(app.get("portnum"));
        console.log("Listening on port " + app.get("portnum") + ".");
        //module.exports = app;    
    },
    function(strError){
        console.log("Got this error reading routes: " + strError);
        console.log("We in BIG trouble.");
    }
);
