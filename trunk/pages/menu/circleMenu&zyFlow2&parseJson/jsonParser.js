/*
 * jsonParser.js
 *
 * Copyright (c) 2010 
 * Joze Chang
 *
 * Dual licensed under the GPL (http://www.gnu.org/licenses/gpl.html)
 * and MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 *
 * $Date: 2010-02-04 $
 * $Rev: 001 $
 * 
 */

(function($)
{
    $.jsonParser = function(settings){
     
       var defaultSetting = 
       {
           jsonUrl:'menu.json',
           menuId: 'menu'
           
       }
       var thisObj = $('<div></div>');
       var jsonObj;
        settings = $.extend(defaultSetting , settings);

       function doSubmenu(parentItem, subItem){
           
           /* target html
             <div id="music_SM" class="subMenu"  targetId="music"> 
             <div class='title'>music</div>
             <ul>
                 <li><a href="#" >Folder</a></li>
                 <li><a href="#">Album</a></li>
                 <li><a href="#">Artist</a></li>
                 <li><a href="#">Genre</a></li>
                 <li><a href="#">All</a></li>
                 <li><a href="#">Now Playing</a></li>
             </ul>
             </div>
            */
           
           var id = parentItem.i + '_sm';
           var subMenu = $('<div class="subMenu"></div>');
           subMenu.attr('id', id);
           subMenu.attr('targetId', parentItem.i);
           
           //title
           var titleDiv = $('<div></div>');
           titleDiv.html(parentItem.item.title);
           subMenu.append(titleDiv);

           var ul= $('<ul></ul>');
           
           $.each(subItem, function(i, item){
                   var li= $('<li></li>');
                   li.attr('id', parentItem.i+'_'+i)
                    var aa = $('<a></a>');
                    aa.attr('href', item.url).html(item.title);
                    li.append(aa)
                    ul.append(li);
                });
               subMenu.append(ul);
               return subMenu;
            }

            var defaultItem;
            var dIndex=0;
            this.getIndex = function(){
                return dIndex;
            }
        
        var _handler = function(){
            var parseCounter = 0;
            $.ajaxSettings.async = false;
            
            $.getJSON(settings.jsonUrl, function(data){
                jsonObj=data;
         
                var menuDiv = $('<div></div>');
                menuDiv.attr('id', settings.menuId);
                var subMenuGroup = $('<div></div>');
                
                $.each(data, function(i, item){
                
                    if (i == 'default') {
                        defaultItem = item;
                        return;
                    }//set default page
                   
                    var menuItem = $('<a class="menuItem"></a>');
                    menuItem.attr('id', i);
                    menuItem.attr('menuTitle', item.title);
                    //off img
                    var menuItemImg = $('<img></img>');
                    menuItemImg.addClass('img off').attr('src', item.switchImg.off);
                    menuItem.append(menuItemImg);
                    //on img
                    menuItemImg = $('<img></img>');
                    menuItemImg.addClass('img on').attr('src', item.switchImg.on);
                    menuItem.append(menuItemImg);
              
                    if (i == defaultItem) {
                        dIndex = parseCounter;
                    }
                    
                    //do subMenu
                    if (item.submenu != undefined) {
                        menuItem.attr('subMenu', i+'_sm');
                        var subMenu = doSubmenu({
                            i: i,
                            item: item
                        }, item.submenu);
                        
                        subMenuGroup.append(subMenu);
                    }

                    parseCounter++;
                    menuDiv.append(menuItem);
                    menuDiv.append(subMenuGroup);
                    
                });
                
                    thisObj.append(menuDiv);
                    thisObj.append(subMenuGroup);
                    
                
            });
            $.ajaxSettings.async = true;
        };
      
       _handler();
      
       this.getHtmlWrap= function(){return thisObj.children();}
      
        return this;
    };
 

})(jQuery);


