/*
2008/07/13
    IE6 png fix

jQuery.shadow ver 0.2Beta

Options:
    alignY: "middle", "top", "bottom"
    alignX: "left", "center", "right"
    width:  number
    height: number
    
 Example: 
use default settings
   
   $(".pic").shadow();
    
 or use options
 
     var opt = {
        width: 100,
        height: 150,
        alignX: "center"
    };
    $(".pic").shadow(opt);
*/
;(function($) {

$.fn.shadow = function(settings) {

    var _defaultSettings = {
        /*對齊方式*/
        alignY: "middle",
        alignX: "center",
        /*陰影區塊大小*/
        width: "auto",
        height: "auto"
    };
    
    var _settings = $.extend(_defaultSettings, settings);
    
    var _handler = function() {

        var xml = $(this).html();//原本元素的內容
        var replace_xml = '<table class="shadow_table"><tr><td class="shadow_left_top"></td><td class="shadow_top"></td><td class="shadow_right_top"></td></tr><tr><td class="shadow_left"></td><td class="shadow_xml">'+xml+'</td><td class="shadow_right"></td></tr><tr><td class="shadow_left_bottom"></td><td class="shadow_bottom"></td><td class="shadow_right_bottom"></td></tr></table>';
        $(this).empty().append(replace_xml);
        
        $(this).find(".shadow_xml").css("vertical-align",_settings.alignY).css("text-align",_settings.alignX).css("width",_settings.width).css("height",_settings.height);
        
        /*width fix*/
        $(this).css("width",$(this).find("table").width());//IE OK
        if($(this).width() >= screen.availWidth) {//no width
            $(this).css("width",$(this).width()-$(this).offset().left);
        }

        /*png fix*/
        if($.browser.msie && $.browser.version < 7) {
            var path;
            for(var i =0; i < 9; i++)
            {
                path = $(this).find(".shadow_table td").eq(i).css("background-image");
                path = path.split('"');
                $(this).find(".shadow_table td").eq(i).css("filter",'progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=scale, src="' + path[1] + '")');
                $(this).find(".shadow_table td").eq(i).css("background-image","none");
            }
        }
    };
    return this.each(_handler);
};

})(jQuery);