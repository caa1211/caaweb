
var utils = {
    tabMgr: null,
    tabContents: null,
    tabDef: [
        {id:'account', label: 'Account', href: "account.html"},
        {id:'files', label: 'Files', href: "files.html"},
        {id:'event', label: 'Event', href: "event.html"},
        {id:'apiVersion', label: 'API version', href: "apiVersion.html"},
        {id:'help', label: 'Help', href: "help.html"}
    ],
    /*
    tabDef: [
    {id:'account', label: 'Account', href: "../tabs/account.html"},
    {id:'files', label: 'Files', href: "../tabs/files.html"},
    {id:'event', label: 'Event', href: "../tabs/event.html"},
    {id:'apiVersion', label: 'API version', href: "../tabs/apiVersion.html"},
    {id:'help', label: 'Help', href: "../tabs/help.html"}
    ],
    */
    buildTab2Element: function(obj){
        var $ul = $("<ul></ul>");
        $.each(this.tabDef, function(i, t){
            var $li = $("<li></li>");
            $li.attr('id',t.id);
            var $a = $("<a></a>");
            $a.attr('href', "#tp");
            $a.attr('url', t.href);
            $a.html(t.label);
            $li.append($a);
            $ul.append($li);
        });
        obj.append($ul);  
        obj.append('<div id="tp" style="display: none;"></div>'); 
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
    },
    pageInit: function (o) {
        var defaultOpt = {
            tabId: ""
        };
        var opt = $.extend({}, defaultOpt, o);
        var tabIndex = 0;
        if (opt.tabId != "") {
            for (var i = 0; i < utils.tabDef.length; i++) {
                if (opt.tabId == utils.tabDef[i].id) {
                    tabIndex = i;
                    break;
                }
            }
        }
        $(function () {
            utils.buildTab2Element($("#tabs"));
            utils.tabMgr = $("#tabs").tabs({
                selected: tabIndex,
                select: function (e, ui) {
                    var url = ui.tab.attributes.url.value;
                    var dynamicLoad = false;
                    if (!dynamicLoad) {
                        window.location.href = url;
                    } else {
                        $("#pathandsearchArea").empty();
                        $("#ctlArea").empty();
                        $("#wrapDiv").empty();
                        $("#wrapDiv").load(url);
                    }
                }
            });

            //jGrowl config
            var jGrowlOptions = {
                position: 'center',
                closer: false
            };
            $.extend($.jGrowl.defaults, jGrowlOptions);
            //usage: $.jGrowl("...");

            //Modify position
            var wrapW = $("#layoutWrap").width();
            var topH = $("#topPanel").height();
            $("#topPanel").width(wrapW)
            $("#fakeHeader").height(topH);
            $("#fakeHeader").width(wrapW - 3);
            $("#contentPanel").width(wrapW - 2);

            //handle image swap
            $('img').each(function () {
                if ($(this).attr('sw_img') != undefined) {
                    utils.swapImg($(this), $(this).attr('sw_img'));
                }
            });
        });
    }


};
