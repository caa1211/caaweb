/*
 * itriFileBrowser.js
 *
 * Copyright (c) 2010 
 * Caa Chang
 *
 * Dual licensed under the GPL (http://www.gnu.org/licenses/gpl.html)
 * and MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 *
 * $Date: 2012-04-24 $
 * $Rev: 001 $
 * 
 *depend on jquery.tablesorter.js
 */

(function($)
{
     

    $.fn.itriFileBrowser = function(settings){
        
       function _L(str){
     
                console.log(str);
       }
            
       var defaultSetting = 
       {
           
       }
       
       settings = $.extend(defaultSetting , settings);
       var $thisObj = $(this);
       var $childList = $thisObj.children('tbody').children('tr');
       var sel = {
                first:null,
                last: null,
                addFirst : function(){
                    sel.first.addClass('select');
                },
                add : function(obj, dragFlag, updateLast){ 
                
                    if(dragFlag == undefined){
                        dragFlag = false;
                    }
                    if(updateLast== undefined){
                        updateLast = true;
                    }
                    if(dragFlag && ( $("#fileList tr.select").length == 0 && sel.first!=null));
                    {
                        sel.addFirst(); 
                    }                       
                    obj.addClass('select');
                    
                    if(updateLast!=false)
                     sel.last = obj;
                },
                clear: function(){_L("dd"); $childList.removeClass('select'); },
                addRange: function(start,end){
                
                _L("range : " + start +" , " + end);
                   var e = start - end > 0 ? start: end;
                   var s = start - end > 0 ? end : start;
                    _L("range : " + s +" , " + e);
                    
                    for(var i=s; i<= e ; i++)
                    {
                     _L("i : " + i);
                  //  $("#fileList tr:nth-child("+i+")")
                     sel.add($thisObj.find("tr:nth-child("+(i+1)+")"), false, false);
                    }
                
                },
                onMouseup: function(e){  
                
                    $childList.unbind('mouseenter', sel.onMouseenter);
                    $childList.unbind('mouseup', sel.onMouseup);
                    
                    if (e.shiftKey && sel.last != null) { //select
                       sel.addRange( $childList.index(sel.last),  $childList.index($(this)));
                       return;
                    }
                    
                    if($(this)[0]==sel.first[0]){
                      sel.add($(this));
                    }
                    
                    sel.first = null;
                    
                    //_L('last index:' +    $("#fileList tr").index(sel.last));
                }, 
                onMouseenter: function(){
                  if($(this)[0]==sel.first[0]){
                    sel.clear();
                  }
                  sel.add($(this));
                },
                all: function(){
                 $childList.addClass('select');
                }
            };
    
        //sorting
    	$thisObj.tablesorter({debug: false});
        $childList.mouseleave(function(){
            $(this).removeClass('hover');
        }).mouseenter(function(){
            $(this).addClass('hover');
        }).mousedown(function(e){
            if($(this).hasClass('select')){//drag
                    //drag.first  = $(this);
                }
                else{//select
                    sel.first  = $(this);
                    if (e.ctrlKey) {
                    }
                    else if (e.shiftKey) {
                    }
                    else{
                      sel.clear();
                    }

                    $childList.unbind('mouseup', sel.onMouseup);
                    $childList.unbind('mouseenter', sel.onMouseenter);
                    $childList.bind('mouseenter', sel.onMouseenter);
                    $childList.bind('mouseup', sel.onMouseup);
                    
                    e.preventDefault(); 
                }
        }); 

         $thisObj.click(function(){return false;});
            

        $(window).keydown(function(e,a){ 
                  if(e.which==65 && e.ctrlKey)
                    sel.all();
        }).click(function(){sel.clear();});
            
        
            
       return this;
    };
 

})(jQuery);


