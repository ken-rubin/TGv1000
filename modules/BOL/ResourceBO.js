//////////////////////////////////
// ResourceBO.js module
//
//////////////////////////////////
var fs = require("fs"),
    gm = require("gm"),
    util = require("util");
var mysql = require("mysql");

module.exports = function ResourceBO(app, sql, logger, mailWrapper) {

    var self = this;                // Über closure.

    // Private fields
    var m_resourceTypes = ['0-unused'];

    self.dbname = app.get("dbname");

    // Fill m_resourceTypes from database.
    try {

        var exceptionRet = sql.execute("select * from " + self.dbname + "resourceTypes order by id asc",
            function(rows) {

                if (rows.length === 0) {

                    throw new Error('Failed to read resource types from database. Cannot proceed.');

                } else {

                    // Make sure rows are sorted by id.
                    rows.sort(function(a,b){return a.id - b.id;})
                    for (var i = 0; i < rows.length; i++) {

                        m_resourceTypes.push(rows[i].description);
                    }
                }
            },
            function (strError) {

                throw new Error("Received error reading resource types from database. Cannot proceed. " + strError);

            });
        if (exceptionRet) {

            throw exceptionRet;
        }

    } catch (e) {

        throw e;
    }
    
    ////////////////////////////////////
    // Public methods
    
    // Router handler functions.
    self.routeSaveURLResource = function (req, res) {

        try {

            console.log("Entered AdminBO/routeSaveURLResource with req.body=" + JSON.stringify(req.body));
            // req.user.userId
            // req.user.userName
            // req.body.url             image or sound to retrieve
            // req.body.description     description to allow fuzzy string search -- used to be: tags to associate with resource (in addition to resourceName and 'sound' or 'image')
            // req.body.resourceTypeId
            // req.body.resourceName

            // Notes: 
            //      Allowed image extensions are png, jpg and jpeg. It's checked here for URL fetches.
            //      All image files are saved with extension png. That way we only have to save resourceId throughout. The browser knows how to display them.

            var urlParts = req.body.url.split("/");
            var l = urlParts.length;
            if (l === 0) {

                res.json({
                    success:false,
                    message: 'Could not understand your URL. Sorry.'
                });
                return;
            }
            var filename = urlParts[l - 1]; // like: xxxx.png
            var filenameParts = filename.split('.');
            l = filenameParts.length;
            if (l !== 2) {

                res.json({
                    success:false,
                    message: 'Could not understand your URL. Sorry.'
                });
                return;
            }
            var ext = filenameParts[1];

            // validate ext if image type
            if (req.body.resourceTypeId === "1") {

                if (ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg') {

                    res.json({
                        success: false,
                        message: 'Invalid file extension. TechGroms allows png, jpg and jpeg.'
                    });
                    return;
                } else {

                    // The image is presumably ok. Set extension to png as described in notes above.
                    ext = 'png';
                }
            } else {

                ext = 'mp3';
            }

            // Grab the image or sound.
            var request = require('request').defaults({ encoding: null });
            request.get(req.body.url, function (err, resp, body) {

                if (err || resp.statusCode !== 200) {

                    res.json({
                        success: false,
                        message: 'Could not load resource from URL.'
                    });
                } else {

                    // body is a buffer containing the resource.

                    var sqlString = "insert " + self.dbname + "resources (createdByUserId,resourceTypeId,public,name,description) values (" + req.user.userId + "," + req.body.resourceTypeId + ",0," + mysql.escape(req.body.resourceName) + "," + mysql.escape(req.body.description) + ");";
                    sql.execute(sqlString,
                        function(rows){

                            if (rows.length === 0) {

                                res.json({
                                    success:false,
                                    message: 'Failed to create resource in database'
                                });
                            } else {

                                var id = rows[0].insertId;

                                var resourcePath = 'public/resources/' + id.toString() + '.' + ext;
                                fs.writeFile(resourcePath, body, function(err) {

                                    if (err) {

                                        res.json({
                                            success:false,
                                            message: err.message
                                        });
                                    } else {

                                        // The original file has been placed into the resources folder.
                                        res.json({
                                            success: true,
                                            id: id
                                        });
                                    }
                                });
                            }
                        },
                        function(strError){

                            res.json({
                                success:false,
                                message:strError
                            });
                        }
                    );
                }
            });
        } catch (e) {

            res.json({
                success: false,
                message: e.message
            });
        }
    }

    self.routeSaveResource = function (req, res) {

        try {

            console.log("******Entered ResourceBO/routeSaveResource with req.body=" + JSON.stringify(req.body));
            // req.user.userId
            // req.user.userName
            // req.body.resourceTypeId
            // req.body.filePath        name assigned by multer with folder; e.g., "uploads\\xyz123456789.png"
            // req.body.description     description for fuzzy search -- used to be: tags to associate with resource (in addition to resourceName and 'sound' or 'image')
            // req.body.resourceName

            // Notes: 
            //      Allowed image extensions are png, jpg, jpeg. That has been checked on the client.
            //      All image files are saved with extension png. That way we only have to save resourceId throughout. The browser knows how to display them.
            //      Only mp3 sound resources are allowed.

            var ext = (req.body.resourceTypeId === "1") ? 'png' : "mp3";

            var sqlString = "insert " + self.dbname + "resources (createdByUserId,resourceTypeId,public,name,description) values (" + req.user.userId + "," + req.body.resourceTypeId + ",0," + mysql.escape(req.body.resourceName) + "," + mysql.escape(req.body.description) + ");";
            sql.execute(sqlString,
                function(rows){

                    if (rows.length === 0) {

                        res.json({
                            success:false,
                            message: 'Failed to create resource in database'
                        });
                    } else {

                        var id = rows[0].insertId;
                        var resourcePath = 'public/resources/' + id.toString() + '.' + ext;
                        fs.rename(req.body.filePath, resourcePath, function(err){

                            if (err) {

                                res.json({
                                    success:false,
                                    message: err.message
                                });
                            } else {

                                // The original file has been placed into the resources folder.
                                res.json({
                                    success:true,
                                    id: id
                                });
                            }
                        });
                    }
                },
                function(strError){

                    res.json({
                        success:false,
                        message:strError
                    }
                );

            });
        } catch (e) {

            res.json({
                success: false,
                message: e.message
            });
        }
    }

    // self.routeFetchResources = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeFetchResources with req.body=" + JSON.stringify(req.body));
    //         // req.body.strUserId
    //         // req.body.resourceTypeId

    //         var sqlString = "select * from " + self.dbname + "resources where (createdByUserId=" + req.body.strUserId + " or public=1) AND resourceTypeId=" + req.body.resourceTypeId + " order by public asc, friendlyName asc;";
    //         //console.log(sqlString);
    //         var exceptionRet = sql.execute(sqlString,
    //             function(rows){

    //                 res.json({
    //                     success: true,
    //                     arrayRows: rows
    //                 });
    //             },
    //             function(strError) {

    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             }
    //         );

    //         if (exceptionRet) {

    //             res.json({
    //                 success: false,
    //                 message: exceptionRet.message
    //             });
    //         }
    //     } catch(e) {

    //         res.json({
    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

    // self.routeDeleteResource = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeDeleteResource with req.body=" + JSON.stringify(req.body));
    //         // req.body.resourceId
    //         // req.body.resourceTypeId
    //         // req.body.ext (ext of the original)

    //         // Copy old resource to /public/quarantine. Keep the same name it had.
    //         // For images, overwrite originals with public/images/disallowed.png and thumbnail with disallowedt.png.
    //         // For sounds, overwrite origianl with public/sounds/Evil_laugh_male.mp3.

    //         // Update the record in resources, set quarantined=1, origext=ext and ext='png' or 'mp3', as appropriate.

    //         fs.readFile('public/resources/' + req.body.resourceId + '.' + req.body.ext, function(err, data){

    //             if (err) {
    //                 res.json({
    //                     success:false,
    //                     message:'Error reading original resource: ' + err.message + '. Nothing done.'
    //                 });
    //                 return;
    //             }
    //             fs.writeFile('public/quarantine/' + req.body.resourceId + '.' + req.body.ext, data, function(err){
    //                 if (err){
    //                     res.json({
    //                         success:false,
    //                         message:'Error writing original resource to quarantine folder: ' + err.message + '. Nothing done.'
    //                     });
    //                     return;
    //                 }
    //                 if (req.body.resourceTypeId === "1") {

    //                     // Now the thumbnail
    //                     fs.readFile('public/resources/' + req.body.resourceId + 't.' + req.body.ext, function(err, data){

    //                         if (err) {
    //                             res.json({
    //                                 success:false,
    //                                 message:'Error reading original resource thumbnail: ' + err.message + '. Nothing done.'
    //                             });
    //                             return;
    //                         }
    //                         fs.writeFile('public/quarantine/' + req.body.resourceId + 't.' + req.body.ext, data, function(err){
    //                             if (err){
    //                                 res.json({
    //                                     success:false,
    //                                     message:'Error writing original resource thumbnail to quarantine folder: ' + err.message + '. Nothing done.'
    //                                 });
    //                                 return;
    //                             }

    //                             // Read disallowed.png into buffer from '/public/images/' and write it to '/public/resources/' + new name that uses id
    //                             fs.readFile('public/images/disallowed.png', function(err, data){

    //                                 if (err) {

    //                                     res.json({
    //                                         success:false,
    //                                         message:'Error reading "disallowed" file: ' + err.message
    //                                     });
    //                                 } else {

    //                                     var newFn = 'public/resources/' + req.body.resourceId + '.png';
    //                                     fs.writeFile(newFn, data, function(err){    // this overwrites (if the previous file was a png)

    //                                         if (err) {

    //                                             res.json({
    //                                                 success:false,
    //                                                 message:'Error writing new "disallowed" file: ' + err.message
    //                                             });
    //                                         } else {

    //                                             // Read disallowedt.png into buffer from '/public/images/' and write it to '/public/resources/' + new name that uses id + 't'
    //                                             fs.readFile('public/images/disallowedt.png', function(err, data){

    //                                                 if (err) {

    //                                                     res.json({
    //                                                         success:false,
    //                                                         message:'Error reading "disallowed" thumbnail file: ' + err.message
    //                                                     });
    //                                                 } else {

    //                                                     var newFn = 'public/resources/' + req.body.resourceId + 't.png';
    //                                                     fs.writeFile(newFn, data, function(err){    // this overwrites (again, if the previous was a png)

    //                                                         if (err) {

    //                                                             res.json({
    //                                                                 success:false,
    //                                                                 message:'Error writing new "disallowed" thumbnail file: ' + err.message
    //                                                             });
    //                                                         } else {

    //                                                             if (req.body.ext !== 'png') {

    //                                                                 // need to delete the original image files with their non-png extensions
    //                                                                 // need to update the ext in the resources table and will need to update the data when we get back
    //                                                                 // Also, mark as quarantined, etc.
    //                                                                 fs.unlink('public/resources/' + req.body.resourceId + '.' + req.body.ext, function(err){

    //                                                                     if (err) {

    //                                                                         res.json({
    //                                                                             success:false,
    //                                                                             message:'Error removing original image: ' + err.message
    //                                                                         });
    //                                                                     } else {

    //                                                                         fs.unlink('public/resources/' + req.body.resourceId + 't.' + req.body.ext, function(err){

    //                                                                             if (err) {

    //                                                                                 res.json({
    //                                                                                     success:false,
    //                                                                                     message:'Error removing original thumbnail image: ' + err.message
    //                                                                                 });
    //                                                                             } else {

    //                                                                                 sql.execute("update " + self.dbname + "resources set quarantined=1, origext=ext, ext='png' where id=" + req.body.resourceId + ";",
    //                                                                                     function(rows){

    //                                                                                         res.json({
    //                                                                                             success:true
    //                                                                                         });
    //                                                                                     },
    //                                                                                     function(strError){

    //                                                                                         res.json({
    //                                                                                             success:false,
    //                                                                                             message:'Error updating database record with new extension: ' + err.message
    //                                                                                         });
    //                                                                                     });
    //                                                                             }
    //                                                                         });
    //                                                                     }
    //                                                                 });
    //                                                             } else {
    //                                                                 res.json({
    //                                                                     success:true
    //                                                                 });
    //                                                             }
    //                                                         }
    //                                                     });
    //                                                 }
    //                                             });
    //                                         }
    //                                     });
    //                                 }
    //                             });
    //                         })
    //                     });
    //                 } else {

    //                     // Read Evil_Laugh_Male.mp3 into buffer from '/public/sounds/' and write it to '/public/resources/' + new name that uses id
    //                     fs.readFile('public/sounds/Evil_Laugh_Male.mp3', function(err, data){

    //                         if (err) {

    //                             res.json({
    //                                 success:false,
    //                                 message:'Error reading "disallowed" sound file: ' + err.message
    //                             });
    //                         } else {

    //                             var newFn = 'public/resources/' + req.body.resourceId + '.mp3';
    //                             fs.writeFile(newFn, data, function(err){    // this overwrites if originally an mp3

    //                                 if (err) {

    //                                     res.json({
    //                                         success:false,
    //                                         message:'Error writing new "disallowed" file: ' + err.message
    //                                     });
    //                                 } else {

    //                                     sql.execute("update " + self.dbname + "resources set origext=ext, quarantined=1, ext='mp3' where id=" + req.body.resourceId + ";",
    //                                         function(rows){

    //                                             res.json({
    //                                                 success:true
    //                                             });
    //                                         },
    //                                         function(strError){

    //                                             res.json({
    //                                                 success:false,
    //                                                 message:'Error updating database record with new extension: ' + err.message
    //                                             });
    //                                         });
    //                                 }
    //                             });
    //                         }
    //                     });
    //                 }
    //             });
    //         });
    //     } catch (e) {
            
    //         res.json({
    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

    // self.routeMaintainResource = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeMaintainResource with req.body=" + JSON.stringify(req.body));
    //         // req.body.resourceId
    //         // req.body.function ('publicize' or 'addtags')
    //         // req.body.addTags (string of new tags if function is 'addtags')

    //         if (req.body.function === 'publicize') {

    //             var exceptionRet = sql.execute("update " + self.dbname + "resources set public=1 where id=" + req.body.resourceId + ";",
    //                 function(rows) {

    //                     res.json({
    //                         success: true
    //                     });
    //                 },
    //                 function(strError) {

    //                     res.json({
    //                         success: false,
    //                         message: strError
    //                     });
    //                 });
    //             if (exceptionRet) {

    //                 res.json({
    //                     success: false,
    //                     message: exceptionRet.message
    //                 });
    //             }
    //         } else {

    //             // addtags. On success it returns success:true and strTags:strTags as in next function.
    //             var tagArray = req.body.addTags.match(/([\w\-]+)/g);
    //             m_doTags(tagArray, req.body.resourceId, function(err){

    //                 if (err) {
    //                     res.json({
    //                         success:false,
    //                         message:'Error adding tags: ' + err.message
    //                     });
    //                 } else {

    //                     var exceptionRet = sql.execute("select description from " + self.dbname + "resources_tags rt inner join " + self.dbname + "tags t on rt.tagId=t.id where resourceId=" + req.body.resourceId + ";",
    //                         function(rows) {

    //                             if (rows.length === 0) {

    //                                 res.json({
    //                                     success: false,
    //                                     message: 'Could not retrieve tags'
    //                                 });
    //                             } else {

    //                                 var strTags;
    //                                 for (var i = 0; i < rows.length; i++) {

    //                                     if (i === 0)
    //                                         strTags = rows[i].description;
    //                                     else
    //                                         strTags = strTags + ', ' + rows[i].description;
    //                                 }
    //                                 res.json({
    //                                     success:true,
    //                                     strTags:strTags
    //                                 });
    //                             }
    //                         },
    //                         function(strErr){

    //                             res.json({
    //                                 success:false,
    //                                 message:'Error received adding and then retrieving tags: ' + strErr
    //                             });
    //                         });
    //                 }
    //             });
    //         }
    //     } catch (e) {
            
    //         res.json({
    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

    // self.routeRetrieveResourceDetail = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeRetrieveResourceDetail with req.body=" + JSON.stringify(req.body));
    //         // req.body.resourceId
    //         // req.body.resourceTypeId (1 or 2)
    //         // req.body.createdByUserId
    //         // req.body.ext

    //         // For either type we want to retrieve: strTags, createdByUserName, kB
    //         // Additionally, for images we want: w, h

    //         var exceptionRet = sql.execute("select description from " + self.dbname + "resources_tags rt inner join " + self.dbname + "tags t on rt.tagId=t.id where resourceId=" + req.body.resourceId + ";",
    //             function(rows) {

    //                 if (rows.length === 0) {

    //                     res.json({
    //                         success: false,
    //                         message: 'Could not retrieve tags'
    //                     });
    //                 } else {

    //                     var strTags;
    //                     for (var i = 0; i < rows.length; i++) {

    //                         if (i === 0)
    //                             strTags = rows[i].description;
    //                         else
    //                             strTags = strTags + ', ' + rows[i].description;
    //                     }

    //                     var userName;
    //                     var strSql = "select name from " + self.dbname + "user where id=" + req.body.createdByUserId + ";";
    //                     console.log(strSql);
    //                     exceptionRet = sql.execute(strSql,
    //                         function(rows){

    //                             if (rows.length === 0){
    //                                 res.json({
    //                                     success:false,
    //                                     message:'Error retrieving owner name'
    //                                 });
    //                             } else {

    //                                 userName = rows[0].name;
    //                                 var fn = 'public/resources/' + req.body.resourceId + '.' + req.body.ext;
    //                                 var stats = fs.statSync(fn);
    //                                 var strInspection = util.inspect(stats);
    //                                 // I would like to do: var inspection = JSON.parse(strInspection);
    //                                 // But it craps out. So I'm going to find "size: nnnnn," manually.
    //                                 var ind = strInspection.indexOf(' size:');
    //                                 strInspection = strInspection.substring(ind + 7);
    //                                 ind = strInspection.indexOf(',');
    //                                 strInspection = strInspection.substring(0, ind);
    //                                 var size = parseInt(strInspection, 10);
    //                                 var sizeKB = Math.round(size / 1024);

    //                                 if (req.body.resourceTypeId === "2") {

    //                                     res.json({
    //                                         success:true,
    //                                         strTags:strTags,
    //                                         createdByUsername:userName,
    //                                         kB:sizeKB
    //                                     });
    //                                 } else {

    //                                     gm(fn)
    //                                     .options({imageMagick:true})
    //                                     .size(function(err, size){

    //                                         if (err) {

    //                                             res.json({
    //                                                 success:false,
    //                                                 message: 'Error retrieving image WxH:' + err.message
    //                                             });
    //                                         } else {

    //                                             res.json({
    //                                                 success:true,
    //                                                 strTags:strTags,
    //                                                 createdByUsername:userName,
    //                                                 kB:sizeKB,
    //                                                 w:size.width,
    //                                                 h:size.height
    //                                             });
    //                                         }
    //                                     });
    //                                 }
    //                             }
    //                         },
    //                         function(err){
    //                             res.json({
    //                                 success:false,
    //                                 message:'Error retrieving owner name: ' + err
    //                             });
    //                         });
    //                 }
    //             },
    //             function(strError) {

    //                 res.json({
    //                     success: false,
    //                     message: strError
    //                 });
    //             });
    //         if (exceptionRet) {

    //             res.json({
    //                 success: false,
    //                 message: exceptionRet.message
    //             });
    //         }
    //     } catch (e) {
            
    //         res.json({
    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

    // self.routeRefreshJohnsResources = function (req, res) {

    //     // It is possible that John has added images or sounds by the old manner (into public/images or public/sounds).
    //     // This method is written to be run early in "new way" resources development, but also to be repeated as necessary
    //     // until the new way is put into production.
    //     //
    //     // Retrieve directory contents for public/images and public/sounds. 
    //     // For images, just take *.png (skipping TG*.png and disallowed.png). 
    //     // For sounds, take all except Evil_Laugh_Male.mp3.

    //     try {

    //         console.log("Entered AdminBO/routeRefreshJohnsResources");
    //         // req.body.JohnsUserId

    //         m_JohnsUserId = req.body.JohnsUserId;

    //         m_cleanUpLastEverything(function(msg) {

    //             if (msg) {

    //                 res.json({
    //                     success:false,
    //                     message:'Error cleaning up: ' + msg
    //                 });
    //                 return;

    //             } else {

    //                 var imageFilesArray,
    //                     soundFilesArray;

    //                 fs.readdir('public/images/', function(err, files){

    //                     if (err) {

    //                         res.json({
    //                             success:false,
    //                             message: 'Error reading old images:' + err.message
    //                         });
    //                     } else {

    //                         imageFilesArray = files;

    //                         // purge any not png and any that are TG*.png
    //                         var tempArray = imageFilesArray.filter(function(fn){
    //                             var ext = fn.replace(/^.*\./, '');
    //                             if (ext !== 'png')
    //                                 return false;
    //                             return (fn.substring(0, 2) !== 'TG') && (fn !== 'disallowed.png') && (fn !== 'disallowedt.png') && (fn !== 'Play2.png') && (fn !== 'Pause2.png');
    //                         });
    //                         imageFilesArray = tempArray;

    //                         fs.readdir('public/sounds/', function(err, files){

    //                             if (err) {

    //                                 res.json({
    //                                     success:false,
    //                                     message: 'Error reading old sounds:' + err.message
    //                                 });
    //                             } else {

    //                                 soundFilesArray = files;
    //                                 var tempArray = soundFilesArray.filter(function(fn){
    //                                     return fn !== 'Evil_Laugh_Male.mp3';
    //                                 });
    //                                 soundFilesArray = tempArray;

    //                                 // Now have filtered images and all sounds.
    //                                 var iCounter = imageFilesArray.length;
    //                                 for (var i = 0; i < imageFilesArray.length; i++) {
                                        
    //                                     m_doJohnsImage(imageFilesArray[i], function(err){

    //                                         if (err) {

    //                                             res.json({
    //                                                 success:false,
    //                                                 message: 'Error doing image #' + (imageFilesArray.length - iCounter).toString() + ': ' + err.message + '. Manual clean-up is required'
    //                                             });
    //                                             return;
    //                                         }
    //                                         if (--iCounter === 0) {

    //                                             iCounter = soundFilesArray.length;                            
    //                                             for (var i = 0; i < soundFilesArray.length; i++) {
                                                    
    //                                                 m_doJohnsSound(soundFilesArray[i], function(err){

    //                                                     if (err) {

    //                                                         res.json({
    //                                                             success:false,
    //                                                             message: 'Error doing sound #' + (soundFilesArray.length - iCounter).toString() + ': ' + err.message + '. Manual clean-up is required'
    //                                                         });
    //                                                         return;
    //                                                     }
    //                                                     if (--iCounter === 0) {

    //                                                         res.json({
    //                                                             success:true
    //                                                         });
    //                                                     }
    //                                                 });
    //                                             }
    //                                         }
    //                                     });
    //                                 }
    //                             }
    //                         });
    //                     }
    //                 });
    //             }
    //         });
    //     } catch (e) {

    //         res.json({
    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

    // self.routeUndeleteResource = function (req, res) {

    //     try {

    //         console.log("Entered AdminBO/routeUndeleteResource with req.body=" + JSON.stringify(req.body));
    //         // req.body.resourceId
    //         // req.body.resourceTypeId
    //         // req.body.currext (ext of what's being displayed for the quarantined resource)
    //         // req.body.origext (ext of the original version)

    //         // The original quarantines images (full-size and thumbnail) or mp3 sound file are in /public/quarantine.
    //         // They still have their old names (id+x.origext).
    //         // Rename to copy over the quarantined version(s) and to delete the item in quarantine.
    //         // Note: if req.body.origext !== req.body.currext, we still have to delete the temporary item(s).
    //         // Update the resource in the database. Set quarantined=0, ext=origext, origext=''

    //         var qname = 'public/quarantine/' + req.body.resourceId + '.' + req.body.origext;    // quarantine name
    //         var rname = 'public/resources/' + req.body.resourceId + '.' + req.body.origext;     // rename name
    //         var qnameThumb;
    //         var rnameThumb;
    //         var tname = 'public/resources/' + req.body.resourceId + '.' + req.body.currext;     // delete name (if nec.)
    //         var tnameThumb;
    //         if (req.body.resourceTypeId === "1") {

    //             var qnameThumb = 'public/quarantine/' + req.body.resourceId + 't.' + req.body.origext;
    //             var rnameThumb = 'public/resources/' + req.body.resourceId + 't.' + req.body.origext;
    //             var tnameThumb = 'public/resources/' + req.body.resourceId + 't.' + req.body.currext;
    //         }

    //         fs.rename(qname, rname, function(err){

    //             if (err) {
    //                 res.json({
    //                     success:false,
    //                     message: err.message
    //                 });
    //                 return;
    //             }
    //             if (req.body.resourceTypeId === "1") {

    //                 fs.rename(qnameThumb, rnameThumb, function(err){

    //                     if (err) {
    //                         res.json({
    //                             success:false,
    //                             message:err.message
    //                         });
    //                         return;
    //                     }
    //                 });
    //             }

    //             sql.execute("update " + self.dbname + "resources set quarantined=0,ext=origext,origext='' where id=" + req.body.resourceId + ";",
    //                 function(rows){

    //                     if (req.body.currext !== req.body.origext) {

    //                         fs.unlink(tname, function(err){

    //                             if (err) {
    //                                 res.json({
    //                                     success:false,
    //                                     message:err.message
    //                                 });
    //                                 return;
    //                             }
    //                             if (req.body.resourceTypeId === "1") {

    //                                 fs.unlink(tnameThumb, function(err){

    //                                     if (err) {
    //                                         res.json({
    //                                             success:false,
    //                                             message:err.message
    //                                         });
    //                                         return;
    //                                     }
    //                                 });
    //                             }
    //                         });
    //                     }
    //                     // Not waiting around for those unlinks.
    //                     res.json({
    //                         success:true
    //                     });
    //                 },
    //                 function(strError){
    //                     res.json({
    //                         success:false,
    //                         message:strError
    //                     });
    //                 });

    //         });
    //     } catch (e) {
            
    //         res.json({
    //             success: false,
    //             message: e.message
    //         });
    //     }
    // }

    // Private methods
    // var m_doJohnsImage = function(imageFile, callback) {

    //     var friendlyName = imageFile.replace(/\.[0-9a-z]+$/i, '');
    //     friendlyName = friendlyName.replace(' ', '_').toLowerCase();
    //     var ext = imageFile.replace(/^.*\./, '');
    //     var sqlString = "insert " + self.dbname + "resources (createdByUserId,friendlyName,resourceTypeId,public,ext) values (" + m_JohnsUserId + ",'" + friendlyName + "',1,1,'" + ext + "');";
    //     sql.execute(sqlString,
    //         function(rows){

    //             if (rows.length === 0) {

    //                 callback({message:'Failed to create resource in database'});

    //             } else {

    //                 var id = rows[0].insertId;
                    
    //                 // Read file into buffer from '/public/images/' + imageFile and write it to '/public/resources/' + new name that uses id
    //                 fs.readFile('public/images/' + imageFile, function(err, data){

    //                     if (err) {

    //                         callback(err);
                        
    //                     } else {

    //                         var newFn = 'public/resources/' + id.toString() + '.' + ext;
    //                         fs.writeFile(newFn, data, function(err){

    //                             if (err) {

    //                                 callback(err);
                                
    //                             } else {

    //                                 // create the thumbnail
    //                                 gm(newFn)
    //                                 .options({imageMagick:true})
    //                                 .size(function(err, size){

    //                                         if (err) {

    //                                             callback(err);
    //                                         } else {

    //                                             // resize, keeping a/r.
    //                                             var maxW = 100;
    //                                             var maxH = 100;
    //                                             var ratio = 0;
    //                                             var height = size.height;
    //                                             var width = size.width;
    //                                             if (width > maxW) {
    //                                                 ratio = maxW / width;
    //                                                 height = height * ratio;
    //                                                 width = width * ratio;
    //                                             }
    //                                             if (height > maxH) {
    //                                                 ratio = maxH / height;
    //                                                 height = height * ratio;
    //                                                 width = width * ratio;
    //                                             }

    //                                             gm(newFn)
    //                                             .options({imageMagick:true})
    //                                             .resize(width, height)
    //                                             .noProfile()
    //                                             .write('public/resources/' + id.toString() + 't.' + ext, function(err){

    //                                                     if (err) {

    //                                                         callback(err);

    //                                                     } else {

    //                                                         var tagIds = [];
    //                                                         tagIds.push(1); // "image"
    //                                                         sql.execute("insert " + self.dbname + "tags (description)values('" + friendlyName + "');",
    //                                                             function(rows){
    //                                                                 if (rows.length > 0) {

    //                                                                     tagIds.push(rows[0].insertId);
    //                                                                     callback(m_createTagJunctions(id, tagIds));
                                                                    
    //                                                                 } else {

    //                                                                     callback({message:"Error inserting into resources_tags"});
    //                                                                 }
    //                                                             },
    //                                                             function(err){

    //                                                                 callback({message:"Error inserting into resources_tags: " + err});
    //                                                             });
    //                                                     }
    //                                                 }
    //                                             );
    //                                         }
    //                                     }
    //                                 );
    //                             }
    //                         });
    //                     }
    //                 });
    //             }
    //         },
    //         function(err){
    //             callback({message:err});
    //         }
    //     );
    // }

    // var m_doJohnsSound = function(soundFile, callback) {

    //     var friendlyName = soundFile.replace(/\.[0-9a-z]+$/i, '');
    //     friendlyName = friendlyName.replace(' ', '_').toLowerCase();
    //     var ext = soundFile.replace(/^.*\./, '');
    //     var sqlString = "insert " + self.dbname + "resources (createdByUserId,friendlyName,resourceTypeId, public,ext) values (" + m_JohnsUserId + ",'" + friendlyName + "',2,1,'" + ext + "');";
    //     sql.execute(sqlString,
    //         function(rows){

    //             if (rows.length === 0) {

    //                 callback('Failed to create resource in database');

    //             } else {

    //                 var id = rows[0].insertId;
                    
    //                 // Read file into buffer from '/public/sounds/' + soundFile and write it to '/public/resources/' + new name that uses id
    //                 fs.readFile('public/sounds/' + soundFile, function(err, data){

    //                     if (err) {

    //                         callback(err);
                        
    //                     } else {

    //                         var newFn = 'public/resources/' + id.toString() + '.' + ext;
    //                         fs.writeFile(newFn, data, function(err){

    //                             if (err) {

    //                                 callback(err);
                                
    //                             } else {

    //                                 var tagIds = [];
    //                                 tagIds.push(2); // "sound"
    //                                 sql.execute("insert " + self.dbname + "tags (description)values('" + friendlyName + "');",
    //                                     function(rows){
    //                                         if (rows.length > 0) {

    //                                             tagIds.push(rows[0].insertId);
    //                                             callback(m_createTagJunctions(id, tagIds));
                                            
    //                                         } else {

    //                                             callback({message:"Error inserting into resources_tags"});
    //                                         }
    //                                     },
    //                                     function(err){

    //                                         callback({message:"Error inserting into resources_tags: " + err});
    //                                     });
    //                             }
    //                         });
    //                     }
    //                 });
    //             }
    //         },
    //         function(err){
    //             callback({message: err});
    //         }
    //     );
    // }

    // var m_cleanUpLastEverything = function(callback) {

    //     try {

    //         // About to re-import John's stuff. We will delete everything from these tables:
    //         // resources, tags, resources_tags, projects_tags, objects_tags
    //         // and we will delete all resources in public/resources.
    //         var path = 'public/resources';
    //         if (fs.existsSync(path)) {

    //             fs.readdirSync(path).forEach(function(file,index){
    //                 fs.unlinkSync(path + '/' + file);
    //             });
    //         } else {

    //             fs.mkdirSync(path);
    //         }

    //         var path = 'public/quarantine';
    //         if (fs.existsSync(path)) {

    //             fs.readdirSync(path).forEach(function(file,index){
    //                 fs.unlinkSync(path + '/' + file);
    //             });
    //         } else {

    //             fs.mkdirSync(path);
    //         }

    //         var exceptionRet = sql.execute("delete from " + self.dbname + "resources;",
    //             function(rows){

    //                 sql.execute("delete from " + self.dbname + "tags where id>2;",
    //                     function(rows){

    //                         sql.execute("delete from " + self.dbname + "resources_tags;",
    //                             function(rows){

    //                                 sql.execute("delete from " + self.dbname + "projects_tags;",
    //                                     function(rows){

    //                                         sql.execute("delete from " + self.dbname + "objects_tags;",
    //                                             function(rows){
    //                                                 callback(null);
    //                                             },
    //                                             function(err){
    //                                                 callback(err);
    //                                             });
    //                                     },
    //                                     function(err){
    //                                         callback(err);
    //                                     });
    //                             },
    //                             function(err){
    //                                 callback(err);
    //                             });
    //                     },
    //                     function(err){
    //                         callback(err);
    //                     });
    //             },
    //             function(err){
    //                 callback(err);
    //             });
    //     } catch(e) {

    //         callback(e.message);
    //     }
    // }

    // var m_createTagJunctions = function(resourceId, tagIds) {

    //     var strSql = "insert into " + self.dbname + "resources_tags (resourceId,tagId) values";
    //     for (var j = 0; j < tagIds.length; j++) {

    //         strSql = strSql + "(" + resourceId.toString() + "," + tagIds[j].toString() + ")";
    //         if (j !== tagIds.length - 1){

    //             strSql = strSql + ",";
    //         }
    //     }
    //     strSql = strSql + ";";
    //     sql.execute(strSql,
    //         function(rows){

    //             return null;
    //         },
    //         function(strErr){

    //             return {message:'Error received inserting into resources_tags: ' + strErr};
    //         }
    //     );
    // }

    // var m_setUpAndDoTags = function(resourceId, strResourceTypeId, userName, strTags, strName, callback) {

    //     try {
            
    //         console.log("In m_setUpAndDoTags with resourceId=" + resourceId);

    //         // Start tagArray with resource type description, userName and resource name (with internal spaces replaced by '_').
    //         var tagArray = [];
    //         tagArray.push(m_resourceTypes[parseInt(strResourceTypeId, 10)]);
    //         tagArray.push(userName);
    //         if (strName.length > 0) {

    //             tagArray.push(strName.trim().replace(/\s/g, '_'));
    //         }

    //         // Get optional user-entered tags ready to combine with above three tags.
    //         var ccArray = [];
    //         if (strTags) {

    //             ccArray = strTags.toLowerCase().match(/([\w\-]+)/g);

    //             if (ccArray){
    //                 tagArray = tagArray.concat(ccArray);
    //             }
    //         }

    //         // Remove possible dups from tagArray.
    //         var uniqueArray = [];
    //         uniqueArray.push(tagArray[0]);
    //         for (var i = 1; i < tagArray.length; i++) {
    //             var compIth = tagArray[i];
    //             var found = false;
    //             for (var j = 0; j < uniqueArray.length; j++) {
    //                 if (uniqueArray[j] === compIth){
    //                     found = true;
    //                     break;
    //                 }
    //             }
    //             if (!found) {
    //                 uniqueArray.push(compIth);
    //             }
    //         }

    //         m_doTags(uniqueArray, resourceId, callback);

    //     } catch(e) {

    //         callback(e);
    //         return;
    //     }
    // }

    // var m_doTags = function(tagArray, resourceId, callback){

    //     var tagIds = [];
    //     var iCtr = tagArray.length;
    //     // For each string in tagArry:
    //     //      if it already exists in table tags, push its id onto tagIds.
    //     //      else, add it and push the new array.
    //     // Then write as many records to resources_tags using resourceId and tagIds[i] as called for.

    //     tagArray.forEach(function(tag) {

    //         var strSql = "select id from " + self.dbname + "tags where description='" + tag + "';";
    //         sql.execute(strSql,
    //             function(rows){

    //                 if (rows.length > 0) {

    //                     tagIds.push(rows[0].id);
    //                     if (--iCtr === 0){

    //                         callback(m_createTagJunctions(resourceId, tagIds));
    //                         return;
    //                     }

    //                 } else {

    //                     strSql = "insert into " + self.dbname + "tags (description) values (" + mysql.escape(tag) + ");";
    //                     sql.execute(strSql,
    //                         function(rows){

    //                             if (rows.length === 0) {

    //                                 callback({message:'Could not insert tag into database.'});
    //                                 return;
                                
    //                             } else {

    //                                 tagIds.push(rows[0].insertId);
    //                                 if (--iCtr === 0){

    //                                     callback(m_createTagJunctions(resourceId, tagIds));
    //                                     return;
    //                                 }
    //                             }
    //                         },
    //                         function(err){

    //                             callback({message:err});
    //                             return;
    //                         });
    //                 }
    //             },
    //             function(err){

    //                 callback({message:err});
    //                 return;
    //             });
    //     });
    // }
};