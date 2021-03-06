## Prerequisites

The project depends on Git, Node and NPM all being installed in a global capacity and the standard, expected rights and privledges for the users running the client and server.  (Don't forget to plug-in your computer too.... :-)

For full node-goodness, the project also depends on the "node-dev" npm package to handle automatic server restarts and the "node-inspector" npm package for server debugging.  
Please install these resources globally for full integration.


## Initialization


Execute: "git clone https://github.com/ken-rubin/TGv1000.git", to get the code.
Note that the above command creates a subdirectory relative to the current active user directory.  So there is no need to create a TGv1000 folder explicitly.

Navigate to the TGv1000 folder then execute: "npm install", from this root project folder to install all required local npm package dependencies.


## Running the project


Execute: "(sudo) npm start", to run the server.  "Start" is a script specified in the package.json file included with the project.  Sudo is a Unix command to give administrative priviliges to the subsequent command(s).  This is necessary because the server listens on port 80 by default and this is a restricted port on most systems.  Windows users may require similar measures akin to "running as administrator".

Then open a browser and navigate to: "localhost".  You should see the main page of the application.  Explore at your own risk/enjoyment.


## Debugging


To debug the server-side of the project, an additional command window must be opened after starting the server application above.  The command: "node-inspector &", is to be executed, and console-presented instructions should be followed thereafter; additionally, refer to the "node-inspector" help documents for more information.

To debug the client-side, simply activate the chosen browser's debug facility while navigating the project site.  Debugging proceeds normally for a browser-hosted web-site.  If necessary, perhaps refer to the browser's debugging documentation for further information?


## Architecture


This sample amouts to an exploration of dynamic content injection and its structured resolution.
The theoretical scenario of a projects dialog forms the basis for this exploration.  The dialog is presented to the user and all content is dynamically loaded into the DOM on-demand.  Two routes form the basis of this framework (in addition to the standard "index" route, which serves up the static page).  One route is fully implemented and the other is, at the moment, just a prototype.  "/renderJadeSnippet" is fully implemented and will be exlplored in this document.  The "/projectsDialog" route is not yet complete.  It will be morphed into a corresponding route, filling the role of a URL-encoded GET request whereas the "/renderJadeSnippet" is a POST route.

The purpose of the "/renderJadeSnippet" route is to serve up HTML-snippets to the client by processing a jade document.  The client can specify information which is consumed by the jade document.  In addition, a business object may be specified (also by the client, but run on the sever).  It should augment the client-specified data with additional server data.  The business object is a node module.  It can perform any action necessary to augment the context object (eventually) passed to the jade compiler.  These buisiness objects form the first class of object-hierarchies, named: "Business objects", and detailed below.  Typically, the jade document is a snippet, that is, it does not generate a complete web-page but instead  forms a subset which is injected into a stand-alone document on the client.  The snippet typically consumes context data (both server and client in origin) to build its rendered structure.  Ultimately, however, this process is only limited by the templative nature of jade.

The jade documents themselves form the second class of object-hierarchies detailed (named: "jade documents").  The jade documents reference a special class of client side AMD-modules, which are intended to be dynamically required on the client and form the third class of object-hierarchies detailed (named: "Client side event handlers").


## Code


The client invokes the route via an ajax call:


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

2) The request is not cached as is specified in the "cache" property of the ajax request.  

3) The data-type is "HTML" (as is specified via the ajax property "dataType")--this indicates that the result is an HTML-snippet.

4) The method is "POST" (...).

5) The route is invoked via the "url" parameter.

6) The "userId" property of the data object is an example of client-specified data.  Utimately this will be passed into the Business object and on to the jade template files (unless overridden via the business object layer).

7) The business object module and method are explicitly specified in the "businessObject" property.  This is a standard property which is looked for explicitly by the server code.

8) The jade template file is specified via the "templateFile" property and it is lower-case, in keeping with standard JavaScript convention.

9) The business object module is upper-case in keeping with Crockford's convention for function constructors.  This implies that the business objects must be allocated in the route handler.




#### Business objects



The "/renderJadeSnippet" route handler does two things.  First, it looks to see if there is a business object specified:

	var objectBusinessObject = req.body.businessObject;
	if (objectBusinessObject) {
	
		...
	}
    	
    
Notice that the request body object is the data object passed from the ajax call.

If a business object is specified, it is required, allocated, cached and invoked:

	var instance = objectInstantiatedModules[objectBusinessObject.module];
	if (!instance) {

		var module = require("./modules/" + objectBusinessObject.module);

		instance = new module();

		objectInstantiatedModules[objectBusinessObject.module] = instance;
	}

	var exceptionRet = instance[objectBusinessObject.method](req.body);
	if (exceptionRet) {

		throw exceptionRet;
	}

Notice that the request body is passed into the invoked business object method.  This is a critical parameter.  The business object exists merely to augment this parameter.  This same parameter--thusly augmented--is passed on to the jade template file.  

A sample business object follows:

	module.exports = function Templates() {
	
		this.process = function (objectBody) {

			objectBody.projects = [...];
		};
	};

All business objects follow this interface.  They take an "objectBody" and their purpose is to augment this parameter by adding additional properties thereto for the jade file to consume.

After the business object augments the context object, it is passed into the jade render call (this is the second and last operation the route handler performs):

	res.render(req.body.templateFile, 
		req.body);



#### Jade documents



The jade document takes the context object and merges it with its DOM rendering structure to produce an HTML-snippet which is streamed back to the client.


	.snippetcontext#ProjectsDialogInnerSearchSnippet(data-module="ProjectsDialogInnerSearchButtonHandler")
		| These are the files that we found given your search criteria.  Either refine your search or choose from one of the projects below to open or clone.
	br
	br
	.collectionContainer
		each project in projects
			button.btn-info.btn.projectItem(id="#{project.id}", data-toggle="tooltip", data-placement="top", data-original-title="#{project.description}")
			br
			| #{project.name}
			br
			br
			img.projectItemImage(src="#{project.imageUrl}")


Note:

1) Properties of the ajax data object (the context object) are referred to directly in the jade template (e.g. "projects").

2) The critical element is the ".snippetcontext" element.  It is given a client-known "id", which will be referenced on the client and specifies the name of the client side event handler module, which is required later on in the client code--the core wiring code is wrapped in the client side module "snippetHelper" as will be seen.


When the initial ajax request returns to the client, the client-specified "done" handler is invoked.  This function just accesses the snippetHelper module to do the client injection and require the client side event handler.



	var m_functionSearchSnippetResponse = function (htmlData) {

		try {

			var exceptionRet = snippetHelper.process(m_dialog,
				htmlData,
				"#TypeWell",
				"#ProjectsDialogSearchSnippet");
			if (exceptionRet) {

				throw exceptionRet;
			}
		} catch (e) {

			errorHelper.show(e.message);
		}
	};


Note: see the snippet module translation unit for a detailed description of the "process" method parameters.


The "snippetHelper" module injects the "htmlSnippet" parameter into the DOM and then inspects it for the aforementioned "snippetcontext":


	var jModuleDefinition = $(strModuleDefinitionElementSelector);
	if (jModuleDefinition.length > 0) {

		var strModule = jModuleDefinition.attr("data-module");

		if (strModule) {

			require([strModule], function (module) {

				try {

					var moduleInstance = new module();
					var exceptionRet = moduleInstance.create(objectContext);
					if (exceptionRet) {

						throw exceptionRet;
					}
				} catch (e) {

					errorHelper.show(e.message);
				}
			});
		}
	}


If the element is found and if the attribute is specified, then the module is required, allocated and created (as above in code!).


Notice: "objectContext" is passed to the "create" method of the client side event handler module.  This is important for carrying over the context from the calling module.  For instance, in this case, the context object is the root dialog object which may ultimately be closed by the client side event handler processing as is natural given the generic nature of the event handlers.  The calling code understand the context and necessary parameters to pass and the invoked handler understand how to use this code by virtual of it instantiation in vitro.


#### Client side event handlers


The last component to be detailed, the client side event handler, is responsible for attaching handlers and conditioning the HTML-snippet.  It is a highly variable component so an example is not listed here.  Please see the project code for an example of a handler instance.


# Conclusion


That's the whole cross-sectional path through the proposed dynamic injection system.  Simple.  Clean.  Elegant.  Rubbish?



Take care,
Ken.
