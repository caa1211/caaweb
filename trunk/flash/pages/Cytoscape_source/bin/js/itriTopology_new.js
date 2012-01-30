/*
 *Jose.Chang
 * 
 */

(function($)
{
  $.extend({

    itriTopology : function(id, settings){
       
	   	var groupLayoutSchema = {
							nodes: [
							{ name: "label", type: "string" },
							{ name: "type", type: "string" },
							{ name: "containGroup", type: "string" },
							{ name: "posAlgorithm", type: "string" }
							],
							edges:[]
						};
						
	   	var json = {
		dataSchema: {
            nodes: [], 
			edges: []
			},     
			data : {
				nodes : [] ,
				edges : []
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
				},
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
			name : "Tree",
			options:{orientation : "leftToRight"}
		};	

	   var defaultSetting = 
       {
			swfPath : "../swf/CytoscapeWeb",
			flashInstallerPath : "../swf/playerProductInstall",
			flashAlternateContent : "Le Flash Player est nécessaire.",
			drawOptions:{
				network : json,
				edgeLabelsVisible : true,
				visualStyle : style,
				layout : layout
			},
			onReady: function(){}
       };
	   
	   var _settings = $.extend(true, defaultSetting, settings);
		
	   var vis = new org.cytoscapeweb.Visualization(id, _settings);
	   
	   this.updateOptions = function(newOptions){
			$.extend(true, _settings, newOptions);
	   }
	   
	   this.getDefaultOptions = function(){
			return defaultSetting;
	   }

	   this.getCurrentOptions = function(){
			return _settings;
	   }
	   
	   
			
	   	function doGroup(drawData) {
		
		
	   //posAlgorithm	
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
		
		function circlePos1(pNode)
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
		
		function circlePos2(pNode)
		{
			var bstep = 10;
			
			var adding = 4;
			var cNum = cCounter(bstep, adding, pNode.childCount);
			var step = bstep + adding*cNum;
			
		    var radius = 400 + 30*cNum;

			var cx = pNode.x;
			var cy = pNode.y;
				
			 var x = (cx + radius * Math.cos(( 2 * Math.PI * pNode.childCount / step)   /*angle offset*/) );  
			 var y = (cy + radius * Math.sin(( 2 * Math.PI * pNode.childCount / step)   /*angle offset*/) );
		    return {x:x, y:y};
		}

		function spiralPos(pNode)
		{
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
		}

	//---
		function modeifyElements(rawGroup){
				
					var ary=new Array();
					
					$.each(rawGroup, function(i, t){
					
						if(i=="nodes")
							{
							
								$.each(t, function(ii, tt){
									var element = {group:"nodes", x:0, y:0, data:{}};
									$.extend(element.data, this);
											posAlgorithm(element);
											ary.push(element);
								
								});
								
							}
						else if(i=="edges")
						{
							$.each(t, function(ii, tt){
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
			
			function findGroupNode(type){
			var groupNode = null;
			$.each(_settings.drawOptions.layout.options.groupNodes, function (i, t){
			  if(t.data.containGroup == type )
			  {
				groupNode = t;
				return false;
				}
			
			});
			if(groupNode == null)
			alert("failed! there are no group node; type:" + type);
			
			return groupNode;
			}
			
			//---positonAlgorithm
			function posAlgorithm(node){
				var type = node.data[_settings.drawOptions.layout.options.groupBy];
				var pos = {x:0, y:0};
				var groupId = type + "_group";
				
				var parentNode = findGroupNode(type);
				parentNode.childCount = parentNode.childCount + 1;
				
				switch(parentNode.data.posAlgorithm){
				
				case "circle":
				   pos = circlePos1(parentNode);
				break;
				
					case "circle2":
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
				
				if(_settings.drawOptions.layout.options.drawGroupNodes)
				$.extend(node.data, {parent: groupId });
			}

			if(_settings.drawOptions.layout.options == undefined)
			{
				alert("Group layout must have options");
				return;
			}
			
			if(_settings.drawOptions.layout.options.groupNodes == undefined)
			{
				alert("Group layout must have groupNodes options");
				return;
			}

		
					//vis.removeElements();
					$.each(_settings.drawOptions.layout.options.groupNodes, function(i, t){
						if(t.data.containGroup!=undefined)
						 $.extend(t.data, {id: t.data.containGroup + "_group"} );
						 $.extend(t, {childCount: 0, group: "nodes"});
					 });
					 
					if(_settings.drawOptions.layout.options.drawGroupNodes)
						vis.addElements(_settings.drawOptions.layout.options.groupNodes);
				
					var elements =  modeifyElements(drawData);
				
					vis.addElements(elements);
		}
			
			function pan_zoom() {
					//	vis.panEnabled(true);
						vis.panToCenter();
						vis.zoomToFit();
			}
			
			function doReady(){
				pan_zoom();
				_settings.onReady();
			}		

		this.onReady = function(fn){  
			if (!fn) { _settings.onReady = function () {/*do nothing*/}; }
            else { 
			_settings.onReady = fn;
			}
		}
			
	   this.drawData = function(data){

			if(_settings.drawOptions.layout.name == "Group")
			{
				var newOption = $.extend({}, _settings.drawOptions);
				newOption.layout.name = "Tree";
				
				$.each(groupLayoutSchema.nodes, function(i, t)
				{
					newOption.network.dataSchema.nodes.push(t);
				});
				//edges
				$.each(groupLayoutSchema.edges, function(i, t)
				{
					newOption.network.dataSchema.edges.push(t);
				});
				newOption.network.data={nodes:[], edges:[]};
				vis.draw(newOption);
				vis.ready(
					function(){		
						doGroup(data, newOption);
						doReady();
					}
				);
			}
			else
			{
				var newOption = $.extend({}, _settings.drawOptions);
				$.extend(newOption.network.data, data);
				vis.draw(newOption);
				vis.ready(
				function(){
						doReady();
					}
				);
			}
			
			
	   };
	   

	this.ready = vis.ready;
	return $.extend(vis, this);	  
    }
	
   });

})(jQuery);


