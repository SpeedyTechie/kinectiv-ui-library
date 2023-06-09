# PW01 - Popup Window 1
v1.0.2

### Dependencies
* U02 - Section
* U03 - Text
* U04 - Title
* U05 - Button

### Modifiers
* `popup-window-1`
    * `popup-window-1_overlay_*`: Overlay color
        * `popup-window-1_overlay_dark`
    * `popup-window-1_align-top`: Top-aligned popup window

### Notes
* Popups can be triggered one of three ways
    * On a clickable element, add the `data-open-popup` attribute to match the popup `id`
    * Use an anchor link pointing to the popup `id`
    * Call `.popupWindow1('open')` on a jQuery object containing the popup
* Popups will trigger the `popup-open` and `popup-close` event on open and close respectively
