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
 
function _L(str){
        var debugDiv =  $("#debugDiv");
        if( debugDiv.length != 0){
            $("#debugDiv").append("<div>"+str+"</div>")
               // console.log(str);
        }
}

(function($)
{


            
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
         $(this).css("position", "absolute").css("left", offset*-3).css("top", offset*7).css("z-index", 100-offset);
         offset++;
        });
       }

       var thumbCWidth =  9+Math.floor(len/10)*5 ;
       modifyImgPos();
       $thisObj.prepend("<div class='thumbCounter'><span style='width:"+ thumbCWidth +"px;'>"+len+"</span></div>");
       //_settings.imgs.css({"width": "45", "height":"45"});
       $thisObj.append(_settings.imgs);
       return this;
    }
   
   
    $.fn.itriFileBrowser = function(settings){

       var defaultSetting = {
        rawData: null,
        onDrop: function(sel, target, selData, targetData){
                      var selStr =" [ "; 
                      selections.each(function(){
                        selStr = selStr +$(this).find(".name").html() + ", ";
                      })
                      selStr = selStr + " ] ";
                       _L("drop" + selStr + " to "+ target.find(".name").html())
                       
                      selections.empty().remove();
                },
        onUpdateSel: function(sels, selsData, isAdd){},
       };

       var _settings = $.extend({}, defaultSetting , settings);
       var $thisObj = $(this);
       var getChildList = function(){
           return  $thisObj.children('tbody').children('tr');
       };
       var $childList =  getChildList();
        
       this.getRawData = function(){
            return _settings.rawData;
       };
       
       function selHelper(){
            this.first = null;
            this.last = null;
            var sel  = this;
            
            this.onMouseenter = function(e){
                  var targetList = getChildList();
                  sel.clear();
                  sel.addRange( targetList.index(sel.first),  targetList.index($(this)));
            };
            this.onMouseup = function(e){   
                var targetList = getChildList();
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
                _settings.onUpdateSel(sel.getSelections(), sel.getSelectionsData(), true);
            };
            
            this.remove = function(obj, fireEvent){
                obj.removeClass('select');
                if(fireEvent==true)//only press ctrl+click
                  _settings.onUpdateSel(sel.getSelections(), sel.getSelectionsData(), false);
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
             var targetList = getChildList();
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

            this.clear = function(fireEvent){
                var targetList = getChildList();
                targetList.removeClass('select');
                if(fireEvent == true) //only click spack area
                _settings.onUpdateSel(sel.getSelections(), sel.getSelectionsData(), false);
            };
            
            this.selectAll = function(){
                 var targetList = getChildList();
                 targetList.addClass('select');
                 _settings.onUpdateSel(sel.getSelections(), sel.getSelectionsData(), true);
            };
            
            this.getSelections = function(){
                 var targetList = getChildList();
                 return targetList.filter('.select');
            };
            
            this.getSelectionsData = function(){
                 var targetList = getChildList();
                 var domAry = targetList.filter('.select');
                 var dataAry = [];
                 $.each(domAry, function(){
                    var data = _settings.rawData[$(this).attr('dataIndex')];
                    dataAry.push(data);
                 })
                 return dataAry;
            }
            
            this.getDataAt = function(index){
                return _settings.rawData[index];
            };

            this.endHandler = function(){};//overrided by caller
         
            return this;
       };
         
       function dragHelper(){
            var drag  = this;
            var sel = null
            var selections = null;
            var dragging = false;
            this.setSelectItems = function(selobj){
               sel = selobj;
            };
            var selThumbs = null;
            this.onMouseenter = function(e){
            
            };
            
            this.onInitmove = function(e){
               var targetList = getChildList();
               dragging = true;
               selections = sel.getSelections();
               targetList.unbind('mousemove', drag.onInitmove);
               selThumbs = $("<div id='selThumbs' class='selThumbs'></div>");
               $("body").append(selThumbs);
               var $img =  selections.find('img').clone();
               selThumbs.thumbnails({imgs: selections.find('img').clone()});
               drag.dropTargets = targetList.filter(drag.dragFilter);
               drag.dropTargets.bind('mouseup', drag.onDrop);
            };
            
            this.onDrop = function(){
              drag.dropTargets.unbind('mouseup', drag.onDrop);
              //sel.clear();
              drag.onDropDone($(this));
            };
            
            this.onDropDone = function(target){
              //_settings.onDrop(selections, target);
              _settings.onDrop(selections, target, sel.getSelectionsData(), sel.getDataAt(target.attr('dataIndex')));
              
            };
            
            this.onMousemove = function(e){
                //_L("move " + e.pageY);
                if(selThumbs!=null){
                   selThumbs.css('left',e.pageX +10).css('top',e.pageY+10);
                  }
            };
            this.onMouseup = function(e){
               var targetList = getChildList();
               targetList.removeClass("allow-drop").removeClass("not-drop");
               drag.endHandler();
               
               setTimeout(function(){
                   if(drag.dropTargets!=undefined && drag.dropTargets!=null){
                     drag.dropTargets.unbind('mouseup', drag.onDrop);
                   }
               }, 1);

               if(selThumbs != null){
                selThumbs.empty().remove();
                selThumbs = null;
                }
                
            if(dragging == false) //click self
              {
                if (e.ctrlKey && $(this).hasClass('select')) {
                     sel.remove($(this), true);
                }
                else if (e.shiftKey) {
                    sel.removeRange( targetList.index(sel.first), targetList.index(sel.last))
                    sel.addRange( targetList.index(sel.first),  targetList.index($(this)));
                }
                else{    
                    sel.clear();
                    sel.first = $(this);
                    sel.add($(this));
                }
              }   
              dragging = false;              
            };
            
            this.onDocMouseup = function(){
               var targetList = getChildList();
               targetList.removeClass("allow-drop").removeClass("not-drop");
               drag.endHandler();
               
               setTimeout(function(){
                   if(drag.dropTargets!=undefined && drag.dropTargets!=null){
                     drag.dropTargets.unbind('mouseup', drag.onDrop);
                   }
               }, 1);

               if(selThumbs != null){
                    selThumbs.empty().remove();
                    selThumbs = null;
                }
                
                dragging = false;      
            }
            
            this.endHandler = function(){};
            
            this.dragFilter = function(){
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
            };
            
            return this;
       };
        
        
        var _sel = new selHelper();
        var _drag = new dragHelper();
        
        function unbindDragEvent(items, helper){
            items.unbind('mouseenter', helper.onMouseenter);
            items.unbind('mousemove', helper.onInitmove);
            items.unbind('mouseup', helper.onMouseup);
            $(document).unbind('mouseup', helper.onDocMouseup);
            $(document).unbind('mousemove', _drag.onMousemove);
        }

        function unbindSelEvent(items, helper){
            items.unbind('mouseenter', helper.onMouseenter);
            items.unbind('mouseup', helper.onMouseup);
        }

        $childList.mousedown(
            function(e){
                var childList = $thisObj.children('tbody').children('tr');
                if($(this).hasClass('select')){//drag
                    _drag.setSelectItems(_sel);
                    childList.bind('mouseenter', _drag.onMouseenter);
                    childList.bind('mousemove', _drag.onInitmove);
                    childList.bind('mouseup', _drag.onMouseup);
                    $(document).bind('mouseup', _drag.onDocMouseup);
                    $(document).bind('mousemove', _drag.onMousemove);
                    _drag.endHandler = function(){
                        unbindDragEvent(childList, _drag);
                    };
                }
                else{//select
                   //initSelEvent(childList, _selHelper);
                    if (e.ctrlKey) {
                      _sel.first = $(this);
                    }
                    else if (e.shiftKey) {
                      //_sel.clear();
                    }
                    else{
                      _sel.first = $(this);
                      _sel.clear();
                    }
                
                   childList.bind('mouseenter', _sel.onMouseenter);
                   childList.bind('mouseup', _sel.onMouseup);
                    
                   _sel.endHandler = function(){
                        unbindSelEvent(childList, _sel);
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
       }
        
       function stopPropagation(e){
          e.stopPropagation();  
       }
       
       function preventDefaultAndStopPropagation(e){
          e.preventDefault(); 
          e.stopPropagation();  
       }

       this.selectAll = function(){
         _sel.selectAll();
       }
       
       this.getSelections = function(){
         _sel.getSelections();
       }

       
       this.getDragDropHelper = function(){
        return _drag;
       }
       
       $thisObj.mousedown(preventDefault).mouseup(preventDefault).mousemove(preventDefault).mouseenter(preventDefault)
       .keydown(preventDefault).click(stopPropagation);
       $(document).mousemove(preventDefault);
       $(document).keydown(function(e,a){ 
                  if(e.which==65 && e.ctrlKey)
                    _sel.selectAll();
                   e.stopPropagation();   
       }).click(function(){
                  _sel.clear(true);
       });
        
       return this;
    };
 

})(jQuery);


