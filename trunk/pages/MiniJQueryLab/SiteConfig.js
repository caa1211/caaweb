$(function() {
    var debugMode = false;
    if (location.href.indexOf("darkthread.net") > -1 || debugMode) { //Online version
        $("#spnLoadHtml").hide();
        $("#extInfo").html("<a href='about.htm?height=300&width=650' title='About Mini jQuery Lab' style='color: #aaaaff;font-size: 9pt;' class='thickbox'>About</a>");
        tb_pathToImage = "loadingAnimation.gif";
        //Embed counter
        $("#extInfo").append("<img class='statcounter' src='http://c.statcounter.com/4474484/0/008c36c5/0/' alt='joomla 1.5 statistics' align='middle' style='margin-left: 10px; border: solid 1px orange;'>");
    } else {
        $("#extInfo").hide();
    }
});

