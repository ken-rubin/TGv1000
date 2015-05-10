//////////////////////////////////
// Logger.js module
//
//////////////////////////////////

module.exports = function Logger(app, sql) {

	var self = this;					// Über closure.

	self.dbname = app.get("dbname");

	//////////////////////////////////////
	// Public methods

	self.logItem = function(logTypeId, context) {

		try {

			var sqlBody = "INSERT " + self.dbname + "logitems (logtypeId, jsoncontext) values (" + logTypeId.toString() + ",'" + JSON.stringify(context).replace(/'/g, "\\'") + "');";
			console.log(' ');
			console.log(sqlBody);
			console.log(' ');
			var exceptionRet = sql.execute(sqlBody, 
				function(rows){
					if (rows.length === 0) {

						console.log("INSERT INTO LOGITEMS FAILED(" + logTypeId.toString() + ")");
					
					} else {

						console.log("Inserted into logitems(" + logTypeId.toString() + ")");
					}
				}, 
				function(strError){

						console.log("INSERT INTO LOGITEMS FAILED(" + logTypeId.toString() + "/" + strError + ")");
				}
			);

			return exceptionRet;

		} catch (e) {

			console.log("INSERT INTO LOGITEMS FAILED(" + logTypeId.toString() + "/" + e.message + ")");
			return e;
		}
	};

	self.getLogItems = function(strTypeIds, unprocessedOnly, additionalWhere, functionSuccess) {

		try {

			sql.execute("SELECT * FROM " + self.dbname + "logitems where logtypeId in (" + strTypeIds + ")" 
				+ (unprocessedOnly ? " AND processed is NULL" : "") 
				+ (additionalWhere ? " AND " + additionalWhere : "")
				+ ";",
				
				function(rows) {

					functionSuccess(rows);
				},
				
				function(strError) {
					console.log("came back with error when selecting logitems");
					throw new Error(strError);
				}
			);

		} catch (e) {
			
			throw e;
		}
	};
}
