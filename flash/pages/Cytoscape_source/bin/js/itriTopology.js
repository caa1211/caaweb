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
						{ name: "containGroup", type: "string" },
						{ name: "posAlgorithm", type: "string" }//,
						//{ name: "group", type: "string" }
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
			  if(t.data.containGroup == type )
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
	
	
			var type = node.data[settings.groupBy];
            var pos = {x:0, y:0};
			var groupId = type + "_group";
			
			var parentNode = findGroupNode(type);
			parentNode.childCount = parentNode.childCount + 1;
			
			switch(parentNode.data.posAlgorithm){
			
			case "circle":
			   pos = circlePos2(parentNode);
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
		    var radius = 50 + 20*parseInt( (pNode.childCount-1) / step);

			var cx = pNode.x;
			var cy = pNode.y;
				
		    angleOffset =  parseInt( (pNode.childCount-1) / step) *0.2;

			 var x = (cx + radius * Math.cos(( 2 * Math.PI * pNode.childCount / step) +angleOffset  /*angle offset*/) );  
			 var y = (cy + radius * Math.sin(( 2 * Math.PI * pNode.childCount / step) +angleOffset  /*angle offset*/) );
		    return {x:x, y:y};
		}
		
		

		function cCounter(base, adding, num)
		{
			var i=0;
			var counter = 0;
			for(;;)
			{
			counter += base+ adding*i ;
			if(counter>=num)
			   break;
			   i++;
			}	
			return i;
		}
		
		function circlePos2(pNode)
		{
			var bstep = 10;
			
			var adding = 4;
			var cNum = cCounter(bstep, adding, pNode.childCount);
			var step = bstep + adding*cNum;
			
		    var radius = 50 + 30*cNum;

			var cx = pNode.x;
			var cy = pNode.y;
				
			 var x = (cx + radius * Math.cos(( 2 * Math.PI * pNode.childCount / step)   /*angle offset*/) );  
			 var y = (cy + radius * Math.sin(( 2 * Math.PI * pNode.childCount / step)   /*angle offset*/) );
		    return {x:x, y:y};
		}

		function spiralPos(pNode)
		{
			/*var step = 11;
		    var radius = 50 + pNode.childCount*4 ;
			var cx = pNode.x;
			var cy = pNode.y;
			angleOffset =  parseInt(pNode.childCount / step) *0.2;
			
			var x = (cx + radius * Math.cos(2 * Math.PI * 0.4*pNode.childCount / step) );  
			var y = (cy + radius *4/5 * Math.sin(2 * Math.PI * 0.4*pNode.childCount / step));
			*/
			
			var step = 10;
			
			var adding = 1;
			var cNum = cCounter(10, adding, pNode.childCount);
			var step = 10 +  pNode.childCount*0.12;
			
		    var radius = 50 + 1.8*pNode.childCount;

			var cx = pNode.x;
			var cy = pNode.y;
				
			 var x = (cx + radius * Math.cos(( 2 * Math.PI * pNode.childCount / step)   /*angle offset*/) );  
			 var y = (cy + radius * Math.sin(( 2 * Math.PI * pNode.childCount / step)   /*angle offset*/) );
		    return {x:x, y:y};
			
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
			var vis;
				
			//--
		   /* 
			vis = new org.cytoscapeweb.Visualization($(this).attr("id"), settings.pathOption);
			vis.draw(settings.drawOption);
			vis.ready(doDraw);
			*/
			//--
			
			var thisOBj = this;
			this.drawData = {nodes : [],edges : []};
			
			
			function doDraw() {
					vis.panEnabled(true);
					//vis.removeElements();
					$.each(settings.groupNodes, function(i, t){
					if(t.data.containGroup!=undefined)
					 $.extend(t.data, {id: t.data.containGroup + "_group"} );
					 $.extend(t, {childCount: 0, group: "nodes"});
					 });
					 
					if(settings.drawGroupNodes)
					vis.addElements(settings.groupNodes);
				
					var elements =  modeifyElements(thisOBj.drawData);
					vis.addElements(elements);
					
						vis.panToCenter();
						vis.zoomToFit();
				}
				
			this.draw = function(obj){
			
			
				thisOBj.drawData = obj;
				
				//add schema
				/*
				var ret = 0;
				$.each( settings.drawOption.network.dataSchema.nodes, function(i, t){
						if(t.name == settings.groupBy)
							{
							ret = 1;
							return false;
							}
				});
				if(ret == 1)
				{
				var newNodeSchema = { name: settings.groupBy, type: "string" }
				settings.drawOption.network.dataSchema.nodes.push(newNodeSchema);
				}
				*/
				
				vis = new org.cytoscapeweb.Visualization($(thisOBj).attr("id"), settings.pathOption);
				vis.draw(settings.drawOption);
				vis.ready(doDraw);
				
				/*
				vis.removeElements();
				doDraw();
				*/
			};
			
			this.draw = function(obj, option){
				settings = $.extend(settings , option);
				thisOBj.drawData = obj;
				
				//add schema
				/*
				var ret = 0;
				$.each( settings.drawOption.network.dataSchema.nodes, function(i, t){
						if(t.name == settings.groupBy)
							{
							ret = 1;
							return false;
							}
				});
				if(ret == 0)
				{
				var newNodeSchema = { name: settings.groupBy, type: "string" }
				settings.drawOption.network.dataSchema.nodes.push(newNodeSchema);
				}
				*/
				

				vis = new org.cytoscapeweb.Visualization($(thisOBj).attr("id"), settings.pathOption);
				vis.draw(settings.drawOption);
				vis.ready(doDraw);
			};
        };
		
		this.updateOptions = function(obj)
		{
			  settings = $.extend(settings , obj);
		}
		
		this.redraw = function()
		{
		  this.each(function(){   this.draw(this.drawData); });
		}
		
		this.draw = function(obj)
		{	
			this.each(function(){  this.draw(obj); });
		}
		
		this.draw = function(obj, option)
		{	
			this.each(function(){  this.draw(obj, option); });
		}
		
      
        var itriTopologyObj = this.each(_handler);
      
        return itriTopologyObj;
    };
 

})(jQuery);


