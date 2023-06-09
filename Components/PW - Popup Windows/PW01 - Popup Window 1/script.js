/* Popup Window 1 */

var popupWindow1ActionQueue = [];

function initPopupWindow1() {
    $('.popup-window-1').each(function() {
        var $window = $(window);
        var body = $('body');
        var site = $('.site');

        var popup = $(this);
        var popupWrap = popup.find('.popup-window-1__wrap');
        var popupContent = popupWrap.find('.popup-window-1__content');
        var closeButton = popupContent.find('.popup-window-1__close');

        var isOpen = false;
        var popupID = popup.attr('id');
        var lastFocus = $('body');
        var scrollTop = $window.scrollTop();


        // get focusable elements within popup
        function getFocusableElements() {
            return popupContent.find('input, select, textarea, button, object, a[href], iframe, [tabindex="0"]').not('[tabindex="-1"], :hidden').filter(function() {
                return ($(this).css('visibility') == 'visible');
            });
        }

        // initialize popup
        function initPopup() {
            popup.appendTo(body); // move popup to body

            // trap focus inside popup
            $('<span class="screen-reader-text" tabindex="0">').prependTo(popupWrap).on('focus', function(e) {
                e.stopImmediatePropagation();

                getFocusableElements().last().trigger('focus');
            });
            $('<span class="screen-reader-text" tabindex="0">').appendTo(popupWrap).on('focus', function(e) {
                e.stopImmediatePropagation();

                getFocusableElements().first().trigger('focus');
            });

            // standardize undefined popup ID
            if (popupID === false || popupID.trim() === '' || typeof popupID !== 'string') {
                popupID = undefined;
            }
        }

        // open popup
        function openPopup(updateHash) {
            if (updateHash === undefined) updateHash = true;

            if (isOpen) return; // if the popup is already open, don't do anything

            $window.trigger('close-all-popups', false); // close any open popups

            body.addClass('no-scroll'); // disable scrolling on page
            popupWrap.scrollTop(0); // ensure popup is scrolled to the top before displaying

            popup.addClass('popup-window-1_active'); // add class to open popup

            // allow screen readers and keyboard navigation to access popup
            popup.prop('inert', false);
            popup.removeAttr('aria-hidden');
            
            // transfer focus to window
            lastFocus = $(document.activeElement);
            getFocusableElements().first().trigger('focus');

            // prevent screen readers and keyboard navigation from accessing page content while popup is open
            site.prop('inert', true);
            site.attr('aria-hidden', true);

            isOpen = true; // update open state

            // update URL hash
            if (updateHash) {
                var newURL = new URL(location.toString());

                newURL.hash = popupID;

                history.pushState(null, '', newURL);
            }

            popup.trigger('popup-open'); // trigger open event
        }

        // close popup
        function closePopup(updateHash) {
            if (updateHash === undefined) updateHash = true;

            if (!isOpen) return; // if the popup is already closed, don't do anything

            scrollTop = $window.scrollTop(); // get scroll position

            // allow screen readers and keyboard navigation to access page content
            site.prop('inert', false);
            site.removeAttr('aria-hidden');

            // return focus to previously focused element (and prevent page from scrolling)
            lastFocus.trigger('focus');
            $window.scrollTop(scrollTop);

            // prevent screen readers and keyboard navigation from accessing popup during close animation
            popup.prop('inert', true);
            popup.attr('aria-hidden', true);

            popup.removeClass('popup-window-1_active'); // remove class to close popup

            body.removeClass('no-scroll'); // re-enable scrolling on page

            isOpen = false; // update open state

            // update URL hash
            if (updateHash) {
                var newURL = new URL(location.toString());

                newURL.hash = '';

                history.pushState(null, '', newURL);
            }

            popup.trigger('popup-close'); // trigger close event
        }


        initPopup(); // prepare popup

        // open popup on button click (based on matching data-open-popup attribute)
        if (popupID !== undefined) {
            $('[data-open-popup="' + popupID + '"]').on('click', function() {
                openPopup();
            });
        }

        if (popupID !== undefined && location.hash.substring(1) == popupID) openPopup(false); // open popup on load if URL hash matches ID

        // open popup on hashchange if hash matches ID
        if (popupID !== undefined) {
            $window.on('hashchange', function() {
                if (location.hash.substring(1) == popupID) {
                    openPopup(false);
                } else {
                    closePopup(false);
                }
            });
        }

        // close popup on close button click
        closeButton.on('click', function() {
            closePopup();
        });

        // close popup on close all event
        $window.on('close-all-popups', function(e, updateHash) {
            closePopup(updateHash);
        });

        // close popup on overlay click
        popup.on('click', function(e) {
            var target = $(e.target);

            if (!target.parents().is(popupContent) || target.hasClass('popup-window-1__top') || target.hasClass('popup-window-1__main')) {
                closePopup();
            }
        });

        // close popup on esc press
        $(document).on('keydown', function(e) {
            if (e.which === 27) {
                closePopup();
            }
        });

        // store references to open/close functions in element data (for use in jQuery method)
        popup.data('openPopupFunction', openPopup);
        popup.data('closePopupFunction', closePopup);
    });

    // perform any actions stored in queue
    $.each(popupWindow1ActionQueue, function (i, v) {
        v.$el.popupWindow1(v.action, v.updateHash);
    });
}

// add jQuery method to trigger popup open/close
$.fn.popupWindow1 = function(action, updateHash) {
    if (updateHash === undefined) updateHash = true;
    
    if (action == 'open') {
        var openPopup = this.data('openPopupFunction');

        if (typeof openPopup === 'function') {
            openPopup(updateHash);
        } else {
            popupWindow1ActionQueue.push({
                $el: this,
                action: 'open',
                updateHash: updateHash
            });
        }
    } else if (action == 'close') {
        var closePopup = this.data('closePopupFunction');

        if (typeof closePopup === 'function') {
            closePopup(updateHash);
        } else {
            popupWindow1ActionQueue.push({
                $el: this,
                action: 'close',
                updateHash: updateHash
            });
        }
    }

    return this;
};



/* General */

$(function() {
    initPopupWindow1();
});
