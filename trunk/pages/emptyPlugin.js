/*
 * emptyPlugin.js
 *
 * Copyright (c) 2010 
 * Caa Chang
 *
 * Dual licensed under the GPL (http://www.gnu.org/licenses/gpl.html)
 * and MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 *
 * $Date: 2010-02-04 $
 * $Rev: 001 $
 * 
 */

(function($)
{
     
    

    $.fn.emptyPlugin = function(settings){
        
       var defaultSetting = 
       {
           
       }
       
        settings = $.extend(defaultSetting , settings);
    

        var _handler = function(){
    
        };
      
        var emptyPlugin = this.each(_handler);
      
        return emptyPlugin;
    };
 

})(jQuery);


