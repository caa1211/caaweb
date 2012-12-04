/*
Event:
    setting
    refresh
    destroy
    fullscreen
    fullscreenOn
    fullscreenOff
    settingOn
    settingOff
    settingDone
    
    
$view's Method:
	setConfig(JSON)  ;set new config to portlet
	setTitle(STRING) ;set new title to portlet
	refresh()
*/

//define(id?, dependencies?, factory); 
define(["css!./css/style.css", "./js/cart.js", "./js/inventory.js"], function(css, cart, inventory){

  inventory.logColor(cart.color);
 
 
 
   
  var config = {};

  var initialize = function($view, config){

        //main function here=============================
        var id = $view.id;
        
        
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
       
        $view.on("settingOn", function(e){
            console.log($view.id + " settingOn");
        });
        
        $view.on("settingOff", function(e){
            console.log($view.id + " settingOff");
        });
        
        
        $view.on("settingDone", function(e, res){
            console.log($view.id + " settingDone " + res );
            if(res == "ok"){
                console.log($view.id + " setting ok");
                
                //call update methods
                //$view.setConfig({ipAddr: ipAddr});
                //$view.setTitle("performance Portlet : " + ipAddr);
                //$view.refresh();
    
            }else{
                console.log($view.id + " setting cancel");
            }
        });
        
        //main function here=============================

  };

  return {
    init: initialize
  };
  
  
});

