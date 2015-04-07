////////////////////////////////////
// log.js
//
// A client.side interface to logger in order to put things into the logitems table of the database.
//
///////////////////////////////////

// To enable future logitem analysis, the jsoncontext javaScript object has specific name/value pairs by logtypeId.
// At this time:
// logtypeId	jsoncontext name
//	1				userName
//	2				userId
//	3				
//	4
//	5				module, function, post, message
//				
function addLogItem(logtypeId, jsoncontext) {

    $.ajax({

    	type: "POST",
    	url: "/BOL/UtilityBO/AddLogitem",
    	contentType: "application/json",
    	data: JSON.stringify({logtypeId:logtypeId,jsoncontext:jsoncontext})
    });

    // I'm not going to worry about whether or when it works or doesn't, since there's not much we can do with failure.
}