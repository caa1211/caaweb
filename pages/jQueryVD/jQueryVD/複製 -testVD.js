;
(function($){
    $.fn.testVD = function(settings){
        var _vdObj = $(this);
		var csshref = 'jQueryVD/css/css.css';
		var vdhref = 'jQueryVD/VD.html';
		//Port
        var _port1Obj;
		var _port2Obj;
        var _defaultSettings = {
            port1: {status: 'off'},
            port2:  {status: 'off'}
			
        };
		function portSetting(object, setting, ctime){
			 var time= ctime == undefined ? 300: ctime;
			 if (setting!= undefined) {
                 setting.status == 'off' ? object.fadeOut(time) : object.fadeIn(time);
                if(setting.msg!=undefined)
                object.attr('title', setting.msg);
                else
                object.removeAttr('title');
            }
		}
        this.setValue = function(data){
            portSetting(_port1Obj, data.port1);
            portSetting(_port2Obj, data.port2);
        };
        
        var _settings = $.extend(_defaultSettings, settings);
        
        var _handler = function(){

        	$('<link href="reset.css" rel="stylesheet" type="text/css" />').appendTo('head');
            $('<link href="' + csshref + '" rel="stylesheet" type="text/css" />').appendTo('head');
              
            _vdObj.load(vdhref, function(){
				
                //get obj
                _port1Obj = _vdObj.find('#port1');
				_port2Obj = _vdObj.find('#port2');
				
				//set default
			   portSetting(_port1Obj, _settings.port1, 0);
			   portSetting(_port2Obj, _settings.port2, 0);

            });
        };
        return this.each(_handler);
    };
})(jQuery);
