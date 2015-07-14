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
    self.routeRetrieveCountUsersProjects = function (req, res) {

        console.log("Entered ProjectBO/routeRetrieveCountUsersProjects with req.body=" + JSON.stringify(req.body));
        // req.body.userId

        try {

            var exceptionRet = sql.execute("select count(*) as cnt from " + self.dbname + "projects where ownedByUserId=" + req.body.userId,
                function(rows){

                    if (rows.length !== 1) {

                        res.json({
                            success: false,
                            message: "Could not retrieve project."
                        });
                    } else {

                        res.json({
                            success: true,
                            cnt: rows[0].cnt
                        });
                    }
                },
                function(strError){

                    res.json({
                        success: false,
                        message: strError
                    });
                }
            );
            if (exceptionRet) {

                res.json({
                    success: false,
                    message: exceptionRet.message
                });
            }

        } catch(e) {

            res.json({
                success: false,
                message: e.message
            });
        }
    }

    self.routeRetrieveProject = function (req, res) {

        try {

            console.log("Entered ProjectBO/routeRetrieveProject with req.body=" + JSON.stringify(req.body));
            // req.body.projectId
            // req.body.userName

            var ex = sql.execute("select * from " + self.dbname + "projects where id = " + req.body.projectId + ";",
                function(rows) {

                    if (rows.length !== 1) {

                        res.json({success:false, message: "Could not retrieve project with id=" + req.body.id});

                    } else {

                        var row = rows[0];
                        var project = 
                        {
                            id: row.id,
                            name: row.name,
                            createdByUserId: row.createdByUserId,
                            price: row.price,
                            imageResourceId: row.imageResourceId,
                            description: row.description,
                            ownedByUserId: row.ownedByUserId,
                            classOrProductId: row.classOrProductId,
                            tags: '',
                            isDirty: 1,
                            comics:
                            {
                                items: []
                            }
                        };

                        m_functionFetchTags(
                            project.id, 
                            3, 
                            req.body.userName, 
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

            var ex = sql.execute("select * from " + self.dbname + "comics where classOrProductId = " + project.classOrProductId + " order by ordinal asc;",
                function(rows)
                {

                    if (rows.length === 0) {

                        res.json({success: false, message: "Could not retrieve project with id=" + req.body.id});
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
                                classOrProductId: row.classOrProductId,
                                ordinal: row.ordinal,
                                imageResourceId: row.imageResourceId,
                                name: row.name,
                                comicPanels: 
                                {
                                    items: []
                                },
                                types: 
                                {
                                    items: []
                                }
                            };

                            if (strComicIds.length === 0)
                                strComicIds = comic.id.toString();
                            else
                                strComicIds = strComicIds + ',' + comic.id;

                            project.comics.items.push(comic);

                            if (--comicsCounter === 0) {

                                console.log('strComicIds = "' + strComicIds + '"');
                                var ex2 = sql.execute("select count(*) as cnt from " + self.dbname + "comicPanels where comicId in (" + strComicIds + ");",
                                    function(rows){

                                        if (rows.length !== 1) {

                                            res.json({success:false, message: "Could not retrieve project with id=" + req.body.id});
                                            return;
                                        }

                                        m_functionRetProjDoComicPanels(req, res, project, rows[0].cnt);
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

    var m_functionRetProjDoComicPanels = function(req, res, project, comicPanelsCount) {

        try {

            console.log('In m_functionRetProjDoComicPanels with comicPanelsCount=' + comicPanelsCount);

            project.comics.items.forEach(
                function(comic) {

                    var ex = sql.execute("select * from " + self.dbname + "comicPanels where comicId = " + comic.id + " order by ordinal asc;",
                        function(rows) {

                            if (rows.length === 0) {

                                res.json({
                                    success: false,
                                    message: 'Unable to retrieve selected project.'
                                });
                                return;
                            }

                            rows.forEach(
                                function(row) {

                                    var comicPanel =
                                    {
                                        id: row.id,
                                        ordinal: row.ordinal,
                                        name: row.name,
                                        url: row.url,
                                        description: row.description,
                                        thumbnail: row.thumbnail
                                    };
                                    comic.comicPanels.items.push(comicPanel);
                                    
                                    if (--comicPanelsCount === 0) {

                                        var ex2 = sql.execute("select count(*) as cnt from " + self.dbname + "types where projectId = " + project.id + ";",
                                            function(rows) {

                                                if (rows.length !== 1) {

                                                    res.json({success:false, message: "Could not retrieve project with id=" + req.body.id});
                                                    return;
                                                }

                                                m_functionRetProjDoTypes(req, res, project, rows[0].cnt);
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

    var m_functionRetProjDoTypes = function(req, res, project, typesCount) {

        try {

            console.log('In m_functionRetProjDoTypes with typesCount = ' + typesCount);

            project.comics.items.forEach(
                function(comic) {

                    var ex = sql.execute("select * from " + self.dbname + "types where comicId = " + comic.id + " and projectId = " + project.id + " order by ordinal asc;",
                        function(rows) {

                            // At least for now there can be no types in a comic:
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
                                        name: row.name,
                                        isApp: row.isApp === 1 ? true : false,
                                        imageResourceId: row.imageResourceId,
                                        ordinal: row.ordinal,
                                        tags: '',
                                        properties: [],
                                        methods: [],
                                        events: []
                                    };

                                    // m_functionFetchTags(
                                    //     type.id,
                                    //     5,
                                    //     req.body.userName,
                                    //     function(tags) {

                                    //         type.tags = tags;

                                    //         // methods, etc. go here.

                                            // comic.types.items.push(type);
                                    //     }
                                    // );

                                    comic.types.items.push(type);
                                    if (--typesCount === 0) {

                                        res.json({
                                            success: true,
                                            project: project
                                        });
                                        return;
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

//     self.routeRetrieveProject = function (req, res) {

//         console.log("Entered ProjectBO/routeRetrieveProject with req.body=" + JSON.stringify(req.body));
//         // req.body.projectId
//         // req.body.userName

//         // (1) We were given projectId. Read in that project's table row.
//         //  (1.1) Retrieve the project's tags.
//         // (2) Read in comics[] with comics[i].classOrProductId === project.classOrProductId. 
//         // (3) For each comic in comics read comicPanels[] with comicPanels[j].comicId === comics[i].id. Add to each comic in comics. This is basically a side step.
//         // (4) For each comic in comics read types[] with types[k].comicId === comics[i].id && types[k].projectId === project.id.
//         //  (4.1) For each Type read its tags
//         // (5-7) Read each type's methods, properties and events.
//         //  (5.1) For each method read its tags.
//         // (8) Then return the complete project javascript object.

//         try {

//         // (1)
//             var ex = sql.execute("select * from " + self.dbname + "projects where id = " + req.body.projectId + ";",
//                 function(rows) {

//                     if (rows.length !== 1) {

//                         res.json({success:false, message: "Could not retrieve project with id=" + req.body.id});

//                     } else {
// console.log('Got Project');
//                         var row = rows[0];
//                         var project = 
//                         {
//                             id: row.id,
//                             name: row.name,
//                             createdByUserId: row.createdByUserId,
//                             price: row.price,
//                             imageResourceId: row.imageResourceId,
//                             description: row.description,
//                             ownedByUserId: row.ownedByUserId,
//                             classOrProductId: row.classOrProductId,
//                             tags: '',
//                             isDirty: 1,
//                             comics:
//                             {
//                                 items: []
//                             }
//                         };

//         // (1.1)
//                         m_functionFetchTags(
//                             project.id, 
//                             3, 
//                             req.body.userName, 
//                             function(tags)  {

//                                 project.tags = tags;
// console.log('Got Project tags: "' + tags + '"');
//         // (2)
//                                 ex = sql.execute("select * from " + self.dbname + "comics where classOrProductId = " + project.classOrProductId + " order by ordinal asc;",
//                                     function(rows)
//                                     {

//                                         if (rows.length === 0) {

//                                             res.json({success:false, message: "Could not retrieve project with id=" + req.body.id});

//                                         } else {

//                                             var comicsCounter = rows.length;

// console.log('Got ' + rows.length + ' comics');
//                                             rows.forEach(
//                                                 function(row)
//                                                 {

//                                                     var comic = 
//                                                     {
//                                                         id: row.id,
//                                                         classOrProductId: row.classOrProductId,
//                                                         ordinal: row.ordinal,
//                                                         imageResourceId: row.imageResourceId,
//                                                         name: row.name,
//                                                         comicPanels: 
//                                                         {
//                                                             items: []
//                                                         },
//                                                         types: 
//                                                         {
//                                                             items: []
//                                                         }
//                                                     };

//                                                     project.comics.items.push(comic);
//         // (3-4)
//                                                     ex = sql.execute("select * from comicPanels where comicId = " + comic.id + " order by ordinal asc; select * from types where comicId = " + comic.id + " and projectId = " + project.id + " order by ordinal asc;",
//                                                         function(rows){

//                                                             // Result of comicPanels select comes back in rows[0][]; result of types query comes back in rows[1][].
//                                                             if (rows.length !== 2 || rows[0].length === 0 || rows[1].length === 0) {

//                                                                 res.json({success:false, message: "Could not retrieve project with id=" + req.body.id});

//                                                             } else {

// console.log('Got ' + rows[0].length + ' comicPanels');
//                                                                 rows[0].forEach(
//                                                                     function(row){

//                                                                         var comicPanel =
//                                                                         {
//                                                                             id: row.id,
//                                                                             ordinal: row.ordinal,
//                                                                             name: row.name,
//                                                                             url: row.url,
//                                                                             description: row.description,
//                                                                             thumbnail: row.thumbnail
//                                                                         };
//                                                                         comic.comicPanels.items.push(comicPanel);
//                                                                     }
//                                                                 );
                                                                
//                                                                 var typesCounter = rows[1].length;                    
// console.log('Got ' + rows[1].length + ' types');
//                                                                 rows[1].forEach(
//                                                                     function(row){

//                                                                         var type = 
//                                                                         {
//                                                                             id: row.id,
//                                                                             name: row.name,
//                                                                             isApp: row.isApp === 1 ? true : false,
//                                                                             imageResourceId: row.imageResourceId,
//                                                                             ordinal: row.ordinal,
//                                                                             tags: '',
//                                                                             properties: [],
//                                                                             methods: [],
//                                                                             events: []
//                                                                         };
//         // (4.1)
//                                                                         m_functionFetchTags(
//                                                                             type.id,
//                                                                             5,
//                                                                             req.body.userName,
//                                                                             function(tags) {

//                                                                                 type.tags = tags;
// console.log('type=' + JSON.stringify(type));

//                                                                                 // methods, etc. go here.

//                                                                                 comic.types.items.push(type);
//                                                                             }
//                                                                         );
//                                                                     }
//                                                                 );
//                                                             }
//                                                         },
//                                                         function(strError){

//                                                             res.json( {success: false, message: strError} );

//                                                         }
//                                                     );
//                                                     if (ex) {

//                                                         res.json({ success: false, message: ex.message });
//                                                     }

//                                                     if (--comicsCounter === 0) {

//                                                         res.json({
//                                                             success: true,
//                                                             project: project
//                                                         });
//                                                     }
//                                                 }
//                                             );
//                                         }
//                                     },
//                                     function(strError){

//                                         res.json( {success:false, message: strError} );
//                                     }
//                                 );
//                                 if (ex) {

//                                     res.json({ success: false, message: ex.message });
//                                 }
//                             }
//                         );
//                     }
//                 },
//                 function(strError){

//                     res.json( {success:false, message: strError} );
//                 }
//             );
//             if (ex) {

//                 res.json({ success: false, message: ex.message });
//             }
//         } catch(e) {

//             res.json({
//                 success: false,
//                 message: e.message
//             });
//         }
//     }

            // var method = 
            // { 
            //     name: "", 
            //     workspace: "", 
            //     id: 0,
            //     tags: '',
            //     imageResourceId: 0,
            //     createdByUserId: 0,
            //     price: 0,
            //     ordinal: 0,
            //     description: ""
            // };

            // var property = 
            // {
            //     name: "",
            //     id: 0,
            //     ordinal: 0,
            //     propertyTypeId: 0,
            //     initialValue: ""
            // };

            // var event = 
            // {
            //     name: "",
            //     id: 0,
            //     ordinal: 0
            // };

            // var ex = sql.execute("select count(t.id) as cnt from " + self.dbname + "types t where t.comicId in (select id from " + self.dbname + "comics where projectId=" + req.body.projectId + ");",
            //     function(rows){

            //         if (rows.length !== 1) {

            //             res.json({
            //                 success: false,
            //                 message: "Could not retrieve project."
            //             });
            //         } else {

            //             typesCtr = rows[0].cnt;

            //             var exceptionRet = sql.execute("select * from " + self.dbname + "projects where id=" + req.body.projectId + ";",
            //                 function(rows){

            //                     if (rows.length !== 1) {

            //                         res.json({
            //                             success: false,
            //                             message: 'Could not retrieve project from database.'
            //                         });
            //                     } else {

            //                         project.name = rows[0].name;
            //                         project.id = rows[0].id;
            //                         project.description = rows[0].description;
            //                         project.imageResourceId = rows[0].imageResourceId;
            //                         project.price = rows[0].price;
            //                         project.createdByUserId = rows[0].createdByUserId;
            //                         project.isDirty = false;
            //                         m_functionFetchTags(project.id, 3, req.body.userName, function(tags){

            //                             project.tags = tags;

            //                             // Now comics.
            //                             exceptionRet = sql.execute("select * from " + self.dbname + "comics where projectId=" + project.id + " order by ordinal asc;",
            //                                 function(rows){

            //                                     rows.forEach(function(row) {

            //                                         var comicItem = JSON.parse(JSON.stringify(comic));  // clone comic.
            //                                         comicItem.imageResourceId = row.imageResourceId;
            //                                         comicItem.id = row.id;
            //                                         comicItem.name = row.name;
            //                                         comicItem.ordinal = row.ordinal;
            //                                         m_functionFetchTags(comicItem.id, 4, req.body.userName, function(tags){

            //                                             comicItem.tags = tags;

            //                                             // Now types.
            //                                             exceptionRet = sql.execute("select * from " + self.dbname + "types where comicId=" + comicItem.id + " order by ordinal asc;",
            //                                                 function(rows){

            //                                                     rows.forEach(function(row) {

            //                                                         var typeItem = JSON.parse(JSON.stringify(type));    // clone type.
            //                                                         typeItem.isApp = row.isApp;
            //                                                         typeItem.id = row.id;
            //                                                         typeItem.ordinal = row.ordinal;
            //                                                         typeItem.name = row.name;
            //                                                         typeItem.imageResourceId = row.imageResourceId;
            //                                                         var code = JSON.parse(row.jsonCode);
            //                                                         typeItem.properties = code.properties;
            //                                                         typeItem.methods = code.methods;
            //                                                         typeItem.events = code.events;
            //                                                         typeItem.dependencies = code.dependencies;
            //                                                         m_functionFetchTags(typeItem.id, 5, req.body.userName, function(tags){

            //                                                             typeItem.tags = tags;
                                                                        
            //                                                             comicItem.types.items.push(typeItem);

            //                                                             if (--typesCtr === 0) {

            //                                                                 res.json({
            //                                                                     success: true,
            //                                                                     project: project
            //                                                                 });
            //                                                                 return;
            //                                                             }
            //                                                         });
            //                                                     });
            //                                                 },
            //                                                 function(strError){

            //                                                     res.json({
            //                                                         success: false,
            //                                                         message: strError
            //                                                     });
            //                                                     return;
            //                                                 }
            //                                             );
            //                                             if (exceptionRet) {

            //                                                 res.json({
            //                                                     success: false,
            //                                                     message: exceptionRet.message
            //                                                 });
            //                                                 return;
            //                                             }
            //                                         });
            //                                         project.comics.items.push(comicItem);
            //                                     });
            //                                 },
            //                                 function(strError){

            //                                     res.json({
            //                                         success: false,
            //                                         message: strError
            //                                     });
            //                                     return;
            //                                 }
            //                             );
            //                             if (exceptionRet) {

            //                                 res.json({
            //                                     success: false,
            //                                     message: exceptionRet.message
            //                                 });
            //                                 return;
            //                             }
            //                         });
            //                     }
            //                 },
            //                 function(strError){

            //                     res.json({
            //                         success: false,
            //                         message: strError
            //                     });
            //                 }
            //             );
            //             if (exceptionRet) {

            //                 res.json({
            //                     success: false,
            //                     message: exceptionRet.message
            //                 });
            //             }
            //         }
            //     },
            //     function(strError){

            //         res.json({
            //             success: false,
            //             message: strError
            //         });
            //     }
            // );

    self.routeRetrieveType = function (req, res) {

        console.log("Entered ProjectBO/routeRetrieveType with req.body=" + JSON.stringify(req.body));
        // req.body.methodId
        // req.body.userName

        try {

            var type =
            {
                isApp: true,
                id: 0,
                ordinal: 0,
                tags: '',
                properties: [],
                methods: [{ name: "initialize", workspace: "", method: "" }],
                events: [],
                dependencies: [],
                name: "",
                imageResourceId: 0
            };

            var exceptionRet = sql.execute("select * from " + self.dbname + "types where id=" + req.body.typeId+ ";",
                function(rows){

                    if (rows.length !== 1) {

                        res.json({
                            success: false,
                            message: 'Could not retrieve type from database.'
                        });
                    } else {

                        var row = rows[0];
                        type.isApp = row.isApp;
                        type.id = row.id;
                        type.ordinal = row.ordinal;
                        type.name = row.name;
                        type.imageResourceId = row.imageResourceId;
                        var code = JSON.parse(row.jsonCode);
                        type.properties = code.properties;
                        type.methods = code.methods;
                        type.events = code.events;
                        type.dependencies = code.dependencies;
                        m_functionFetchTags(type.id, 5, req.body.userName, function(tags){

                            type.tags = tags;

                            res.json({
                                success: true,
                                type: type
                            });
                        });
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

    self.routeRetrieveMethod = function (req, res) {

        console.log("Entered ProjectBO/routeRetrieveMethod with req.body=" + JSON.stringify(req.body));
        // req.body.typeId
        // req.body.userName

        try {

            var method =
            {

            };

            var exceptionRet = sql.execute("select * from " + self.dbname + "methods where id=" + req.body.methodId+ ";",
                function(rows){

                    if (rows.length !== 1) {

                        res.json({
                            success: false,
                            message: 'Could not retrieve type from database.'
                        });
                    } else {

                        var row = rows[0];







                        m_functionFetchTags(method.id, 7, req.body.userName, function(tags){

                            method.tags = tags;

                            res.json({
                                success: true,
                                method: method
                            });
                        });
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

    self.routeSaveProject = function (req, res) {

        try {

            console.log("Entered ProjectBO/routeSaveProject with req.body=" + JSON.stringify(req.body));
            // req.body.userId
            // req.body.userName
            // req.body.projectJson : See NewProjectDialog.js for schema.

            // Important: All image resources have already been created or selected for the project, its comics and their types. (Or their defaults exist.)

            // Muis important: the project's name must be unique to within the user's projects, but can be the same as another user's project name.
            // This doesn't have to be checked for a typeOfSave === 'save'.

            var project = req.body.projectJson;
            var typeOfSave = (project.id === 0) ? 'saveNew' : (req.body.userId === project.createdByUserId) ? 'saveAs' : 'save';
            // typeOfSave info:
            //  saveNew INSERTs and has to insert id's into project, comics and types. And into their resources.
            //  saveAs does that and has to replace project.createdByUserId with req.body.userId.
            //  save does an UPDATE of the project, but comics and types may have been added, deleted or modified. They'll take more work.

            // 1. Add row to projects table. Save id in projectId. Add 'project' row to resources table pointing back to projectId. Save id in resourceId. Associate projectTags with resourceId.
            // 2. Loop (on i) through items in comics and for each:
            //      2a. Add row to comics table. Save id in comicId. Add 'comic' row to resources table pointing back to comicId. Save id in resourceId. Associate comicTags[i] with resourceId.
            //      2b. Loop (on j) through items in types and for each:
            //          2b1. Add row to types table. Save id in typeId. Add 'type' row to resources table pointing back to typeId. Save id in resourceId. Associate comicTags[i] with resourceId.

            var whereclause = "", 
                verb = "",
                sqlStmt = "";

            var guts = " SET name='" + project.name + "'"
                + ",createdByUserId=" + req.body.userId
                + ",price=" + project.price
                + ",imageResourceId=" + project.imageResourceId
                + ",description='" + project.description + "' ";

            if (typeOfSave === "save"){

                whereClause = " WHERE id=" + project.id;
                verb = "UPDATE ";
                
                m_functionProjectSavePart2(req,res,typeOfSave,project,verb,guts,whereclause);

            } else {

                verb = "INSERT ";

                // Look for and reject an attempt to add a 2nd project for same user with same name.
                var exceptionRet = sql.execute("select count(*) as cnt from " + self.dbname + "projects where createdByUserId=" + req.body.userId + " and name='" + project.name + "';",
                    function(rows) {

                        if (rows.length === 0) {

                            res.json({
                                success:false,
                                message:'Failed database action checking for duplicate project name.'
                            });
                        } else {

                            if (rows[0].cnt > 0) {

                                res.json({
                                    success:false,
                                    message:'You already have a project with that name.'
                                });
                            } else {
                                
                                m_functionProjectSavePart2(req,res,typeOfSave,project,verb,guts,whereclause);
                            }
                        }
                    },
                    function(strError) {

                        res.json({
                            success:false,
                            message:'Failed database action checking for duplicate project name.'
                        });
                    }
                );
                if (exceptionRet) {
                    res.json({
                        success:false,
                        message:'Failed database action checking for duplicate project name.'
                    });
                }
            }
        } catch (e) {

            res.json({
                success: false,
                message: e.message
            });
        }
    }

    var m_functionProjectSavePart2 = function (req,res,typeOfSave,project,verb,guts,whereclause) {

        try {

            var sqlStmt = verb + self.dbname + "projects" + guts + whereclause + ";";
            console.log(sqlStmt);

            var exceptionRet = sql.execute(sqlStmt,
                function(rows) {

                    if (rows.length === 0) {

                        res.json({
                            success: false,
                            message: "Error saving project to database."
                        });
                    } else {

                        if (typeOfSave === 'save') {

                            m_doComicsPlusTypes(typeOfSave, project, req, function(err) {

                                if (err) {

                                    res.json({
                                        success:false,
                                        message: err.message
                                    });
                                } else {

                                    // We're done.
                                    res.json({
                                        success: true,
                                        project: project
                                    });
                                }
                            });
                        } else {

                            project.id = rows[0].insertId;
                            exceptionRet = sql.execute("insert into " + self.dbname + "resources (createdByUserId,resourceTypeId,optnlFK) values (" + req.body.userId + ",3," + project.id + ");",
                                function(rows) {

                                    if (rows.length === 0) {

                                        res.json({
                                            success: false,
                                            message: "Error inserting project resource into database."
                                        });
                                    } else {

                                        var resourceId = rows[0].insertId;
                                        m_setUpAndDoTags(resourceId, '3', req.body.userName, project.tags, project.name, function(err) {

                                            if (err) {

                                                res.json({
                                                    success:false,
                                                    message: err.message
                                                });
                                            } else {

                                                m_doComicsPlusTypes(typeOfSave, project, req, function(err) {

                                                    if (err) {

                                                        res.json({
                                                            success:false,
                                                            message: err.message
                                                        });
                                                    } else {

                                                        // We're done.
                                                        res.json({
                                                            success: true,
                                                            project: project
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                },
                                function(strError) {

                                    res.json({
                                        success: false,
                                        message: "Error inserting project resource into database: " + strError
                                    });
                                }
                            );
                            if (exceptionRet) {

                                res.json({
                                    success: false,
                                    message: "Error inserting project resource into database: " + exceptionRet.message
                                });
                            }
                        }
                    }
                },
                function(strError) {

                    res.json({
                        success: false,
                        message: "Error inserting project into database."
                    });
                }
            );
            if (exceptionRet) {

                res.json({
                    success: false,
                    message: "Error inserting project into database: " + exceptionRet.message
                });
            }
        } catch(e) {

            res.json({
                success:false,
                message:e.message
            });
        }
    }

    var m_doComicsPlusTypes = function(typeOfSave, project, req, callback) {

        // If typeOfSave = 'save', then comics and types MIGHT exist already. The way to tell is if they have an id and if (for comics) comic.projectId === project.id or (for types) type.comicId => comic.projectId === project BEFORE the comic is saved.
        // Otherwise, a new comic or type is being INSERTed.

        // 1. Delete from types where comicId in (select id from comics where projectId=id); delete corr. rows from resources_tags
        // 2. Delete from comics where projectId=id; delete corr. rows from resources_tags
        // 3. For each comic in project, insert into comics, returning id as comicId. 
        // 3a. With that comicId, insert into resources, setting optnlFK=comicId. (resourceTypeId=4)
        // 3b. Also with that comicId, for each type in comic, insert into types, returning id as typeId.
        // 3c. With that typeId, insert into resources, setting optnlFK=typeId. (resourceTypeId=5)

        // Remember: comics and types have tags, too, that need to be added.

        try {

            var exceptionRet = sql.execute("delete from " + self.dbname + "resources_tags where resourceId in (select id from " + self.dbname + "resources where optnlFK in (select id from " + self.dbname + "types where comicId in (select id from " + self.dbname + "comics where projectId = " + project.id + ")));" + "delete from " + self.dbname + "types where comicId in (select id from " + self.dbname + "comics where projectId=" + project.id +");",
                function(rows){

                    // error check needed
                    exceptionRet = sql.execute("delete from " + self.dbname + "resources_tags where resourceId in (select id from " + self.dbname + "resources where optnlFK in (select id from " + self.dbname + "comics where projectId = " + project.id + "));" + "delete from " + self.dbname + "comics where projectId=" + project.id +";",
                        function(rows){

                            // error check needed
                            var allTypesCtr = 0;

                            project.comics.items.forEach(function(comicCth) {

                                allTypesCtr += comicCth.types.items.length;
                            });


                            project.comics.items.forEach(function(comicCth) {

                                console.log('*****inserting comic');
                                exceptionRet = sql.execute("insert " + self.dbname + "comics (projectId,ordinal,imageResourceId,name) values (" + project.id + "," + comicCth.ordinal + "," + comicCth.imageResourceId + ",'" + comicCth.name + "');",
                                    function(rows){

                                        // error check needed
                                        var comicId = rows[0].insertId;

                                        console.log('**********inserting comic resource');
                                        exceptionRet = sql.execute("insert " + self.dbname + "resources (createdByUserId,resourceTypeId,public,quarantined,optnlFK) values (" + req.body.userId + ",4,0,0," + comicId + ");",
                                            function(rows){

                                                // error check needed
                                                var resourceId = rows[0].insertId;
                                                m_setUpAndDoTags(resourceId, '4', req.body.userName, comicCth.tags, comicCth.name, function(err) {

                                                    if (err) {

                                                        callback(err);
                                                        return;

                                                    } else {

                                                        comicCth.types.items.forEach(function(typeTth) {

                                                            var jsonCode = JSON.stringify({
                                                                properties:typeTth.properties,
                                                                methods:typeTth.methods,
                                                                events:typeTth.events,
                                                                dependencies:typeTth.dependencies
                                                            });
                                                            console.log('***************inserting type ' + typeTth.name);
                                                            exceptionRet = sql.execute("insert " + self.dbname + "types (comicId,name,isApp,imageResourceId,ordinal,jsonCode) values (" + comicId + ",'" + typeTth.name + "'," + typeTth.isApp + "," + typeTth.imageResourceId + "," + typeTth.ordinal + ",'" + jsonCode + "');",
                                                                function(rows){

                                                                    // error check needed
                                                                    var typeId = rows[0].insertId;

                                                                    console.log('********************inserting type resource');
                                                                    exceptionRet = sql.execute("insert " + self.dbname + "resources (createdByUserId,resourceTypeId,public,quarantined,optnlFK) values (" + req.body.userId + ",5,0,0," + typeId + ");",
                                                                        function(rows){

                                                                            // error check needed
                                                                            var resourceId = rows[0].insertId;
                                                                            m_setUpAndDoTags(resourceId, '5', req.body.userName, typeTth.tags, typeTth.name, function(err) {

                                                                                if (err) {

                                                                                    callback(err);
                                                                                    return;

                                                                                } else {

                                                                                    if (--allTypesCtr === 0) {

                                                                                        callback(null);
                                                                                        return;
                                                                                    }
                                                                                }
                                                                            });
                                                                        },
                                                                        function(strError){

                                                                            callback(new Error(strError));
                                                                            return;
                                                                        }
                                                                    );
                                                                    if (exceptionRet) {

                                                                        callback(exceptionRet);
                                                                        return;
                                                                    }
                                                                },
                                                                function(strError){

                                                                    callback(new Error(strError));
                                                                    return;
                                                                }
                                                            );
                                                            if (exceptionRet) {

                                                                callback(exceptionRet);
                                                                return;
                                                            }
                                                        });   // comicCth.types.items,forEach(function(typeTth)
                                                    }
                                                });
                                            },
                                            function(strError){

                                                callback(new Error(strError));
                                                return;
                                            }
                                        );
                                        if (exceptionRet) {

                                            callback(exceptionRet);
                                            return;
                                        }
                                    },
                                    function(strError){

                                        callback(new Error(strError));
                                        return;
                                    }
                                );
                                if (exceptionRet) {

                                    callback(exceptionRet);
                                    return;
                                }
                            });  // project.comics.items.forEach(function(comicCth) {
                        },
                        function(strError){

                            callback(new Error(strError));
                            return;
                        }
                    );
                    if (exceptionRet) {

                        callback(exceptionRet);
                        return;
                    }
                },
                function(strError){

                    callback(new Error(strError));
                    return;
                }
            );
            if (exceptionRet) {

                callback(exceptionRet);
                return;
            }
        } catch (e) {

            callback(err);   
            return;
        }
    }

    var m_functionFetchTags = function(thingId, resourceTypeId, userName, callback) {

        try {

            // Retireve and set project.tags, skipping resourceType.description and req.body.userName.
            exceptionRet = sql.execute("select t.description from " + self.dbname + "resources r inner join " + self.dbname + "resources_tags rt on r.id=rt.resourceId inner join " + self.dbname + "tags t on t.id=rt.tagId where r.optnlFK=" + thingId + " and r.resourceTypeId=" + resourceTypeId + ";",
                function(rows){

                    var tags = "";
                    if (rows.length > 0) {

                        rows.forEach(function(row) {

                            if (row.description !== m_resourceTypes[resourceTypeId] && row.description !== userName) {    // Add filtering out all valid e-mail addresses (in case e-mail addresses are used as userNames in the future).

                                tags += row.description + ' ';
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

    var m_createTagJunctions = function(resourceId, tagIds) {

        var strSql = "insert into " + self.dbname + "resources_tags (resourceId,tagId) values";
        for (var j = 0; j < tagIds.length; j++) {

            strSql = strSql + "(" + resourceId.toString() + "," + tagIds[j].toString() + ")";
            if (j !== tagIds.length - 1){

                strSql = strSql + ",";
            }
        }
        strSql = strSql + ";";
        sql.execute(strSql,
            function(rows){

                return null;
            },
            function(strErr){

                return {message:'Error received inserting into resources_tags: ' + strErr};
            }
        );
    }

    var m_setUpAndDoTags = function(resourceId, strResourceTypeId, userName, strTags, strName, callback) {

        try {
            
            console.log("In m_setUpAndDoTags with resourceId=" + resourceId);

            // Start tagArray with resource type description, userName and resource name (with internal spaces replaced by '_').
            var tagArray = [];
            tagArray.push(m_resourceTypes[parseInt(strResourceTypeId, 10)]);
            tagArray.push(userName);
            if (strName.length > 0) {

                tagArray.push(strName.trim().replace(/\s/g, '_'));
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

            m_doTags(uniqueArray, resourceId, callback);

        } catch(e) {

            callback(e);
            return;
        }
    }

    var m_doTags = function(tagArray, resourceId, callback){

        var tagIds = [];
        var iCtr = tagArray.length;
        // For each string in tagArry:
        //      if it already exists in table tags, push its id onto tagIds.
        //      else, add it and push the new array.
        // Then write as many records to resources_tags using resourceId and tagIds[i] as called for.

        tagArray.forEach(function(tag) {

            var strSql = "select id from " + self.dbname + "tags where description='" + tag + "';";
            sql.execute(strSql,
                function(rows){

                    if (rows.length > 0) {

                        tagIds.push(rows[0].id);
                        if (--iCtr === 0){

                            callback(m_createTagJunctions(resourceId, tagIds));
                            return;
                        }

                    } else {

                        strSql = "insert into " + self.dbname + "tags (description) values ('" + tag + "');";
                        sql.execute(strSql,
                            function(rows){

                                if (rows.length === 0) {

                                    callback({message:'Could not insert tag into database.'});
                                    return;
                                
                                } else {

                                    tagIds.push(rows[0].insertId);
                                    if (--iCtr === 0){

                                        callback(m_createTagJunctions(resourceId, tagIds));
                                        return;
                                    }
                                }
                            },
                            function(err){

                                callback({message:err});
                                return;
                            });
                    }
                },
                function(err){

                    callback({message:err});
                    return;
                });
        });
    }
};