//////////////////////////////////
// ProjectBO.js module
//
//////////////////////////////////
var fs = require("fs");

module.exports = function ProjectBO(app, sql, logger) {

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
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //                  RetrieveProject
    //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    self.routeRetrieveProject = function (req, res) {

        try {

            m_log("Entered ProjectBO/routeRetrieveProject with req.body=" + JSON.stringify(req.body));
            // req.body.projectId
            // req.body.userId
            // Note that projectIds 1-5 are used to open new projects, based on project type selected by the user.

            var ex = sql.execute("select * from " + self.dbname + "projects where id = " + req.body.projectId + ";",
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
                            isProduct: 0,
                            parentProjectId: row.parentProjectId,
                            parentPrice: row.parentPrice,
                            priceBump: row.priceBump,
                            tags: '',
                            projectTypeId: row.projectTypeId,
                            canEditSystemTypes: row.canEditSystemTypes === 1 ? true : false,
                            comics:
                            {
                                items: []
                            }
                        };

                        // If the user is not editing his own project, then we will set project.id = 0 and project.ownedByUserId to so indicate.
                        // We'll be able to check project.id for 0 during further processing for the same treatment.
                        if (project.ownedByUserId != req.body.userId) {

                            project.id = 0;
                            project.ownedByUserId = parseInt(req.body.userId, 10);
                        }

                        m_functionFetchTags(
                            project.originalProjectId, 
                            'project', 
                            function(tags)  {

                                project.tags = tags;
                                m_functionRetProjDoComics(req, res, project);
                            }
                        );
                    }
                },
                function(strError) {

                    res.json( {success:false, message: strError} );
                }
            );

            if (ex) {

                res.json({success: false, message: e.message});
            }
        } catch(e) {

            res.json({success: false, message: e.message});
        }
    }

    var m_functionRetProjDoComics = function(req, res, project) {

        try {

            m_log('In m_functionRetProjDoComics');

            var ex = sql.execute("select * from " + self.dbname + "comics where projectId = " + project.originalProjectId + ";",
                function(rows)
                {

                    if (rows.length === 0) {

                        res.json({success: false, message: "Could not retrieve comics for project with id=" + req.body.id});
                        return;

                    } 

                    var comicsCounter = rows.length;
                    m_log('Got ' + comicsCounter + ' comics.');
                    var strComicIds = '';

                    rows.forEach(
                        function(row)
                        {

                            var comic = 
                            {
                                id: row.id,
                                originalComicId: row.id,
                                ordinal: row.ordinal,
                                thumbnail: row.thumbnail,
                                name: row.name,
                                url: row.url,
                                types: 
                                {
                                    items: []
                                }
                            };

                            if (strComicIds.length === 0)
                                strComicIds = comic.id.toString();
                            else
                                strComicIds = strComicIds + ',' + comic.id;

                            if (project.id === 0) {

                                comic.id = 0;   // So SaveProject will insert it.
                            }

                            project.comics.items.push(comic);

                            if (--comicsCounter === 0) {

                                m_log('strComicIds = "' + strComicIds + '"');
                                var ex2 = sql.execute("select count(*) as cnt from " + self.dbname + "types where comicId in (" + strComicIds + ");",
                                    function(rows){

                                        if (rows.length !== 1) {

                                            res.json({success:false, message: "Could not retrieve type count for project with id=" + req.body.id});
                                            return;
                                        }

                                        m_functionRetProjDoTypes(req, res, project, rows[0].cnt);
                                    },
                                    function(strError) {

                                        res.json({success: false, message: strError});
                                        return;
                                    }
                                );
                            }
                        }
                    );
                },
                function(strError) {

                    res.json( {success:false, message: strError} );
                }
            );

            if (ex) {

                res.json({success: false, message: e.message});
            }
        } catch(e) {

            res.json({success: false, message: e.message});
        }
    }

    var m_functionRetProjDoTypes = function(req, res, project, typesCount) {

        try {

            m_log('In m_functionRetProjDoTypes with typesCount = ' + typesCount);

            var strTypeIds = '';    // Will be used for a count(*) query.

            project.comics.items.forEach(
                function(comic) {

                    // We originally has order by ordinal asc, but, probably due to async or something, this didn't always work, so,
                    // since we want them ordered that way, we'll sort them manually below when we have them all (before fetching system types).
                    var ex = sql.execute("select t1.*, t2.name as baseTypeName from " + self.dbname + "types t1 left outer join " + self.dbname + "types t2 on t1.baseTypeId=t2.id where t1.comicId = " + comic.originalComicId + ";",
                        function(rows) {

                            // At least for now there can be comics with no types, so we disable the following test:
                            // if (rows.length === 0) {

                            //     res.json({
                            //         success: false,
                            //         message: 'Unable to retrieve selected project.'
                            //     });
                            //     return;
                            // }

                            rows.forEach(
                                function(row) {

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
                                        baseTypeId: row.baseTypeId, // may be null
                                        baseTypeName: row.baseTypeName, // this, too
                                        tags: '',
                                        properties: [],
                                        methods: [],
                                        events: []
                                    };

                                    if (strTypeIds.length === 0)
                                        strTypeIds = type.id.toString();
                                    else
                                        strTypeIds = strTypeIds + ',' + type.id;

                                    if (project.id === 0) {

                                        type.id = 0;
                                    }

                                    m_functionFetchTags(
                                        type.originalTypeId,
                                        'type',
                                        function(tags) {

                                            type.tags = tags;
                                            comic.types.items.push(type);

                                            if (--typesCount === 0) {

                                                // The sort referred to above.
                                                comic.types.items.sort(function(a,b){return a.ordinal - b.ordinal;});

                                                m_log('typesCount has reached 0--fetching systemTypes.');

                                                var ex2 = sql.execute("select t1.*, t2.name as baseTypeName from " + self.dbname + "types t1 left outer join " + self.dbname + "types t2 on t1.baseTypeId=t2.id where t1.comicId is null order by id asc;",
                                                    function(rows) {

                                                        typesCount = rows.length;

                                                        rows.forEach(
                                                            function(row) {

                                                                var baseType = 
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
                                                                    ordinal: 10000,                  // system types must always have ordinal === 10000 for sorting and recognition purposes
                                                                    description: row.description,
                                                                    parentTypeId: row.parentTypeId,
                                                                    parentPrice: row.parentPrice,
                                                                    priceBump: row.priceBump,
                                                                    baseTypeId: row.baseTypeId, // may be null
                                                                    baseTypeName: row.baseTypeName, // ditto
                                                                    tags: '',
                                                                    properties: [],
                                                                    methods: [],
                                                                    events: []
                                                                };
                                                                strTypeIds = strTypeIds + ',' + baseType.id;
                                                                comic.types.items.push(baseType);

                                                                if (--typesCount === 0) {

                                                                    var ex2 = sql.execute("select count(*) as mcnt from " + self.dbname + "methods where typeId in (" + strTypeIds + "); select count(*) as pcnt from " + self.dbname + "propertys where typeId in (" + strTypeIds + "); select count(*) as ecnt from " + self.dbname + "events where typeId in (" + strTypeIds + ");",
                                                                        function(rows) {

                                                                            if (rows.length !== 3 || rows[0].length !== 1 || rows[1].length !== 1 || rows[2].length !== 1) {

                                                                                res.json({success:false, message: "Could not retrieve project with id=" + req.body.id});
                                                                                return;
                                                                            }

                                                                            m_functionRetProjDoMethodsPropertiesEvents(req, res, project, rows[0][0].mcnt, rows[1][0].pcnt, rows[2][0].ecnt);
                                                                        },
                                                                        function(strError){
                                                                            res.json({success: false, message: strError});
                                                                            return;
                                                                        }
                                                                    );
                                                                }
                                                            }
                                                        );
                                                    },
                                                    function(strError) {

                                                        res.json({
                                                            success: false,
                                                            message: strError
                                                        });
                                                        return;
                                                    }
                                                );

                                            }
                                        }
                                    );
                                }
                            );
                        },
                        function(strError) {

                            res.json({
                                success: false,
                                message: strError
                            });
                            return;
                        }
                    );
                    if (ex) {
                        res.json({
                            success: false,
                            message: ex.message
                        });
                        return;
                    }
                }
            );
        } catch(e) {

            res.json({success: false, message: e.message});
        }
    }

    var m_functionRetProjDoMethodsPropertiesEvents = function(req, res, project, mcnt, pcnt, ecnt) {

        try {

            m_log('In m_functionRetProjDoMethodsPropertiesEvents with mcnt=' + mcnt + ', pcnt=' + pcnt + ', ecnt=' + ecnt);
            project.comics.items.forEach(
                function(comic) {
                    // m_log('in comic ' + JSON.stringify(comic));
                    comic.types.items.forEach(
                        function(type) {
                            // m_log('in type ' + JSON.stringify(type));
                            var ex = sql.execute("select * from " + self.dbname + "methods where typeId =" + type.originalTypeId + "; select * from " + self.dbname + "propertys where typeId =" + type.originalTypeId + "; select * from " + self.dbname + "events where typeId =" + type.originalTypeId + ";",
                                function(rows){

                                    // m_log(' ');
                                    // m_log('************** Start of triple select ******************');
                                    // m_log(' ');
                                    // m_log(JSON.stringify(rows));
                                    // m_log(' ');
                                    // m_log('************** Start of triple select ******************');
                                    // m_log(' ');

                                    if (rows.length !== 3) {
                                        m_log('The triple select did not return rows.length === 3');
                                        res.json({
                                            success: false,
                                            message: 'Unable to retrieve selected project.'
                                        });
                                        return;
                                    }

                                    // methods
                                    rows[0].forEach(
                                        function(row) {
                                            // m_log('method row: ' + JSON.stringify(row));
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

                                            if (project.id === 0) {

                                                method.id = 0;
                                            }

                                            m_functionFetchTags(
                                                method.originalMethodId,
                                                'method',
                                                function(tags) {

                                                    method.tags = tags;
                                                    // m_log('Method fetched: ' + JSON.stringify(method));
                                                    type.methods.push(method);

                                                    mcnt--;
                                                    if (mcnt === 0 && pcnt === 0 && ecnt === 0) {

                                                        m_functionSetSuccessProjectReturn(res, project);
                                                        return;
                                                    }
                                                }
                                            );
                                        }
                                    );

                                    // properties
                                    rows[1].forEach(
                                        function(row) {
                                            // m_log('property row: ' + JSON.stringify(row));
                                            var property = 
                                            {
                                                id: row.id,
                                                originalPropertyId: row.id,
                                                propertyTypeId: row.propertyTypeId,
                                                name: row.name,
                                                initialValue: row.initialValue,
                                                ordinal: row.ordinal,
                                                isHidden: row.isHidden
                                            };

                                            if (project.id === 0) {

                                                property.id = 0;
                                            }

                                            type.properties.push(property);

                                            pcnt--;
                                            if (mcnt === 0 && pcnt === 0 && ecnt === 0) {

                                                m_functionSetSuccessProjectReturn(res, project);
                                                return;
                                            }
                                        }
                                    );

                                    // events
                                    rows[2].forEach(
                                        function(row) {
                                            // m_log('event row: ' + JSON.stringify(row));
                                            var event = 
                                            {
                                                id: row.id,
                                                originalEventId: row.id,
                                                name: row.name,
                                                ordinal: row.ordinal
                                            };

                                            if (project.id === 0) {

                                                event.id = 0;
                                            }

                                            type.events.push(event);

                                            ecnt--;
                                            if (mcnt === 0 && pcnt === 0 && ecnt === 0) {

                                                m_functionSetSuccessProjectReturn(res, project);
                                                return;
                                            }
                                        }
                                    );
                                },
                                function(strError){
                                    res.json({success: false, message: strError});
                                    return;
                                }
                            );
                        }
                    );
                }
            );
        } catch (e) {

            res.json({success: false, message: e.message});
        }
    }

    var m_functionSetSuccessProjectReturn = function(res, project) {

        m_log('They have all reached 0. Returning project after sorting array by ordinal.');
        project.comics.items.sort(function(a,b){return a.ordinal - b.ordinal;});
        project.comics.items.forEach(
            function(comic) {

                comic.types.items.sort(function(a,b){return a.ordinal - b.ordinal;});
                comic.types.items.forEach(
                    function(type) {
                        type.methods.sort(function(a,b){return a.ordinal - b.ordinal;});
                        type.properties.sort(function(a,b){return a.ordinal - b.ordinal;});
                        type.events.sort(function(a,b){return a.ordinal - b.ordinal;});
                    }
                );
            }
        );
        res.json({
            success: true,
            project: project
        });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //                  RetrieveType
    //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    self.routeRetrieveType = function (req, res) {

        m_log("Entered ProjectBO/routeRetrieveType with req.body=" + JSON.stringify(req.body));
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
                            function(tags) {

                                type.tags = tags;

                                var ex2 = sql.execute("select count(*) as mcnt from " + self.dbname + "methods where typeId = " + type.originalTypeId + "; select count(*) as pcnt from " + self.dbname + "propertys where typeId = " + type.originalTypeId + "; select count(*) as ecnt from " + self.dbname + "events where typeId = " + type.originalTypeId + ";",
                                    function(rows) {

                                        if (rows.length !== 3 || rows[0].length !== 1 || rows[1].length !== 1 || rows[2].length !== 1) {

                                            res.json({success:false, message: "Could not retrieve type with id=" + type.id});
                                            return;
                                        }

                                        m_functionRetTypeDoMethodsPropertiesEvents(req, res, type, rows[0][0].mcnt, rows[1][0].pcnt, rows[2][0].ecnt);
                                    },
                                    function(strError){
                                        res.json({success: false, message: strError});
                                        return;
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

    var m_functionRetTypeDoMethodsPropertiesEvents = function(req, res, type, mcnt, pcnt, ecnt) {

        try {

            m_log('In m_functionRetTypeDoMethodsPropertiesEvents with mcnt=' + mcnt + ', pcnt=' + pcnt + ', ecnt=' + ecnt);
            var ex = sql.execute("select * from " + self.dbname + "methods where typeId =" + type.originalTypeId + "; select * from " + self.dbname + "propertys where typeId =" + type.originalTypeId + "; select * from " + self.dbname + "events where typeId =" + type.originalTypeId + ";",
                function(rows){

                    // m_log(' ');
                    // m_log('************** Start of triple select ******************');
                    // m_log(' ');
                    // m_log(JSON.stringify(rows));
                    // m_log(' ');
                    // m_log('************** Start of triple select ******************');
                    // m_log(' ');

                    if (rows.length !== 3) {
                        m_log('The triple select did not return rows.length === 3');
                        res.json({
                            success: false,
                            message: 'Unable to retrieve selected type.'
                        });
                        return;
                    }

                    // methods
                    rows[0].forEach(
                        function(row) {
                            // m_log('method row: ' + JSON.stringify(row));
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

                            method.id = 0;

                            m_functionFetchTags(
                                method.originalMethodId,
                                'method',
                                function(tags) {

                                    method.tags = tags;
                                    type.methods.push(method);

                                    mcnt--;
                                    if (mcnt === 0 && pcnt === 0 && ecnt === 0) {

                                        m_functionSetSuccessTypeReturn(res, type);
                                        return;
                                    }
                                }
                            );
                        }
                    );

                    // properties
                    rows[1].forEach(
                        function(row) {
                            // m_log('property row: ' + JSON.stringify(row));
                            var property = 
                            {
                                id: row.id,
                                originalPropertyId: row.id,
                                propertyTypeId: row.propertyTypeId,
                                name: row.name,
                                initialValue: row.initialValue,
                                ordinal: row.ordinal,
                                isHidden: row.isHidden
                            };

                            property.id = 0;

                            type.properties.push(property);

                            pcnt--;
                            if (mcnt === 0 && pcnt === 0 && ecnt === 0) {

                                m_functionSetSuccessTypeReturn(res, type);
                                return;
                            }
                        }
                    );

                    // events
                    rows[2].forEach(
                        function(row) {
                            // m_log('event row: ' + JSON.stringify(row));
                            var event = 
                            {
                                id: row.id,
                                originalEventId: row.id,
                                name: row.name,
                                ordinal: row.ordinal
                            };

                            event.id = 0;

                            type.events.push(event);

                            ecnt--;
                            if (mcnt === 0 && pcnt === 0 && ecnt === 0) {

                                m_functionSetSuccessTypeReturn(res, type);
                                return;
                            }
                        }
                    );
                },
                function(strError){
                    res.json({success: false, message: strError});
                    return;
                }
            );
        } catch (e) {

            res.json({success: false, message: e.message});
        }
    }

    var m_functionSetSuccessTypeReturn = function(res, type) {

        m_log('They have all reached 0. Returning type after sorting arrays by ordinal.');
        type.methods.sort(function(a,b){return a.ordinal - b.ordinal;});
        type.properties.sort(function(a,b){return a.ordinal - b.ordinal;});
        type.events.sort(function(a,b){return a.ordinal - b.ordinal;});

        res.json({
            success: true,
            type: type
        });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //                  RetrieveMethod
    //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    self.routeRetrieveMethod = function (req, res) {

        m_log("Entered ProjectBO/routeRetrieveMethod with req.body=" + JSON.stringify(req.body));
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

                        // We don't know whose method this is (req.body.userId's or someone else's). So we're going to make like it's someone else's.
                        method.id = 0;

                        m_functionFetchTags(
                            method.originalMethodId,
                            'method',
                            function(tags) {

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

            var exceptionRet = sql.execute("select t.description from " + self.dbname + "tags t where id in (select tagId from " + self.dbname + strItemType + "_tags where " + strItemType + "Id = " + thingId + ");",
                function(rows){

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

                    callback(tags);
                    return;
                },
                function(strError){

                    throw new Error(strError);
                }
            );
            if (exceptionRet){

                throw exceptionRet;
            }
        } catch(e) {

            throw e;
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
            // req.body.userId
            // req.body.userName
            // req.body.saveType - 'save' or 'saveAs' but needs further refinement below.
            // req.body.projectJson

            // All image resources have already been created or selected for the project, its types and their methods. (Or default images are still being used.)
            // So nothing to do image-wise.

            // Muis importante: the project's name must be unique to the user's projects, but can be the same as another user's project name.
            // This doesn't have to be checked for a typeOfSave === 'save', but this is the time to check it for 'new' or 'save as' saves.

            // System Types:
                // Since there is only one copy in the DB for SystemTypes, they are treated differently from other new or edited Types.
                // Whether in a Save or a SaveAs, if an SystemType already exists (id>=0), it is not deleted and then added again. It is updated.
                // Its methods, event and properties are deleted.
                // If it doesn't exist yet (id<0), it is inserted in the normal pass 2 processing.
                // Methods, events and properties are inserted.

            var project = req.body.projectJson;
            var typeOfSave = req.body.saveType;
            if (typeOfSave === 'save') {

                if (project.id === 0 || (project.id !== 0 && project.ownedByUserId !== parseInt(req.body.userId, 10))) {

                    typeOfSave = 'saveAs';
                }
            }

            // typeOfSave info:
            //  saveAs INSERTs new rows for everything.
            //  save DELETES (cascading the project from the database) and then calls SaveAs to re-insert it.
            // Everything is done in a single transaction.

            sql.getCxnFromPool(function(err, connection) {

                try {
                    if (err) {

                        throw new Error('Could not get a database connection: ' + err.message);

                    } else {

                        // m_log('Have a connection');

                        connection.beginTransaction(function(err) {

                            try {
                                if (err) {

                                    throw new Error('Could not "begin" database connection: ' + err.message);
                                
                                } else {

                                    // m_log('Connection has a transaction');

                                    if (typeOfSave === 'save') {

                                        // m_log('Going into m_functionSaveProject');
                                        m_functionSaveProject(connection, req, res, project);
                                    
                                    } else {    // 'saveAs'

                                        // m_log('Going into m_functionSaveProjectAs');
                                        m_functionSaveProjectAs(connection, req, res, project);
                                    }
                                }
                            } catch (e1) {

                                m_functionFinalCallback(e1, res, null, null);
                            }
                        });
                    }
                } catch (e2) {

                    m_functionFinalCallback(e2, res, null, null);
                }
            });
        } catch(e) {

            // m_log('Top level exception saving project');
            m_functionFinalCallback(new Error("Database failure"), res, null, null);
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////
    //
    //                      Save processing 
    //
    ///////////////////////////////////////////////////////////////////////////////////////////

    var m_functionSaveProject = function (connection, req, res, project) {

        try {

            // The following will delete the former project completely from the database using cascading delete.
            var strQuery = "delete from " + self.dbname + "projects where id=" + project.id + ";";

            // m_log('Save project step 1; deleting old version with ' + strQuery);
            
            sql.queryWithCxn(connection, 
                strQuery, 
                function(err, rows) {

                    try {
                        if (err) { 

                            // m_log('err back from delete project');
                            
                            // Rollback has happened already.
                            throw err; 
                        }

                        // Now we can just INSERT the project as passed from the client side.
                        m_functionProjectSaveAsPart2(connection, req, res, project);

                    } catch (e1) {

                        m_functionFinalCallback(e1, res, null, null);
                    }
                }
            );
        } catch (e) {

            m_functionFinalCallback(e, res, null, null);
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    //
    //                      SaveAs processing 
    //
    ///////////////////////////////////////////////////////////////////////////////////////////

    var m_functionSaveProjectAs = function (connection, req, res, project) {
        
        // If we are just doing a SaveAs, we'll come in here with a connection that has a transaction started.

        try {

            // Look for and reject an attempt to add a 2nd project for same user with same name.
            var strQuery = "select count(*) as cnt from " + self.dbname + "projects where ownedByUserId=" + req.body.userId + " and name='" + project.name + "';";
            
            // m_log('In SaveAs step 1; checking for name uniqueness with ' + strQuery);
            sql.queryWithCxn(connection, strQuery, 
                function(err, rows) {

                    try {                
                        if (err) { throw err; }

                        if (rows.length === 0) {

                            throw new Error('Failed database action checking for duplicate project name.');

                        } else {

                            if (rows[0].cnt > 0) {

                                throw new Error('You already have a project with that name.');

                            } else {
                                
                                // m_log('Name for SaveAs is good');

                                project.public = 0;                 // A saved-as project needs review by an admin or instructor.
                                m_functionProjectSaveAsPart2(connection, req, res, project);
                            }
                        }
                    } catch (e1) {

                        throw e1;
                    }
                }
            );
        } catch (e) {

            m_functionFinalCallback(e, res, null, null);
        }
    }

    var m_functionProjectSaveAsPart2 = function (connection, req, res, project) {

        // If we came in doing a Save, we've deleted the old project and jumped in here to re-INSERT the project as sent from client-side.
        // If we came in doing a SaveAs, we stopped off at m_functionSaveProjectAs to check for name uniqueness.

        try {

            m_log('Continuing in m_functionProjectSaveAsPart2');

            if (project.canEditSystemTypes) {

                // User turned on project.canEditSystemTypes. We assume some were edited or added.
                // Set up array of strings that will hold the System Types sql script (ST.sql).

                project.script = [
                    "delimiter //",
                    "create procedure doSystemTypes()",
                    "begin"
                ];

                // For each System Type we will add these lines to the script array.
                // Before finalyzing we will complete this procedure.
            }

            var guts = " SET name='" + project.name + "'"
                + ",ownedByUserId=" + req.body.userId
                + ",public=" + project.public
                + ",isProduct=" + project.isProduct
                + ",projectTypeId=" + project.projectTypeId
                + ",quarantined=" + project.quarantined
                + ",parentPrice=" + project.parentPrice
                + ",parentProjectId=" + project.parentProjectId
                + ",priceBump=" + project.priceBump
                + ",imageId=" + project.imageId
                + ",altImagePath='" + project.altImagePath + "'"
                + ",description='" + project.description + "'"
                + ",canEditSystemTypes=" + (project.canEditSystemTypes ? 1 : 0);

            m_log("Guts: " + guts);

            var strQuery = "INSERT " + self.dbname + "projects" + guts + ";";

            m_log('Inserting project record with ' + strQuery);

            sql.queryWithCxn(connection, strQuery, 
                function(err, rows) {

                    try {
                        if (err) { throw err; }

                        if (rows.length === 0) {

                            throw new Error('Error saving project to database.');
                        }

                        project.id = rows[0].insertId;

                        // Handle tags and project_tags.
                        m_setUpAndDoTagsWithCxn(connection, res, project.id, 'project', req.body.userName, project.tags, project.name, 
                            null,   // this says not to push to project.script
                            function(err) {

                                try{
                                    if (err) { throw err; }

                                    m_saveComicsWithCxn(connection, req, res, project);
                                } catch (e) {
                                    throw e;
                                }
                            }
                        );
                    } catch (e1) {

                        throw e1;
                    }
                }
            );

        } catch(e) {

            m_functionFinalCallback(e, res, null, null);
        }
    }

    var m_saveComicsWithCxn = function (connection, req, res, project) {

        // Now the project has been inserted into the DB and its id is in project.id.
        // Also, a row has been added to resource and tags have been handled, too.

        // This routine will loop through the project's comics, saving (inserting) each while counting down to 0.
        // At that point it will call the Types routine.

        try {

            var comicsCountdown = project.comics.items.length;
            var totalTypesAcrossAllComicsInclSystemTypes = 0;

            project.comics.items.forEach(
                function(comicIth) {

                    totalTypesAcrossAllComicsInclSystemTypes += comicIth.types.items.length;

                    m_log("Just counted types. Got " + totalTypesAcrossAllComicsInclSystemTypes + ".");

                    comicIth.projectId = project.id;

                    var strQuery = "insert " + self.dbname + "comics (projectId, ordinal, thumbnail, name, url) values (" + comicIth.projectId + "," + comicIth.ordinal + ",'" + comicIth.thumbnail + "','" + comicIth.name + "','" + comicIth.url + "');";
                    // m_log('In m_saveComicsWithCxn with ' + strQuery);
                    sql.queryWithCxn(connection, 
                        strQuery,
                        function(err, rows, comic) {

                            try {
                                if (err) { throw err; }

                                if (rows.length === 0) { throw new Error("Error writing comic to database."); }

                                comic.id = rows[0].insertId;

                                if (--comicsCountdown === 0) {

                                    m_log('Going to m_saveTypesWithCxn with a total number of types to do=' + totalTypesAcrossAllComicsInclSystemTypes);

                                    m_saveTypesWithCxn(connection, req, res, project, totalTypesAcrossAllComicsInclSystemTypes, function(err) {

                                        if (err) { throw err; }

                                        // This is the ONE place that does a call to m_functionFinalCallback with success in its intent.
                                        m_functionFinalCallback(null, res, connection, project);
                                    });
                                }
                            } catch (e1) {

                                throw e1;
                            }
                        },
                        comicIth
                    );
                }
            );
        } catch (e) {

            m_functionFinalCallback(e, res, null, null);
        }
    } 

    var m_saveTypesWithCxn = function (connection, req, res, project, totalTypesAcrossAllComicsInclSystemTypes, callback) {

        // All comics have now been inserted and their ids are set in project.comics.items.
        // Time to do types and then move on to type contents: methods, properties and events.
        // Types will require resource, tags and resources_tags. (As will methods.)

        // Here's the situation with System Types:
        // (1) The comic's App type has baseTypeId = id of one of the system types.
        // (2) All SystemTypes are recognized by having ordinal === 10000 and comicId === null. There is really nothing special about
        //     the five special project type SystemTypes except that they are chosen before the project is created, are the base type of
        //     the project's App type and are not changeable when editing the App type.
        // (3) Any new types (including SystemTypes) will have id < 0 and this id will be unique. This is so that, if they are then
        //     used as a base type, the derived type will have an id (albeit negative) for baseTypeId. So, after new types are written
        //     to the DB and given a positive id (saving their negative and new actual ids to an array of 2-tuples), we need to loop through the other types
        //     and change any where baseTypeId = the saved negative id. Addition, since we ultimately will be writing ALL types to the DB and all but
        //     pre-existing SystemTypes will receive a new Id, we need to save them to the array, too, to adjust possible other types that derive from them.
        //
        // All this means we have several passes to make through the types in each comic in the project.
        // As we loop, we increment the ordinal for each of the project's comic's types, starting at 0 for each comic. Note: we DO NOT assign an ordinal to
        // as SystemType. It is already 10000.
        // (Pass 1) We should write out the App type so it gets ordinal 0 and break out of that loop.
        // (Pass 2) We should loop through all types in the comic and write the ones with id < 0. When we get back a real id,
        //     we need to loop through all the types and update any whose baseTypeId matches the saved negative id.
        // (Pass 3) We should then loop through all the types again, skipping the App type and skipping any types with
        //     ordinal === 10000, and write the rest to the db.

        try {

            var passObj = {
                typesCount: totalTypesAcrossAllComicsInclSystemTypes,
                ordinal: 0,
                typeIdTranslationArray: [],
                comicIth: null,
                connection: connection,
                req: req,
                res: res,
                project: project
            };

            m_log("Arrived into m_saveTypesWithCxn.");

            for (var j = 0; j < project.comics.items.length; j++) {

                passObj.comicIth = project.comics.items[j];
                passObj.ordinal = 0;

                m_log("Going off to do App type.");
                m_saveAppType(passObj, function(err) {
                    try {
                        if (err) { throw err; }

                        m_log("Going off to do remaining types pass");
                        m_saveRemainingTypes(passObj, function(err) {
                            try {
                                if (err) { throw err; }

                                m_log("Going off to do fixUp pass");
                                m_fixUpBaseTypeIds(passObj, function(err) {
                                    if (err) { throw err; }

                                    if (passObj.typesCount === 0) {

                                        // Total success. We can call back to the outer comics loop.
                                        callback();
                                    }
                                });
                            } catch (eRest) {
                                throw eRest;
                            }
                        });
                    } catch (eApp) {
                        throw eApp;
                    }
                });
            }
        } catch (e) {
            m_functionFinalCallback(e, res, null, null);
        }
    }

    var m_saveAppType = function(passObj, callback) {

        try {

            passObj.comicIth.types.items.forEach(function(typeIth){

                if (typeIth.isApp) {

                    typeIth.comicId = passObj.comicIth.id;
                    typeIth.ordinal = 0;
                    passObj.ordinal++;
                    passObj.typesCount--;
                    var strQuery = "insert " + self.dbname + "types (name,isApp,imageId,altImagePath,ordinal,comicId,description,parentTypeId,parentPrice,priceBump,ownedByUserId,public,quarantined,baseTypeId) values ('" + typeIth.name + "',1," + typeIth.imageId + ",'" + typeIth.altImagePath + "'," + typeIth.ordinal + "," + typeIth.comicId + ",'" + typeIth.description + "'," + typeIth.parentTypeId + "," + typeIth.parentPrice + "," + typeIth.priceBump + "," + passObj.req.body.userId + "," + typeIth.public + "," + typeIth.quarantined+ "," + typeIth.baseTypeId + ");";
                    
                    m_log('Inserting App type with ' + strQuery);
                    sql.queryWithCxn(passObj.connection, strQuery,
                        function(err, rows, type) {

                            try {
                                if (err) { throw err; }
                                if (rows.length === 0) { throw new Error("Error writing type to database."); }

                                // We don't have to add this 2-tuple to typeIdTranslationArray, since no other type can have the App type as a base type.
                                // But we do have to set the newly assign id.
                                type.id = rows[0].insertId;
                                m_setUpAndDoTagsWithCxn(passObj.connection, passObj.res, type.id, 'type', passObj.req.body.userName, type.tags, type.name, 
                                    null,   // this says not to push to project.script
                                    function(err) {

                                        if (err) { throw err; }

                                        m_doTypeArraysForSaveAs(passObj.connection, passObj.project, type, passObj.req, passObj.res, function() {

                                            callback(null); 
                                        });
                                    }
                                );
                            } catch (e1) { throw e1; }
                        },
                        typeIth
                    );
                }
            });
        } catch (e) { callback(e); }
    }

    var m_saveRemainingTypes = function(passObj, callback) {

        try {

            m_log("In m_saveRemainingTypes with typesCount=" + passObj.typesCount);
            passObj.comicIth.types.items.forEach(function(typeIth){

                if (!typeIth.isApp) {

                    var processTypeIth = true;

                    // If !project.canEditSystemTypes, there won't be any SystemTypes with id < 0, but there will be SystemTypes
                    // with id > 0 which need to be skipped but counted down.

                    // Don't assign an ordinal to an SystemType. It's always 10000.
                    // Don't set an SystemType's comicId either.
                    if (typeIth.ordinal === 10000) {
                        if (!passObj.project.canEditSystemTypes) {
                            processTypeIth = false;
                        }
                    } else {
                        typeIth.comicId = passObj.comicIth.id;
                        typeIth.ordinal = passObj.ordinal++;
                    }

                    if (processTypeIth) {

                        // Prepare for insert for new Types, including SystemTypes; update for existing SystemTypes.
                        var guts = " SET name='" + typeIth.name + "'"
                            + ",isApp=" + (typeIth.isApp ? 1 : 0)
                            + ",imageId=" + typeIth.imageId
                            + ",altImagePath='" + typeIth.altImagePath + "'"
                            + ",ordinal=" + typeIth.ordinal
                            + ",comicId=" + (typeIth.ordinal === 10000 ? null : typeIth.comicId)
                            + ",description='" + typeIth.description + "'"
                            + ",parentTypeId=" + typeIth.parentTypeId
                            + ",parentPrice=" + typeIth.parentPrice
                            + ",priceBump=" + typeIth.priceBump
                            + ",ownedByUserId=" + typeIth.ownedByUserId
                            + ",public=" + typeIth.public
                            + ",quarantined=" + typeIth.quarantined
                            + ",baseTypeId=" + typeIth.baseTypeId
                            ;

                        var strQuery;
                        var weInserted;
                        if (typeIth.ordinal === 10000 && typeIth.id >= 0) {

                            // First the update statement.
                            strQuery = "update " + self.dbname + "types" + guts + " where id=" + typeIth.id + ";";
                            // Then delete methods, properties and events which will be re-inserted.
                            strQuery += "delete from " + self.dbname + "methods where typeId=" + typeIth.id + ";";  // This should delete from method_tags, too.
                            strQuery += "delete from " + self.dbname + "propertys where typeId=" + typeIth.id + ";";
                            strQuery += "delete from " + self.dbname + "events where typeId=" + typeIth.id + ";";
                            // Then type_tags.
                            strQuery += "delete from " + self.dbname + "type_tags where typeId=" + typeIth.id + ";";
                            weInserted = false;

                        } else {

                            strQuery = "insert " + self.dbname + "types" + guts + ";";
                            weInserted = true;
                        }

                        m_log('Inserting or updating type with ' + strQuery);

                        // If this is a System Type, push SQL statements onto passObj.project.script.
                        if (typeIth.ordinal === 10000) {

                            passObj.project.script.push('set @guts := "' + guts + '";');
                            passObj.project.script.push('set @id := (select id from types where ordinal=10000 and name="' + typeIth.name + '");');
                            passObj.project.script.push('if @id is not null then');
                            passObj.project.script.push('   delete from types where id=@id;');
                            passObj.project.script.push('   set @s := (select concat("insert types ",@guts,",id=@id;"));');
                            passObj.project.script.push('   prepare insstmt from @s;');
                            passObj.project.script.push('   execute insstmt;');
                            passObj.project.script.push('else');
                            passObj.project.script.push('   set @s := (select concat("insert types ",@guts,";"));');
                            passObj.project.script.push('   prepare insstmt from @s;');
                            passObj.project.script.push('   execute insstmt;');
                            passObj.project.script.push('   set @id := (select LAST_INSERT_ID());');
                            passObj.project.script.push('end if;');
                        }

                        sql.queryWithCxn(passObj.connection, strQuery,
                            function(err, rows, type, queryBack) {

                                try {
                                    if (err) { throw err; }
                                    if (rows.length === 0) { throw new Error("Error writing type to database."); }

                                    if (weInserted) {
                                        passObj.typeIdTranslationArray.push({origId:type.id, newId:rows[0].insertId});
                                        m_log("1. xlateArray=" + JSON.stringify(passObj.typeIdTranslationArray));
                                        type.id = rows[0].insertId;
                                    }

                                    m_setUpAndDoTagsWithCxn(passObj.connection, passObj.res, type.id, 'type', passObj.req.body.userName, type.tags, type.name, 
                                        (type.ordinal === 10000 ? passObj.project.script : null),
                                        function(err) {

                                            if (err) { throw err; }

                                            m_doTypeArraysForSaveAs(passObj.connection, passObj.project, type, passObj.req, passObj.res, function() {

                                                if (--passObj.typesCount === 0) { callback(null); }
                                            });
                                        }
                                    );
                                } catch (e3) {

                                    throw e3;
                                }
                            },
                            typeIth
                        );
                    } else {
                        // Even though we didn't write it out, we'll have it for lookups.
                        passObj.typeIdTranslationArray.push({origId:typeIth.id, newId:typeIth.id});
                        m_log("2. xlateArray=" + JSON.stringify(passObj.typeIdTranslationArray));
                        
                        if (--passObj.typesCount === 0) { callback(null); }
                    }
                }
            });
        } catch (e) {
            callback(e);
        }
    }

    var m_fixUpBaseTypeIds = function(passObj, callback) {

        try {

            var numUpdatesToDo = 0;
            passObj.comicIth.types.items.forEach(function(typeIth){

                if (typeIth.baseTypeId !== null) {

                    numUpdatesToDo++;
                }
            });

            m_log(numUpdatesToDo + " update(s) to do. Here's typeIdTranslationArray: " + JSON.stringify(passObj.typeIdTranslationArray));

            passObj.comicIth.types.items.forEach(function(typeIth){

                if (typeIth.baseTypeId !== null) {

                    passObj.typeIdTranslationArray.forEach(function(xlateIth) {

                        if (xlateIth.origId === typeIth.baseTypeId) {

                            if (xlateIth.newId === xlateIth.origId){
                                // No need to update the type. Just count down.
                                if (--numUpdatesToDo === 0) { callback(null); }
                            } else {

                                var strQuery = "update " + self.dbname + "types set baseTypeId=" + xlateIth.newId + " where id=" + typeIth.id + ";";
                                // m_log("updating type with [name,id]=[" + typeIth.name + "," + typeIth.id + "]. Changing baseTypeId from " + typeIth.baseTypeId + " to " + xlateIth.newId + ".");
                                typeIth.baseTypeId = xlateIth.newId;
                                sql.queryWithCxn(passObj.connection, strQuery,
                                    function(err, rows, type) {

                                        try {
                                            if (err) { throw err; }

                                            if (--numUpdatesToDo === 0) { callback(null); }
                                        } catch (ex) { throw ex; }
                                    }
                                );
                            }
                        }
                    });
                    // If we fall through the xlate loop and haven't reached numUpdates === 0,
                    // it means the current typeIth doesn't need its baseTypeId updated.
                    // We can decrement and check for callback.
                    // TODO: what if a base type had been deleted? Don't we have to check for that and null out base type Id?
                    // Or will that be done client side?
                    if (--numUpdatesToDo === 0) { callback(null); }
                }
            });
        } catch (e) { callback(e); }
    }

    var m_doTypeArraysForSaveAs = function (connection, project, typeIth, req, res, callback) {

        try {

            var ordinal;

            m_log("Arrived in m_doTypeArraysForSaveAs.");

            // m_log("About to do arrays for type with id=" + typeIth.id + " and name=" + typeIth.name);

            var methodsCountdown = typeIth.methods.length;
            var propertiesCountdown = typeIth.properties.length;
            var eventsCountdown = typeIth.events.length;
            ordinal = 0;
            typeIth.methods.forEach(function(method) {

                // m_log("About to write method for type with id and name=" + typeIth.id + "," + typeIth.name );
                method.typeId = typeIth.id;
                method.ordinal = ordinal++;
                // m_log("Just set method.typeId=" + method.typeId + " and method.ordinal=" + method.ordinal);

                var guts = " SET typeId=" + method.typeId
                            + ",name='" + method.name + "'"
                            + ",ordinal=" + method.ordinal
                            + ",workspace='" + method.workspace + "'"
                            + ",imageId=" + method.imageId
                            + ",description='" + method.description + "'"
                            + ",parentMethodId=" + method.parentMethodId
                            + ",parentPrice=" + method.parentPrice
                            + ",priceBump=" + method.priceBump
                            + ",ownedByUserId=" + method.ownedByUserId
                            + ",public=" + method.public
                            + ",quarantined=" + method.quarantined
                            + ",methodTypeId=" + method.methodTypeId
                            + ",parameters='" + method.parameters + "'"
                            ;

                var strQuery = "insert " + self.dbname + "methods" + guts + ";";
                // m_log('Inserting method with ' + strQuery);
                sql.queryWithCxn(connection, strQuery,
                    function(err, rows, meth, queryBack) {

                        try {
                            if (err) { throw err; }
                            if (rows.length === 0) { throw new Error("Error inserting method into database"); }

                            meth.id = rows[0].insertId;

                            // If this is a System Type method, push onto passObj.project.script.
                            if (typeIth.ordinal === 10000) {
                                project.script.push(queryBack);
                            }

                            m_setUpAndDoTagsWithCxn(connection, res, meth.id, 'method', req.body.userName, meth.tags, meth.name, 
                                (typeIth.ordinal === 10000 ? project.script : null),
                                function() {

                                    methodsCountdown--;
                                    if (methodsCountdown === 0 && propertiesCountdown === 0 && eventsCountdown == 0) { callback(); }
                                }
                            );
                        } catch (em) {

                            throw em;
                        }
                    },
                    method
                );
            });

            ordinal = 0;
            typeIth.properties.forEach(function(property) {

                property.typeId = typeIth.id;
                property.ordinal = ordinal++;
                strQuery = "insert " + self.dbname + "propertys (typeId,propertyTypeId,name,initialValue,ordinal,isHidden) values (" + property.typeId + "," + property.propertyTypeId + ",'" + property.name + "','" + property.initialValue + "'," + property.ordinal + "," + property.isHidden + ");";
                
                // m_log('Inserting property with ' + strQuery);
                sql.queryWithCxn(connection, strQuery,
                    function(err, rows, prop, queryBack) {

                        try {
                            if (err) { throw err; }
                            if (rows.length === 0) { throw new Error("Error inserting property into database"); }

                            prop.id = rows[0].insertId;

                            // If this is a System Type property, push onto passObj.project.script.
                            if (typeIth.ordinal === 10000) {
                                project.script.push(queryBack);
                            }

                            propertiesCountdown--;
                            if (methodsCountdown === 0 && propertiesCountdown === 0 && eventsCountdown == 0) { callback(); }
                        
                        } catch (ep) {

                            throw ep;
                        }
                    },
                    property
                );

            });

            ordinal = 0;
            typeIth.events.forEach(function(event) {

                event.typeId = typeIth.id;
                event.ordinal = ordinal++;
                strQuery = "insert " + self.dbname + "events (typeId,name,ordinal) values (" + event.typeId + ",'" + event.name + "'," + event.ordinal + ");";
                // m_log('Inserting event with ' + strQuery);
                sql.queryWithCxn(connection, strQuery,
                    function(err, rows, ev, queryBack) {

                        try {
                            if (err) { throw err; }
                            if (rows.length === 0) { throw new Error("Error inserting method into database"); }

                            ev.id = rows[0].insertId;

                            // If this is a System Type event, push onto passObj.project.script.
                            if (typeIth.ordinal === 10000) {
                                project.script.push(queryBack);
                            }

                            eventsCountdown--;
                            if (methodsCountdown === 0 && propertiesCountdown === 0 && eventsCountdown == 0) { callback(); }
                        
                        } catch (ee) {

                            throw ee;
                        }
                    },
                    event
                );

            });
        } catch (e) {

            m_functionFinalCallback(e, res, null, null);
        }
    }

    var m_setUpAndDoTagsWithCxn = function(connection, res, itemId, strItemType, userName, strTags, strName, projectScript, callback) {

        try {
            
            m_log("in m_setUpAndDoTagsWithCxn");
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

            m_log("uniqueArray=" +  JSON.stringify(uniqueArray));

            var tagsCount = uniqueArray.length;
            for (var i = 0; i < uniqueArray.length; i++) {

                var tagIth = uniqueArray[i];
                var strSql = "call " + self.dbname + "doTag('" + tagIth + "'," + itemId + ",'" + strItemType + "');";
                m_log("Sending this sql: " + strSql);
                sql.queryWithCxn(connection, strSql, 
                    function(err, rows, tag, queryBack) {

                        try{
                            m_log("Back from call doTag()");
                            if (err) { throw err; }

                            if (projectScript !== null) {
                                // projectScript is passed in if it is meant for us to push the procedure call. So we will.
                                projectScript.push(queryBack);
                            }
                            if (--tagsCount === 0) { callback(null); }

                        } catch(et) {
                            throw et;
                        }
                    },
                    tagIth
                );
            }
        } catch(e) {

            callback(e);
        }
    }

    var m_functionFinalCallback = function (err, res, connection, project) {

        m_log('Reached m_functionFinalCallback. err is ' + (err ? 'non-null--bad.' : 'null--good--committing transaction.'));

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

                        if (project.hasOwnProperty("script")) {
                            // There's a sql script that needs to be written to project root.
                            // In the callback from that file creation, we'll return to the client.
                            m_log("About to write sql script containing " + project.script.length + " lines.");
                            m_functionWriteSqlScript(project, function(err) {

                                delete project.script;
                                if (err) {
                                    // Writing the file didn't work, but saving the project has already been committed to the DB.
                                    // We'll inform the user, but do so in a way that the project is saved.
                                    res.json({
                                        success: true,
                                        project: project,
                                        scriptSuccess: false
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
                }
            );
        }
    }

    var m_functionWriteSqlScript = function(project, callback) {

        try {

            var fs = require('fs');
            var os = require('os');

            // Finalize the procedure.
            project.script.push("end;");
            project.script.push("//");
            project.script.push("delimiter ;");
            project.script.push("call doSystemTypes();");
            project.script.push("drop procedure doSystemTypes;");

            fs.writeFile('ST.sql', project.script.join(os.EOL), function (err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        } catch(e) {
            callback(e);
        }
    }

    var m_log = function(msg) {
        console.log(' ');
        console.log(msg);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //                  Method to fetch lists for marketing page
    //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

   self.routeRetrieveProjectsForLists = function (req, res) {

        try {

            res.json({
                success: true,
                frees:
                {
                    items: [
                        {
                            name: "Game",
                            imgsrc: "/media/images/gameProject.png",
                            description: "This is the type of project that you will use most often. It teaches you to create a graphical game, one player for now with multi-player coming soon."
                        },
                        {
                            name: "Console",
                            imgsrc: "/media/images/consoleProject.png",
                            description: "This is the...."
                        },
                        {
                            name: "Web Site",
                            imgsrc: "/media/images/websiteProject.png",
                            description: "This is the...."
                        },
                        {
                            name: "HoloLens",
                            imgsrc: "/media/images/hololensProject.png",
                            description: "This is the...."
                        },
                        {
                            name: "Mapping",
                            imgsrc: "/media/images/mappingProject.png",
                            description: "This is the...."
                        }
                    ]
                },
                products:
                {
                    items: [
                        {
                            name: "Robot Mayhem",
                            level: "4",
                            difficulty: "4",
                            description: "Following all of the steps in this product will....",
                            imgsrc: "/media/images/robotmayhem.png",
                            price: "29.99"
                        }
                    ]
                },
                classes:
                {
                    items: [
                        {
                            name: "Object Oriented Concepts",
                            level: 3,
                            difficulty: 4,
                            description: "In this series of classes, students will learn....",
                            imgsrc: "/media/images/OOP.png",
                            price: 149.99,
                            location: "Weston Community Center~123 Main Street~Room 255~Westport, CT 06823",
                            instructor: "Peter Leventhal",
                            schedule: {
                                items: [
                                    {when: "Sunday, March 16, 2016, 7-8pm"},
                                    {when: "Sunday, March 23, 2016, 7-8pm"},
                                    {when: "Sunday, March 30, 2016, 7-8pm"},
                                    {when: "Sunday, March 37, 2016, 7-8pm"},
                                    {when: "Sunday, March 44, 2016, 7-8pm"},
                                    {when: "Sunday, March 51, 2016, 7-8pm"},
                                    {when: "Sunday, March 58, 2016, 7-8pm"},
                                ]
                            },
                            notes: "Please send your child with a laptop or tablet (iPad or ChromeBook), but if you can't, some will be available. Please call beforehand if you will need one.",
                            phone: "(203) 544-1966"
                        },
                        {
                            name: "Building a Web Site",
                            level: 2,
                            difficulty: 2,
                            description: "In this series of classes, students will learn....",
                            imgsrc: "/media/images/website.png",
                            price: 129.99,
                            location: "Weston Community Center~123 Main Street~Room 255~Westport, CT 06823",
                            instructor: "Linda Scarpetti",
                            schedule: {
                                items: [
                                    {when: "Sunday~March 16, 2016~6-7pm"},
                                    {when: "Sunday~March 23, 2016~6-7pm"},
                                    {when: "Sunday~March 30, 2016~6-7pm"},
                                    {when: "Sunday~March 37, 2016~6-7pm"},
                                    {when: "Sunday~March 44, 2016~6-7pm"},
                                    {when: "Sunday~March 51, 2016~6-7pm"},
                                    {when: "Sunday~March 58, 2016~6-7pm"},
                                ]
                            },
                            notes: "Please bring a laptop or tablet (iPad or ChromeBook), but if not, some will be available. Please call beforehand if you will need one.",
                            phone: "(203) 544-1966"
                        }
                    ]
                }
            });
        } catch(e) {

            res.json({success: false, message: e.message});
        }
    }
};