;
(function($){

  $.fn.zyflow = function(settings){
  
     var _defaultSettings = {
           interval : 110,
           normalWidth : 100,
           activeWidth: 250,
           activeIndex: 0,
           during: 200,
           middleOffset: 0,
           naviCompleted: function(){}
     }

     var _settings = $.extend(_defaultSettings, settings);

     this.activeIndex =_settings.activeIndex;
     var flowObj = this;
     
     var naviTo = function(ai,d){
         mo = _settings.middleOffset;
         d = d == undefined ? _settings.during : d;

         var itl = _settings.interval;
         var aw =_settings.activeWidth;
         var nw = _settings.normalWidth;  
         var middlePosition = mo == 0 ? 0 : mo - aw / 2;
         _settings.activeIndex = ai;
         flowObj.activeIndex = ai;
    
         if (d != undefined) 
             during = 0;
                  $('.flowContainer').animate({'left':middlePosition - itl * ai},d);
                $this.children('.item').each(function(i, data){
                   //$(data).attr('flowId', i);
                   if (i < ai) 
                        $(this).animate({
                            'left': i * itl
                        }, d).children('img').animate({
                            'width': nw
                        }, d
                        , function(){
                          $(this).parent().children('.caption').fadeOut(100);
                        }
                        );
                       
                    if (i == ai)        //$(this).css('left',i*interval).children('img').css('width', middleInterval);
                    {
                        $(this).animate({
                            'left': i * itl
                        }, d).children('img').animate({
                            'width': aw
                        }, d
                        , function(){
                          $(this).parent().children('.caption').fadeIn(100);  
                          _settings.naviCompleted( _settings.activeIndex, data );}
                        );
                    }
                    if (i > ai)        //$(this).css('left',i*interval + middleInterval - width).children('img').css('width', width);
                    {
                        $(this).animate({
                            'left': i * itl + (aw - nw)
                        }, d).children('img').animate({
                            'width': nw
                        }, d
                        , function(){
                          $(this).parent().children('.caption').fadeOut(100);
                        }
                        
                        );
                    }  
                    
                })     
     };
    
     this.naviTo = function(index, middleOffset, during){
         naviTo(index, during);   
     };
     
     var $this = $(this);

     this.setMiddleOffset = function (middleOffset){
         _settings.middleOffset = middleOffset;
         naviTo( _settings.activeIndex, 0);
     } ;
     this.itemLength  = $this.children('.item').length;

     var _handler = function(){
      naviTo(_settings.activeIndex , 0);   
      
      $this.children('.item').each(function(i, d){
          $(d).click(function(e){   naviTo(i, _settings.during);     e.stopPropagation();});
          $(d).mouseenter(function(){ $(this).css('cursor', 'pointer');})
         
      });
      
     };
  
     var zyflow = this.each(_handler);
     return zyflow;
  };

})(jQuery);