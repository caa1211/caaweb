define(function(){  
 
  return {  
        aFun: 
        function(name){ 
           alert("Fee " + name);        
           /* return {  
                name: name,  
                gender: gender  
            };  
           */
        },
        template: {
            btn: "<button class='debugBtn'> <%= name %> </button>"
        }
     
   };  
 
});