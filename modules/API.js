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
    
    self.processDecline = function(token) {

    }

    ////////////////////////////////////
    // Private fields

};
