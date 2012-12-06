/*
 *  Project: WS Carousel
 *  Description: carousel   
 *  Author: Wiebe Steven v/d Meer
 *  License:
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "wscarousel",
        defaults = {
             start: 0,
             auto:true,
             speed:500,
             delay:1000,
             time:8000,
             autoHide:true,
             showNavigation:true
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.options).
            
            //OPTIONS
            var auto = this.options.auto;
            var speed = this.options.speed;
            var time = this.options.time;
            var currentIndex = this.options.start;
            var showNavigation = this.options.showNavigation;
            var delay = this.options.delay;
            var autoHide = this.options.autoHide;
            
            //CAROUSEL
            var obj = $(this.element);
            var itemsHolder = $(".items",obj);
            var items = $("li",itemsHolder);
            var carouselWidth = obj.width();
           
            //INDEXES
            var ready = true;
            var totalSlides = items.length;
            
            //CHECK SLIDES
            if(totalSlides > 1){
            }else{
                auto = false;
                showNavigation = false;
            }
            
            //CREATE NAVIGATION
            obj.append("<ul class='dots'></ul>");
            obj.append("<div class='carousel-button left'></div>");
            obj.append("<div class='carousel-button right'></div>");
        
            var dotsHolder = $(".dots",obj);
            var nextButton = $(".carousel-button.right",obj);
            var prevButton = $(".carousel-button.left",obj);
               
            //SHOWNAVIGATION & AUTOHIDE
            if(showNavigation){
                if(autoHide){
                    nextButton.hide();
                    prevButton.hide();
                    obj.hover(
                        function(){
                            displayNavigation(true)
                        },
                        function(){
                           displayNavigation(false)
                        }
                    );
                }else{
                    nextButton.show();
                    prevButton.show();
                }    
            }else{
                nextButton.hide();
                prevButton.hide();
                dotsHolder.hide();
            }
                
            //ADD DOTS
            items.each(function(i, item) {
                  $(item).attr('data-id', i);
                   var li 
                   if(i == currentIndex){
                          li = "<li class='dot active'></li>"   
                   }else if(i == totalSlides-1){
                          li = "<li class='dot last'></li>"  
                   }else{
                          li = "<li></li>"   
                   }
                   dotsHolder.append(li) 
            });
            
            //DEFINE DOTS
            var dots = $("li",dotsHolder);
           
            //TIMERS
            var carouselTimer;
            var carouselDelayTimer;
           
            //INIT
            gotoSlide(currentIndex,"direct")
           
            //DOTS
            dots.click(function(){
               stopCarousel();
               if($(this).hasClass("active")){
               }else{
                   gotoSlide($(this).index(),"direct")
               }
            });
            
            //GOTO
            function gotoSlide(index,direction){
                stopCarousel();
                var move;
                if(ready){
                    ready = false;
                    //DOTS
                    dots.eq(index).addClass("active");
                    dots.eq(index).siblings("li").removeClass("active");        
                    //SLIDES
                    var newSlide = itemsHolder.find('[data-id='+index+']');
                    var curSlide = itemsHolder.find('[data-id='+currentIndex+']');
                    //NEXT/PREV/DIRECT
                    if(direction == "next"){
                        newSlide.css({left:carouselWidth})
                        move = -carouselWidth
                    }else if (direction =="prev"){
                        newSlide.css({left:-carouselWidth})
                        move = carouselWidth
                    }else{//DIRECT
                        if((index > currentIndex)||((index == totalSlides) && (currentIndex ==(totalSlides-1)))){
                            newSlide.css({left:carouselWidth})
                            move = -carouselWidth
                        }else if (index<currentIndex){
                            newSlide.css({left:-carouselWidth});
                            move = carouselWidth;
                        }
                    }
                    
                    //APEND SLIDE
                    itemsHolder.append(newSlide);
                    
                    //ANIMATE CURRENT SLIDE
                    curSlide.stop(true,true).animate({left:move},speed,function(){});
                   
                   //ANIMATE NEW SLIDE
                    newSlide.stop(true,true).animate({left:0},speed,function(){
                        $(this).siblings("li").removeClass("active").css({left:carouselWidth});
                        if(auto){
                            carouselDelayTimer = setTimeout(startCarousel,delay);
                        }
                        ready = true;  
                    });
                    currentIndex = index
                }
            }
            
            //START CAROUSEL
            function startCarousel(){
                if(auto){
                    clearTimeout(carouselDelayTimer);
                    if(carouselTimer==""){
                        stopCarousel();
                    }
                    if(auto){
                       carouselTimer = setInterval(function(){nextSlide(true)},time); // or whatever time 
                    }
                    
                }
            }
          
            //STOP CAROUSEL
            function stopCarousel(){
                if(auto){
                    clearTimeout(carouselDelayTimer);
                    clearInterval(carouselTimer);
                }
            }
            //NEXT ITEM
            function nextSlide(auto){
                stopCarousel();
                var newIndex = currentIndex +1;
                if(newIndex>totalSlides-1){
                  newIndex = 0;
                }
                gotoSlide(newIndex,"next")	
            }
            //PREVIOUS ITEM
            function prevSlide(auto){
                stopCarousel();
                var newIndex = currentIndex-1;
                if(newIndex<0){
                    newIndex = totalSlides-1;
                }
                gotoSlide(newIndex,"prev")
            }
            //CLICK
            nextButton.click(function(){
                nextSlide(true);
            });
            prevButton.click(function(){
                prevSlide(true);
            });
           
            //HOVER
            function displayNavigation(show){
                if(show){
                    nextButton.show()
                    prevButton.show()
                }else{
                     nextButton.hide()
                     prevButton.hide()
                }
            }
            
            //AUTO
            startCarousel();
             
            /**
            *DEBUG FUNCTION
            *log: login string
            */
            function debug(log) {
                if (window.console != undefined) {
                    console.log(log);
                }
            }
            
            
        },

        /*yourOtherFunction: function(el, options) {
            // some logic
        }*/
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );


