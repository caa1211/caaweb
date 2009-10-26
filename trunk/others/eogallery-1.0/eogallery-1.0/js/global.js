function make_links()
{
	var liens = document.getElementsByTagName('a');
	for (var i = 0 ; i < liens.length ; ++i)  {
		if (liens[i].className == 'ext')  {
			liens[i].onclick = function()  {
				window.open(this.href);
				return false;
			};
		}
	}
}

$(document).ready( function() {
	make_links();
});