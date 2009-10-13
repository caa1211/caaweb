$.cancelBubble = function(evt) {
	//cancel bubble event
	if (window.event) //for IE       
		window.event.cancelBubble = true;
	else
		//for Firefox        
		evt.stopPropagation();
};