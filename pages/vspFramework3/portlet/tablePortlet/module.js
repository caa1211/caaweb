/*
Events:
	"updateTitle", string
	"updateConfig", json Object
	
*/
//define(id?, dependencies?, factory); 
define(function(require, exports){
  var config = {};

  var initialize = function($view, config){

        //main function here=============================
        var id = $view.id;
		var $inputField = $view.find('input.inputField');
      
		//-Event-
        $view.on("setting", function(e){
            console.log($view.id + " setting");
        });
        
        $view.on("refresh", function(e){
            console.log($view.id + " refresh");
        });
  
        
        $view.on("destroy", function(e){
            console.log($view.id + " destroy");
        });
        
        $view.on("fullscreenOn", function(e){
            console.log($view.id + " fullscreenOn");
        });
        
        $view.on("fullscreenOff", function(e){
            console.log($view.id + " fullscreenOff");
        });
        //-Event-

  };

  return {
    init: initialize
  };
  
  
});

