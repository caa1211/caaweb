
/*this plugin depends on
 * ui.draggable.js
 * ui.resizable.js
 * ui.dialog.js
 * jquery.bgiframe.js
 * effects.core.js
 * 
 * 090828
 * 090903 refine code, add 'resizeConfirmDB' and 'contenerCss' option
 * 090916 cancel event bubble to parent element
 * 090923 cancel event bubble from overlay to parent element
 * 091224 add css "position: relative" in container
 * 100528 add multi lingo config and addLingoAttr function
 */

(function($){

    function applyDefault(baseDiv, settings){
        var _defaultSettings = {
            bgiframe: true,
            closeOnEscape: true,
            modal: true,
            autoOpen: false,
			multiLingo: true,
            confirmDB: false, //no background, unresizable
            resizeConfirmDB: false, //no background, resizable
            close: null,
            open: function(e){
                $(e.target).parents('.ui-dialog').click(function(e){
                    $.cancelBubble(e);
                });
                 $('.ui-widget-overlay').click(function(e){
                    $.cancelBubble(e);
                });
            },
            containerCss: {
                'overflow-x': 'hidden',
                'margin-left': '4px',
                'margin-right': '4px', 
                'position':'relative',
				'background':'#fff'
            },
            buttons: {    
                'Cancel': function(e){$.cancelBubble(e);$(this).dialog('close');},
				'OK': function(){}
            }
        };
        
        baseDiv.bind('dialogclose', function(event, ui){
            baseDiv.remove();
        });
        
		if($.browser.msie&&($.browser.version == "6.0")&&!$.support.style )
		{
	    var ie6Setting = {  'margin-right': '18px' };
		_defaultSettings.containerCss = $.extend(_defaultSettings.containerCss, ie6Setting);
		}
		
        return $.extend(_defaultSettings, settings);
    }
    
     function createContainer(settings){
            var msgDiv = $('<div class="dialogContener">');
            var _settings = applyDefault(msgDiv, settings);
            
            if(!_settings.resizeConfirmDB&&!_settings.confirmDB)
                 msgDiv.css(_settings.containerCss);
                 
            if (_settings.confirmDB) 
                 _settings.resizable = false;
                
                return {container: msgDiv, setting:_settings };
    }
    
	function addLingoAttr(retMsg){
		var dbParent = retMsg.parent('.ui-dialog');
			dbParent.find('.ui-dialog-buttonpane button').attr('lingo','auto');
			dbParent.find('.ui-dialog-title').attr('lingo','auto');
	}
    
    $.extend({
        zyUiDialog: function(settings){
            var msg = createContainer(settings);
			var retMsg = msg.container.dialog(msg.setting);
			
			if(msg.setting.multiLingo)
			addLingoAttr(retMsg);
			
			return retMsg
        }
    });
    
   
    $.fn.extend({
        zyUiDialog: function(settings){
            var msg = createContainer(settings);
		    var retMsg = msg.container.append($(this)).dialog(msg.setting);
			
          if(msg.setting.multiLingo)
			addLingoAttr(retMsg);
			
           return retMsg
        }
    });
    
})(jQuery);
