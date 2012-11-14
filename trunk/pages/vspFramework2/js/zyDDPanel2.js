//for test

;
(function($){

        
        
    $.fn.insertAt = function(index, element) {
      var lastIndex = this.children().size()
      if (index < 0) {
        index = Math.max(0, lastIndex + 1 + index)
      }
      this.append(element)
      if (index < lastIndex) {
        this.children().eq(index).before(this.children().last())
      }
      return this;
    }  


    $.fn.zyDDPanel = function(settings){
    
        var portletPool = {};
        var portletPosMap = [];
        
        defaultSettings = {
            columns: '.column',
            widgetSelector: '.widget',
            handleSelector: '.widget-head',
            contentSelector: '.widget-content',
            editSelector: ".edit-box",
            loadTrunk: "#loadTrunk",
            widgetDefault: {
                movable: true,
                removable: true,
                refreshable: true,
                settingable: true,
                collapsible: true
            },
            widgetIndividual: {
                noSetting: {
                    settingable: false
                },
                noRefresh: {
                    refreshable: false
                },
                noRemove: {
                    removable: false
                },
                noCollapse: {
                    collapsible: false
                },
                noMove: {
                    movable: false
                }
            }
        }
        
        var _settings = $.extend(defaultSettings, settings);
        
        var $loadTrunk = $(_settings.loadTrunk);
        var $columns = $(".column");
        
        var getWidgetSettings = function(widget){
        
            var returnSettings = _settings.widgetDefault;
            
            $.each(_settings.widgetIndividual, function(i, val){
                if ($(widget).hasClass('widget') && $(widget).hasClass(i)) {
                    returnSettings = $.extend({}, returnSettings, val);
                }
            });
            return returnSettings
        };
        
        var attachStylesheet = function(href){
            var $ = this.jQuery;
            var $head = $('head');
            var $styleSheet = $('<link href="' + href + '" rel="stylesheet"/>').appendTo($head);
            return $styleSheet.attr('type', 'text/css');
        };
        
        var $ddPanelObj = $(this);
        
        
        function setWidget($widget){
            var thisWidgetSettings = getWidgetSettings(widget);
            //var $widget = $(widget);
            var widget = $widget[0];
            $widget.doRemove = function(){
                $(this).trigger('remove');
                var pltid =  $(this).attr('pltid');
                $(this).remove();
                try{
                    delete portletPool[pltid];
                }catch(e){}
                update2PortletPosMap();
            };
            
            $widget.updateIsExpanded = function(flag){
                    update2PortletPool($(this), {expand: flag});
            };
            
           if (thisWidgetSettings.removable && $widget.find("a.remove").length == 0) {
                $('<a href="#" class="remove" title="Close Widget">CLOSE</a>').mousedown(function(e){
                        e.stopPropagation();
                    }).click(function(){
                    
                        $('#myModal').modal({
                        
                        
                        });
                         $('#myModal .ok').click(function(){
                                    $widget.animate({
                                        opacity: 0
                                    }, function(){
                                        $widget.slideUp(function(){
                                            $widget.doRemove();
                                        });
                                    });
                              $('#myModal').modal('hide');      
                         });
                        
                         $('#myModal .cancel').click(function(){

                              $('#myModal').modal('hide');      
                         });
                         
                        
                        return false;
                    }).appendTo($(_settings.handleSelector, widget));
                    
                }
                
                
                if (thisWidgetSettings.refreshable && $widget.find("a.refresh").length == 0) {
                    $('<a href="#" class="refresh" title="Refresh Widget">REFRESH</a>').mousedown(function(e){
                        e.stopPropagation();
                    }).click(function(e){
                       $widget.trigger('refresh');
                    }).appendTo($(_settings.handleSelector, widget));
                }
                
                
                if (thisWidgetSettings.settingable && $widget.find("a.setting").length == 0) {
                
                    $('<a href="#" class="setting" title="Edit Widget">SETTING</a>').mousedown(function(e){
                        e.stopPropagation();
                    }).click(function(e){
                       $widget.trigger('setting');
                    }).toggle(function(){
                        
                        var kk = $(this);
                        $(this).parents(_settings.widgetSelector).find(_settings.editSelector).slideDown({
                            duration: 150,
                            easing: 'easeInQuad',
                            complete: function(e){
                            }
                        });
                        return false;
                    }, function(){
                        $(this).parents(_settings.widgetSelector).find(_settings.editSelector).slideUp({
                            duration: 150,
                            easing: 'easeOutQuart',
                            complete: function(e){
                            }
                        });
                        return false;
                    }).appendTo($(_settings.handleSelector, widget));
                }
                
                if (thisWidgetSettings.collapsible && $widget.find("a.collapse").length == 0&& $widget.find("a.expand").length == 0) {
                
                    $('<a href="#" class="collapse">COLLAPSE</a>').mousedown(function(e){
                        e.stopPropagation();
                    }).toggle(function(e, time){
                    
                        var dur = time == undefined? 150 : 0;
                        var kk = $(this);
                     
                        $widget.find(_settings.contentSelector).slideUp({
                            duration: dur,
                            easing: 'easeOutQuart',
                            complete: function(e){
                                kk.removeClass('collapse').addClass('expand');
                                $widget.updateIsExpanded(false);
                            }
                        });
                        return false;
                    }, function(e, time){
                        var dur = time == undefined? 150 : 0;
                        var kk = $(this);
                       
                        $widget.find(_settings.contentSelector).slideDown({
                            duration: dur,
                            easing: 'easeInQuad',
                            complete: function(e){
                                kk.removeClass('expand').addClass('collapse');
                                $widget.updateIsExpanded(true);
                            }
                        });
                        return false;
                    }).appendTo($(_settings.handleSelector, widget));
                    
                }
            }
            
        var addWidgetControls = function(){
            $(_settings.widgetSelector, $(_settings.columns)).each(function(){ setWidget( $(this) );});
        };
        
        var $sortableItems;
        var makeSortable = function(isUpdate2PortletPosMap){
            $sortableItems = (function(){
                /*
                var notSortable = '';
                
                $(_settings.widgetSelector, $(_settings.columns)).each(function(i){
                      // debugger;
                    if (!getWidgetSettings(this).movable) {
                        if (!this.id) {
                            this.id = 'widget-no-id-' + i;
                        }
                        notSortable += '#' + this.id + ',';
                    }
                });
                
                
                var $items = notSortable != '' ? $('> li:not(' + notSortable + ')', _settings.columns) : $('li', _settings.columns);
                return $items;
                */
                
                $items = $('li', _settings.columns).filter(function(){
                    if (!getWidgetSettings(this).movable) {
                        if (!this.id) {
                            this.id = 'widget-no-id-' + i;
                        }
                        return false;
                    }else{
                        return true;
                    }
                });
                return $items;
                
            })();
            
            $sortableItems.find(_settings.handleSelector).css({
                cursor: 'move'
            });
            
            $(_settings.columns).sortable({
                items: $sortableItems,
                connectWith: $(_settings.columns),
                handle: _settings.handleSelector,
                placeholder: 'widget-placeholder',
                forcePlaceholderSize: true,
                revert: 300,
                opacity: 0.8,
                containment: 'document',
                start: function(e, ui){
                    $(ui.helper).addClass('dragging');
                },
                stop: function(e, ui){
                    $(ui.item).css({
                        width: ''
                    }).removeClass('dragging');
                    $(_settings.columns).sortable('enable');
                    update2PortletPosMap();
                }
            });
            
            if(isUpdate2PortletPosMap == true){       
                update2PortletPosMap();
            }
        }

        addWidgetControls();
        makeSortable(false);
        
        
        var _portletConfDft = {
            id: "plt_",
            url: "",
            expand: true
        };

        function update2PortletPool($widget, opt){
            try{
                var pltid = $widget.attr('pltid');
                $.extend(portletPool[pltid], opt);
            }catch(e){
            }
            localStorage.setItem('portletPool',  JSON.stringify(portletPool));
        }
        
        function update2PortletPosMap(){
            portletPosMap.length = 0;
            /*
            $columns.each(function(i, t){
                var ary = [];
                $(t).find(_settings.widgetSelector).each(function(j, tt){
                    var pltid = $(tt).attr("pltid");
                    ary.push(pltid);
                });
                portletPosMap.push(ary);
            });
            */
            for(var i=0; i<$columns.length; i++){
                var $col = $columns.eq(i);
                var $widgets =  $col.find(_settings.widgetSelector);
                var ary = [];

                for(var j=0; j<$widgets.length; j++){
                   var $w = $widgets.eq(j);
                   var pltid = $w.attr("pltid");
                   ary.push(pltid);
                }
                portletPosMap.push(ary);
            }            
            localStorage.setItem('portletPosMap', JSON.stringify(portletPosMap));
        };

        
        this.addPortlet = function(opt, pos, isUpdateStore){
            var _opt = $.extend({}, _portletConfDft, opt);
            var id = _opt.id;
            var url = _opt.url + "?key=" + id;
            if(pos == undefined){
                pos = [0, 0];
            }
            var $tmpWidget = $("<span>");
            
            $($columns[ pos[0] ]).append( $tmpWidget );
            //$($columns[ pos[0] ]).insertAt(pos[1], $tmpWidget );
            
            $loadTrunk.load(url, function(){

                portletPool[_opt.id] = _opt;
                update2PortletPool();
                
               if($loadTrunk.children(".widget").length == 1){
                    var $newWidget = $loadTrunk.children(".widget");
                    $newWidget.attr('pltid', _opt.id);
                   
                    $tmpWidget.append( $newWidget );
                   
                    setWidget($newWidget);
                    
                    if(!_opt.expand){
                        $newWidget.find("a.collapse").trigger('click', 0);
                    }
                   // $(_settings.columns).sortable('cancel');
                      
                    addWidgetControls();
                    makeSortable(isUpdateStore == false ? false: true);
        
                    //--

               }
            });
        };
            
                    
        this.restorePortlet = function(pmap, ppool){

        
            for(var i = 0; i< pmap.length; i++){
                var col = pmap[i];
                for(var j = 0; j < col.length; j++){
                   try{
                    var pltid = col[j];
                    var pltDef = ppool[pltid];
                    this.addPortlet(pltDef, [i, 0] , false );
                   }catch(e){}
                }
               
            }
          
        };
        
        return this;
        
    };
    
    
})(jQuery);
