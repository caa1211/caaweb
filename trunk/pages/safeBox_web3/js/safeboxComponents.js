var MM_swapImgRestore = function(){ //v3.0
    var i, x, a = document.MM_sr;
    for (i = 0; a && i < a.length && (x = a[i]) && x.oSrc; i++) 
        x.src = x.oSrc;
}

var MM_preloadImages = function(){ //v3.0

    var d = document;
    if (d.images) {
        if (!d.MM_p) 
            d.MM_p = new Array();
        var i, j = d.MM_p.length, a = MM_preloadImages.arguments;
        for (i = 0; i < a.length; i++) 
            if (a[i].indexOf("#") != 0) {
                d.MM_p[j] = new Image;
                d.MM_p[j++].src = a[i];
            }
    }
}

var MM_findObj = function(n, d){ //v4.01
    var p, i, x;
    if (!d) 
        d = document;
    if ((p = n.indexOf("?")) > 0 && parent.frames.length) {
        d = parent.frames[n.substring(p + 1)].document;
        n = n.substring(0, p);
    }
    if (!(x = d[n]) && d.all) 
        x = d.all[n];
    for (i = 0; !x && i < d.forms.length; i++) 
        x = d.forms[i][n];
    for (i = 0; !x && d.layers && i < d.layers.length; i++) 
        x = MM_findObj(n, d.layers[i].document);
    if (!x && d.getElementById) 
        x = d.getElementById(n);
    return x;
}

var MM_swapImage = function(){ //v3.0
    var i, j = 0, x, a = MM_swapImage.arguments;
    document.MM_sr = new Array;
    for (i = 0; i < (a.length - 2); i += 3) 
        if ((x = MM_findObj(a[i])) != null) {
            document.MM_sr[j++] = x;
            if (!x.oSrc) 
                x.oSrc = x.src;
            x.src = a[i + 2];
        }
}

var createTabs = function(){
    $('#wrap').empty();
    var mainDivTxt = '';
    mainDivTxt += '<div class="demo">';
    mainDivTxt += '<div id="tabs" style="height:'+ (window.innerHeight-200) +'px; background:#ffffff">';
    mainDivTxt += '<ul>';
    mainDivTxt += '<li><a href="#tabs-1">Account</a></li>';
    mainDivTxt += '<li><a href="#tabs-2">Files</a></li>';
    mainDivTxt += '<li><a href="#tabs-3">Event</a></li>';
    mainDivTxt += '<li><a href="#tabs-4">API Version</a></li>';
    mainDivTxt += '<li><a href="#tabs-5">Help</a></li>';
    mainDivTxt += '</ul>';
    mainDivTxt += '<div id="tabs-1"></div>';
    mainDivTxt += '<div id="tabs-2"></div>';
    mainDivTxt += '<div id="tabs-3"></div>';
    mainDivTxt += '<div id="tabs-4"></div>';
    mainDivTxt += '<div id="tabs-5"></div>';
    mainDivTxt += '</div>';
    mainDivTxt += '</div>';
    
    $('#wrap').append(mainDivTxt);
    
    $("#tabs").tabs({
        show: function(event, ui){
            createTabsComponents('tabs-' + (parseInt($('#tabs').tabs('option', 'selected')) + 1));
        }
    });
}

var createTabsComponents = function(tabsId){
    $('#' + tabsId).empty();
    
    var mainDivTxt = '';
    mainDivTxt += '<table class="innerData" border="0" width="100%"><tr><td colspan="4" class="innerBanner" id="bannerMenu"></td></tr>';
    mainDivTxt += '<tr class="tableTitle" id="tableTitleTr" align="middle" ></tr>';
    mainDivTxt += '</table>';
    $('#' + tabsId).append(mainDivTxt);
    
    
    switch (tabsId) {
		//Account
        case 'tabs-1':{
            var innerTableHtml = '';
			innerTableHtml += '<div id="" class="innerTableDiv">here you are</div>';
            $('.tableTitle').append(innerTableHtml);
            
//            mainDivHtml = '';
//            for (var i = 0; i < 11; i++) {
//                mainDivHtml += '<tr class="tableInnerData"><td>1</td><td>2</td><td>3</td></tr>';
//            }
//            // storage used
//            mainDivHtml += '<tr ><td colspan="3" height="50px" align="middle" valign="bottom">Totally storage used 65% (6500MB of 10G)</td></tr>';
//            mainDivHtml += '<tr ><td colspan="3" height="20px" align="middle" valign="bottom"><table style="width:100%; height:20px; border-style: solid;border-width: thin;"><tr><td width="65%" style="background:#71d6f7"></td><td></td></tr></table></td></tr>';
//            $('#tableTitleTr').after(mainDivHtml);
        }
break;

		//Files
        case 'tabs-2':{
            var innerBannerHtml = '<table width="100%"><tr>';
            innerBannerHtml += '<td><input type="text" placeholder="Search SafeBox" name="searchField" id="searchField">&nbsp;<img src="images/img/icon_search_up.png" ;onMouseOver="MM_swapImage(\'search\',\'\',\'images/img/icon_search_over.png\',1)"></td>';
            innerBannerHtml += '<td width="200px" align="right"><img src="images/img/icon_addfolder_up.png" onMouseOver="MM_swapImage(\'search\',\'\',\'images/img/icon_search_over.png\',1)">&nbsp;';
            innerBannerHtml += '<img src="images/img/icon_delete_up.png" onMouseOver="MM_swapImage(\'search\',\'\',\'images/img/icon_search_over.png\',1)">&nbsp;';
            innerBannerHtml += '<img src="images/img/icon_download_up.png" onMouseOver="MM_swapImage(\'search\',\'\',\'images/img/icon_search_over.png\',1)">&nbsp;';
            innerBannerHtml += '<img src="images/img/icon_delete_up.png" onMouseOver="MM_swapImage(\'search\',\'\',\'images/img/icon_search_over.png\',1)">';
            innerBannerHtml += '</td></tr></table>';
			
            $('.innerBanner').append(innerBannerHtml);
            
			var innerTableHtml = '';
			innerTableHtml += '<div id="" class="innerTableDiv">here you are</div>';
            $('.tableTitle').append(innerTableHtml);
//            var mainDivHtml = '<td width="30%">Name</td>';
//            mainDivHtml += '<td width="20%">Size</td>';
//            mainDivHtml += '<td >Modified</td>';
//            $('.tableTitle').append(mainDivHtml);
//            
//            mainDivHtml = '';
//            for (var i = 0; i < 13; i++) {
//                mainDivHtml += '<tr class="tableInnerData"><td>1</td><td>2</td><td>3</td></tr>';
//            }
//            $('.tableTitle').after(mainDivHtml);
        }
break;
		
		//Event
        case 'tabs-3':{
            var innerBannerHtml = '<table width="100%"><tr>';
            innerBannerHtml += '<td><input type="text" placeholder="Search SafeBox" name="searchField" id="searchField">&nbsp;<img src="images/img/icon_search_up.png" ;onMouseOver="MM_swapImage(\'search\',\'\',\'images/img/icon_search_over.png\',1)"></td>';
            innerBannerHtml += '<td width="200px" align="right"><Select id="searchTypes" name="searchTypes" ><option value="1">All Types</option></Select>&nbsp;';
            innerBannerHtml += '<Select id="searchDate" name="searchDate" ><option value="1">Today</option></Select>&nbsp;';
            innerBannerHtml += '</td><td width="20" ><img src="images/img/icon_refresh_up.png" onMouseOver="MM_swapImage(\'search\',\'\',\'images/img/icon_refresh_up.png\',1)">&nbsp;';
            innerBannerHtml += '</td></tr></table>';
            $('.innerBanner').append(innerBannerHtml);
			
			var innerTableHtml = '';
			innerTableHtml += '<div id="" class="innerTableDiv">here you are</div>';
            $('.tableTitle').append(innerTableHtml);
            
//            var mainDivHtml = '<td width="30%">Name</td>';
//            mainDivHtml += '<td width="20%">Size</td>';
//            mainDivHtml += '<td >Modified</td>';
//            $('.tableTitle').append(mainDivHtml);
//            
//            mainDivHtml = '';
//            for (var i = 0; i < 13; i++) {
//                mainDivHtml += '<tr class="tableInnerData"><td>1</td><td>2</td><td>3</td></tr>';
//            }
//            $('.tableTitle').after(mainDivHtml);
        }
break;

		//API Version
        case 'tabs-4':{
            var innerBannerHtml = '<table width="100%" class="innerData"><tr>';
            innerBannerHtml += '<td>SafeBox Version';
            innerBannerHtml += '</td></tr></table>';
            $('.innerBanner').append(innerBannerHtml);
            
			var innerTableHtml = '';
			innerTableHtml += '<div id="" class="innerTableDiv">here you are</div>';
            $('.tableTitle').append(innerTableHtml);
			
			
//            var mainDivHtml = '<td width="50%" align="left" colspan="2">&nbsp;&nbsp;Windows:</td>';
//            mainDivHtml += '<td align="left" colspan="2">&nbsp;&nbsp;Linux:</td>';
//            $('.tableTitle').append(mainDivHtml);
//            
//            mainDivHtml = '';
//            for (var i = 0; i < 13; i++) {
//                mainDivHtml += '<tr class="tableInnerData"><td>&nbsp;</td><td>- SafeBox v1.12</td><td>&nbsp;</td><td>- SafeBox v1.12</td></tr>';
//            }
//            $('.tableTitle').after(mainDivHtml);
        }
break;

		//Help
        case 'tabs-5':{
            var innerBannerHtml = '<table width="100%" class="innerData"><tr>';
            innerBannerHtml += '<td>';
            innerBannerHtml += '</td></tr></table>';
			
            $('.innerBanner').append(innerBannerHtml);
            
            var innerTableHtml = '';
			innerTableHtml += '<div id="" class="innerTableDiv">here you are</div>';
            $('.tableTitle').append(innerTableHtml);
            
//            mainDivHtml = '';
//            mainDivHtml += '<tr class="tableInnerData"><td>&nbsp;</td><td>- FAQ</td></tr>';
//            mainDivHtml += '<tr class="tableInnerData"><td>&nbsp;</td><td>- Documents</td></tr>';
//            mainDivHtml += '<tr class="tableInnerData"><td>&nbsp;</td><td>- Software Download</td></tr>';
//            mainDivHtml += '<tr class="tableInnerData"><td>&nbsp;</td><td>- Contacts</td></tr>';
//            mainDivHtml += '<tr class="tableInnerData"><td>&nbsp;</td><td>- Report Bug</td></tr>';
//            
//            $('.tableTitle').after(mainDivHtml);
        }
break;
        
    }
    
}
