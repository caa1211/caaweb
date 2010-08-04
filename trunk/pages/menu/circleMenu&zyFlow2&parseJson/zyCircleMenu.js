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

       var x = Math.sin(a) * this.radius*this.xp + this.center[0];
       var y = Math.cos(a) * this.radius*this.yp + this.center[1];
       var size = parseInt(this.diff*Math.sin(a)+this.baseSize); //

       return {top: y + "px", left: x + "px",
         width:size+"px",
         height: size+"px", 
         'zIndex':size, 
         'opacity': size/100
         }
     } 
   };
       
  $.fx.step.path = function(fx){
    var css = fx.end.css(1 - fx.pos)
    for(var i in css) 
      fx.elem.style[i] = css[i];
  }
  
 //--------------------------------- 

    $.fn.zyCycleMenu = function(settings){
        var defaultSetting = {
            selectedAngle: 100,
            selectedIndex: 3,
            radiusRate: 0.25,
			autoResize: true,
            center: ['20%', '42%'],
            baseWH:854,
            circleParam:{
               xp:(3/5),
               yp:1.2 ,
               diff:65,
               baseSize:130
            },
            naviCompleted: function(){
            },
            dur: 900,
			easing: 'easeOutBack',
            invert: false //true- next is in up; false - next is in bottom
        }
        settings = $.extend(defaultSetting, settings);
        
        var itemLength = $(this).find('.menuItem').length;
		var dradius = parseFloat(settings.circleParam.baseSize * itemLength * settings.radiusRate);
		var dsize = settings.circleParam.baseSize;
        var radius = dradius;
        var interval = 360 / itemLength;
        var selectedIndex = settings.selectedIndex;
        var invert = settings.invert?1:-1;
        var thisObj = $(this);
        var baseSize = settings.circleParam.baseSize;
		
        this.getIndex = function(){ return selectedIndex; };
        this.getActivedItem= function(){
            return   $(this).children('.menuItem[circleIndex='+selectedIndex+']')
        };
        
        this.naviTo = function(index){
             var num = parseInt(index+itemLength)%itemLength;
             $(this).children('.menuItem[circleIndex='+num+']').trigger('click');
        };
    
        this.next = function(){
            this.naviTo(selectedIndex+1);
        };
        
        this.prev = function(){
             this.naviTo(selectedIndex-1);
        };
     
        
       function doCircleAnim(param/*items, origent, startAngle, offset, callback*/){  
 
        var center = [];
        for(var i=0; i<2; i++)
        {
            var ary =  settings.center[i].toString().split('%');
             if ( ary.length != 1) {
                 var target= i==0 ? thisObj.width(): thisObj.height();
                 center[i]= target* (parseInt(ary[0])/100);
             }  
             else
                center[i] = parseInt(ary[0]);
        }

		   if(settings.autoResize){
		    baseSize = param.baseSize ==undefined? baseSize :param.baseSize ;
			baseSize = baseSize<settings.circleParam.diff ? settings.circleParam.diff: baseSize
	        radius =parseFloat(baseSize* itemLength * settings.radiusRate);
		   }
			
            param.items.each(function(i, item){
                
                var startAngle = param.startAngle == undefined ? parseFloat($(this).attr('angle')) : param.startAngle;
                var offset = param.offset == undefined ? invert*(i-selectedIndex) : param.offset;
                var end = param.end == undefined ? interval * offset + startAngle : param.end;
                var origent = param.origent == undefined ? "CCW" : param.origent;
                var dur = param.dur==undefined? settings.dur: param.dur;

                var arc_params = $.extend({},settings.circleParam,{
                    center:center,//settings.center,
                    radius: radius,
                    start: startAngle,
                    end: end,
                    dir: origent == "CCW" ? 1 : -1,
					baseSize: baseSize
                });
                
                $(this).attr('angle', parseFloat(arc_params.end + 360) % 360);
                
               if ($(this).attr('circleIndex') == selectedIndex) 
                    thisObj.trigger('beforeCircleChange', $(this));
                    
                var pathAry = new $.path.arc(arc_params);

                $(this).stop().animate({
                    path: pathAry
                }, dur, settings.easing, function(){
                    if ($(this).attr('circleIndex') == selectedIndex) {
                        thisObj.trigger('circleChange', $(this));
                      
                        if(param.callback!=undefined)
                        param.callback();
                    }
                });
            });
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
				
				var baseSizeM = parseFloat(dsize * $(window).height()/settings.baseWH)
					
                doCircleAnim({
                    items: items,
                    offset: 0,
                    dur:0,
					baseSize: baseSizeM
                });
            });

            items.each(function(i, d){
                $(this).attr('circleIndex', i);
            });
            
            //initially animation
            //expandCircle;
            var origentA=settings.invert?'CCW':'CW';
			
			var baseSizeM = parseFloat(dsize * $(window).height()/settings.baseWH);

            doCircleAnim({
                items: items,
                origent: origentA,
                startAngle: settings.selectedAngle,
					baseSize: baseSizeM
            });
            
            //bind click event
            items.click(function(){
                var indexOffset =  invert*(selectedIndex-$(this).attr('circleIndex'));
                
                if (selectedIndex == $(this).attr('circleIndex')) 
                    return;
                
                selectedIndex = parseInt($(this).attr('circleIndex'));

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
        
       
        
        this.collapse = function(){
            thisObj.stop();
            doCircleAnim({
                items: $(this).children('.menuItem'),
                end: settings.selectedAngle,
                origent: "CW"
            })
        }
        
        this.expand = function(){
            var items = $(this).children('.menuItem');
            items.attr('angle',  settings.selectedAngle);
            doCircleAnim({
                items:  items,
                start: settings.selectedAngle
            })
        }

        thisObj.bind('circleChange', function(e, item){
            $(item).css('z-Index', 500);
            settings.naviCompleted();
        });
        
        thisObj.bind('beforeCircleChange', function(e, item){
            $(this).children('.menuItem').removeClass('selected');
            $(item).addClass('selected');
        });
        
        return  this.each(_handler);
    };
})(jQuery);


