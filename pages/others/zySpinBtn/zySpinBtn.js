/*
 * zySpinBtn.js
 *
 * Copyright (c) 2010 
 * Caa Chang
 *
 * Dual licensed under the GPL (http://www.gnu.org/licenses/gpl.html)
 * and MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 *
 * $Date: 2010-03-17 $
 * $Rev: 001 $
 * 
 */

(function($)
{
   
     $.zySpinBtn ={
           customizedDefault: null,
           setDefaultSetting : function(value){
          
           this.customizedDefault = value;
      }
     }
     
       $.fn.zySpinBtn = function(settings){
       
       this.getValue = function(){
           return this.children('.spinValue').text();
       }
       
        function findInArray(arrayObj, target) {
         var res = - 1;
         for (var i = 0; i < arrayObj.length; i++) {
         if (target == arrayObj[i])
         res = i;
         } 
        return res;
       }

       var defaultSetting = 
       {
           defaultValue:0,
           contentArray:[],
           editModeCls:'',
           arrow:['arrowL.gif', 'arrowR.gif']
       }
       
      
       if($.zySpinBtn.customizedDefault!=undefined && $.zySpinBtn.customizedDefault!=null )
       {
             defaultSetting = $.extend(defaultSetting , $.zySpinBtn.customizedDefault);
       }
     
        settings = $.extend(defaultSetting , settings);
    
       
        var _handler = function(){
        var obj = $(this);
         var orangelValue = obj.text();   

         var spinValueObj = $("<div class='spinValue'  style=' display:block;  text-align:center;'/>");
      
         var spinCtrlObj = $("<a href='#' class='spinCtrl' style='position:absolute;  text-align:center;'/>");
         spinCtrlObj.append("<img src="+ settings.arrow[0] +" style='float:left'>");
         spinCtrlObj.append("<img src="+ settings.arrow[1] +" style='float:right'>");
         
         if (obj.text() == '') 
             spinValueObj.text(settings.contentArray[settings.defaultValue]);
         else {
             spinValueObj.text(obj.text());
             obj.text('');
         }

         obj.append(spinValueObj);
         obj.append(spinCtrlObj);
     
         spinCtrlObj.width(obj.width());
         spinCtrlObj.css('top',  obj.position().top);
         spinCtrlObj.hide();
         
         var orangelValue;
         
         this.enterEditMode= function (){
               orangelValue =  $(this).children('.spinValue').text();
               $(this).attr('edit', 'true');
               $(this).children('.spinCtrl').focus().show();//.fadeIn(300);
               $(this).addClass(settings.editModeCls);
         };
         
         this.leaveEditMode=function(){
               $(this).attr('edit', 'false');
               $(this).focus().children('.spinCtrl').hide();//.fadeOut(300);
               $(this).removeClass(settings.editModeCls);
         };
         
               //blur when edit
                       obj.children('.spinCtrl').blur(function(){ 
                         $(this).parent().attr('edit', 'false');
                         $(this).hide();//.fadeOut(300);
                         $(this).parent().removeClass(settings.editModeCls);
                      })
                      
         obj.keydown(function(e){
             
                       //enter edit mode
                       if ($(this).attr('edit') == 'false' || $(this).attr('edit')==undefined) {
                             switch(e.keyCode)
                             {
                              case 13:
                              this.enterEditMode();
                              break;
                             }
                          }
                       //leave edit mode
                       else {     
                          
                        var optionIndex = findInArray(settings.contentArray, $(this).children('.spinValue').text());
                        var nextOption, prevOption;
                        if (optionIndex == - 1) optionIndex = 0;
                        nextOption = (optionIndex + 1) % settings.contentArray.length;
                        prevOption =(settings.contentArray.length + (optionIndex - 1)) % settings.contentArray.length;
 
                              switch(e.keyCode)
                              {
                                case 13://enter
                                    this.leaveEditMode()
                                break;
                                case 37://left
                                   $(this).children('.spinValue').text(settings.contentArray[prevOption]);
                                break
                                case 39://right
                                  $(this).children('.spinValue').text(settings.contentArray[nextOption]);
                                break
                                case 27://esc
                                   $(this).children('.spinValue').text(orangelValue);
                                   this.leaveEditMode()
                                break
                              }
                              
                          }

                     } );
                     
                
    
        };
      
      
        var zySpinBtn = this.each(_handler);
      
        return zySpinBtn;
    };
 

})(jQuery);
