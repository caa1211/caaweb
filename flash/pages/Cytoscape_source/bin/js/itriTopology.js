/*
 *Jose.Chang
 * 
 */

(function($)
{
    $.fn.itriTopology = function(settings){
        
		var json = {
		dataSchema: {
            nodes: [
						{ name: "label", type: "string" },
						{ name: "type", type: "string" },
						{ name: "containType", type: "string" },
						{ name: "posAlgorithm", type: "string" }
                    ]	 
			},     
			data : {
				nodes : [ 
				/*
				{id : "1"}, 
				{id : "2"}
				*/
				],
				edges : [
				/*
				{id : "2to1",target : "1",source : "2"}
				*/
				]
			}
		};
			
		var style = {
					global : {
				backgroundColor : "#EEEEEE"
			},
		
			nodes : {
				color : {
					discreteMapper : {
						attrName : "type",
						entries : [ {
							attrValue : "network",
							value : "#0B94B1"
						}, {
							attrValue : "parent",
							value : "#eaeaea"
						}, {
							attrValue : "storage",
							value : "#dddd00"
						} ]
					}
				},
				shape:{
					discreteMapper : {
						attrName : "type",
						entries : [ {
							attrValue : "parent",
							value : "ROUNDRECT"
						},
						{
							attrValue : "grandparent",
							value : "RECTANGLE"
						
						}]
						}
				}
				,
			//	 shape: "DIAMOND",
						//compoundShape: "ROUNDRECT",
						compoundShape:{
							discreteMapper : {
							attrName : "type",
							entries : [ {
								attrValue : "parent",
								value : "ROUNDRECT"
							},
							{
								attrValue : "grandparent",
								value : "RECTANGLE"
							
							}]
							}
						},
                       label: { passthroughMapper: { attrName: "id" } } ,
                      //  compoundLabel: { passthroughMapper: { attrName: "id" } } ,
                        borderWidth: 2,
                        compoundBorderWidth: 1,
                        borderColor: "#666666",
                        compoundBorderColor: "#999999",
                        size: 25,                      
						//color: "#ffffff",
                        compoundColor: "#eaeaea"   
			},
			edges: {}
			};
			
		var layout = {
			name : "Preset",
			options:{orientation : "leftToRight"}
		};
		
       var defaultSetting = 
       {
	       pathOption:{
				swfPath : "../swf/CytoscapeWeb",
				flashInstallerPath : "../swf/playerProductInstall",
				flashAlternateContent : "Le Flash Player est nécessaire."
			},
			drawOption:{
				network : json,
				edgeLabelsVisible : true,
				visualStyle : style,
				layout : layout
			},
			groupNodes:{} //linearPosition
       }
       
       var settings = $.extend(defaultSetting , settings);
    
	
	   function findGroupNode(type){
		   var groupNode = null;
			$.each(settings.groupNodes, function (i, t){
			  if(t.data.containType == type )
			  {
				groupNode = t;
				return false;
				}
			
			});
			if(groupNode == null)
			alert("failed! there are no group node");
			
			return groupNode;
	   }
	//---positonAlgorithm
		function posAlgorithm(node){
	
	
			var type = node.data.type;
            var pos = {x:0, y:0};
			var groupId = type + "_group";
			
			var parentNode = findGroupNode(type);
			parentNode.childCount = parentNode.childCount + 1;
			
			switch(parentNode.data.posAlgorithm){
			
			case "circle":
			   pos = circlePos(parentNode);
			break;
			
			case "spiral":
			   pos = spiralPos(parentNode);
			break;
			
			case "vlinear":
				 pos = vlinearPos(parentNode);
			break;
			
			case "linear":
			default:
			  pos = linearPos(parentNode);
			break;
			}
			
			$.extend(node, pos);
			
			if(settings.drawGroupNodes)
			$.extend(node.data, {parent: groupId });
			
		
		}
		
		function vlinearPos(pNode)
		{
			x = pNode.x 
			y = pNode.y + (pNode.childCount%2==0?-1:1) * parseInt(pNode.childCount/2)*50;;
		    return {x:x, y:y};
		}
		
		function linearPos(pNode)
		{
			 x = pNode.x + (pNode.childCount%2==1?-1:1) * parseInt(pNode.childCount/2)*50;
			 y = pNode.y;
		    return {x:x, y:y};
		}
		
		function circlePos(pNode)
		{
			var step = 10;
		    var radius = 50 * ( 1 + parseInt( (pNode.childCount-1) / step)) ;
			
			
			var cx = pNode.x;
			var cy = pNode.y;
				
		    angleOffset =  parseInt( (pNode.childCount-1) / step) *0.2;

			
			
			 var x = (cx + radius * Math.cos(( 2 * Math.PI * pNode.childCount / step) +angleOffset  /*angle offset*/) );  
			 var y = (cy + radius * Math.sin(( 2 * Math.PI * pNode.childCount / step) +angleOffset  /*angle offset*/) );
		    return {x:x, y:y};
		}

		function spiralPos(pNode)
		{
			var step = 11;
		    var radius = 40 + pNode.childCount* 4 ;
			var cx = pNode.x;
			var cy = pNode.y;
		 angleOffset =  parseInt(pNode.childCount / step) *0.2;
		 
			var x = (cx + radius * Math.cos(2 * Math.PI * 0.4*pNode.childCount / step) );  
			var y = (cy + radius *4/5 * Math.sin(2 * Math.PI * 0.4*pNode.childCount / step));
			/*
			var cx = pNode.x;
			var cy = pNode.y - 50;
			
			var x= cx + Math.sin(pNode.childCount / 4) * pNode.childCount * 4;
			var y= cy + Math.cos(pNode.childCount / 4) * pNode.childCount * 4;
			*/
		    return {x:x, y:y};
		}

	//---
	
	
		function modeifyElements(rawGroup){
			
				var ary=new Array();
				
				$.each(rawGroup, function(i, t){
				
					if(i=="nodes")
						{
						
							$.each(t, function(ii, tt){
							//debugger;
								var element = {group:"nodes", x:0, y:0, data:{}};
							//	debugger;
								$.extend(element.data, this);
								        posAlgorithm(element);
										ary.push(element);
							
							});
							
						}
					else if(i=="edges")
					{
						$.each(t, function(ii, tt){
						//debugger;
								var element = {group:"edges", data:{}};
								$.extend(element.data, this);
									ary.push(element);
							});
					}					
					   
			
				});

				/*
				{ group: "nodes", x:100, y:0,   data: { id: "supergroup", type:"supergroup"} },
						{ group: "nodes", x:0,   y:0,   data: { parent:"supergroup", id: "computeGroup", type:"group"} },
						{ group: "nodes", x:0,   y:100, data: { parent:"supergroup", id: "networkGroup", type:"group"} },
						{ group: "nodes", x:0,   y:200, data: { parent:"supergroup", id: "serverGroup", type:"group"} }	
				*/
				return ary;
				
		}

		
	
        var _handler = function(){
	
			var vis = new org.cytoscapeweb.Visualization($(this).attr("id"), settings.pathOption);
			vis.draw(settings.drawOption);
			
			vis.ready(function () {
				vis.panEnabled(true);
			});
			
			this.draw = function(obj){
			
				vis.removeElements();
				
				$.each(settings.groupNodes, function(i, t){
				if(t.data.containType!=undefined)
				 $.extend(t.data, {id: t.data.containType + "_group"} );
				 $.extend(t, {childCount: 0, group: "nodes"});
				 });
				 
				if(settings.drawGroupNodes)
				vis.addElements(settings.groupNodes);
			
				var elements =  modeifyElements(obj);
				vis.addElements(elements);
				
					vis.panToCenter();
					vis.zoomToFit();
			};
			
			
        };
		
		
		this.draw = function(obj)
		{	
			this.each(function(){  this.draw(obj); });
		}
      
        var itriTopologyObj = this.each(_handler);
      
        return itriTopologyObj;
    };
 

})(jQuery);


