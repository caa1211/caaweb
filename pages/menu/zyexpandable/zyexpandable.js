

(function($)
{
    $.fn.zyexpandable = function(settings){
        var _defaultSettings = {
            expand:function(){},
            collapse:function(){},
            during: 300
        };
        
        var _settings = $.extend(_defaultSettings, settings);
        
        var $this = $(this);
        var _handler = function(n, v){
        
            $this.find('.expandableBtn').toggle(function(){
                $this.find('div.content').slideDown(_settings.during, _settings.expand);
            }, function(){
                $this.find('div.content').slideUp(_settings.during, _settings.collapse);
            })
            
        };
        
        return this.each(_handler);
        
    };
})(jQuery);


