
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
        var portletDef = [
        
        
        ];
        
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
        
        var ddPanelObj = $(this);
        
        
        function setWidget(widget){
            var thisWidgetSettings = getWidgetSettings(widget);
            var panel = $(widget);
            
           if (thisWidgetSettings.removable && panel.find("a.remove").length == 0) {
                $('<a href="#" class="remove" title="Close Widget">CLOSE</a>').mousedown(function(e){
                        e.stopPropagation();
                    }).click(function(){
                    
                        $('#myModal').modal({
                        
                        
                        });
                         $('#myModal .ok').click(function(){
                                    panel.animate({
                                        opacity: 0
                                    }, function(){
                                        panel.slideUp(function(){
                                            panel.remove();
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
                
                
                if (thisWidgetSettings.refreshable && panel.find("a.refresh").length == 0) {
                    $('<a href="#" class="refresh" title="Refresh Widget">REFRESH</a>').mousedown(function(e){
                        e.stopPropagation();
                    }).click(function(e){
                       panel.trigger('refresh');
                    }).appendTo($(_settings.handleSelector, widget));
                }
                
                
                if (thisWidgetSettings.settingable && panel.find("a.setting").length == 0) {
                    $('<a href="#" class="setting" title="Edit Widget">SETTING</a>').mousedown(function(e){
                        e.stopPropagation();
                    }).click(function(e){
                       panel.trigger('setting');
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
                
                if (thisWidgetSettings.collapsible && panel.find("a.collapse").length == 0) {
                
                    $('<a href="#" class="collapse">COLLAPSE</a>').mousedown(function(e){
                        e.stopPropagation();
                    }).toggle(function(){
                        var kk = $(this);
                        $(this).parents(_settings.widgetSelector).find(_settings.contentSelector).slideUp({
                            duration: 150,
                            easing: 'easeOutQuart',
                            complete: function(e){
                                kk.removeClass('collapse').addClass('expand');
                            }
                        });
                        return false;
                    }, function(){
                        var kk = $(this);
                        $(this).parents(_settings.widgetSelector).find(_settings.contentSelector).slideDown({
                            duration: 150,
                            easing: 'easeInQuad',
                            complete: function(e){
                                kk.removeClass('expand').addClass('collapse');
                            }
                        });
                        
                        return false;
                    }).appendTo($(_settings.handleSelector, widget));
                    
                }
            }
            
        var addWidgetControls = function(){
            $(_settings.widgetSelector, $(_settings.columns)).each(function(){ setWidget(this);});
        };
        
        var $sortableItems;
        var makeSortable = function(){
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
                }
            });
            
           
        }

        addWidgetControls();
        makeSortable();
        
        
        var _portletConfDft = {
            id: "portlet_",
            url: "",
            pos: [0, 0]
        };
        
        this.addPortlet = function(opt){
            var _opt = $.extend({}, _portletConfDft, opt);
            var id = _opt.id;
            var url = _opt.url + "?key=" + id;

            $loadTrunk.load(url, function(){
            
               portletDef.push(opt);

               if($loadTrunk.children(".widget").length == 1){
                    var $newWidget = $loadTrunk.children(".widget");
                    $($columns[_opt.pos[0]]).insertAt( _opt.pos[1],   $newWidget );
                    setWidget($newWidget);
                    
                   // $(_settings.columns).sortable('cancel');
                      
                    addWidgetControls();
                    makeSortable();
                    
                    //--

               }
            });
        };
            
        return this;
        
    };
    
    
})(jQuery);
