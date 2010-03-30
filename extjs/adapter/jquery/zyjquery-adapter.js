//extjs to jquery
Ext.override(Ext.Element, {
    getJQuery: function(){
        return $(this.dom);     
    }
});
Ext.apply(Ext, {
    getJQuery: function(el){
        return Ext.get(el).getJQuery();
    }
});


//jquery to extjs
(function($)
{
$.extend({
    getExt:function(el){ 
        return Ext.get($(el).get(0));
    }
});
})(jQuery);