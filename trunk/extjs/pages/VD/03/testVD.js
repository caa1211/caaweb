;
(function($){

    $.fn.testVD = function(settings){
        var _vdObj = $(this);
		
		//Port
        var _port1Obj;
		var _port2Obj;
		
		
        var _tipOption = {
            showBody: " - ",
            fade: 100,
            opacity: 1,
             track: true, 
            delay: 0, 
            //showURL: false, 
           fixPNG: true,
            //extraClass: "pretty fancy",
            top: 0,
           left: 5
        };
		
        var _defaultSettings = {
            port1: {status: 'off'},
            port2:  {status: 'off'}
			
        };
        
		function portSetting(object, setting, ctime){
			 var time= ctime == undefined ? 300: ctime;
			 if (setting!= undefined) {
                 setting.status == 'off' ? object.fadeOut(time) : object.fadeIn(time);
                if(setting.msg!=undefined)
                object.attr('title', setting.msg).tooltip(_tipOption);
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
            
            _vdObj.load('03/test.html', function(){
				
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
