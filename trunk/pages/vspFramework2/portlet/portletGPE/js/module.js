define(function(){  
  return {  
        alertFun: function(name){ 
           alert("alertFun " + name);
        },
        template: {
            btn: "<button class='btn debugBtn'> <%= name %> </button>"
        }
     
   };  
});