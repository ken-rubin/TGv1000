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
            // req.body.mode: "new", "copyOthers", "buyPP" work one way (set most id's=0); "editCore", "editOwn", "editPP" work another (retain most id's).
            //                  On saving, however, they affect the treatment of comics and libraries.
            // req.user.userId

            var iFetchMode = ["new", "copyOthers", "buyPP", "editCore", "editOwn", "editPP"].indexOf(req.body.mode);

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
                            id: (iFetchMode < 3) ? 0 : row.id,
                            originalProjectId: row.id,
                            name: row.name,
                            description: row.description,
                            ownedByUserId: row.ownedByUserId,
                            public: row.public,
                            quarantined: row.quarantined,
                            imageId: row.imageId,
                            altImagePath: row.altImagePath,
                            baseProjectId: row.baseProjectId,
                            parentPrice: row.parentPrice,
                            priceBump: row.priceBump,
                            projectTypeId: row.projectTypeId,
                            isCoreProject: (row.isCoreProject === 1 ? true : false),
                            isProduct: (row.isProduct === 1 ? true : false),
                            isClass: (row.isClass === 1 ? true : false),
                            isOnlineClass: (row.isOnlineClass === 1 ? true : false),
                            firstSaved: row.firstSaved,
                            lastSaved: row.lastSaved,
                            chargeId: row.chargeId,
                            comics: [],
                            currentComicIndex: row.currentComicIndex,
                            currentComicStepIndex: row.currentComicStepIndex,
                            specialProjectData: {},
                            strFetchMode: req.body.mode,
                            iFetchMode: iFetchMode
                        };

                        // In series:
                        //  1. Potentially retrieve fields from one of the tables: classes, products or onlineclasses.
                        //  2. Retrieve project's comics and their content (comiccode and libraries).
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

                                        // Privleged user is editing a project or a non-privileged user is considering buying a purchasable prject.
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
                                // 2. Comics.
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

            if (project.id === 0) {

                return callback(null);
            }

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
                        profile["lastProjectId"] = project.originalProjectId;   // In case project.id has been set = 0.
                        var token = jwt.sign(profile, app.get("jwt_secret"), { expiresIn: 60*60*5});
                        res.cookie('token', token, {maxAge: 60*60*1000, httpOnly: false, secure: false});    // Expires in 1 hour (in ms); change to secure: true in production
                    }
                    return callback(null);
                },
                function(strError) { return callback(new Error(strError)); }
            );
        } catch (e) {

            callback(e);
        }
    }

    var m_functionRetProjDoComics = function(req, res, project, callback) {

        try {

            m_log('In m_functionRetProjDoComics');

            var strSql = "select * from " + self.dbname + "comics where id in (select comicId from projects_comics where projectId=" + project.originalProjectId + ");";
            var exceptionRet = sql.execute(strSql,
                function(rows) {

                    // Every project has to have at least 1 comic.
                    if (rows.length === 0) {

                        return callback(new Error("Could not retrieve comics for project with id=" + project.originalProjectId));
                    } 

                    // Use async to process each comic in the project and fetch their internals.
                    // After review, could change eachSeries to each.
                    async.eachSeries(rows,
                        function(comicIth, cbe) {

                            comicIth.originalComicId = comicIth.id;
                            if (project.iFetchMode < 3) {
                                comicIth.id = 0;                                
                            }
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

            m_log('In m_functionRetProjDoComicInternals');

            // Using async.parallel, load comicIth's libraries (user and system), statements and comiccode.
            async.parallel([
                    function(cbp1) {    // libraries

                        // Fetch two sets of libraries at once: user and system libraries.
                        var sqlQuery = "select * from " + self.dbname + "libraries where id in (select libraryId from comics_libraries where comicId=" + comicIth.originalComicId + ");"; 

                        var exceptionRet = sql.execute(sqlQuery,
                            function(rows) {
                                
                                if (rows.length === 0) { return cbp1(new Error("Unable to retrieve project. Could not retrieve libraries for comic with id=" + comicIth.originalComicId)); }

                                async.eachSeries(rows,
                                    function(rowIth, cbpaa) {

                                        m_functionPrepareIncomingLibrary(req, res, project, comicIth, rowIth, 
                                            function(err) {
                                                return cbpaa(err);
                                            }
                                        );
                                    },
                                    function(err) { // Main callback for inner inner async.eachSeries.
                                        return cbp1(err);
                                    }
                                )
                            },
                            function(strError) { return cbp1(new Error(strError)); }
                        );
                        if (exceptionRet) { return cbp1(exceptionRet); }
                    },
                    function(cbp2) {  // statements

                        var strQuery = "select name from " + self.dbname + "statements where id in (select statementId from " + self.dbname + "comics_statements where comicId=" + comicIth.originalComicId + ") order by name asc;";
                        sql.execute(
                            strQuery,
                            function(rows) {
                                rows.forEach(
                                    function(rowIth) {
                                        comicIth.statements.push(rowIth.name);
                                    }
                                );
                                return cbp2(null);
                            },
                            function(strError) {
                                return cbp2(new Error(strError));
                            }
                        );
                    },
                    function(cbp3) {    // comiccode

                        var exceptionRet = sql.execute("select * from " + self.dbname + "comiccode where comicId=" + comicIth.originalComicId + ";",
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

    var m_functionPrepareIncomingLibrary = function (req, res, project, comicIth, rowIth, callback) {

        try {

            m_log('In m_functionPrepareIncomingLibrary');

            var libraryIth = {
                // id is NOW set in call to m_functionGetIdForLibrary.
                originalLibraryId: rowIth.id,
                createdByUserId: rowIth.createdByUserId,
                imageId: rowIth.imageId,
                altImagePath: rowIth.altImagePath
            };

            libraryIth = Object.assign(libraryIth, JSON.parse(rowIth.libraryJSON).library);

            libraryIth.id = m_functionGetIdForLibrary(project, libraryIth, rowIth);
            if (libraryIth.id === -1) {
                return callback(new Error('Caught error trying to determine id for library ' + libraryIth.name + ' in comic ' + comicIth.name + '.'));
            }

            // libraryIth.editors was saved as a joined ('\n') string of user emails (user.userName).
            // Since the ultimate source of this property is gotten from library_editors (and saving made sure of that), we will rebuild the string.
            libraryIth.editors = '';
            var sqlString = "select u.userName from " + self.dbname + "library_editors lu inner join user u on u.id=lu.userId where lu.libraryId=" + libraryIth.originalLibraryId + ";";
            var exRet = sql.execute(sqlString,
                function(rows) {
                    rows.forEach(
                        function(row) {

                            if (libraryIth.editors.length) { libraryIth.libraryJSON.editors += '\n'; }
                            libraryIth.editors += row.userName;
                        }
                    );

                    comicIth.libraries.push(libraryIth);
                    return callback(null);
                }
            );
        } catch(e) {
            return callback(e);
        }
    }

    var m_functionGetIdForLibrary = function(project, library, row) {

        try {
            if (project.iFetchMode < 3) {
                if (library.hasOwnProperty('types')) {
                    if (library.types.length > 0) {
                        for (let i = 0; i < library.types.length; i++) {
                            let typeIth = library.types[i];
                            if (typeIth.hasOwnProperty('isAppType')) {
                                return typeIth.isAppType ? 0 : row.id;
                            }
                            if (typeIth.name === 'App') {
                                return 0;
                            }
                        }
                        return row.id;
                    } else {
                        return row.id;
                    }
                } else {
                    return row.id;
                }
            } else {
                return row.id;
            }
        } catch(e) {
            return -1;  // Check for this someplace.
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

            // A privileged user can also edit and save a core project, keeping it a core project with id=1-6. In this case project.isCoreProject and
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

                                            m_functionNewSaveProject(connection, req, res, project, 
                                                function(err) {
                                                    m_functionFinalCallback(err, req, res, connection, project);
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

    var m_functionNewSaveProject = function(connection, req, res, project, callback) {

        try {

            m_log('***Continuing in m_functionNewSaveProject***');

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
                            description: project.description,
                            ownedByUserId: req.user.userId,
                            public: project.public,
                            quarantined: project.quarantined,
                            imageId: project.imageId,
                            altImagePath: project.altImagePath,
                            baseProjectId: project.parentProjectId,
                            parentPrice: project.parentPrice,
                            priceBump: project.priceBump,
                            projectTypeId: project.projectTypeId,
                            isCoreProject: (project.isCoreProject ? 1 : 0),
                            isProduct: (project.isProduct || project.specialProjectData.productProject ? 1 : 0),
                            isClass: (project.isClass || project.specialProjectData.classProject ? 1 : 0),
                            isOnlineClass: (project.isOnlineClass || project.specialProjectData.onlineClassProject ? 1 : 0),
                            lastSaved: (new Date()),
                            chargeId: project.chargeId,
                            currentComicIndex: project.currentComicIndex,
                            currentComicStepIndex: row.currentComicStepIndex
                        };

                        let verb = 'insert ';
                        let where = ''
                        if (project.id) {
                            verb = 'update ';
                            where = ' where id=' + project.id;
                        }

                        if (project.specialProjectData.openMode === "searched") {
                            
                            // Make sure firstSaved isn't changed for this case.
                            // If we don't do this, then firstSaved won't be passed to MySql and firstSaved will be set = CURRENT_TIMESTAMP (now).
                            guts.firstSaved = moment(project.firstSaved).format("YYYY-MM-DD HH:mm:ss");
                        }

                        var exceptionRet = m_checkGutsForUndefined('project', guts);
                        if (exceptionRet) {
                            return cb(exceptionRet);
                        }

                        var strQuery = verb + self.dbname + "projects SET ?" + where;
                        m_log('Inserting or updating project record with ' + strQuery + '; fields: ' + JSON.stringify(guts));
                        sql.queryWithCxnWithPlaceholders(connection, strQuery, guts,
                            function(err, rows) {
                                if (err) { return cb(err); }
                                if (rows.length === 0) { return cb(new Error('Error saving project to database.')); }

                                if (verb === 'insert ') {
                                    project.id = rows[0].insertId;
                                }

/*                                // Check if necessary to and then, if so, update project.comicProjectId
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
*/
                                return cb(null);
                            }
                        );
                    },
                    // (2)
                    function(cb) {

                        // Use async.parallel to save the project's possible purchasable project info and its comics in parallel.
                        async.parallel(
                            [
                                function(cb) {
                                    m_log("Calling m_saveComicsToDB");
                                    m_saveComicsToDB(connection, req, res, project,
                                        function(err) {
                                            return cb(err);
                                        }
                                    );
                                },
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
        } catch (e) { return callback(e); }
    }

    var m_savePurchProductData = function(connection, req, res, project, callback) {

        try {
            
            let guts = '';
            let tblName = '';
            let verb = '';
            let where = '';

            // There may be nothing to do here. Check these conditions carefully to understand.
            if (project.specialProjectData.userAllowedToCreateEditPurchProjs 
                && (project.specialProjectData.openMode === 'new' || project.specialProjectData.openMode === 'searched')) {

                if (project.specialProjectData.classProject && project.specialProjectData.hasOwnProperty('classData')) {

                    guts = {
                        name: project.name,
                        baseProjectId: project.id,
                        instructorFirstName: project.specialProjectData.classData.instructorFirstName,
                        instructorLastName: project.specialProjectData.classData.instructorLastName,
                        instructorPhone: project.specialProjectData.classData.instructorPhone,
                        level: project.specialProjectData.classData.level,
                        difficulty: project.specialProjectData.classData.difficulty,
                        classDescription: project.specialProjectData.classData.classDescription,
                        imageId: (project.specialProjectData.classData.imageId || 0),           // not set on client side yet
                        price: project.specialProjectData.classData.price,
                        facility: project.specialProjectData.classData.facility,
                        address: project.specialProjectData.classData.address,
                        room: project.specialProjectData.classData.room,
                        city: project.specialProjectData.classData.city,
                        state: project.specialProjectData.classData.state,
                        zip: project.specialProjectData.classData.zip,
                        schedule: JSON.stringify(project.specialProjectData.classData.schedule),
                        active: (project.specialProjectData.classData.active ? 1 : 0),
                        classNotes: project.specialProjectData.classData.classNotes,
                        maxClassSize: (project.specialProjectData.classData.maxClassSize || 0),  // not set on client side yet
                        loanComputersAvailable: (project.specialProjectData.classData.loadComputersAvailable || 0)  // not set on client side yet
                    };
                    tblName = 'classes';
                    if (project.specialProjectData.classData.id) {
                        verb = 'update ';
                        where = ' where id=' + project.specialProjectData.classData.id;
                    } else {
                        verb = 'insert ';
                    }

                } else if (project.specialProjectData.productProject && project.specialProjectData.hasOwnProperty('productData')) {

                    guts = {
                        name: project.name,
                        baseProjectId: project.id,
                        level: project.specialProjectData.productData.level,
                        difficulty: project.specialProjectData.productData.difficulty,
                        productDescription: project.specialProjectData.productData.productDescription,
                        imageId: (project.specialProjectData.productData.imageId || 0),           // not set on client side yet
                        price: project.specialProjectData.productData.price,
                        active: (project.specialProjectData.productData.active ? 1 : 0),
                        videoURL: (project.specialProjectData.productData.videoURL || '')           // not set on client side yet
                    };
                    tblName = 'products';
                    if (project.specialProjectData.productData.id) {
                        verb = 'update ';
                        where = ' where id=' + project.specialProjectData.productData.id;
                    } else {
                        verb = 'insert ';
                    }

                } if (project.specialProjectData.onlineClassProject && project.specialProjectData.hasOwnProperty('onlineClassData')) {

                    guts = {
                        name: project.name,
                        baseProjectId: project.id,
                        instructorFirstName: project.specialProjectData.onlineClassData.instructorFirstName,
                        instructorLastName: project.specialProjectData.onlineClassData.instructorLastName,
                        instructorEmail: project.specialProjectData.onlineClassData.instructorEmail,
                        level: project.specialProjectData.onlineClassData.level,
                        difficulty: project.specialProjectData.onlineClassData.difficulty,
                        classDescription: project.specialProjectData.onlineClassData.classDescription,
                        imageId: (project.specialProjectData.onlineClassData.imageId || 0),           // not set on client side yet
                        price: project.specialProjectData.onlineClassData.price,
                        schedule: JSON.stringify(project.specialProjectData.onlineClassData.schedule),
                        active: (project.specialProjectData.onlineClassData.active ? 1 : 0),
                        classNotes: project.specialProjectData.onlineClassData.classNotes
                    };
                    tblName = 'onlineclasses';
                    if (project.specialProjectData.onlineClassData.id) {
                        verb = 'update ';
                        where = ' where id=' + project.specialProjectData.onlineClassData.id;
                    } else {
                        verb = 'insert ';
                    }
                }

                if (tblName.length > 0) {

                    var exceptionRet = m_checkGutsForUndefined(tblName, guts);
                    if (exceptionRet) {
                        return cb(exceptionRet);
                    }

                    var strQuery = verb + self.dbname + tblName + " SET ?" + where;
                    m_log('Inserting or updating purchasable project with ' + strQuery + '; fields: ' + JSON.stringify(guts));
                    sql.queryWithCxnWithPlaceholders(connection, strQuery, guts,
                        function(err, rows) {
                            if (err) { return callback(err); }
                            if (rows.length === 0) { return callback(new Error('Error saving PP part of project to database.')); }

                            if (verb === "insert ") {
                                let id = rows[0].insertId;
                                if (tblName === 'classes') {

                                    project.specialProjectData.classData.id = id;

                                } else if (tblName === 'products') {

                                    project.specialProjectData.productData.id = id;

                                } else {

                                    project.specialProjectData.onlineClassData.id = id;
                                }
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

                                            // Do content of comic: comiccode, libraries and the junction table for statements in parallel. ;)

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

    // The 'X' in the name of this function means 'expressions', 'literals' or 'statements'--except that it's no longer called with 'expressions' or 'literal'; just 'statements'.
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
                        stepsJSON: JSON.stringify(ccIth.stepsJSON)
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

                        whatToDo = "updateLibAndDoJuncTbl";

                    } else if (!libraryIth.id) {

                        whatToDo = "insertLibAndDoJuncTbl";
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

                            // // Now do library_tags and the types within the library. Finally, return cb(null);
                            // async.parallel(
                            //     [
                            //         function(cb) {
                            //             m_log("Going to write library tags");
                            //             m_setUpAndWriteTags(connection, res, libraryIth.id, 'library', req.user.userName, libraryIth.tags, libraryIth.name, 
                            //                 function(err) {
                            //                     return cb(err);
                            //                 }
                            //             );
                            //         },
                            //         function(cb) {
                            //             m_log("Going to m_saveTypesInLibraryIthToDB");
                            //             m_saveTypesInLibraryIthToDB(connection, req, res, project, comicIth, libraryIth,
                            //                 function(err) {
                            //                     return cb(err);
                            //                 }
                            //             );
                            //         },
                            //         function(cb) {
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
                            //         }
                            //     ],
                            //     function(err) { return cb(err); }
                            // );
                        }
                    );
                },
                function(err) { return callback(err); }
            );
        } catch(e) { callback(e); }
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
                    // // (2)
                    // function(passOn, cb) {

                    //     // We're going to try to use nested async.eachSeries to get product tags for the 2 dimensions of passOn.arrayRows.
                    //     async.eachSeries(passOn.arrayRows,
                    //         function(arIth, cb) {

                    //             async.eachSeries(arIth,
                    //                 function(arIthJth, cb) {

                    //                     m_functionFetchTags(
                    //                         arIthJth.baseProjectId,
                    //                         'project',
                    //                         function(err, tags) {

                    //                             if (err) { return cb(err); }

                    //                             arIthJth.tags = tags;
                    //                             return cb(null);
                    //                         }
                    //                     );
                    //                 },
                    //                 function(err) { return cb(err); }
                    //             );
                    //         },
                    //         function(err) { return cb(err, passOn); }
                    //     );
                    // },
                    // (3)
                    function(passOn, cb) {

                        // We're going to try to use nested async.eachSeries to get PP purchase numbers from the 2 dimensions of passOn.arrayRows.
                        async.eachSeries(passOn.arrayRows,
                            function(arIth, cb) {

                                async.eachSeries(arIth,
                                    function(arIthJth, cb) {

// MUST BE CHANGED projects.comicProjectId no longer exists.
// TODO: WORK NEEDED                        
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
                            var name;
                            var id;
                            var description;
                            if (req.body.hasOwnProperty("classData")) {
                                req.body.classData.schedule = JSON.stringify(req.body.classData.schedule);
                                imageId = req.body.classData.imageId;
                                name = req.body.classData.name;
                                description = req.body.classData.classDescription;
                                id = req.body.classData.baseProjectId;
                            } else if (req.body.hasOwnProperty("onlineClassData")) {
                                req.body.onlineClassData.schedule = JSON.stringify(req.body.onlineClassData.schedule);
                                imageId = req.body.onlineClassData.imageId;
                                name = req.body.onlineClassData.name;
                                description = req.body.onlineClassData.classDescription;
                                id = req.body.onlineClassData.baseProjectId;
                            } else if (req.body.hasOwnProperty("productData")) {
                                imageId = req.body.productData.imageId;
                                name = req.body.productData.name;
                                description = req.body.productData.productDescription;
                                id = req.body.productData.baseProjectId;
                            }

                            // In parallel (1) save to classes, onlineclasses or products; (2) update some fields in the project.
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
                                    }
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