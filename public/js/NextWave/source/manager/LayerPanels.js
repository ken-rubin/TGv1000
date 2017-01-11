///////////////////////////////////////
// LayerPanels module.
//
// Maintains collection of panels (one of which can be active, e.g. has focus).
// Also responsible for scaling to the display dimension (e.g. responsiveness).
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["NextWave/source/utility/prototypes",
        "NextWave/source/utility/settings",
        "NextWave/source/utility/orientation",
        "NextWave/source/utility/Area",
        "NextWave/source/utility/Point",
        "NextWave/source/utility/Size",
        "NextWave/source/manager/Layer",
        "NextWave/source/utility/Panel",
        "NextWave/source/project/ProjectDialog",
        "NextWave/source/project/Type",
        "NextWave/source/project/ProjectBuilder",
        "NextWave/source/project/ComicBuilder",
        "NextWave/source/project/LibraryBuilder",
        "NextWave/source/project/TypeBuilder",
        "NextWave/source/project/PropertyBuilder",
        "NextWave/source/project/EventBuilder",
        "NextWave/source/name/NameList",
        "NextWave/source/name/Name",
        "NextWave/source/statement/StatementList",
        "NextWave/source/expression/ExpressionList",
        "NextWave/source/literal/LiteralList",
        "NextWave/source/methodBuilder/MethodBuilder",
        "NextWave/source/project/LibrarySearchDialog",
        "NextWave/source/project/NewProjectDialog",
        "NextWave/source/project/SaveProjectDialog",
        "NextWave/source/project/OpenProjectDialog",
        "NextWave/source/project/LandingPage"
        ],
    function(prototypes, settings, orientation, Area, Point, Size, Layer, Panel, ProjectDialog, Type, ProjectBuilder, ComicBuilder, LibraryBuilder, TypeBuilder, PropertyBuilder, EventBuilder, NameList, Name, StatementListPayload, ExpressionList, LiteralList, MethodBuilder, LibrarySearchDialog, NewProjectDialog, SaveProjectDialog, OpenProjectDialog, LandingPage) {

        try {

            // Constructor function.
            var functionRet = function LayerPanels() {

                try {

                    var self = this; // Uber closure.

                    // Inherit from base class.
                    self.inherits(Layer);

                    ////////////////////////
                    // Public fields.

                    // Panel of types.
                    self.typesPanel = null;
                    // Panel of centers.
                    self.centerPanel = null;
					// Panel for Landing Page.
					self.landingPagePanel = null;
                    // Save configuration.
                    self.iPanelConfiguration = null;

                    ////////////////////////
                    // Public methods.

                    // Initialze instance.
                    // iPanelConfiguration: 0 = no panels; 1 = normal project; 2 = system types project
                    self.create = function(iPanelConfiguration) {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw {

                                    message: "LayerPanels: Instance already created!"
                                };
                            }

                            self.iPanelConfiguration = iPanelConfiguration;
                            switch (self.iPanelConfiguration) {

                                case 0:

                                    m_arrayPanels = [];
                                    break;

                                case 1:

                                    self.centerPanel = new Panel("Method",
                                        orientation.south,
                                        new Point(settings.layerPanels.centerPanel.x, 0),
                                        new Size(settings.layerPanels.centerPanel.width, settings.layerPanels.centerPanel.height));

                                    self.typesPanel = new Panel("Types",
                                        orientation.west,
                                        new Point(0, settings.layerPanels.typesPanel.y),
                                        new Size(settings.layerPanels.typesPanel.width, settings.layerPanels.typesPanel.height));

                                    self.landingPagePanel = new Panel("Home",
                                        orientation.north,
                                        new Point(0, 0),
                                        new Size(settings.layerPanels.landingPagePanel.width, settings.layerPanels.landingPagePanel.height));

                                    // Add the ProjectDialog to the types Panel.
                                    var exceptionRet = m_functionAddProjectDialogToTypesPanel(self.typesPanel);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }

                                    // Add the LandingPage to the landingPagePanel panel.
                                    var exceptionRet = m_functionSetLandingPageInLandingPagePanel(self.landingPagePanel);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }

                                    // Compile to generic list of panels for looping operations.
                                    m_arrayPanels = [
										self.landingPagePanel,
                                        self.typesPanel,
                                        self.centerPanel
                                    ];

                                    // To be replaced by: load type/method.
                                    // Add the MethodBuilder to the center Panel.
                                    exceptionRet = self.switchCenterPanelMode("Method");
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                    break;

                                case 2:

                                    self.centerPanel = new Panel("Method",
                                        orientation.south,
                                        new Point(settings.layerPanels.centerPanel.x, 0),
                                        new Size(settings.layerPanels.centerPanel.width, settings.layerPanels.centerPanel.height));

                                    // Compile to generic list of panels for looping operations.
                                    m_arrayPanels = [
                                        self.centerPanel
                                    ];

                                    // To be replaced by: load type/method.
                                    // Add the MethodBuilder to the center Panel.
                                    exceptionRet = self.switchCenterPanelMode("Method");
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                    break;
                            }

                            // Allocate the payloads of the center panel:
                            exceptionRet = m_functionAllocateProjectBuilder();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            exceptionRet = m_functionAllocateComicBuilder();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            exceptionRet = m_functionAllocateLibraryBuilder();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            exceptionRet = m_functionAllocateTypeBuilder();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            exceptionRet = m_functionAllocateMethodBuilder();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            exceptionRet = m_functionAllocatePropertyBuilder();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            exceptionRet = m_functionAllocateEventBuilder();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            exceptionRet = m_functionAllocateLibrarySearch();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            exceptionRet = m_functionAllocateLandingPage();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            // Not allocating these three center panels yet.
                            // They'll be allocated when first needed and data to pass in is available.
/*                            exceptionRet = m_functionAllocateNewProject();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            exceptionRet = m_functionAllocateSaveProject();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            exceptionRet = m_functionAllocateOpenProject();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
*/
                            // Indicate current state.
                            m_bCreated = true;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Destroy LayerPanels--we're about to create a new one with a different configuration.
                    self.destroy = function() {

                        m_arrayPanels.forEach(
                            function(panelIth) {
                                if (panelIth) {
                                    panelIth.destroy();
                                }
                            }
                        );

                        window.projectBuilder.destroy();
                        window.comicBuilder.destroy();
                        window.libraryBuilder.destroy();
                        window.typeBuilder.destroy();
                        window.methodBuilder.destroy();
                        window.propertyBuilder.destroy();
                        window.eventBuilder.destroy();
                        window.librarySearchDialog.destroy();
                        window.newProjectDialog.destroy();
                        window.saveProjectDialog.destroy();
                        window.openProjectDialog.destroy();
                        window.landingPage.destroy();
                    }

                    // Clear the center panel.
                    // extraCenterPanelData is currently used only for NewProjectDialog. If that's the one, pass it along.'
                    self.clearCenter = function(strActiveCenterPanel, extraCenterPanelData) {

                        try {

                            if (!self.centerPanel) {
                                return null;
                            }

                            // Ensure there is always a good active center panel.
                            if (!strActiveCenterPanel) {

                                strActiveCenterPanel = "Method";
                            }

                            window.projectBuilder = null;
                            window.comicBuilder = null;
                            window.libraryBuilder = null;
                            window.typeBuilder = null;
                            window.methodBuilder = null;
                            window.propertyBuilder = null;
                            window.eventBuilder = null;
                            window.librarySearchDialog = null;
                            window.newProjectDialog = null;
                            window.saveProjectDialog = null;
                            window.openProjectDialog = null;
                            window.landingPage = null;

                            // Clear out the possible
                            // payloads for the center panel.
                            var exceptionRet = m_functionAllocateProjectBuilder();
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = m_functionAllocateComicBuilder();
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = m_functionAllocateLibraryBuilder();
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = m_functionAllocateTypeBuilder();
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = m_functionAllocateMethodBuilder();
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = m_functionAllocatePropertyBuilder();
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = m_functionAllocateEventBuilder();
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = m_functionAllocateLibrarySearch();
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = m_functionAllocateNewProject(extraCenterPanelData);
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = m_functionAllocateSaveProject();
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = m_functionAllocateOpenProject();
                            if (exceptionRet) {

                                return exceptionRet;
                            }
                            exceptionRet = m_functionAllocateLandingPage();
                            if (exceptionRet) {

                                return exceptionRet;
                            }

                            // Set the active section.
                            return self.switchCenterPanelMode(strActiveCenterPanel);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Save and return list of extant statement constructors.
                    self.saveStatements = function() {

                        return self.statementsPanel.payload.save();
                    };

					// Pass through resetting title of center panel panel.
					self.resetCenterPanelTitle = function(strTitle) {

						self.centerPanel.resetTitle(strTitle);
					}

                    // Put the center panel into different modes.
                    self.switchCenterPanelMode = function(strMode) {

                        try {

                            // Switch out the payload of the center panel.
                            if (strMode === "Project") {

                                return m_functionSetProjectBuilderInCenterPanel();
                            } else if (strMode === "Comic") {

                                return m_functionSetComicBuilderInCenterPanel();
                            } else if (strMode === "Library") {

                                return m_functionSetLibraryBuilderInCenterPanel();
                            } else if (strMode === "Type") {

                                return m_functionSetTypeBuilderInCenterPanel();
                            } else if (strMode === "Method") {

                                return m_functionSetMethodBuilderInCenterPanel();
                            } else if (strMode === "Property") {

                                return m_functionSetPropertyBuilderInCenterPanel();
                            } else if (strMode === "Event") {

                                return m_functionSetEventBuilderInCenterPanel();
                            } else if (strMode === "LibrarySearch") {

                                return m_functionSetLibrarySearchInCenterPanel();
                            } else if (strMode === "NewProject") {

                                return m_functionSetNewProjectInCenterPanel();
                            } else if (strMode === "SaveProject") {

                                return m_functionSetSaveProjectInCenterPanel();
                            } else if (strMode === "OpenProject") {

                                return m_functionSetOpenProjectInCenterPanel();
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Open and Pin all panels.
					// Except, before opening typesPanel and centerPanel, we close landingPagePanel.
                    self.openAndPinAllPanels = function() {

                        m_arrayPanels.forEach(
                            function(panelIth) {
                                if (panelIth) {

									if (panelIth.title === "Home") {
										panelIth.unpin();
									} else {
                                    	panelIth.openAndPin();
									}
                                }
                            }
                        );
                    }

                    // Unpin all panels. They are cleared.
					// Except, after closing typesPanel and centerPanel, we open and pin landingPagePanel.
                    self.unpinAllPanels = function() {

                        m_arrayPanels.forEach(
                            function(panelIth) {
                                if (panelIth) {
									if (panelIth.title !== "Home") {
	                                    panelIth.unpin();
									} else {
										panelIth.openAndPin();
									}
                                }
                            }
                        );
                    }

                    // Take mouse move--set handled in reference object if handled.
                    self.innerMouseMove = function(objectReference) {

                        try {

                            // Must be created.
                            if (!m_bCreated) {

                                return null;
                            }

                            // Save off the current active panel, if.
                            var panelOriginal = m_panelActive;

                            // Clear the active panel.
                            m_panelActive = null;

                            // Test all the panels.
                            for (var i = 0; i < m_arrayPanels.length; i++) {

                                if (m_arrayPanels[i]) {

                                    var exceptionRet = m_arrayPanels[i].mouseMove(objectReference);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }

                                    // If handled, then drop out.
                                    if (objectReference.handled) {

                                        m_panelActive = m_arrayPanels[i];
                                        break;
                                    }
                                }
                            }

                            // Deactivate the old activation in
                            // the current panel, if it changed.
                            if (panelOriginal &&
                                m_panelActive !== panelOriginal) {

                                var exceptionRet = panelOriginal.mouseOut(objectReference);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Handle mouse down.
                    self.innerMouseDown = function(objectReference) {

                        try {

                            // Must be created to have panels.
                            if (!m_bCreated) {

                                return null;
                            }

                            // If active panel, just pass to it.
                            if (m_panelActive) {

                                // Panel handles down--even if not over a control.
                                objectReference.handled = true;

                                return m_panelActive.mouseDown(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Handle mouse up.
                    self.innerMouseUp = function(objectReference) {

                        try {

                            // Must be created to have panels.
                            if (!m_bCreated) {

                                return null;
                            }

                            // If active panel, just pass to it.
                            if (m_panelActive) {

                                // Panel handles down--even if not over a control.
                                objectReference.handled = true;

                                return m_panelActive.mouseUp(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Handle mouse wheel.
                    self.innerMouseWheel = function(objectReference) {

                        try {

                            // Must be created to have panels.
                            if (!m_bCreated) {

                                return null;
                            }

                            // If active panel, just pass to it.
                            if (m_panelActive) {

                                // Panel handles down--even if not over a control.
                                objectReference.handled = true;

                                return m_panelActive.mouseWheel(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Handle mouse out.
                    self.innerMouseOut = function(objectReference) {

                        try {

                            // Must be created to have panels.
                            if (!m_bCreated) {

                                return null;
                            }

                            // Deactivate the activation in
                            // the current panel, if activated.
                            if (m_panelActive) {

                                var exceptionRet = m_panelActive.mouseOut(objectReference);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }

                            // Reset active state.
                            m_panelActive = null;
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Handle click.
                    self.innerClick = function(objectReference) {

                        try {

                            // Must be created to have panels.
                            if (!m_bCreated) {

                                return null;
                            }

                            // If active panel, just pass to it.
                            if (m_panelActive) {

                                // Panel handles down--even if not over a control.
                                objectReference.handled = true;

                                return m_panelActive.click(objectReference);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Set the size of this layer and children.
                    // Also handle responsiveness of application.
                    self.innerCalculateLayout = function(sizeExtent, contextRender) {

                        try {

                            // Must be created to have panels.
                            if (!m_bCreated) {

                                return null;
                            }

                            // Set the extents of the panels.
                            for (var i = 0; i < m_arrayPanels.length; i++) {

                                if (m_arrayPanels[i]) {

                                    var exceptionRet = m_arrayPanels[i].calculateLayout(sizeExtent, contextRender);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Render out the layer.
                    self.innerRender = function(contextRender, iMS) {

                        try {

                            // Must be created to have panels.
                            if (!m_bCreated) {

                                return null;
                            }

                            // Render the panels.
                            for (var i = m_arrayPanels.length - 1; i >= 0; i--) {

                                if (m_arrayPanels[i]) {

                                    var exceptionRet = m_arrayPanels[i].render(contextRender);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    //////////////////////////
                    // Private methods.

                    // Allocate ProjectBuilder instance.
                    var m_functionAllocateProjectBuilder = function() {

                        try {

                            // For now, only allocate once.
                            if (window.projectBuilder) {

                                return null;
                            }

                            // Allocate and create the Project builder.
                            // Store globally.
                            window.projectBuilder = new ProjectBuilder();
                            var exceptionRet = window.projectBuilder.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Allocate ComicBuilder instance.
                    var m_functionAllocateComicBuilder = function() {

                        try {

                            // For now, only allocate once.
                            if (window.comicBuilder) {

                                return null;
                            }

                            // Allocate and create the comic builder.
                            // Store globally.
                            window.comicBuilder = new ComicBuilder();
                            var exceptionRet = window.comicBuilder.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Allocate LibraryBuilder instance.
                    var m_functionAllocateLibraryBuilder = function() {

                        try {

                            // For now, only allocate once.
                            if (window.libraryBuilder) {

                                return null;
                            }

                            // Allocate and create the type builder.
                            // Store globally.
                            window.libraryBuilder = new LibraryBuilder();
                            var exceptionRet = window.libraryBuilder.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Allocate type builder instance.
                    var m_functionAllocateTypeBuilder = function() {

                        try {

                            // For now, only allocate once.
                            if (window.typeBuilder) {

                                return null;
                            }

                            // Allocate and create the type builder.
                            // Store globally.
                            window.typeBuilder = new TypeBuilder();
                            var exceptionRet = window.typeBuilder.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Allocate method builder instance.
                    var m_functionAllocateMethodBuilder = function() {

                        try {

                            // For now, only allocate once.
                            if (window.methodBuilder) {

                                return null;
                            }

                            // Allocate and create the object list.
                            // Store globally so the drag layer can access.
                            window.methodBuilder = new MethodBuilder();
                            var exceptionRet = window.methodBuilder.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Allocate property builder instance.
                    var m_functionAllocatePropertyBuilder = function() {

                        try {

                            // For now, only allocate once.
                            if (window.propertyBuilder) {

                                return null;
                            }

                            // Allocate and create the type builder.
                            // Store globally.
                            window.propertyBuilder = new PropertyBuilder();
                            var exceptionRet = window.propertyBuilder.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Allocate Event builder instance.
                    var m_functionAllocateEventBuilder = function() {

                        try {

                            // For now, only allocate once.
                            if (window.eventBuilder) {

                                return null;
                            }

                            // Allocate and create the Event builder.
                            // Store globally.
                            window.eventBuilder = new EventBuilder();
                            var exceptionRet = window.eventBuilder.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Allocate library search instance.
                    var m_functionAllocateLibrarySearch = function() {

                        try {

                            // For now, only allocate once.
                            if (window.librarySearchDialog) {

                                return null;
                            }

                            // Allocate and create the Library Search Dialog.
                            window.librarySearchDialog = new LibrarySearchDialog();
                            var exceptionRet = window.librarySearchDialog.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Allocate new project instance.
                    var m_functionAllocateNewProject = function(extraCenterPanelData) {

                        try {

                            // For now, only allocate once.
                            if (window.newProjectDialog) {

                                return null;
                            }

                            // Allocate and create the New Project Dialog.
                            window.newProjectDialog = new NewProjectDialog();
                            var exceptionRet = window.newProjectDialog.create(extraCenterPanelData);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Allocate save project instance.
                    var m_functionAllocateSaveProject = function() {

                        try {

                            // For now, only allocate once.
                            if (window.saveProjectDialog) {

                                return null;
                            }

                            // Allocate and create the Save Project Dialog.
                            window.saveProjectDialog = new SaveProjectDialog();
                            var exceptionRet = window.saveProjectDialog.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Allocate open project instance.
                    var m_functionAllocateOpenProject = function() {

                        try {

                            // For now, only allocate once.
                            if (window.openProjectDialog) {

                                return null;
                            }

                            // Allocate and create the Open Project Dialog.
                            window.openProjectDialog = new OpenProjectDialog();
                            var exceptionRet = window.openProjectDialog.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Allocate LandingPage instance.
                    var m_functionAllocateLandingPage = function() {

                        try {

                            // For now, only allocate once.
                            if (window.landingPage) {

                                return null;
                            }

                            // Allocate and create the LandingPage.
                            window.landingPage = new LandingPage();
                            var exceptionRet = window.landingPage.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method adds ProjectDialog to types panel.
                    var m_functionAddProjectDialogToTypesPanel = function(panelTypes) {

                        try {

                            // Allocate and create the Project Dialog, passing the initialization object.
                            window.projectDialog = new ProjectDialog();
                            var exceptionRet = window.projectDialog.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Set it.
                            panelTypes.payload = window.projectDialog;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method adds landingPagePanel to landingPagePanel panel.
                    var m_functionSetLandingPageInLandingPagePanel = function(panelLanding) {

                        try {

                            // Allocate and create the landingPageDialog, passing the initialization object.
                            window.landingPageDialog = new LandingPage();
                            var exceptionRet = window.landingPageDialog.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Set it.
							panelLanding.setPayload("Home",
								window.landingPageDialog);

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method sets ProjectBuilder in the method panel.
                    var m_functionSetProjectBuilderInCenterPanel = function() {

                        try {

                            // Set visible to property builder.
                            window.eventBuilder.visible = false;
                            window.propertyBuilder.visible = false;
                            window.methodBuilder.visible = false;
                            window.typeBuilder.visible = false;
                            window.libraryBuilder.visible = false;
                            window.comicBuilder.visible = false;
                            window.projectBuilder.visible = true;
                            window.librarySearchDialog.visible = false;
                            if (window.newProjectDialog) {
                                window.newProjectDialog.visible = false;
                            }
                            if (window.newProjectDialog) {
                                window.saveProjectDialog.visible = false;
                            }
                            if (window.newProjectDialog) {
                                window.openProjectDialog.visible = false;
                            }

                            // Set it in the center panel.
                            return self.centerPanel.setPayload("Project",
                                window.projectBuilder);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method sets ComicBuilder in the center panel.
                    var m_functionSetComicBuilderInCenterPanel = function() {

                        try {

                            // Set visible to property builder.
                            window.eventBuilder.visible = false;
                            window.propertyBuilder.visible = false;
                            window.methodBuilder.visible = false;
                            window.typeBuilder.visible = false;
                            window.libraryBuilder.visible = false;
                            window.comicBuilder.visible = true;
                            window.projectBuilder.visible = false;
                            window.librarySearchDialog.visible = false;
                            if (window.newProjectDialog) {
                                window.newProjectDialog.visible = false;
                            }
                            if (window.newProjectDialog) {
                                window.saveProjectDialog.visible = false;
                            }
                            if (window.newProjectDialog) {
                                window.openProjectDialog.visible = false;
                            }

                            // Set it in the center panel.
                            return self.centerPanel.setPayload("Comic",
                                window.comicBuilder);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method sets LibraryBuilder in the method panel.
                    var m_functionSetLibraryBuilderInCenterPanel = function() {

                        try {

                            // Set visible to property builder.
                            window.eventBuilder.visible = false;
                            window.propertyBuilder.visible = false;
                            window.methodBuilder.visible = false;
                            window.typeBuilder.visible = false;
                            window.libraryBuilder.visible = true;
                            window.comicBuilder.visible = false;
                            window.projectBuilder.visible = false;
                            window.librarySearchDialog.visible = false;
                            if (window.newProjectDialog) {
                                window.newProjectDialog.visible = false;
                            }
                            if (window.newProjectDialog) {
                                window.saveProjectDialog.visible = false;
                            }
                            if (window.newProjectDialog) {
                                window.openProjectDialog.visible = false;
                            }

                            // Set it in the center panel.
                            return self.centerPanel.setPayload("Library",
                                window.libraryBuilder);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method sets TypeBuilder in the method panel.
                    var m_functionSetTypeBuilderInCenterPanel = function() {

                        try {

                            // Set visible to property builder.
                            window.eventBuilder.visible = false;
                            window.propertyBuilder.visible = false;
                            window.methodBuilder.visible = false;
                            window.typeBuilder.visible = true;
                            window.libraryBuilder.visible = false;
                            window.comicBuilder.visible = false;
                            window.projectBuilder.visible = false;
                            window.librarySearchDialog.visible = false;
                            if (window.newProjectDialog) {
                                window.newProjectDialog.visible = false;
                            }
                            if (window.newProjectDialog) {
                                window.saveProjectDialog.visible = false;
                            }
                            if (window.newProjectDialog) {
                                window.openProjectDialog.visible = false;
                            }

                            // Set it in the center panel.
                            return self.centerPanel.setPayload("Type",
                                window.typeBuilder);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method sets MethodBuilder in the method panel.
                    var m_functionSetMethodBuilderInCenterPanel = function() {

                        try {

                            // Set visible to property builder.
                            window.eventBuilder.visible = false;
                            window.propertyBuilder.visible = false;
                            window.methodBuilder.visible = true;
                            window.typeBuilder.visible = false;
                            window.libraryBuilder.visible = false;
                            window.comicBuilder.visible = false;
                            window.projectBuilder.visible = false;
                            window.librarySearchDialog.visible = false;
                            if (window.newProjectDialog) {
                                window.newProjectDialog.visible = false;
                            }
                            if (window.newProjectDialog) {
                                window.saveProjectDialog.visible = false;
                            }
                            if (window.newProjectDialog) {
                                window.openProjectDialog.visible = false;
                            }

                            // Set it in the center panel.
                            return self.centerPanel.setPayload("Method",
                                window.methodBuilder);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method sets PropertyBuilder in the method panel.
                    var m_functionSetPropertyBuilderInCenterPanel = function() {

                        try {

                            // Set visible to property builder.
                            window.eventBuilder.visible = false;
                            window.propertyBuilder.visible = true;
                            window.methodBuilder.visible = false;
                            window.typeBuilder.visible = false;
                            window.libraryBuilder.visible = false;
                            window.comicBuilder.visible = false;
                            window.projectBuilder.visible = false;
                            window.librarySearchDialog.visible = false;
                            if (window.newProjectDialog) {
                                window.newProjectDialog.visible = false;
                            }
                            if (window.newProjectDialog) {
                                window.saveProjectDialog.visible = false;
                            }
                            if (window.newProjectDialog) {
                                window.openProjectDialog.visible = false;
                            }

                            // Set it in the center panel.
                            return self.centerPanel.setPayload("Property",
                                window.propertyBuilder);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method sets LibrarySearch in the method panel.
                    var m_functionSetLibrarySearchInCenterPanel = function() {

                        try {

                            // Set visible to property builder.
                            window.eventBuilder.visible = false;
                            window.propertyBuilder.visible = false;
                            window.methodBuilder.visible = false;
                            window.typeBuilder.visible = false;
                            window.libraryBuilder.visible = false;
                            window.comicBuilder.visible = false;
                            window.projectBuilder.visible = false;
                            window.librarySearchDialog.visible = true;
                            if (window.newProjectDialog) {
                                window.newProjectDialog.visible = false;
                            }
                            if (window.newProjectDialog) {
                                window.saveProjectDialog.visible = false;
                            }
                            if (window.newProjectDialog) {
                                window.openProjectDialog.visible = false;
                            }

                            // Set it in the center panel.
                            return self.centerPanel.setPayload("Library Search",
                                window.librarySearchDialog);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method sets NewProject in the method panel.
                    var m_functionSetNewProjectInCenterPanel = function() {

                        try {

                            // Set visible to property builder.
                            window.eventBuilder.visible = false;
                            window.propertyBuilder.visible = false;
                            window.methodBuilder.visible = false;
                            window.typeBuilder.visible = false;
                            window.libraryBuilder.visible = false;
                            window.comicBuilder.visible = false;
                            window.projectBuilder.visible = false;
                            window.librarySearchDialog.visible = false;
                            if (window.newProjectDialog) {
                                window.newProjectDialog.visible = true;
                            }
                            if (window.newProjectDialog) {
                                window.saveProjectDialog.visible = false;
                            }
                            if (window.newProjectDialog) {
                                window.openProjectDialog.visible = false;
                            }

                            // Set it in the center panel.
                            return self.centerPanel.setPayload("New Project",
                                window.newProjectDialog);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method sets SaveProject in the method panel.
                    var m_functionSetSaveProjectInCenterPanel = function() {

                        try {

                            // Set visible to property builder.
                            window.eventBuilder.visible = false;
                            window.propertyBuilder.visible = false;
                            window.methodBuilder.visible = false;
                            window.typeBuilder.visible = false;
                            window.libraryBuilder.visible = false;
                            window.comicBuilder.visible = false;
                            window.projectBuilder.visible = false;
                            window.librarySearchDialog.visible = false;
                            if (window.newProjectDialog) {
                                window.newProjectDialog.visible = false;
                            }
                            if (window.newProjectDialog) {
                                window.saveProjectDialog.visible = true;
                            }
                            if (window.newProjectDialog) {
                                window.openProjectDialog.visible = false;
                            }

                            // Set it in the center panel.
                            return self.centerPanel.setPayload("Save Project",
                                window.saveProjectDialog);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method sets OpenProject in the method panel.
                    var m_functionSetOpenProjectInCenterPanel = function() {

                        try {

                            // Set visible to property builder.
                            window.eventBuilder.visible = false;
                            window.propertyBuilder.visible = false;
                            window.methodBuilder.visible = false;
                            window.typeBuilder.visible = false;
                            window.libraryBuilder.visible = false;
                            window.comicBuilder.visible = false;
                            window.projectBuilder.visible = false;
                            window.librarySearchDialog.visible = false;
                            if (window.newProjectDialog) {
                                window.newProjectDialog.visible = false;
                            }
                            if (window.newProjectDialog) {
                                window.saveProjectDialog.visible = false;
                            }
                            if (window.newProjectDialog) {
                                window.openProjectDialog.visible = true;
                            }

                            // Set it in the center panel.
                            return self.centerPanel.setPayload("Open Project",
                                window.openProjectDialog);
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method sets EventBuilder in the center panel.
                    var m_functionSetEventBuilderInCenterPanel = function() {

                        try {

                            // Set visible to property builder.
                            window.eventBuilder.visible = true;
                            window.propertyBuilder.visible = false;
                            window.methodBuilder.visible = false;
                            window.typeBuilder.visible = false;
                            window.libraryBuilder.visible = false;
                            window.comicBuilder.visible = false;
                            window.projectBuilder.visible = false;
                            window.librarySearchDialog.visible = false;
                            if (window.newProjectDialog) {
                                window.newProjectDialog.visible = false;
                            }
                            if (window.newProjectDialog) {
                                window.saveProjectDialog.visible = false;
                            }
                            if (window.newProjectDialog) {
                                window.openProjectDialog.visible = false;
                            }

                            // Set it in the center panel.
                            return self.centerPanel.setPayload("Event",
                                window.eventBuilder);
                        } catch (e) {

                            return e;
                        }
                    };

                    //////////////////////////
                    // Private fields.

                    // Indicates this instance is already created.
                    var m_bCreated = false;
                    // Collection of managed panels.
                    var m_arrayPanels = null;
                    // Panel in which the mouse is located.
                    var m_panelActive = null;
                } catch (e) {

                    alert(e.message);
                }
            };

            // Do function injection.
            functionRet.inheritsFrom(Layer);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
