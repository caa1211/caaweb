﻿/*
 * itriVlanTopology.js
 *
 * Copyright (c) 2010 
 * Caa Chang
 *
 * Dual licensed under the GPL (http://www.gnu.org/licenses/gpl.html)
 * and MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 *
 * $Date: 2010-02-04 $
 * $Rev: 001 $
 * 
 */

function CRemoveArray(array,attachId)
{
    for(var i=0,n=0;i<array.length;i++)
    {
        if(array[i]!=attachId)
        {
            array[n++]=array[i]
        }
    }
    array.length -= 1;
}

Array.prototype.c_remove = function (obj) {
    return CRemoveArray(this,obj);
};

function isArray(o) {   
  return Object.prototype.toString.call(o) === '[object Array]';    
} 
	
(function($)
{

	 $.fn.vlanTopology = function(jsonObj){
	 
		this.id = "";
		var thisObj = this;
		var $thisObj = $(this);
		var groupStr = "<ul class=\"group\"></ul>";	
		
		var getGroupTitleStr = function(title){
					return 	"<li class=\"groupT\"><h2>"+ title +"</h2></li>";
			};
			
		var getGroupLabelStr = function(label){			
			 return 	"<li class=\"label\"><h3>"+label+"</h3>" +
							"<span class=\"i_network\">"+
								 "<div class=\"line\">"+
									"<img src=\"../images/dot.png\" class=\"dot\"/>"	+
								 "</div>"+
							"</span>"+
						"</li>"+
						"<div class=\"dotline_s\"></div>";
			};
		
		var getGroupDescStr = function(label){
				var str = "<li class='desc'><h4>"+ label +"</h4></li>";
				return str;
			}
		var getVMChildListStr = function(childAry){
				var str = "";
				var header = 	"<li><ul class=\"subGroup\">";
				var bottom = 	"</ul></li>";
				
					for(var i=0; i<childAry.length; i++)
					{
					  var status = childAry[i].status;
					  
					  var tmpstr ="<li id='"+childAry[i].id+"'><h5>"+ childAry[i].label +"</h5>"+
									"<span class=\"i_vm "+status+"\">"+
									"<div class=\"line\" style=\"margin-top:16px; margin-left:33px; width:20px; height:2px;\">"+
										"<img src=\"../images/dot.png\"  class=\"dot_l\"/>"+
									"</div>"+
									"</span>"+
									"</li>";
					
					  str = str + "" +tmpstr;
					}
				
				return header+""+str+""+bottom;
			}
		var getPAChildListStr = function(ary){
				var str = "";
				var header = 	"<li><ul class=\"paGroup\">";
				var bottom = 	"</ul></li>";
				var firstLine =  '<div class="line" style="margin-top:16px; margin-left:-35px; width:35px; height:2px;">'+
										'<img src="../images/dot.png"  class="dot_c" style=""/>'+
										//'<img src="../images/dot.png"  class="dot_r" style=""/>'+
                                        '<span  class="dot_r"></span>'+
								'</div>';
				
				var otherLine =  '<div class="line" style="margin-top:16px; margin-left:-15px; width:15px; height:2px;">'+
										//'<img src="../images/dot.png"  class="dot_r" style=""/>'+
                                        '<span  class="dot_r"></span>'+
								 '</div>'+
								 '<div class="line" style="margin-top:-32px; margin-left:-15px; width:2px; height:32px;"></div>';
				
                            
				for(var i=0; i<ary.length; i++)
					{
					  var lineStr = i==0 ? firstLine : otherLine;
					  var tmpstr =	'<li id="'+  ary[i].id  +'"><span class="i_icon">'+
									 lineStr +
									'</span><h3>'+ ary[i].label +'</h3></li>';
					
					  str = str + "" +tmpstr;
                      
                      if(ary[i].children!=undefined){
                        var subAdAry = ary[i].children;
                        var uul="<ul>";
                         for(var j=0;j<subAdAry.length; j++)
                         {
                            var id = subAdAry[j].id==undefined ? "subAd_"+j: subAdAry[j].id;
                            var subAdStr ='<li style="position:relative;" id="'+id+'"> '+
                                    '<div class="line" style="position:absolute;width:2px; height:32px; top:-15px;"></div>'+
                                    '<span style="margin-left:25px;color:#72726c;">'+subAdAry[j].name+'</span>'+
                                    '</li>';
                            uul = uul +""+ subAdStr;
                         }
                         
                         var bul="</ul>";
                        var subStr = uul+ "" + bul;
                        str = str + subStr;
                      }
					}
				return header+""+str+""+bottom;
			}
			
		function createElement(jsonObj, childListStrFn, type){
				var $group = $(groupStr);
				$group.attr("id", jsonObj.id);
				$group.addClass(jsonObj.type);
        if(jsonObj.select!=undefined && jsonObj.select)
           $group.addClass("select");
				//group Title
				if(jsonObj.title!=undefined)
				{
					var groupT = getGroupTitleStr(jsonObj.title);
					$group.append(groupT);
				}
				
				//group Label
				if(jsonObj.label!=undefined)
				{
					var label =  jsonObj.label;
					if(jsonObj.type=="vlan")
					{
					var childLen= jsonObj.children == undefined ? 0 :  jsonObj.children.length;
					label = "<span class='childCount'>" + childLen +"</span> "+ jsonObj.label  ;
					
					}
					
					var groupL = getGroupLabelStr(label);
					$group.append(groupL);
					
				}
				
				//group Desc
				if(jsonObj.desc!=undefined)
				{
					var groupL = getGroupDescStr(jsonObj.desc);
					$group.append(groupL);
				}
				
				if(jsonObj.children!=undefined)
				{
				 var childListStr = childListStrFn(jsonObj.children);
				 $group.append(childListStr);
				}
				
				return 	$group;
		}
		
		
		
		var _handler = function(){
			thisObj.id = jsonObj.id;

			//var switchLabel =  jsonObj.label+ "  (" + jsonObj.leftChildren.length + "vLan(s))";
			
			var switchHeader = $("<div class=\"vlanTableHeader\"><h1>" +  jsonObj.label + "</h1></div><div class=\"dotline\"></div>");
			$thisObj.append(switchHeader);
			var panelTable = $("<table border=\"0\" style=\"width:90%;margin:0 auto;\"></table>");
			var trPanel = $("<tr class= \"trPanel\" valign=\"top\"></tr>");
			panelTable.append(trPanel);
			
			var leftPanel = $("<th class=\"leftPanel\"></th>");
			var centerPanel = $("<th class=\"centerPanel\"></th>");
			var rightPanel = $("<th class=\"rightPanel\"></th>");
			trPanel.append(leftPanel, centerPanel, rightPanel);
			
			//center
			   var $map = $("<div class=\"map\" >"+
			   " <div class=\"line\" style=\"margin-top:25px; margin-left:10px; width:2px; height:140px; background:gray;\">"+
			   "</div>"+
			   "</div>");
		     centerPanel.append($map);
			
			//left
			if(jsonObj.leftChildren !=undefined)
			{
				$.each(jsonObj.leftChildren, function(i, t){
				   var element;
				//if(t.type =="vlan")
					element = createElement(t, getVMChildListStr, "left");

				    leftPanel.append(element);
				});
			}
			//right
			if(jsonObj.rightChildren !=undefined)
			{
				$.each(jsonObj.rightChildren, function(i, t){
				   var element = createElement(t, getPAChildListStr, "right");
				    rightPanel.append(element);
				});
			}
			
			
			
			$thisObj.append(panelTable);
	  var leftH = leftPanel.height() -19;
	  var rightH = rightPanel.height();
			/*
			leftPanel.css("border", "solid 1px red")
			//adjust map height
			 var leftH = $vmportGroup.innerHeight() + $vmkernelportGroup.innerHeight() +15 ;
			 var rightH = $adapterGroup.innerHeight() + -2;
			 var h = leftH > rightH ? leftH: rightH;
		
		     centerPanel.children(".map").height(h).children(".line").height(h-52);
			*/
			 var h = leftH;// > rightH ? leftH: rightH;
		     var mapObj = centerPanel.children(".map");
             if(mapObj.length!=0)
             {
                 mapObj.height(h);
                 mapObj.children(".line").height(h-43);
             }
		}
		
		
		_handler();
	 
		return this;
	 };

	 
$.fn.itriVlanTopologyContainer = function(settings){
        
       var defaultSetting = 
       {
           
       };
       
	    var $parent = $(this);
		var parent = this;
        var _settings = $.extend({}, defaultSetting, settings);
		
		var switchAry;
 
 
        var _handler = function(){
          switchAry = new Array();
        };
		

		this.addElement = function(jsonObj)
		{
		var modifyFlag = 0;
		for(var i=0; i< switchAry.length; i++)
		{
			if(switchAry[i]!=undefined && switchAry[i].id == jsonObj.id)
			{
			  modifyFlag = 1;
			  break;
			}
		}
		
		var $vlanTableDiv = $("<div id='"+ jsonObj.id +"' class=\"vlanTable\"></div>");
		
			if(modifyFlag==1)
			{
			  var befortObj = $parent.find(("#"+jsonObj.id));
			  $vlanTableDiv.insertAfter(befortObj);
			  befortObj.remove();
			  //$parent.append($vlanTableDiv);
			  $vlanTableDiv.vlanTopology(jsonObj);
			}
			else
			{
				$parent.prepend($vlanTableDiv);
				var $vlanTplg = $vlanTableDiv.vlanTopology(jsonObj);
				
				$vlanTplg.hide();
				switchAry.push($vlanTplg);
				$vlanTplg.fadeIn(300);
			}
		};
		
		
		this.add = function(jsonObj){
			if(isArray(jsonObj))
			{
				$.each(jsonObj, function(i, t){
					parent.addElement(t)
				});
			}
			else
			this.addElement(jsonObj)
		}
		
		this.remove = function(id){
			if(id==undefined)
			{
			alert("[itriVlanTopology remove()]: please give the id of element");
			return;
			}
			
			$.each(switchAry, function(i, t){
			
				if(t.id == id)
				{
				$parent.find("#"+id).slideUp(300, function(){$(this).remove();});
				switchAry.c_remove(t);
				return false;
				}
				
			});
			
		}

		this.clear = function(){
			switchAry.length = 0;
			$parent.children(".vlanTable").slideUp(300, function(){$(this).remove();});
		};
		
		this.getAllVlanTopologys = function(){
		
			return switchAry;
		};
		
		this.updateById = function(id, jsonObj){
		
		};
		
		this.getSwitchById = function(id, jsonObj){
		
		
		};
      
        _handler();
		
	  
        return this;
    };

    
 

})(jQuery);


