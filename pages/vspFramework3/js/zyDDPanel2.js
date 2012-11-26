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

    /*
    event trigger: 
        doRemove
        refresh
        setting
        fullscreen
        fullscreenOn
        fullscreenOff
    */
    $.fn.zyDDPanel = function(settings){
    
        var portletPool = {};
        var portletPosMap = [];
        
        defaultSettings = {
            update2PortletPool: function(){},
            update2PortletPosMap: function(){},
            columns: '.column',
            widgetSelector: '.widget',
            handleSelector: '.widget-head',
            contentSelector: '.widget-content',
            editSelector: ".edit-box",
			confirmRemoveModal: "#confirmRemoveModal",
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
        var $confirmRemoveModal = $(_settings.confirmRemoveModal);
        var $confirmRemoveModal_ok = $(_settings.confirmRemoveModal).find('.ok');
        var $confirmRemoveModal_cancel = $(_settings.confirmRemoveModal).find('.cancel');
        var $loadTrunk = $(_settings.loadTrunk);
        var $columns = $(".column");                  
        var btnGup = ''+
           '<div class="btn-toolbar" style="float:right; opacity:0.6; margin-top:3px; margin-right:3px;" >'+
            '<div class="btn-group" style="" >'+
               '<button class="btn btn-inverse btn-mini" type="setting" title="Setting" style="line-height:10px;"><i class="icon-white icon-cog"></i></button>'+
               '<button class="btn btn-inverse btn-mini"  type="refresh" title="Refresh" style="line-height:10px;"><i class="icon-white icon-refresh"></i></button>'+
            '</div>'+
            '<div class="btn-group"  style="" >'+
               '<button class="btn btn-mini" type="collapse" title="Collapse" style="line-height:10px;"><i class=" icon-chevron-up"></i></button>'+
               '<button class="btn btn-mini" type="fullscreen" title="Full screen" style="line-height:10px;"><i class="icon-fullscreen"></i></button>'+
               '<button class="btn  btn-mini" type="remove" title="Remove" style="line-height:10px;" ><i class=" icon-remove"></i></button>'+
            '</div>'+ 
            '</div>';
            
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
		    var widget = $widget[0];
            var thisWidgetSettings = getWidgetSettings(widget);
            //var $widget = $(widget);

            /*$widget.on('destroy',function(){
                //$(this).trigger('destroy');
                var id =  $(this).attr('id');
                $(this).remove();
                try{
                    delete portletPool[id];
                }catch(e){}
                update2PortletPosMap();
            });*/
			/*
			$widget.doRemove = function(){
                $(this).trigger('destroy');
                var id =  $(this).attr('id');
                $(this).remove();
                try{
                    //delete portletPool[id];
                    update2PortletPool($(this), {id: id}, true);//isRemove is true
                }catch(e){}
                update2PortletPosMap();
            };*/
            
            $widget.updateIsExpanded = function(flag){
                    update2PortletPool($(this), {expand: flag});
            };
			
		   //Set buttons
           var $btnGup = $(btnGup);      
           $btnGup.appendTo($(_settings.handleSelector, widget));
           var $removeBtn =  $btnGup.find("button[type=remove]");
           var $refreshBtn =  $btnGup.find("button[type=refresh]");
           var $settingBtn =  $btnGup.find("button[type=setting]");
           var $fullscreenBtn =  $btnGup.find("button[type=fullscreen]");
           var $collapseBtn =  $btnGup.find("button[type=collapse]");       
           var $widgetContent =  $widget.find(_settings.contentSelector);
           
           $widget.ctrlBtns = {
            remove: $removeBtn,
            refresh: $refreshBtn,
            setting: $settingBtn,
            fullscreenn: $fullscreenBtn,
            collapse: $collapseBtn
           };
           $widget.contentObj = $widgetContent;
           
           // remove button
           if (thisWidgetSettings.removable) {
                $removeBtn.mousedown(function(e){
                       e.stopPropagation();
                    }).click(function(){
					   $widget.trigger('removeClick');
                       $confirmRemoveModal.modal({});
					    
					    $confirmRemoveModal_ok.unbind("click").bind('click', function () {
							$widget.animate({
								opacity: 0
							}, function () {
								$(this).slideUp(function () {
									$(this).trigger("doRemove");
								});
							});
							$confirmRemoveModal.modal('hide');
						});

						$confirmRemoveModal_cancel.unbind("click").click(function () {
							$confirmRemoveModal.modal('hide');
						});
                       return false;
                });      
            }else{
                $removeBtn.remove();
            }
            // refresh button
            if (thisWidgetSettings.refreshable) {
                $refreshBtn.mousedown(function (e) {
                    e.stopPropagation();
                }).click(function (e) {
                    $widget.trigger('refresh');
                });
            } else {
                $refreshBtn.remove();
            }

            // setting button
            if (thisWidgetSettings.settingable) {
                $settingBtn.mousedown(function (e) {
                    e.stopPropagation();
                }).click(function (e) {
                    $widget.trigger('setting');
                }).toggle(function () {
                    var kk = $(this);
                    $(this).parents(_settings.widgetSelector).find(_settings.editSelector).slideDown({
                        duration: 150,
                        easing: 'easeInQuad',
                        complete: function (e) {}
                    });
                    return false;
                }, function () {
                    $(this).parents(_settings.widgetSelector).find(_settings.editSelector).slideUp({
                        duration: 150,
                        easing: 'easeOutQuart',
                        complete: function (e) {}
                    });
                    return false;
                });
            }else{
                 $settingBtn.remove();
            }
            
            // fullscreen button
            if (true) {
                $fullscreenBtn.mousedown(function (e) {
                    e.stopPropagation();
                }).click(function (e) {
                    $widget.trigger('fullscreen');
                });
            } else {
                $fullscreenBtn.remove();
            }
 
            // collapse button
            if (thisWidgetSettings.collapsible) {
                $collapseBtn.mousedown(function (e) {
                    e.stopPropagation();
                }).toggle(function(e, time){
                        var dur = time == undefined? 150 : 0;
                        var kk = $(this);
                        $widgetContent.slideUp({
                            duration: dur,
                            easing: 'easeOutQuart',
                            complete: function(e){
                                kk.children('i').removeClass("icon-chevron-up").addClass('icon-chevron-down');
                                kk.attr('title', "Expand");
                                $widget.updateIsExpanded(false);
                            }
                        });
                        return false;
                    }, function(e, time){
                        var dur = time == undefined? 150 : 0;
                        var kk = $(this);
                       
                        $widgetContent.slideDown({
                            duration: dur,
                            easing: 'easeInQuad',
                            complete: function(e){
                                kk.children('i').removeClass('icon-chevron-down').addClass('icon-chevron-up');
                                kk.attr('title', "Collapse");
                                $widget.updateIsExpanded(true);
                            }
                        });
                        return false;
                });
            } else {
                $collapseBtn.remove();
            }
        }
          
        var addWidgetControls = function(){
            $(_settings.widgetSelector, $(_settings.columns)).each(function(){ setWidget( $(this) );});
        };
        
        var $sortableItems;
        var makeSortable = function(isUpdate2PortletPosMap){
            $sortableItems = (function(){
                
                var notSortable = '';
                $(_settings.widgetSelector, $(_settings.columns)).each(function(i){
                    if (!getWidgetSettings(this).movable) {
                        if (!this.id) {
                            this.id = 'widget-no-id-' + i;
                        }
                        notSortable += '#' + this.id + ',';
                    }
                });
                var $items = notSortable != '' ? $('> li:not(' + notSortable + ')', _settings.columns) : $('li.widget', _settings.columns);
                return $items;
                
                /*
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
                */
            })();
            
            $sortableItems.find(_settings.handleSelector).css({
                cursor: 'move'
            })/*.mousedown(function (e) {
				$sortableItems.css({width:''});
				$(this).parent().css({
					width: $(this).parent().width() + 'px'
				});
			}).mouseup(function () {
				if(!$(this).parent().hasClass('dragging')) {
					$(this).parent().css({width:''});
				} else {
					$(settings.columns).sortable('disable');
				}
			})*/;
            var hh = $sortableItems.find(_settings.handleSelector).height();
            var $columnsObj = $(_settings.columns);
            $(_settings.columns).sortable({
                items: $sortableItems,
                connectWith: $(_settings.columns),
                handle: _settings.handleSelector,
                placeholder: 'widget-placeholder',
                forcePlaceholderSize: true,
                revert: 200,
                opacity: 0.8,
                delay: 100,
				scroll: true,
                containment: 'document',
				//forcePlaceholderSize: false,
				//forceHelperSize: false,
                start: function(e, ui){
                    $(ui.helper).addClass('dragging');
                    if($.browser.msie){
                        $(ui.helper).height(hh);
                    }else{
                        $(ui.helper).height(5);
                    }
					var thisObj = $(this);
					/*$columnsObj.each(function(){
						var _this = $(this);
						if(_this[0]!=thisObj[0] && _this.children().length == 0){
							_this.animate({"paddingTop": 20, "paddingBottom": 20, "marginBottom":5, "marginLeft":5}, 300);
							_this.addClass("hoveredHolder");
						}
					});
					*/
					
					$columnsObj
					//.animate({"paddingTop": 25, "paddingBottom": 25}, 200)
					.addClass("hoveredHolder");
                },
                stop: function(e, ui){
                    $(ui.item).css({
                        width: ''
                    }).removeClass('dragging');
                    $(_settings.columns).sortable('enable');
                    update2PortletPosMap();
					
					$columnsObj
					//.animate({"paddingTop": 5, "paddingBottom": 5}, 200)
					.removeClass("hoveredHolder");
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

        function update2PortletPool($widget, opts, isRemove){
            /*
            try{
                var id = $widget.attr('id');
				if(portletPool[id]!=undefined){
					$.extend(portletPool[id],opts);
				}else{
					portletPool[id] = opts ;
				}
            }catch(e){
            }
            localStorage.setItem('portletPool',  JSON.stringify(portletPool));
            */
            _settings.update2PortletPool($widget, opts, isRemove);
        }
        
        function update2PortletPosMap(){
            /*
            portletPosMap.length = 0;
            for(var i=0; i<$columns.length; i++){
                var $col = $columns.eq(i);
                var $widgets =  $col.find(_settings.widgetSelector);
                var ary = [];

                for(var j=0; j<$widgets.length; j++){
                   var $w = $widgets.eq(j);
                   var id = $w.attr("id");
                   ary.push(id);
                }
                portletPosMap.push(ary);
            }            
            localStorage.setItem('portletPosMap', JSON.stringify(portletPosMap));
            */
            _settings.update2PortletPosMap();
        };
 
        this.addPortlet = function($w, opts, isUpdateStore){
			 var _opts = $.extend({}, _portletConfDft, opts);
             var id =  _opts.id;
             $w.attr('id', id);
             //$($columns[pos[0]]).append( $w );//todo opt?
             if(isUpdateStore==true){
                update2PortletPool($w, opts);
             }
             setWidget($w);
             //addWidgetControls();
             makeSortable(isUpdateStore == false ? false: true);
			 
			if(!_opts.expand && $w.ctrlBtns != undefined && $w.ctrlBtns.collapse!=undefined){
                $w.ctrlBtns.collapse.trigger('click', 0);
            }
        }
		
		this.updatePortletPool = function($w, opts){

			 update2PortletPool($w, opts);
		};

        
        return this;
        
    };
    
    
})(jQuery);


