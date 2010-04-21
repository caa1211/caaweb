/*
 * zyCheckTree.js
 *
 * Copyright (c) 2010
 * zyxe.com
 *
 * licensed under the GPL (http://www.gnu.org/licenses/gpl.html)
 *
 */
(function($){

    $.fn.zyCheckTree = function(settings){
    
        var _defaultSetting = {
            parseJson:'menu.json',
            isParseTreeByJson: true
        }
        
        var _settings = $.extend(_defaultSetting, settings);
        
        this.clearAll = function(){
            this.each(function(){
                 $('.checkbox', this).removeClass('checked').removeClass('half_checked');
            });
        }
        
        this.selectAll = function(){
            this.each(function(){
                 $('.checkbox', this).removeClass('half_checked').addClass('checked');
            });
        }

        this.setCheckedItems = function(checkArray)
        {
            this.each(function(){
                 $('.checkbox', this).removeClass('checked').removeClass('half_checked');
                  for (var j = 0; j < checkArray.length; j++) {
                      var checkNode =$('#node_' + checkArray[j], this);  //$('#node_' + checkArray[j]);
                      nodeStatusUpdate(checkNode);
                  }
            })
        }
        
        this.getCheckedItems = function()
        {
            var retArray =new Array();
        
            this.each(function(){        
                var checkedArray = new Array();
                $('.checkbox.checked', this).each(function(){
                   var parentNode;
                        $(this).parents('ul.tree').each(function(i, item){
                            if (i == 0) 
                                parentNode = $(item);
                        })

                   if (parentNode.siblings('.checkbox').length==0 || parentNode.siblings('.checkbox').hasClass('half_checked')) 
                            checkedArray.push($(this).attr('id').split('node_')[1]);
                });
                 retArray.push(checkedArray);
            })
            return retArray.length==1?retArray[0]:retArray;
        }

        function createNode(data, recursiveCounter){
            if (recursiveCounter == undefined) 
                recursiveCounter = "";
            var contenter = $('<ul class="tree"></ul>');
            var counter = 0;
            $.each(data, function(i, item){
                if (item.title == undefined) 
                    return;
                var liNode = $('<li></li>');
                
                var nodeStr = recursiveCounter + '_' + counter;
                counter++;
                
                var inputNode = $('<div class="checkbox" id="node' + nodeStr + '" ></div>');
                liNode.append(inputNode);
                var labelNode = $(' <LABEL>' + item.title + '</LABEL>');
                liNode.append(labelNode);
                
                if (item.submenu != undefined) {
                    var subMenuContenter = createNode(item.submenu, nodeStr);
                    liNode.append(subMenuContenter);
                }
                
                contenter.append(liNode);
            });
            return contenter;
        }
           
     
        
        function selectAll(){
            $('.checkbox').addClass('checked');
        }
            
        function parentStatusUpdate(treeObj){
            if (treeObj.length > 1) {
                var parentNode;
                treeObj.each(function(i, item){
                    if (i == 0) {
                        parentNode = item;
                    }
                })
                treeObj = $(parentNode);
            }
            
            var childrenNum = treeObj.contents().find('.checkbox').length;
            var checkedNum = treeObj.contents().find('.checkbox.checked').length;

            if (childrenNum == checkedNum) {
                treeObj.siblings('.checkbox').removeClass('half_checked').addClass('checked');
            }
            else 
                if (childrenNum > checkedNum && checkedNum != 0) {
                    treeObj.siblings('.checkbox').removeClass('checked').addClass('half_checked');
                }
                else 
                    if (checkedNum == 0) {
                        treeObj.siblings('.checkbox').removeClass('half_checked').removeClass('checked');
                    }
            
            if (treeObj.parents('.tree').length > 0) 
                parentStatusUpdate(treeObj.parents('.tree'));
        }
        
        function nodeStatusUpdate(nodeObj){
            if (!nodeObj.removeClass('half_checked').hasClass('checked')) {
                nodeObj.addClass('checked');
                nodeObj.siblings('ul').find('li .checkbox').addClass('checked');
                
            }
            else {
                nodeObj.removeClass('half_checked').removeClass('checked');
                nodeObj.siblings('ul').find('li .checkbox').removeClass('checked');
            }
            
            if (nodeObj.parents('.tree').length > 0) 
                parentStatusUpdate(nodeObj.parents('.tree'));
        }

        function doCheckBoxTreeCompleted($container){
            $container.find('ul.tree .checkbox').click(function(){     
                nodeStatusUpdate($(this))
            });
        }
        
        var _handler = function(){
            var $container = $(this);

           if (_settings.isParseTreeByJson) {
               $.ajaxSettings.async = false;
               $.getJSON(_settings.parseJson, function(data){
                   var treeMain = createNode(data);
                   $container.append(treeMain);
               });
               $.ajaxSettings.async = true;
           }
               doCheckBoxTreeCompleted($container);
        };
        
        var zyCheckTree = this.each(_handler);
        
        return zyCheckTree;
    };

})(jQuery);


