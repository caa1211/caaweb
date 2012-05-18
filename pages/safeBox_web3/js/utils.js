
var utils = {
    tabMgr: null,
    tabDef: [
        {id:'account', label: 'Account', href: "account.html"},
        {id:'files', label: 'Files', href: "files.html"},
        {id:'event', label: 'Event', href: "event.html"},
        {id:'apiVersion', label: 'API version', href: "apiVersion.html"},
        {id:'help', label: 'Help', href: "help.html"}
    ],
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
                    window.location.href = url;
                }
            });

            //jGrowl config
            var jGrowlOptions = {
                position: 'center',//(top-left, top-right, bottom-left, bottom-right, center)
                closer: false
            };
            $.extend($.jGrowl.defaults, jGrowlOptions);
            //usage: $.jGrowl("...");

            //Modify position
            var wrapW = $("#layoutWrap").width();
            var topH = $("#topPanel").height();
            $("#topPanel").width(wrapW)
            $("#fakeHeader").height(topH-1);
            $("#fakeHeader").width(wrapW - 3);
            $("#contentPanel").width(wrapW - 2);

            //handle image swap
            $('img').each(function () {
                if ($(this).attr('sw_img') != undefined) {
                    utils.swapImg($(this), $(this).attr('sw_img'));
                }
            });
        });
    }, 
    theadClone: function(torg, tclone){
                if(torg.length==0 || tclone.length == 0){
                    return;
                }
                var theaderClone = torg.children('thead').clone(false);
                //torg.children('thead').css('visibility', 'hidden')//.find('th').height(0);
                var h = torg.children('thead').height();
    
                torg.css("margin-top", "-"+h+"px");
                
                tclone.addClass(torg.attr('class'));
                tclone.addClass('tclone');
                theaderClone.appendTo(tclone);
                theaderClone.attr('id', 'theaderClone');
                theaderClone.addClass('theaderClone');
                var childTh =   theaderClone.find('th');

                
                $.each(childTh, function(i, t){
                            var index = i+1;
                            var cloneid = "thClone_"+index;
                            var $tth =  torg.children("thead").find("th:nth-child("+index+")");
                            $tth.attr("cloneid", cloneid);
                            
                            var tid =  $tth.attr("id");
                            if( tid == undefined){
                              tid = 'tth_'+i;
                            }
                            $tth.attr("id", tid);
                            $(this).attr("id", cloneid);
                            $(this).attr("targetid", tid);
                            
                        $(this).click(function(e){
                            var tthid =   $(this).attr("targetid");
                            $("#"+tthid).trigger("click");
                            e.stopPropagation();  
                        });
                  });
                  
                  torg.bind("sortEnd",function(e) { 
                           $.each( torg.find("th"), function(i, t){
                              var cls =   $(this).attr("class");
                              var cloneid =   $(this).attr("cloneid");
                              var cloneObj = $("#"+cloneid);
                              cloneObj.attr("class", cls);
                            });
                            e.stopPropagation();  
                  }); 

    }


};
