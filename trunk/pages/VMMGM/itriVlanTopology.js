/*
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

 
function RemoveArray(array,attachId)
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

Array.prototype.remove = function (obj) {
    return RemoveArray(this,obj);
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
		
		var _handler = function(){

			thisObj.id = jsonObj.id;
			var tableheader = $("<div class=\"vlanTableHeader\"><h1>" + jsonObj.label + "</h1></div><div class=\"dotline\"></div>");
			$thisObj.append(tableheader);
			var panelTable = $("<table border=\"0\" style=\"width:90%;margin:0 auto;\"></table>");
			var trPanel = $("<tr class= \"trPanel\" valign=\"top\"></tr>");
			panelTable.append(trPanel);
			//--
			var leftPanel = $("<th class=\"leftPanel\"></th>");
			var centerPanel = $("<th class=\"centerPanel\"></th>");
			var rightPanel = $("<th class=\"rightPanel\"></th>");
			trPanel.append(leftPanel, centerPanel, rightPanel);
			var groupStr = "<ul class=\"group\"></ul>";		
			var iNetworkStr = "<span class=\"i_network\">"	+	
								" <div class=\"line\" style=\"margin-top:16px; margin-left:33px; width:20px; height:2px;\">" +
									"<img src=\"images/dot.png\" class=\"dot_l\"/>" +
								" </div>" +
							  "</span>";
			
		    //left Panel		
			var $vmportGroup;
			
			
			var getGroupTitleStr = function(title){
					return 	"<li class=\"groupT\"><h2>"+ title +"</h2></li>";
			};
			
			var getGroupLabelStr = function(label){			
			 return 	"<li><h3>"+label+"</h3>" +
							"<span class=\"i_network\">"+
								 "<div class=\"line\" style=\"margin-top:16px; margin-left:33px; width:20px; height:2px;\">"+
									"<img src=\"images/dot.png\" class=\"dot_l\"/>"	+
								 "</div>"+
							"</span>"+
						"</li>";
			};
			
						
			var getPAChildListStr = function(ary){
				var str = "";
				var header = 	"<li><ul class=\"paGroup\">";
				var bottom = 	"</ul></li>";
				var firstLine =  '<div class="line" style="margin-top:16px; margin-left:-35px; width:35px; height:2px;">'+
										'<img src="images/dot.png"  class="dot_c" style=""/>'+
										'<img src="images/dot.png"  class="dot_r" style=""/>'+
								'</div>';
				
				var otherLine =  '<div class="line" style="margin-top:16px; margin-left:-15px; width:15px; height:2px;">'+
										'<img src="images/dot.png"  class="dot_r" style=""/>'+
								 '</div>'+
								 '<div class="line" style="margin-top:-32px; margin-left:-15px; width:2px; height:32px;"></div>';
								
				for(var i=0; i<ary.length; i++)
					{
					  var lineStr = i==0 ? firstLine : otherLine;
					  var tmpstr =	'<li id="'+  ary[i].id  +'"><span class="i_adapter">'+
									 lineStr +
									'</span><h3>'+ ary[i].label +'</h3></li>';
					
					  str = str + "" +tmpstr;
					}
				return header+""+str+""+bottom;
			}

			var getVMChildListStr = function(childAry){
				var str = "";
				var header = 	"<li><ul class=\"subGroup\"><div class=\"dotline_s\"></div>";
				var bottom = 	"</ul></li>";
				
					for(var i=0; i<childAry.length; i++)
					{
					  var status = childAry[i].status =="on" ? "enable" : "disable";
					  
					  var tmpstr ="<li id='"+childAry[i].id+"'><h5>"+ childAry[i].label +"</h5>"+
									"<span class=\"i_vm "+status+"\">"+
									"<div class=\"line\" style=\"margin-top:16px; margin-left:33px; width:20px; height:2px;\">"+
										"<img src=\"images/dot.png\"  class=\"dot_l\"/>"+
									"</div>"+
									"</span>"+
									"</li>";
					
					  str = str + "" +tmpstr;
					}
				
				return header+""+str+""+bottom;
			}

			var getGroupDescStr = function(ary){
				var str = ""; 
				for(var i=0; i< ary.length; i++)
				{
				
					tmpstr = "<li id='"+ ary[i].id +"'><h4>"+ ary[i].label +"</h4></li>";
					str = str + tmpstr;
				}
				return str;
			}
			
			if(jsonObj.vm_port_group !=undefined)
			{
				var vmpData = jsonObj.vm_port_group;
				$vmportGroup = $(groupStr);
				
				//group Title
				var groupT = getGroupTitleStr(vmpData.title);
				$vmportGroup.append(groupT);
				//group Label
				var groupL = getGroupLabelStr(vmpData.label);
				$vmportGroup.append(groupL);
				//group Desc
				var childLen= vmpData.children == undefined ? 0 :  vmpData.children.length
				var groupDesc = getGroupDescStr([{ id: thisObj.id+"_vmCount" , label: childLen+"  "+vmpData.descLabel }]);
				$vmportGroup.append(groupDesc);
				
				if(vmpData.children!=undefined)
				{
				var childListStr = getVMChildListStr(vmpData.children);
				$vmportGroup.append(childListStr);
				}
				
				leftPanel.append($vmportGroup);

			}
			var $vmkernelportGroup;
			if(jsonObj.vmKernel_port_group !=undefined)
			{
			    var vmkpData = jsonObj.vmKernel_port_group;
				$vmkernelportGroup = $(groupStr);
				//group Title
				var groupT = getGroupTitleStr(vmkpData.title);
				$vmkernelportGroup.append(groupT);
				//group label
				var groupL = getGroupLabelStr(vmkpData.label);
				$vmkernelportGroup.append(groupL);
				//group Desc
				if(vmkpData.children!=undefined)
				{
					var groupDesc = getGroupDescStr(vmkpData.children);
					$vmkernelportGroup.append(groupDesc);
				}
					
				leftPanel.append($vmkernelportGroup);
			}
			
		   //center Panel
		   var $map = $("<div class=\"map\" >"+
		   " <div class=\"line\" style=\"margin-top:25px; margin-left:10px; width:2px; height:140px; background:gray;\">"+
		   "</div>"+
		   "</div>");
		   centerPanel.append($map);
		   
		   
		
			//right Panel
			var $adapterGroup;
			if(jsonObj.physical_adapters !=undefined)
			{
				var paData = jsonObj.physical_adapters;
				$adapterGroup = $(groupStr);
				//group Title
				var groupT = getGroupTitleStr(paData.title);;
				$adapterGroup.append(groupT);
				
				
				if(paData.children!=undefined)
				{
				 var childListStr = getPAChildListStr(paData.children);
				$adapterGroup.append(childListStr);
				}
				
				
				
				rightPanel.append($adapterGroup);
	
			}
			

			//--
			$thisObj.append(panelTable);
			
			
			
			//adjust map height
			 var leftH = $vmportGroup.innerHeight() + $vmkernelportGroup.innerHeight() +15 ;
			 var rightH = $adapterGroup.innerHeight() + -2;
			 var h = leftH > rightH ? leftH: rightH;
		
		     centerPanel.children(".map").height(h).children(".line").height(h-52);
			//  centerPanel.children(".map").children(".line").height(h);

		};

		
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
				$vlanTplg.slideDown(300);
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
				switchAry.remove(t);
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


