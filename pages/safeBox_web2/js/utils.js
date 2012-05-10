
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
buildTab2Element: function(obj){
    var $ul = $("<ul></ul>");
    $.each(this.tabDef, function(i, t){
    var $li = $("<li></li>");
    $li.attr('id',t.id);
    var $a = $("<a></a>");
    $a.attr('href', "#"+i);
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
},
pageInit:function(o){
    var defaultOpt = {
            tabId: ""
    };
    var opt = $.extend({}, defaultOpt, o);
    
    var tabIndex = 0;
    if(opt.opt!=""){
        for(var i=0; i< utils.tabDef.length; i++)
        {
            if(opt.tabId == utils.tabDef[i].id){
            
                tabIndex = i;
                break;
            }
        }
    }
    
    $(function(){

        utils.buildTab2Element($("#tabs"));
                utils.tabMgr = $( "#tabs" ).tabs({
                        selected: tabIndex,
                        select: function(e, ui) { 
                          var index =ui.tab.attributes[0].value.split("#")[1];
                          window.location.href = utils.tabDef[index].href;
                        }
                });

                //jGrowl config
                var jGrowlOptions = {
                  position: 'center',
                  closer: false
               };
               $.extend ($.jGrowl.defaults, jGrowlOptions);
               
               //--             
              
                var topW = $("#layoutWrap").width();
                var topH = $("#topPanel").height();
                $("#topPanel").width(topW)
                
                $("#fakeHeader").height(topH);
             
                $("#fakeHeader").width(topW-3);
                $("#contentPanel").width(topW-2);
                $("#contentPanel").css('margin-left', "0px");
                
                         
             $('img').each(function(){
             if($(this).attr('sw_img')!=undefined){
                utils.swapImg($(this), $(this).attr('sw_img'));
             }
             });
        });       
   
   }


};
