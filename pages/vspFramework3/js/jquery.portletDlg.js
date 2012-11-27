
 ;
(function($){
//common
    $.fn.Dlg = function(){
        var defaultSetting = {
             fullscreen: false,
             $view:  null,
             title:  "",
             content: {
                text: "",
                objSelector: ""
             },
             buttons:{
                "ok": function(){},
                "cancel": function(){}
             }
        };
        var modalOpts = {
            //backdrop: "static",
            //keyboard: true
        };
        var $dlgObj = $(this);
        var $dlgBody = $dlgObj.find('.modal-body');
        var $dlgHead = $dlgObj.find('.modal-header');
        var $dlgFooter = $dlgObj.find('.modal-footer');
        var $dlgTitle = $dlgHead.find(".modal-title");
        
        var $okBtn = $dlgFooter .find('.ok');
        var $cancelBtn = $dlgFooter .find('.cancel');

        this.show = function(opt){
            var _settings = $.extend({}, defaultSetting, opt);
            
            if(_settings.content.text!=undefined && _settings.content.text!=""){
                $dlgBody.empty().append("<p>"+_settings.content.text+"</p>");
            }else if(_settings.content.objSelector!=undefined && _settings.content.objSelector!=null){

                $portlet = _settings.$view;
                $portletHead = $portlet.find(".widget-head");
                $portletContent = $portlet.find(_settings.content.objSelector);
  
                $dlgObj.unbind("hidden").bind("hidden", function(){
                     putBackPortlet(_settings);
                });
            }
            
            if(_settings.fullscreen){
                var wH = $(window).height();
                var dh =  wH-350 < 200 ? 200: wH-350
                $dlgBody.css('max-height', dh);
                $dlgBody.css('height', dh);

                if(!$portletContent.is(":visible")){
                    $portletContent.show();
                    $portlet.isHidden = true;
                }else{
                    $portlet.isHidden = false;
                }

                $portletContent.oh = $portletContent.height();
                $portlet.hide();
                $portletContent.height(dh-10);
                $portletContent.appendTo( $dlgBody  );
                $portlet.trigger("fullscreenOn");
            }

            $dlgTitle.empty().html(_settings.title);
             
            $okBtn.unbind("click").bind("click", function(){
                _settings.buttons.ok();
                $dlgObj.modal("hide");
            });
            
            $cancelBtn.unbind("click").bind("click", function(){
                _settings.buttons.cancel();
                $dlgObj.modal("hide");
            });
            
            $dlgObj.modal(modalOpts);
        };
        
      function putBackPortlet(_settings){
        if(_settings.fullscreen){
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
      }

      $(document).keyup(function(e){
         if(e.keyCode === 27){
           $dlgObj.modal("hide");
         }
      });

      this.hide = function(){
         $dlgObj.modal("hide");
      };
      
        return this
    };
    
 //fullscreen dialog
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
      var $wrapTmp;
      this.show = function($w, title){
        var wH = $(window).height();
		var dh = wH-350 < 200 ? 200: wH-350
        $dlgBody.css('max-height', dh);
        $dlgBody.css('height', dh);
 
        $portlet = $w;
        $portletHead = $w.find(".widget-head");
        $portletContent = $w.find(".widget-content");
    
        $wrapTmp = $("<div class='wrapTmp widget'></div>"); 

    
        $portlet.wrap($wrapTmp);
        $wrapTmp = $portlet.parent(".wrapTmp");
        
        //fake $portlet by $wrapTmp
        $wrapTmp.attr("pltid", $portlet.attr("pltid"));
        $wrapTmp.width( $portlet.width()+2);
        $wrapTmp.height( $portlet.height());
        
		$dlgTitle.html(title);

        if(!$portletContent.is(":visible")){
            $portletContent.show();
            $portlet.isHidden = true;
        }else{
            $portlet.isHidden = false;
        }
        
        $portlet.children().not( $portletContent ).hide();

        var leftOffset = -1* $dlgObj.width() / 2;
        $dlgObj.css("margin-left", leftOffset);
		$portletContent.oh = $portletContent.height();
       
		$portletContent.height(dh-20);
        $portlet.appendTo( $dlgBody  );
        $dlgObj.modal(opts);
        $portlet.trigger("fullscreenOn");
      };
      
      function putBackPortlet(){
        $portlet.children().show();
        $portlet.appendTo($wrapTmp);
        $portlet.unwrap();
        
        if($portlet.isHidden==true){
           $portletContent.hide();
        }else{}
        
		var oh =  $portletContent.oh;
	    var _oh = oh == undefined ? "auto": oh;
        $portletContent.height(_oh);

        $portlet.fadeIn(200);
        $portlet.trigger("fullscreenOff");
        
        $portlet = null, $portletContent = null, $portletHead = null;
        $wrapTmp.remove();$wrapTmp = null;
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
    };

//setting dialog
    $.fn.settingDlg = function(setting) {
      var $dlgObj = $(this);
      var $dlgBody = $dlgObj.find('.modal-body');
      var $dlgHead = $dlgObj.find('.modal-header');
	  var $dlgTitle = $dlgHead.find(".modal-title");
      
      var $okBtn = $dlgObj.find('.ok');
      var $cancelBtn = $dlgObj.find('.cancel');
      
      var opts = {
        //backdrop: "static",
        //keyboard: true
      };
	   
      var $portlet = null, $portletContent = null, $portletHead = null;
      
      this.show = function($w, title){
        var wH = $(window).height();
		var dh =  wH-350 < 200 ? 200: wH-350
       // $dlgBody.css('max-height', dh);
       // $dlgBody.css('height', dh);
 
        $portlet = $w;
        $portletHead = $w.find(".widget-head");
        $portletSetting = $w.find(".widget-setting");
               
		$dlgTitle.html(title);

        $portletSetting.show();
        $portletSetting.appendTo( $dlgBody  );
        $dlgObj.modal(opts);
        $portlet.trigger("settingOn");
        
        $okBtn.unbind('click').bind("click", function(){
            $portlet.trigger("settingDone", "ok");
            $dlgObj.modal("hide");
        });
        
        $cancelBtn.unbind('click').bind("click", function(){
            $portlet.trigger("settingDone", "cancel");
            $dlgObj.modal("hide");
        });
      };
      
      function putBackPortlet(){
        $portletHead.after($portletSetting);
        $portletSetting.hide();
        $portlet.trigger("settingOff");
        $portlet = null, $portletSetting = null, $portletHead = null;
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
    };     
 
    
})(jQuery);

