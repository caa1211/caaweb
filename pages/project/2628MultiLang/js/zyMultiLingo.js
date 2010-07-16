/*
 * zyMultiLingo.js
 * Copyright (c) 2010 
 * licensed under the GPL (http://www.gnu.org/licenses/gpl.html)
 * $Date: 2010-05-28 $
 * $Rev: 001 $ add refreshLingo method
 * $Date: 2010-05-31 $
 * $Rev: 002 $ fix the tooltip do not be translated issue
 * $Rev: 003 $ fix the input tag issue: use value to be key only when type =button, submit, reset
 * $Rev: 004 $ add T function to get translated string
 * $Rev: 005 $ add error handler for loading lingo failed
 */
;
(function($)
{
    $.zyMultiLingo = function(settings){

       var defaultSetting = 
       {
			 DLingo: 'EN', //default Lingo
			 lingoAttr: 'lingo',
			 lingoTitleAttr: 'lingoTitle',
			 lingos:[
			/* {id : 'EN', src : "js/2628_lang_en.js"},
			 {id :'CHT', src : "js/2628_lang_cht.js"}*/
			 ],
			 initCompleted: function(){},
			 onChange: function(){},
             subFrameSelector: '#mainFrame'
       }
       
      var settings = $.extend(defaultSetting , settings);
	 
	  var CLingo =settings.DLingo;
	  var $LingoObj = this;
	  var dictionary;
	  this.getLingo = function(){return CLingo;};
	  //this.getDict =function(){return dictionary;};
	  this.T = function(str){
	    if(str!=undefined)
		{
			var rStr = dictionary[str];
			return rStr==undefined?str:rStr;
		}
	  }
	  this.getDict =function(){return dictionary;};
	  //this.refresh=function($obj){ this.refreshLingo($obj); };
	  this.refresh =function($obj){ var $p = $obj==undefined ? $('body'):$obj.parent(); $p.find('[lngType]').removeAttr('lngType');  updateDomLang($p);};
    
	  function updateDomLang_forTitle($targetObj)
	   {
	     var lAttr = settings.lingoTitleAttr;
             $('*['+  lAttr +']', $targetObj).filter('[lngTypeT!='+ CLingo +']').each(function(){
				text = $(this).attr('title');
				var lngS = $(this).attr(lAttr); 

				var lingoText = dictionary[lngS];
				
				if(lingoText==undefined)
				lingoText = lngS

				$(this).attr('lngTypeT',CLingo).attr('title', lingoText);
              });
	   }
	   
	  function updateDomLang($targetObj){
	         $targetObj = $targetObj==undefined ? $('body'):$targetObj;
	         var lAttr = settings.lingoAttr;
             $('*['+  lAttr +']', $targetObj).filter('[lngType!='+ CLingo +']').each(function(){
				  var text;
				  if($(this)[0].nodeName=="INPUT"&& (
					$(this).attr('type')=='button'
					|| $(this).attr('type')=='submit' 
					||$(this).attr('type')=='reset')
					)
					 text =$(this).attr('value').replace(/(^\s*)|(\s*$)/g, "");
				  else
					 text = $(this).html().replace(/(^\s*)|(\s*$)/g, "") ;

				  var lngS = $(this).attr(lAttr); 

				var lingoText = dictionary[lngS];
				if(lingoText==undefined)
				   return;

				    if($(this)[0].nodeName=="INPUT" 
					&& (
					$(this).attr('type')=='button'
					|| $(this).attr('type')=='submit' 
					||$(this).attr('type')=='reset')
					)
					$(this).attr('lngType',CLingo).attr('value', lingoText);
					else
					$(this).attr('lngType',CLingo).html(lingoText);

              });
			  updateDomLang_forTitle($targetObj);
  
              var subFrame = $(settings.subFrameSelector , $targetObj);
              if (subFrame.length != 0) {
                  var subFrameBody = subFrame.contents().find('body');
                  if (subFrameBody.length != 0) 
                      updateDomLang(subFrameBody);
              }
       }
	 
	   this.update= function(targetLingo, callback,  $targetObj){ return  this.updateLingo(targetLingo, callback, $targetObj); };
		
	   this.updateLingo= function(targetLingo, callback, $targetObj){
	   
	    var loadRes = true;
	    if(targetLingo!=undefined)
	       loadRes =loadLingo(targetLingo);
		   
		if(loadRes==false) return false;
        
	   if ($targetObj == undefined) 
               $targetObj = $('body');

         this.doInitLingo($targetObj);
 
         
         if (callback != undefined) 
             callback();
               
         $targetObj.trigger('lingoChange');
         settings.onChange();
		 return true;
       }

       
       this.doInitLingo= function($targetObj){
       
           function ajaxCompleteHandler(a, b, c){
               updateDomLang($targetObj);/*if(c.dataType=='html')  updateDomLang($(b.responseText); */
           };

           updateDomLang($targetObj);
           
           $targetObj.unbind('ajaxComplete', ajaxCompleteHandler);
           $targetObj.bind('ajaxComplete', ajaxCompleteHandler);
       };
	   
	   function loadLingo(targetLingo){
			var src;
			$.each(settings.lingos, function(i, d){
			  if(d.id==targetLingo)
			  src = d.src;
			});
			
		if(src == undefined )
		{alert('lingo package is not exist'); return false;}
		
		var getLingoFlag  = true;
		var $body = $('body');
		var errorHandler = function(){alert('lingo package is not exist'); getLingoFlag = false;};

			$.ajaxSetup({async: false});
			$body.bind('ajaxError', errorHandler);
			 
			$.getJSON(src,function(data){
	             dictionary = data;
				 CLingo = targetLingo;
            });
			
		    $body.unbind('ajaxError', errorHandler);
			$.ajaxSetup({async: true});
		
			 
			 return getLingoFlag;
	   }
	   
	  

	  $(function(){ loadLingo(settings.DLingo); $LingoObj.updateLingo(undefined,  settings.initCompleted );});
      return this;
    };
})(jQuery);


