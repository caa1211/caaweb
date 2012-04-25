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
            $("#debugDiv").append("<div>"+str+"</div>")
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
       modifyImgPos();
       $thisObj.prepend("<div class='thumbCounter'><span style='width:"+ thumbCWidth +"px;'>"+len+"</span></div>");
       
       $thisObj.append(_settings.imgs);
       return this;
    }
   
   
    $.fn.itriFileBrowser = function(settings){

       var _settings = $.extend({}, defaultSetting , settings);
       var $thisObj = $(this);
       var $childList = $thisObj.children('tbody').children('tr');
               
       function dragHelper(){
            
         
            return this;
       };
        
       function selHelper(targetList){
            this.first = null;
            this.last = null;
            var sel  = this;
            this.onMouseenter = function(e){
                  sel.clear();
                  sel.addRange( targetList.index(sel.first),  targetList.index($(this)));
            };
            this.onMouseup = function(e){   
                if (e.shiftKey && sel.last != null) { //select
                    sel.removeRange( targetList.index(sel.first), targetList.index(sel.last))
                    sel.addRange( targetList.index(sel.first),  targetList.index($(this)));
                }
                else{
                  sel.first = $(this);
               }
                
                sel.last = $(this);

                if(!$(this).hasClass('select'))
                    sel.add($(this));
                
                sel.endHandler();      
            };
            
            this.add = function(obj){
                obj.addClass('select');
            };
            
            this.remove = function(obj){
                obj.removeClass('select');
            };
            
            this.removeRange = function(s, e){
              //_L("remove : s " + s + ", e " + e)
              if(e>s){
                  for(var i=s; i<=e; i++)
                  {
                      var obj = findChildByIndex(i+1);
                      sel.remove(obj);
                  }     
              }
              else{
                  for(var i=s; i>=e; i--)
                  {
                      var obj = findChildByIndex(i+1);
                      sel.remove(obj);
                  }     
              }
            };
            function findChildByIndex(idx){
             return targetList.filter("tr:nth-child("+(idx)+")");
            }
            
            this.addRange = function(s, e){
              //_L("add : s " + s + ", e " + e)
              if(e>s){
                  for(var i=s; i<=e; i++)
                  {
                      var obj = findChildByIndex(i+1);
                      sel.add(obj);
                  }     
              }
              else{
                  for(var i=s; i>=e; i--)
                  {
                      var obj = findChildByIndex(i+1);
                      sel.add(obj);
                  }     
              }
            };

            this.clear = function(){
                //_L("clear")
                targetList.removeClass('select');
            };
            
            this.endHandler = function(){};//overrided by caller
         
            return this;
       };
         
        var _selHelper = new selHelper($childList);
        
        function unbindSelEvent(items, helper){
            items.unbind('mouseenter', helper.onMouseenter);
            items.unbind('mouseup', helper.onMouseup);
        }

        $childList.mousedown(
            function(e){
                if($(this).hasClass('select')){//drag
                   
                   
                }
                else{//select
                   //initSelEvent($childList, _selHelper);
                    
                    if (e.ctrlKey) {
                      _selHelper.first = $(this);
                    }
                    else if (e.shiftKey) {
                      //_selHelper.clear();
                    }
                    else{
                      _selHelper.first = $(this);
                      _selHelper.clear();
                    }
                
                   $childList.bind('mouseenter', _selHelper.onMouseenter);
                   $childList.bind('mouseup', _selHelper.onMouseup);
                    
                   _selHelper.endHandler = function(){
                        unbindSelEvent($childList, _selHelper);
                   };
                }

            }
        );
       
       //hover
        $childList.mouseleave(function(e){
            $(this).removeClass('hover');
               e.preventDefault(); 
        }).mouseenter(function(e){
            $(this).addClass('hover');
               e.preventDefault(); 
        });

       
       function preventDefault(e){
         e.preventDefault(); 
       };
        
       $thisObj.mousedown(preventDefault);
        
       return this;
    };
 

})(jQuery);


