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

            console.log("Entered ProjectBO/routeRetrieveProject with req.body=" + JSON.stringify(req.body));
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

            console.log('In m_functionRetProjDoComics');

            var ex = sql.execute("select * from " + self.dbname + "comics where projectId = " + project.originalProjectId + ";",
                function(rows)
                {

                    if (rows.length === 0) {

                        res.json({success: false, message: "Could not retrieve comics for project with id=" + req.body.id});
                        return;

                    } 

                    var comicsCounter = rows.length;
                    console.log('Got ' + comicsCounter + ' comics.');
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

                                console.log('strComicIds = "' + strComicIds + '"');
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

            console.log('In m_functionRetProjDoTypes with typesCount = ' + typesCount);

            var strTypeIds = '';    // Will be used for a count(*) query.

            project.comics.items.forEach(
                function(comic) {

                    // We originally has order by ordinal asc, but, probably due to async or something, this didn't always work, so,
                    // since we want them ordered that way, we'll sort them manually below when we have them all (before fetching system base types).
                    var ex = sql.execute("select * from " + self.dbname + "types where comicId = " + comic.originalComicId + ";",
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

                                                console.log('typesCount has reached 0--fetching systemBaseTypes.');

                                                // The sort referred to above.
                                                comic.types.items.sort(function(a,b){return a.ordinal - b.ordinal;});

                                                console.log('comic.types.items[0].baseTypeId=' + comic.types.items[0].baseTypeId);
                                                console.log('comic.types.items[0].name=' + comic.types.items[0].name);

                                                // Use the comic's App type (comic.types.items[0]). As such it will have a baseTypeId that is a systemBaseType's id.
                                                // Use the table systemBaseTypes to retrieve the chain of base Types for this App type and push each of them onto comic.types.items.

                                                var ex2 = sql.execute("select * from " + self.dbname + "types where id in (select parentId from " + self.dbname + "systemBaseTypes where id=" + comic.types.items[0].baseTypeId + " order by parentId asc)" + ";",
                                                    function(rows) {
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
                                                                    ordinal: 10000,                  // system base types must always have ordinal === 10000 for sorting and recognition purposes
                                                                    description: row.description,
                                                                    parentTypeId: row.parentTypeId,
                                                                    parentPrice: row.parentPrice,
                                                                    priceBump: row.priceBump,
                                                                    baseTypeId: row.baseTypeId, // may be null
                                                                    tags: '',
                                                                    properties: [],
                                                                    methods: [],
                                                                    events: []
                                                                };
                                                                strTypeIds = strTypeIds + ',' + baseType.id;
                                                                comic.types.items.push(baseType);

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

            console.log('In m_functionRetProjDoMethodsPropertiesEvents with mcnt=' + mcnt + ', pcnt=' + pcnt + ', ecnt=' + ecnt);
            project.comics.items.forEach(
                function(comic) {
                    // console.log('in comic ' + JSON.stringify(comic));
                    comic.types.items.forEach(
                        function(type) {
                            // console.log('in type ' + JSON.stringify(type));
                            var ex = sql.execute("select * from " + self.dbname + "methods where typeId =" + type.originalTypeId + "; select * from " + self.dbname + "propertys where typeId =" + type.originalTypeId + "; select * from " + self.dbname + "events where typeId =" + type.originalTypeId + ";",
                                function(rows){

                                    // console.log(' ');
                                    // console.log('************** Start of triple select ******************');
                                    // console.log(' ');
                                    // console.log(JSON.stringify(rows));
                                    // console.log(' ');
                                    // console.log('************** Start of triple select ******************');
                                    // console.log(' ');

                                    if (rows.length !== 3) {
                                        console.log('The triple select did not return rows.length === 3');
                                        res.json({
                                            success: false,
                                            message: 'Unable to retrieve selected project.'
                                        });
                                        return;
                                    }

                                    // methods
                                    rows[0].forEach(
                                        function(row) {
                                            // console.log('method row: ' + JSON.stringify(row));
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
                                                    m_log('Method fetched: ' + JSON.stringify(method));
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
                                            // console.log('property row: ' + JSON.stringify(row));
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
                                            // console.log('event row: ' + JSON.stringify(row));
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

        console.log('They have all reached 0. Returning project after sorting array by ordinal.');
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

        console.log("Entered ProjectBO/routeRetrieveType with req.body=" + JSON.stringify(req.body));
        // req.body.typeId

        try {

            var exceptionRet = sql.execute("select * from " + self.dbname + "types where id=" + req.body.typeId + ";",
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
                            ordinal: row.ordinal,
                            description: row.description,
                            parentTypeId: row.parentTypeId,
                            parentPrice: row.parentPrice,
                            priceBump: row.priceBump,
                            tags: '',
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

            console.log('In m_functionRetTypeDoMethodsPropertiesEvents with mcnt=' + mcnt + ', pcnt=' + pcnt + ', ecnt=' + ecnt);
            var ex = sql.execute("select * from " + self.dbname + "methods where typeId =" + type.originalTypeId + "; select * from " + self.dbname + "propertys where typeId =" + type.originalTypeId + "; select * from " + self.dbname + "events where typeId =" + type.originalTypeId + ";",
                function(rows){

                    // console.log(' ');
                    // console.log('************** Start of triple select ******************');
                    // console.log(' ');
                    // console.log(JSON.stringify(rows));
                    // console.log(' ');
                    // console.log('************** Start of triple select ******************');
                    // console.log(' ');

                    if (rows.length !== 3) {
                        console.log('The triple select did not return rows.length === 3');
                        res.json({
                            success: false,
                            message: 'Unable to retrieve selected type.'
                        });
                        return;
                    }

                    // methods
                    rows[0].forEach(
                        function(row) {
                            // console.log('method row: ' + JSON.stringify(row));
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
                                tags: ''
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
                            // console.log('property row: ' + JSON.stringify(row));
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
                            // console.log('event row: ' + JSON.stringify(row));
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

        console.log('They have all reached 0. Returning type after sorting arrays by ordinal.');
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

        console.log("Entered ProjectBO/routeRetrieveMethod with req.body=" + JSON.stringify(req.body));
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
                            tags: ''
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

                        m_log('Have a connection');

                        connection.beginTransaction(function(err) {

                            try {
                                if (err) {

                                    throw new Error('Could not "begin" database connection: ' + err.message);
                                
                                } else {

                                    m_log('Connection has a transaction');

                                    if (typeOfSave === 'save') {

                                        m_log('Going into m_functionSaveProject');
                                        m_functionSaveProject(connection, req, res, project);
                                    
                                    } else {    // 'saveAs'

                                        m_log('Going into m_functionSaveProjectAs');
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

            m_log('Top level exception saving project');
            m_functionFinalCallback(new Error("Database failure"), res, null, null);
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

                        res.json({
                            success: true,
                            project: project
                        });
                    }
                }
            );
        }
    }

    var m_log = function(msg) {

        console.log(' ');
        console.log(msg);
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

            m_log('Save project step 1; deleting old version with ' + strQuery);
            
            sql.queryWithCxn(connection, 
                strQuery, 
                function(err, rows) {

                    try {
                        if (err) { 

                            m_log('err back from delete project');
                            
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
            
            m_log('In SaveAs step 1; checking for name uniqueness with ' + strQuery);
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
                                
                                m_log('Name for SaveAs is good');

                                project.public = 0;                 // A saved-as project needs review by an admin or instructor.
                                m_functionProjectSaveAsPart2(connection, req, res, project);
                            }
                        }
                    } catch (e1) {

                        m_functionFinalCallback(e1, res, null, null);
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
                + ",description='" + project.description + "' ";

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
                        m_log('Going to m_setUpAndDoTagsWithCxn for project');
                        m_setUpAndDoTagsWithCxn(connection, res, project.id, 'project', req.body.userName, project.tags, project.name,
                            function() {

                                m_log('Going to m_saveComicsWithCxn');
                                m_saveComicsWithCxn(connection, req, res, project);
                            }
                        );
                    } catch (e1) {

                        m_functionFinalCallback(e1, res, null, null);
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
            var totalNumTypesExclSystemBaseTypes = 0;

            project.comics.items.forEach(
                function(comicIth) {

                    for (var i = 0; i < comicIth.types.items.length; i++) {

                        if (comicIth.types.items.ordinal !== 10000) { totalNumTypesExclSystemBaseTypes++; }
                    }
                    comicIth.projectId = project.id;

                    var strQuery = "insert " + self.dbname + "comics (projectId, ordinal, thumbnail, name, url) values (" + comicIth.projectId + "," + comicIth.ordinal + ",'" + comicIth.thumbnail + "','" + comicIth.name + "','" + comicIth.url + "');";
                    m_log('In m_saveComicsWithCxn with ' + strQuery);
                    sql.queryWithCxn(connection, 
                        strQuery,
                        function(err, rows, comic) {

                            try {
                                if (err) { throw err; }

                                if (rows.length === 0) { throw new Error("Error writing comic to database."); }

                                comic.id = rows[0].insertId;

                                if (--comicsCountdown === 0) {

                                    m_log('Going to m_saveTypesWithCxn with a total number of types to do=' + totalNumTypesExclSystemBaseTypes);

                                    m_saveTypesWithCxn(connection, req, res, project, totalNumTypesExclSystemBaseTypes);
                                }
                            } catch (e1) {

                                m_functionFinalCallback(e1, res, null, null);
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

    var m_saveTypesWithCxn = function (connection, req, res, project, totalNumTypesExclSystemBaseTypes) {

        // All comics have now been inserted and their ids are set in project.
        // Time to do types and then move on to type contents: methods, properties and events.
        // Types will require resource, tags and resources_tags. (As will methods.)

        // Here's the situation with base types:
        // (1) The comic's App type has baseTypeId = id of one of the system base types. This remains unchanged.
        // (2) System base types are recognized by having ordinal === 10000.
        // (3) Any new types will have id < 0 and this id will be unique. This is so that, if they are then
        //     used as a base type, the derived type will have an id for baseTypeId. So, after new types are written
        //     to the DB and given a real id (saving off their negative id), we need to loop through the other types
        //     and change any that where baseTypeId = the saved negative id.
        //
        // All this means several things:
        // (1) We should write out the App type so it gets ordinal 0.
        // (2) We should loop through all types in the comic and write the ones with id < 0. When we get a real id,
        //     we need to loop through all the types and update any whose baseTypeId matches the saved negative id.
        // (3) We should then loop through all the types again, skipping the App type and skipping any types with
        //     ordinal === 10000, and write the rest to the db.
        // (4) We also have to modify the Tags and type-sub-array routines to skip system base types.

        try {

            for (var j = 0; j < project.comics.items.length; j++) {

                var comicIth = project.comics.items[j];
                var ordinal = 0;
                var negTypeIdXlate = [];

                // We're going to make 3 whole loops through the comic's types, processing (or ignoring) the ones specific to that loop.
                for (var passNum = 1; passNum <=3; passNum++) { 

                    for (var i = 0; i < comicIth.types.items.length; i++) {

                        var typeIth = comicIth.types.items[i];
                        if (passNum === 1) {

                            // passNum = 1: just the type with isApp === true
                            if (typeIth.isApp) {

                                typeIth.comicId = comicIth.id;
                                typeIth.ordinal = ordinal++;

                                var strQuery = "insert " + self.dbname + "types (name,isApp,imageId,altImagePath,ordinal,comicId,description,parentTypeId,parentPrice,priceBump,ownedByUserId,public,quarantined,baseTypeId) values ('" + typeIth.name + "',1," + typeIth.imageId + ",'" + typeIth.altImagePath + "'," + typeIth.ordinal + "," + typeIth.comicId + ",'" + typeIth.description + "'," + typeIth.parentTypeId + "," + typeIth.parentPrice + "," + typeIth.priceBump + "," + req.body.userId + "," + typeIth.public + "," + typeIth.quarantined+ "," + typeIth.baseTypeId + ");";
                                m_log('Inserting type with ' + strQuery);
                                sql.queryWithCxn(connection, strQuery,
                                    function(err, rows, type) {

                                        try {
                                            if (err) { throw err; }

                                            if (rows.length === 0) { throw new Error("Error writing type to database."); }

                                            type.id = rows[0].insertId;
                                            var msg = 'Just wrote type[passNum 1]: (' + type.id + ',' + type.name + ',' + type.ordinal + ')';
                                            m_log(msg);
                                            m_log('Going to m_setUpAndDoTagsWithCxn for type with (new) id ' + type.id);
                                            m_setUpAndDoTagsWithCxn(connection, res, type.id, 'type', req.body.userName, type.tags, type.name,
                                                function() {

                                                    m_log('Going to m_doTypeArraysForSaveAs from passNum=1');
                                                    m_doTypeArraysForSaveAs(connection, project, type, req, res, --totalNumTypesExclSystemBaseTypes);
                                                }
                                            );
                                        } catch (e1) {

                                            m_functionFinalCallback(e1, res, null, null);
                                        }
                                    },
                                    typeIth
                                );
                            }
                        } else if (passNum === 2) {

                            // passNum = 2: any types with id < 0, building a correspondance array
                            if (typeIth.id < 0) {

                                typeIth.comicId = comicIth.id;
                                typeIth.ordinal = ordinal++;

                                var strQuery = "insert " + self.dbname + "types (name,isApp,imageId,altImagePath,ordinal,comicId,description,parentTypeId,parentPrice,priceBump,ownedByUserId,public,quarantined) values ('" + typeIth.name + "',0," + typeIth.imageId + ",'" + typeIth.altImagePath + "'," + typeIth.ordinal + "," + typeIth.comicId + ",'" + typeIth.description + "'," + typeIth.parentTypeId + "," + typeIth.parentPrice + "," + typeIth.priceBump + "," + req.body.userId + "," + typeIth.public + "," + typeIth.quarantined + ");";
                                m_log('Inserting type with ' + strQuery);
                                sql.queryWithCxn(connection, strQuery,
                                    function(err, rows, type) {

                                        try {
                                            if (err) { throw err; }

                                            if (rows.length === 0) { throw new Error("Error writing type to database."); }

                                            // Add to correspondance array.
                                            negTypeIdXlate.push({negId:type.id, dbId:rows[0].insertId});

                                            type.id = rows[0].insertId;
                                            var msg = 'Just wrote type[passNum 2]: (' + type.id + ',' + type.name + ',' + type.ordinal + ')';
                                            m_log(msg);
                                            m_log('Going to m_setUpAndDoTagsWithCxn for type with (new) id ' + type.id);
                                            m_setUpAndDoTagsWithCxn(connection, res, type.id, 'type', req.body.userName, type.tags, type.name,
                                                function() {

                                                    m_log('Going to m_doTypeArraysForSaveAs from passNum=2');
                                                    m_doTypeArraysForSaveAs(connection, project, type, req, res, --totalNumTypesExclSystemBaseTypes);
                                                }
                                            );
                                        } catch (e2) {

                                            m_functionFinalCallback(e2, res, null, null);
                                        }
                                    },
                                    typeIth
                                );
                            }
                        } else {

                            // passNum = 3: the rest of the types where ordinal !== 10000, id >= 0, !isAPP. If baseTypeId !== 10000 and < 0, look it up in the correspondance array and set it before writing to the DB.
                            if (typeIth.ordinal !== 10000 && !typeIth.isApp && typeIth.id >= 0) {

                                typeIth.comicId = comicIth.id;
                                typeIth.ordinal = ordinal++;

                                // If this type has a non-null, negative baseTypeId, find correct Id in negTypeIdXlate and update it.
                                if (typeIth.baseTypeId && typeIth.baseTypeId < 0) {

                                    var foundBase = false;
                                    for (var j = 0; j < negTypeIdXlate.length; j++) {

                                        if (negTypeIdXlate.negId === typeIth.baseTypeId) {

                                            foundBase = true;
                                            typeIth.baseTypeId = negTypeIdXlate.dbId;
                                            break;
                                        }
                                    }
                                    if (!foundBase) {

                                        // It might have been deleted. Just null out baseTypeId.
                                        typeIth.baseTypeId = null;
                                    }
                                }

                                var strQuery = "insert " + self.dbname + "types (name,isApp,imageId,altImagePath,ordinal,comicId,description,parentTypeId,parentPrice,priceBump,ownedByUserId,public,quarantined,baseTypeId) values ('" + typeIth.name + "',0," + typeIth.imageId + ",'" + typeIth.altImagePath + "'," + typeIth.ordinal + "," + typeIth.comicId + ",'" + typeIth.description + "'," + typeIth.parentTypeId + "," + typeIth.parentPrice + "," + typeIth.priceBump + "," + req.body.userId + "," + typeIth.public + "," + typeIth.quarantined+ "," + typeIth.baseTypeId + ");";
                                m_log('Inserting type with ' + strQuery);
                                sql.queryWithCxn(connection, strQuery,
                                    function(err, rows, type) {

                                        try {
                                            if (err) { throw err; }

                                            if (rows.length === 0) { throw new Error("Error writing type to database."); }

                                            type.id = rows[0].insertId;
                                            var msg = 'Just wrote type[passNum 3]: (' + type.id + ',' + type.name + ',' + type.ordinal + ')';
                                            m_log(msg);
                                            m_log('Going to m_setUpAndDoTagsWithCxn for type with (new) id ' + type.id);
                                            m_setUpAndDoTagsWithCxn(connection, res, type.id, 'type', req.body.userName, type.tags, type.name,
                                                function() {

                                                    m_log('Going to m_doTypeArraysForSaveAs from passNum=3');
                                                    m_doTypeArraysForSaveAs(connection, project, type, req, res, --totalNumTypesExclSystemBaseTypes);
                                                }
                                            );
                                        } catch (e3) {

                                            m_functionFinalCallback(e3, res, null, null);
                                        }
                                    },
                                    typeIth
                                );
                            }
                        }
                    }
                }
            }
        } catch (e) {

            m_functionFinalCallback(e, res, null, null);
        }
    }

    var m_doTypeArraysForSaveAs = function (connection, project, typeIth, req, res, iWhenZeroCanReturn) {

        try {

            var ordinal;
            m_log("About to do arrays for type with id=" + typeIth.id + " and name=" + typeIth.name);

            var methodsCountdown = typeIth.methods.length;
            var propertiesCountdown = typeIth.properties.length;
            var eventsCountdown = typeIth.events.length;
            ordinal = 0;
            typeIth.methods.forEach(function(method) {

                m_log("About to write method for type with id and name=" + typeIth.id + "," + typeIth.name );
                method.typeId = typeIth.id;
                method.ordinal = ordinal++;
                m_log("Just set method.typeId=" + method.typeId + " and method.ordinal=" + method.ordinal);

                var strQuery = "insert " + self.dbname + "methods (typeId,name,ordinal,workspace,imageId,description,parentMethodId,parentPrice,priceBump,ownedByUserId,public,quarantined,methodTypeId,parameters) values (" + method.typeId + ",'" + method.name + "'," + method.ordinal + ",'" + method.workspace + "'," + method.imageId + ",'" + method.description + "'," + method.parentMethodId + "," + method.parentPrice + "," + method.priceBump + "," + req.body.userId + "," + method.public + "," + method.quarantined + "," + method.methodTypeId + ",'" + method.parameters + "');";
                m_log('Inserting method with ' + strQuery);
                sql.queryWithCxn(connection, strQuery,
                    function(err, rows, meth) {

                        try {
                            if (err) { throw err; }

                            if (rows.length === 0) { throw new Error("Error inserting method into database"); }

                            meth.id = rows[0].insertId;
                            m_log('Going to do method tags');
                            m_setUpAndDoTagsWithCxn(connection, res, meth.id, 'method', req.body.userName, meth.tags, meth.name,
                                function() {

                                    methodsCountdown--;
                                    if (methodsCountdown === 0 && propertiesCountdown === 0 && eventsCountdown == 0 && iWhenZeroCanReturn) {

                                        m_functionFinalCallback(null, res, connection, project);
                                    }
                                }
                            );
                        } catch (em) {

                            m_functionFinalCallback(em, res, null, null);
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
                
                m_log('Inserting property with ' + strQuery);
                sql.queryWithCxn(connection, strQuery,
                    function(err, rows, prop) {

                        try {
                            if (err) { throw err; }

                            if (rows.length === 0) { throw new Error("Error inserting property into database"); }

                            prop.id = rows[0].insertId;
                            propertiesCountdown--;
                            if (methodsCountdown === 0 && propertiesCountdown === 0 && eventsCountdown == 0 && iWhenZeroCanReturn) {

                                m_functionFinalCallback(null, res, connection, project);
                            }
                        } catch (ep) {

                            m_functionFinalCallback(ep, res, null, null);
                        }
                    },
                    property
                );

            });

            ordinal = 0;
            typeIth.events.forEach(function(event) {

                event.typeId = typeIth.id;
                event.ordinal = ordinal++;
                strQuery = "insert " + self.dbname + "events (typeId,name,ordinal) values (" + event.typeId + ",'" + event.name + "," + event.ordinal + ");";
                m_log('Inserting event with ' + strQuery);
                sql.queryWithCxn(connection, strQuery,
                    function(err, rows, ev) {

                        try {
                            if (err) { throw err; }

                            if (rows.length === 0) { throw new Error("Error inserting method into database"); }

                            ev.id = rows[0].insertId;
                            eventsCountdown--;
                            if (methodsCountdown === 0 && propertiesCountdown === 0 && eventsCountdown == 0 && iWhenZeroCanReturn) {

                                m_functionFinalCallback(null, res, connection, project);
                            }
                        } catch (ee) {

                            m_functionFinalCallback(ee, res, null, null);
                        }
                    },
                    event
                );

            });
        } catch (e) {

            callback(e);
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //                  Utility method(s) for save routes
    //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var m_setUpAndDoTagsWithCxn = function(connection, res, itemId, strItemType, userName, strTags, strName, callback) {

        try {
            
            m_log("In m_setUpAndDoTagsWithCxn with for type " + strItemType + " and itemId=" + itemId);

            // Start tagArray with resource type description, userName and resource name (with internal spaces replaced by '_').
            var tagArray = [];
            tagArray.push(strItemType);
            tagArray.push(userName);
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

            m_doTagsWithCxn(connection, res, uniqueArray, itemId, strItemType, callback);

        } catch(e) {

            m_functionFinalCallback(e, res, null, null);
        }
    }

    var m_doTagsWithCxn = function(connection, res, tagArray, itemId, strItemType, callback){

        try {
            var tagIds = [];
            var iCtr = tagArray.length;

            // For each string in tagArry:
            //      if it already exists in table tags, push its id onto tagIds.
            //      else, add it and push the new array.
            // Then write as many records to strItemType_tags using itemId and tagIds[i] as called for.

            m_log('**In m_doTagsWithCxn with tagArray = ' + tagArray);
            tagArray.forEach(function(tag) {

                var strSql = "select id from " + self.dbname + "tags where description='" + tag + "';";
                sql.queryWithCxn(connection, strSql,
                    function(err, rows){

                        try{
                            if (err) { m_functionFinalCallback(err, res, null, null); }

                            if (rows.length > 0) {

                                tagIds.push(rows[0].id);
                                if (--iCtr === 0){

                                    m_createTagJunctionsWithCxn(connection, res, itemId, strItemType, tagIds, callback);
                                }
                            } else {

                                strSql = "insert into " + self.dbname + "tags (description) values ('" + tag + "');";
                                sql.queryWithCxn(connection, strSql,
                                    function(err, rows){

                                        try {
                                            if (err) { m_functionFinalCallback(err, res, null, null); }

                                            if (rows.length === 0) { m_functionFinalCallback(new error('Could not insert tag into database.'), res, null, null); }

                                            tagIds.push(rows[0].insertId);
                                            if (--iCtr === 0){

                                                m_createTagJunctionsWithCxn(connection, res, itemId, strItemType, tagIds, callback);
                                            }
                                        } catch (e2) {

                                            m_functionFinalCallback(e2, res, null, null);
                                        }
                                    }
                                );
                            }
                        } catch (e1) {

                            m_functionFinalCallback(e1, res, null, null);
                        }
                    }
                );
            });
        } catch (e) {

            m_functionFinalCallback(e, res, null, null);
        }
    }

    var m_createTagJunctionsWithCxn = function(connection, res, itemId, strItemType, tagIds, callback) {

        try {
            var strSql = "insert into " + self.dbname + strItemType + "_tags (" + strItemType + "Id,tagId) values";
            for (var j = 0; j < tagIds.length; j++) {

                strSql = strSql + "(" + itemId + "," + tagIds[j].toString() + ")";
                if (j !== tagIds.length - 1){

                    strSql = strSql + ",";
                }
            }

            strSql = strSql + ";";
            m_log('About to write to ' + strItemType + '_tags with query: ' + strSql);
            sql.queryWithCxn(connection, strSql,
                function(err, rows){

                    if (err) { m_functionFinalCallback(err, res, null, null); }
                    callback();
                }
            );
        } catch (e) {

            m_functionFinalCallback(e, res, null, null);
        }
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