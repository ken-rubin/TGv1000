////////////////////////////////////////
// API.js -- Handle true API calls.
//
// Export constructor function.

// Allocate underlying database object.
var mysql = require("mysql");

// Attach and define constructor function.
module.exports = function API(app, sql) {

    var self = this;                // Über closure.

    self.dbname = app.get("dbname");
    self.dbname = self.dbname.substring(0, self.dbname.length - 1);

    
    ////////////////////////////////////
    // Public methods
    
    // Invoked when user accesses .../invite/?decline=...
    self.processDecline = function(token) {

        console.log(token);
        // var profile = JSON.parse(window.atob(token.split('.')[1]));
        // Profile has this structure:
    }

    ////////////////////////////////////
    // Private fields

};
