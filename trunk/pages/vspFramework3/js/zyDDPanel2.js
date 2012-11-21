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
                var pltid =  $(this).attr('pltid');
                $(this).remove();
                try{
                    delete portletPool[pltid];
                }catch(e){}
                update2PortletPosMap();
            });*/
			/*
			$widget.doRemove = function(){
                $(this).trigger('destroy');
                var pltid =  $(this).attr('pltid');
                $(this).remove();
                try{
                    //delete portletPool[pltid];
                    update2PortletPool($(this), {pltid: pltid}, true);//isRemove is true
                }catch(e){}
                update2PortletPosMap();
            };*/
            
            $widget.updateIsExpanded = function(flag){
                    update2PortletPool($(this), {expand: flag});
            };
            
           if (thisWidgetSettings.removable && $widget.find("a.remove").length == 0) {
                $widget.trigger("beforeDestory");
                
                $('<a href="#" class="remove" title="Close Widget">CLOSE</a>').mousedown(function(e){
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
            });
            
            $(_settings.columns).sortable({
                items: $sortableItems,
                connectWith: $(_settings.columns),
                handle: _settings.handleSelector,
                placeholder: 'widget-placeholder',
                forcePlaceholderSize: true,
                revert: 200,
                opacity: 0.8,
                delay: 100,
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

        function update2PortletPool($widget, opts, isRemove){
            /*
            try{
                var pltid = $widget.attr('pltid');
				if(portletPool[pltid]!=undefined){
					$.extend(portletPool[pltid],opts);
				}else{
					portletPool[pltid] = opts ;
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
                   var pltid = $w.attr("pltid");
                   ary.push(pltid);
                }
                portletPosMap.push(ary);
            }            
            localStorage.setItem('portletPosMap', JSON.stringify(portletPosMap));
            */
            _settings.update2PortletPosMap();
        };
 
        this.addPortlet = function($w, pos, opts, isUpdateStore){
			 var _opts = $.extend({}, _portletConfDft, opts);
             var pltid =  _opts.pltid;
             $w.attr('pltid', pltid);
             //$($columns[pos[0]]).append( $w );//todo opt?
             if(isUpdateStore==true){
                update2PortletPool($w, opts);
             }
             setWidget($w);
             //addWidgetControls();
             makeSortable(isUpdateStore == false ? false: true);
			 
			if(!_opts.expand){
                $w.find("a.collapse").trigger('click', 0);
            }
        }
		
		this.updatePortletPool = function($w, opts){

			 update2PortletPool($w, opts);
		};

        
        return this;
        
    };
    
    
})(jQuery);



 ;
(function($){
 
    $.fn.portletDlg = function(setting) {
      
      var $dlgObj = $(this);
      var $dlgBody = $dlgObj.find('.modal-body');
      var $dlgHead = $dlgObj.find('.modal-header');
      var opts = {
        //backdrop: "static",
        //keyboard: true
      };
  
      var $portlet = null, $portletContent = null, $portletHead = null;
      
      this.show = function($w){
        var wH = $(window).height();
        $dlgBody.css('max-height', wH-350);
        $dlgBody.css('height', wH-350);
 
        $portlet = $w;
        $portletHead = $w.find(".widget-head");
        $portletContent = $w.find(".widget-content");
               
        //todo: write portlet title to head
        
        //--
        if(!$portletContent.is(":visible")){
            $portletContent.show();
            $portlet.isHidden = true;
        }else{
            $portlet.isHidden = false;
        }
        
        var leftOffset = -1* $dlgObj.width() / 2;
        $dlgObj.css("margin-left", leftOffset);
        $w.hide();
        
        $portletContent.appendTo( $dlgBody  );

        $dlgObj.modal(opts);
        $portlet.trigger("fullScreenOn");
      };
      
      function putBackPortlet(){
      
        if($portlet.isHidden==true){
           $portletContent.hide();
           
        }else{}
        
        $portlet.append($portletContent);
        $portlet.fadeIn(200);
        $portlet.trigger("fullScreenOff");
        $portlet = null, $portletContent = null, $portletHead = null;
      }
      
      
      $(document).keyup(function(e){
         if(e.keyCode === 27){
           $dlgObj.modal("hide");
         }
      });
      
      $dlgObj.bind("hidden", function(){
         putBackPortlet();
      });
    
      this.hide = function(){
         $dlgObj.modal("hide");
      };
      
      return this;
    }  
    
})(jQuery);

