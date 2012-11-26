/*
$view's Method:
	setConfig(JSON)  ;set new config to portlet
	setTitle(STRING) ;set new title to portlet
	refresh()
*/
//define(id?, dependencies?, factory); 
define(function(require, exports){
  var config = {};

  var initialize = function($view, config){

        //main function here=============================
        var id = $view.id;
        
        //cache control object
        var $ipField = $view.find('.ipField');
        var $btn = $view.find('.controls .btn');
        
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
        
        $view.on("fullscreen", function(e){
            console.log($view.id + " fullscreenOn");
        });
        
        $view.on("fullscreenOff", function(e){
            console.log($view.id + " fullscreenOff");
        });
       
        
        
        $btn.click(function(){
            //call $view's method to update
            var ipAddr = $ipField.val();
            $view.setConfig({ipAddr: ipAddr});
            $view.setTitle("performance Portlet " + ipAddr);
            $view.refresh();
        });
        

  };

  return {
    init: initialize
  };
  
  
});

