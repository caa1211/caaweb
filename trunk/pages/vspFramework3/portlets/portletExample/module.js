
//define(id?, dependencies?, factory); 
define(function(require, exports, module){
  var config = {};
  
  var initialize = function($el, config){
  
        //main function here=============================
        var $view =$el;
        var id = $view.id;
     
        $view.on("setting", function(e){
            alert($view.id + " setting");
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
			 var newValue = $view.find('input.inputField').val();
		     $view.trigger('updateConfig', {aaee: newValue});
		});
		
        //public method
        this.met = function(){ alert("met")}
		
	    //main function here=============================
  };

  return {
    init: initialize
  };
  
  
});

