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
		    //left Panel		
			var $vmportGroup;
			if(jsonObj.vm_port_group !=undefined)
			{
				var vmpData = jsonObj.vm_port_group;
				$vmportGroup = $(groupStr);
				$vmportGroup.append("<li class=\"groupT\"><h2>"+ vmpData.groupLabel +"</h2></li>");
					
						$vmportGroup.append("<div>asdfadfasfasf</div>");
						$vmportGroup.append("<div>asdfadfasfasf</div>");
							$vmportGroup.append("<div>asdfadfasfasf</div>");
								$vmportGroup.append("<div>asdfadfasfasf</div>");
									$vmportGroup.append("<div>asdfadfasfasf</div>");
									
									
									
				leftPanel.append($vmportGroup);

			}
			var $vmkernelportGroup;
			if(jsonObj.vmKernel_port_group !=undefined)
			{
			    var vmkpData = jsonObj.vmKernel_port_group;
				$vmkernelportGroup = $(groupStr);
				$vmkernelportGroup.append("<li class=\"groupT\"><h2>"+ vmkpData.groupLabel +"</h2></li>");
				
				
						$vmkernelportGroup.append("<div>asdfadfasfasf</div>");
						$vmkernelportGroup.append("<div>asdfadfasfasf</div>");
							$vmkernelportGroup.append("<div>asdfadfasfasf</div>");
								$vmkernelportGroup.append("<div>asdfadfasfasf</div>");
									$vmkernelportGroup.append("<div>asdfadfasfasf</div>");
								
									
									
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
				$adapterGroup.append("<li class=\"groupT\"><h2>"+ paData.groupLabel +"</h2></li>");
				
				/*
						$adapterGroup.append("<div>asdfadfasfasf</div>");
						$adapterGroup.append("<div>asdfadfasfasf</div>");
							$adapterGroup.append("<div>asdfadfasfasf</div>");
								$adapterGroup.append("<div>asdfadfasfasf</div>");
									$adapterGroup.append("<div>asdfadfasfasf</div>");
						
		$adapterGroup.append("<div>asdfadfasfasf</div>");
						$adapterGroup.append("<div>asdfadfasfasf</div>");
							$adapterGroup.append("<div>asdfadfasfasf</div>");
								$adapterGroup.append("<div>asdfadfasfasf</div>");
									$adapterGroup.append("<div>asdfadfasfasf</div>");
									
		$adapterGroup.append("<div>asdfadfasfasf</div>");
						$adapterGroup.append("<div>asdfadfasfasf</div>");
							$adapterGroup.append("<div>asdfadfasfasf</div>");
								$adapterGroup.append("<div>asdfadfasfasf</div>");
									$adapterGroup.append("<div>asdfadfasfasf</div>");
									
		$adapterGroup.append("<div>asdfadfasfasf</div>");
						$adapterGroup.append("<div>asdfadfasfasf</div>");
							$adapterGroup.append("<div>asdfadfasfasf</div>");
								$adapterGroup.append("<div>asdfadfasfasf</div>");
									$adapterGroup.append("<div>asdfadfasfasf</div>");
								*/										
									
									
				rightPanel.append($adapterGroup);
			}
			
			
			
			
			
	
			
			
			
			//--
			$thisObj.append(panelTable);
			
			
			
			//adjust map height

			
			 var leftH = $vmportGroup.innerHeight() + $vmkernelportGroup.innerHeight() +15 ;
			 var rightH = $adapterGroup.innerHeight() + -2;
			 var h = leftH > rightH ? leftH: rightH;
		
		     centerPanel.children(".map").height(h).children(".line").height(h-50);
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
		
        var _settings = $.extend({}, defaultSetting, settings);
		
		var switchAry;
 
 
        var _handler = function(){
          switchAry = new Array();
        };
		
		this.add = function(jsonObj){
		    var $vlanTableDiv = $("<div id='"+ jsonObj.id +"' class=\"vlanTable\"></div>");
			$parent.append($vlanTableDiv);
			var $vlanTplg = $vlanTableDiv.vlanTopology(jsonObj);

			switchAry.push($vlanTplg);
	
		}
		
		this.removeById = function(id){
		
			if(id==undefined)
			return;
			
			$.each(switchAry, function(i, t){
			
				if(t.id == id)
				{
				$parent.find("#"+id).slideUp(300, function(){$(this).remove();});
				switchAry.pop(t);
				return false;
				}
				
			});
			
		}
		
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


