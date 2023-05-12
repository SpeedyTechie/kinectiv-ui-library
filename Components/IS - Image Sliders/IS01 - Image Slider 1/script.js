/* Image Slider 1 */

function initImageSlider1() {
    $('.image-slider-1').each(function() {
        var sliderWrap = $(this);
        var slider = sliderWrap.find('.image-slider-1__slider');
        var sliderButtons = sliderWrap.find('.image-slider-1__button');

        var slidesToShow = parseInt(slider.attr('data-slides-to-show')) || 1; // get number of slides to show from data attribute, or fall back to default of 1
        

        // get active slide(s)
        function getActiveSlides(currentSlide, total) {
            var activeSlides = [currentSlide];

            // if there are multiple active slides, add them all
            if (slidesToShow > 1) {
                // add slides to left of current slide
                for (i = Math.ceil((slidesToShow - 1) / 2); i > 0; i--) {
                    var newSlide = currentSlide - i;

                    // get correct slide index if the index is outside the range of slides
                    if (newSlide < 0) {
                        newSlide = total + newSlide;
                    }

                    activeSlides.push(newSlide); // add index to list of active slides
                }

                // add slides to right of current slide
                for (i = Math.floor((slidesToShow - 1) / 2); i > 0; i--) {
                    var newSlide = currentSlide + i;

                    // get correct slide index if the index is outside the range of slides
                    if (newSlide > total - 1) {
                        newSlide = newSlide - total;
                    }

                    activeSlides.push(newSlide); // add index to list of active slides
                }
            }

            return activeSlides;
        }

        // get all clones of a given slide
        function getSlideClones(index, total) {
            var slideList = slider.find('.image-slider-1__item'); // get all slides
            var parentSlide = slideList.filter('[data-slick-index="' + index + '"]'); // get slide with exact index
            var resultSlides = $().add(parentSlide); // add parent slide to list

            // if the parent slide exists, look for clones
            if (parentSlide.length > 0) {
                // loop through all slides
                slideList.each(function() {
                    var curIndex = parseInt($(this).attr('data-slick-index')); // get index of current slide in loop

                    // check if slide index is offset by the correct amount to make it a clone of the parent slide (if so, add it to the list)
                    if ((curIndex >= 0 && curIndex % total == index) || (curIndex < 0 && (curIndex - total) % total == index - total)) {
                        resultSlides = resultSlides.add($(this));
                    }
                });
            }

            return resultSlides; // return final list of slides
        }

        // update slide hover/focus states
        function updateSlideHover() {
            var slick = slider.slick('getSlick');

            // remove existing hover/focus classes
            slider.find('.image-slider-1__slide_hover').removeClass('image-slider-1__slide_hover');
            slider.find('.image-slider-1__slide_focus').removeClass('image-slider-1__slide_focus');

            // check each button for hover/focus
            sliderButtons.each(function() {
                var linkedSlide = ($(this).hasClass('image-slider-1__button_prev')) ? slick.currentSlide - Math.ceil((slidesToShow - 1) / 2) - 1 : slick.currentSlide + Math.floor((slidesToShow - 1) / 2) + 1; // get the slide behind this button

                // get correct slide index if the direction causes looping to the beginning/end of the slider
                if (linkedSlide < 0) {
                    linkedSlide = slick.slideCount + linkedSlide;
                } else if (linkedSlide > slick.slideCount - 1) {
                    linkedSlide = linkedSlide - slick.slideCount;
                }

                // if button is hovered, add hover class to corresponding slide and all clones
                if ($(this).is(':hover')) {
                    getSlideClones(linkedSlide, slick.slideCount).each(function() {
                        $(this).find('.image-slider-1__slide').addClass('image-slider-1__slide_hover');
                    });
                }

                // if button is focused, add focus class to corresponding slide and all clones
                if ($(this).is(':focus')) {
                    getSlideClones(linkedSlide, slick.slideCount).each(function() {
                        $(this).find('.image-slider-1__slide').addClass('image-slider-1__slide_focus');
                    });
                }
            });
        }

        // initialize active slide styles
        slider.on('init reInit', function(event, slick) {
            slider.find('.image-slider-1__slide_active').removeClass('image-slider-1__slide_active'); // reset active class on all slides

            // add class to active slide(s) and all clones
            $.each(getActiveSlides(slick.currentSlide, slick.slideCount), function(i, slideIndex) {
                getSlideClones(slideIndex, slick.slideCount).each(function() {
                    $(this).find('.image-slider-1__slide').addClass('image-slider-1__slide_active');
                });
            });
        });

        // adjust styles if all slides are visible without advancing slider
        slider.on('init reInit breakpoint', function(event, slick) {
            if (slick.slideCount <= slick.options.slidesToShow) {
                sliderWrap.addClass('image-slider-1_static');
            } else {
                sliderWrap.removeClass('image-slider-1_static');
            }
        });


        // remove slick focus/blur function (which stops propagation to other handlers), and update enhanced mouse focus elements
        slider.off('focus.slick blur.slick', '*');
        enhanceMouseFocusUpdate();
        slider.on('init reInit breakpoint', function() {
            slider.off('focus.slick blur.slick', '*');
            enhanceMouseFocusUpdate();
        });

        // advance the slider in the corresponding direction on next/previous button click
        sliderButtons.on('click', function() {
            if ($(this).hasClass('image-slider-1__button_prev')) {
                slider.slick('slickPrev');
            } else {
                slider.slick('slickNext');
            }
        });

        // update hover states on next/previous button hover/focus change
        sliderButtons.on('mouseenter mouseleave focus blur', function(e) {
            updateSlideHover();
        });

        // update slide styles on slide change
        slider.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
            slider.find('.image-slider-1__slide_active').removeClass('image-slider-1__slide_active'); // remove class from active slide and any clones

            // add class to new slide(s) and all clones
            $.each(getActiveSlides(nextSlide, slick.slideCount), function(i, slideIndex) {
                getSlideClones(slideIndex, slick.slideCount).each(function() {
                    $(this).find('.image-slider-1__slide').addClass('image-slider-1__slide_active');
                });
            });

            // update hover/focus states after slide change begins
            setTimeout(function() {
                updateSlideHover();
            }, 10);
        });

        // update hover/focus states after slide change
        slider.on('afterChange', function(event, slick) {
            updateSlideHover();
            
            // if old slide is focused, move focus to current slide
            if (slider.has(document.activeElement) && ($(document.activeElement).is('.image-slider-1__item') || $(document.activeElement).parents('.image-slider-1__item:not(.slick-active)').length > 0)) {
                setTimeout(function() {
                    slider.find('.image-slider-1__item.slick-active').trigger('focus');
                }, 10);
            }
        });

        // add classes to indicate that slick is active
        sliderWrap.addClass('image-slider-1_slick');
        slider.find('.image-slider-1__slide').addClass('image-slider-1__slide_slick');

        // initialize slick
        slider.slick({
            arrows: false,
            centerMode: true,
            centerPadding: null,
            slidesToShow: slidesToShow,
            speed: 400,
            touchThreshold: 4
        });
    });
}



/* General */

$(function() {
    initImageSlider1();
});
