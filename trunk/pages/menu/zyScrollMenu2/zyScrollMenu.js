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

    $.fn.zyScrollMenu = function(settings){
        var $container = $(this);
        $container.addClass('scrollMenu');
        var itemArryCounter=0;
        var dAryIndex;
        var selectedItem;
        
        var _defaultSetting = {
            parseJson: 'menu.json',
            intervalTop: 100,
            dur:150,
			height:'50%'
        }
        var scrollMenu;
        var beginIndex = 0;
        var _settings = $.extend(_defaultSetting, settings);
        var itemAry = [];
        var centerTarget;
        var itemLength;  
        var dur = _settings.dur;
        function addBuffer(flag, num){
            var item;
            var flag;
            if (flag == 'PREV') {
                item = $container.children('.menuItem:last-child');
                flag = 1;
            }
            else {
                item = $container.children('.menuItem:first-child');
                flag = -1;
            }
            
            var aryIndex = parseInt(item.attr('aryIndex'));
            var top = item.position().top;
            
            for (var i = 1; i <= num; i++) {
                var order = parseInt(item.attr('scrollOrder')) + (i* flag);
                var atop = top + (flag * i * _settings.intervalTop);
                var aItem = scrollItemFactory(aryIndex + (i*flag), atop, order);
                flag == 1 ? $container.append(aItem) : $container.prepend(aItem);
            }
            
            $container.children('.menuItem').each(function(i, item){
                var order = parseInt($(this).attr('scrollOrder'));
                $(this).attr('scrollOrder', order + (-1 * flag * num));
            });
        }

        this.scrollPrev = function(num){
             if ($container.attr('isAnim') != undefined && $container.attr('isAnim') == 'true') 
                 return;
             num = num == undefined ? 1 : num;
             addBuffer('PREV', num);
               
               $container.attr('isAnim', 'true').children('.menuItem').animate({
                   'top': '-=' + _settings.intervalTop * num
               }, dur, function(){
               
                   $container.attr('isAnim', 'false');
                 
                   if ($(this).position().top + _settings.intervalTop < 0) 
                       $(this).empty().remove();
               }); 
			   
			   dAryIndex = getScrollItemIndex(dAryIndex +num);
               centerTarget =  $(this).children('.menuItem[scrollOrder=0]');
			   $container.trigger('scrollChange', centerTarget);
        };
        
        this.scrollNext = function(num){
            if ($container.attr('isAnim') != undefined && $container.attr('isAnim') == 'true') 
                return;
            num = num==undefined? 1:num;
            addBuffer('NEXT',num);
         
            $container.attr('isAnim', 'true').children('.menuItem').animate({
                'top': '+=' + _settings.intervalTop * num
            }, dur, function(){
            
                $container.attr('isAnim', 'false');
                
                if ($(this).position().top  > $container.height()) 
                    $(this).empty().remove();
            });
			
			dAryIndex = getScrollItemIndex(dAryIndex -num);
            centerTarget =  $(this).children('.menuItem[scrollOrder=0]');
			$container.trigger('scrollChange', centerTarget);
        };
		
        function getScrollItem(index){
                return itemAry[getScrollItemIndex(index)];
		}
		
		this.getSelectedItem = function(){
                return itemAry[getScrollItemIndex(dAryIndex)];
		};
		
        function getScrollItemIndex(index){
            var index;
            while(index<0)
            {
                index =index+itemLength;
            }
           return index%itemLength
        }
        
        function scrollItemFactory(index, top ,order ){
            var item =  getScrollItem(index).clone(true);
            item.css('top', top);
            item.attr('scrollOrder', order);
           
            item.bind('click', function(){
                var scrollOrder = parseInt($(this).attr('scrollOrder'));
                scrollOrder<0 ? scrollMenu.scrollNext(Math.abs(scrollOrder)) : scrollMenu.scrollPrev(Math.abs(scrollOrder))
            });
            
            return item;
        }
        
        var cssHeight;
        function buildScrollMenu(){  
          
		    itemLength = itemAry.length;
		    if(_settings.intervalTop*itemLength<$container.height())
			  $container.css('height', _settings.intervalTop*itemLength);

            var centerTop = parseInt($container.height()/2 - _settings.intervalTop /2);

            centerTarget = scrollItemFactory(dAryIndex, centerTop, 0);
            $container.append(centerTarget);
            centerTarget.addClass('selected');
            
            var tempTop = centerTop;
            var bfr = 0;
            while (tempTop > 0) {
                tempTop = tempTop - _settings.intervalTop;
                bfr++;
            }
 
          for(var i =1 ; i<=bfr ; i++)
          {
             var atop = centerTop + i* _settings.intervalTop;
             var aItem = scrollItemFactory(dAryIndex+i, atop, i);
             $container.append(aItem);

             var btop = centerTop +(-1*i)* _settings.intervalTop;
             var bItem = scrollItemFactory(dAryIndex+(-1*i), btop, (-1*i));
             $container.prepend(bItem);
         } 
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
                    
                    if (i == defaultPage.split('-')[0]) 
                        dAryIndex = itemArryCounter;

                        if (item.submenu != undefined) {
                            doSubMenu(menuItem, item.submenu);
                        }
             
                    menuItem.attr('aryIndex', itemArryCounter);
                    itemAry.push(menuItem);
                    itemArryCounter++;
                });
            });
            $.ajaxSettings.async = true;
            buildScrollMenu();
			
			$(window).resize(function(){
		     $container.empty();
		     buildScrollMenu();
		    });
			
			
			 $container.bind('scrollChange', function(e, item){
                 $(e.currentTarget).children('.menuItem').removeClass('selected');
                 $(item).addClass('selected');
                 
                 
                 });
                 
		   return this;
        };
        scrollMenu = this.each(_handler);
        return scrollMenu;
    };
})(jQuery);


