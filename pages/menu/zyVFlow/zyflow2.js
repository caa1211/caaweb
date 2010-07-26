/*
 * zyScrollMenu.js
 *
 * Copyright (c) 2010
 * zyxe.com
 *
 * licensed under the GPL (http://www.gnu.org/licenses/gpl.html)
 *
 */
(function($){

    $.fn.zyflow2 = function(settings){
        var $container = $(this);
        $container.addClass('zyflow2');
     
        var selectedItem;
        
        var _defaultSetting = {
            parseJson: 'menu2.json',
            interval: {height: 150},
            dur:150,
			height:'50%',
            selectedPos: 0.5 //int: set position, float: set percentage
        }

        var beginIndex = 0;
        var _settings = $.extend(_defaultSetting, settings);
        var itemLength;  
        var dur = _settings.dur;
      

        this.prev = function(num){

        };
        
        this.next = function(num){
  
        };

        
     
        function naviMenuToCenter(){  
            selectedItem.addClass('selected');
            
            var containerCenter;
            if(_settings.selectedPos<1)
            containerCenter=$container.height()*_settings.selectedPos;
            else
            containerCenter = _settings.selectedPos;
           
            var centerTop = parseInt(containerCenter);
          
          /*  selectedItem
            .css('top', centerTop)
            .css('zIndex', itemLength);
            ;
            */
           
            var cIndex = selectedItem.attr('flowIndex');
        
         
            $container.find('.menuItem').each(function(i, d){
                
                var index = $(this).attr('flowIndex');
                var flowOrder = index - cIndex;
                
         //  var nwidth = nheight = _settings.interval.height -  Math.abs(flowOrder) * 30;
        // var  size = Math.round(_settings.interval.height -  Math.abs(flowOrder) * 30);
          
        // alert(Math.sin((Math.PI*flowOrder)/(itemLength)))
              size = Math.round(150*Math.cos(Math.PI* flowOrder/(itemLength*2)) );
                 
                $(this)
                //.css('top', centerTop + 80*flowOrder -  (_settings.interval.height-Math.abs(flowOrder) * 20)/2)
                //.css('right', 50*Math.abs(flowOrder))
                .css('top', centerTop +  200*Math.sin((Math.PI*flowOrder)/(itemLength*2))- size/2)
                .css('left',10+100*Math.cos((Math.PI*flowOrder)/(itemLength*2)))
                .css('zIndex',itemLength - Math.abs(flowOrder) )
                .css('width' , size )
                .css('height',size)
                ;
            })
   
        }

        var _handler = function(){
            $.ajaxSettings.async = false;
          
            function doSubMenu($liObj, jsonitem){
                var subMenuItems = $('<ul></ul>');
                subMenuItems.addClass('subMenuItems');
                $.each(jsonitem, function(i, item){
                    
                    var menuItem = $('<li class="subMenuItem"></li>');
                    menuItem.attr('id', i);
                    var menuItemA = $('<a></a>');
                    menuItemA.attr('href', '#');
                    menuItemA.html(item.title);
                    menuItem.append(menuItemA);
                    subMenuItems.append(menuItem);
              
                });
                $liObj.append(subMenuItems);
            }
            
            var itemCounter=0;
            
            $.getJSON(_settings.parseJson, function(data){
                $.each(data, function(i, item){
                    if (i == 'defaultPage') {
                        defaultPage = item;
                        return;
                    }//set default page
                    var menuItem = $('<li class="menuItem"></li>');
                    menuItem.attr('id', i);
                    var menuItemA = $('<a></a>');
                    menuItemA.html(item.title);
                    menuItem.append(menuItemA);
                    menuItem.attr('flowIndex', itemCounter);

                    if (i == defaultPage.split('-')[0]) 
                        selectedItem = menuItem;
                    
                    if (item.submenu != undefined) {
                        doSubMenu(menuItem, item.submenu);
                    }
                        
                    menuItem.css('top', itemCounter*_settings.interval.top);   
                    $container.append(menuItem); 
           
                    itemCounter++;
                });   
            });
            $.ajaxSettings.async = true;
            itemLength=itemCounter;
            naviMenuToCenter();
			
			$(window).resize(function(){
		   //  $container.empty();
             //do animate to the center
             naviMenuToCenter();
		    });
			
			
			 $container.bind('naviChange', function(e, item){
                 $(e.currentTarget).children('.menuItem').removeClass('selected');
                 $(item).addClass('selected');
                 });
        };
        
        var zyFlowApi = this.each(_handler);
        return zyFlowApi;
    };
})(jQuery);


