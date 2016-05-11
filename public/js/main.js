////////////////////////////////////
// Main
//
// Return null--no module object.
//
// This is the entry point.  GZ globals are defined, allocated and initialized here.

// Define some index app globals.
var client = null;
var navbar = null;
var comics = null;
var validator = null;
var g_clTypeApp = null;
var manager = null;

var g_profile = {};

$(document).ready(function() {

	try {

		require(["Core/errorHelper", 
				"Core/Client", 
				"Navbar/Navbar", 
				"Navbar/Comics", 
				"Core/Validator",
			    "NextWave/source/utility/prototypes",
			    "NextWave/source/utility/settings",
			    "NextWave/source/utility/glyphs",
			    "NextWave/source/manager/Manager"], 
			function (errorHelper, 
						Client, 
						Navbar, 
						Comics,
						Validator,
						prototypes,
						settings,
						glyphs,
						Manager) {

								try {

									var strFromURL = m_functionCheckForURLEncoding("error");
									if (strFromURL) {
										errorHelper.show(strFromURL);
									}

									// Allocate and initialize the client.
									client = new Client();
									var exceptionRet = client.create();
									if (exceptionRet) { throw exceptionRet; }

									// Allocate and initialize the validator.
									validator = new Validator();
									var exceptionRet = validator.create();
									if (exceptionRet) { throw exceptionRet; }

									// Allocate and attach the navbar module.
									navbar = new Navbar();
									exceptionRet = navbar.create();
									if (exceptionRet) { throw exceptionRet; }

									// Allocate comics.
									comics = new Comics();
									exceptionRet = comics.create();
									if (exceptionRet) { throw exceptionRet; }

									// Allocate and attach the manager/glyph objects.
						            // Create the glyphs module first, its 
						            // complete callback will contiue things.
						            glyphs.create(function () {

						                try {

								            // var objectThe = {

								            //     types: [{

								            //             name: "MyType",
								            //             methods: [{

								            //                     name: "SomeOtherMethod",
								            //                     arguments: [],
								            //                     statements: [{

								            //                             type: "CodeStatementBreak"
								            //                         }
								            //                     ]
								            //                 },{

								            //                     name: "LoopAndAlert", 
								            //                     arguments: [{

								            //                             name: "iCount"
								            //                         }
								            //                     ],
								            //                     statements: [{

								            //                             type: "CodeStatementFor",
								            //                             parameters: [{

								            //                                     type: "CodeExpressionInfix",
								            //                                     parameters: [{

								            //                                             type: "CodeExpressionName",
								            //                                             parameters: [{ 

								            //                                                     type: "String",
								            //                                                     value: "i" 
								            //                                                 }
								            //                                             ]
								            //                                         }, {

								            //                                             type: "String",
								            //                                             value: "=" 
								            //                                         }, {

								            //                                             type: "CodeExpressionLiteral",
								            //                                             parameters: [{

								            //                                                     type: "String",
								            //                                                     value: "0"
								            //                                                 }
								            //                                             ]
								            //                                         }
								            //                                     ]
								            //                                 }, {

								            //                                     type: "CodeExpressionInfix",
								            //                                     parameters: [{

								            //                                             type: "CodeExpressionName",
								            //                                             parameters: [{ 

								            //                                                     type: "String",
								            //                                                     value: "i" 
								            //                                                 }
								            //                                             ]
								            //                                         }, {

								            //                                             type: "String",
								            //                                             value: "<" 
								            //                                         }, {

								            //                                             type: "CodeExpressionName",
								            //                                             parameters: [{

								            //                                                     type: "String",
								            //                                                     value: "iCount"
								            //                                                 }
								            //                                             ]
								            //                                         }
								            //                                     ]
								            //                                 }, {

								            //                                     type: "CodeExpressionPostfix",
								            //                                     parameters: [{

								            //                                             type: "CodeExpressionName",
								            //                                             parameters: [{ 

								            //                                                     type: "String",
								            //                                                     value: "i" 
								            //                                                 }
								            //                                             ]
								            //                                         }, {

								            //                                             type: "String",
								            //                                             value: "++" 
								            //                                         }
								            //                                     ]
								            //                                 }, {

								            //                                     type: "Block",
								            //                                     parameters: [{

								            //                                             type: "String",
								            //                                             value: "Statements"
								            //                                         },{

								            //                                             type: "Array",
								            //                                             parameters: [{

								            //                                                     type: "CodeStatementExpression",
								            //                                                     parameters: [{

								            //                                                             type: "CodeExpressionInvocation",
								            //                                                             parameters: [{

								            //                                                                     type: "CodeExpressionRefinement",
								            //                                                                     parameters: [{

								            //                                                                             type: "CodeExpressionName",
								            //                                                                             parameters: [{

								            //                                                                                     type: "String",
								            //                                                                                     value: "window"
								            //                                                                                 }
								            //                                                                             ]
								            //                                                                         }, {

								            //                                                                             type: "CodeExpressionName",
								            //                                                                             parameters: [{

								            //                                                                                     type: "String",
								            //                                                                                     value: "alert"
								            //                                                                                 }
								            //                                                                             ]
								            //                                                                         }
								            //                                                                     ]
								            //                                                                 }, {

								            //                                                                     type: "ParameterList",
								            //                                                                     parameters: [{

								            //                                                                             type: "Array",
								            //                                                                             parameters: [{

								            //                                                                                     type: "Parameter",
								            //                                                                                     parameters: [{

								            //                                                                                             name: "i"
								            //                                                                                         }
								            //                                                                                     ]
								            //                                                                                 }
								            //                                                                             ]
								            //                                                                         }
								            //                                                                     ]
								            //                                                                 }
								            //                                                             ]
								            //                                                         }
								            //                                                     ]
								            //                                                 }
								            //                                             ]
								            //                                         }
								            //                                     ]
								            //                                 }
								            //                             ]
								            //                         }
								            //                     ] 
								            //                 }
								            //             ],
								            //             properties: [

								            //                 { name: "URL" }
								            //             ],
								            //             events: [

								            //             ]
								            //         }
								            //     ],
								            //     statements: ["StatementBreak",
								            //         "StatementContinue",
								            //         "StatementExpression",
								            //         "StatementFor", 
								            //         "StatementForIn", 
								            //         "StatementIf", 
								            //         "StatementReturn", 
								            //         "StatementThrow", 
								            //         "StatementTry", 
								            //         "StatementVar", 
								            //         "StatementWhile"
								            //     ],
								            //     expressions: ["ExpressionAdd", 
								            //         "ExpressionAssignment", 
								            //         "ExpressionDecrement", 
								            //         "ExpressionDelete", 
								            //         "ExpressionDivide", 
								            //         "ExpressionEqual", 
								            //         "ExpressionGreater", 
								            //         "ExpressionGreaterOrEqual", 
								            //         "ExpressionIncrement", 
								            //         "ExpressionInvocation", 
								            //         "ExpressionLess", 
								            //         "ExpressionLessOrEqual", 
								            //         "ExpressionLogicalAnd", 
								            //         "ExpressionLogicalNot", 
								            //         "ExpressionLogicalOr", 
								            //         "ExpressionModulo", 
								            //         "ExpressionMultiply", 
								            //         "ExpressionNegate", 
								            //         "ExpressionNew", 
								            //         "ExpressionNotEqual", 
								            //         "ExpressionParentheses", 
								            //         "ExpressionRefinement", 
								            //         "ExpressionSubtract", 
								            //         "ExpressionTernary"
								            //     ],
								            //     literals: ["LiteralArray",
								            //         "LiteralBoolean", 
								            //         "LiteralInfinity", 
								            //         "LiteralNaN", 
								            //         "LiteralNull", 
								            //         "LiteralNumber", 
								            //         "LiteralObject", 
								            //         "LiteralRegexp", 
								            //         "LiteralString"
								            //     ]
								            // };

						                    // Allocate and create the layer manager.
						                    manager = new Manager();
						                    var exceptionRet = manager.create();
						                    if (exceptionRet) {

						                        throw exceptionRet;
						                    }

						                 //    // Load up the object.
						                 //    exceptionRet = manager.load(objectThe);
						                 //    if (exceptionRet) {

						                 //        throw exceptionRet;
						                 //    }

						                 //    var objectSave = manager.save();
						                 //    var strSave = JSON.stringify(objectSave,
						                 //        null,
						                 //        2);
						                 //    console.log(strSave);

						                 //    setTimeout( function () {

							                //     var objectJavaScript = manager.generateJavaScript();
							                //     var strJavaScript = JSON.stringify(objectJavaScript,
							                //         null,
							                //         2);
							                //     console.log(strJavaScript);
							                // }, 10000);
						                } catch (e) {

						                    alert(e.message);
						                }
						            });

								} catch(e) { errorHelper.show(e); }
							});
	} catch(e) { alert(e.message);}
});

var m_functionCheckForURLEncoding = function( name ) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return decodeURI(results[1]);
}

