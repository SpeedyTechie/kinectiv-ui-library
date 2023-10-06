/* Slider 1 */

function initSlider1() {
    $('.slider-1').each(function() {
        var sliderWrap = $(this);
        var slider = sliderWrap.find('.slider-1__slider');
        var sliderButtons = sliderWrap.find('.slider-1__button');


        // remove slick focus/blur function (which stops propagation to other handlers), and update enhanced mouse focus elements
        slider.off('focus.slick blur.slick', '*');
        enhanceMouseFocusUpdate();
        slider.on('init reInit breakpoint', function() {
            slider.off('focus.slick blur.slick', '*');
            enhanceMouseFocusUpdate();
        });

        // advance the slider in the corresponding direction on next/previous button click
        sliderButtons.on('click', function() {
            if ($(this).hasClass('slider-1__button_prev')) {
                slider.slick('slickPrev');
            } else {
                slider.slick('slickNext');
            }
        });

        // update hover/focus states after slide change
        slider.on('afterChange', function(event, slick) {
            // if old slide is focused, move focus to current slide
            if (slider.has(document.activeElement) && ($(document.activeElement).is('.slider-1__item:not(.slick-active)') || $(document.activeElement).parents('.slider-1__item:not(.slick-active)').length > 0)) {
                setTimeout(function() {
                    slider.find('.image-slider-1__item.slick-active').first().trigger('focus');
                }, 10);
            }
        });

        // add class to indicate that slick is active
        sliderWrap.addClass('slider-1_slick');

        // initialize slick
        slider.slick({
            arrows: false,
            speed: 400,
            touchThreshold: 4
        });
    });
}



/* General */

$(function() {
    initSlider1();
});
