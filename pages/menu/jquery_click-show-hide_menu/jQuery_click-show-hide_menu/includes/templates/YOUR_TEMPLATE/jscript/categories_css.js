$(function() {	
		   
	$('li').children('ul').hide();
	
	$('li:has(ul)').children('a').click(function() {
																																																								
		$(this).parent('li').children('ul').toggle();
		//$(this).parent('li').children('ul').slideToggle();
		
		return false;		
		
	});	
	
	$('html').removeClass('js');
	
	/* the following two lines will ensure that the UL opens to the section that you had open on the navigation when you left the page, if you wish the navigation to simply revert back to all the categories being closed when you leave a page then remove the two lines of code below */
	
	$('a.on').parent('li').children('ul').show();
	
	$('a.on').parent('li').parent('ul').show();

});
