/////////////////////////////////////
// TGv1000 applicaiton translation unit.
//

/////////////////////////////////////
console.log("Require dependencies (express, body-parser, morgan and less-middleware).");
var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var lessMiddleware = require("less-middleware");
var favicon = require('serve-favicon');
var JL = require("jsnlog").JL;
var jsnlog_nodejs = require('jsnlog-nodejs').jsnlog_nodejs;
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');

/////////////////////////////////////
console.log("Allocate application (express).");
var app = express();

/////////////////////////////////////
app.set("development", process.argv[2] === "development");
console.log("Set development (" + app.get("development") + ").");

////////////////////////////////////
// Protect all routes starting with '/BOL' with JWT unless they start with "/BOL/ValidateBO".
// The routes in /BOL/ValidateBO are used in these 4 cases: enroll, login, forgot p/w, fetch marketing page data.
var SECRET = process.env.TGv1000_JWT_Secret || "temp_secret";
app.set("jwt_secret", SECRET);
if (SECRET === "temp_secret") {
    console.log("***You need to set environment variable TGv1000_JWT_Secret. Using 'temp_secret'***");
} else {
    console.log("Have jwt_secret: " + SECRET);
}

// var jwtErrCheck = function(err, req, res, next) {
//     if (err) {
//         console.log("expressJwt err: " + JSON.stringify(err));
//         res.json({
//             success: false,
//             message: err.constructor.name
//         });
//         return;
//     }
//     next();
// }
// var jwtErrCheck = function(err, req, res, next) {
//     if (err) {
//         return res.json({
//             success: false,
//             message: err.message
//         })
//     }
//     next();
// }
// app.use('/BOL', expressJwt({ secret: SECRET}).unless( { path: [ /^\/BOL\/Validate.*$/ ] } ), jwtErrCheck);
// app.use('/adminzone', expressJwt({ secret: SECRET}), jwtErrCheck);

/////////////////////////////////////
console.log("Configure body-parser.");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/////////////////////////////////////
// expressJwt error catcher (although the following middleware will be executed for every request to the app)
// app.use(function(err, req, res, next){
//     if (err) {
//         console.log("expressJwt err: " + JSON.stringify(err));
//         res.json({
//             success: false,
//             message: err.constructor.name
//         });
//     }
// });

/////////////////////////////////////
console.log("Configure view folder (views) and view engine (jade).");
app.set("views", __dirname + "/views");
app.set("view engine", "jade");

/////////////////////////////////////
console.log("Configure favicon.");
app.use(favicon(__dirname + '/public/favicon.ico'));

/////////////////////////////////////
console.log("Configure logger (morgan).");
app.use(morgan("dev"));

/////////////////////////////////////
if (app.get("development")) {

	console.log("Configure css middleware (less).");
	app.use(lessMiddleware(__dirname + "/public"));
}

/////////////////////////////////////
app.set("dbname","TGv1000.");
console.log("dbname is " +  app.get("dbname"));

/////////////////////////////////////
console.log("Map static request folder (public).");
app.use(express.static(__dirname + "/public"));

app.use(
    expressJwt({ secret: SECRET }).unless({
            path:[
                __dirname + "/public",
                '/',
                /^\/BOL\/Validate.*$/,
                '*.public',
                '*.logger',
                "/renderJadeSnippet"
            ]})
    // ,
    // function(req, res) {
    //     if(!req.user) {
    //         return res.json({
    //             success: false,
    //             message: "JWT error"
    //         });
    //     }
    // }
);

/////////////////////////////////////
console.log("Configuring jsnlog to listen for client-side messages and logging to console.");
// jsnlog.js on the client by default sends log messages to /jsnlog.logger, using POST.
app.post('*.logger', function (req, res) { 
    
    jsnlog_nodejs(JL, req.body);

    // Send empty response. This is ok, because client side jsnlog does not use response from server.
    res.send(''); 
});

// Test server-generated jsnlog message.
JL().info('<<< log message from server to show logging is live >>>');

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
console.log("Map main route login.jade.");
app.get("/", function (req, res) {

    try {
        res.render("Login/login", { 
            title : "TGv1000" 
        });
    } catch (e) { res.send(e.message); }
});

/////////////////////////////////////
console.log("Map main route index.jade.");
app.get('/index', function (req, res) {

    try {
        console.log('In app.get(index)');
        console.log('req.headers=' + JSON.stringify(req.headers));
        console.log('req.user=' + JSON.stringify(req.user));
        // if (!req.user) {
        //     return res.send(err.message);
        // }

        // Render the jade file to the client.
        res.render("Index/index", { 
            // Pass in jade context property just for the hell of it.
            title : "TGv1000" 
        });
    } catch (e) { res.send(e.message); }
});

/////////////////////////////////////
console.log("Map main route adminzone.jade.");
app.get("/adminzone", function (req, res) {

    try {

        // Render the jade file to the client.
        res.render("Adminzone/adminzone", { 
            title : "TGv1000" 
        });
    } catch (e) { res.send(e.message); }
});

/////////////////////////////////////
console.log("Set up SQL module.");
var SQL = require("./modules/SQL");
var sql = new SQL(app);
sql.setPool('root', '');

var Logger = require("./modules/Logger");
var logger = new Logger(app, sql);
var multer = require("multer");
var done = false;
app.use(multer(
    { 
        dest: './uploads/',
        rename: function (fieldname, filename) {
            return filename + Date.now();
        },
        onFileUploadStart: function (file) {
            //console.log(file.originalname + ' is starting ...');
        },
        onFileUploadComplete: function (file, req, res) {
            //console.log(file.fieldname + ' uploaded to  ' + file.path + "; req.body=" + JSON.stringify(req.body));
            req.body.filePath = file.path;
            done=true;
        }
    }
));

/////////////////////////////////////
console.log("Setting up routes from database.");
var moduleInstances = {};
sql.execute("select * from " + app.get("dbname") + "routes where inuse=1 order by id asc;",
    function(rows){

        var moduleInstance = null;
        console.log('Setting up ' + rows.length + ' routes.')

        for (var i = 0; i < rows.length; i++) {

            var rowi = rows[i];

            try {

                if (moduleInstances.hasOwnProperty(rowi.moduleName)) {

                    moduleInstance = moduleInstances[rowi.moduleName];

                } else {

                    var mod = require(rowi.path + rowi.moduleName);
                    moduleInstance = new mod(app, sql, logger);
                    moduleInstances[rowi.moduleName] = moduleInstance;
                }

                var methodInstance = moduleInstance[rowi.method];
                app[rowi.verb](rowi.route, methodInstance);

            } catch (e) {

                console.log(' ');
                console.log('*************** ERROR ****************');
                console.log('Error setting up route for ' + rowi.route + '; skipping it.');
                console.log(e.message);
                console.log(' ');
            }
        }
/*
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
*/
        app.set("portnum",8001);
        app.listen(app.get("portnum"));
        console.log("Listening on port " + app.get("portnum") + ".");
    },
    function(strError) {

        console.log("Got this error reading routes: " + strError);
        console.log("We in BIG trouble.");
    }
);
