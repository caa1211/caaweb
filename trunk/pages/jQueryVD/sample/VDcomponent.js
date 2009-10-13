
;
(function($){

  
        
    $.fn.VDcomponent = function(settings){
        var _defaultSetting={
            speed: 300,
            vdHtml: 'VDHtml/VD.html',
            vdCss:  ['VDHtml/css/reset.css', 'VDHtml/css/css.css'],
            portDef: 'portDef.js'
        }
        
        var _settings = $.extend(_defaultSetting, settings);
         
        var changePortStatus = function(obj, img, title){
            url = 'url(' + img + ')';
            if (obj.css('background') != url) {
                var tObj = obj.clone(true).prependTo(obj.parent());
                obj.hide().css('background', url).fadeIn(_settings.speed);
                tObj.fadeOut(_settings.speed, function(){$(this).remove().empty(); });
            }
                
            if (obj.attr('title') != title) 
                obj.attr('title', title);
        };
        
        this.setValue = function(data){
            
            $.each(data, function(i, date){
                $portObj=$('#'+i+'');
                
                if (portDef[i].status[data[i].status] == '') {
                    $portObj.fadeOut(_settings.speed, function(){
                        $(this).css('background', '')
                    });
                }
                else {
                    imgSrc = portDef[i].status[data[i].status].src;
                    //noSetting: previous,  '': no title
                    portTitle = data[i].msg == undefined ? $portObj.attr('title') : data[i].msg;
                 
                    changePortStatus($portObj, imgSrc, portTitle);
                }
            })
        };
        
        var attachStylesheet = function(href){
            return $('<link href="' + href + '" rel="stylesheet" type="text/css" />').appendTo('head');
        };
    
        var _vdObj = $(this);
        var portDef='';
        var frameContents;
        var _handler = function(){
        $.ajaxSettings.async = false;
         $.getJSON(_settings.portDef, function(json){
             portDef = json;
            
             $.each(json, function(i, date){
                   $portObj=$('#'+i+'');
                   $portObj.css('background', '');
                   $portObj.attr('title', '');
             }) 
         }); 
         /*
         var iframe = $("<iframe id='vdFrame' style='width:100%; height:100%;' allowtransparency='true' frameborder='0'></iframe>");
         iframe.attr('src',vdhref);
         _vdObj.append(iframe);
         */
       
        // frameContents= _vdObj.find('#vdFrame').contents();
         //debugger;
         
           _vdObj.load(_settings.vdHtml, function(){ $.each(_settings.vdCss, function(i,d){attachStylesheet(d);});  $.ajaxSettings.async = true;})
        }

        return this.each(_handler);
    }
    
    
    
})(jQuery);
