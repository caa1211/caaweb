
;
(function($){

  
        
    $.fn.VDcomponent = function(settings){
        var _defaultSetting={
            speed: 100,
            vdHtml: 'VDHtml/VD.html',
            vdCss:  ['VDHtml/css/reset.css', 'VDHtml/css/css.css'],
            portDef: 'portDef.js'
        }
        
        var _settings = $.extend(_defaultSetting, settings);
        
        var removePortCls = function(portObj, speed){
             // debugger;
            var index = $portObj.attr('id');
            //debugger;
            $.each(portDef[index].status, function(ii, dd){
               // alert('');
               
                $portObj.animate({opacity:'0'},speed, function(){
                    if (dd.cls != undefined) {
                        $(this).removeClass(dd.cls);
                      //  alert('remove' + dd.cls);
                    }
                });
            })
        }
        
        var changePortStatus = function(obj, cls, title){
            //url = 'url(' + img + ')';
          // debugger;
          
           if (!obj.hasClass(cls)) {
  removePortCls(obj, 0);

          //     var tObj = obj.clone().prependTo(obj.parent());
                obj.animate({opacity:'0'},0).addClass(cls).animate({opacity:'1'},_settings.speed);
             //  alert('obj'+ obj.attr('id')+'  add' + cls);
              
            //   tObj.fadeOut(_settings.speed, function(){$(this).remove().empty(); });
            }
                
            if (obj.attr('title') != title) 
                obj.attr('title', title);
        };
        
        this.setValue = function(data){
            
            $.each(data, function(i, date){
                $portObj=$('#'+i+'');
            
                if (portDef[i]== undefined) {
                    alert('undefined port: '+ i);
                    return false;
                }
                
                if (portDef[i].status[data[i].status] == undefined) {
                    alert('port: '+i+ ' has undefined status:'+ data[i].status);
                    return false;
                }
                    
                if (portDef[i].status[data[i].status] == '') {
                    removePortCls($portObj, _settings.speed);
                }
                else {
                        portCls = portDef[i].status[data[i].status].cls;
                        //noSetting: previous,  '': no title
                        portTitle = data[i].msg == undefined ? $portObj.attr('title') : data[i].msg;
                        changePortStatus($portObj, portCls, portTitle);
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
         }); 
         /*
         var iframe = $("<iframe id='vdFrame' style='width:100%; height:100%;' allowtransparency='true' frameborder='0'></iframe>");
         iframe.attr('src',vdhref);
         _vdObj.append(iframe);
         */
       
        // frameContents= _vdObj.find('#vdFrame').contents();
         //debugger;
         
           _vdObj.load(_settings.vdHtml, function(){ $.each(_settings.vdCss, function(i,d){
               attachStylesheet(d);});
           
               $.each(portDef, function(i, date){
                   $portObj=$('#'+i+'');
                   //$portObj.css('background', '');
                   $portObj.attr('title', '');
                   removePortCls($portObj, 0); 
              
             }) 
             
              })
        }

        return this.each(_handler);
    }
    
    
    
})(jQuery);
