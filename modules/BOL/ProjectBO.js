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

                    var ex = sql.execute("select * from " + self.dbname + "types where comicId = " + comic.originalComicId + " order by ordinal asc;",
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

                                                console.log('typesCount has reached 0--fetching App Type systemBaseTypes.');

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
                                                parameters: rows.parameters
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
    //                  SaveProject
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

            // Muis important: the project's name must be unique to the user's projects, but can be the same as another user's project name.
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

                if (err) {

                    res.json({
                        success: false,
                        message: 'Could not get a database connection: ' + err.message
                    });
                } else {

                    m_log('Have a connection');
                    connection.beginTransaction(function(err) {

                        if (err) {

                            res.json({
                                success: false,
                                message: 'Could not "begin" database connection: ' + err.message
                            });
                            return;
                        }

                        m_log('Connection has a transaction');
                        if (typeOfSave === 'save') {

                            m_log('Going into m_functionSaveProject');
                            m_functionSaveProject(connection, req, res, project, m_functionFinalCallback);
                        
                        } else {    // 'saveAs'

                            m_log('Going into m_functionSaveProjectAs');
                            m_functionSaveProjectAs(connection, req, res, project, m_functionFinalCallback);
                        }
                    });
                }
            });
        } catch(e) {

            m_log('Save exception');
            res.json({
                success: false,
                message: 'Save failed. Error received: ' + e.message
            });
        }
    }

    var m_functionFinalCallback = function (err, res, connection, project) {

        m_log('Reached m_functionFinalCallback');
        if (err) {

            m_log('err is non-null: ' + err.message);
            res.json({
                success: false,
                message: 'Save Project failed with error: ' + err.message
            });
       } else {

            m_log('Success. Committing transaction.');

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

    var m_functionSaveProject = function (connection, req, res, project, callback) {

        try {

            // The following will delete the former project completely from the database using cascading delete.
            var strQuery = "delete from " + self.dbname + "projects where id=" + project.id + ";";
            m_log('Save project step 1; deleting with ' + strQuery);
            sql.queryWithCxn(connection, strQuery, 
                function(err, rows) {

                    if (err) { 

                        m_log('err back from delete project');
                        // Rollback has happened already.
                        throw err; 
                    }

                    m_log('No error in delete; moving into SaveAs');
                    // Now we can just INSERT the project as passed from the client side.
                    return callback(m_functionProjectSaveAsPart2(connection, req, res, project), res, connection, project);
                }
            );
        } catch (e) {

            callback(e, res, null, null);
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    //
    //                      SaveAs processing 
    //
    ///////////////////////////////////////////////////////////////////////////////////////////

    var m_functionSaveProjectAs = function (connection, req, res, project, callback) {
        
        // If we are just doing a SaveAs, we'll come in here with a connection that has a transaction started.

        try {

            // Look for and reject an attempt to add a 2nd project for same user with same name.
            var strQuery = "select count(*) as cnt from " + self.dbname + "projects where ownedByUserId=" + req.body.userId + " and name='" + project.name + "';";
            m_log('In SaveAs step 1; checking for name uniqueness with ' + strQuery);
            sql.queryWithCxn(connection, strQuery, 
                function(err, rows) {

                    if (err) { throw err; }

                    if (rows.length === 0) {

                        // throw new Error('Failed database action checking for duplicate project name.');
                        callback( new Error('Failed database action checking for duplicate project name.'), res, null, null);
                        return;

                    } else {

                        if (rows[0].cnt > 0) {

                            // throw new Error('You already have a project with that name.');
                            callback( new Error('You already have a project with that name.'), res, null, null);
                            return;

                        } else {
                            
                            m_log('Name for SaveAs is good');
                            project.public = 0;     // A saved-as project needs review by admins.
                            var exceptionRet = m_functionProjectSaveAsPart2(connection,req,res,project);
                            if (exceptionRet) { 
                                // throw exceptionRet; 
                                callback( exceptionRet, res, null, null); 
                                return;
                            }
                        }

                        callback(null, res, connection, project);
                    }
                }
            );
        } catch (e) {

            m_log('In catch in m_functionSaveProjectAs');
            callback(e, res, null, null);
        }
    }

    var m_functionProjectSaveAsPart2 = function (connection,req,res,project) {

        // If we came in doing a Save, we've deleted the old project and jumped in here to re-INSERT the project as sent from client-side.
        // If we came in doing a SaveAs, we stopped off at m_functionSaveProjectAs to check for name uniqueness.

        try {

            m_log('Continuing in m_functionProjectSaveAsPart2');
            var guts = " SET name='" + project.name + "'"
                + ",ownedByUserId=" + req.body.userId
                + ",public=" + project.public
                + ",quarantined=" + project.quarantined
                + ",parentPrice=" + project.parentPrice
                + ",parentProjectId=" + project.parentProjectId
                + ",priceBump=" + project.priceBump
                + ",imageId=" + project.imageId
                + ",isProduct=" + project.isProduct
                + ",description='" + project.description + "' ";

            verb = "INSERT ";

            var strQuery = "INSERT " + self.dbname + "projects" + guts + ";";

            m_log('Inserting project record with ' + strQuery);
            sql.queryWithCxn(connection, strQuery, 
                function(err, rows) {

                    if (err) { throw err; }

                    if (rows.length === 0) {

                        throw new Error('Error saving project to database.');
                    }

                    project.id = rows[0].insertId;

                    // Handle tags and project_tags.
                    m_log('Going to m_setUpAndDoTagsWithCxn for project');
                    m_setUpAndDoTagsWithCxn(connection, project.id, 'project', req.body.userName, project.tags, project.name, function(err) {

                        if (err) { throw err; }
                    });

                    m_log('Going to m_doComicsForSaveAs');
                    m_doComicsForSaveAs(connection, project, req, function(err) {

                        if (err) { throw err; }
                    }
                );

                return null;
            });
        } catch(e) {

            return e;
        }
    }

    var m_doComicsForSaveAs = function (connection, project, req, callback) {

        // Now the project has been inserted into the DB and its id is in project.id.
        // Also, a row has been added to resource and tags have been handled, too.

        // This routine will loop through the project's comics, saving (inserting) each while counting down to 0.
        // At that point it will call the Types routine.

        try {

            var comicsCountdown = project.comics.items.length;

            project.comics.items.forEach(function(comicIth) {

                comicIth.projectId = project.id;

                var strQuery = "insert " + self.dbname + "comics (projectId, ordinal, thumbnail, name, url) values (" + comicIth.projectId + "," + comicIth.ordinal + ",'" + comicIth.thumbnail + "','" + comicIth.name + "','" + comicIth.url + "');";
                m_log('In m_doComicsForSaveAs with ' + strQuery);
                sql.queryWithCxn(connection, strQuery,
                    function(err, rows) {

                        if (err) { throw err; }

                        if (rows.length === 0) {

                            callback(new Error("Error writing comic to database."));
                            return;
                        }

                        comicIth.id = rows[0].insertId;

                        if (--comicsCountdown === 0) {

                            m_log('Going to m_doTypesForSaveAs');
                            m_doTypesForSaveAs(connection, project, req, callback);
                        }
                    }
                );
            });
        } catch (e) {

            callback(e);
        }
    } 

    var m_doTypesForSaveAs = function (connection, project, req, callback) {

        // All comics have now been inserted and their ids are set in project.
        // Time to do types and then move on to type contents: methods, properties and events.
        // Types will require resource, tags and resources_tags. (As will methods.)

        try {

            var typesCountdown = 0;
            project.comics.items.forEach(function(comicIth) {

                typesCountdown += comicIth.types.items.length;
            });

            // To pass into m_doTypeArraysForSaveAs to save some time by taking advantage of this loop.
            // These will hold total counts across all comics/types.
            var methodsCountdown = 0,
                propertiesCountdown = 0,
                eventsCountdown = 0;
            project.comics.items.forEach(function(comicIth) {

                var ordinal = 0;
                comicIth.types.items.forEach(function(typeIth) {

                    methodsCountdown += typeIth.methods.length;
                    propertiesCountdown += typeIth.properties.length;
                    eventsCountdown += typeIth.events.length;

                    typeIth.comicId = comicIth.id;

                    var strQuery = "insert " + self.dbname + "types (name,isApp,imageId,ordinal,comicId,description,parentTypeId,parentPrice,priceBump,ownedByUserId,public,quarantined) values ('" + typeIth.name + "'," + (typeIth.isApp?1:0) + "," + typeIth.imageId + "," + (ordinal++) + "," + typeIth.comicId + ",'" + typeIth.description + "'," + typeIth.parentTypeId + "," + typeIth.parentPrice + "," + typeIth.priceBump + "," + req.body.userId + "," + typeIth.public + "," + typeIth.quarantined + ");";
                    m_log('Inserting type with ' + strQuery);
                    sql.queryWithCxn(connection, strQuery,
                        function(err, rows) {

                            if (err) { throw err; }

                            if (rows.length === 0) {

                                callback(new Error("Error writing type to database."));
                                return;
                            }

                            typeIth.id = rows[0].insertId;
                            m_log('Going to m_setUpAndDoTagsWithCxn for type with (new) id ' + typeIth.id);
                            m_setUpAndDoTagsWithCxn(connection, typeIth.id, 'type', req.body.userName, typeIth.tags, typeIth.name, function(err) {

                                if (err) {

                                    callback(err);
                                    return;

                                } else {

                                    if (--typesCountdown === 0) {

                                        m_log('Going to m_doTypeArraysForSaveAs');
                                        m_doTypeArraysForSaveAs(connection, project, req, methodsCountdown, propertiesCountdown, eventsCountdown, callback);
                                    }
                                }
                            });
                        }
                    );
                });
            });
        } catch (e) {

            callback(e);
        }
    }

    var m_doTypeArraysForSaveAs = function (connection, project, req, methodsCountdown, propertiesCountdown, eventsCountdown, callback) {

        try {

            var exceptionRet = null;
            var ordinal;

            project.comics.items.forEach(function(comicIth) {

                comicIth.types.items.forEach(function(typeIth) {

                    ordinal = 0;
                    typeIth.methods.forEach(function(method) {

                        method.typeId = typeIth.id;

                        var strQuery = "insert " + self.dbname + "methods (typeId,name,ordinal,workspace,imageId,description,parentMethodId,parentPrice,priceBump,ownedByUserId,public,quarantined) values (" + method.typeId + ",'" + method.name + "'," + (ordinal++) + ",'" + method.workspace + "'," + method.imageId + ",'" + method.description + "'," + method.parentMethodId + "," + method.parentPrice + "," + method.priceBump + "," + req.body.userId + "," + method.public + "," + method.quarantined + ");";
                        m_log('Inserting method with ' + strQuery);
                        sql.queryWithCxn(connection, strQuery,
                            function(err, rows) {

                                if (err) {

                                    callback(err);
                                    return;
                                }

                                if (rows.length === 0) {

                                    callback(new Error("Error inserting method into database"));
                                    return;
                                }

                                method.id = rows[0].insertId;
                                m_log('Going to do method tags');
                                m_setUpAndDoTagsWithCxn(connection, method.id, 'method', req.body.userName, method.tags, method.name, function(err) {

                                    if (err) {

                                        callback(err);
                                        return;
                                    }
                                });
                            }
                        );

                        methodsCountdown--;
                        if (methodsCountdown === 0 && propertiesCountdown === 0 && eventsCountdown == 0) {

                            callback(null);
                            return;
                        }
                    });

                    ordinal = 0;
                    typeIth.properties.forEach(function(property) {

                        property.typeId = typeIth.id;
                        strQuery = "insert " + self.dbname + "propertys (typeId,propertyTypeId,name,initialValue,ordinal,isHidden) values (" + property.typeId + "," + property.propertyTypeId + ",'" + property.name + "','" + property.initialValue + "'," + (ordinal++) + "," + property.isHidden + ");";
                        
                        m_log('Inserting property with ' + strQuery);
                        sql.queryWithCxn(connection, strQuery,
                            function(err, rows) {

                                if (err) {

                                    callback(err);
                                    return;
                                }

                                if (rows.length === 0) {

                                    callback(new Error("Error inserting property into database"));
                                    return;
                                }

                                property.id = rows[0].insertId;
                            }
                        );

                        propertiesCountdown--;
                        if (methodsCountdown === 0 && propertiesCountdown === 0 && eventsCountdown == 0) {

                            callback(null);
                            return;
                        }
                    });

                    ordinal = 0;
                    typeIth.events.forEach(function(event) {

                        event.typeId = typeIth.id;
                        strQuery = "insert " + self.dbname + "events (typeId,name,ordinal) values (" + event.typeId + ",'" + event.name + "," + (ordinal++) + ");";
                        m_log('Inserting event with ' + strQuery);
                        sql.queryWithCxn(connection, strQuery,
                            function(err, rows) {

                                if (err) {

                                    callback(err);
                                    return;
                                }

                                if (rows.length === 0) {

                                    callback(new Error("Error inserting method into database"));
                                    return;
                                }

                                event.id = rows[0].insertId;
                            }
                        );

                        eventsCountdown--;
                        if (methodsCountdown === 0 && propertiesCountdown === 0 && eventsCountdown == 0) {

                            callback(null);
                            return;
                        }
                    });
                });
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

    var m_setUpAndDoTagsWithCxn = function(connection, itemId, strItemType, userName, strTags, strName, callback) {

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

            m_doTagsWithCxn(connection, uniqueArray, itemId, strItemType, callback);

        } catch(e) {

            callback(e);
        }
    }

    var m_doTagsWithCxn = function(connection, tagArray, itemId, strItemType, callback){

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

                    if (err) {

                        callback(err);
                        return;
                    }

                    if (rows.length > 0) {

                        tagIds.push(rows[0].id);
                        if (--iCtr === 0){

                            callback(m_createTagJunctionsWithCxn(connection, itemId, strItemType, tagIds));
                            return;
                        }
                    } else {

                        strSql = "insert into " + self.dbname + "tags (description) values ('" + tag + "');";
                        sql.queryWithCxn(connection, strSql,
                            function(err, rows){

                                if (err) {

                                    callback(err);
                                    return;
                                }

                                if (rows.length === 0) {

                                    callback({message:'Could not insert tag into database.'});
                                    return;
                                
                                } else {

                                    tagIds.push(rows[0].insertId);
                                    if (--iCtr === 0){

                                        callback(m_createTagJunctionsWithCxn(connection, itemId, strItemType, tagIds));
                                        return;
                                    }
                                }
                            }
                        );
                    }
                }
            );
        });
    }

    var m_createTagJunctionsWithCxn = function(connection, itemId, strItemType, tagIds) {

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

                return err;
            }
        );
    }
};