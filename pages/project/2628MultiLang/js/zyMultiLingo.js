/*
 * zyMultiLingo.js
 *
 * Copyright (c) 2010 
 * 
 *
 * licensed under the GPL (http://www.gnu.org/licenses/gpl.html)
 * 
 *
 * $Date: 2010-05-28 $
 * $Rev: 001 $
 * add refreshLingo method
 */

;
(function($)
{
    $.zyMultiLingo = function(settings){

       var defaultSetting = 
       {
			 DLingo: 'EN', //default Lingo
			 lingoAttr: 'lingo',
			 lingoTitleAttr: 'lingoT',
			 lingos:[
			/* {id : 'EN', src : "js/2628_lang_en.js"},
			 {id :'CHT', src : "js/2628_lang_cht.js"}*/
			 ],
			 loadCompleted: function(){} 
       }
       
      var settings = $.extend(defaultSetting , settings);
	 
	  var CLingo =settings.DLingo;
	  var $LingoObj = this;
	  var dictionary;
	  this.getLingo = function(){return CLingo;};
	  this.getDictionary =function(){return dictionary;};
	  this.refreshLingo =function($obj){ var $p = $obj.parent(); $p.find('[lngType]').removeAttr('lngType');  updateDomLang($p);};

	  function updateDomLang_forTitle($targetObj)
	   {
	     var lAttr = settings.lingoTitleAttr;
             $('*['+  lAttr +']', $targetObj).each(function(){

				  text = $(this).attr('title');
					 
				  var lngS = $(this).attr(lAttr); 
                  if(lngS =='auto')
				   {
				   $(this).attr(lAttr, text);
				   lngS = text;
				   }
				   
		       var lngT = $(this).attr('lngType');
				  
				 if (lngT!=CLingo )
				{
				var lingoText = dictionary[lngS];
				
				if(lingoText==undefined)
				lingoText = lngS

					 $(this).attr('lngType',CLingo).attr('title', lingoText);
				}

              });
	   }
	   
	  function updateDomLang($targetObj){
	
	         var lAttr = settings.lingoAttr;
             $('*['+  lAttr +']', $targetObj).each(function(){

				  var text;
				  if($(this)[0].nodeName=="INPUT")
					 text =$(this).attr('value');
				  else
					 text = $(this).html();
					 
				  var lngS = $(this).attr(lAttr); 
                  if(lngS =='auto')
				   {
				   $(this).attr(lAttr, text);
				   lngS = text;
				   }
				   
		       var lngT = $(this).attr('lngType');
				  
				  if (lngT!=CLingo )
				{
				
				var lingoText = dictionary[lngS];
				
				if(lingoText==undefined)
				lingoText = lngS

				    if($(this)[0].nodeName=="INPUT")
					$(this).attr('lngType',CLingo).attr('value', lingoText);
					else
					 $(this).attr('lngType',CLingo).html(lingoText);

				  }

              });
			  
			  updateDomLang_forTitle($targetObj);
       }

	 
	   this.updateLingo= function(targetLingo, callback){
       var src;
        $.each(settings.lingos, function(i, d){
		  if(d.id==targetLingo)
		  src = d.src;
		})
        var callbackRes;
	    var $body = $('body');
		function ajaxCompleteHandler(){   updateDomLang($body); };
		function ajaxErrorHandler(){   alert('ajax error');  callbackRes=0; };
		
		if(src == undefined )
		{alert('lingo package is not exist'); return;}
		
		CLingo = targetLingo;
	   
		  $.ajaxSetup({async: false});
       $.getJSON(src,function(data){
	             callbackRes=1;
	             dictionary = data;
            	 updateDomLang($body);
                $body.unbind('ajaxComplete').unbind('ajaxError');
				$body.bind('ajaxComplete', ajaxCompleteHandler).bind('ajaxError', ajaxErrorHandler);
				  
				  if(callback!=undefined)
				  callback(callbackRes);
            });
		 $.ajaxSetup({async: true});
       }
 
	  $(function(){$LingoObj.updateLingo(settings.DLingo, settings.loadCompleted);});
      return this;
    };
})(jQuery);


