
;
(function($){

    $.fn.VDcomponent = function(settings){
        var _defaultSetting = {
            showSpeed: 200,
            hideSpeed: 100,
            vdHtml: 'VDHtml/VD.html',
            vdCss: ['VDHtml/css/reset.css', 'VDHtml/css/css.css'],
            portDef: 'portDef.js'
        }
        
        var _settings = $.extend(_defaultSetting, settings);
        
        var removePortCls = function(portObj, speed){
            var index = $portObj.attr('id');
            $.each(portDef[index].status, function(i, d){
                
                //if ($portObj.hasClass(d.cls)) {
                
                
                    $portObj.animate({
                        opacity: '0'
                    }, speed, function(){
                        if (d.cls != undefined) {
                            $(this).removeClass(d.cls);
                        }
                    });
               
                    
                //}
              //  $portObj.removeClass(d.cls);
                
            })
        }
        
        var changePortStatus = function(obj, cls, title){

            if (!obj.hasClass(cls)) {
                removePortCls(obj, 0);

              
                obj
                .addClass(cls).animate({
                    opacity: '1'
                }, _settings.showSpeed);
                
               
               
                // $portObj.css('visibility','visible').addClass(cls);

            }
            
            if (obj.attr('title') != title) 
                obj.attr('title', title);
        };
        
        this.setValue = function(data){
        
            $.each(data, function(i, date){
                $portObj = $('#' + i + '');
                
                if (portDef[i] == undefined) {
                    alert('undefined port: ' + i);
                    return false;
                }
                
                if (portDef[i].status[data[i].status] == undefined) {
                    alert('port: ' + i + ' has undefined status:' + data[i].status);
                    return false;
                }
                
                if (portDef[i].status[data[i].status] == '') {
                    //removePortCls($portObj, _settings.speed);
                    removePortCls($portObj, _settings.hideSpeed);
                }
                else {
                    portCls = portDef[i].status[data[i].status].cls;
                    portTitle = data[i].msg == undefined ? $portObj.attr('title') : data[i].msg;
                    changePortStatus($portObj, portCls, portTitle);
                }
            })
        };
        
        var attachStylesheet = function(href){
            return $('<link href="' + href + '" rel="stylesheet" type="text/css" />').appendTo('head');
        };
        
        var _vdObj = $(this);
        var portDef = '';
        var frameContents;
        var _handler = function(){
            $.ajaxSettings.async = false;
            $.getJSON(_settings.portDef, function(json){
                portDef = json;
            });
            
            _vdObj.load(_settings.vdHtml, function(){
                $.each(_settings.vdCss, function(i, d){
                    attachStylesheet(d);
                });
                
                $.each(portDef, function(i, date){
                    $portObj = $('#' + i + '');
                    $portObj.attr('title', '');
                     removePortCls($portObj, 0);
                })
                
            })
        }
        
        return this.each(_handler);
    }
 
})(jQuery);
