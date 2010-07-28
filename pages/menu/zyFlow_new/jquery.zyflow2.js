 
 
;(function($){
    
 $.fn.zyflow2 = function(settings){

         var _defaultSettings = {
           interval : 110,
           normalSize : 100,
           activeSize: 150,
           center: ['30%', '20%'],
           selectedIndex: 0,
           dur: 300,
           naviCompleted: function(){},
           vertical: true
         }
     
     
        settings = $.extend(_defaultSettings, settings);
        
        var itemLength = $(this).find('.menuItem').length;
      
        var interval = settings.interval;
        var selectedIndex = settings.selectedIndex;
        var thisObj = $(this);
            
        function parseFromJson(){
        
        }
        
        this.getIndex = function(){ return selectedIndex; };
            
        this.getActivedItem= function(){
            return   $(this).children('.menuItem[circleIndex='+selectedIndex+']')
        };
        
        this.naviTo = function(index){
             if(index>=0 && index< itemLength)
             $(this).children('.menuItem[circleIndex='+index+']').trigger('click');
        };
    
        this.next = function(){
            this.naviTo(selectedIndex+1);
        };
        
        this.prev = function(){
             this.naviTo(selectedIndex-1);
        };

       function doCircleAnim(param /*dur, init, callback*/){  
              
                param= $.extend({},param);
                var aw =settings.activeSize;
                var nw = settings.normalSize;  
                var d = param.dur==undefined? settings.dur : param.dur;

                var center = [];
                for (var i = 0; i < 2; i++) {
                    var ary = settings.center[i].toString().split('%');
                    if (ary.length != 1) {
                        var target = i == 0 ? thisObj.width() : thisObj.height();
                        center[i] = target * (parseInt(ary[0]) / 100);
                    }
                    else 
                        center[i] = parseInt(ary[0]);
                }   
                
                if(param.init!=undefined)
                thisObj.css({top:center[1], left: center[0]});
              // thisObj.animate({'top':center[1]- selectedIndex*interval , 'left': center[0]},d);
              if (settings.vertical == false) {
                  thisObj.animate({
                      'top': center[1],
                      'left': center[0] - selectedIndex * interval
                  }, d);
                  
                  thisObj.children('.menuItem').each(function(i, data){
                      if (i < selectedIndex) {
                          $(this).animate({
                              'left': i * interval,
                              'width': nw,
                              'height': nw
                          }, d, function(){
                          
                          });
                      }
                      if (i == selectedIndex) //$(this).css('left',i*interval).children('img').css('width', middleInterval);
                    {
                        thisObj.trigger('beforeCircleChange', $(this));
                        
                        $(this).animate({
                            'left': i * interval,
                            'width': aw,
                            'height': aw
                        }, d, function(){
                            thisObj.trigger('circleChange', $(this));
                        });
                    }
                    if (i > selectedIndex) //$(this).css('left',i*interval + middleInterval - width).children('img').css('width', width);
                    {
                        $(this).animate({
                            'left': i * interval + (aw - nw),
                            'width': nw,
                            'height': nw
                        }, d, function(){
                        
                        });
                    }
                });
            }
           else{  //vertical
                      thisObj.animate({
                      'top': center[1] - selectedIndex * interval,
                      'left': center[0]
                  }, d);
                  
                  thisObj.children('.menuItem').each(function(i, data){
                      if (i < selectedIndex) {
                          $(this).animate({
                              'top': i * interval,
                              'width': nw,
                              'height': nw
                          }, d, function(){
                          
                          });
                      }
                      if (i == selectedIndex) //$(this).css('left',i*interval).children('img').css('width', middleInterval);
                    {
                        thisObj.trigger('beforeCircleChange', $(this));
                        
                        $(this).animate({
                            'top': i * interval,
                            'width': aw,
                            'height': aw
                        }, d, function(){
                            thisObj.trigger('circleChange', $(this));
                        });
                    }
                    if (i > selectedIndex) //$(this).css('left',i*interval + middleInterval - width).children('img').css('width', width);
                    {
                        $(this).animate({
                            'top': i * interval + (aw - nw),
                            'width': nw,
                            'height': nw
                        }, d, function(){
                        
                        });
                    }
                });
           }
              
              
        }
        
        var sizeH = thisObj.height();
        var sizeW = thisObj.width();
        
        
        var _handler = function(){

            var items = $(this).children('.menuItem');

            $(window).resize(function(){
                if(sizeH==thisObj.height()&& sizeW==thisObj.width())
                return;       
                sizeH = thisObj.height();
                sizeW = thisObj.width();
                doCircleAnim({dur:0});
            });

            items.each(function(i, d){
                $(this).attr('circleIndex', i);
            });
            
            //initially animation
            //expandCircle;
           // thisObj.fadeOut(0);
            doCircleAnim({init:true, dur:500});
           // thisObj.fadeIn(300);

            //bind click event
            items.click(function(){
                var indexOffset = selectedIndex - $(this).attr('circleIndex');
                
                if (selectedIndex == $(this).attr('circleIndex')) 
                    return;
                selectedIndex = parseInt($(this).attr('circleIndex'));

                doCircleAnim();
                
            }).mouseenter(function(){
                $(this).addClass('hover');
            }).mouseleave(function(){
                $(this).removeClass('hover');
            })
            return this;
        };
        
         thisObj.bind('circleChange', function(e, item){
            $(item).css('z-Index', 500);
            settings.naviCompleted();
        });
        
        thisObj.bind('beforeCircleChange', function(e, item){
            $(this).children('.menuItem').removeClass('selected');
            $(item).addClass('selected')
        });
        
        
        return this.each(_handler);
    };
})(jQuery);

