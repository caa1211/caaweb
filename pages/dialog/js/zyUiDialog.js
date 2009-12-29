
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
 */

(function($){

    function applyDefault(baseDiv, settings){
        var _defaultSettings = {
            bgiframe: true,
            closeOnEscape: true,
            modal: true,
            autoOpen: false,
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
                'position':'relative'
            },
            buttons: {
                'OK': function(){},
                'Cancel': function(e){$.cancelBubble(e);$(this).dialog('close');}
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
    
    
    $.extend({
        zyUiDialog: function(settings){
            var msg = createContainer(settings);
            return msg.container.dialog(msg.setting);
        }
    });
    
   
    $.fn.extend({
        zyUiDialog: function(settings){
            var msg = createContainer(settings);
            return msg.container.append($(this)).dialog(msg.setting);
        }
    });
    
})(jQuery);
