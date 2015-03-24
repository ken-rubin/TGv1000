Prerequisites:

Of course, the project depends on Node and NPM both being installed in a global capacity and the standard, expected rights and privledges for the users running the client and server.  (Don't forget to plug-in your computer too.... :-)

The project also depends on the "node-dev" npm package to handle automatic server restarts and the "node-inspector" npm package for server debugging.  
Please install these resources globally for full integration.


Initialization:

Execute: "git clone https://github.com/ken-rubin/TGv1000.git", to get the code.
Note that the above command creates a subdirectory from the current, active user directory.

Then execute: "npm install", from the root project folder to install all required local npm package dependencies.


Execution:

Execute: "(sudo) npm start", to run the server.  Sudo is a Unix command to give administrative priviliges to the subsequent command.  This is necessary because the server listens on port 80 by default and this is a restricted port on most systems.  Windows users may require similar measures akin to "running as administrator".

Then open a browser and navigate to: "localhost".  You should see the main page of the application.  Explore at your own risk/enjoyment.


Debugging:

To debug the server-side of the project, an additional command window must be opened after starting the server application above.  The command: "node-inspector &", is run, and instructions should be followed thereafter, additionally, refer to the "node-inspector" help documents for further information.

To debug the client-side, simply activate the chosen brower's debug facility while navigating the project site.  Debugging proceeds normally for a web-site.  Perhaps refer to the browser's debugging documentation for further information.

Architecture:

This sample amouts to an exploration of dynamic content injection and its structured resolution.
The theoretical scenario of a projects dialog forms the bases for this exploration.  The dialog is presented to the user and all content is dynamically loaded into the DOM on-demand.  Two routes form the basis of this framework.  One is fully implemented and the other is, at the moment, prototypical.  "/renderJadeSnippet" is fully implemented and will be exlplored in this document.  The "/projectsDialog" route is not yet complete.  It will be morphed into a corresponding route, filling the role of a URL-encoded GET request whereas the "/renderJadeSnippet" is a POST route.

The purpose of the "/renderJadeSnippet" route is to serve up HTML-snippets to the client by processing a jade document.  The client can specify information which is consumed by the jade document.  In addition, a business object can be specified (also by the client) and it can augment the client data with server data.  The business object is a node module.  It can perform any action necessary to augment the context object (eventually) passed to the jade compiler.  These buisiness objects form the first class of object-hierarchies, named: "Business objects", detailed below.  Typically, the jade document is a snippet, that is, it does not generate a complete web-page but instead  forms a subset which is injected into a complete document on the client.  The snippet typically consumes context data to build its rendered structure.  Ultimately, however, it is only limited by the templative nature of jade.

The jade documents themselves form the second class of object-hierarchies detailed (named: "jade documents").  The jade documents reference a special class of client side AMD-modules, which are intended to be dynamically required on the client and form the third class of object-hierarchies detailed (named: "Client side event handlers").


Code:


The client invokes the route via an ajax call:


						// Get the user's projects.
						$.ajax({

							cache: false,
							data: { 

								userId: m_iUserId,
								templateFile: "projectsDialogOpenSnippet",
								businessObject: {

									module: "ProjectsDialogOpenSnippet",
									method: "process"
								}
							}, 
							dataType: "HTML",
							method: "POST",
							url: "/renderJadeSnippet"
						}).done(m_functionOpenSnippetResponse).error(errorHelper.show);


Notice several things, here:

1) The "data" property of the ajax call forms a context object passed to the server.  The server code, as shall be seen shortly via the magic of the BodyParser middleware, sees this object as "req.body".

2) The request is not cached.  

3) The data-type is "HTML"--this indicates that the result is an HTML-snippet.

4) The method is post.

5) The route is invoked via the url parameter.

6) The "userId" property of the data object is an example of client-specified data.  Utimately this will be passed into the Business object and the jade template files.

7) The business object module and method are explicitly specified.

8) The jade template file is specified via the "templateFile" property and it is lower-case, in keeping with standard JavaScript convention.

9) The business object module is upper-case in keeping with Crockford's convention for function constructors.  This implies that the business objects must be allocated in the route handler.




Business objects:

The "/renderJadeSnippet" route handler does two things.  First, it looks to see if there is a business object specified:

		var objectBusinessObject = req.body.businessObject;
		if (objectBusinessObject) {

      			...
    		}
    
Notice that the request body object is the data object passed from the ajax call.

If a business object is specified, it is required, allocated, cached and invoked:

			// Get the cached business object instance, or...
			var instance = objectInstantiatedModules[objectBusinessObject.module];
			if (!instance) {

				// ...require module, and...
				var module = require("./modules/" + objectBusinessObject.module);

				// ...allocate type.
				instance = new module();

				// Cache.
				objectInstantiatedModules[objectBusinessObject.module] = instance;
			}

			// Invoke method to augment the body property.
			var exceptionRet = instance[objectBusinessObject.method](req.body);
			if (exceptionRet) {

				throw exceptionRet;
			}

Notice that the request body is passed into the invoked business object method.  This is a critical parameter.  The business object exists merely to augment this parameter.  This same parameter, thusly augmented, is passed on to the jade template file.  

A sample business object follows:

module.exports = function Templates() {
	
	this.process = function (objectBody) {

		objectBody.projects = [...];
	};
};

All business objects follow this interface.  They take an objectBody and the purpose is to augment this parameter by adding addition properties for the jade file to consume.


Jade documents:
...

Client side event handlers:
...


Take care,
Ken.
