// JavaScript Document
function padLeft(str, lenght){
    if (str.length >= lenght) 
        return str;
    else 
        return padLeft("0" + str, lenght);
}

    $(function(){

    var root = $("div.scrollable").scrollable({
       vertical: true,
       size: 1,
       speed: 500,
       keyboard: false, 
       clickable: false,
       onSeek: function(){  $('#pageNum').html(padLeft(this.getPageIndex()+1, 2));}
    })
    
    
    
     var api = root.scrollable();

     
     if (api.getPageAmount() < 2) {
         $('.nextPage').addClass('disabled');
         //paging
         $('#pageNum').css('visibility', 'hidden');
         $('#totalPageNum').css('visibility', 'hidden');
         $('.line').css('visibility', 'hidden');
     }


     $('#totalPageNum').html(padLeft(api.getPageAmount(), 2));
 

     function focusPage(index){
         if ($(this).attr('id') != 'highlight') {
             $('.scrollable').scrollTo(0, 100, {queue: true});
             
             if (index != api.getPageIndex()) {
                 api.setPage(index);
             }
         }
     }

     $('.items ul').each(function(i, d){
         $(d).bind('focusPage', function(){
             focusPage(i);
         });
         $(this).find('li:first-child a').bind('focus', function(){
             $(d).trigger('focusPage');
         });
         $(this).find('li:last-child a').bind('focus', function(){
             $(d).trigger('focusPage');
         });
     })
    
});