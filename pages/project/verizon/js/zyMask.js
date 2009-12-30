/*Joze
 *depend on jquery.blockUI.js
 * */

(function($)//use $ to instead JQuery
{
    $.zyMask = function(settings){
        defaults = {
            // message displayed when blocking (use null for no message) 
            message: '<div><img src="../images/loading.gif" /> <div>Loading...<div></div>',
            css: {
                padding: 0,
                margin: 0,
                font: 'bold 11px tahoma, arial, helvetica, sans-serif',
                top: '40%',
                left: '35%',
                textAlign: 'center',
                color: '#FFF',
                border: '0px solid #aaa',
                backgroundColor: 'transparent',
                cursor: 'wait'
            },
            overlayCSS: {
                backgroundColor: '#000',
                opacity: 0.70
            },
            fadeIn:  0,
            fadeOut: 100,
            forceIframe: true

        };
        //override
        var _settings = $.extend(defaults, settings);
        //if(jQuery.browser.msie)
        //_settings.fadeIn = 0;
        
        $.blockUI(_settings);
    };
    

    $.zyUnmask = function(){
        $.unblockUI();
       //return this.each($.unblockUI);
    };
    
})(jQuery);