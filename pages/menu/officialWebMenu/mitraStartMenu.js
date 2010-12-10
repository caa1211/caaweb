var doc = {
    W: function(a){
        document.write(a)
    },
    C: function(a){
        return document.createElement(a)
    },
    E: function(a){
        return (typeof(a) == "string") ? document.getElementById(a) : a
    },
    N: function(a){
        return (typeof(a) == "string") ? document.getElementsByName(a) : a
    },
    assign: function(b, a){
        this.E(b).cells[1].innerHTML = a
    }
};


var dolavalamp = function(startItem){
    $('#lavaLampBorderOnly').lavaLamp({
        target: '.menuItem',
        //setOnClick:true,
        // homeTop:50, homeLeft:0, homeHeight:5, homeWidth:600 ,
        //  fx: 'easeOutBack',
        speed: 300,
        returnDelay: 200,
        startItem: startItem,
        //  autoSize:false,
        autoReturn: true//,
        //  returnHome:true 
    });
    
    $('.subMenu').hide();
    var curItem;
    var menuTimeout;
    $('#lavaLampBorderOnly > li.menuItem').mouseenter(function(){
        if (curItem == $(this).attr('id') && menuTimeout != undefined) {
            clearTimeout(menuTimeout);
        }
        
        var pos = $(this).position();
        var subMenu = $(this).children('.subMenu');
        if ($(this).children('.subMenu').attr('durAnim') == undefined) 
            $(this).children('.subMenu').attr('durAnim', 'false');
        
        if ($(this).children('.subMenu').attr('durAnim') == 'false') {
            $(this).children('.subMenu').attr('durAnim', true);
            subMenu.stop(true, true).fadeIn(200, function(){
                $(this).children('.subMenu').attr('durAnim', false);
            });
        }
        else {
            subMenu.stop(true, true).fadeIn(0, function(){
                $(this).children('.subMenu').attr('durAnim', false);
            });
        }
        $('.subMenu').css('z-index', 10);
        subMenu.css('z-index', 1000);
        subMenu.css('left', pos.left);
        
    });
    
    $('#lavaLampBorderOnly > li.menuItem').mouseleave(function(){
        curItem = $(this).attr('id');
        var thisItem = $(this);
        menuTimeout = setTimeout(function(){
            thisItem.children('.subMenu').fadeOut(100);
        }, 200);
    });
};

var doMenu = function(startItem){
/*
    doc.W("<ul id='lavaLampBorderOnly' class='lamp' style='height:auto; height:25px; overflow:visible;'>");
    doc.W("<li id='home' class='menuItem'>");
     doc.W("<a>Home</a>");
    doc.W("</li>");
*/

var aa = $('<div>');
var ul = $("<ul id='lavaLampBorderOnly' class='lamp' style='height:25px; overflow:visible;'>");

var li =  $("<li id='home1' class='menuItem'><a>home</a></li>");
ul.append(li);

var li =  $("<li id='home2' class='menuItem'><a>home</a></li>");
ul.append(li);

var li =  $("<li id='home3' class='menuItem'><a>home</a></li>");
ul.append(li);

var li =  $("<li id='home4' class='menuItem'><a>home</a></li>");
ul.append(li);


aa.append(ul);

doc.W(aa.html());

    dolavalamp(startItem);
};
