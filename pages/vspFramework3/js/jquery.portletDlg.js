
 ;
(function($){
 
    $.fn.portletDlg = function(setting) {
      
      var $dlgObj = $(this);
      var $dlgBody = $dlgObj.find('.modal-body');
      var $dlgHead = $dlgObj.find('.modal-header');
      var opts = {
        //backdrop: "static",
        //keyboard: true
      };
  
      var $portlet = null, $portletContent = null, $portletHead = null;
      
      this.show = function($w){
        var wH = $(window).height();
        $dlgBody.css('max-height', wH-350);
        $dlgBody.css('height', wH-350);
 
        $portlet = $w;
        $portletHead = $w.find(".widget-head");
        $portletContent = $w.find(".widget-content");
               
        //todo: write portlet title to head
        
        //--
        if(!$portletContent.is(":visible")){
            $portletContent.show();
            $portlet.isHidden = true;
        }else{
            $portlet.isHidden = false;
        }
        
        var leftOffset = -1* $dlgObj.width() / 2;
        $dlgObj.css("margin-left", leftOffset);
        $w.hide();
        
        $portletContent.appendTo( $dlgBody  );

        $dlgObj.modal(opts);
        $portlet.trigger("fullScreenOn");
      };
      
      function putBackPortlet(){
      
        if($portlet.isHidden==true){
           $portletContent.hide();
           
        }else{}
        
        $portlet.append($portletContent);
        $portlet.fadeIn(200);
        $portlet.trigger("fullScreenOff");
        $portlet = null, $portletContent = null, $portletHead = null;
      }
      
      
      $(document).keyup(function(e){
         if(e.keyCode === 27){
           $dlgObj.modal("hide");
         }
      });
      
      $dlgObj.bind("hidden", function(){
         putBackPortlet();
      });
    
      this.hide = function(){
         $dlgObj.modal("hide");
      };
      
      return this;
    }  
    
})(jQuery);

