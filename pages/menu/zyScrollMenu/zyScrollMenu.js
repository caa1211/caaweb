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
    
        var _defaultSetting = {
            parseJson: 'menu.json'
        }
        
        var _settings = $.extend(_defaultSetting, settings);
        
        var _handler = function(){
            var $container = $(this);
            $.ajaxSettings.async = false;
            $.getJSON(_settings.parseJson, function(data){

                var menuContainer = $('<ul class="scrollMenu elements"></ul>');

                  $.each(data, function(i, item){ 
                    if(i=='defaultPage') {defaultPage = item;return; }//set default page
                    
                    var menuItem =  $('<li class="menuItem"></li>');
                    var menuItemA = $('<a></a>'); 
                    menuItemA.html(item.title);
                    menuItem.attr('id', i);
                    
                    menuItem.append(menuItemA);
                    menuContainer.append(menuItem);
                 
                  });
               
               
                $container.append(menuContainer);
           //     $container.prepend(menuContainer.clone());
            });
            $.ajaxSettings.async = true;
        };
        var scrollMenu = this.each(_handler);
        return scrollMenu;
    };
})(jQuery);


