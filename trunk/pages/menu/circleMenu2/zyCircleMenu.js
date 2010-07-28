/*
 * zyCycleMenu.js
 *
 * Copyright (c) 2010
 * Joze Chang
 *
 * Dual licensed under the GPL (http://www.gnu.org/licenses/gpl.html)
 * and MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 *
 * $Date: 2010-07-27 $
 * $Rev: 001 $
 *
 */

;(function($){
/*
 * jQuery css bezier animation support -- Jonah Fox
 * version 0.0.1
 * Released under the MIT license.
 */
/*
  var path = $.path.bezier({
    start: {x:10, y:10, angle: 20, length: 0.3},
    end:   {x:20, y:30, angle: -20, length: 0.2}
  })
  $("myobj").animate({path: path}, duration)

*/
 $.path = {}

   $.path.arc = function(params) {
     for(var i in params)
       this[i] = params[i]

     this.dir = this.dir || 1

     while(this.start > this.end && this.dir > 0)
       this.start -= 360

     while(this.start < this.end && this.dir < 0)
       this.end -= 360


     this.css = function(p) {
       var a = this.start * (p ) + this.end * (1-(p ))  
       a = a * 3.1415927 / 180 // to radians

       var x = Math.sin(a) * this.radius + this.center[0];
       var y = Math.cos(a) * this.radius + this.center[1];
       var size = parseInt(x/4);

       return {top: y + "px", left: x*(2/5) + "px",
        width:size+"px", height: size+"px", 'zIndex':size, 'opacity': size/100}
     } 

   };
       
  $.fx.step.path = function(fx){
    var css = fx.end.css(1 - fx.pos)
    for(var i in css) 
      fx.elem.style[i] = css[i];
  }
  
 //--------------------------------- 
 
 
 
    $.fn.zyCycleMenu = function(settings){
        var zyCycleMenu;
        var defaultSetting = {
            selectedAngle: 90,
            selectedIndex: 0,
            radius: 'auto',
            center: [400, 300],
            naviCompleted: function(){
            },
            dur: 700
        }
        settings = $.extend(defaultSetting, settings);
        
        var itemLength = $(this).find('.menuItem').length;
        var radius = parseFloat($('.menuItem').width() * itemLength /4);
        var interval = 360 / itemLength;
        selectedIndex = settings.selectedIndex;
         var thisObj = $(this);
            
        function parseFromJson(){
        
        }
        
        this.getActivedItem= function(){
            return   $(this).children('.menuItem:nth-child('+ parseInt(selectedIndex+1) +')')
        }
        
    
        function doCircleAnim(param/*items, origent, startAngle, offset, callback*/){     
            param.items.each(function(i, item){
                
                var startAngle = param.startAngle == undefined ? parseFloat($(this).attr('angle')) : param.startAngle;
                var offset = param.offset == undefined ? (i - selectedIndex) : param.offset;
                var end = param.end == undefined ? interval * offset + startAngle : param.end;
                var origent = param.origent == undefined ? "CCW" : param.origent;
                var arc_params = {
                    center: settings.center,
                    radius: radius,
                    start: startAngle,
                    end: end,
                    dir: origent == "CCW" ? 1 : -1
                };
                
                $(this).attr('angle', parseFloat(arc_params.end + 360) % 360);
                
               if ( $(this).attr('circleIndex') == selectedIndex) 
                    thisObj.trigger('beforeCircleChange', $(this));
                    
                var pathAry = new $.path.arc(arc_params);
                
                $(this).stop().animate({
                    path: pathAry
                }, settings.dur, function(){
                    if ($(this).attr('circleIndex') == selectedIndex) {
                        thisObj.trigger('circleChange', $(this));
                        if(param.callback!=undefined)
                        param.callback();
                    }
                });
            });
        }
        
        var _handler = function(){
            parseFromJson();
            var items = $(this).children('.menuItem');
            
            items.each(function(i, d){
                $(this).attr('circleIndex', i);
            });
            
            //initially animation
            //expandCircle;
            doCircleAnim({
                items: items,
                origent: 'CCW',
                startAngle: settings.selectedAngle,
                callback: function(){}
            });
            
            //bind click event
            items.click(function(){
                var indexOffset = selectedIndex - $(this).attr('circleIndex');
                
                if (selectedIndex == $(this).attr('circleIndex')) 
                    return;
                
                selectedIndex = $(this).attr('circleIndex');

                var origent = ((itemLength + indexOffset) % itemLength < itemLength / 2) ? 'CCW' : 'CW';
                
                doCircleAnim({
                    items: items,
                    origent: origent,
                    offset: indexOffset
                });
                
            }).mouseenter(function(){
                $(this).addClass('hover');
            }).mouseleave(function(){
                $(this).removeClass('hover');
            })
            return this;
        };
        
        thisObj= this.each(_handler);
        
        this.collapse = function(){
            doCircleAnim({
                items: $(this).children('.menuItem'),
                end: settings.selectedAngle,
                origent: "CW"
            })
        }
        
        this.expand = function(){
            doCircleAnim({
                items:  $(this).children('.menuItem'),
                start: settings.selectedAngle
            })
        }

        thisObj.bind('circleChange', function(e, item){
            $(item).css('z-Index', 500);
            settings.naviCompleted();
        });
        
        thisObj.bind('beforeCircleChange', function(e, item){
          //  alert('');
            $(this).children('.menuItem').removeClass('selected');
            $(item).addClass('selected')
        });
        
        return this;
    };
    
    
})(jQuery);


