     $.fn.caaShow = function(time, callback){
          /* var animateLeft = $(this).position().left;
           return $(this).css({'visibility': 'visible', "left":animateLeft+30})
           .animate({
               'left': animateLeft,
               opacity: 1
           }, time, 'easeOutBack' ,callback);*/
          
           var animateTop = $(this).position().top;
           return $(this).css({'visibility': 'visible', "top":animateTop-30})
           .animate({
               'top': animateTop,
               opacity: 1
           }, time, 'easeOutBack' ,callback);
        }

        $.fn.caaHide = function(time, callback){
            var animateLeft = $(this).position().left;
            return $(this).animate(
            {
            opacity: 0}, 
            time, 
            
            function(){
                $(this).css('visibility', 'hidden');
                callback;
            });
        }

        $.zyBRMenu = {
            modifySubMenuPos: function(panel, liObj){
                var pos = liObj.position();
                var scrollTop = liObj.parents('.scrollable')[0].scrollTop
                var atop = liObj.parents('.items').position().top;
                var scrollableTop = liObj.parents('.scrollable').position().top;
                var panelTop = pos.top - scrollTop + scrollableTop + atop;
                
                if (panelTop + panel.height() > $('.outer-west').height()) {
                    var Hoffset = 5;
                    if ($.browser.msie && ($.browser.version == "6.0")) 
                        Hoffset = 15
                    
                    panelTop = panelTop - panel.height() + liObj.height() + Hoffset;
                }
                
                panel.css('top', panelTop).css('left', liObj.width() + liObj.parent().parent().position().left);

            },
            getScrollOption: function(scrollSize){
                var scrollOption = {
                    size: scrollSize,
                    keyboard: false,
                    //activeClass: 'caaActive',
                    //easing:'easeOutQuad',//'easeOutElastic', //'easeInBack',//'easeOutElastic',
                    api: true,
                    speed: 700,
                    vertical: true,
                    clickable: false,
                    //  hoverClass: 'menuItemHover',
                    onSeek: function(){
                        scrollApi = this;
                        var index = scrollApi.getIndex();
                        
                        var size = scrollApi.getSize();
                        var visibleSize = scrollApi.getVisibleItems().length;
                        
                        if (index + visibleSize == size) 
                            $('.browse.right').addClass('disabled');
                        else 
                            $('.browse.right').removeClass('disabled');
                        
                        if (index == 0) 
                            $('.browse.left').addClass('disabled');
                        else 
                            $('.browse.left').removeClass('disabled');
                    }
                };
                
                return scrollOption;
            },
            layoutOption: {
                 center__paneSelector: ".outer-center",
                north__paneSelector: ".outer-north",
                 west__paneSelector: ".outer-west",
                west__size: 150,
                north__size: 102,
                collapsable: false,
                slidable: false,
                resizable: false,
                spacing_open:    0,       // no resizer-bar when open (zero height)
                spacing_closed:  20,
                center__onresize: function(){}
            },
            
            modifyLayout: function(){
           /*
            <div style='height:100%; border: solid 1px white; overflow: auto; position:relative; '>
                <div style='margin-top:50px; border: solid 1px blue;'>
                    <div class="browse left disabled" id="arrowright">
                        <a href="#"></a>
                    </div>
                    <div id="menuDiv" class="scrollable">
                    </div>
                    <div class="browse right" id="arrowleft">
                        <a href="#"></a>
                    </div>
                </div>
            </div>
            <div style='position:absolute; left:0px; top:0px;'>
                <div id="subMenuDiv" style="margin: 1px auto 0 auto;  position:relative;  border: solid 1px blue;">
                </div>
                <div>
                </div>
            </div>
           
           */
              var htmlObj = 
              '<div style="height:100%; border: solid 1px white; overflow: auto; position:relative; ">'+
                '<div style="margin-top:50px; border: solid 1px blue;">'+
                        '<div class="browse left disabled" id="arrowright">'+
                               '<a href="#"></a>'+
                         '</div>'+
                    '<div id="menuDiv" class="scrollable">'+
                    '</div>'+
                    '<div class="browse right" id="arrowleft">'+
                        '<a href="#"></a>'+
                    '</div>'+
                '</div>'+
              '</div>'+
           
                '<div style="position:absolute; left:0px; top:0px;">'+
                  '<div id="subMenuDiv" style="margin: 1px auto 0 auto;  position:relative;  border: solid 1px blue;">'+
                  '</div>'+
                
           ' </div>';
              
                
                $('.outer-west').append($(htmlObj));
                
            }
        };
       
       

