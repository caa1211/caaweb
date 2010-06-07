/*
 * alertCenter plugin
 *
 * Copyright (c) zyxel, 2010 
 * Joze Chang
 *
 *
 * $Date: 2010-06-07 $
 * $Rev: 001 $
 * Add bgiframe support.
 * 
 */

(function($)
{
$.fn.delay = function(time, callback) {
    // Empty function:
jQuery.fx.step.delay = function() { };
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
           maxLength:50,
           titleMsg: 'Alert Center',
           stay: 3000
       }
       
        settings = $.extend(defaultSetting , settings);
        
        $(this).append('<div class="alertCntr_store"><div class="head">'+ settings.titleMsg  +':<span class="count">0</span><span class="arrow"></span></div><div class="list"></div></div>');
        var alertStore =  $(this).children('.alertCntr_store');
        var alertCount = alertStore.find('.count');
        
        //init
        alertStore.children('.list').hide();
        alertStore.find('.head .arrow').addClass('collapsed');
        alertStore.slideUp(0);
        //refreshStoreConut();

       alertStore.find('.head').click(function(){
            var head = $(this);
            var arrow =  head.children('.arrow')
            if (arrow.hasClass('collapsed')) {
               arrow.removeClass('collapsed').addClass('expanded');
                head.siblings('.list').slideDown('fast');
            }
            else{
             arrow.removeClass('expanded').addClass('collapsed');
             $(this).siblings('.list').slideUp('fast');
            }
        });
 
        $(this).append('<div class="alertCntr_live"><div class="list"></div></div>');
        var alertLive = $(this).children('.alertCntr_live');  
     //   alertLive.slideUp(0);
  
   if($(this).bgiframe!=undefined)
   $(this).bgiframe();
  
   function refreshStoreConut(){
        var storeCount=0;
        storeCount = alertStore.find('.list').children('.content').length;

        if (storeCount > 0) {
            alertStore.slideDown(500, 'easeOutBack');
        }
        else 
            if (storeCount == 0) {
                alertStore.slideUp(500, 'easeInBack');
                alertStore.children('.list').hide();
                alertStore.find('.head .arrow').removeClass('expanded').addClass('collapsed');
            }
           
        if (settings.maxLength!=undefined && storeCount > settings.maxLength) {
         alertStore.find('.list').children('.content:first-child').remove().empty();
         storeCount=settings.maxLength;
        }
        alertCount.html(storeCount);
   }
   
   this.add = function(addObj /*{id:'a1', content:'<div>aaa</div>'}*/){
       var storeObj = $('<div class="content"></div>');
       storeObj.append(addObj.content);
       if (addObj.id != undefined) {
            var list =   alertStore.find('.list');
            var $this = this;
            list.children('.content').each(function(){
                if( $(this).attr('id')== addObj.id)
                $(this).empty().remove(); 
            })
            
            storeObj.attr('id', addObj.id);
            list.append(storeObj);
            storeObj.addClass('live').delay(settings.stay, function(){
                $(this).removeClass('live')
            });
            refreshStoreConut();
        }
        
       // alertLive.slideDown(0);
        
        var liveAlert = storeObj.clone(true);
        alertLive.find('.list').append(liveAlert);
        liveAlert.hide(0).slideDown(300).delay(settings.stay, function(){$(this).fadeOut(300,function(){ $(this).remove();});}); 
        
        return storeObj;
   };

 this.remove = function(obj){
       if (typeof obj == "object")
           obj.empty().remove();
      
       if (typeof obj == "string")
            alertStore.children('.list').children('.content[id='+ obj +']').empty().remove(); 
       refreshStoreConut();
 }
      return this;
   };
})(jQuery);


