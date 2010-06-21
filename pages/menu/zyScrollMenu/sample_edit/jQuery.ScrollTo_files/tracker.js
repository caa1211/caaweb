if( window._gat ){
	var pageTracker = _gat._getTracker("UA-2357772-4");

	// Basic initialization
	pageTracker._initData();
	pageTracker._trackPageview();
	
	// Events
	pageTracker.event = function( action, label ){
		var parts = location.pathname.slice(1).split('/'),
			category = parts[0];
		
		if( parts[1] )
			category += '.' + parts[1];
		
		pageTracker._trackEvent( category, action, label );
	};
	
	// Setup events
	
	// Script downloads
	(function(){
		function track(){
			var label = this.href.slice(base.length);
			
			pageTracker.event( 'script-download', label );
		}
		
		var base = 'http://flesler-plugins.googlecode.com',		
			links = document.getElementsByTagName('a'),
			i = links.length;
		
		while( i-- ){
			var link = links[i];
			if( link.href.indexOf(base) == 0 )
				link.onclick = track;
		}
	})();
}