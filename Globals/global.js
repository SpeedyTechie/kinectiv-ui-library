/* Enhance Mouse Focus */

var enhanceMouseFocusActive = false;
var enhanceMouseFocusEnabled = false;
var enhanceMouseFocusElements = $();
var enhanceMouseFocusNewElements = $();
var enhanceMouseFocusClickedElements = $();


function enhanceMouseFocusUpdate() {
    if (enhanceMouseFocusEnabled) {
        // add any new focusable elements
        enhanceMouseFocusNewElements = $('button, input[type="submit"], input[type="button"], [tabindex]:not(input, textarea), a').not(enhanceMouseFocusElements);
        enhanceMouseFocusElements = enhanceMouseFocusElements.add(enhanceMouseFocusNewElements);
        
        // if an element gets focus due to a mouse click, prevent it from keeping focus
        enhanceMouseFocusNewElements.mousedown(function() {
            var clickedElement = this;

            enhanceMouseFocusActive = true;
            enhanceMouseFocusClickedElements = enhanceMouseFocusClickedElements.add(clickedElement);
            setTimeout(function(){
                enhanceMouseFocusActive = false;
                enhanceMouseFocusClickedElements = enhanceMouseFocusClickedElements.not(clickedElement);
            }, 0);
        }).on('focus', function() {
            if (enhanceMouseFocusActive && enhanceMouseFocusClickedElements.is(this)) {
                $(this).blur();
            }
        });
    }
}

function initEnhanceMouseFocus() {
    enhanceMouseFocusElements = $();
    enhanceMouseFocusEnabled = true;
    
    enhanceMouseFocusUpdate();
    
    // update focusable elements on Gravity Forms render
    $(document).on('gform_post_render', function() {
        enhanceMouseFocusUpdate();
    });
}



/* General */

$(function() {
    initEnhanceMouseFocus();
});
