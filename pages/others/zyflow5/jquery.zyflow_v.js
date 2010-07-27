;
(function($){

  $.fn.zyflow = function(settings){
  
     var _defaultSettings = {
           interval : 110,
           normalWidth : 100,
           activeWidth: 150,
           activeIndex: 0,
           during: 200,
           middleOffset: 0,
           naviCompleted: function(){},
           vertical: false
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
        
                $('.flowContainer').animate({'top':middlePosition - itl * ai},d);

                $this.children('.item').each(function(i, data){
                   //$(data).attr('flowId', i);
               
                   if (i < ai) 
                        $(this).animate({
                            'top': i * itl, 
                            'width': nw
                            
                        }, d).children('img').animate({
                            'width': nw
                          
                        }, d
                        , function(){
                             $(this).parent().children('.caption').hide(); 
                             $(this).css('cursor', 'pointer')
                        }
                        );
                       
                    if (i == ai)        //$(this).css('left',i*interval).children('img').css('width', middleInterval);
                    {
                        $(this).animate({
                            'top': i * itl, 
                            'width': aw
                         
                        }, d).children('img').animate({
                            'width': aw
                        }, d
                        , function(){
                           $(this).parent().children('.caption').hide(); 
                           
                            $(this).css('cursor', 'default')
                            
                           var currentTitle = $(this).parent().children('.caption').html();
                           $('.flowItemTitle').html(currentTitle);
                          _settings.naviCompleted( _settings.activeIndex, data );}
                        );
                    }
                    if (i > ai)        //$(this).css('left',i*interval + middleInterval - width).children('img').css('width', width);
                    {
                        $(this).animate({
                            'top': i * itl + (aw - nw), 
                            'width': nw
                            
                        }, d).children('img').animate({
                            'width': nw
                        }, d
                        , function(){
                             $(this).parent().children('.caption').hide(); 
                             $(this).css('cursor', 'pointer')
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
      $this.children('.item').each(function(i, d){
          $(d).click(function(e){ 
            
          if(flowObj.activeIndex != i)
          naviTo(i, _settings.during);     e.stopPropagation();
          
          });
          $(d).bind('mouseenter', function(){ $(this).css('cursor', 'pointer')});
      });
      
      naviTo(_settings.activeIndex , 0);   
     };
  
     var zyflow = this.each(_handler);
     return zyflow;
  };

})(jQuery);