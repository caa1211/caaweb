 /*
 * zyflow2.js
 *
 * Copyright (c) 2010
 * zyxel.com
 *
 * Dual licensed under the GPL (http://www.gnu.org/licenses/gpl.html)
 * and MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 *
 * $Date: 2010-07-27 $
 * $Rev: 001 $
 * $Date: 2010-09-03 $
 * $Rev: 002 $
 */
 
;(function($){
    
 $.fn.zyflow2 = function(settings){

         var _defaultSettings = {
           interval : 110,
           normalSize : 100,
           activeSize: 170,
           center: ['30%', '20%'],
           selectedIndex: 0,
           dur: 500,
           naviCompleted: function(){},
           vertical: true,
		   easing: 'easeOutBack',
           baseWH:854
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
                
                var aw =settings.activeSize*$(window).height()/settings.baseWH;
                var nw = settings.normalSize*$(window).height()/settings.baseWH;
                var interval = settings.interval*$(window).height()/settings.baseWH;
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
                
				//init position
                if(param.init!=undefined)
                {
					if(settings.vertical)
					thisObj.css({top:center[1]+nw, left: center[0]});
					else
					thisObj.css({top:center[1], left: center[0]+nw});
				}
              // thisObj.animate({'top':center[1]- selectedIndex*interval , 'left': center[0]},d);
              if (settings.vertical == false) {
                  thisObj.stop().animate({
                      'top': center[1],
                      'left': center[0] - selectedIndex * interval
                  }, d);
                  
                  thisObj.children('.menuItem').each(function(i, data){
                      if (i < selectedIndex) {
                          $(this).stop().animate({
                              'left': i * interval,
                              'width': nw,
                              'height': nw
                          }, d, function(){
                          
                          });
                      }
                      if (i == selectedIndex) //$(this).css('left',i*interval).children('img').css('width', middleInterval);
                    {
                        thisObj.trigger('beforeCircleChange', $(this));
                        
                        $(this).stop().animate({
                            'left': i * interval,
                            'width': aw,
                            'height': aw
                        }, d, settings.easing, function(){
                            thisObj.trigger('circleChange', $(this));
                        });
                    }
                    if (i > selectedIndex) //$(this).css('left',i*interval + middleInterval - width).children('img').css('width', width);
                    {
                        $(this).stop().animate({
                            'left': i * interval + (aw - nw),
                            'width': nw,
                            'height': nw
                        }, d, function(){
                        
                        });
                    }
                });
            }
           else{  //vertical
                  thisObj.stop().animate({
                      'top': center[1] - selectedIndex * interval,
                      'left': center[0]
                  }, d);
                  
                  thisObj.children('.menuItem').each(function(i, data){
                      if (i < selectedIndex) {
                          $(this).stop().animate({
                              'top': i * interval,
                              'width': nw,
                              'height': nw
                          }, d, function(){
                          
                          });
                      }
                      if (i == selectedIndex) //$(this).css('left',i*interval).children('img').css('width', middleInterval);
                    {
                        thisObj.trigger('beforeCircleChange', $(this));
                        
                        $(this).stop().animate({
                            'top': i * interval,
                            'width': aw,
                            'height': aw
                        }, d,'easeOutBack', function(){
                            thisObj.trigger('circleChange', $(this));
                        });
                    }
                    if (i > selectedIndex) //$(this).css('left',i*interval + middleInterval - width).children('img').css('width', width);
                    {
                        $(this).stop().animate({
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

        function resizeHandler(){
            if (sizeH == thisObj.height() && sizeW == thisObj.width()) 
                return;
            sizeH = thisObj.height();
            sizeW = thisObj.width();
            doCircleAnim({
                dur: 0
            });
        }
          
        var timeoutID;
        function doNResize(){
            if (timeoutID != undefined) 
                clearTimeout(timeoutID)
            timeoutID = setTimeout(function(){
                $(window).trigger('dResize')
                
            }, 100);
        }
        
        var _handler = function(){

            var items = $(this).children('.menuItem');

            $(window).bind('resize', doNResize);
            $(window).bind('dResize', resizeHandler);

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
        
        this.destory = function(){
              this.stop().css({top: 0,left: 0});
              $(window).unbind('resize', doNResize);
              $(window).unbind('dResize', resizeHandler);
        }
        
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

