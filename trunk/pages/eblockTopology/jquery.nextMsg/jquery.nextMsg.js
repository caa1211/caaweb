/*
*   jquery.nextMsg
*   ----------------------
*   version: 1.0.1
*   date: 4/1/11
*
*   Copyright (c) 2011 Donny Velazquez
*   http://donnyvblog.blogspot.com/
*   http://code.google.com/p/next-msg/
*   
*   Licensed under the Apache License 2.0
*
*/
(function ($) {

    $.fn.nextMsg = function (options) {

        var options = $.extend({}, $.fn.nextMsg.defaults, options);

        //Iterate over the current set of matched elements  
        return this.each(function () {
            var o = options;
            
            // check for empty msg
            o.msg = $.trim(o.msg || this.text());
            if(!o.msg){
            	return;
            }
            
            var obj = $(this);

			var s;
			switch(o.side){
				case "leftMiddle":
					s = "lm";
				break;
				case "topMiddle":
					s = "tm";
				break;
				case "rightMiddle":
					s = "rm";
				break;
				case "bottomMiddle":
					s = "bm";
				break;
			}
			
			// set width
			var width = "";
			if(o.width > 0){
				width = "width:" + o.width + "px;";
			}else if(o.width === 0 && o.maxWidth > 0){
				width = "max-width:" + o.maxWidth + "px;";
			}
			
			// build message box
			var randomNum = Math.ceil(Math.random() * 9999); /* Pick random number between 1 and 9999 */
			var MsgID = "nextMsg" + randomNum;
			var MsgHTML = "<div id='" + MsgID + "' class='nextMsg " + o.CSSClass + "' style='display:none;" + width + "'>" +
								"<div class='nm-arrow-box nm-arrow-box-" + s + "'>" +
									"<span class='nm-arrow nm-arrow-" + s + "'></span>" +
								"</div>" +
								"<div class='nm-box nm-box-" + s + "'>" +
									"<p class='nm-msg'>" + o.msg + "</p>" +
								"</div>" +
							"</div>";
			$("body").append(MsgHTML);

			var Msg = $("#" + MsgID + "");
			
			// attach events
			Msg.click(function(){
				Msg.fadeOut(o.fadeSpeed,function(){
					$(this).remove();
				});
			});
			
			// calculate top and left positions
			var MsgPosition = CalculatePosition(o.side,obj.offset().top, obj.offset().left, obj.outerWidth(), obj.outerHeight(), Msg.outerHeight(), Msg.outerWidth());
			Msg.css({ "top" : MsgPosition.top, "left" : MsgPosition.left}).fadeIn(o.fadeSpeed, function(){
				if(o.minDuration !== -1){
					setTimeout(function(){
						Msg.fadeOut(o.fadeSpeed, function(){ $(this).remove(); });
					},o.minDuration + o.displayDurationPerCharacter * Math.sqrt(o.msg.length));
				}
			});
			
        });
        
        function CalculatePosition(side,objTop,objLeft,objWidth,objHeight,msgHeight,msgWidth){
        	var top;        	
        	var left;           	
           	switch(side){
				case "leftMiddle":
					top = (objTop + (objHeight / 2)) - (msgHeight / 2);
					left = (objLeft - msgWidth)
				break;
				case "topMiddle":
					top = (objTop - msgHeight);
					left = (objLeft + (objWidth / 2)) - (msgWidth / 2);
				break;
				case "rightMiddle":
					top = (objTop + (objHeight / 2)) - (msgHeight / 2);
        			left = (objLeft + objWidth);
				break;
				case "bottomMiddle":
					top = (objTop + objHeight);
					left = (objLeft + (objWidth / 2)) - (msgWidth / 2);
				break;
			}
           	return { top: top, left: left };
        }
	        
    };

    $.fn.nextMsg.defaults = {
		
		msg: "",
		// Message that will go in the box. 
		// Also accepts html
		
		side: "rightMiddle", 
		// Set which side you want the tooltip to appear. Defaults to "rightMiddle".
		// options: leftMiddle, topMiddle, rightMiddle, bottomMiddle
		
		CSSClass: "",
		// Name of the css theme class to apply
		
		maxWidth: 0,
		// This will let the message box expand the width up too the set maxWidth. It uses the css max-width property.
		
		width: 0,
		// Sets the width of the message box. Setting this property will override the "maxWidth" property.
		
		fadeSpeed: 500,
		// Used for the fadeIn and fadeOut speed
		
		displayDurationPerCharacter: 125,
		// This is used to calculate how long the message should be shown depending on how long the message text is.
		
		minDuration: 2500
		// Makes sure that message is shown for at least this amount of time
		// If you set it to -1 it will show until you click on it.
    };

})(jQuery);