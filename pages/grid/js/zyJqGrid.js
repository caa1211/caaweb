/*Joze
 * 2009/08/14
 * 2009/08/19 Sorting in front end, add selectRow event
 * 2009/08/20 fix getSelects get wrong result in single select grid. 
 * 2009/08/21 fix getSelects issue in multiselect grid
 * 2009/09/02 add selectAll event and update control status after pressing selectall checkbox.
 * 2009/09/03 selectAll event pass selected items as parameter
 * 2009/09/08 listen window and _container resize events to trigger gridResize event for autoFit.
 * 2009/09/09 add method for disable a tag in firefox, listen dialog resize event to trigger autoFit.
 * 2009/09/10 avoid unused gridResize event.
 * 2009/09/11 add autoFit in ie6
 * 2009/09/16 add autoResetSelection flag
 * 2009/09/17 add fitHeight method for fit height of some object 
 * 2009/09/18 add try catch to protect setGridWidth and setGridHeight
 * */


(function($)//use $ to instead JQuery
{
      $.fn.disableATag = function(){
      var _handler = function(n, v){
        if($(this).find('.aTagMask').length>0)
        return;
        $(this).removeAttr('href');
        var position  = $(this).position();
                        $(this).css('color','gray');
                        var w = $(this).width()+4;
                        var h = $(this).height()+3;
                        var left = position.left-2;
                        var top = position.top-2;
                        var margin = $(this).css('margin-top')+' '+$(this).css('margin-right')+' '+$(this).css('margin-bottom')+' '+$(this).css('margin-left');
                        var padding = $(this).css('padding-top')+' '+$(this).css('padding-right')+' '+$(this).css('padding-bottom')+' '+$(this).css('padding-left');
                      var mask =  $('<div class="aTagMask"></div>').css({'padding':padding, 'margin':margin, 'position':'absolute',left: left, top: top, width:w, height :h/*, border:'solid 1px red'*/});
                      $(this).append(mask);
                      mask.click(function(){return false;});
      };
         return this.each(_handler);
    };
    
    $.fn.enableATag = function(){
      var _handler = function(n, v){
        $(this).attr('href','#').css('color','#000').find('.aTagMask').remove().empty();          
      };
         return this.each(_handler);
    };
    
    //## inherit jqGrid-----------------------------------------------------------------------B
    $.fn.zyjqGrid = function(settings){
   
    var _list;
        var gridimgpath = '../../images/grid';
        //Default Settings
        var _defaultSettings = {
			pagerpos: 'left',
            autowidth: true,
            autoheight: true,
            viewrecords: true,
            imgpath: gridimgpath,
            rownumbers: true,
           
            rowNum: 10,
            rowList: [10, 20, 30],
            scrollOffset: 0,
            height: 'auto',
            sortorder: "desc",
            removeDBText: "Remove selected item(s)",
			rownumbers: false,
			gridComplete: function(){
                _list.setGridParam({
                    datatype: 'local'
                });
                
                _list.trigger('gridResize');
                
                if (_settings.gridStripe) {
                    $("tr.jqgrow").removeClass('gridStripe');
                    $("tr.jqgrow:odd").addClass('gridStripe');
                }
                
                _list.trigger('gridComplete');
            },
            onPaging: function(which_button){
                _list.setGridParam({
                    datatype: 'xml'
                });
                 _list.trigger('onPaging');
            },
            sortComplete: function(){
                if (_settings.gridStripe) {
                    $("tr.jqgrow").removeClass('gridStripe');
                    $("tr.jqgrow:odd").addClass('gridStripe');
                }
            },
			 onSelectRow: selectRow,//trigger selectRow event
			 onSelectAll: selectAll,
        //new setting
		    //onSelectRow: selectRow,//trigger selectRow event
            fitHeight:{obj:'', mend:0 },
            autoFit: true,
            autoDetectHeader: true,
            autoResetSelection: true,
            header: null,
            gridStripe: true,
            headerBtnDisplay: {
                add: true,
                edit: true,
                remove: true
            },
            headerBtnEnabled: {
                add: true,
                edit: false,
                remove: false
            },
            rightCustomCtl: null,
            leftCustomCtl: null 
            ,
            onAdd: function(){
            },
            onEdit: function(){
            },
            onRemove: function(){
            }
        };
        
        //override
        var _settings = $.extend(_defaultSettings, settings);
	
        getSelects = function(list){
              
            var retArray = [];
			if (_settings.multiselect) {
				var s = list.getGridParam('selarrrow');
					$.each(s, function(i, val){
						rowData = _list.getRowData(parseInt(val, 10));
						retArray.push(rowData);
					});
			}
			else {
				var id = list.getGridParam('selrow');
				if (id) {
					rowData = _list.getRowData(id);
					retArray.push(rowData);
				}
			}
            return retArray;
        };
        
        this.getSelects = function(){
            return getSelects(this);
        };
		
        function checkDetectCtlStatus(){

            if (_settings.header != null && _settings.autoDetectHeader) {
            
                if (getSelects(_list).length > 0) 
                    header.find(".detectCtl").removeAttr('disabled').enableATag();
                else 
                    header.find(".detectCtl").attr('disabled', "disabled").disableATag();
                
                if (getSelects(_list).length == 1) 
                    header.find(".detectCtl_singleOn").removeAttr('disabled').enableATag();
                else 
                    header.find(".detectCtl_singleOn").attr('disabled', "disabled").disableATag();
            }
        };
		  
         function selectRow(rowid){
         _list.trigger('selectRow', rowid);
		 checkDetectCtlStatus();

         //for hanle unselect
        /* if (selectedGrid != null && selectedGrid != mainGrid) 
             selectedGrid.resetSelection();
         selectedGrid = mainGrid;*/
         //for hanle unselect
         }
          
         function selectAll(rowids){
             _list.trigger('selectAll', [rowids]);
             checkDetectCtlStatus();
         }

        //override
        this.resetSelection = function(){
            if (mainGrid.resetSelection != undefined) 
            {  mainGrid.resetSelection();}
            checkDetectCtlStatus();
        };


        var header = $('#' + _settings.header);
        var mainGrid;
        
        function triggerGridResize(){
            mainGrid.trigger('gridResize');
            return false;
        }
        
         function confirmRemove(){
            $("<div class='win_warning'>"+ _settings.removeDBText +"</div>").zyUiDialog({
                confirmDB: true,
                buttons: {
                    Ok: function(e){
                        _settings.onRemove();
                        $(this).dialog('close');
                          $.cancelBubble(e);
                    },
                    Cancel: function(e){
                        $(this).dialog('close');
                         $.cancelBubble(e);
                    }
                }
            }).dialog('open');
        }
        
        //hander---------------------------------------------------------------
        var _handler = function(){
        _list = $(this);
            var addbtn, editbtn, removebtn;
            if (_settings.header != null) {
            
                if (_settings.leftCustomCtl != null) {
                    header.append(_settings.leftCustomCtl);
                }
                if (_settings.headerBtnDisplay.add) {
                    header.append('<a href="#" title="Add" class="add"><span>Add</span></a>');
                    addbtn = header.find('.add');
                    addbtn.bind("click", _settings.onAdd);
                }
                if (_settings.headerBtnDisplay.edit) {
                    header.append('<a href="#" title="Edit" class="edit"><span>Edit</span></a>');
                    editbtn = header.find('.edit');
                    editbtn.bind("click", _settings.onEdit);
                }
                if (_settings.headerBtnDisplay.remove) {
                    header.append('<a href="#" title="Remove" class="remove"><span>Remove</span></a>');
                    removebtn = header.find('.remove');
                    removebtn.bind("click", confirmRemove);
                }
                
                if (_settings.rightCustomCtl != null) {
                    header.append(_settings.rightCustomCtl);
                }
                
				//append header to grid
				
				
                if (_settings.autoDetectHeader) {
                    header.find('.edit').addClass('detectCtl_singleOn');
                    header.find('.remove').addClass('detectCtl');
                }
            }
            
            //do Plugin!!!!!
            mainGrid = _list.jqGrid(_settings);
            
            //header.prependTo(_list.parent().parent().parent());
            var _listContener = _list.parent().parent().parent().parent();
            
            _listContener.bind('click', function(e){
                 $.cancelBubble(e);
            });

            if (_settings.autoFit) {
                $(window).bind('resize', triggerGridResize);
                //_listContener.bind('resize', function(){ mainGrid.trigger('gridResize'); return false;});
                
                //for firefox
                $('#mainDiv').bind('layoutResize', triggerGridResize);
                _listContener.parents('.ui-dialog').bind('resize', triggerGridResize);
                //_listContener.parents('.ui-dialog').bind('dialogopen', function(event, ui){mainGrid.trigger('gridResize');});
            }
            
            mainGrid.bind('gridResize', function(){
                if (!_settings.autoFit) 
                    return;
                
                if (_listContener.css('display') == 'none') 
                    return;
                
				//fit width
                resizRulerId = _list.attr('id') + "_ruler";
                if ($("#" + resizRulerId).length == 0) 
                    _listContener.prepend('<div id=' + resizRulerId + ' style="width:100%; border:solid 0 red; height:0px"><div>');
                
                resizRuler = $("#" + resizRulerId);
                
                var size = resizRuler.width() - 1;
                if (size != mainGrid.width()) {
                    try {
                        _list.setGridWidth(size);
                    }
                    catch(e){};
                }
                
                //fit height
                if (_settings.fitHeight.obj) {
                    var h = _settings.fitHeight.obj.height() + _settings.fitHeight.mend;
                    var oh = _list.height();
                    h = h > oh ? oh : h;
                     try {
                         _list.setGridHeight(h);
                     }
                      catch(e){};
                    if (resizRuler.width() - 1 != mainGrid.width()) 
                        _list.setGridWidth(resizRuler.width() - 1);
                }
                
                return false;
            });
                
            
            if (_settings.autoDetectHeader) {
                header.find(".detectCtl").attr('disabled', "disabled").disableATag();
                if (_settings.headerBtnEnabled.add == false && addbtn) 
                    addbtn.attr('disabled', "disabled").disableATag();
                if (!_settings.headerBtnEnabled.edit && editbtn) 
                    editbtn.attr('disabled', "disabled").disableATag();
                if (!_settings.headerBtnEnabled.remove && removebtn) 
                    removebtn.attr('disabled', "disabled").disableATag();
            }
             
        };
        //hander---------------------------------------------------------------
        var zyGrid = this.each(_handler);
        if (_settings.autoResetSelection) {
            zyGrid.parents('.dialogContener').bind('click', function(){
                zyGrid.resetSelection();
            });
            zyGrid.parents('body').bind('click', function(){
                zyGrid.resetSelection();
            });
        }
        return zyGrid;
    };
    //## inherit jqGrid-----------------------------------------------------------------------E

})(jQuery);


