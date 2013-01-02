

; 
(function(){

define(["require", "text!./tmpl/win.tmpl"], function(require, winTmpl){

  var initialize = function($view, config){

     //main function here=============================
     var id = $view.id;
     
     var $btn = $view.find(".doubleWinBtn");
     var winTmplFn = _.template(winTmpl);
     var $win = $(winTmplFn({id:id+"_win"}));
     
     $("body").append($win);

     $btn.click(function(event){
        $win.modal();   
     });
     
     $view.bind("destroy", function(){
        $win.unbind().remove();
     });
     //main function here=============================

  };

  return {
    init: initialize
  };

});

}());
