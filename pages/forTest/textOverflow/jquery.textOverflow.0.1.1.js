/*
 * THIS IS FREE SCRIPT BUT LEAVE THIS COMMENT IF
 * YOU WANT USE THIS CODE ON YOUR SITE
 * 
 * Made by Pieter Overbeeke, Ipportunities [new media], pieter@ipportunities.nl april 1 2009 (not a joke)
 * 
 *
 * Description: http://textoverflow.ipdemo.nl
*/

jQuery.fn.textOverflow = function(options) {
  settings = jQuery.extend({
	 lines: 1,
     ellipsis: "...",
     wrap: "word",
     link: "",
	 titleAttr: false
  }, options);

  return this.each(function() {  
	$('head').append($('<style>.tExTOvErFLoW {margin-right: -10000px;}</style>'));
	$(this).addClass("tExTOvErFLoW");
	var boxWidth = $(this).width() - 10000;
	var content = $(this).html()+' ';
	var newContent = "";
	var testLine = "";
	var tempLine = "";
	var contentPos = 0;
	var tempPos = 0;
	var lastChar = "";
	var lineNr = 1;
	
	while (lineNr <= settings.lines && contentPos < content.length) {
		testLine = content.substr(contentPos, content.substr(contentPos, content.length - contentPos).indexOf(' '));
		contentPos = contentPos + content.substr(contentPos, content.length - contentPos).indexOf(' ') + 1;
		if (lineNr != settings.lines) //not the last line yet
			{
			$(this).html('<span>'+testLine+'</span>');
			}
		else //last line (and first...)
			{
			$(this).html('<span>'+testLine+settings.ellipsis+' '+settings.link+'</span>');
			}
		while (contentPos < content.length && $(this).children().width() <= boxWidth) {
			tempLine = testLine;
			tempPos = contentPos;
			testLine += ' '+content.substr(contentPos, content.substr(contentPos, content.length - contentPos).indexOf(' '));
			contentPos = contentPos + content.substr(contentPos, content.length - contentPos).indexOf(' ') + 1;
			if (lineNr != settings.lines) //not the last line yet
				{
				$(this).html('<span>'+testLine+'</span>');
				}
			else //last line
				{
				$(this).html('<span>'+testLine+settings.ellipsis+' '+settings.link+'</span>');
				}
			}

		if ($(this).children().width() > boxWidth)
			{
			if (lineNr < settings.lines || settings.wrap == 'word')
				{
				testLine = tempLine;
				contentPos = tempPos;
				}
			else
				{
				while ($(this).children().width() > boxWidth)
					{
					testLine = testLine.substr(0, testLine.length - 1);
					$(this).html('<span>'+testLine+settings.ellipsis+' '+settings.link+'</span>');
					}
				}
			}
		if (lineNr < settings.lines)
			{
			newContent += testLine+' ';
			}
		else
			{
			newContent += testLine+settings.ellipsis+' '+settings.link;
			}
		lineNr++;
		lastChar = "";
		}
	$(this).removeClass("tExTOvErFLoW");
	if (settings.titleAttr) {
		$(this).attr("title", content);
	}
	$(this).html(newContent);
	});
}