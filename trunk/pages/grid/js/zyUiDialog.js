
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
 * 090922 cancel event bubble to parent element, and do not listen open event.
 */
;
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
            containerCss:{'background':'#FFF','margin-left':'4px','margin-right':'4px'},
            buttons: {
                'Ok': function(){
                },
                'Cancel': function(e){
                    $.cancelBubble(e);
                    $(this).dialog('close');
                }
            }
        };
        
        baseDiv.bind('dialogclose', function(event, ui){
            baseDiv.remove();
        });
        
        return $.extend(_defaultSettings, settings);
    }
    
     function createContainer(settings){
            var msgDiv = $('<div class="dialogContener" overflow: auto;">');
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
            var returnDB =  msg.container.dialog(msg.setting);
            returnDB.parent('.ui-dialog').click(function(e) {
								$.cancelBubble(e);
							});
            return returnDB;
        }
    });
    
   
    $.fn.extend({
        zyUiDialog: function(settings){
            var msg = createContainer(settings);
            var returnDB =  msg.container.append($(this)).dialog(msg.setting);
                returnDB.parent('.ui-dialog').click(function(e) {
								$.cancelBubble(e);
							});
            return returnDB
        }
    });
    
})(jQuery);
