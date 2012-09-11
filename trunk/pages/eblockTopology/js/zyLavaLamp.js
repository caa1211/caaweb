(function($){

    $.fn.zyLavaLamp = function(options){
       var defaultOptions = {
            overlap: 5,
            speed: 500,
            reset: 1500,
            color: '#0b2b61',
            easing: 'easeOutExpo'
        };   
        
        options = $.extend(defaultOptions, options);
        
        var lastObj;
        this.getSelObj = function(){return lastObj};
        this.getBlob = function(){return blob;};
            var nav = $(this), currentPageItem = $('.selected', nav), blob, reset;
            
            
            $('<li id="blob" ></li>').css({
                width: currentPageItem.outerWidth(),
                height: currentPageItem.outerHeight() + options.overlap,
                left: currentPageItem.position().left,
                top: currentPageItem.position().top - options.overlap / 2,
               // backgroundColor: options.color
            }).appendTo(this);
            
            blob = $('#blob', nav);
          
            
            function navi(){
            	if(lastObj==undefined)
                return;
              blob.animate({
                    left: lastObj.position().left,
                       top: lastObj.position().top- options.overlap / 2,
                    width: lastObj.width()
                }, {
                    duration: options.speed,
                    easing: options.easing,
                    queue: false
                });
            }
            
            $('li:not(#blob)', nav).hover(function(){
                // mouse over
               // clearTimeout(reset);
               lastObj = $(this);
               navi();
            }, function(){
                // mouse out
                /*
                reset = setTimeout(function(){
                    blob.animate({
                        width: currentPageItem.outerWidth(),
                        left: currentPageItem.position().left
                    }, options.speed)
                }, options.reset);
                */
            });
            
            $(window).resize(function(){
              navi();
            });
            //--
       
        
         this.addItem = function($liobj){
	         $liobj.hover(function(){
               lastObj = $(this);
               navi();
              }, function(){
            });
         };
         
        
        return this 
        
    };
    
    
    
})(jQuery);
