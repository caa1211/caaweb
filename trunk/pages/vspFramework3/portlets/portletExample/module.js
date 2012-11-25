/*
Events:
	"updateTitle", string
	"updateConfig", json Object
	
*/
//define(id?, dependencies?, factory); 
define(function(require, exports){
  var config = {};
  //be careful to use model
  var initialize = function($view, config, model){
        //main function here=============================
		//$view.trigger('updateTitle', "Portlet");
        var id = $view.id;
		var $inputField = $view.find('input.inputField');

		
        $view.on("setting", function(e){
            alert($view.id + " setting 11111111111");
        });
        
        $view.on("refresh", function(e){
            alert($view.id + " refresh");
        });
  
        $view.on("beforeDestory", function(e){
            alert($view.id + " beforeDestory");
        });
        
        $view.on("destroy", function(e){
            //alert($view.id + " destroy");
        });
        
        $view.on("fullscreenOn", function(e){
            alert($view.id + " fullScreenOn");
        });
        
        $view.on("fullscreenOff", function(e){
            alert($view.id + " fullScreenOff");
        });
        /*
		$("#"+id+"_btn").click(function(){
			 alert($view.id + " button click");
		});
		*/
		
		$view.find('.myBtn').click(function(){
			 //alert($view.id + " my button click");
			 var newValue = $inputField.val();
		     $view.trigger('updateConfig', {aaee: newValue});
			$view.trigger('updateTitle', newValue);
			

		});
		
        //public method
        this.met = function(){ alert("met")}
		
	    //main function here=============================
  };

  return {
    init: initialize
  };
  
  
});

