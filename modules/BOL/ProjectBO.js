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
                            comicProjectId: row.comicProjectId,
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

                                // In parallel:
                                //  1. Potentially retrieve fields from one of the tables: classes, products or onlineclasses.
                                //  2. Retrieve project's comics and their content.
                                async.parallel(
                                    [
                                        // 1.
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
                                        // 2.
                                        function(cb) {

                                            try {

                                                m_functionRetProjDoComics(  
                                                    req, 
                                                    res, 
                                                    project,
                                                    function(err) {
                                                        if (err) { return cb(err); }

                                                        // Sucess. The project is filled.

                                                        // Sort comics by ordinal.
                                                        project.comics.sort(function(a,b){return a.ordinal - b.ordinal;});

                                                        // Sort lists inside comics by their own ordinals.
                                                        project.comics.forEach(
                                                            function(comic) {

                                                                // Types. 
                                                                // WHAT HAPPENS WITH SYSTEM TYPES IN THE SORTING? All to the end, but do we need a secondary sort?
                                                                comic.types.sort(function(a,b){return a.ordinal - b.ordinal;});
                                                                comic.types.forEach(
                                                                    function(type) {
                                                                        // Methods.
                                                                        type.methods.sort(function(a,b){return a.ordinal - b.ordinal;});
                                                                        // Properties.
                                                                        type.properties.sort(function(a,b){return a.ordinal - b.ordinal;});
                                                                        // Events.
                                                                        type.events.sort(function(a,b){return a.ordinal - b.ordinal;});
                                                                    }
                                                                );
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

            // Note that we're using project.comicProjectId to fetch comics, since that's where they're attached and all derived projects
            // retain their furthest ancestor's comics.
            var exceptionRet = sql.execute("select * from " + self.dbname + "comics where projectId=" + project.comicProjectId + ";",
                function(rows) {

                    // Every project has to have at least 1 comic.
                    if (rows.length === 0) {

                        return callback(new Error("Could not retrieve comics for project with id=" + req.body.id));
                    } 

                    // Use async to process each comic in the project and fetch their internals.
                    // After review, could change eachSeries to each.
                    async.eachSeries(rows,
                        function(comicIth, cbe) {

                            comicIth.originalComicId = comicIth.id;
                            comicIth.comiccode = [];
                            comicIth.types = [];
                            comicIth.expressions = [];
                            comicIth.statements = [];
                            comicIth.literals = [];

                            // Fill comicIth's comiccode and types (including System Types).
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

            // Using async.parallel, load comicIth's types, all System Types and comiccode.
            // Non-System Types have both a projectId and a comicId.
            async.parallel([
                    function(cbp1) {    // comicIth's types

                        var sqlQuery = "select t1.*, t2.name as baseTypeName from " + self.dbname + "types t1 left outer join " + self.dbname + "types t2 on t1.baseTypeId=t2.id where t1.projectId=" + project.id + " and t1.comicId=" + comicIth.id + ";";
                        var exceptionRet = sql.execute(sqlQuery,
                            function(rows) {
                                
                                if (rows.length === 0) { return cbp1(new Error("Unable to retrieve project. Failed because comic containing no types.")); }

                                // Use async to process each type and fetch its internals.
                                // After review, could change eachSeries to each perhaps.
                                async.eachSeries(rows,
                                    function(typeIth, cbe1) {

                                        typeIth.originalTypeId = typeIth.id;
                                        typeIth.isApp = (typeIth.isApp === 1 ? true : false);
                                        typeIth.methods = [];
                                        typeIth.properties = [];
                                        typeIth.events = [];

                                        m_functionFetchTags(
                                            typeIth.id,
                                            'type',
                                            function(err, tags) {

                                                if (err) { return cbe1(err); }
                                                typeIth.tags = tags;

                                                m_functionDoTypeArrays(
                                                    typeIth,
                                                    function(err) { 

                                                        if (!err) {
                                                            
                                                            // Add the filled type to the comicIth.
                                                            comicIth.types.push(typeIth);
                                                        }
                                                        return cbe1(err);
                                                    }
                                                );
                                            }
                                        );
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
                    function(cbp2) {    // System types.

                        var sqlQuery = "select t1.*, t2.name as baseTypeName from " + self.dbname + "types t1 left outer join " + self.dbname + "types t2 on t1.baseTypeId=t2.id where t1.comicId IS NULL;";
                        var exceptionRet = sql.execute(sqlQuery,
                            function(rows) {
                                
                                if (rows.length === 0) { return cbp2(new Error("Unable to retrieve project. Failed to load any System Types types.")); }

                                // Use async to process each type and fetch its internals.
                                // After review, could change eachSeries to each perhaps.
                                async.eachSeries(rows,
                                    function(typeIth, cbe2) {

                                        typeIth.originalTypeId = typeIth.id;
                                        typeIth.isApp = (typeIth.isApp === 1 ? true : false);
                                        typeIth.methods = [];
                                        typeIth.properties = [];
                                        typeIth.events = [];

                                        m_functionFetchTags(
                                            typeIth.id,
                                            'type',
                                            function(err, tags) {

                                                if (err) { 

                                                    return cbe2(err); 
                                                }
                                                typeIth.tags = tags;

                                                m_functionDoTypeArrays(
                                                    typeIth,
                                                    function(err) { 

                                                        if (!err) {
                                                            // Add the filled type to the comicIth.
                                                            comicIth.types.push(typeIth);
                                                        }
                                                        return cbe2(err); 
                                                    }
                                                );
                                            }
                                        );
                                    },
                                    function(err) { // Main callback for outer async.eachSeries.
                                        return cbp2(err);
                                    }
                                );
                            },
                            function(strError) { return cbp2(new Error(strError)); }
                        );
                        if (exceptionRet) { return cbp2(exceptionRet); }
                    },
                    function(cbp3) {    // comiccode rows

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
                    },
                    function(cb) {  // expressions

                        var strQuery = "select name from " + self.dbname + "expressions where id in (select expressionId from " + self.dbname + "comics_expressions where comicId=" + comicIth.id + ");";
                        sql.execute(
                            strQuery,
                            function(rows) {
                                rows.forEach(
                                    function(rowIth) {
                                        comicIth.expressions.push(rowIth.name);
                                    }
                                );
                                return cb(null);
                            },
                            function(strError) {
                                return cb(new Error(strError));
                            }
                        );
                    },
                    function(cb) {  // statements

                        var strQuery = "select name from " + self.dbname + "statements where id in (select statementId from " + self.dbname + "comics_statements where comicId=" + comicIth.id + ");";
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
                    function(cb) {  // literals

                        var strQuery = "select name from " + self.dbname + "literals where id in (select literalId from " + self.dbname + "comics_literals where comicId=" + comicIth.id + ");";
                        sql.execute(
                            strQuery,
                            function(rows) {
                                rows.forEach(
                                    function(rowIth) {
                                        comicIth.literals.push(rowIth.name);
                                    }
                                );
                                return cb(null);
                            },
                            function(strError) {
                                return cb(new Error(strError));
                            }
                        );
                    }
                ],
                function(err) {
                    return callback(err);
                }
            );
        } catch(e) { return callback(e); }
    }

    var m_functionDoTypeArrays = function(typeIth, callback) {

        try {

            async.parallel(
                [
                    function(callbackMethods) {

                        var ex = sql.execute("select * from " + self.dbname + "methods where typeId=" + typeIth.id + ";",
                            function(rows) {

                                async.eachSeries(rows,
                                    function(method, cb) {
                                        method.originalMethodId = method.id;
                                        method.tags = '';

                                        m_functionFetchTags(
                                            method.id,
                                            'method',
                                            function(err, tags) {
                                                if (!err) {
                                                    method.tags = tags;

                                                    // Database gave me back parameters (string) and workspace (JSON: {statements: []}).
                                                    // Need to convert.
                                                    var arsArray = method.parameters;
                                                    if (arsArray.length) {

                                                        method.arguments = arsArray.match(/([\w\-]+)/g);

                                                    } else {

                                                        method.arguments = [];
                                                    }
                                                    delete method.parameters;
                                                    method.statements = JSON.parse(method.workspace).statements;
                                                    delete method.workspace;
                                                    typeIth.methods.push(method);
                                                }
                                                return cb(err);
                                            }
                                        );
                                    },
                                    function(err) { return callbackMethods(err); }                               );
                            },
                            function(strError) {
                                return callbackMethods(new Error(strError));
                            }
                        );
                        if (ex) { return callbackMethods(ex); }
                    },
                    function(callbackProperties) {

                        var ex = sql.execute("select * from " + self.dbname + "propertys where typeId=" + typeIth.id + ";",
                            function(rows){

                                async.eachSeries(rows,
                                    function(property, cb) {

                                        property.originalPropertyId = property.id,

                                        typeIth.properties.push(property);
                                        return cb(null);
                                    },
                                    function(err) { return callbackProperties(err); }
                                );
                            },
                            function(strError){
                                return callbackProperties(new Error(strError));
                            }
                        );
                        if (ex) { return callbackProperties(ex); }
                    },
                    function(callbackEvents) {

                        var ex = sql.execute("select * from " + self.dbname + "events where typeId=" + typeIth.id + ";",
                            function(rows){

                                async.eachSeries(rows,
                                    function(event, cb) {

                                        event.originalEventId = event.id;

                                        typeIth.events.push(event);
                                        return cb(null);
                                    },
                                    function(err) { return callbackEvents(err); }
                                );
                            },
                            function(strError){
                                return callbackEvents(new Error(strError));
                            }
                        );
                        if (ex) { return callbackEvents(ex); }
                    }
                ],
                function(err) { return callback(err); }
            );
        } catch(e) {
            return callback(e);
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //                  RetrieveType
    //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    self.routeRetrieveType = function (req, res) {

        // m_log("Entered ProjectBO/routeRetrieveType with req.body=" + JSON.stringify(req.body));
        // req.body.typeId

        try {

            var exceptionRet = sql.execute("select t1.*, t2.name as baseTypeName from " + self.dbname + "types left outer join " + self.dbname + "types t2 on t1.baseTypeId=t2.id where t1.id=" + req.body.typeId + ";",
                function(rows){

                    if (rows.length !== 1) {

                        res.json({
                            success: false,
                            message: 'Could not retrieve type from database.'
                        });
                    } else {

                        var row = rows[0];
                        var type = 
                        {
                            id: row.id,
                            originalTypeId: row.id,
                            name: row.name,
                            ownedByUserId: row.ownedByUserId,
                            public: row.public,
                            quarantined: row.quarantined,
                            isApp: row.isApp === 1 ? true : false,
                            imageId: row.imageId,
                            altImagePath: row.altImagePath,
                            ordinal: row.ordinal,
                            description: row.description,
                            parentTypeId: row.parentTypeId,
                            parentPrice: row.parentPrice,
                            priceBump: row.priceBump,
                            tags: '',
                            baseTypeId: row.baseTypeId,
                            baseTypeName: row.baseTypeName,
                            properties: [],
                            methods: [],
                            events: []
                        };

                        // Make like this isn't the user's type since it's so hard to determine.
                        type.id = 0;

                        m_functionFetchTags(
                            type.originalTypeId,
                            'type',
                            function(err, tags) {

                                if (err) { return res.json({success: false, message: err.message}); }

                                type.tags = tags;

                                m_functionDoTypeArrays(
                                    type,
                                    function(err) { 

                                        if (err) { return res.json({success: false, message: err.message}); }

                                        type.methods.sort(function(a,b){return a.ordinal - b.ordinal;});
                                        type.properties.sort(function(a,b){return a.ordinal - b.ordinal;});
                                        type.events.sort(function(a,b){return a.ordinal - b.ordinal;});

                                        res.json({
                                            success: true,
                                            type: type
                                        });
                                    }
                                );
                            }
                        );
                    }
                },
                function(strError){

                    res.json({
                        success: false,
                        message: strError
                    });
                    return;
                }
            );
            if (exceptionRet) {

                res.json({
                    success: false,
                    message: exceptionRet.message
                });
                return;
            }
        } catch(e) {

            res.json({
                success: false,
                message: e.message
            });
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //                  RetrieveMethod
    //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    self.routeRetrieveMethod = function (req, res) {

        // m_log("Entered ProjectBO/routeRetrieveMethod with req.body=" + JSON.stringify(req.body));
        // req.body.methodId

        try {

            var exceptionRet = sql.execute("select * from " + self.dbname + "methods where id=" + req.body.methodId+ ";",
                function(rows){

                    if (rows.length !== 1) {

                        res.json({
                            success: false,
                            message: 'Could not retrieve method from database.'
                        });
                    } else {

                        var row = rows[0];
                        var method = 
                        { 
                            id: row.id,
                            originalMethodId: row.id,
                            name: row.name, 
                            ownedByUserId: row.ownedByUserId,
                            public: row.public,
                            quarantined: row.quarantined,
                            ordinal: row.ordinal,
                            workspace: row.workspace, 
                            imageId: row.imageId,
                            description: row.description,
                            parentMethodId: row.parentMethodId,
                            parentPrice: row.parentPrice,
                            priceBump: row.priceBump,
                            tags: '',
                            methodTypeId: row.methodTypeId,
                            parameters: row.parameters
                        };

                        // We don't know whose method this is (req.user.userId's or someone else's). So we're going to make like it's someone else's.
                        method.id = 0;

                        m_functionFetchTags(
                            method.originalMethodId,
                            'method',
                            function(err, tags) {

                                method.tags = tags;

                                res.json({
                                    success:true,
                                    method:method
                                });

                                return;
                            }
                        );
                    }
                },
                function(strError){

                    res.json({
                        success: false,
                        message: strError
                    });
                    return;
                }
            );
            if (exceptionRet) {

                res.json({
                    success: false,
                    message: exceptionRet.message
                });
                return;
            }
        } catch(e) {

            res.json({
                success: false,
                message: e.message
            });
        }
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
            // So nothing to do image-wise.

            // How to handle System Types if project.specialProjectData.systemTypesEdited === "1":
                // Since there is only one copy in the DB for SystemTypes, they are treated differently from other new or edited Types.
                // Whether in a Save or a SaveAs, if an SystemType already exists (id>=0), it is not deleted and then added again. It is updated.
                // Its methods, event and properties are deleted and re-inserted.
                // If it doesn't exist yet (id<0), it is inserted in the normal pass 2 processing.
                // Methods, events and properties are inserted.

            // Similar approach need if project.specialProjectData.comicsEdited === "1"

            m_log("***In routeSaveProject***");
            var project = req.body.projectJson;

            // All projects now have a specialProjectData property. From both normal and privileged users.
            // If a privileged user is saving a Purchasable Project (whether new or opened for editing), 
            // then specialProjectData itself will have one of these 3 properties: classData, onlineClassData or productData.
            // These three properties contain the info that has to be saved to classes, onlineclasses or products, respectively.

            // A privileged user can also edit and save a core project as such. In this case project.isCoreProject And
            // project.specialProjectData.coreProject will both be true. Take your pick.

            // project.specialProjectData.openMode === 'new' for new projects and 'searched' for projects opened with OpenProjectDialog.
            // 'new' projects are always INSERTed into the database.
            // 'searched' projects may be INSERTed or UPDATEd. More on this below in m_functionDetermineSaveOrSaveAs.

            // A purchasable project that has just been bought by a normal user came in as a 'new' with specialProjectData containing
            // one of the product subproperties so that we could display BuyDialog to the user. We will recognize that this project has to be INSERTed as new because 
            // its project.specialProjectData.openMode will have been changed to 'bought'.

                // Saving data to table products, classes or onlineclasses if this is a Purchasable Project (as opposed to an edited core project).

                // Updating without changing project id or comic id.

                // Handling SystemTypes if project.specialProjectData.systemTypesEdited === "1",
                    // Since there is only one copy in the DB for SystemTypes, they are treated differently from other new or edited Types.
                    // Whether in a Save or a SaveAs, if an SystemType already exists (id>=0), it is not deleted and then added again. It is updated.
                    // Its methods, event and properties are deleted and re-inserted.
                    // If it doesn't exist yet (id<0), it is inserted in the normal pass 2 processing.
                    // Methods, events and properties are inserted.

                // Similar approach need if project.specialProjectData.comicsEdited === "1"

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
                            res.json({
                                success: false,
                                message: 'Could not get a database connection: ' + err.message
                            });
                        } else {

                            m_log('Have a connection. Beginning a transaction.');
                            connection.beginTransaction(
                                function(err) {

                                    try {
                                        if (err) {

                                            res.json({
                                                success: false,
                                                message: 'Could not "begin" database transaction: ' + err.message
                                            });
                                        } else {

                                            m_log('Connection has a transaction');
                                            m_functionDetermineSaveOrSaveAs(connection, req, res,
                                                function(err, typeOfSave) {
                                                    if (err) {
                                                        m_functionFinalCallback(new Error("Could not save project due to error: " + err.message), req, res, null, null);
                                                    } else {
                                                        if (typeOfSave === 'save') {

                                                            m_log('Going into m_functionSaveProject');
                                                            m_functionSaveProject(connection, req, res, project, 
                                                                function(err) {
                                                                    if (err) {
                                                                        m_functionFinalCallback(err, req, res, null, null);
                                                                    } else {
                                                                        m_log("***Full success***");
                                                                        m_functionFinalCallback(null, req, res, connection, project);
                                                                    }
                                                                }
                                                            );
                                                        } else if (typeOfSave === 'saveWithSameId') {

                                                            m_log('Going into m_functionSaveProjectWithSameId');
                                                            m_functionSaveProjectWithSameId(connection, req, res, project, 
                                                                function(err) {
                                                                    if (err) {
                                                                        m_functionFinalCallback(err, req, res, null, null);
                                                                    } else {
                                                                        m_log("***Full success***");
                                                                        m_functionFinalCallback(null, req, res, connection, project);
                                                                    }
                                                                }
                                                            );
                                                        } else {    // 'saveAs'

                                                            m_log('Going into m_functionSaveProjectAs');
                                                            m_functionSaveProjectAs(connection, req, res, project, 
                                                                function(err) {
                                                                    if (err) {
                                                                        m_functionFinalCallback(err, req, res, null, null);
                                                                    } else {
                                                                        m_log("***Full success***");
                                                                        m_functionFinalCallback(null, req, res, connection, project);
                                                                    }
                                                                }
                                                            );
                                                        }
                                                    }
                                                }
                                            );
                                        }
                                    } catch(e1) { 
                                        res.json({
                                            success: false,
                                            message: 'Could not "begin" database transaction: ' + e1.message
                                        });
                                    }
                                }
                            );
                        }
                    } catch (e2) { 
                        res.json({
                            success: false,
                            message: 'Could not get a database connection: ' + e2.message
                        });
                    }
                }
            );
        } catch(e) { 
            res.json({
                success: false,
                message: 'Could not save project due to error: ' + e.message
            });
        }
    }

    var m_functionDetermineSaveOrSaveAs = function(connection, req, res, callback) {

        try {

            m_log("***In m_functionDetermineSaveOrSaveAs***");
            // return with callback(err, typeOfSave);
            // typeOfSave:
            //  'saveAs' INSERTs new rows for everything.
            //  'save' DELETES (cascading the project from the database) and then calls SaveAs to insert it.
            //  'saveWithSameId' ....

            // Muis importante: the project's name must be unique to the user's projects, but can be the same as another user's project name.
            // This doesn't have to be checked for a typeOfSave === 'save', but this is the time to check it for 'new' or 'save as' saves.
            // One or two buts here: a save will be changed to a saveAs if it's a new project or the user is saving a project gotten from another user;
            // a saveAs will be changed to a save if the name and id are the same as one of the user's existing projects.
            // And one more thing: if req.body.changeableName is true, then a name conflict will be resolved until there is no conflict
            // within the user's projects and a SaveAs can be done. This will only happen on a project with project.specialProjectData.openMode === "bought".

            // A privileged user can also edit and save a core project as such. In this case project.isCoreProject And
            // project.specialProjectData.coreProject will both be true. Take your pick.

            // project.specialProjectData.openMode === 'new' for new projects and 'searched' for projects opened with OpenProjectDialog.
            // 'new' projects are always INSERTed into the database.
            // 'searched' projects may be INSERTed or UPDATEd. More on this below in m_functionDetermineSaveOrSaveAs.

            // A purchasable project that has just been bought by a normal user came in as a 'new' with specialProjectData containing
            // one of the product subproperties so that we could display BuyDialog to the user. We will recognize that this project has to be INSERTed as new because 
            // its project.specialProjectData.openMode will have been changed to 'bought'.

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
                                editingCoreProject: (project.specialProjectData.privilegedUser && project.specialProjectData.coreProject)
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
                                    if (err) {

                                        return cb(err, null);
                                    }

                                    if (rows.length !== 1) {

                                        return cb(new Error("Error checking/getting unique name for purchase."), null);
                                    }

                                    resultArray.project.name = rows[0].uniqueName;
                                    resultArray["idOfUsersProjWithThisName"] = -1;
                                    return cb(null, resultArray);
                                }
                            );
                        } else {

                            var strQuery = "select id from " + self.dbname + "projects where name=" + connection.escape(resultArray.project.name) + " and ownedByUserId=" + req.user.userId + ";";
                            sql.queryWithCxn(connection, strQuery,
                                function(err, rows) {
                                    if (err) { 

                                        return cb(err, null); 
                                    
                                    } 
                                    
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
                    function(resultArray, cb) {

                        if (resultArray.project.specialProjectData.privilegedUser && resultArray.project.specialProjectData.openMode === 'searched') {

                            var strQuery = "select count(*) as cnt from " + self.dbname + "projects where comicProjectId=" + resultArray.project.id + ";";
                            sql.queryWithCxn(connection, strQuery,
                                function(err, rows) {
                                    if (err) { return cb(err, null); }
                                    resultArray["savingPurchasableProjectThatsBeenBought"] = (rows[0]['cnt'] > 0);
                                    return cb(null, resultArray);
                                }
                            );
                        } else {

                            return cb(null, resultArray);
                        }
                    }
                ],
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
    // Saving consists of deleting the old project (cascaded throughout) then then inserting it
    // using saveAs processing. It WILL change the project's id aong with ids of every part of the project.
    //
    // If saving project with same id as another of user's project with same name, then save.
    // A fallthrough case: If saving own project with same id and name then save.
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
                        // The following will delete the former project completely from the database using cascading delete.
                        var strQuery = "delete from " + self.dbname + "projects where id=" + project.id + ";";
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

                        if (project.specialProjectData.systemTypesEdited) {

                            // Entitled user edited, added or maybe deleted a System Type.
                            // Set up array of strings that will hold the System Types sql script (ST.sql) which will be written to
                            // project root when we commit the transaction.

                            project.script = [
                                "delimiter //",
                                "create procedure doSystemTypes()",
                                "begin"
                            ];

                            // For each System Type we will add these lines to the script array.
                            // Before finalyzing we will complete this procedure.

                            // project.idnum is incremented and concatenated with "id" to
                            // let the script use a unique id for each type. Then this can be used
                            // with methods, props, events and tags.
                            project.idnum = 0;
                        }

                        if (project.specialProjectData.openMode === 'new' && (project.isProduct || project.isClass || project.isOnlineClass)) {

                            // project.id is going to be set below after INSERT. Since we want project.comicProjectId to point to this project, we
                            // will zero it out so we can set it after we know this project's new id.
                            project.comicProjectId = 0;
                        }

                        var guts = {
                            name: project.name,
                            ownedByUserId: req.user.userId,
                            public: project.public,
                            projectTypeId: project.projectTypeId,
                            quarantined: project.quarantined,
                            parentPrice: project.parentPrice,
                            parentProjectId: project.parentProjectId,
                            priceBump: project.priceBump,
                            imageId: project.imageId,
                            altImagePath: project.altImagePath,
                            description: project.description,
                            isProduct: (project.isProduct || project.specialProjectData.productProject ? 1 : 0),
                            isClass: (project.isClass || project.specialProjectData.classProject ? 1 : 0),
                            isOnlineClass: (project.isOnlineClass || project.specialProjectData.onlineClassProject ? 1 : 0),
                            isCoreProject: (project.isCoreProject ? 1 : 0),
                            comicProjectId: project.comicProjectId,
                            lastSaved: (new Date()),
                            chargeId: project.chargeId,
                            currentComicIndex: project.currentComicIndex
                        };

                        if (project.specialProjectData.openMode === "searched") {
                            
                            // Make sure firstSaved isn't changed for this case.
                            // If we don't do this, then firstSaved won't be passed to MySql and firstSaved will be set = CURRENT_TIMESTAMP (now).
                            guts.firstSaved = moment(project.firstSaved).format("YYYY-MM-DD HH:mm:ss");
                        }

                        var strQuery = "INSERT " + self.dbname + "projects SET ?";
                        m_log('Inserting project record with ' + strQuery + '; fields: ' + JSON.stringify(guts));
                        sql.queryWithCxnWithPlaceholders(connection, strQuery, guts,
                            function(err, rows) {
                                if (err) { return cb(err); }
                                if (rows.length === 0) { return cb(new Error('Error saving project to database.')); }

                                project.id = rows[0].insertId;

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

                        // Use async.parallel to save the project's tags and start doing its comics in parallel.
                        async.parallel(
                            [
                                // (2a)
                                function(cb) {
                                    m_log("Going to write project tags");
                                    m_setUpAndWriteTags(connection, res, project.id, 'project', req.user.userName, project.tags, project.name, 
                                        null,   // this says not to push to project.script
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
                                    if (project.specialProjectData.privilegedUser && (project.specialProjectData.openMode === 'new' || project.specialProjectData.openMode === 'searched')) {
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

                        if (project.specialProjectData.systemTypesEdited) {

                            // Entitled user edited, added or maybe deleted System Types.
                            // Set up array of strings that will hold the System Types sql script (ST.sql) which will be written to
                            // project root when we commit the transaction.

                            project.script = [
                                "delimiter //",
                                "create procedure doSystemTypes()",
                                "begin"
                            ];

                            // For each System Type we will add these lines to the script array.
                            // Before finalyzing we will complete this procedure.

                            // project.idnum is incremented and concatenated with "id" to
                            // let the script use a unique id for each type. Then this can be used
                            // with methods, props, events and tags.
                            project.idnum = 0;
                        }

                        if (project.comicProjectId === 0) {

                            project.comicProjectId = project.id;
                        }

                        var guts = {
                            name: project.name,
                            ownedByUserId: req.user.userId,
                            public: project.public,
                            projectTypeId: project.projectTypeId,
                            quarantined: project.quarantined,
                            parentPrice: project.parentPrice,
                            parentProjectId: project.parentProjectId,
                            priceBump: project.priceBump,
                            imageId: project.imageId,
                            altImagePath: project.altImagePath,
                            description: project.description,
                            isProduct: (project.isProduct || project.specialProjectData.productProject ? 1 : 0),
                            isClass: (project.isClass || project.specialProjectData.classProject ? 1 : 0),
                            isOnlineClass: (project.isOnlineClass || project.specialProjectData.onlineClassProject ? 1 : 0),
                            isCoreProject: (project.isCoreProject ? 1 : 0),
                            comicProjectId: project.comicProjectId,
                            firstSaved: moment(project.firstSaved).format("YYYY-MM-DD HH:mm:ss"),
                            lastSaved: (new Date()),
                            chargeId: project.chargeId,
                            currentComicIndex: project.currentComicIndex
                        };

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
                                        null,   // this says not to push to project.script
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
                                    if (project.specialProjectData.privilegedUser && (project.specialProjectData.openMode === 'new' || project.specialProjectData.openMode === 'searched')) {

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
            if (project.specialProjectData.privilegedUser 
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

        // Now the project has been inserted into the DB and its id is in project.id.
        // A row has been added to resource and tags have been handled for the project, too.

        // This routine will iterate through the project's comics, possibly saving (inserting) each and processing its types, etc.
        // We use the word 'possibly', because comics themselves are saved only when a privileged user is working on a purchasable product or a core project.
        // Otherwise, only the comics' types and lower are saved.
        try {

            m_log("Just got into m_saveComicsToDB with this many comics to do: " + project.comics.length);

            // async.eachSeries iterates over a collection, perform a single async task at a time.
            // Actually, we could process all comics in parallel. Maybe we'll change to that in the future. Or maybe it really makes no diff.
            async.eachSeries(project.comics, 
                function(comicIth, cb) {

                    comicIth.projectId = project.comicProjectId;

                    if (project.specialProjectData.privilegedUser && (project.specialProjectData.coreProject || project.specialProjectData.productProject || project.specialProjectData.classProject || project.specialProjectData.onlineClassProject)) {
                        
                        var guts = {
                            projectId: comicIth.projectId,
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

                                    // Do content of comic: comiccode and types (and all their content) in parallel.
                                    // Also do the juntion tables comics_statements, comics_Expressions and comics_literals.

                                    async.parallel(
                                        [
                                            function(cb){

                                                m_log("Going to m_saveTypesInComicIthToDB");
                                                m_saveTypesInComicIthToDB(connection, req, res, project, comicIth, 
                                                    function(err) {
                                                        return cb(err); 
                                                    }
                                                );
                                            },
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

                        m_log("Going to m_saveTypesInComicIthToDB");
                        m_saveTypesInComicIthToDB(connection, req, res, project, comicIth, 
                            function(err) {
                                return cb(err); 
                            }
                        );
                    }
                },
                // final callback for series
                function(err) {
                    return callback(err);
                }
            );
        } catch (e) { callback(e); }
    }

    var m_saveComics_XInComicIthToDB = function (connection, req, res, project, comicIth, 
        which,
        callback) {

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

    var m_saveTypesInComicIthToDB = function (connection, req, res, project, comicIth, callback) {

        try {

            m_log("***In m_saveTypesInComicIthToDB***");
            // Using passObj to (1) easily pass the many values needed in multiple places; and
            // (2) to allow for passing by reference (which scalars don't do) where needed--like ordinal.
            var passObj = {
                ordinal: 1,     // App type will get ordinal 0; System Types are forced to ordinal 10000; all others in comic count up from 1.
                typeIdTranslationArray: [],
                comicIth: comicIth,
                connection: connection,
                req: req,
                res: res,
                project: project
            };

            // async.series runs each of an array of functions in order, waiting for each to finish in turn.
            // Actually, the first and second could be done in parallel, but the third must come after those two are done.
            // We should try that after all settles down.
            async.series(
                [
                    // (1)
                    function(cb) {
                        m_saveAppTypeInComicIthToDB(passObj, 
                            function(err) {
                                return cb(err); 
                            }
                        );
                    },
                    // (2)
                    function(cb) {
                        m_saveNonAppTypesInComicIthToDB(passObj, 
                            function(err) {
                                return cb(err); 
                            }
                        );
                    },
                    // (3)
                    function(cb) {
                        m_fixUpBaseTypeIdsInComicIth(passObj, 
                            function(err) {
                                return cb(err); 
                            }
                        );
                    }
                ], 
                // final callback
                function(err){
                    return callback(err);
                }
            );
        } catch (e) {
            callback(e);
        }
    }

    var m_saveAppTypeInComicIthToDB = function(passObj, callback) {

        try {

            m_log("***In m_saveAppTypeInComicIthToDB***");

            // We don't use async for this loop because we're looking for only one type. The loop is to find it amongst the comic's types.
            // (Of course, we know it will be the first.)
            var bFoundAppType = false;
            for (var i = 0; i < passObj.comicIth.types.length; i++) {

                var typeIth = passObj.comicIth.types[i];

                if (typeIth.isApp) {

                    bFoundAppType = true;
                    // But we can use nested async calls here to do (1) and (2) serially:
                    // (1) insert the App type
                    // (2) and then do (2a) and (2b) in parallel:
                    //  (2a) write tags
                    //  (2b) write the App type's arrays (methods, properties and events).
                    async.series(
                        [
                            // (1)
                            function(cb) {

                                typeIth.comicId = passObj.comicIth.id;
                                typeIth.ordinal = 0;
                                var guts = {
                                    name: typeIth.name,
                                    isApp: 1,
                                    imageId: typeIth.imageId,
                                    altImagePath: typeIth.altImagePath,
                                    ordinal: typeIth.ordinal,
                                    comicId: typeIth.comicId,
                                    description: typeIth.description,
                                    parentTypeId: typeIth.parentTypeId,
                                    parentPrice: typeIth.parentPrice,
                                    priceBump: typeIth.priceBump,
                                    ownedByUserId: passObj.req.user.userId,
                                    public: typeIth.public,
                                    quarantined: typeIth.quarantined,
                                    baseTypeId: typeIth.baseTypeId,
                                    projectId: passObj.project.id,
                                    isToolStrip: typeIth.isToolStrip
                                };
                                var strQuery = "insert " + self.dbname + "types SET ?";
                                m_log('Inserting App type with ' + strQuery + '; fields: ' + JSON.stringify(guts));
                                sql.queryWithCxnWithPlaceholders(passObj.connection, strQuery, guts,
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
                                            m_setUpAndWriteTags(passObj.connection, passObj.res, typeIth.id, 'type', passObj.req.user.userName, typeIth.tags, typeIth.name, 
                                                null,   // This says not to push to project.script
                                                function(err) { return cb(err); }
                                            );
                                        },
                                        // (2b)
                                        function(cb) {
                                            m_saveArraysInTypeIthToDB(passObj.connection, passObj.project, typeIth, passObj.req, passObj.res, 
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
                        function(err){ return callback(err); }
                    );
                    break;
                }
                //  else {
                //     return cb(null);
                // }
            }
            // If we fall through this loop, it means we didn't find an App type in the comic. This is, hopefully, quite impossible. But . . . 
            if (!bFoundAppType) {
                throw new Error("No App type found in comic");
            }
        } catch (e) { callback(e); }
    }

    var m_saveNonAppTypesInComicIthToDB = function(passObj, callback) {

        try {

            m_log("***In m_saveNonAppTypesInComicIthToDB***");

            // async.eachSeries iterates over a collection, perform a single async task at a time.
            // Actually, we could process all types in parallel, but we'd have to pre-assign their ordinals.
            // Maybe we'll change to that in the future.
            async.eachSeries(passObj.comicIth.types, 
                function(typeIth, cb) {

                    if (!typeIth.isApp) {

                        var processTypeIth = true;

                        // If !project.specialProjectData.systemTypesEdited, there won't be any SystemTypes with id < 0, but there will be SystemTypes
                        // with id > 0 which need to be skipped but counted down.

                        // Don't assign an ordinal to an SystemType. It's always 10000.
                        // Don't set an SystemType's comicId either.
                        if (typeIth.ordinal === 10000) {

                            if (!passObj.project.specialProjectData.systemTypesEdited || passObj.comicIth.ordinal > 0) {
                                // We process System Types only if the setting is on in the project AND we're in the first comic of the project. 
                                processTypeIth = false; 
                            }
                        } else {

                            typeIth.comicId = passObj.comicIth.id;
                            typeIth.ordinal = passObj.ordinal++;
                        }

                        if (processTypeIth) {

                            // Again, we can use nested async calls here to do (1) and (2) serially:
                            // (1) insert the App type
                            // (2) and then do (2a) and (2b) in parallel:
                            //  (2a) write tags
                            //  (2b) write the App type's arrays (methods, properties and events).

                            async.series(
                                [
                                    // (1)
                                    function(cb) {

                                        // Prepare for insert for new Types, including SystemTypes; update for existing SystemTypes.
                                        var guts = {
                                            name: typeIth.name,
                                            isApp: 0,
                                            imageId: typeIth.imageId,
                                            altImagePath: typeIth.altImagePath,
                                            ordinal: typeIth.ordinal,
                                            comicId: (typeIth.ordinal === 10000 ? null : typeIth.comicId),
                                            description: typeIth.description,
                                            parentTypeId: typeIth.parentTypeId,
                                            parentPrice: typeIth.parentPrice,
                                            priceBump: typeIth.priceBump,
                                            ownedByUserId: typeIth.ownedByUserId,
                                            public: typeIth.public,
                                            quarantined: typeIth.quarantined,
                                            baseTypeId: typeIth.baseTypeId,
                                            projectId: passObj.project.id,
                                            isToolStrip: typeIth.isToolStrip
                                            };

                                        var strQuery;
                                        var weInserted;
                                        if (typeIth.ordinal === 10000 && typeIth.id >= 0) {

                                            // Update an existing System Type so as not to lose its id. But kill its arrays, etc. and add them later. No need to preserve their ids.

                                            // First the update statement.
                                            strQuery = "update " + self.dbname + "types SET ? where id=" + typeIth.id;
                                            
                                            // Then delete methods, properties and events which will be re-inserted.
                                            strQuery += "delete from " + self.dbname + "methods where typeId=" + typeIth.id + ";";  // This should delete from method_tags, too.
                                            strQuery += "delete from " + self.dbname + "propertys where typeId=" + typeIth.id + ";";
                                            strQuery += "delete from " + self.dbname + "events where typeId=" + typeIth.id + ";";
                                            
                                            // Then type_tags.
                                            strQuery += "delete from " + self.dbname + "type_tags where typeId=" + typeIth.id + ";";
                                            weInserted = false;

                                        } else {

                                            // It's either a new System Type or a non-System Type that was deleted or never existed.
                                            strQuery = "insert " + self.dbname + "types SET ?";
                                            weInserted = true;
                                        }

                                        m_log('Inserting or updating type with ' + strQuery + '; fields: ' + JSON.stringify(guts));

                                        // If this is a System Type, push SQL statements onto passObj.project.script.

                                        // atid is to be used as a unique id in the doTags MySql procedure to
                                        // let subsequent steps insert according to a specific type's id.
                                        typeIth.atid = null;
                                        if (typeIth.ordinal === 10000) {

                                            passObj.project.idnum += 1;
                                            typeIth.atid = "@id" + passObj.project.idnum;

                                            var scriptGuts = 
                                                "SET name='" + typeIth.name + "'"
                                                +",isApp=0"
                                                +",imageId=" + typeIth.imageId
                                                +",altImagePath=" + typeIth.altImagePath
                                                +",ordinal=" + typeIth.ordinal
                                                +",comicId=" + (typeIth.ordinal === 10000 ? null : typeIth.comicId)
                                                +",description='" + typeIth.description + "'"
                                                +",parentTypeId=" + typeIth.parentTypeId
                                                +",parentPrice=" + typeIth.parentPrice
                                                +",priceBump=" + typeIth.priceBump
                                                +",ownedByUserId=" + typeIth.ownedByUserId
                                                +",public=" + typeIth.public
                                                +",quarantined=" + typeIth.quarantined
                                                +",baseTypeId=" + typeIth.baseTypeId
                                                +",projectId=" + passObj.project.id
                                                +",isToolStrip=" + typeIth.isToolStrip
                                                ;


                                            passObj.project.script.push('set @guts := "' + scriptGuts + '";');
                                            passObj.project.script.push('set ' + typeIth.atid + ' := (select id from types where ordinal=10000 and name="' + typeIth.name + '");');
                                            passObj.project.script.push('if ' + typeIth.atid + ' is not null then');
                                            passObj.project.script.push('   /* Existing System Types are deleted and re-inserted with the same id they had before. */');
                                            passObj.project.script.push('   delete from types where id=' + typeIth.atid + ';');
                                            passObj.project.script.push('   set @s := (select concat("insert types ",@guts,",id=' + typeIth.atid + ';"));');
                                            passObj.project.script.push('   prepare insstmt from @s;');
                                            passObj.project.script.push('   execute insstmt;');
                                            passObj.project.script.push('else');
                                            passObj.project.script.push('   /* New System Types are inserted with a new id. */');
                                            passObj.project.script.push('   set @s := (select concat("insert types ",@guts,";"));');
                                            passObj.project.script.push('   prepare insstmt from @s;');
                                            passObj.project.script.push('   execute insstmt;');
                                            passObj.project.script.push('   set ' + typeIth.atid + ' := (select LAST_INSERT_ID());');
                                            passObj.project.script.push('end if;');
                                            passObj.project.script.push("/* Whichever case, the System Type's id is in " + typeIth.atid + ", to be used below for methods, properties, events and tags. */");
                                        }

                                        sql.queryWithCxnWithPlaceholders(passObj.connection, strQuery, guts,
                                            function(err, rows) {

                                                try {
                                                    if (err) { return cb(err); }
                                                    if (rows.length === 0) { return cb(new Error("Error writing comic to database.")); }

                                                    if (weInserted) {
                                                        passObj.typeIdTranslationArray.push({origId:typeIth.id, newId:rows[0].insertId});
                                                        typeIth.id = rows[0].insertId;
                                                    } else {
                                                        // We updated.
                                                        passObj.typeIdTranslationArray.push({origId:typeIth.id, newId:typeIth.id});
                                                    }

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

                                                    m_setUpAndWriteTags(passObj.connection, passObj.res, typeIth.id, 'type', passObj.req.user.userName, typeIth.tags, typeIth.name, 
                                                        (typeIth.ordinal === 10000 ? passObj.project.script : null),
                                                        function(err) { return cb(err); },
                                                        typeIth.atid
                                                    );
                                                },
                                                // (2b)
                                                function(cb) {

                                                    m_saveArraysInTypeIthToDB(passObj.connection, passObj.project, typeIth, passObj.req, passObj.res, 
                                                        function(err) { return cb(err); },
                                                        typeIth.atid
                                                    );
                                                }
                                            ],
                                            // final callback for parallel
                                            function(err) { return cb(err); }
                                        );
                                    }
                                ],
                                // final callback for series
                                function(err) { return cb(err); }
                            );
                        } else {
                            // Even though we didn't write it out, we'll have it for lookups.
                            passObj.typeIdTranslationArray.push({origId:typeIth.id, newId:typeIth.id});
                            // m_log("2. xlateArray=" + JSON.stringify(passObj.typeIdTranslationArray));
                            return cb(null);
                        }
                    } else {
                        return cb(null);
                    }
                }, 
                // final callback
                function(err) { return callback(err); }
            );
        } catch (e) { callback(e); }
    }

    var m_fixUpBaseTypeIdsInComicIth = function(passObj, callback) {

        try {
            // m_log("***In m_fixUpBaseTypeIdsInComicIth*** with passObj.typeIdTranslationArray=" + JSON.stringify(passObj.typeIdTranslationArray));

            async.eachSeries(passObj.comicIth.types, 
                function(typeIth, cb) {

                    if (!typeIth.baseTypeId) { 
                        return cb(null); 
                    }

                    // Using this to know if I need to return cb or if it will be done in the queryWithCxn callback. Strange need.
                    var didOne = false;
                    for (var j = 0; j < passObj.typeIdTranslationArray.length; j++) {

                        var xlateIth = passObj.typeIdTranslationArray[j];
                        if (xlateIth.origId === typeIth.baseTypeId) {
                            if (xlateIth.newId !== xlateIth.origId) {
                                var strQuery = "update " + self.dbname + "types set baseTypeId=" + xlateIth.newId + " where id=" + typeIth.id + ";";
                                didOne = true;

                                // Setting this early to avoid the fact that something could change by the time where in the queryWithCxn callback.
                                typeIth.baseTypeId = xlateIth.newId;
                                sql.queryWithCxn(passObj.connection, strQuery,
                                    function(err, rows) {
                                        if (err) { return cb(err); }
                                        return cb(null);
                                    }
                                );
                            }
                        }
                    };
                    if (!didOne) { return cb(null); }
                },
                // final callback for eachSeries
                function(err) {
                    return callback(err);
                }
            );
        } catch (e) { callback(e); }
    }

    // atid is null or undefined unless typeIth is needed for a System Type. In that case it is the identifier to be used in ST.sql.
    var m_saveArraysInTypeIthToDB = function (connection, project, typeIth, req, res, callback, atid) {

        try {

            m_log("***Arrived in m_saveArraysInTypeIthToDB for type named " + typeIth.name + "***.");

            async.parallel(
                [
                    // (1) methods
                    function(cb) {

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

                                            var guts = {
                                                        typeId: typeIth.id,
                                                        name: method.name,
                                                        ordinal: method.ordinal,
                                                        workspace: JSON.stringify({"statements": method.statements}),
                                                        imageId: method.imageId,
                                                        description: method.description,
                                                        parentMethodId: method.parentMethodId,
                                                        parentPrice: method.parentPrice,
                                                        priceBump: method.priceBump,
                                                        ownedByUserId: method.ownedByUserId,
                                                        public: method.public,
                                                        quarantined: method.quarantined,
                                                        methodTypeId: method.methodTypeId,
                                                        parameters: method.arguments.join(',')
                                                        };

                                            var strQuery = "insert " + self.dbname + "methods SET ?";
                                            m_log('Inserting method with ' + strQuery + '; fields: ' + JSON.stringify(guts));
                                            sql.queryWithCxnWithPlaceholders(connection, strQuery, guts,
                                                function(err, rows) {

                                                    try {
                                                        if (err) { return cb(err); }
                                                        if (rows.length === 0) { return cb(new Error("Error inserting method into database")); }

                                                        method.id = rows[0].insertId;

                                                        // If this is a System Type method, push onto passObj.project.script.
                                                        if (typeIth.ordinal === 10000) {

                                                            // Re-do guts for use in ST.sql.
                                                            // We could just patch the original guts, but....
                                                            var scriptGuts = " SET typeId=" + atid
                                                                        + ",name=" + connection.escape(method.name)
                                                                        + ",ordinal=" + method.ordinal
                                                                        + ",workspace=" + connection.escape(method.workspace)
                                                                        + ",imageId=" + method.imageId
                                                                        + ",description=" + connection.escape(method.description)
                                                                        + ",parentMethodId=" + method.parentMethodId
                                                                        + ",parentPrice=" + method.parentPrice
                                                                        + ",priceBump=" + method.priceBump
                                                                        + ",ownedByUserId=" + method.ownedByUserId
                                                                        + ",public=" + method.public
                                                                        + ",quarantined=" + method.quarantined
                                                                        + ",methodTypeId=" + method.methodTypeId
                                                                        + ",parameters=" + connection.escape(method.parameters)
                                                                        ;
                                                            project.script.push("insert " + self.dbname + "methods" + scriptGuts + ";");
                                                            project.script.push('set @idm := (select LAST_INSERT_ID());')
                                                        }
                                                        return cb(null);

                                                    } catch (em) { return cb(em); }
                                                }
                                            );
                                        },
                                        // (1b)
                                        function(cb) {

                                            m_setUpAndWriteTags(connection, res, method.id, 'method', req.user.userName, method.tags, method.name, 
                                                (typeIth.ordinal === 10000 ? project.script : null),
                                                function(err) { return cb(err); },
                                                '@idm'
                                            );
                                        }
                                    ],
                                    // final callback for series (1)
                                    function(err) { return cb(err); }
                                );
                            },
                            // final callback for eachSeries (1)
                            function(err) { return cb(err); }
                        );
                    },
                    // (2)
                    function(cb) {

                        if (typeIth.properties.length) {

                            m_log("Doing properties");
                            var ordinal = 0;
                            async.eachSeries(typeIth.properties,
                                function(property, cb) {

                                    property.typeId = typeIth.id;
                                    property.ordinal = ordinal++;

                                    var guts = {
                                                typeId: typeIth.id,
                                                propertyTypeId: property.propertyTypeId,
                                                name: property.name,
                                                initialValue: property.initialValue,
                                                ordinal: property.ordinal,
                                                isHidden: (property.isHidden ? 1 : 0)
                                                };
                                    strQuery = "insert " + self.dbname + "propertys SET ?";
                                    m_log('Inserting property with ' + strQuery + '; fields: ' + JSON.stringify(guts));
                                    sql.queryWithCxnWithPlaceholders(connection, strQuery, guts,
                                        function(err, rows) {

                                            try {
                                                if (err) { return cb(err); }
                                                if (rows.length === 0) { return cb(new Error("Error inserting property into database")); }

                                                property.id = rows[0].insertId;

                                                // If this is a System Type property, push onto passObj.project.script.
                                                if (typeIth.ordinal === 10000) {
                                                    var scriptGuts = " SET typeId=" + atid
                                                                + ",propertyTypeId=" + property.propertyTypeId
                                                                + ",name=" + connection.escape(property.name)
                                                                + ",initialValue=" + connection.escape(property.initialValue)
                                                                + ",ordinal=" + property.ordinal
                                                                + ",isHidden=" + (property.isHidden ? 1 : 0)
                                                                ;
                                                    project.script.push("insert " + self.dbname + "propertys" + scriptGuts + ";");
                                                }
                                                return cb(null);

                                            } catch (ep) { return cb(ep); }
                                        }
                                    );
                                },
                                // final callback for eachSeries (2)
                                function(err) { return cb(err); }
                            );
                        } else {
                            m_log("No properties to do");
                            return cb(null);
                        }
                    },
                    // (3)
                    function(cb) {

                        if (typeIth.events.length) {

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
                                    strQuery = "insert " + self.dbname + "events SET ?";
                                    m_log('Inserting event with ' + strQuery + '; fields: ' + JSON.stringify(guts));
                                    sql.queryWithCxnWithPlaceholders(connection, strQuery, guts,
                                        function(err, rows) {

                                            try {
                                                if (err) { throw err; }
                                                if (rows.length === 0) { return cb(new Error("Error inserting method into database")); }

                                                event.id = rows[0].insertId;

                                                // If this is a System Type event, push onto passObj.project.script.
                                                if (typeIth.ordinal === 10000) {
                                                    var scriptGuts = " SET typeId=" + atid
                                                                + ",name=" + connection.escape(event.name)
                                                                + ",ordinal=" + event.ordinal
                                                                ;
                                                    project.script.push("insert " + self.dbname + "events" + scriptGuts + ";");
                                                }
                                                return cb(null);

                                            } catch (ee) { return cb(ee); }
                                        }
                                    );
                                },
                                // final callback for eachSeries (3)
                                function(err) { return cb(err); }
                            );
                        } else {
                            m_log("No events to do");
                            return cb(null);
                        }
                    }
                ],
                // final callback for parallel
                function(err) { return callback(err); }
            );
        } catch (e) {

            callback(e);
        }
    }

    // atid is null or undefined unless an id is needed for a System Type or one of its components.
    // In that case it is the identifier to be used in ST.sql.
    var m_setUpAndWriteTags = function(connection, res, itemId, strItemType, userName, strTags, strName, projectScript, callback, atid) {

        try {
            
            m_log("***In m_setUpAndWriteTags for " + strItemType + " " + strName + "***");

            // Start tagArray with resource type description, userName (if not assoc. with a System Type) and resource name (with internal spaces replaced by '_').
            var tagArray = [];
            tagArray.push(strItemType);
            if (projectScript === null){
                // Not right to use user name for a System Type tag.
                tagArray.push(userName);
            }
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

                        // projectScript is passed in if it is meant for us to push the procedure call. So we will.
                        if (projectScript) {
                            projectScript.push("call " + self.dbname + "doTags(" + connection.escape(tagsString) + "," + atid + ",'" + strItemType + "');");
                        }
                        return callback(null);
                    } catch(et) { return callback(et); }
                }
            );
        } catch(e) { callback(e); }
    }

    var m_functionFinalCallback = function (err, req, res, connection, project) {

        // m_log('Reached m_functionFinalCallback. err is ' + (err ? 'non-null--bad.' : 'null--good--committing transaction.'));

        if (err) {
            res.json({
                success: false,
                message: 'Save Project failed with error: ' + err.message
            });
       } else {
            sql.commitCxn(connection,
                function(err){

                    if (err) {
                        res.json({
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

                                if (project.hasOwnProperty("script")) {
                                    // There's a sql script that needs to be written to project root.
                                    // In the callback from that file creation, we'll return to the client.
                                    // m_log("About to write sql script containing " + project.script.length + " lines.");
                                    m_functionWriteSqlScript(project, function(err) {

                                        delete project.script;
                                        delete project.idnum;
                                        if (err) {
                                            // Writing the file didn't work, but saving the project has already been committed to the DB.
                                            // We'll inform the user, but do so in a way that the project is saved.
                                            res.json({
                                                success: true,
                                                project: project,
                                                scriptSuccess: false,
                                                saveError: err
                                            });
                                        } else {
                                            res.json({
                                                success: true,
                                                project: project,
                                                scriptSuccess: true
                                            });
                                        }
                                    });
                                } else {
                                    res.json({
                                        success: true,
                                        project: project
                                    });
                                }
                            }
                        );
                    }
                }
            );
        }
    }

    var m_functionWriteSqlScript = function(project, callback) {

        try {

            // Finalize the procedure.
            project.script.push("end;");
            project.script.push("//");
            project.script.push("delimiter ;");
            project.script.push("call doSystemTypes();");
            project.script.push("drop procedure doSystemTypes;");

            fs.writeFile('ST.sql', project.script.join(os.EOL), 
                function (err) {
                    callback(err);
                }
            );
        } catch(e) {
            callback(e);
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

                                        var strQuery = "select count(*) as cnt from " + self.dbname + "projects where comicProjectId=" + arIthJth.id + " and id<>" + arIthJth.id + ";";
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
                                                    null,   // this says not to push to project.script
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