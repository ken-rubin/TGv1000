//////////////////////////////////
// ProjectBO.js module
//
//////////////////////////////////
var fs = require("fs");
var async = require("async");
var os = require("os");
var moment = require("moment-timezone");
var jwt = require('jsonwebtoken');
var mysql = require("mysql");

module.exports = function ProjectBO(app, sql, logger, mailWrapper) {

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
                    rows.sort(function(a,b){return a.id - b.id;});
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

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //                  SystemTypes stuff
    //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    self.routeFetchNormalUserNewProjectTypes = function (req, res) {

        try {

            m_log("Entered ProjectBO/routeFetchNormalUserNewProjectTypes");

            sql.execute("select projectTypeId from " + self.dbname + "projects where public=1;",
                function(rows) {

                    if (rows.length === 0) {

                        return res.json({success: false, message: "Could find no available project types."});
                    }

                    var array = [];
                    rows.forEach(
                        function(row) {
                            array.push(row.projectTypeId);
                        }
                    );

                    return res.json({
                        success: true,
                        arrayAvailProjTypes: array
                    });
                }
            );
        } catch (e) {

            return res.json({
                success: false,
                message: e.message
            });
        }
    }
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //                  RetrieveProject
    //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    self.routeRetrieveProject = function (req, res) {

        try {

            m_log("Entered ProjectBO/routeRetrieveProject with req.body=" + JSON.stringify(req.body) + " req.user=" + JSON.stringify(req.user));
            // req.body.projectId
            // req.user.userId

            var sqlQuery;
            sqlQuery = "select * from " + self.dbname + "projects where id=" + req.body.projectId + ";";

            var exceptionRet = sql.execute(sqlQuery,
                function(rows) {

                    if (rows.length !== 1) {

                        res.json({success:false, message: "Could not retrieve project with id=" + req.body.id});

                    } else {

                        var row = rows[0];
                        var project = 
                        {
                            id: row.id,
                            originalProjectId: row.id,
                            name: row.name,
                            ownedByUserId: row.ownedByUserId,
                            public: row.public,
                            quarantined: row.quarantined,
                            description: row.description,
                            imageId: row.imageId,
                            altImagePath: row.altImagePath,
                            parentProjectId: row.parentProjectId,
                            parentPrice: row.parentPrice,
                            priceBump: row.priceBump,
                            tags: '',
                            projectTypeId: row.projectTypeId,
                            isCoreProject: (row.isCoreProject === 1 ? true : false),
                            isProduct: (row.isProduct === 1 ? true : false),
                            isClass: (row.isClass === 1 ? true : false),
                            isOnlineClass: (row.isOnlineClass === 1 ? true : false),
                            firstSaved: row.firstSaved,
                            lastSaved: row.lastSaved,
                            chargeId: row.chargeId,
                            comics: [],
                            specialProjectData: {},
                            currentComicIndex: row.currentComicIndex
                        };

                        m_functionFetchTags(
                            project.id, 
                            'project', 
                            function(err, tags)  {

                                if (err) {
                                    return res.json({ success: false, message: err.message});
                                }

                                project.tags = tags;

                                // In series:
                                //  1. Potentially retrieve fields from one of the tables: classes, products or onlineclasses.
                                //  2. Retrieve project's comics and their content.
                                //  3. Retrieve the Base Type (fleshed out) for the App type and push it to projects.systemTypes.
                                //  4. No more. Retrieve all system types (fleshed out) and push them onto projects.systemTypes. Just public ones for a non-prileged user.
                                async.series(
                                    [
                                        // 1. PP data, potentially.
                                        function(cb) {

                                            try {

                                                // If none of these three project fields is true, then there is no purchasable project and we may proceed on to 2.
                                                if (!project.isProduct && !project.isClass && !project.isOnlineClass) {
                                                    // A normal project.
                                                    return cb(null);
                                                }

                                                // Privleged user is editing a project or a non-privileged user is considering buying a purchaseable prject.
                                                // Need to read and insert special Product, Class or OnlineClass data into project.
                                                var tableName = project.isProduct ? 'products' : project.isClass ? 'classes' : 'onlineclasses';
                                                strQuery = "select * from " + self.dbname + tableName + " where baseProjectId=" + project.id + ";";
                                                var exceptionRet = sql.execute(strQuery,
                                                    function(rows) {
                                                        if (rows.length !== 1) {
                                                            return cb(new Error('Error retrieving your project.'));
                                                        }

                                                        // Take the Product, Class or Online class info out of rows[0] and put it in project.specialProjectData.xxxData.
                                                        sPD = {};

                                                        for (var p in rows[0]) {

                                                            if (p === 'schedule') {

                                                                sPD[p] = JSON.parse(rows[0][p]);
                                                            } else {

                                                                sPD[p] = rows[0][p];
                                                            }
                                                        }
                                                        if (project.isProduct) {
                                                            project.specialProjectData['productData'] = sPD;
                                                        } else if (project.isClass) {
                                                            project.specialProjectData['classData'] = sPD;
                                                        } else {
                                                            project.specialProjectData['onlineClassData'] = sPD;
                                                        }

                                                        // Note: the remainder of project.specialProjectData will be added in OpenProjectDialog.js.
                                                        // Also, project fields such as id will be adjusted there. They used to be handled here.

                                                        return cb(null);
                                                    },
                                                    function(strError) {
                                                        return cb(new Error(strError));
                                                    }
                                                );
                                                if (exceptionRet) {
                                                    return cb(exceptionRet);
                                                }
                                            } catch(e) { return cb(e); }
                                        },
                                        // 2. Comics. Since we now will have project and each comic, we can fetch libraries and then types in libraries and below.
                                        function(cb) {

                                            try {

                                                m_functionRetProjDoComics(  
                                                    req, 
                                                    res, 
                                                    project,
                                                    function(err) {
                                                        if (err) { return cb(err); }

                                                        // Success. The project is filled.

                                                        // Sort comics by ordinal.
                                                        project.comics.sort(function(a,b){return a.ordinal - b.ordinal;});

                                                        // Sort comiccode according to its ordinals.
                                                        project.comics.forEach(
                                                            function(comic) {

                                                                // Finally, sort the comic's comiccode.
                                                                comic.comiccode.sort(function(a,b){return a.ordinal - b.ordinal;});
                                                            }
                                                        );

                                                        return cb(null);
                                                    }
                                                );
                                            } catch(e) { return cb(e); }
                                        }
                                    ],
                                    function(err) {
                                        if (err) {
                                            return res.json({success:false, message: err.message});
                                        }

                                        m_functionUpdateUserJWTCookie(
                                            req,
                                            res,
                                            project,
                                            function(err) {

                                                if (err) {

                                                    return res.json({
                                                        success: false,
                                                        message: err.message
                                                    });
                                                }

                                                return res.json({
                                                    success: true,
                                                    project: project
                                                });
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                },
                function(strError) {

                    return res.json( {success:false, message: strError} );
                }
            );

            if (exceptionRet) {

                return res.json({success: false, message: exceptionRet.message});
            }
        } catch(e) {

            res.json({success: false, message: e.message});
        }
    }

    var m_functionUpdateUserJWTCookie = function(req, res, project, callback) {

        try {

            // Save project.name and project.id to user row in DB.
            var sqlQuery = "update " + self.dbname + "user set lastproject=" + mysql.escape(project.name) + ", lastProjectId=" + project.id + " where id=" + req.user.userId + ";";
            sql.execute(
                sqlQuery,
                function(rows) {

                    // Save name and id of this project into profile and send back with cookie.
                    var encodedToken = req.cookies.token.split('.')[1];
                    if (encodedToken) {

                        var bufDecoded = new Buffer(encodedToken, 'base64').toString('ascii');
                        var profile = JSON.parse(bufDecoded);
                        profile["lastProject"] = project.name;
                        profile["lastProjectId"] = project.id;
                        var token = jwt.sign(profile, app.get("jwt_secret"), { expiresIn: 60*60*5});
                        res.cookie('token', token, {maxAge: 60*60*1000, httpOnly: false, secure: false});    // Expires in 1 hour (in ms); change to secure: true in production
                    }

                    return callback(null);
                },
                function(strError) {

                    return callback(new Error(strError));
                }
            );
        } catch (e) {

            callback(e);
        }
    }

    var m_functionRetProjDoComics = function(req, res, project, callback) {

        try {

            // m_log('In m_functionRetProjDoComics');

            var strSql = "select * from " + self.dbname + "comics where id in (select comicId from projects_comics_libraries where projectId=" + project.id + ");";
            var exceptionRet = sql.execute(strSql,
                function(rows) {

                    // Every project has to have at least 1 comic.
                    if (rows.length === 0) {

                        return callback(new Error("Could not retrieve comics for project with id=" + project.id));
                    } 

                    // Use async to process each comic in the project and fetch their internals.
                    // After review, could change eachSeries to each.
                    async.eachSeries(rows,
                        function(comicIth, cbe) {

                            comicIth.originalComicId = comicIth.id;
                            comicIth.comiccode = [];
                            comicIth.libraries = [];
                            comicIth.statements = [];

                            // Fill comicIth's comiccode and libraries.
                            m_functionRetProjDoComicInternals(  req, 
                                                                res, 
                                                                project, 
                                                                comicIth,
                                                                function(err) { 

                                                                    if (!err) {

                                                                        // Add the filled comic to the project.
                                                                        project.comics.push(comicIth);
                                                                    }
                                                                    return cbe(err); 
                                                                }
                            );
                        },
                        function(err) { // Main callback for async.eachSeries.
                            return callback(err);
                        }
                    );
                },
                function(strError) { return callback(new Error(strError)); }
            );
            if (exceptionRet) { return callback(exceptionRet); }
        
        } catch(e) { return callback(e); }
    }

    var m_functionRetProjDoComicInternals = function(   req, 
                                                        res, 
                                                        project, 
                                                        comicIth,
                                                        callback
                                                    ) {
        try {

            // Using async.parallel, load comicIth's libraries and comiccode.
            async.parallel([
                    function(cbp1) {    // libraries

                        var sqlQuery = "select * from " + self.dbname + "libraries where id in (select libraryId from projects_comics_libraries where projectId=" + project.id + " and comicId=" + comicIth.id + ");";
                        var exceptionRet = sql.execute(sqlQuery,
                            function(rows) {
                                
                                if (rows.length === 0) { return cbp1(new Error("Unable to retrieve project. Could not retrieve libraries for comic with id=" + comicIth.id)); }

                                // Use async to process each library and fetch its internals.
                                // After review, could change eachSeries to each perhaps.
                                async.eachSeries(rows,
                                    function(rowIth, cbe1) {

                                        var libraryIth = {
                                            id: rowIth.id,
                                            originalLibraryId: rowIth.id,
                                            isSystemLibrary: (rowIth.isSystemLibrary === 1 ? true : false),
                                            isAppLibrary: (rowIth.isAppLibrary === 1 ? true : false),
                                            isBaseLibrary: (rowIth.isBaseLibrary === 1 ? true : false),
                                            // If not a "special" library, then it's normal. Set it for ease of processing later.
                                            isNormalLibrary: !(rowIth.isSystemLibrary || rowIth.isAppLibrary || rowIth.isBaseLibrary),
                                            imageId: rowIth.imageId,
                                            altImagePath: rowIth.altImagePath
                                        };

                                        libraryIth = Object.assign(libraryIth, JSON.parse(rowIth.libraryJSON).library);

                                        comicIth.libraries.push(libraryIth);
                                        return cbe1(null);
                                    },
                                    function(err) { // Main callback for inner async.eachSeries.

                                        // But return to outer async.parallel for next step or jump to ITS error function.
                                        return cbp1(err);
                                    }
                                );
                            },
                            function(strError) { return cbp1(new Error(strError)); }
                        );
                        if (exceptionRet) { return cbp1(exceptionRet); }
                    },
                    function(cb) {  // statements

                        var strQuery = "select name from " + self.dbname + "statements where id in (select statementId from " + self.dbname + "comics_statements where comicId=" + comicIth.id + ") order by name asc;";
                        sql.execute(
                            strQuery,
                            function(rows) {
                                rows.forEach(
                                    function(rowIth) {
                                        comicIth.statements.push(rowIth.name);
                                    }
                                );
                                return cb(null);
                            },
                            function(strError) {
                                return cb(new Error(strError));
                            }
                        );
                    },
                    function(cbp3) {    // comiccode

                        var exceptionRet = sql.execute("select * from " + self.dbname + "comiccode where comicId=" + comicIth.id + ";",
                            function(rows) {

                                // 0 rows is fine during project/comic development.
                                async.eachSeries(rows,
                                    function(comiccodeIth, cbe3) {

                                        comicIth.comiccode.push(comiccodeIth);
                                        return cbe3(null);
                                    },
                                    function(err) {
                                        return cbp3(err);
                                    }
                                );
                            },
                            function(strError) { return cbp3(new Error(strError)); }
                        );
                        if (exceptionRet) { return cbp3(exceptionRet); }
                    }
                ],
                function(err) {
                    return callback(err);
                }
            );
        } catch(e) { return callback(e); }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //                  Utility method(s) for retrieve routes
    //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var m_functionFetchTags = function(thingId, strItemType, callback) {

        try {

            // Retrieve and set tags, skipping strItemType and any tag that matches the email-address-testing regexp.

            var eReg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

            /* ' */

            var strQuery = "select t.description from " + self.dbname + "tags t where id in (select tagId from " + self.dbname + strItemType + "_tags where " + strItemType + "Id = " + thingId + ");";
            var exceptionRet = sql.execute(strQuery,
                function(rows){

                    try {

                        // Concatenate tags while at the same time skipping strItemType and e-mail-like tags.
                        var tags = "";
                        if (rows.length > 0) {

                            rows.forEach(function(row) {

                                if (row.description !== strItemType) {

                                    if (!row.description.match(eReg)) {

                                        tags += row.description + ' ';
                                    }
                                }
                            });
                        }

                        return callback(null, tags);

                    } catch(ee) {

                        return callback(ee, '');
                    }
                },
                function(strError){

                    return callback(new Error(strError), '');
                }
            );
            if (exceptionRet){

                return callback(exceptionRet, '');
            }
        } catch(e) {

            return callback(e, '');
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //              SaveProject & SaveProjectAs entry point
    //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    self.routeSaveProject = function (req, res) {

        try {

            m_log("Entered ProjectBO/routeSaveProject with req.body=" + JSON.stringify(req.body));
            // req.user.userId
            // req.user.userName
            // req.body.projectJson
            // req.body.changeableName - if true, in case of a name conflict within the user's projects, keep appending until a unique name is found and do a saveAs, not a save.

            // All image resources have already been created or selected for the project, its types and their methods. (Or default images are still being used.)
            // So nothing to do resource-wise.

            m_log("***In routeSaveProject***");
            var project = req.body.projectJson;

            // All projects now have a specialProjectData property. From both normal and privileged users.

            // If a privileged user is saving a Purchasable Project (whether new or opened for editing), 
            // then specialProjectData itself will have one of these 3 properties: classData, onlineClassData or productData.
            // These three properties contain the info that has to be saved to classes, onlineclasses or products, respectively.

            // A privileged user can also edit and save a core project, keeping it a core project with id=1-5. In this case project.isCoreProject and
            // project.specialProjectData.coreProject will both be true. Take your pick.

            // project.specialProjectData.openMode === 'new' for new projects and === 'searched' for projects opened with OpenProjectDialog.
            // 'new' projects are always INSERTed into the database.
            // 'searched' projects may be INSERTed or UPDATEd. More on this below in m_functionDetermineTypeOfSave.

            // A purchasable project that has just been bought by a normal user came in as a 'new' with specialProjectData containing
            // one of the product subproperties so that we could display BuyDialog to the user. We will recognize that this project has to be INSERTed as new because 
            // its project.specialProjectData.openMode will have been changed to 'bought' by ??? (on the client side).

            // Saving data to table products, classes or onlineclasses if this is a Purchasable Project (as opposed to an edited core project).

            // Updating without changing project id or comic id.

            /////////////////////////////////////////////////////////////////////////////////////////////////
            //
            // Remember: always have a try/catch block inside an async callback, and it cannot throw further, because
            // the external context may no longer exists. That's what each function's callback parameter is for.
            //
            /////////////////////////////////////////////////////////////////////////////////////////////////

            m_log("Getting a connection to MySql");
            sql.getCxnFromPool(
                function(err, connection) {
                    try {
                        if (err) { 

                            // Cannot finish in m_functionFinalCallback until we have a connection and is has begun.
                            return res.json({
                                success: false,
                                message: 'Could not get a database connection: ' + err.message
                            });
                        } else {

                            m_log('Have a connection. Beginning a transaction.');
                            connection.beginTransaction(
                                function(err) {

                                    try {
                                        if (err) {

                                            return res.json({
                                                success: false,
                                                message: 'Could not "begin" database transaction: ' + err.message
                                            });
                                        } else {

                                            m_log('Connection has a transaction');

                                            m_functionDetermineTypeOfSave(connection, req, res,
                                                function(err, typeOfSave) {

                                                    if (err) {
                                                        m_functionFinalCallback(new Error("Could not save project due to error: " + err.message), req, res, connection, null);
                                                    
                                                    } else {
                                                        if (typeOfSave === 'save') {

                                                            m_log('Going into m_functionSaveProject');
                                                            m_functionSaveProject(connection, req, res, project, 
                                                                function(err) {
                                                                    m_functionFinalCallback(err, req, res, connection, project);
                                                                }
                                                            );
                                                        } else if (typeOfSave === 'saveWithSameId') {

                                                            m_log('Going into m_functionSaveProjectWithSameId');
                                                            m_functionSaveProjectWithSameId(connection, req, res, project, 
                                                                function(err) {
                                                                    m_functionFinalCallback(err, req, res, connection, project);
                                                                }
                                                            );
                                                        } else {    // 'saveAs'

                                                            m_log('Going into m_functionSaveProjectAs');
                                                            m_functionSaveProjectAs(connection, req, res, project, 
                                                                function(err) {
                                                                    m_functionFinalCallback(err, req, res, connection, project);
                                                                }
                                                            );
                                                        }
                                                    }
                                                }
                                            );
                                        }
                                    } catch(e1) { 
                                        return res.json({
                                            success: false,
                                            message: 'Could not "begin" database transaction: ' + e1.message
                                        });
                                    }
                                }
                            );
                        }
                    } catch (e2) { 
                        return res.json({
                            success: false,
                            message: 'Could not get a database connection: ' + e2.message
                        });
                    }
                }
            );
        } catch(e) { 
            return res.json({
                success: false,
                message: 'Could not save project due to error: ' + e.message
            });
        }
    }

    var m_functionDetermineTypeOfSave = function(connection, req, res, callback) {

        try {

            m_log("***In m_functionDetermineTypeOfSave***");
            // return with callback(err, typeOfSave);
            // typeOfSave:
            //  'saveAs' INSERTs new rows for everything.
            //  'save' DELETES (cascading the project from the database) and then calls SaveAs to insert it.
            //  'saveWithSameId' UPDATEs.
            //  'loaded' a privileged user has loaded the project from a saved JSON file.

            // The project's name must be unique to the user's projects, but can be the same as another user's project name.
            // This doesn't have to be checked for a typeOfSave === 'save', but it will be checked for 'new' or 'save as' saves.
            // What would normally result in a 'save' will be changed to a 'saveAs' if it's a new project or the user is saving a project gotten from another user.
            // What would normally result in a 'saveAs' will be changed to a 'save' if the name and id are the same as one of the user's existing projects.
            // Also, if req.body.changeableName is true, then a name conflict will be resolved (without user intervention) by appending an incremented integer until there is no conflict
            // within the user's projects and a 'SaveAs' can be done. This will only happen on a project with project.specialProjectData.openMode === "bought".

            // A privileged user can also edit and save a core project with the same id. In this case project.isCoreProject And
            // project.specialProjectData.coreProject will both be true. Take your pick regarding which to check.

            // project.specialProjectData.openMode === 'new' for new projects and 'searched' for projects opened with OpenProjectDialog.
            // 'new' projects are always INSERTed into the database.
            // 'searched' projects may be INSERTed or UPDATEd. More on this below.

            // A purchasable project that has just been bought by a normal user came in as a 'new' with specialProjectData containing
            // one of the product subproperties so that we could display BuyDialog to the user. We will recognize that this project has to be INSERTed as new because 
            // its project.specialProjectData.openMode will have been changed to 'bought'.


// TODO: handle 'loaded' or is it the same as any other project.specialProjectData.openMode? 
// Maybe I shouldn't have set it to 'loaded', thus overriding what was in there from when the JSON was created.

            async.waterfall(
                [
                    // Simple settings to get started
                    function(cb) {

                        var project = req.body.projectJson;
                        return cb(null, 
                            {
                                project: project,
                                newProj: (project.specialProjectData.openMode === "new" || project.specialProjectData.openMode === "bought"), 
                                notMine: project.specialProjectData.othersProjects,
                                editingCoreProject: (project.specialProjectData.userAllowedToCreateEditPurchProjs && project.specialProjectData.coreProject)
                            }
                        );
                    },
                    // Getting id of any of user's projects with same name as in project. See note on req.body.changeableName above.
                    function(resultArray, cb) {

                        if (req.body.changeableName) {

                            // Use UDF getUniqueProjNameForUser to make sure result.project.name or its derivative is unique for req.user.userId.
                            var strQuery = "select " + self.dbname + "getUniqueProjNameForUser(" + connection.escape(resultArray.project.name) + "," + req.user.userId + ") as uniqueName;";
                            sql.queryWithCxn(connection, strQuery,
                                function(err, rows) {
                                    
                                    if (err) { return cb(err, null); }

                                    if (rows.length !== 1) { return cb(new Error("Error checking/getting unique name for purchase."), null); }

                                    resultArray.project.name = rows[0].uniqueName;
                                    resultArray["idOfUsersProjWithThisName"] = -1;
                                    return cb(null, resultArray);
                                }
                            );
                        } else {

                            var strQuery = "select id from " + self.dbname + "projects where name=" + connection.escape(resultArray.project.name) + " and ownedByUserId=" + req.user.userId + ";";
                            sql.queryWithCxn(connection, strQuery,
                                function(err, rows) {
                                    
                                    if (err) { return cb(err, null); } 
                                    
                                    if (rows.length === 1) {

                                        resultArray["idOfUsersProjWithThisName"] = rows[0].id;

                                    } else {

                                        resultArray["idOfUsersProjWithThisName"] = -1;
                                    }

                                    return cb(null, resultArray);
                                }
                            );
                        }
                    },
                    // Getting name of any of user's projects with this project's id.
                    function(resultArray, cb) {

                        var strQuery = "select name from " + self.dbname + "projects where id=" + resultArray.project.id + " and ownedByUserId=" + req.user.userId + ";";
                        sql.queryWithCxn(connection, strQuery,
                            function(err, rows) {

                                if (err) { return cb(err, null); }
                                
                                var nameOfUsersProjWithThisId = null;   // null if none exists 
                                if (rows.length === 1) {
                                    nameOfUsersProjWithThisId = rows[0].name;
                                }
                                resultArray["nameOfUsersProjWithThisId"] = nameOfUsersProjWithThisId;
                                return cb(null, resultArray);
                            }
                        );
                    },
                    // Finding out if this is a privileged user editing a Purchasable Project and anyone has already purchased it.
                    // We'll do this by looking for any projects other than resultArray.project that have the same comicID in
                    // projects_comics_libraries as resultArray.project.comics[0].id.
                    function(resultArray, cb) {

                        if (resultArray.project.specialProjectData.userAllowedToCreateEditPurchProjs && resultArray.project.specialProjectData.openMode === 'searched') {

                            var strQuery = "select count(*) as cnt from " + self.dbname + "projects_comics_libraries where comicId=" + resultArray.project.comic[0].id + " and projectId<>" + resultArray.project.id + ";";
                            sql.queryWithCxn(connection, strQuery,
                                function(err, rows) {
                                    if (err) { return cb(err, null); }
                                    resultArray["savingPurchasableProjectThatsBeenBought"] = (rows[0]['cnt'] > 1);
                                    return cb(null, resultArray);
                                }
                            );
                        } else { return cb(null, resultArray); }
                    }
                ],
                // The waterfall falls through to here.
                // new properties in resultArray: editingCoreProject, savingPurchasableProjectThatsBeenBought
                function(err, resultArray) {

                    if (err) { 
                        m_log("Came into end of waterfall with err non-null."); 
                        return callback(err); 
                    }

                    var typeOfSave = null;

                    if ((resultArray.editingCoreProject || resultArray.savingPurchasableProjectThatsBeenBought) && resultArray.project.id > 0) {

                        typeOfSave = "saveWithSameId";
                    
                    } else {

                        // New project or saving someone else's project must have a unique name for current user.
                        if (resultArray.newProj || resultArray.notMine ) {
                            
                            if (resultArray.idOfUsersProjWithThisName > -1) {

                                return callback(new Error("You already have a project with this name."));

                            } else {

                                typeOfSave = "saveAs";

                            }
                        } else {

                            // If saving project with same id as another of user's projects with same name, then save.
                            if (resultArray.idOfUsersProjWithThisName === resultArray.project.id) {

                                typeOfSave = "save";
                            }
                        }

                        if (!typeOfSave) {  // no decision yet

                            // If saving project with same id and name then save; else saveAs.
                            if (resultArray.nameOfUsersProjWithThisId === resultArray.project.name) {

                                typeOfSave = "save";

                            } else {

                                typeOfSave = "saveAs";
                            }
                        }
                    }

                    return callback(null, typeOfSave);
                }
            );
        } catch (e) { callback(e); }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////
    //
    //                      Save processing
    //
    // Saving consists of deleting the old project then then re-inserting it
    // using saveAs processing. It WILL change the project's id along with ids of every part of the project.
    //
    // When saving a project with same id as another of user's project with same name, we'll save.
    //
    ///////////////////////////////////////////////////////////////////////////////////////////

    var m_functionSaveProject = function (connection, req, res, project, callback) {

        m_log("***In m_functionSaveProject***");
        try {
            // async.series runs each of an array of functions in order, waiting for each to finish in turn.
            // (1) Delete the old project.
            // (2) Call m_functionSaveProjectAs to insert the new project.
            async.series(
                [
                    // (1)
                    function(cb) {
                        // The following will delete the former project completely from the database.
                        var strQuery = "delete from " + self.dbname + "comics where id in (select comicId from projects_comics_libraries where projectId=" + project.id + "); ";
                        strQuery += "delete from " + self.dbname + "types where libraryId in (select pcl.libraryId from " + self.dbname + "projects_comics_libraries pcl inner join " + self.dbname + "libraries l on l.id=pcl.libraryId where isSystemLibrary=0 and isBaseLibrary=0 and projectId=" + project.id + "); ";
                        strQuery += "delete from " + self.dbname + "libraries where isSystemLibrary=0 and isBaseLibrary=0 and id in (select libraryId from " + self.dbname + "projects_comics_libraries where projectId=" + project.id + "); ";
                        strQuery += "delete from " + self.dbname + "projects where id=" + project.id + "; ";
                        m_log('Doing save project step 1: deleting old version with ' + strQuery);
                        
                        // Note: sql.queryWithCxn returns err in its callback as a string, not an exception.
                        sql.queryWithCxn(connection, 
                            strQuery, 
                            function(err, rows) {   
                                // rows is ignored for deletion. err will be null if delete worked. That will cause part (2) to run.
                                return cb(err);
                            }
                        );
                    },
                    // (2)
                    function(cb) {
                        // Now we can just INSERT the project as passed from the client side.
                        m_log("Going off to m_functionSaveProjectAs");
                        m_functionSaveProjectAs(connection, req, res, project, 
                            function(err) { 
                                return cb(err); 
                            }
                        );
                    }
                ],
                // final callback for series
                function(err){ return callback(err); }
            );
        } catch (e) { callback(e); }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    //
    //                      SaveAs processing
    //
    // SaveAs processing INSERTs everything for the project.
    //
    // New project or saving someone else's project which must have a unique name for current user.
    // A fallthrough case: If saving project with different id or name then saveAs.
    //
    ///////////////////////////////////////////////////////////////////////////////////////////

    var m_functionSaveProjectAs = function (connection, req, res, project, callback) {

        try {

            m_log('***Continuing in m_functionSaveProjectAs***');

            // We'll use async.series serially to (1) insert project and 
            // (2) use async.parallel to
            //  (2a) write the project's tags and
            //  (2b) call off to do all of the project's comics
            //  (2c) if applicable, write to classes, products or onlineclasses
            async.series(
                [
                    // (1)
                    function(cb) {

                        var guts = {
                            name: project.name,
                            ownedByUserId: req.user.userId,
                            public: project.public,
                            quarantined: project.quarantined,
                            description: project.description,
                            imageId: project.imageId,
                            altImagePath: project.altImagePath,
                            parentProjectId: project.parentProjectId,
                            parentPrice: project.parentPrice,
                            priceBump: project.priceBump,
                            projectTypeId: project.projectTypeId,
                            isCoreProject: (project.isCoreProject ? 1 : 0),
                            isProduct: (project.isProduct || project.specialProjectData.productProject ? 1 : 0),
                            isClass: (project.isClass || project.specialProjectData.classProject ? 1 : 0),
                            isOnlineClass: (project.isOnlineClass || project.specialProjectData.onlineClassProject ? 1 : 0),
                            lastSaved: (new Date()),
                            chargeId: project.chargeId,
                            currentComicIndex: project.currentComicIndex
                        };

                        if (project.specialProjectData.openMode === "searched") {
                            
                            // Make sure firstSaved isn't changed for this case.
                            // If we don't do this, then firstSaved won't be passed to MySql and firstSaved will be set = CURRENT_TIMESTAMP (now).
                            guts.firstSaved = moment(project.firstSaved).format("YYYY-MM-DD HH:mm:ss");
                        }

                        var exceptionRet = m_checkGutsForUndefined('project', guts);
                        if (exceptionRet) {
                            return cb(exceptionRet);
                        }

                        var strQuery = "INSERT " + self.dbname + "projects SET ?";
                        m_log('Inserting project record with ' + strQuery + '; fields: ' + JSON.stringify(guts));
                        sql.queryWithCxnWithPlaceholders(connection, strQuery, guts,
                            function(err, rows) {
                                if (err) { return cb(err); }
                                if (rows.length === 0) { return cb(new Error('Error saving project to database.')); }

                                project.id = rows[0].insertId;

//  TOXXX MUST CHANGE comicProjectId no longer exists.
                                // Check if necessary to and then, if so, update project.comicProjectId
                                if (project.comicProjectId === 0) {

                                    project.comicProjectId = project.id;
                                    sql.queryWithCxn(connection, "UPDATE " + self.dbname + "projects SET comicProjectId=" + project.id + " WHERE id=" + project.id + ";",
                                        function(err, rows) {
                                            return cb(err);
                                        }
                                    );
                                } else {
                                    return cb(null);
                                }
                            }
                        );
                    },
                    // (2)
                    function(cb) {

                        // Use async.parallel to save the project's tags, possible purchasable project info and its comics in parallel.
                        async.parallel(
                            [
                                // (2a)
                                function(cb) {
                                    m_log("Going to write project tags");
                                    m_setUpAndWriteTags(connection, res, project.id, 'project', req.user.userName, project.tags, project.name, 
                                        function(err) {
                                            return cb(err);
                                        }
                                    );
                                },
                                // (2b)
                                function(cb) {
                                    m_log("Calling m_saveComicsToDB");
                                    m_saveComicsToDB(connection, req, res, project,
                                        function(err) {
                                            return cb(err);
                                        }
                                    );
                                },
                                // (2c)
                                function(cb) {
                                    if (project.specialProjectData.userAllowedToCreateEditPurchProjs && (project.specialProjectData.openMode === 'new' || project.specialProjectData.openMode === 'searched')) {
                                        m_log("Calling m_savePurchProductData");
                                        m_savePurchProductData(connection, req, res, project,
                                            function(err) {
                                                return cb(err);
                                            }
                                        );
                                    } else { return cb(null); }
                                }
                            ],
                            // final callback for (2)
                            function(err) { return cb(err); }
                        );
                    }
                ],
                // final callback for (1)
                function(err) {
                    return callback(err);
                }
            );
        } catch(e) { callback(e); }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////
    //
    //                      SaveWithSameId processing
    //
    // SaveWithSameId retains the project id by UPDATEing but deletes from comics and types on down and
    // INSERTs them.
    //
    // This method was chosen because resultArray.editingCoreProject || resultArray.savingPurchasableProjectThatsBeenBought.
    // Both are possible only with a privileged user. The first means that one of the core projects has been edited and is being saved.
    // The second means that a Purchasable Project that has already been purchased by a user has been edited and is being saved.
    // This special path must keep the same project.id, but can delete and re-insert everything else.
    //
    ///////////////////////////////////////////////////////////////////////////////////////////

    var m_functionSaveProjectWithSameId = function (connection, req, res, project, callback) {

        try {

            m_log('***Continuing in m_functionSaveProjectWithSameId***');

            // We'll use async.series serially to (1) update project;
            // (2) Delete everything related to it using a combination of async.parallel and cascading deletes;
            //     (a) We can do this by deleting comics pointing to project--this will delete comiccode, types and below.
            //     (b) We also have to delete from classes, products and onlineclasses where they point to project.
            //         And, since we're UPDATEing the project and therefore we're not cascading delete from project_tags, we'll manually delete them, too.
            // (3) use async.parallel to
            //     (a) write the project's tags and
            //     (b) call off to do all of the project's comics
            //     (c) potentially write to classes, products, onlineclasses
            async.series(
                [
                    // (1)
                    function(cb) {

                        var guts = {
                            name: project.name,
                            ownedByUserId: req.user.userId,
                            public: project.public,
                            quarantined: project.quarantined,
                            description: project.description,
                            imageId: project.imageId,
                            altImagePath: project.altImagePath,
                            parentProjectId: project.parentProjectId,
                            parentPrice: project.parentPrice,
                            priceBump: project.priceBump,
                            projectTypeId: project.projectTypeId,
                            isCoreProject: (project.isCoreProject ? 1 : 0),
                            isProduct: (project.isProduct || project.specialProjectData.productProject ? 1 : 0),
                            isClass: (project.isClass || project.specialProjectData.classProject ? 1 : 0),
                            isOnlineClass: (project.isOnlineClass || project.specialProjectData.onlineClassProject ? 1 : 0),
                            firstSaved: moment(project.firstSaved).format("YYYY-MM-DD HH:mm:ss"),
                            lastSaved: (new Date()),
                            chargeId: project.chargeId,
                            currentComicIndex: project.currentComicIndex
                        };

                        var exceptionRet = m_checkGutsForUndefined('project', guts);
                        if (exceptionRet) {
                            return cb(exceptionRet);
                        }

                        var strQuery = "UPDATE " + self.dbname + "projects SET ? where id=" + project.id;
                        m_log('Updating project record with id ' + project.id + ' with query ' + strQuery + '; fields: ' + JSON.stringify(guts));
                        sql.queryWithCxnWithPlaceholders(connection, strQuery, guts,
                            function(err, rows) {
                                if (err) { return cb(err); }
                                return cb(null);
                            }
                        );
                    },
                    // (2)
                    function(cb) {
// TOXXX HERE DOWN HAS TO CHANGE
                        async.parallel(
                            [
                                // (2a)
                                function(cb) {
                                    sql.queryWithCxn(connection, "delete from " + self.dbname + "comics where projectId=" + project.id + ";",
                                        function(err, rows) {
                                            return cb(err); // null or not
                                        }
                                    );
                                },
                                // (2b)
                                function(cb) {
                                    sql.queryWithCxn(connection, "delete from " + self.dbname + "classes where baseProjectId=" + project.id + ";" + "delete from " + self.dbname + "products where baseProjectId=" + project.id + ";" + "delete from " + self.dbname + "onlineclasses where baseProjectId=" + project.id + ";" + "delete from " + self.dbname + "project_tags where projectId=" + project.id + ";",
                                        function(err, rows) {
                                            return cb(err); // null or not
                                        }
                                    );
                                }
                            ],
                            function(err) { return cb(err); }
                        );
                    },
                    // (3)
                    function(cb) {

                        // Use async.parallel to save the project's tags and start doing its comics in parallel.
                        async.parallel(
                            [
                                // (3a)
                                function(cb) {
                                    m_log("Going to write project tags");
                                    m_setUpAndWriteTags(connection, res, project.id, 'project', req.user.userName, project.tags, project.name, 
                                        function(err) {
                                            return cb(err);
                                        }
                                    );
                                },
                                // (3b)
                                function(cb) {
                                    m_log("Calling m_saveComicsToDB");
                                    m_saveComicsToDB(connection, req, res, project,
                                        function(err) {
                                            return cb(err);
                                        }
                                    );
                                },
                                // (3c)
                                function(cb) {
                                    if (project.specialProjectData.userAllowedToCreateEditPurchProjs && (project.specialProjectData.openMode === 'new' || project.specialProjectData.openMode === 'searched')) {

                                        m_log("Calling m_savePurchProductData");
                                        m_savePurchProductData(connection, req, res, project,
                                            function(err) {
                                                return cb(err);
                                            }
                                        );
                                    } else { return cb(null); }
                                }
                            ],
                            // final callback for async.parallel
                            function(err) { return cb(err); }
                        );
                    }
                ],
                // final callback for async.series
                function(err) {
                    return callback(err);
                }
            );
        } catch(e) { callback(e); }
    }

    var m_savePurchProductData = function(connection, req, res, project, callback) {

        try {
            
            var guts = '';
            var dbname = '';

            // There may be nothing to do here. Check these conditions carefully to understand.
            if (project.specialProjectData.userAllowedToCreateEditPurchProjs 
                && (project.specialProjectData.openMode === 'new' || project.specialProjectData.openMode === 'searched')) {

                if (project.specialProjectData.classProject && project.specialProjectData.hasOwnProperty('classData')) {

                    guts = {
                        active: (project.specialProjectData.classData.active ? 1 : 0),
                        classDescription: project.specialProjectData.classData.classDescription,
                        instructorFirstName: project.specialProjectData.classData.instructorFirstName,
                        instructorLastName: project.specialProjectData.classData.instructorLastName,
                        instructorPhone: project.specialProjectData.classData.instructorPhone,
                        facility: project.specialProjectData.classData.facility,
                        address: project.specialProjectData.classData.address,
                        room: project.specialProjectData.classData.room,
                        city: project.specialProjectData.classData.city,
                        state: project.specialProjectData.classData.state,
                        zip: project.specialProjectData.classData.zip,
                        schedule: JSON.stringify(project.specialProjectData.classData.schedule),
                        level: project.specialProjectData.classData.level,
                        difficulty: project.specialProjectData.classData.difficulty,
                        price: project.specialProjectData.classData.price,
                        imageId: (project.specialProjectData.classData.imageId || 0),           // not set on client side yet
                        classNotes: project.specialProjectData.classData.classNotes,
                        name: project.name,
                        baseProjectId: project.id,
                        maxClassSize: (project.specialProjectData.classData.maxClassSize || 0),  // not set on client side yet
                        loanComputersAvailable: (project.specialProjectData.classData.loadComputersAvailable || 0)  // not set on client side yet
                        };
                    dbname = 'classes';

                } else if (project.specialProjectData.productProject && project.specialProjectData.hasOwnProperty('productData')) {

                    guts = {
                        active: (project.specialProjectData.productData.active ? 1 : 0),
                        productDescription: project.specialProjectData.productData.productDescription,
                        level: project.specialProjectData.productData.level,
                        difficulty: project.specialProjectData.productData.difficulty,
                        price: project.specialProjectData.productData.price,
                        imageId: (project.specialProjectData.productData.imageId || 0),           // not set on client side yet
                        videoURL: (project.specialProjectData.productData.videoURL || ''),           // not set on client side yet
                        name: project.name,
                        baseProjectId: project.id
                        };
                    dbname = 'products';

                } if (project.specialProjectData.onlineClassProject && project.specialProjectData.hasOwnProperty('onlineClassData')) {

                    guts = {
                        active: (project.specialProjectData.onlineClassData.active ? 1 : 0),
                        classDescription: project.specialProjectData.onlineClassData.classDescription,
                        instructorFirstName: project.specialProjectData.onlineClassData.instructorFirstName,
                        instructorLastName: project.specialProjectData.onlineClassData.instructorLastName,
                        instructorEmail: project.specialProjectData.onlineClassData.instructorEmail,
                        schedule: JSON.stringify(project.specialProjectData.onlineClassData.schedule),
                        level: project.specialProjectData.onlineClassData.level,
                        difficulty: project.specialProjectData.onlineClassData.difficulty,
                        price: project.specialProjectData.onlineClassData.price,
                        classNotes: project.specialProjectData.onlineClassData.classNotes,
                        imageId: (project.specialProjectData.onlineClassData.imageId || 0),           // not set on client side yet
                        name: project.name,
                        baseProjectId: project.id
                        };
                    dbname = 'onlineclasses';
                }

                if (dbname.length > 0) {

                    var exceptionRet = m_checkGutsForUndefined(dbname, guts);
                    if (exceptionRet) {
                        return cb(exceptionRet);
                    }

                    var strQuery = "INSERT " + self.dbname + dbname + " SET ?";
                    m_log('Inserting purchasable project with ' + strQuery + '; fields: ' + JSON.stringify(guts));
                    sql.queryWithCxnWithPlaceholders(connection, strQuery, guts,
                        function(err, rows) {
                            if (err) { return callback(err); }

                            var id = rows[0].insertId;
                            if (dbname === 'classes') {

                                project.specialProjectData.classData.id = id;

                            } else if (dbname === 'products') {

                                project.specialProjectData.productData.id = id;

                            } else {

                                project.specialProjectData.onlineClassData.id = id;
                            }
                            return callback(null);
                        }
                    );
                } else { 
                    return callback(null); 
                }
            } else { 
                return callback(null); 
            }
        } catch(e) { 
            callback(e); 
        }
    }

    var m_saveComicsToDB = function (connection, req, res, project, callback) {

        // Now the project has been inserted or updated in the DB and its id is in project.id.
        // A row has been added to resource and tags have been handled for the project, too.

        // This routine will iterate through the project's comics, possibly saving (inserting) each, possibly saving its libraries, but always saving the libraries' types, etc.
        // We use the word 'possibly', because comics and libraries themselves are saved only when a privileged user is working on a purchasable product or a core project.
        // Otherwise, only the comics' libraries' types and lower are saved.
        try {

            m_log("Just got into m_saveComicsToDB with this many comics to do: " + project.comics.length);

            // async.eachSeries iterates over a collection, perform a single async task at a time.
            // Actually, we could process all comics in parallel. Maybe we'll change to that in the future. Or maybe it really makes no diff.
            async.eachSeries(project.comics, 
                function(comicIth, cb) {

                    // comic no longer has a projectId. All links are handled by the 3-way junction table projects_comics_libraries.

                    // Use async.series with 2 functions: (1) for writting comics to the database; (2) for handling comic internals.
                    async.series([
                        // (1)
                        function(cb) {

                            // comics themselves are saved only for core projects and purchasable projects.
                            if (project.specialProjectData.userAllowedToCreateEditPurchProjs && (project.specialProjectData.coreProject || project.specialProjectData.productProject || project.specialProjectData.classProject || project.specialProjectData.onlineClassProject)) {
                                
                                var guts = {
                                    ordinal: comicIth.ordinal,
                                    thumbnail: comicIth.thumbnail,
                                    name: comicIth.name
                                };
                                var strQuery = "insert " + self.dbname + "comics SET ?";

                                m_log("Writing comicIth with " + strQuery + '; fields: ' + JSON.stringify(guts));
                                // Turn these into a series?
                                sql.queryWithCxnWithPlaceholders(connection,
                                    strQuery,
                                    guts,
                                    function(err, rows) {
                                        try {
                                            if (err) { return cb(err); }
                                            if (rows.length === 0) { return cb(new Error("Error writing comic to database.")); }
                                            
                                            comicIth.id = rows[0].insertId;

                                            // Do content of comic: comiccode, libraries (and all their content) and the 3 junction tables for literals, expressions and statements in parallel.

                                            async.parallel(
                                                [
                                                    function(cb){

                                                        m_log("Going to m_saveComiccodeInComicIthToDB");
                                                        m_saveComiccodeInComicIthToDB(connection, req, res, project, comicIth, 
                                                            function(err) {
                                                                return cb(err); 
                                                            }
                                                        );
                                                    },
                                                    function(cb){

                                                        m_log("Going to m_saveComics_XInComicIthToDB for statements");
                                                        m_saveComics_XInComicIthToDB(connection, req, res, project, comicIth,
                                                            'statements',
                                                            function(err) {
                                                                return cb(err); 
                                                            }
                                                        );
                                                    },
                                                    function(cb){

                                                        m_log("Going to m_saveComics_XInComicIthToDB for expressions");
                                                        m_saveComics_XInComicIthToDB(connection, req, res, project, comicIth,
                                                            'expressions',
                                                            function(err) {
                                                                return cb(err); 
                                                            }
                                                        );
                                                    },
                                                    function(cb){

                                                        m_log("Going to m_saveComics_XInComicIthToDB for literals");
                                                        m_saveComics_XInComicIthToDB(connection, req, res, project, comicIth,
                                                            'literals',
                                                            function(err) {
                                                                return cb(err); 
                                                            }
                                                        );
                                                    }
                                                ],
                                                function(err) {
                                                    return cb(err);
                                                }
                                            );
                                        } catch (eq) {
                                            return cb(eq);
                                        }
                                    }
                                );
                            } else {
                                return cb(null);
                            }
                        },
                        // (2)
                        function(cb) {

                            m_log("Going to m_saveLibrariesInComicIthToDB");
                            m_saveLibrariesInComicIthToDB(connection, req, res, project, comicIth, 
                                function(err) {
                                    return cb(err); 
                                }
                            );
                        }
                    ],
                    // final callback for async.series
                    function(err) {
                        return cb(err);
                    });

                },
                // final callback for async.seriesEach
                function(err) {
                    return callback(err);
                }
            );
        } catch (e) { callback(e); }
    }

    // The 'X' in the name of this function means 'expressions', 'literals' or 'statements'.
    // The function saves all three via three junction tables whose names it constructs.
    var m_saveComics_XInComicIthToDB = function (connection, req, res, project, comicIth, which, callback) {

        try {

            m_log("***In m_saveComics_XInComicIthToDB for " + which + "***");

            var items = [];

            async.series(
                [
                    // Fill items array.
                    function(cb) {

                        var strQuery = "select * from " + self.dbname + which + ";";
                        sql.queryWithCxn(connection,
                            strQuery,
                            function(err, rows) {
                                if (err) {
                                    return cb(err);
                                }
                                items = rows;
                                return cb(null);
                            }
                        );
                    },
                    // Save to comics_statements, using items array to look up statementId.
                    function(cb) {

                        async.eachSeries(comicIth[which],
                            function(lIth, cb) {

                                var lIthId = 0;
                                for (var i = 0; i < items.length; i++) {
                                    if (lIth === items[i].name) {
                                        lIthId = items[i].id;
                                        break;
                                    }
                                }

                                if (lIthId > 0) {

                                    var guts = {
                                        comicId: comicIth.id
                                    };
                                    if (which === 'statements') {
                                        guts.statementId = lIthId
                                    } else if (which === 'expressions') {
                                        guts.expressionId = lIthId
                                    } else {
                                        guts.literalId = lIthId;
                                    }

                                    var strQuery = "INSERT " + self.dbname + "comics_" + which + " SET ?";
                                    sql.queryWithCxnWithPlaceholders(connection,
                                        strQuery,
                                        guts,
                                        function(err, rows) {
                                            return cb(err);
                                        }
                                    );
                                } else {

                                    return cb(null);
                                }
                            },
                            // final callback
                            function(err) { return cb(err); }
                        );
                    }
                ],
                //final callback of async.series
                function(err) {
                    return callback(err);
                }
            );
        } catch(e) { callback(e); }
    }
            
    var m_saveComiccodeInComicIthToDB = function (connection, req, res, project, comicIth, callback) {

        try {

            m_log("***In m_saveComiccodeInComicIthToDB***");
            // async.eachSeries iterates over a collection, perform a single async task at a time.
            // Actually, we could process all types in parallel, but we'd have to pre-assign their ordinals.
            // Maybe we'll change to that in the future.

            var ord = 1;

            async.eachSeries(comicIth.comiccode, 
                function(ccIth, cb) {

                    ccIth.comicId = comicIth.id;
                    ccIth.ordinal = ord++;
                    var guts = {
                        comicId: ccIth.comicId,
                        ordinal: ccIth.ordinal,
                        description: ccIth.description,
                        JSONsteps: JSON.stringify(ccIth.JSONsteps)
                    };

                    var strQuery = "INSERT " + self.dbname + "comiccode SET ?";
                    sql.queryWithCxnWithPlaceholders(connection,
                        strQuery,
                        guts,
                        function(err, rows) {

                            if (err) {return cb(err); }
                            if (rows.length === 0) { return cb(new Error("Error adding comiccode to DB")); }
                            ccIth.id = rows[0].insertId;
                            return cb(null);
                        }
                    );
                }, 
                // final callback
                function(err) { return callback(err); }
            );
        } catch(e) { callback(e); }
    }


    var m_saveLibrariesInComicIthToDB = function (connection, req, res, project, comicIth, callback) {

        try {

            m_log("***In m_saveLibrariesInComicIthToDB***");

            async.eachSeries(
                comicIth.libraries,
                function(libraryIth, cb) {

                    // The are lots of options for the set of libraries in a comic:
                    // (1) A library can be a system or a base type library and the saving user may be a normal user. 
                    //     These libraries are not written (since they couldn't have been modified and cannot be new), but they do have to be
                    //     joined to the project and comic in projects_comics_libraries.
                    // (2) A library can be an app type library. This is inserted in full into the database and an entry is made in projects_comics_libraries.
                    // (3) A library can be a "normal" (i.e., not system, not base and not app--but very similar to app) library. This is handled just like in case (2).
                    // (4) For a user with permission 'can_edit_base_and_system_libraries_and_types_therein' saving a not-normal project (i.e., a core project or a product),
                    //     we will update pre-existing libraries and insert new ones.

                    // Still, the decision of whether to insert or update is not at all straightforward.
                    // (1) If libraryIth.id === 0, then, of course, we insert.
                    // (2) However, existing libraries (id > 0) may be
                    //      (a) skipped over: normal user and base library or system library;
                    //      (b) updated: libraryIth.id > 0;
                    // 
                    var whatToDo = '';

                    if (!project.specialProjectData.userCanWorkWithSystemLibsAndTypes && (libraryIth.isBaseLibrary || libraryIth.isSystemLibrary)) {

                        whatToDo = "skipLibButDoJuncTbl";

                    } else if (libraryIth.id) {

                        whatToDo = "updateLibAndDoTypesAndJuncTbl";

                    } else if (!libraryIth.id) {

                        whatToDo = "insertLibAndDoTypesAndJuncTbl";
                    }

                    var guts = {
                        name: libraryIth.name,
                        createdByUserId: req.user.userId,
                        isSystemLibrary: (libraryIth.isSystemLibrary ? 1 : 0),
                        isBaseLibrary: (libraryIth.isBaseLibrary ? 1 : 0),
                        isAppLibrary: (libraryIth.isAppLibrary ? 1 : 0),
                        imageId: 0,
                        altImagePath: '',
                        description: ''
                    };

                    var exceptionRet = m_checkGutsForUndefined('Library', guts);
                    if (exceptionRet) { return cb(exceptionRet); }

                    var strQuery;
                    var weInserted;
                    if (libraryIth.id) {

                        // Assuming for now that library wasn't deleted by cascading delete of the project.
                        strQuery = "update " + self.dbname + "libraries SET ? where id=" + libraryIth.id + ";";
                        strQuery += "delete from " + self.dbname + "library_tags where libraryId=" + libraryIth.id + ";";
                        strQuery += "delete from " + self.dbname + "types where libraryId=" + libraryIth.id + ";";  // This should delete from type_tags, methods, method_tags, propertys, events, too.

                        weInserted = false;

                    } else {

                        strQuery = "insert " + self.dbname + "libraries SET ?";
                        weInserted = true;
                    }

                    sql.queryWithCxnWithPlaceholders(connection, strQuery, guts,
                        function(err, rows) {

                            if (err) { return cb(err); }
                            if (rows.length === 0) { return cb(new Error("Error writing library to the database.")); }

                            if (weInserted) {

                                libraryIth.id = rows[0].insertId;
                            }

                            // Now do library_tags and the types within the library. Finally, return cb(null);
                            async.parallel(
                                [
                                    function(cb) {
                                        m_log("Going to write library tags");
                                        m_setUpAndWriteTags(connection, res, libraryIth.id, 'library', req.user.userName, libraryIth.tags, libraryIth.name, 
                                            function(err) {
                                                return cb(err);
                                            }
                                        );
                                    },
                                    function(cb) {
                                        m_log("Going to m_saveTypesInLibraryIthToDB");
                                        m_saveTypesInLibraryIthToDB(connection, req, res, project, comicIth, libraryIth,
                                            function(err) {
                                                return cb(err);
                                            }
                                        );
                                    },
                                    function(cb) {
                                        // Write record to projects_comics_libraries.
                                        var juncguts = {
                                            projectId: project.id,
                                            comicId: comicIth.id,
                                            libraryId: libraryIth.id
                                        };
                                        var juncquery = "insert " + self.dbname + "projects_comics_libraries SET ?";
                                        sql.queryWithCxnWithPlaceholders(connection, juncquery, juncguts,
                                            function(err, rows) {
                                                return cb(err);
                                            }
                                        );
                                    }
                                ],
                                function(err) { return cb(err); }
                            );
                        }
                    );
                },
                function(err) { return callback(err); }
            );
        } catch(e) { callback(e); }
    }

    // var m_saveTypesInComicIthToDB = function (connection, req, res, project, comicIth, callback) {

    //     try {

    //         m_log("***In m_saveTypesInComicIthToDB***");
    //         // Using passObj to (1) easily pass the many values needed in multiple places; and
    //         // (2) to allow for passing by reference (which scalars don't do) where needed--like ordinal.
    //         var passObj = {
    //             ordinal: 1,     // App type will get ordinal 0; all others in comic count up from 1.
    //             typeIdTranslationArray: [],
    //             comicIth: comicIth,
    //             connection: connection,
    //             req: req,
    //             res: res,
    //             project: project
    //         };

    //         // async.series runs each of an array of functions in order, waiting for each to finish in turn.
    //         async.series(
    //             [
    //                 // (1)
    //                 function(cb) {
    //                     m_saveAllTypesInComicIthToDB(passObj, 
    //                         function(err) {
    //                             return cb(err); 
    //                         }
    //                     );
    //                 },
    //                 // (3)
    //                 function(cb) {
    //                     m_fixUpBaseTypeIdsInComicIth(passObj, 
    //                         function(err) {
    //                             return cb(err); 
    //                         }
    //                     );
    //                 }
    //             ], 
    //             // final callback
    //             function(err){
    //                 return callback(err);
    //             }
    //         );
    //     } catch (e) {
    //         callback(e);
    //     }
    // }

    var m_saveTypesInLibraryIthToDB = function(connection, req, res, project, comicIth, libraryIth, callback) {

        try {

            m_log("***In m_saveTypesInLibraryIthToDB***");
            var ordinal = 1;
            async.eachSeries(libraryIth.types,
                function(typeIth, cb) {

                    if (typeIth.isApp || 0) {

                        // We can use nested async calls here to do (1) and (2) serially:
                        // (1) insert the App type
                        // (2) and then do (2a) and (2b) in parallel:
                        //  (2a) write tags
                        //  (2b) write the App type's arrays (methods, properties and events).
                        async.series(
                            [
                                // (1)
                                function(cb) {

                                    typeIth.libraryId = libraryIth.id;
                                    typeIth.ordinal = 0;

                                    var guts = {
                                        name: typeIth.name,
                                        isApp: 1,
                                        imageId: typeIth.imageId,
                                        altImagePath: typeIth.altImagePath,
                                        ordinal: 0,
                                        libraryId: typeIth.libraryId,
                                        description: typeIth.description,
                                        parentTypeId: typeIth.parentTypeId,
                                        parentPrice: typeIth.parentPrice,
                                        priceBump: typeIth.priceBump,
                                        ownedByUserId: req.user.userId,
                                        public: typeIth.public,
                                        quarantined: typeIth.quarantined,
                                        baseLibraryName: typeIth.baseLibraryName,
                                        baseTypeName: typeIth.baseTypeName
                                    };

                                    var exceptionRet = m_checkGutsForUndefined('app type', guts);
                                    if (exceptionRet) {
                                        return cb(exceptionRet);
                                    }

                                    var strQuery = "insert " + self.dbname + "types SET ?";
                                    m_log('Inserting App type with ' + strQuery + '; fields: ' + JSON.stringify(guts));
                                    sql.queryWithCxnWithPlaceholders(connection, strQuery, guts,
                                        function(err, rows) {

                                            try {
                                                if (err) { return cb(err); }
                                                if (rows.length === 0) { return cb(new Error("Error writing type to database.")); }

                                                // We don't have to add this 2-tuple to typeIdTranslationArray, since no other type can have the App type as a base type.
                                                // But we do have to set the newly assign id.
                                                typeIth.id = rows[0].insertId;
                                                return cb(null);

                                            } catch (e1) { return cb(e1); }
                                        }
                                    );
                                },
                                // (2)
                                function(cb) {
                                    async.parallel(
                                        [
                                            // (2a)
                                            function(cb) {
                                                m_setUpAndWriteTags(connection, res, typeIth.id, 'type', req.user.userName, typeIth.tags, typeIth.name, 
                                                    function(err) { return cb(err); }
                                                );
                                            },
                                            // (2b)
                                            function(cb) {
                                                m_saveArraysInTypeIthToDB(connection, project, typeIth, req, res, 
                                                    function(err) { return cb(err) }
                                                );
                                            }
                                        ],
                                        // parallel final callback
                                        function(err) { return cb(err); }
                                    );
                                }
                            ],
                            // series final callback
                            function(err){ return cb(err); }
                        );
                    } else {
                        // non-App type

                        typeIth.libraryId = libraryIth.id;
                        typeIth.ordinal = ordinal++;

                        // Again, we can use nested async calls here to do (1) and (2) serially:
                        // (1) insert the App type
                        // (2) and then do (2a) and (2b) in parallel:
                        //  (2a) write tags
                        //  (2b) write the App type's arrays (methods, properties and events).

                        async.series(
                            [
                                // (1)
                                function(cb) {

                                    var guts = {
                                        name: typeIth.name,
                                        isApp: 0,
                                        imageId: typeIth.imageId || 0,
                                        altImagePath: typeIth.altImagePath || "",
                                        ordinal: typeIth.ordinal,
                                        libraryId: typeIth.libraryId,
                                        description: typeIth.description,
                                        parentTypeId: typeIth.parentTypeId || 0,
                                        parentPrice: typeIth.parentPrice || 0,
                                        priceBump: typeIth.priceBump || 0,
                                        ownedByUserId: typeIth.ownedByUserId,
                                        public: typeIth.public || 0,
                                        quarantined: typeIth.quarantined || 1,
                                        baseLibraryName: typeIth.baseLibraryName || '',
                                        baseTypeName: typeIth.baseTypeName || ''
                                    };

                                    var exceptionRet = m_checkGutsForUndefined('non-App type', guts);
                                    if (exceptionRet) {
                                        return cb(exceptionRet);
                                    }

                                    // It's a Type that was deleted or never existed.
                                    var strQuery = "insert " + self.dbname + "types SET ?";
                                    weInserted = true;

                                    m_log('Inserting type with ' + strQuery + '; fields: ' + JSON.stringify(guts));

                                    sql.queryWithCxnWithPlaceholders(connection, strQuery, guts,
                                        function(err, rows) {

                                            try {
                                                if (err) { return cb(err); }
                                                if (rows.length === 0) { return cb(new Error("Error writing comic to database.")); }

                                                typeIth.id = rows[0].insertId;

                                                return cb(null);

                                            } catch (e3) {
                                                return cb(e3);
                                            }
                                        }
                                    );
                                },
                                // (2)
                                function(cb) {
                                    async.parallel(
                                        [
                                            // (2a)
                                            function(cb) {

                                                m_setUpAndWriteTags(connection, res, typeIth.id, 'type', req.user.userName, typeIth.tags, typeIth.name, 
                                                    function(err) { return cb(err); }
                                                );
                                            },
                                            // (2b)
                                            function(cb) {

                                                m_saveArraysInTypeIthToDB(connection, project, typeIth, req, res, 
                                                    function(err) { 
                                                        return cb(err); 
                                                    }
                                                );
                                            }
                                        ],
                                        // final callback for parallel
                                        function(err) { 
                                            return cb(err); 
                                        }
                                    );
                                }
                            ],
                            // final callback for series
                            function(err) { 
                                return cb(err); 
                            }
                        );
                    }
                },
                function(err) { 
                    return callback(err); 
                }
            );
        } catch (e) { 
            callback(e); 
        }
    }

// Change to m_fixUpBaseTypeIdsInLibraryIth.
    // var m_fixUpBaseTypeIdsInComicIth = function(passObj, callback) {

    //     try {
    //         // m_log("***In m_fixUpBaseTypeIdsInComicIth*** with passObj.typeIdTranslationArray=" + JSON.stringify(passObj.typeIdTranslationArray));

    //         async.eachSeries(passObj.comicIth.types, 
    //             function(typeIth, cb) {

    //                 if (!typeIth.baseTypeId) { 
    //                     return cb(null); 
    //                 }

    //                 // Using this to know if I need to return cb or if it will be done in the queryWithCxn callback. Strange need.
    //                 var didOne = false;
    //                 for (var j = 0; j < passObj.typeIdTranslationArray.length; j++) {

    //                     var xlateIth = passObj.typeIdTranslationArray[j];
    //                     if (xlateIth.origId === typeIth.baseTypeId) {
    //                         if (xlateIth.newId !== xlateIth.origId) {
    //                             var strQuery = "update " + self.dbname + "types set baseTypeId=" + xlateIth.newId + " where id=" + typeIth.id + ";";
    //                             didOne = true;

    //                             // Setting this early to avoid the fact that something could change by the time where in the queryWithCxn callback.
    //                             typeIth.baseTypeId = xlateIth.newId;
    //                             sql.queryWithCxn(passObj.connection, strQuery,
    //                                 function(err, rows) {
    //                                     if (err) { return cb(err); }
    //                                     return cb(null);
    //                                 }
    //                             );
    //                         }
    //                     }
    //                 };
    //                 if (!didOne) { return cb(null); }
    //             },
    //             // final callback for eachSeries
    //             function(err) {
    //                 return callback(err);
    //             }
    //         );
    //     } catch (e) { callback(e); }
    // }

    var m_saveArraysInTypeIthToDB = function (connection, project, typeIth, req, res, callback) {

        try {

            m_log("***Arrived in m_saveArraysInTypeIthToDB for type named " + typeIth.name + "***.");

            // We use async.parallel here because methods, properties and events are totally independent.
            // Since parallel isn't really happening, we could just as well use series, but just maybe we gain a little during an async moment.
            
            async.series( // TODO change back to parallel after debugging
                [
                    // (1) methods
                    function(cbp1) {

                        m_log("Doing methods");
                        var ordinal = 0;

                        async.eachSeries(typeIth.methods,
                            function(method, cb) {
                                async.series(
                                    [
                                        // (1a)
                                        function(cb) {

                                            method.typeId = typeIth.id;
                                            method.ordinal = ordinal++;

                                            if (!method.hasOwnProperty("arguments")) {
                                                method.arguments = [];
                                            }
                                            if (!method.hasOwnProperty("statements")) {
                                                method.statements = [];
                                            }

                                            var guts = {
                                                        typeId: typeIth.id,
                                                        name: method.name,
                                                        ordinal: method.ordinal,
                                                        statements: JSON.stringify({"statements": method.statements}),
                                                        imageId: method.imageId || 0,
                                                        description: method.description || '[No description provided]',
                                                        parentMethodId: method.parentMethodId || 0,
                                                        parentPrice: method.parentPrice || 0,
                                                        priceBump: method.priceBump || 0,
                                                        ownedByUserId: method.ownedByUserId,
                                                        public: method.public || 0,
                                                        quarantined: method.quarantined || 1,
                                                        methodTypeId: method.methodTypeId || 2, // Not needed anymore
                                                        arguments: JSON.stringify({"arguments": method.arguments})
                                                        };

                                            var exceptionRet = m_checkGutsForUndefined('method', guts);
                                            if (exceptionRet) {
                                                return cb(exceptionRet);
                                            }

                                            var strQuery = "insert " + self.dbname + "methods SET ?";
                                            m_log('Inserting method with ' + strQuery + '; fields: ' + JSON.stringify(guts));
                                            sql.queryWithCxnWithPlaceholders(connection, strQuery, guts,
                                                function(err, rows) {

                                                    try {
                                                        if (err) { return cb(err); }
                                                        if (rows.length === 0) { return cb(new Error("Error inserting method into database")); }

                                                        method.id = rows[0].insertId;

                                                        return cb(null);

                                                    } catch (em) { return cb(em); }
                                                }
                                            );
                                        },
                                        // (1b)
                                        function(cb) {

                                            m_setUpAndWriteTags(connection, res, method.id, 'method', req.user.userName, method.tags, method.name, 
                                                function(err) { return cb(err); }
                                            );
                                        }
                                    ],
                                    // final callback for async.series in methods
                                    function(err) { 
                                        return cb(err); 
                                    }
                                );
                            },
                            // final callback for async.eachSeries in methods
                            function(err) { 
                                return cbp1(err); 
                            }
                        );
                    },
                    // (2) properties
                    function(cbp2) {

                        m_log("Doing properties");
                        var ordinal = 0;

                        async.eachSeries(typeIth.properties,
                            function(property, cb) {

                                property.typeId = typeIth.id;
                                property.ordinal = ordinal++;

                                var guts = {
                                            typeId: typeIth.id,
                                            propertyTypeId: 6,
                                            name: property.name,
                                            initialValue: property.initialValue || '',
                                            ordinal: property.ordinal,
                                            isHidden: 0
                                            };

                                var exceptionRet = m_checkGutsForUndefined('property', guts);
                                if (exceptionRet) {
                                    return cb(exceptionRet);
                                }

                                strQuery = "insert " + self.dbname + "propertys SET ?";
                                m_log('Inserting property with ' + strQuery + '; fields: ' + JSON.stringify(guts));
                                sql.queryWithCxnWithPlaceholders(connection, strQuery, guts,
                                    function(err, rows) {

                                        try {
                                            if (err) { return cb(err); }
                                            if (rows.length === 0) { return cb(new Error("Error inserting property into database")); }

                                            property.id = rows[0].insertId;

                                            return cb(null);

                                        } catch (ep) { return cb(ep); }
                                    }
                                );
                            },
                            // final callback for async.eachSeries in properties
                            function(err) { 
                                return cbp2(err); 
                            }
                        );
                    },
                    // (3) events
                    function(cbp3) {

                        m_log("Doing events");
                        var ordinal = 0;
                        async.eachSeries(typeIth.events,
                            function(event, cb) {

                                event.typeId = typeIth.id;
                                event.ordinal = ordinal++;

                                var guts = {
                                            typeId: typeIth.id,
                                            name: event.name,
                                            ordinal: event.ordinal
                                            };

                                var exceptionRet = m_checkGutsForUndefined('event', guts);
                                if (exceptionRet) {
                                    return cb(exceptionRet);
                                }

                                strQuery = "insert " + self.dbname + "events SET ?";
                                m_log('Inserting event with ' + strQuery + '; fields: ' + JSON.stringify(guts));
                                sql.queryWithCxnWithPlaceholders(connection, strQuery, guts,
                                    function(err, rows) {

                                        try {
                                            if (err) { throw err; }
                                            if (rows.length === 0) { return cb(new Error("Error inserting method into database")); }

                                            event.id = rows[0].insertId;

                                            return cb(null);

                                        } catch (ee) { return cb(ee); }
                                    }
                                );
                            },
                            // final callback for async.eachSeries in events
                            function(err) { 
                                return cbp3(err); 
                            }
                        );
                    }
                ],
                // final callback for outer async.parallel for methods, properties and events.
                function(err) { 
                    return callback(err); 
                }
            );
        } catch (e) {

            callback(e);
        }
    }

    var m_checkGutsForUndefined = function(ident, guts) {

        var strError = '';
        Object.keys(guts).forEach(function(key, index) {

            if (typeof guts[key] === 'undefined') {

                strError += 'undefined value found in a "' + ident + '" for property "' + key + '"; ';
                strError += JSON.stringify(guts);
            }
        });

        if (strError) {

            console.log(strError);
            return new Error(strError);
        }
        return null;
    }

    var m_setUpAndWriteTags = function(connection, res, itemId, strItemType, userName, strTags, strName, callback) {

        try {
            
            m_log("***In m_setUpAndWriteTags for " + strItemType + " " + strName + "***");

            // Start tagArray with resource type description, userName (if not assoc. with a System Type) and resource name (with internal spaces replaced by '_').
            var tagArray = [];
            tagArray.push(strItemType);
            if (strName.length > 0) {

                tagArray.push(strName.trim().replace(/\s/g, '_').toLowerCase());
            }

            // Get optional user-entered tags ready to combine with above three tags.
            var ccArray = [];
            if (strTags) {

                ccArray = strTags.toLowerCase().match(/([\w\-]+)/g);

                if (ccArray){
                    tagArray = tagArray.concat(ccArray);
                }
            }

            // Remove possible dups from tagArray.
            var uniqueArray = [];
            uniqueArray.push(tagArray[0]);
            for (var i = 1; i < tagArray.length; i++) {
                var compIth = tagArray[i];
                var found = false;
                for (var j = 0; j < uniqueArray.length; j++) {
                    if (uniqueArray[j] === compIth){
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    uniqueArray.push(compIth);
                }
            }

            var tagsString = uniqueArray.join('~') + '~';
            var strSql = "call " + self.dbname + "doTags(" + connection.escape(tagsString) + "," + itemId + ",'" + strItemType + "');";
                
            m_log("Sending this sql: " + strSql);
            sql.queryWithCxn(connection, strSql, 
                function(err, rows) {

                    try{

                        if (err) { throw err; }

                        return callback(null);

                    } catch(et) { return callback(et); }
                }
            );
        } catch(e) { callback(e); }
    }

    var m_functionFinalCallback = function (err, req, res, connection, project) {

        // m_log('Reached m_functionFinalCallback. err is ' + (err ? 'non-null--bad.' : 'null--good--committing transaction.'));

        if (err) {

            m_log("Error saving: " + err.message);
            return res.json({
                success: false,
                message: 'Save Project failed with error: ' + err.message
            });
        } else {

            m_log("***Full Success***");
            sql.commitCxn(connection,
                function(err){

                    // Whatever happened, release the connection back to the pool.
                    connection.release();

                    if (err) {
                        return res.json({
                            success: false,
                            message: 'Committing transaction failed with ' + err.message
                        });
                    } else {

                        // Update JWT and user DB record to reflect project just saved.
                        m_functionUpdateUserJWTCookie(
                            req,
                            res,
                            project,
                            function(err) {

                                if (err) {

                                    return res.json({
                                        success: false,
                                        message: err.message
                                    });
                                }

                                return res.json({
                                    success: true,
                                    project: project
                                });
                            }
                        );
                    }
                }
            );
        }
    }

    self.routeRetrievePurchasableProjectData = function (req, res) {

        // This method retrieves all items in products, classes and online classes.
        // It's purpose is to let a privileged user activate/desctivate, edit details, etc.

        // We're going to use async.waterfall for these stages:
        // (1) Retrieve 3 by x jagged array of classes, onlineclasses and products plus joined project.description.
        // (2) Add related tags to each record in all 3 arrays.
        // (3) Add enrollment/purchase data to all 3 arrays.
        // Finally, return the single 2-dim jagged array.

        try {

            console.log("Entered ProjectBO/routeRetrievePurchasableProjectData");
            // req.user.userId
            // req.user.userName
            // Neither of these is used, and no other input is needed, although we may want to add tags later.

            async.waterfall(
                [
                    // (1)
                    function(cb) {

                        var strQuery = "select c.*, p.description from " + self.dbname + "classes c inner join " + self.dbname + "projects p on p.id=c.baseProjectId; select c.*, p.description from " + self.dbname + "onlineclasses c inner join " + self.dbname + "projects p on p.id=c.baseProjectId; select c.*, p.description from " + self.dbname + "products c inner join " + self.dbname + "projects p on p.id=c.baseProjectId;";
                        sql.execute(strQuery,
                            function(rows) {

                                if (rows.length !== 3) {
                                    return cb(new Error("Unable to fetch from PP data tables."), null);
                                }
                                // rows is a ragged array [3][x].
                                
                                // Sort results by name.
                                for(var i=0; i<3; i++) {

                                    if (rows[i].length) {

                                        rows[i].sort(function(a,b){

                                            if (a.name > b.name)
                                                return 1;
                                            if (a.name < b.name)
                                                return -1;
                                            return 0;
                                        });
                                    }
                                }
                                return cb(null, { arrayRows: rows} );
                            },
                            function(strError) {

                                return cb(new Error("Unable to fetch from PP data tables: " + strError), null);
                            }
                        );
                    },
                    // (2)
                    function(passOn, cb) {

                        // We're going to try to use nested async.eachSeries to get product tags for the 2 dimensions of passOn.arrayRows.
                        async.eachSeries(passOn.arrayRows,
                            function(arIth, cb) {

                                async.eachSeries(arIth,
                                    function(arIthJth, cb) {

                                        m_functionFetchTags(
                                            arIthJth.baseProjectId,
                                            'project',
                                            function(err, tags) {

                                                if (err) { return cb(err); }

                                                arIthJth.tags = tags;
                                                return cb(null);
                                            }
                                        );
                                    },
                                    function(err) { return cb(err); }
                                );
                            },
                            function(err) { return cb(err, passOn); }
                        );
                    },
                    // (3)
                    function(passOn, cb) {

                        // We're going to try to use nested async.eachSeries to get PP purchase numbers from the 2 dimensions of passOn.arrayRows.
                        async.eachSeries(passOn.arrayRows,
                            function(arIth, cb) {

                                async.eachSeries(arIth,
                                    function(arIthJth, cb) {

// MUST BE CHANGED projects.comicProjectId no longer exists.
                                        var strQuery = "select count(*) as cnt from " + self.dbname + "projects where comicProjectId=" + arIthJth.baseProjectId + " and id<>" + arIthJth.baseProjectId + ";";
                                        sql.execute(strQuery,
                                            function(rows){

                                                if (rows.length === 0) {
                                                    arIthJth.numBuyers = 0;
                                                } else {
                                                    arIthJth.numBuyers = rows[0].cnt;
                                                }
                                                return cb(null);
                                            },
                                            function(strError) { return cb(new Error(strError)); }
                                        );
                                    },
                                    function(err) { return cb(err); }
                                );
                            },
                            function(err) { return cb(err, passOn); }
                        );
                    }
                ],
                function(err, passOn) {

                    if (err) {
                        return res.json({
                            success: false,
                            message: err.message
                        });
                    }

                    return res.json({
                        success: true,
                        arrayRows: passOn.arrayRows
                    });
                }
            );
        } catch (e) {

            return res.json({
                success: false,
                message: e.message
            });
        }
    }

    self.routeSavePPData = function (req, res) {

        try {

            m_log("Entered ProjectBO/routeSavePPData with req.body=" + JSON.stringify(req.body) + " req.user=" + JSON.stringify(req.user));
            // Only one of the next 3 will be non-null.
            // req.body.classData
            // req.body.onlineClassData
            // req.body.productData
            // req.user.userId

            // classData, onlineClassData, productData can be used as guts.

            m_log("Getting a connection to MySql");
            sql.getCxnFromPool(
                function(err, connection) {
                    try {
                        if (err) { 

                            return res.json({
                                success: false,
                                message: 'Could not get a database connection: ' + err.message
                            });
                        } else {

                            // Extract values needed for parallel steps 2 and 3 below.
                            var imageId;
                            var tags;
                            var name;
                            var id;
                            var description;
                            if (req.body.hasOwnProperty("classData")) {
                                req.body.classData.schedule = JSON.stringify(req.body.classData.schedule);
                                imageId = req.body.classData.imageId;
                                tags = req.body.classData.tags;
                                delete req.body.classData.tags;
                                name = req.body.classData.name;
                                description = req.body.classData.classDescription;
                                id = req.body.classData.baseProjectId;
                            } else if (req.body.hasOwnProperty("onlineClassData")) {
                                req.body.onlineClassData.schedule = JSON.stringify(req.body.onlineClassData.schedule);
                                imageId = req.body.onlineClassData.imageId;
                                tags = req.body.onlineClassData.tags;
                                delete req.body.onlineClassData.tags;
                                name = req.body.onlineClassData.name;
                                description = req.body.onlineClassData.classDescription;
                                id = req.body.onlineClassData.baseProjectId;
                            } else if (req.body.hasOwnProperty("productData")) {
                                imageId = req.body.productData.imageId;
                                tags = req.body.productData.tags;
                                delete req.body.productData.tags;
                                name = req.body.productData.name;
                                description = req.body.productData.productDescription;
                                id = req.body.productData.baseProjectId;
                            }

                            // In parallel (1) save to classes, onlineclasses or products; (2) update some fields in the project; and (3) update the project's tags.
                            async.parallel(
                                [
                                    // (1)
                                    function(cb) {

                                        if (req.body.hasOwnProperty("classData")) {

                                            var strQuery = "UPDATE " + self.dbname + "classes SET ? where id=" + req.body.classData.id;
                                            m_log('Updating classes record with id ' + req.body.classData.id + ' with query ' + strQuery + '; fields: ' + JSON.stringify(req.body.classData));
                                            sql.queryWithCxnWithPlaceholders(connection, strQuery, req.body.classData,
                                                function(err, rows) {
                                                    return cb(err);
                                                }
                                            );
                                        } else if (req.body.hasOwnProperty("onlineClassData")) {

                                            var strQuery = "UPDATE " + self.dbname + "onlineclasses SET ? where id=" + req.body.onlineClassData.id;
                                            m_log('Updating onlineclasses record with id ' + req.body.onlineClassData.id + ' with query ' + strQuery + '; fields: ' + JSON.stringify(req.body.onlineClassData));
                                            sql.queryWithCxnWithPlaceholders(connection, strQuery, req.body.onlineClassData,
                                                function(err, rows) {
                                                    return cb(err);
                                                }
                                            );
                                        } else if (req.body.hasOwnProperty("productData")) {

                                            var strQuery = "UPDATE " + self.dbname + "products SET ? where id=" + req.body.productData.id;
                                            m_log('Updating products record with id ' + req.body.productData.id + ' with query ' + strQuery + '; fields: ' + JSON.stringify(req.body.productData));
                                            sql.queryWithCxnWithPlaceholders(connection, strQuery, req.body.productData,
                                                function(err, rows) {
                                                    return cb(err);
                                                }
                                            );
                                        }
                                    },
                                    // (2)
                                    function(cb) {

                                        guts = {
                                            imageId: imageId,
                                            name: name,
                                            description: description,
                                            altImagePath: ''
                                        };
                                        var strQuery = "update " + self.dbname + "projects SET ? where id=" + id.toString();
                                        m_log('Updating projects record with id ' + id + ' with query ' + strQuery + '; fields: ' + JSON.stringify(guts));
                                        sql.queryWithCxnWithPlaceholders(connection, strQuery, guts,
                                            function(err, rows) {
                                                return cb(err);
                                            }
                                        );
                                    },
                                    // (3)
                                    function(cb) {

                                        sql.queryWithCxn(connection, "delete from " + self.dbname + "project_tags where projectId=" + id + ";",
                                            function(err, rows) {
                                                if (err) { return cb(err); }

                                                m_setUpAndWriteTags(connection, res, id, 'project', req.user.userName, tags, name, 
                                                    function(err) {
                                                        return cb(err);
                                                    }
                                                );
                                            }    
                                        );
                                    },
                                ],
                                function(err) {
                                    
                                    if (err) {
                                        return res.json({
                                            success: false,
                                            message: err.message
                                        });
                                    }

                                    return res.json({
                                        success: true
                                    });
                                }
                            );
                        }
                    } catch(e) {

                        return res.json({
                            success: false,
                            message: e.message
                        });
                    }
                }
            );
        } catch (e) {

            return res.json({
                success: false,
                message: e.message
            });
        }
    }

    var m_log = function(msg) {
        // console.log(' ');
        console.log(msg);
    }

};