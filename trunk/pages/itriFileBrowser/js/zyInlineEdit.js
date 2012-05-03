/*
 * extend from 
 * jQuery inlineEdit
 * http://yelotofu.com/labs/jquery/snippets/inlineEdit/
 * Inline (in-place) editing.
 */

(function($) {

    $.fn.inlineEdit = function(options) {

        options = $.extend({
            hover: 'hover',
            value: '',
            save: '',
            placeholder: 'Click to edit',
            inputWidth: null,
            initSelect: true,
			inputCls:''
        }, options);

        return $.each(this, function() {
            $.inlineEdit(this, options);
        });
    }

    $.inlineEdit = function(obj, options) {
    debugger;
        var self = $(obj),
            placeholderHtml = '<span class="inlineEdit-placeholder">'+ options.placeholder +'</span>';

        self.value = function(newValue) {
            if (arguments.length) {
                self.data('value', $(newValue).hasClass('inlineEdit-placeholder') ? '' : newValue);
            }
            return self.data('value');
        }
                
        self.value($.trim(self.text()) || options.value);
        
        self.bind('click', function(event) {
            var $this = $(event.target);

            if ($this.is('button')) {
                var hash = {
                    value: $input = $this.siblings('input').val()
                };
                
                if (($.isFunction(options.save) && options.save.call(self, event, hash)) !== false || !options.save) {
                    self.value(hash.value);
                }

            } else if ($this.is(self[0].tagName) || $this.hasClass('inlineEdit-placeholder')) {
                
                var inputW = options.inputWidth==null ?  self.width()-5 : options.inputWidth;

               var inputObj =  self
                    .html('<input type="text" value="'+ self.value() +'" style="width:'+ inputW +'px;" class='+options.inputCls +'>')
                    .find('input')
                        .bind('blur', function() {
                            if (self.timer) {
                                window.clearTimeout(self.timer);
                            }
                            self.timer = window.setTimeout(function() {
                                if (($.isFunction(options.save) && options.save.call(self, event, hash)) !== false || !options.save) {
                                    var newValue = $this.find('input').val();
                                    self.value(newValue);
                                }
                                self.html( self.value() || placeholderHtml);
                                self.removeClass(options.hover);
                            }, 200);
                        })
                        .focus();
                        
                        if(options.initSelect)
                        inputObj.select();
            }
        })
        .hover(
            function(){
                $(this).addClass(options.hover);
            },
            function(){
                $(this).removeClass(options.hover);
            }
        );
        
        if (!self.value()) {
            self.html($(placeholderHtml));
        }
    }

})(jQuery);