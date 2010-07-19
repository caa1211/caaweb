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
        var _defaultSetting = {
            parseJson: 'menu.json',
            intervalTop: 100,
            dur:200
        }
        var beginIndex = 0;
        var _settings = $.extend(_defaultSetting, settings);
        var itemAry = [];
        var centerTarget;
        var itemLength;  
        var dur = _settings.dur;
        function addBuffer(flag,num){

             if (flag == 'PREV') { 
             
              var lastItem= $container.children('.menuItem:last-child');
              var lastindex = parseInt(lastItem.attr('aryIndex'));
              var top = lastItem.position().top;
 
                 for (var i = 0; i < num; i++) {
                     var aItem = itemAry[(lastindex + 1 + i) % itemLength].clone(true);
                     var atop = top + (i + 1) * _settings.intervalTop;
                     aItem.css('top', atop);
                     $container.append(aItem);
                 }
             }
             else{
                
              var firstItem= $container.children('.menuItem:first-child');
              var firstindex = parseInt(firstItem.attr('aryIndex'));
              var top = firstItem.position().top;
            
                 for (var i = 0; i < num; i++) {
             
                     var arrayIndex = (firstindex-1-i+itemLength) % itemLength;
                     var aItem = itemAry[arrayIndex].clone(true);
                     var atop = top - (i +1)* _settings.intervalTop;
  
                     aItem.css('top', atop);
                     $container.prepend(aItem);
                 }
             }
        }
        
        var $container = $(this);
        $container.addClass('scrollMenu');
        
        var itemArryCounter=0;
        var dAryIndex;
        
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
        };

        function buildScrollMenu(){  
          
            itemLength = itemAry.length;
         
            var centerTop = parseInt($container.height()/2 - _settings.intervalTop /2);
         
            centerTarget = itemAry[dAryIndex].clone(true);
            centerTarget.css('top', centerTop);
            $container.append(centerTarget);
            
            var tempTop = centerTop;
            var bfr = 0;
            while (tempTop > 0) {
                tempTop = tempTop - i * _settings.intervalTop;
                bfr++
            }
            bfr = bfr+1;
           
          for(var i =0 ; i<bfr ; i++)
          {
              var aItem = itemAry[(dAryIndex+1+i)%itemLength].clone(true);
              var atop = centerTop + (i+1)* _settings.intervalTop;
              aItem.css('top', atop);
              $container.append(aItem);
     
             var bItem = itemAry[(dAryIndex-1-i+itemLength)%itemLength].clone(true);
             var btop = centerTop -(1+ i)* _settings.intervalTop;
             bItem.css('top', btop);
             
            $container.prepend(bItem);
         }
           
           
       /*    for(var i = 0; i < itemAry.length ; i++)
            {
                var top = $container.children('.menuItem').length * _settings.intervalTop;
                $container.append(itemAry[i]);
                 itemAry[i].css('top',top );
            }*/
            
            
            
        }

        var _handler = function(){
            $.ajaxSettings.async = false;
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

                    menuItem.attr('aryIndex', itemArryCounter);
                    itemAry.push(menuItem);
                    itemArryCounter++;
                });
            });
            $.ajaxSettings.async = true;
            buildScrollMenu();
        };
        
    
        
        
        var scrollMenu = this.each(_handler);
        return scrollMenu;
    };
})(jQuery);


