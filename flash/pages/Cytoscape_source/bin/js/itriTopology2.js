/*
 *Jose.Chang
 * 
 */

(function($)
{
    $.fn.itriTopology = function(settings){
        
		var defaultSchema = 
						{
							nodes: [
							{ name: "label", type: "string" },
							{ name: "type", type: "string" },
							{ name: "containGroup", type: "string" },
							{ name: "posAlgorithm", type: "string" }
							],
							edges:[]
						}
						
		var json = {
		dataSchema: {
            nodes: [], 
			edges: []
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
			name : "ForceDirected",
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
			groupOption : {
				groupNodes :
				[
						{ x:200, y:0, data: { containGroup: "compute", type:"group", posAlgorithm: "vlinear"} }, //linear, circle, spiral, vlinear
						{ x:100, y:0, data: { containGroup: "network", type:"group", posAlgorithm: "vlinear"} },
						{ x:0,   y:0, data: { containGroup: "storage", type:"group", posAlgorithm: "vlinear"} }	
				],
				groupBy:"type", 
				drawGroupNodes:false
				}
       }
       
       var settings = $.extend(defaultSetting , settings);
    
	
	   function findGroupNode(type){
		   var groupNode = null;
			$.each(settings.groupOption.groupNodes, function (i, t){
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
	
	
			var type = node.data[settings.groupOption.groupBy];
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
			
			if(settings.groupOption.drawGroupNodes)
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

		var redraw = false;
	
        var _handler = function(){
			var vis;
			
			vis = new org.cytoscapeweb.Visualization($(this).attr("id"), settings.pathOption);

			var thisObj = this;

			this.drawData = {nodes : [],edges : []};
			
		//add dataSchema
				//nodes
				$.each(defaultSchema.nodes, function(i, t)
				{
					settings.dataSchema.nodes.push(t);
				})
				//edges
				$.each(defaultSchema.edges, function(i, t)
				{
					settings.dataSchema.edges.push(t);
				}
				
				)
			settings.drawOption.network.dataSchema = settings.dataSchema;
			

			function doDraw(_settings) {
					
					//vis.removeElements();
					$.each(_settings.groupOption.groupNodes, function(i, t){
					if(t.data.containGroup!=undefined)
					 $.extend(t.data, {id: t.data.containGroup + "_group"} );
					 $.extend(t, {childCount: 0, group: "nodes"});
					 });
					 
					if(_settings.groupOption.drawGroupNodes)
					vis.addElements(_settings.groupOption.groupNodes);
				
					var elements =  modeifyElements(thisObj.drawData);
					vis.addElements(elements);
				}
				
		    function pan_zoom(vis) {
					//	vis.panEnabled(true);
						vis.panToCenter();
						vis.zoomToFit();
			}
				
									
			function registerEvent(vis){

			}
					
			
			function doReady(vis){
				pan_zoom(vis);
				registerEvent(vis);
				$(thisObj).trigger("ready", vis);
			}
			
		
		this.getVis = function(){
		return vis;
		}
		
		
		vis.draw(settings.drawOption);
		
			this.draw = function(networkData, layoutType, option){
			 var _settings = $.extend({},settings);
			 var groupOptionEnable = true;
				$(thisObj).trigger("drawStart");
			
				if(layoutType!=undefined)
				{
				 if(layoutType == "Group")
					{ 
					groupOptionEnable = true;
					if(option!=undefined)
					 $.extend(_settings.groupOption , option);
				
					}
				 else
					groupOptionEnable = false;
					
				}
				else
				layoutType="ForceDirected";
				
				
				if(!redraw)
				{
				vis.removeElements();
				vis.zoom(1);
				}
				thisObj.drawData = networkData;

				if(groupOptionEnable)
				{
								
					_settings.drawOption.network.data={nodes:[], edges:[]};

				 if(!redraw)
				{
					doDraw(_settings);
					doReady(vis);
				}
				 else
				 {
				 	vis.draw(_settings.drawOption);
				 	vis.ready(function(){
					doDraw(_settings);
					doReady(vis);
					});
				 }
					
					
				}
				else
				{
				 $.extend(_settings.drawOption.network.data, networkData)
				 $.extend(_settings.drawOption.layout, {name:layoutType, option:option==undefined?{}:option});
	
				 vis.draw(_settings.drawOption);
					vis.ready(function(){
						doReady(vis);
					});
				}
			};
        };
		
		this.updateOptions = function(obj)
		{
			  settings = $.extend(settings , obj);
		};
		
		this.redraw = function()
		{
		  this.each(function(){   this.draw(this.drawData); });
		};
			
		this.draw = function(obj, layoutType, option)
		{	
			this.each(function(){  this.draw(obj, layoutType, option); });
		};
		
		this.getVis = function()
		{	
		    var visAry = new Array();
			
			this.each(function(){  
			
			visAry.push(this.getVis());

			});
			
			if(visAry.length ==1)
			return visAry[0];
			else
			return visAry;
		};

        var itriTopologyObj = this.each(_handler);
      
        return itriTopologyObj;
    };
 

})(jQuery);


