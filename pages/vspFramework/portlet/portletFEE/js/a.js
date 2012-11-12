define(function(){  
 
  return {  
        bFun: 
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