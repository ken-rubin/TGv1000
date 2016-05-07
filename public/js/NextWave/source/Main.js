///////////////////////////////////////
// Main application module.
//

"use strict";

// The main module requires other modules, it does not define its own, per se.
require(["utility/prototypes",
    "utility/settings",
    "utility/glyphs",
    "manager/Manager"],
    function (prototypes, settings, glyphs, Manager) {

        try {

            var objectThe = {

                types: [{

                        name: "MyType",
                        methods: [{

                                name: "SomeOtherMethod",
                                arguments: [],
                                statements: [{

                                        type: "CodeStatementBreak"
                                    }
                                ]
                            },{

                                name: "LoopAndAlert", 
                                arguments: [{

                                        name: "iCount"
                                    }
                                ],
                                statements: [{

                                        type: "CodeStatementFor",
                                        parameters: [{

                                                type: "CodeExpressionInfix",
                                                parameters: [{

                                                        type: "CodeExpressionName",
                                                        parameters: [{ 

                                                                type: "String",
                                                                value: "i" 
                                                            }
                                                        ]
                                                    }, {

                                                        type: "String",
                                                        value: "=" 
                                                    }, {

                                                        type: "CodeExpressionLiteral",
                                                        parameters: [{

                                                                type: "String",
                                                                value: "0"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }, {

                                                type: "CodeExpressionInfix",
                                                parameters: [{

                                                        type: "CodeExpressionName",
                                                        parameters: [{ 

                                                                type: "String",
                                                                value: "i" 
                                                            }
                                                        ]
                                                    }, {

                                                        type: "String",
                                                        value: "<" 
                                                    }, {

                                                        type: "CodeExpressionName",
                                                        parameters: [{

                                                                type: "String",
                                                                value: "iCount"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }, {

                                                type: "CodeExpressionPostfix",
                                                parameters: [{

                                                        type: "CodeExpressionName",
                                                        parameters: [{ 

                                                                type: "String",
                                                                value: "i" 
                                                            }
                                                        ]
                                                    }, {

                                                        type: "String",
                                                        value: "++" 
                                                    }
                                                ]
                                            }, {

                                                type: "Block",
                                                parameters: [{

                                                        type: "String",
                                                        value: "Statements"
                                                    },{

                                                        type: "Array",
                                                        parameters: [{

                                                                type: "CodeStatementExpression",
                                                                parameters: [{

                                                                        type: "CodeExpressionInvocation",
                                                                        parameters: [{

                                                                                type: "CodeExpressionRefinement",
                                                                                parameters: [{

                                                                                        type: "CodeExpressionName",
                                                                                        parameters: [{

                                                                                                type: "String",
                                                                                                value: "window"
                                                                                            }
                                                                                        ]
                                                                                    }, {

                                                                                        type: "CodeExpressionName",
                                                                                        parameters: [{

                                                                                                type: "String",
                                                                                                value: "alert"
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            }, {

                                                                                type: "ParameterList",
                                                                                parameters: [{

                                                                                        type: "Array",
                                                                                        parameters: [{

                                                                                                type: "Parameter",
                                                                                                parameters: [{

                                                                                                        name: "i"
                                                                                                    }
                                                                                                ]
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ] 
                            }
                        ],
                        properties: [

                            { name: "URL" }
                        ],
                        events: [

                        ]
                    }
                ],
                statements: ["StatementBreak",
                    "StatementContinue",
                    "StatementExpression",
                    "StatementFor", 
                    "StatementForIn", 
                    "StatementIf", 
                    "StatementReturn", 
                    "StatementThrow", 
                    "StatementTry", 
                    "StatementVar", 
                    "StatementWhile"
                ],
                expressions: ["ExpressionAdd", 
                    "ExpressionAssignment", 
                    "ExpressionDecrement", 
                    "ExpressionDelete", 
                    "ExpressionDivide", 
                    "ExpressionEqual", 
                    "ExpressionGreater", 
//                    "ExpressionGreaterOrEqual", 
  //                  "ExpressionIncrement", 
                    "ExpressionInvocation", 
                    "ExpressionLess", 
                    "ExpressionLessOrEqual", 
    //                "ExpressionLogicalAnd", 
      //              "ExpressionLogicalOr", 
        //            "ExpressionModulo", 
          //          "ExpressionMultiply", 
            //        "ExpressionNegate", 
              //      "ExpressionNew", 
                //    "ExpressionNotEqual", 
                    "ExpressionParentheses", 
                    "ExpressionRefinement", 
                    "ExpressionSubtract", 
                    "ExpressionTernary"
                ],
                literals: ["LiteralArray",
                    "LiteralBoolean", 
                    "LiteralInfinity", 
                    "LiteralNaN", 
                    "LiteralNull", 
                    "LiteralNumber", 
                    "LiteralObject", 
                    "LiteralRegexp", 
                    "LiteralString"
                ]
            };

            // Create the glyphs module first, its 
            // complete callback will contiue things.
            glyphs.create(function () {

                try {

                    // Allocate and create the layer manager.
                    var manager = new Manager();
                    var exceptionRet = manager.create();
                    if (exceptionRet) {

                        throw exceptionRet;
                    }

                    // Load up the object.
                    exceptionRet = manager.load(objectThe);
                    if (exceptionRet) {

                        throw exceptionRet;
                    }

                    var objectSave = manager.save();
                    var strSave = JSON.stringify(objectSave,
                        null,
                        2);
                    console.log(strSave);
                } catch (e) {

                    alert(e.message);
                }
            });
        } catch (e) {

            alert(e.message);
        }
    });
