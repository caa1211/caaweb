
 ;
(function($){
 
    $.fn.portletDlg = function(setting) {
      
      var $dlgObj = $(this);
      var $dlgBody = $dlgObj.find('.modal-body');
      var $dlgHead = $dlgObj.find('.modal-header');
	  var $dlgTitle = $dlgHead.find(".modal-title");
      var opts = {
        //backdrop: "static",
        //keyboard: true
      };
	   
      var $portlet = null, $portletContent = null, $portletHead = null;
      this.show = function($w, title){
        var wH = $(window).height();
		var dh =  wH-350 < 200 ? 200: wH-350
        $dlgBody.css('max-height', dh);
        $dlgBody.css('height', dh);
 
        $portlet = $w;
        $portletHead = $w.find(".widget-head");
        $portletContent = $w.find(".widget-content");
               
        //todo: write portlet title to head
        
		$dlgTitle.html(title);
        //--
        if(!$portletContent.is(":visible")){
            $portletContent.show();
            $portlet.isHidden = true;
        }else{
            $portlet.isHidden = false;
        }
        
        var leftOffset = -1* $dlgObj.width() / 2;
        $dlgObj.css("margin-left", leftOffset);
		$portletContent.oh = $portletContent.height();
        $w.hide();
		$portletContent.height(dh-10);
        $portletContent.appendTo( $dlgBody  );
        $dlgObj.modal(opts);
        $portlet.trigger("fullscreenOn");
      };
      
      function putBackPortlet(){
      
        if($portlet.isHidden==true){
           $portletContent.hide();
           
        }else{}
		var oh =  $portletContent.oh;
	    var _oh = oh == undefined ? "auto": oh;
        $portletContent.height(_oh);
        $portlet.append($portletContent);
        $portlet.fadeIn(200);
        $portlet.trigger("fullscreenOff");
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

