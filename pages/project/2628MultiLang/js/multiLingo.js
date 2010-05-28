      //-----------for multi language
      var CLingo ="EN"
	  var lingoURLParam = $.getURLParam("lingo");
      if (lingoURLParam != null) {
      CLingo = lingoURLParam;
      }
	  
	  function updateLingoJs(callback){
        var src;
        switch (CLingo) {
            case 'EN':
                src ="../../js/2628_lang_en.js";
            break;
            case 'CHT':
			    src ="../../js/2628_lang_cht.js";
            break;
        }
		
        $.getScript(src,function(){
            	 var $body = $('body');
                  updateDomLang($body);
				  $body.ajaxComplete(function(){
                  updateDomLang($body);
                  }).ajaxError(function(){alert('ajax error');});
				  callback();
            });
       }

	   function updateDomLang($targetObj){
		 
             $('*[lang]', $targetObj).each(function(){
                  var langS = $(this).attr('lang');
				  var langT = $(this).attr('langType');
			
                 if (langS != undefined && eval(langS)!=undefined && langT!=CLingo ) 
				   { 
				
					if($(this)[0].nodeName=="INPUT")
					$(this).attr('langType',CLingo).attr('value', eval(langS));
					else
					 $(this).attr('langType',CLingo).html(eval(langS));
				   }
              });
         }
		 
		 $(function(){updateLingoJs();});
      //-----------for multi language