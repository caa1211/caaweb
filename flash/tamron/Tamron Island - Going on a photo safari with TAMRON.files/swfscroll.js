var SWFScroll = function(swfObj, width, height) {
    this.addListener(window, "resize", this.adjustFlashSize);
    
            
    this.swfObj = swfObj;
    this.width = width;
    this.height = height;
    
    this.adjustFlashSize();
    
    
    
};

SWFScroll.prototype = {
    addListener : function(el, type, fn) {
        var scope = this;
        var fnWrap = function() {
            fn.call(scope);
        }
        
        if (window.addEventListener) {
            el.addEventListener(type, fnWrap, false);            
        } else if (window.attachEvent) {
            el.attachEvent("on" + type, fnWrap);            
        }
    },
    adjustFlashSize : function() {
        var winSize = this.getWinSize();
		
        var swfObj = this.swfObj;
        
        swfObj.width = (winSize.width < this.width) ? this.width : "100%";
        swfObj.height = (winSize.height < this.height) ? this.height : "100%";				            
        
    },
    getWinSize: function() {
        var doc = document,
            win = doc.defaultView || doc.parentWindow,
            mode = doc['compatMode'],
            h = win.innerHeight,
            w = win.innerWidth,
            root = doc['documentElement'];
        
        var isOpera = navigator.userAgent.match(/Opera[\s\/]([^\s]*)/);;
        
        if ( mode && !isOpera ) { // IE, Gecko
            if (mode != 'CSS1Compat') { // Quirks
                root = doc.body; 
            }
            h = root.clientHeight;
            w = root.clientWidth;
        }
        return { height: h, width: w }; 
    }	
};

SWFScroll.create = function(swfObj, width, height) {
    var scroll = new SWFScroll(swfObj, width, height);
};