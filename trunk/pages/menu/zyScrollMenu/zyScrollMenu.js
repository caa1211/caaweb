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
            parseJson: 'menu.json',
			itemsNumPerPage: 5
        }
        var menuContainer;
        var _settings = $.extend(_defaultSetting, settings);
        var itemAry = [];
		var defaultPage;
        this.scrollPrev = function(){
             /*   $container.scrollTo( {top:'+='+itemH, left:'+=0'}, 800, function(){
                  //  debugger;
                   var firstItem= menuContainer.find('.menuItem:first-child')
                   firstItem.empty().remove();
                } );*/
                  if(menuContainer.attr('isAnim')!=undefined && menuContainer.attr('isAnim')=='true')
                   return;
                  var firstItem= menuContainer.find('.menuItem:first-child');
               
                 
                   
                   menuContainer.attr('isAnim', 'true');
                   
                   firstItem.hide(300, function(){
                       $(this).empty().remove();
                       menuContainer.attr('isAnim', 'false');
                       var lastItem= menuContainer.find('.menuItem:last-child');
                       var itemIndex = parseInt(lastItem.attr('scrollIndex'));
                       menuContainer.append(itemAry[(itemIndex+1) %itemAry.length].clone(true));
                   })
                
        };
        
        this.scrollNext = function(){
             var firstItem= menuContainer.find('.menuItem:first-child');
 
                   var itemIndex = parseInt(firstItem.attr('scrollIndex'));
                   var prependItem = itemAry[(itemIndex-1+itemAry.length)%itemAry.length].clone(true);
                   prependItem.hide(0);
                   menuContainer.prepend(prependItem);
                   
                   prependItem.attr('isAnim', 'true').show(300, function(){
                          var lastItem= menuContainer.find('.menuItem:last-child');
                       lastItem.empty().remove();
                   });
                /*   firstItem.hide(300, function(){
                       $(this).empty().remove();
                       var itemIndex = parseInt(lastItem.attr('scrollIndex'));
                       menuContainer.append(itemAry[(itemIndex+1) %itemAry.length].clone());
                   })*/
                
        };
        
        var itemW, itemH;
       
        var $container = $(this);
        var _handler = function(){
         
			var dPageIndex = 0;
            $.ajaxSettings.async = false;
			menuContainer = $('<ul class="scrollMenu"></ul>');
			
            $.getJSON(_settings.parseJson, function(data){

	              var indexCounter=0;
                  $.each(data, function(i, item){ 
                    if(i=='defaultPage') {defaultPage = item;return; }//set default page
                    
                    var menuItem =  $('<li class="menuItem"></li>');
					menuItem.attr('id', i);
					menuItem.attr('scrollIndex', indexCounter);
                    indexCounter++;
                    var menuItemA = $('<a></a>'); 
                    menuItemA.html(item.title);
                    //to do A link
                    
					//parse SubMenu
					//if()

                    menuItem.append(menuItemA);
                   // menuContainer.append(menuItem);
				   menuItem.click(function(){
				  // $(this).css('border', 'solid 1px blue')
				// $container.stop().scrollTo( $(this) ,800 );
				
				var itemOffset = parseInt($(this).attr('itemfst'));
			//	alert(itemOffset)
				
				 /* menuContainer.animate( { 'top': "-=" +itemHeight*itemOffset}, 2000, function(){
				  
				  
				  });*/
				  
//				  alert($(this).css('border')
				   
				   });
				   
                    itemAry.push(menuItem);
					
					if(i==defaultPage.split('-')[0])
					dPageIndex = itemAry.length -1 ;
                  });
               
              // debugger;
               // $container.append(menuContainer);
               // $container.prepend(menuContainer.clone(true));
            });
            $.ajaxSettings.async = true;

		//	debugger;
			var bfr  = Math.min( parseInt(itemAry.length / 2), parseInt(_settings.itemsNumPerPage / 2) );
		
			var itemLength =itemAry.length;
			
		    menuContainer.append(itemAry[dPageIndex]);
			
			for(var i =0 ; i<  bfr*2 ; i++)
			{
			  var aItem = itemAry[(dPageIndex+1+i)%itemLength].clone(true);
			  aItem.attr('itemfst', i+1 );
			  menuContainer.append(aItem);
			
			  var bItem = itemAry[(dPageIndex-1-i+itemLength)%itemLength].clone(true);
			  bItem.attr('itemfst', -i-1 );
			  menuContainer.prepend(bItem);
			}
			
			menuContainer.find('li.menuItem:eq('+ parseInt(bfr*2) +')').css('border', 'solid 2px black');
			
			//var $centerDiv = $('<div></div>')
			//var containerPos = $container.position();
			//$centerDiv.height(300).css('border', 'solid 1px blue').css('margin-top', $container.height()/2 + containerPos.top)
			//$centerDiv.append(menuContainer);
			$container.append(menuContainer);
			
			
			var $scrollTarget = $container.find('li.menuItem:eq('+ bfr +')');
			//$scrollTarget.css('border', 'solid 2px black')
            itemW = $scrollTarget.width();
            itemH = $scrollTarget.height();
			$container.stop().scrollTo( $scrollTarget , 0 );
			//$container.height = 
			//var itemHeight = menuContainer.find('.menuItem').height();
		//	menuContainer.stop().animate( { 'top': "-=" +itemHeight*bfr}, 0);
			//menuContainer.animate({'top':'+=100px'}, 800)
			
			
			
			
        };
        var scrollMenu = this.each(_handler);
        return scrollMenu;
    };
})(jQuery);


