

; 
(function(){
 
define(["css!./css/style.css",  "require"], function(css ,require){

  var cssUrl = require.toUrl("./css/style.css");
  var config = {};

  var initialize = function($view, config, baseUrl){

  
  
  
   //Method 1 load js by order ----------------
   requirejs.config({
    paths: {
      'inventory': baseUrl+'./js/inventory',
      'cart': baseUrl+'./js/cart'
    },
    shim: {
        "inventory": {
            deps:
              [ 'cart' ]
          }
    }
  });
   
  require(["cart", "inventory"], function(cart, inventory){
        inventory.logColor(cart.color);
  });
 
 
  //Method 2 load js by order -------------------
  /*
  require(["./js/cart"], function(cart){
     require(["./js/inventory"], function(inventory){
        inventory.logColor(cart.color);
     });
  });
  */
  

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

}());