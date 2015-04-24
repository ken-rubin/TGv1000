/////////////////////////////////
// ContextMenu module.
// Installs self as jQuery extension.
//
// Note: Context menu definition in DOM.
//
// Return null--jQuery injection.
//

// Define module.
define(["Core/errorHelper"], 
	function (errorHelper) {
	
		try {

            // If not defined, then install context menu handler.
            if (!$.fn.contextMenu) {

                // Inject into jQuery extension property.
                $.fn.contextMenu = function (settings) {

                    // For each selected item.
                    return this.each(function () {

                        // Open context menu.
                        $(this).on("contextmenu", function (e) {

                            // Return native menu if pressing control.
                            if (e.ctrlKey) return;
                            
                            // Open menu.
                            $(settings.menuSelector)
                                .data("invokedOn", $(e.target))
                                .show()
                                .css({
                                    position: "absolute",
                                    left: getMenuPosition(e.clientX, 'width', 'scrollLeft'),
                                    top: getMenuPosition(e.clientY, 'height', 'scrollTop')
                                })
                                .off('click')
                                .on('click', function (e) {
                                    $(this).hide();
                            
                                    var $invokedOn = $(this).data("invokedOn");
                                    var $selectedMenu = $(e.target);
                                    
                                    settings.menuSelected.call(this, $invokedOn, $selectedMenu);
                            });
                            
                            return false;
                        });

                        // Make sure menu closes on any click.
                        $(document).click(function () {
                            $(settings.menuSelector).hide();
                        });
                    });
                    
                    // Helper method....
                    function getMenuPosition(mouse, direction, scrollDir) {

                        var win = $(window)[direction](),
                            scroll = $(window)[scrollDir](),
                            menu = $(settings.menuSelector)[direction](),
                            position = mouse + scroll;
                                    
                        // Opening menu would pass the side of the page.
                        if (mouse + menu > win && menu < mouse) 
                            position -= menu;
                        
                        return position;
                    }    

                };
            }

            // No actual module, just inject the method into jQuery.
            return null;
		} catch (e) {

			errorHelper.show(e);
		}
	});
