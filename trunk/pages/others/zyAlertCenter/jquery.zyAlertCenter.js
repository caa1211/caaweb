/*
 * emptyPlugin.js
 *
 * Copyright (c) 2010 
 * Caa Chang
 *
 * Dual licensed under the GPL (http://www.gnu.org/licenses/gpl.html)
 * and MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 *
 * $Date: 2010-02-04 $
 * $Rev: 001 $
 * 
 */


(function($)
{
$.fn.delay = function(time, callback) {

    // Empty function:
jQuery.fx.step.delay = function() { };

    // You can set the second argument as CSS properties

    if (typeof callback == "object")

    {

        var cssObj = callback;

        callback = function() { $(this).css(cssObj); }

    }
    return this.animate({ delay: 1 }, time, callback);
}


    $.fn.alertCenter = function(settings){
        
       var defaultSetting = 
       {
           
       }
       
        settings = $.extend(defaultSetting , settings);
        
        $(this).append('<div class="alertCntr_store"><div class="head">alert: <span class="count">0</span><span class="arrow"></span></div><div class="list"></div></div>');
        var alertStore =  $(this).children('.alertCntr_store');
        var alertCount = alertStore.find('.count');
        
        alertStore.children('.list').hide();
        alertStore.find('.head .arrow').addClass('collapsed');
        
        alertStore.find('.head').toggle(function(){
            var head = $(this);
             head.children('.arrow').removeClass('collapsed').addClass('expanded');
            head.siblings('.list').slideDown();
        }, function(){
            var head = $(this);
             head.children('.arrow').removeClass('expanded').addClass('collapsed');
            $(this).siblings('.list').slideUp();
        })
        
        alertStore.slideUp(0);
           
        $(this).append('<div class="alertCntr_live"><div class="list"></div></div>');
        var alertLive = $(this).children('.alertCntr_live');  
        alertLive.slideUp();
  
  
   function refreshStoreConut(){
        var storeCount=0;
        storeCount = alertStore.find('.list').children().length;
        alertCount.html(storeCount);
        
        if(storeCount>0)
           alertStore.slideDown(); 
   }
   
   
   this.add = function(addObj /*{id:'a1', content:'<div>aaa</div>'}*/){
       
        var storeObj = $('<div class="content">'+addObj.content+'</div>');
        
        if (addObj.id != undefined) {
            alertStore.find('.list').append(storeObj);
            storeObj.addClass('live').delay(2000, function(){
                $(this).removeClass('live')
            });
            refreshStoreConut();
        }
        
        alertLive.slideDown();
        var liveAlert = storeObj.clone();
        alertLive.find('.list').append(liveAlert);
        liveAlert.delay(2000, function(){$(this).slideUp(function(){$(this).remove();});}); 
        return storeObj;
   };

 this.remove = function(obj){
     //debugger;
      //if (typeof obj == "object")
      
      
         // if (typeof obj == "string")
     
 }

      return this;

   };
 

})(jQuery);


