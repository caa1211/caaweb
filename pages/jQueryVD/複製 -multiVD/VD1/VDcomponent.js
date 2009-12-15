/*2009/10/22: add loaded and updated callback, add async property
 * 
 * 
 * 
 */
;
(function($){

    $.fn.VDcomponent = function(settings){
        var _defaultSetting = {
            showSpeed: 300,
            easing: '',
            effect: 'fadeIn', //fadeIn, slideDown or show
            //path setting
            vdHtml: 'VD1/VDHtml/VD.html',
            vdCss: ['VD1/VDHtml/css/reset.css', 'VD1/VDHtml/css/css.css'],
            portDef: 'VD1/portDef.js',
            loaded: function(){},
            updated: function(){},
            async: false
        }
        
        var _settings = $.extend(_defaultSetting, settings);
        
        var removePortCls = function(portObj, speed){
            var index = $portObj.attr('id');
            $.each(portDef[index].status, function(i, d){
                if (d != undefined) 
                    $portObj.removeClass(d);
            })
            $portObj.css('visibility', 'hidden');
        }
        var changePortStatus = function(obj, cls, title){

            if (!obj.hasClass(cls)) {
                removePortCls(obj, 0);
                
                if (!obj.hasClass(cls)) {
                   if (_settings.effect == 'fadeIn'||_settings.effect == '' ) 
                        obj.hide(0).addClass(cls).css('visibility', 'visible').fadeIn(_settings.showSpeed, _settings.easing);
                   else if (_settings.effect == 'show' ) 
                        obj.hide(0).addClass(cls).css('visibility', 'visible').show(_settings.showSpeed, _settings.easing);
                   else if (_settings.effect == 'slideDown') 
                        obj.hide(0).addClass(cls).css('visibility', 'visible').slideDown(_settings.showSpeed, _settings.easing);
                }
            }
            
            if (obj.attr('title') != title) 
                obj.attr('title', title);
        };
        var _data;
        this.setValue = function(data){
            _data= data;
            $.each(data, function(i, date){
                $portObj = _vdObj.find('#' + i + '');
                
                if (portDef[i] == undefined) {
                    alert('undefined port: ' + i);
                    return false;
                }
                
                if (portDef[i].status[data[i].status] == undefined) {
                    alert('port: ' + i + ' has undefined status:' + data[i].status);
                    return false;
                }
                
                if (portDef[i].status[data[i].status] == '') {
                    removePortCls($portObj, _settings.hideSpeed);
                }
                else {
                    portCls = portDef[i].status[data[i].status];
                    portTitle = data[i].msg == undefined ? $portObj.attr('title') : data[i].msg;
                    changePortStatus($portObj, portCls, portTitle);
                }
            })
            _settings.updated();
        };
        
        this.getValue = function(){return _data};
        
        var attachStylesheet = function(href){
            styleSheet = $('<link href="' + href + '" rel="stylesheet"/>')
            styleSheet.appendTo('head');
            return styleSheet.attr('type', "text/css");
        };
        
        var _vdObj = $(this);
        var portDef = '';
        var frameContents;
        var _handler = function(){

            $.ajaxSettings.async = _settings.async;
            
            $.getJSON(_settings.portDef, function(json){
                portDef = json;

                 _vdObj.load(_settings.vdHtml, function(){
                $.each(_settings.vdCss, function(i, d){
                    attachStylesheet(d);
                });
                
                $.each(portDef, function(i, date){
                    $portObj = _vdObj.find('#' + i + '');
                    $portObj.attr('title', '');
                    removePortCls($portObj, 0);
                })
                
                _settings.loaded();
                $.ajaxSettings.async = true;
            })
            
            });
        }
        return this.each(_handler);
    }
 
})(jQuery);
