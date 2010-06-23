        $.fn.caaShow = function(time, callback){
           var animateTop = $(this).height()*-1;
           
           if($.browser.msie&&($.browser.version == "6.0")&&!$.support.style){animateTop = animateTop+7;}
           return $(this).css({'visibility': 'visible', "top":animateTop-30}).animate({
               
               'top': animateTop,
               opacity: 1
           }, time, callback);
        }

        $.fn.caaHide = function(time, callback){
            // return $(this).fadeOut(time, callback);
            return $(this).animate(
            {'top': $(this).height() * -1 - 30,opacity: 0}, 
            time, 
            
            function(){
                $(this).css('visibility', 'hidden');
                callback;
            });
        }

        $.zyBRMenu = {
            modifySubMenuPos: function(panel, $liObj){
                $subMenuDiv= $('#subMenuDiv');
                $menuDiv = $('#menuDiv');
                $subMenuDiv.css({'top': -1*$menuDiv.height(),'width':$menuDiv.width() });
                
                var position = $liObj.position();
                var left = position.left + $liObj.parent().position().left;
                panel.css('left', left - 30);
            },
            getScrollOption: function(scrollSize){
                var scrollOption = {
                    size: scrollSize,
                    keyboard: false,
                    //activeClass: 'caaActive',
                    //easing:'easeOutQuad',//'easeOutElastic', //'easeInBack',//'easeOutElastic',
                    api: true,
                    speed: 700,
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
                south__paneSelector: ".outer-south",
                north__paneSelector: ".outer-north",
                north__size: 102,
                south__size: 112,
                collapsable: false,
                slidable: false,
                resizable: false,
                spacing_open: 0,
                spacing_closed: 20,
                center__onresize: function(){
                }
            },
            modifyLayout: function(){
                var htmlObj = 
                '<div class="menu_position">' +
                '<div class="menu_frame">' +
                '<div class="browse left disabled" id="arrowright" ><a href="#"></a></div>' +
                ' <div id="menuDiv" class="scrollable"></div>' +
                '<div class="browse right" id="arrowleft"><a href="#"></a></div>' +
                '</div>' +
                
                '<div id="subMenuDiv" style="margin: 1px auto 0 auto;  position:relative;  z-index:10000;"></div>' +
                ' </div>';
                
                // var htmlObj = '<button>aaa</button>'
                
                $('.outer-south').append($(htmlObj));
                
            }
        };
       
       

