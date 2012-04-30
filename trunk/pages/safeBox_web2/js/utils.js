
var utils = {
tabMgr: null,
tabContents: null,
tabDef: [
{id:'account', label: 'Account', href: "tabs/account.html"},
{id:'files', label: 'Files', href: "tabs/files.html"},
{id:'event', label: 'Event', href: "tabs/event.html"},
{id:'apiVersion', label: 'API version', href: "tabs/apiVersion.html"},
{id:'help', label: 'Help', href: "tabs/help.html"}
],
buildTab2Element: function(obj){
/*
	<ul>
		<li><a href="tabs/account.html">Account</a></li>
		<li><a href="tabs/files.html">Files</a></li>
		<li><a href="tabs/event.html">Event</a></li>
		<li><a href="tabs/apiVersion.html">API version</a></li>
		<li><a href="tabs/help.html">Help</a></li>
	</ul>
*/ 

var $ul = $("<ul></ul>");

$.each(this.tabDef, function(i, t){

    var $li = $("<li></li>");
    $li.attr('id',t.id);
    var $a = $("<a></a>");
    $a.attr('href', t.href);
    $a.html(t.label);
    $li.append($a);
    $ul.append($li);
    });
    obj.append($ul);  
},
swapImg:function(obj, imgSrc){

    if(obj.attr('oSrc')==undefined){
        obj.attr('oSrc', obj.attr('src'));
    }

    obj.hover(function(){
        $(this).attr('src',imgSrc);
    }, function(){
        $(this).attr('src', obj.attr('oSrc'));
    });

}
};
