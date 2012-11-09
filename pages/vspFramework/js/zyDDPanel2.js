
;
(function($){

    $.fn.zyDDPanel = function(settings){
    
        defaultSettings = {
            columns: '.column',
            widgetSelector: '.widget',
            handleSelector: '.widget-head',
            contentSelector: '.widget-content',
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
        var addWidgetControls = function(){
        
        
            $(_settings.widgetSelector, $(_settings.columns)).each(function(){
                var thisWidgetSettings = getWidgetSettings(this);
                
                if (thisWidgetSettings.removable) {
                    var panel = $(this);
                    
                    $('<a href="#" class="remove" title="Close Widget">CLOSE</a>').mousedown(function(e){
                        e.stopPropagation();
                    }).click(function(){
                    /*
                        $("<div class='win_warning'>This widget will be removed.</div>").dialog({
                           model: true,
                            buttons: {
                                Ok: function(){
                                    panel.animate({
                                        opacity: 0
                                    }, function(){
                                        panel.wrap('<div/>').parent().slideUp(function(){
                                            panel.remove();
                                        });
                                    });
                                    
                                    $(this).dialog('close');
                                },
                                Cancel: function(){
                                    $(this).dialog('close');
                                }
                            }
                        }).dialog('open');
                        */
                        $('#myModal').modal({
                        
                        
                        });
                         $('#myModal .ok').click(function(){
                                    panel.animate({
                                        opacity: 0
                                    }, function(){
                                        panel.wrap('<div/>').parent().slideUp(function(){
                                            panel.remove();
                                        });
                                    });
                              $('#myModal').modal('hide');      
                         });
                        
                         $('#myModal .cancel').click(function(){

                              $('#myModal').modal('hide');      
                         });
                         
                        return false;
                    }).appendTo($(_settings.handleSelector, this));
                }
                
                
                if (thisWidgetSettings.refreshable) {
                    $('<a href="#" class="refresh" title="Refresh Widget">REFRESH</a>').mousedown(function(e){
                        e.stopPropagation();
                    }).click(function(e){
                        $(this).trigger('refresh', $(this).parents('.widget'));
                    }).appendTo($(_settings.handleSelector, this));
                }
                
                
                if (thisWidgetSettings.settingable) {
                    $('<a href="#" class="setting" title="Edit Widget">SETTING</a>').mousedown(function(e){
                        e.stopPropagation();
                    }).click(function(e){
                        $(this).trigger('setting', $(this).parents('.widget'));
                    }).appendTo($(_settings.handleSelector, this));
                }
                
                if (thisWidgetSettings.collapsible) {
                
                    $('<a href="#" class="collapse ">COLLAPSE</a>').mousedown(function(e){
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
                    }).appendTo($(_settings.handleSelector, this));
                    
                }
            });
        };
        
        
        var makeSortable = function(){
        
        
            $sortableItems = (function(){
                var notSortable = '';
                $(_settings.widgetSelector, $(_settings.columns)).each(function(i){
                    if (!getWidgetSettings(ddPanelObj).movable) {
                        if (!this.id) {
                            this.id = 'widget-no-id-' + i;
                        }
                        notSortable += '#' + this.id + ',';
                    }
                });
                
                
                return notSortable != '' ? $('> li:not(' + notSortable + ')', _settings.columns) : $('li', _settings.columns);
                
            })();
            
            $sortableItems.find(_settings.handleSelector).css({
                cursor: 'move'
            })
            
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
        
        var _handler = function(setting){
          //  attachStylesheet('zyDDPanel.js.css');
            addWidgetControls();
            makeSortable();
        };
        
        return this.each(_handler);
        
    };
    
    
})(jQuery);
