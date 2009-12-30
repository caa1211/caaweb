$(function(){
    optionLength = 4;
    for (var x = 1; x <= optionLength - 1; x++) {
        $('#select_' + x).bind('selectMe', function(e){
            {;
                $(e.target).find('._off').fadeOut('fast');
                $(e.target).find('._on').fadeIn('fast');
            }
        });
    }
    $('#select_4').bind('selectMe', function(e){
        $('#error_mssage').fadeIn('fast');
    });
    
    //hide all selections	
    function stopSilde(){
        for (var x = 1; x <= optionLength - 1; x++) {
            if (silder.value == x) 
                continue;
            $('#select_' + x).find('._on').attr('style', 'display:none;');
            $('#select_' + x).find('._off').removeAttr('style');
        }
        $('#error_mssage').fadeOut('fast');
    }
    
    var periousValue = 2;
    var silder;
    $('#select_2').trigger('selectMe');
    silder = $("#silder").slider({
        value: 2,
        animate: true,
        orientation: 'horizontal',
        min: 1,
        max: 3,
        //handle: $('.draw_btn'),
        step: 1,
        stop: function(event, ui){
            if (periousValue != ui.value) 
                stopSilde();
        },
        change: function(event, ui){
            if (periousValue != ui.value) {
                $('#select_' + ui.value).trigger('selectMe');
                periousValue = ui.value;
            }
        }
    });
    
});
