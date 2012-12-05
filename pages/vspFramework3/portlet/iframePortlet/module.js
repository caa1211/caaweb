 ; 
(function(){


define(function(require){

  var initialize = function($view, config){

        //main function here=============================
        var id = $view.id;
        
        //cache control object
        var $urlField = $view.find('.urlField');

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
                var url = $urlField.val();
                if(url!=""){
                    //call update methods
                    /*
                    $view.setConfig({ipAddr: ipAddr}, function(model){ 
                        console.log("save config done "+ model.get('id')); 
                    });
                   
                   $view.setTitle("performance Portlet : " + ipAddr, function(model){ 
                        console.log("save config done "+ model.get('id')); 
                    });
                    */
                    if(url.indexOf("http")==-1){
                        url = "http://"+url;
                    }
                    $view.setModel({
                        title: "iFrame Portlet : " + url,
                        config:{
                            url: url
                        }
                    }, function(m){
                        $view.refresh();
                    });
                
                   // $view.refresh();
                }
            }
        });
        
        //main function here=============================
  };

  return {
    init: initialize
  };
  
  
});

}());

