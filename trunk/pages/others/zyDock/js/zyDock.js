(function($){

    $.fn.changeStatus = function(settings){
        var _handler = function(){
        
            var imgObj = $(this).children('img');
            var imgText = $(this).children('.dockText');
            
            var temp = imgObj.attr('alt');
            var src = imgObj.attr('src');
            imgObj.attr('src', temp);
            imgObj.attr('alt', src);

            imgText.slideToggle(150);
        };
        
        return this.each(_handler);
    };
    
    
    $.fn.zyDock = function(settings){
        var defaultSettings =
        {
            event: 'focus', //or mouse
            minSize: 80,
            maxSize: 150,
            speed: 150 
        };
        
        var _settings = $.extend(defaultSettings, settings);
        
        var _inItem = function(){
            if ($(this).attr('actFlag')) 
                return;
            $(this).attr('actFlag', true);
            
            var dockItem = $(this).children('.dockItem');
            
            
            var position = dockItem.position();
            dockItem/*.css('border', 'solid 1px red')*/.css({
                position: 'relative',
                left: position.left,
                top: position.top
            }).animate({
                left: position.left - _settings.maxSize / 4,
                top: position.top - dockItem.height() / 4,
                width: _settings.maxSize
            }, _settings.speed, function(){
                $(this).changeStatus();
            });
        };
        
        var _outItem = function(){
            if (!$(this).attr('actFlag')) 
                return;
            $(this).attr('actFlag', false);
            var dockItem = $(this).children('.dockItem');
            var position = dockItem.position();
            dockItem.animate({
                left: 0,
                top: 0,
                width: _settings.minSize
            }, _settings.speed).changeStatus();
        };
        
        var _handler = function(){
            
        var $dockItem = $(this).find('.dockItem');
        
        //initial setting
        $dockItem.css('width', _settings.minSize);
        $dockItem.children('img').css('width', '100%');
        $dockItem.children('.dockText').css('display', 'none');
        
        if (_settings.event == 'focus') {
            $dockItem.parent().focus(_inItem);
            $dockItem.parent().blur(_outItem);
        }
        else if (_settings.event == 'mouse') {
            $dockItem.parent().mouseenter(_inItem);
            $dockItem.parent().mouseleave(_outItem);
        }
        
        };
        return this.each(_handler);
    };
    
})(jQuery);
