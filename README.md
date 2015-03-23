Prerequisites:

The project depends on the "node-dev" npm package to handle automatic server restarts and the "node-inspector" npm package for server debugging.  
Please install these resources globally for full integration.


Initialization:

Execute: "git clone https://github.com/ken-rubin/TGv1000.git", to get the code.
Note that the above command creates a subdirectory from the current, active user directory.

Then execute: "npm install", from the root project folder to install all required local npm package dependencies.


Execution:

Execute: "(sudo) npm start", to run the server.  Sudo is a Unix command to give administrative priviliges to the subsequent command.  This is necessary because the server listens on port 80 by default and this is a restricted port on most systems.  Windows users may require similar measures akin to "running as administrator".

Then open a browser and navigate to: "localhost".  You should see the main page of the application.  Explore at your own risk/enjoyment.

Architecture:

This sample amouts to an exploration of dynamic content injection and its structured resolution.
The theoretical scenario of a projects dialog forms the bases for this exploration.  The dialog is presented to the user and all content is dynamically loaded into the DOM on-demand.  Two routes form the basis of this framework.  One is fully implemented and the other is, at the moment, prototypical.  "/renderJadeSnippet" is fully implemented and will be exlplored in this document.  The "/projectsDialog" route is not yet complete.  It will be morphed into a corresponding route, filling the role of a URL-encoded GET request whereas the "/renderJadeSnippet" is a POST route.

The purpose of the "/renderJadeSnippet" route is to serve up HTML-snippets to the client by processing a jade document.  The client can specify information which is consumed by the jade document.  In addition, a business object can be specified (also by the client) and it can augment the client data with server data.  The business object is a node module.  It can perform any action necessary to augment the context object (eventually) passed to the jade compiler.  These buisiness objects form the first class of object-hierarchies, named: "BusinessObjects", detailed below.  Typically, the jade document is a snippet, that is, it does not generate a complete web-page but instead  forms a subset which is injected into a complete document on the client.  The snippet typically consumes context data to build its rendered structure.  Ultimately, however, it is only limited by the templative nature of jade.

The jade documents themselves form the second class of object-hierarchies detailed (named: "jade documents").  The jade documents reference a special class of client side AMD-modules, which are intended to be dynamically required on the client and form the third class of object-hierarchies detailed (named: "client-side-event-handlers").

