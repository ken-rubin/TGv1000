////////////////////////////////////
// GenericRenameDialog module.
// 
// Return constructor function.
//

// Define the module.
define(["Core/snippetHelper", "Core/errorHelper", "Core/resourceHelper", "Code/Types"], 
  function (snippetHelper, errorHelper, resourceHelper, Types) {

    try {

      // Define the GenericRenameDialog constructor function.
      var functionGenericRenameDialog = function () {

        try {

          var self = this;      // Uber closure.

          //////////////////////////////////
          // Public methods.

          // Create and show Bootstrap dialog.
          self.create = function(objectType, index) {

            try {

              m_strObjectType = objectType;
              m_iIndex = index;

              // Get the dialog DOM.
              $.ajax({

                cache: false,
                data: { 

                  templateFile: "Dialogs/GenericRenameDialog/GenericRenameDialog"
                }, 
                dataProperty: "HTML",
                method: "POST",
                url: "/renderJadeSnippet"
              }).done(m_functionRenderJadeSnippetResponse).error(errorHelper.show);

              return null;
            } catch (e) {

              return e;
            }
          };

          self.closeYourself = function() {

            m_dialog.close();
          }

          //////////////////////////////////
          // Private methods.

          // Have converted jade of dialog to HTML. Open its dialog.
          var m_functionRenderJadeSnippetResponse = function (htmlData) {

            try {

              // Show the dialog--load the content from 
              // the PropertysDialog jade HTML-snippet.
              BootstrapDialog.show({

                title: "Rename",
                size: BootstrapDialog.SIZE_WIDE,
                      message: $(htmlData),
                      buttons: [
                        {
                          label: "Rename",
                          id: 'RenameBtn',
                          cssClass: "btn-primary",
                          action: function(){

                            m_functionRename();
                          }
                        },
                        {
                            label: "Close",
                            icon: "glyphicon glyphicon-remove-circle",
                            cssClass: "btn-warning",
                            action: function(dialogItself){

                                dialogItself.close();
                            }
                        }
                      ],
                      draggable: true,
                      onshown: m_functionOnShownDialog
                  });
            } catch (e) {

              errorHelper.show(e);
            }
          };

          // Wire up Property handlers to dialog controls.
          var m_functionOnShownDialog = function (dialogItself) {

            try {

              // Save the dailog object reference.
              m_dialog = dialogItself;

              var strType = m_strObjectType.charAt(0).toUpperCase() + m_strObjectType.substring(1);
              var strName = '';
              if (m_strObjectType === 'type') {

                strName = types.getActiveClType().data.name;

              } else if (m_strObjectType === 'method') {

                strName = types.getActiveClType().data.methods[m_iIndex].name;

              } else if (m_strObjectType === 'event') {

                strName = types.getActiveClType().data.events[m_iIndex].name;

              } else {

                throw new Error('Invalid objectType passed to Rename Dialog.');
              }

              $("#RenameLabel").text(strType);
              $("#RenameInput").val(strName);

            } catch (e) {

              errorHelper.show(e);
            }
          };

        } catch (e) {

          errorHelper.show(e);
        }

        var m_functionRename = function () {}

        /////////////////////////////////
        // Private fields.

        // Reference to the dialog object instance.
        var m_dialog = null;
        // Object type we're potentially deleting ('type','method','property','event')
        var m_strObjectType = "";
        // For 'method', 'property', 'event': Index in  array respective array in Types#m_clTypeActive.
        // For 'type': Index in array Types#m_arrayClTypes.
        var m_iIndex = -1;
      };

      // Return the constructor function as the module object.
      return functionGenericRenameDialog;

    } catch (e) {

      errorHelper.show(e);
    }
  });
