$.zyCheckboxSync = function(settings){
    var _handler = function(){
        var boss = settings.boss;
        var member = settings.member;
        if (boss.is('input:checkbox') == false || member.is('input:checkbox') == false) 
            return;
        boss.click(function(){
            member.attr('checked', boss.is(":checked"))
        });
        member.bind('click', function(){
            var isAllChecked = member.filter('input:checkbox:checked').length == member.length;
            boss.attr('checked', isAllChecked);
        });  
    };
    return _handler();
};
