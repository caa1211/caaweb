﻿/*
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
           imgs:null, 
           maxThumb: 5
       };
       
       var _settings = $.extend({}, defaultSetting , settings);
       var len = _settings.imgs.length;
       var thumbImg = [];

       for(var i=0; i<len; i++){
           if( i >= _settings.maxThumb ){
                        break;
           }
           thumbImg.push( $(_settings.imgs[i]).clone()[0]);
       }
       
       function modifyImgPos(imgs){       
           var offset=0;

           $.each(imgs, function(i, t){
             $(t).css("position", "absolute").css("left", offset*+3).css("top", offset*7).css("z-index", 100-offset);
             offset++;
            });
       }

       var thumbCWidth =  9+Math.floor(len/10)*5 ;
       modifyImgPos(thumbImg);
       $thisObj.prepend("<div class='thumbCounter'><span style='width:"+ thumbCWidth +"px;'>"+len+"</span></div>");
       $thisObj.append(thumbImg);
       return this;
    }
    
    $.fn.editAble = function(settings){
       var $thisObj = $(this);
       
       var defaultSetting = 
       {
            onChange: function(newValue){},
            onCancel: function(){},
            onCompleted: function(){}
       };
       
       var _settings = $.extend({}, defaultSetting , settings);
       
       this.leaveEditMode = function(){
           $thisObj.find('.editAble').each(function(i, t){
               var inputFiled = $(this).parent().children('input.editField');
               var cText = inputFiled.val();
               var editItem = $(this);
               checkChange(editItem, cText);
               destroy(inputFiled, editItem, cText);
           });
       };
       
       function stopPropagation(e){
          e.stopPropagation();  
       };
       
       var $editItem = $thisObj.find('.editAble');

       function destroy(inputField, editItem, text){
          inputField.unbind().empty().remove();
          _settings.onCompleted(editItem, text);
          editItem.removeClass('editAble');
          editItem.show();
       }
       
       function checkChange(editItem, text){
           var orgText = editItem.text();
           if(orgText == text){
                _settings.onCancel(editItem, text);
           }
           else{
                editItem.text(text);
                _settings.onChange(editItem, text);
           }
       }
       
        $editItem.each(function(i, t){
             var editItem = $(this);
             editItem.hide();
             
             var $inputFiled = $("<input class='editField'/>");
             editItem.before($inputFiled);
             $inputFiled.val($editItem.text());
             setTimeout(function(){$inputFiled.select();}, 1)

             
             $inputFiled.blur(function(){
                  var cText = $(this).val();
                  checkChange(editItem, cText);
                  destroy($inputFiled, editItem, cText);
             }).keydown(function(e){
                var cText = $(this).val();
                //esc
                if(e.keyCode == 27){
                   _settings.onCancel($(this), cText);
                   destroy($inputFiled, editItem, cText);
                }
                //enter
                else if(e.keyCode == 13){
                   checkChange(editItem, cText);
                   destroy($inputFiled, editItem, cText);
                }
             })
             .bind('click', stopPropagation)
             .bind('mousemove', stopPropagation)
             .bind('mouseup', stopPropagation)
             .bind('mousedown', stopPropagation)
             .bind('mouseenter', stopPropagation)
             .bind('mouseleave', stopPropagation);
        });
       
       return this;
    }

    $.fn.itriFileBrowser = function(settings){

       var defaultSetting = {
        rawData: null,
        scrollSensitivity:50,
        bottomOffset: 100,
        onRename: function(){},
        showScrollArea: false,
        onDrop: function(sel, target, selData, targetData){
                      var selStr =" [ "; 
                      selections.each(function(){
                        selStr = selStr +$(this).find(".name").html() + ", ";
                      })
                      selStr = selStr + " ] ";
                       _L("drop" + selStr + " to "+ target.find(".name").html())
                       
                      selections.empty().remove();
                },
        onUpdateSel: function(sels, selsData, isAdd){}
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

                if(!$(this).hasClass('select')){
                    sel.add($(this));
                }
                
                sel.endHandler();      
            };
            
            this.add = function(obj){
                obj.addClass('select');
                var selDomAry = sel.getSelections();
                _settings.onUpdateSel(selDomAry, sel.getSelectionsData(selDomAry), true);
            };
            
            this.remove = function(obj, fireEvent){
                obj.removeClass('select');
                if(fireEvent==true){//only press ctrl+click
                   var selDomAry = sel.getSelections();
                   _settings.onUpdateSel(selDomAry, sel.getSelectionsData(selDomAry), false);
                  }
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
                if(fireEvent == true){ //only click space area
                 var selDomAry = sel.getSelections();
                 _settings.onUpdateSel(selDomAry, sel.getSelectionsData(selDomAry), false);
                }
            };
            
            this.selectAll = function(){
                 var targetList = getChildList();
                 targetList.addClass('select');
                 var selDomAry = sel.getSelections();
                 _settings.onUpdateSel(selDomAry, sel.getSelectionsData(selDomAry), true);
            };
            
            this.getSelections = function(){
                 var targetList = getChildList();
                 return targetList.filter('.select');
            };
            
            this.getSelectionsData = function(domAry){
                 var dataAry = [];
                 $.each(domAry, function(){
                    var data = _settings.rawData[$(this).attr('dataIndex')];
                    if(data!=undefined)
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
            
            var docHeight= $(document).height();
            var docWidth= $(document).width();
            this.onInitmove = function(e){
               var targetList = getChildList();
               dragging = true;
               selections = sel.getSelections();
               targetList.unbind('mousemove', drag.onInitmove);
               selThumbs = $("<div id='selThumbs' class='selThumbs'></div>");
               $("body").append(selThumbs);
               
               var $img =  selections.find('img');
               selThumbs.thumbnails({imgs: $img});
               
               drag.dropTargets = targetList.filter(drag.dragFilter);
               drag.dropTargets.bind('mouseup', drag.onDrop);
   
              docHeight= $(document).height() ;
              var st = $(window).scrollTop();
              if( docHeight> st+$(window).height()){
                //auto scroll down
                $("#scrollDownArea").remove();
                var scrollDownArea = $("<div id='scrollDownArea' class='scrollDownArea'></div>")
                scrollDownArea.css({
                    "position": "fixed",
                    "bottom": "0em",
                    "z-Index": 1000
                });
                if(!_settings.showScrollArea){
                    scrollDownArea.css("background", "none");
                }
                scrollDownArea.width($(window).width());
                scrollDownArea.height(_settings.scrollSensitivity);
                $('body').append(scrollDownArea);
                   var downTimer= null;
                   scrollDownArea.bind('mouseover', function(){
                   downTimer = setInterval(function(){
                         var st = $(window).scrollTop();
                         if( docHeight > st+$(window).height()){
                           $(window).scrollTop(st+30)
                         }
                      }, 50);
                   }).bind('mouseout', function(){
                      clearInterval(downTimer);
                   }).bind('destroy', function(){
                     $(this).unbind();
                     clearInterval(downTimer);
                   });
                }
                
                //auto scroll up
                $("#scrollUpArea").remove();
                var scrollUpArea = $("<div id='scrollUpArea' class='scrollUpArea'></div>")
                scrollUpArea.css({
                    "position": "fixed",
                    "up": "0em",
                    "z-Index": 1000
                    
                });
                if(!_settings.showScrollArea){
                    scrollUpArea.css("background", "none");
                }
                scrollUpArea.width($(window).width());
                scrollUpArea.height(_settings.scrollSensitivity);
                $('body').prepend(scrollUpArea);

                   var upTimer= null;
                   scrollUpArea.bind('mouseover', function(e){
                   upTimer = setInterval(function(){
                         var st = $(window).scrollTop();
                         if( st > 0){
                           $(window).scrollTop(st-30)
                         }
                      }, 50);
                   
                   }).bind('mouseout', function(){
                      clearInterval(upTimer);
                   }).bind('destroy', function(){
                     $(this).unbind();
                     clearInterval(upTimer);
                   });
               
                /*
                scrollDownArea.bind('mousemove', function(){
                 var st = $(window).scrollTop();
                 if( docHeight+scrollDownOffset > st+$(window).height()){
                   $(window).scrollTop(st+3)
                   }
                });
                
                scrollUpArea.bind('mousemove', function(){
                 var st = $(window).scrollTop();
                 if( st > 0){
                   $(window).scrollTop(st-3)
                   }
                });
                */

                /*
                var ph = $(window).height() + $(window).scrollTop();
                if( ph -(e.pageY) < 10 &&  ph -(e.pageY) >0 && docHeight> $(window).height()){
                    
                    _L("scrollDown")
                }
                  
                if(e.pageY  - $(window).scrollTop() <10 && e.pageY  - $(window).scrollTop()>0 && $(window).scrollTop() >0){
                
                  _L("scrollUp")
                }
                */
            };
            
            this.onDrop = function(){
              drag.dropTargets.unbind('mouseup', drag.onDrop);

              //sel.clear();
              drag.onDropDone($(this));
            };
            
            this.onDropDone = function(target){
              _settings.onDrop(selections, target, sel.getSelectionsData(selections), sel.getDataAt(target.attr('dataIndex')));
            };
            
            this.onMousemove = function(e){
               //_L("move " + e.pageY);
               var x = e.pageX;
               var y = e.pageY;
               moveThumbnail(x, y);
            };
            
            function moveThumbnail(x, y){
               var offset = (selThumbs.children().length-1)*7 + _settings.bottomOffset;
               if(y> docHeight - offset)
                 y= docHeight- offset;
                 
               if(selThumbs!=null){
                   selThumbs.css('left',x+10).css('top',y+10);
                 } 
            }
            
            this.onMouseup = function(e){
                if(dragging == false) //click self
                  {
                    if (e.ctrlKey && $(this).hasClass('select')) {
                         sel.remove($(this), true);
                    }
                    else if (e.shiftKey) {
                        var targetList = getChildList();
                        sel.removeRange( targetList.index(sel.first), targetList.index(sel.last))
                        sel.addRange( targetList.index(sel.first),  targetList.index($(this)));
                    }
                    else{    
                        sel.clear();
                        sel.first = $(this);
                        sel.add($(this));
                    }
                  }   
               drag.endDrag();          
            };
            
            this.endDrag = function(){
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
                
                //remove autoscroll area--
                $("#scrollDownArea").trigger('destroy');
                $("#scrollDownArea").remove();
                $("#scrollUpArea").trigger('destroy');
                $("#scrollUpArea").remove();
                
            },
            this.onDocMouseup = function(){
                drag.endDrag();
            };
            
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
        
       var $editObj = null;
        
        function mousedownHandler(e){
                var childList = $thisObj.children('tbody').children('tr');
                
                if($editObj!=null){
                    $editObj.leaveEditMode();
                }
                
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
        
        $childList.bind('mousedown', mousedownHandler);

       //hover
        $childList.mouseleave(function(e){
            $(this).removeClass('hover');
        }).mouseenter(function(e){
            $(this).addClass('hover');
        });

       function preventDefault(e){
          if($editObj!=null)
            return;
          e.preventDefault(); 
       };
        
       function stopPropagation(e){
          if($editObj!=null)
            return;
          e.stopPropagation();  
       };
       
       function preventDefaultAndStopPropagation(e){
          //if($editObj!=null)
            //return;
          e.preventDefault(); 
          e.stopPropagation();  
       };

       
       
       this.addFolder = function(param){
          var l = $thisObj.children('tbody').children('.newFolder').length;
          var $tr = $("<tr id='newFolder_'"+l+" class='listItem folder edit newFolder'></tr>");
          var $td = $("<td class='nameArea'><img src='"+param.img+"'/><span class='type'>1</span><div class='name'><a class='editAble' href='#'>"+ param.name+" ("+l+")" +"</a></div></td>")
          $tr.append($td);
          $tr.append("<td>--</td>");
          $tr.append("<td>--</td>");
          $thisObj.prepend($tr);

         $editObj = $tr.editAble({
            onChange: function(obj, text){  },
            onCancel: function(){},
            onCompleted: function(obj, text){
               $editObj=null;
               $tr.removeClass("edit")
               param.callback(text);
               
               $childList.unbind();
               $childList.removeClass('hover').removeClass('select');
               var childList = $thisObj.children('tbody').children('tr');
               childList.bind('mousedown', mousedownHandler);
            }
          });
       };

       this.rename = function(param){
         var selAry = _sel.getSelections();
        // $childList.unbind();
         
         if(selAry.length>0){
             $tr = $("#"+ selAry[0].id); 
             $a = $tr.find('a');
             $a.addClass('editAble');
             $editObj = $tr.editAble({
              onCompleted: function(obj, text){
 
               // $childList.bind('mousedown', mousedownHandler);
                _settings.onRename();
                $editObj=null;
               }
              
             });
         }
       };
       
       var thisObj = this;
              
       this.selectAll = function(){
         _sel.selectAll();
       };
       
       this.getSelections = function(){
         return _sel.getSelections();
       };

       
       this.getDragDropHelper = function(){
        return _drag;
       };
       
       $thisObj.mousedown(preventDefault).mouseup(preventDefault).mousemove(preventDefault)
       .mouseenter(preventDefault).mouseleave(preventDefault).keydown(preventDefault)
       .click(stopPropagation)
       //prevent copy, cut, and paste http://sumtips.com/2011/11/prevent-copy-cut-paste-text-field.html
       .bind('dragenter', preventDefaultAndStopPropagation)
       .bind('dragstart', preventDefaultAndStopPropagation)
       .bind('dragover', preventDefaultAndStopPropagation)
       .bind('drop', preventDefaultAndStopPropagation)
       .bind('selectstart', preventDefault);
       
       $(document).mousemove(preventDefault);
       $(document).keydown(function(e,a){ 
                  if(e.which==65 && e.ctrlKey){
                    _sel.selectAll();
                  }
                  if(e.which==113){
                     thisObj.rename();
                  }
                  stopPropagation(e);
       }).click(function(){
                  _sel.clear(true);
       });
        
       return this;
    };
 

})(jQuery);


