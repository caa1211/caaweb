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
     
             
       function _L(str){
        var debugDiv =  $("#debugDiv");
         if( debugDiv.length != 0){
            $("#debugDiv").html(str)
               // console.log(str);
            }
       }
            
       var defaultSetting = 
       {
           
       };
       
       
    $.fn.thumbnails = function(settings){
       var $thisObj = $(this);
       var defaultSetting = 
       {
           imgs:null
       };
       
       var _settings = $.extend({}, defaultSetting , settings);
       var len = _settings.imgs.length;
       function modifyImgPos(){
       
       var offset=0;
       $.each(_settings.imgs, function(){
         $(this).css("position", "absolute").css("left", offset*3).css("top", offset*6).css("z-index", 100-offset);
         offset++;
        });
       }

       var thumbCWidth =  9+Math.floor(len/10)*5 ;
       //_L(thumbCWidth)
       modifyImgPos();
       $thisObj.prepend("<div class='thumbCounter'><span style='width:"+ thumbCWidth +"px;'>"+len+"</span></div>");
       
       $thisObj.append(_settings.imgs);
       return this;
    }
   
   
    $.fn.itriFileBrowser = function(settings){

       var _settings = $.extend({}, defaultSetting , settings);
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
                clear: function(cobj){
                   if(cobj == undefined || cobj) {
                   cobj = $childList;
                   }
                  cobj.removeClass('select'); 
                },
                addRange: function(start,end){
                
                _L("range : " + start +" , " + end);
                   var e = start - end > 0 ? start: end;
                   var s = start - end > 0 ? end : start;
                    _L("range : " + s +" , " + e);
                    
                    for(var i=s; i<= e ; i++)
                    {
                     _L("i : " + i);
                  //  $("#fileList tr:nth-child("+i+")")
                     var range = $thisObj.find("tr:nth-child("+(i+1)+")");
                     sel.add(range, false, false);
                    }
                
                },
                onMouseup: function(e){  
                
                    $childList.unbind('mouseenter', sel.onMouseenter);
                    $childList.unbind('mouseup', sel.onMouseup);
                    
                    if (e.ctrlKey) {
                   /*  if($(this).hasClass('select')){
                        $(this).removeClass('select');
                        return;
                        }*/
                    }
                    
                    if (e.shiftKey && sel.last != null) { //select
                    
                       //sel.clear();
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
                  /*if($(this)[0]==sel.first[0]){
                    sel.clear();
                  }
                  sel.add($(this));
                  */
                  sel.clear();
                  sel.addRange( $childList.index(sel.first),  $childList.index($(this)));
                  
                },
                all: function(){
                 $childList.addClass('select');
                }
            };
    
        var drag = {
            first: null,
            selecitons: null,
            selThumbs: null,
            dropTargets: null,
            dragging: false,
            onMouseup: function(e){
               $childList.removeClass("allow-drop").removeClass("not-drop");
               $childList.unbind('mouseenter', drag.onMouseenter);
               $childList.unbind('mouseup', drag.onMouseup);
               $childList.unbind('mousemove', drag.onInit);
               $childList.unbind('mousemove', drag.onMousemove);
               $(window).unbind('mousemove', drag.onMousemove);
               drag.dropTargets.unbind('mouseup', drag.onDrop);
               
               if(drag.selThumbs != null)
                {
                drag.selThumbs.empty().remove();
                drag.selThumbs = null;
                }
 
            if(drag.dragging == false) //click self
              {
                 if (e.ctrlKey && $(this).hasClass('select')) {
                     $(this).removeClass('select');
                }
                else{    
                    sel.clear();
                    sel.first = $(this);
                    sel.add($(this));
                }
              }
              
              drag.dragging = false;
              e.preventDefault(); 
            },
            onMouseenter: function(e){
              /* if($(this).hasClass('folder') && !$(this).hasClass('select'))
                $(this).addClass("allow-drop");
               else
                $(this).addClass("not-drop");*/
                 e.preventDefault(); 
            },
            onMousemove: function(e){ 
                //_L("move " + e.pageY);
                //e = $.event.fix(e);
                drag.dragging = true;
                drag.selThumbs.css('left',e.pageX +10).css('top',e.pageY+10);
                e.preventDefault(); 
            },
            onDrop: function(){
              drag.dropTargets.unbind('mouseup', drag.onDrop);
             
              sel.clear();
              drag.onDropDone($(this));
              //_L("drop" + selStr + " to "+ $(this).find(".name").html())
 
            },
            onDropDone: function(target){
              var selStr =" [ "; 
              drag.selecitons.each(function(){
              selStr = selStr + ", " +$(this).find(".name").html();
              })
              selStr = selStr + " ] ";
               _L("drop" + selStr + " to "+ target.find(".name").html())
               
                 drag.selecitons.empty().remove();
            },
            dragFilter: function(){
                   if($(this).hasClass('folder') && !$(this).hasClass('select'))
                    {
                      $(this).addClass("allow-drop");
                      return true;
                    }
                   else
                    {
                      $(this).addClass("not-drop");
                      return false;
                    }
            },
            onInit: function(e){
               $childList.unbind('mousemove', drag.onInit);
               drag.selThumbs = $("<div id='selThumbs' class='selThumbs'></div>");
               $("body").append(drag.selThumbs);
               drag.selThumbs.thumbnails({imgs: $childList.filter('.select').find('img').clone()});
               drag.dropTargets = $childList.filter(drag.dragFilter).bind('mouseup', drag.onDrop);
             
            }
        }
        
        function initEventBinding(){
            $childList.unbind('mouseup', drag.onMouseup);
            $childList.unbind('mouseenter', drag.onMouseenter);
            $childList.unbind('mousemove', drag.onMousemove);
            $childList.unbind('mousemove', drag.onInit);
            $childList.unbind('mouseup', sel.onMouseup);
            $childList.unbind('mouseenter', sel.onMouseenter);
            $(window).unbind('mousemove', drag.onMousemove);
        }

        $childList.mouseleave(function(e){
            $(this).removeClass('hover');
               e.preventDefault(); 
        }).mouseenter(function(e){
            $(this).addClass('hover');
               e.preventDefault(); 
        }).mousedown(function(e){
        
                initEventBinding();
                
                if($(this).hasClass('select')){//drag
                    drag.first  = $(this);
                    drag.selecitons = $childList.filter('.select');
                    $childList.bind('mouseenter', drag.onMouseenter);
                    $childList.bind('mousemove', drag.onInit);
                    $(window).bind('mousemove', drag.onMousemove);
                    $childList.bind('mouseup', drag.onMouseup);
                }
                else{//select
                  
                    sel.first  = $(this);
                    if (e.ctrlKey) {
                    }
                    else if (e.shiftKey) {
                      sel.clear();
                    }
                    else{
                      sel.clear();
                    }

                    $childList.bind('mouseenter', sel.onMouseenter);
                    $childList.bind('mouseup', sel.onMouseup);
                    
                    e.preventDefault(); 
                }
        }); 

         $thisObj.click(function(){return false;});
            
            /*
        function preventDef(e){
         e.preventDefault(); 
         return false;
        }
         $thisObj.mouseenter(preventDef).mouseup(preventDef).mousemove(preventDefault);
         */
         
        $(window).keydown(function(e,a){ 
                  if(e.which==65 && e.ctrlKey)
                    sel.all();
        }).click(function(){sel.clear();});
            
        
            
       return this;
    };
 

})(jQuery);


