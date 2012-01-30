/*
 *Jose.Chang
 * 
 */

(function($)
{
  $.extend({
    itriTopology : function(id, settings){
       
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
			}
       };
	   
	   var _settings = $.extend(true, defaultSetting, settings);

	   var vis = new org.cytoscapeweb.Visualization(id, _settings);
	   
	   this.updateOptions = function(newOptions){
	      _settings = $.extend(true, {} , defaultSetting, newOptions);
	   }
	   
	   this.getDefaultOptions = function(){
			return defaultSetting;
	   }

	   this.drawData = function(data){
			var newOption = $.extend({}, _settings.drawOptions);
			$.extend(newOption.network.data, data);
			vis.draw(newOption);
	   };
	   

	this.ready = vis.ready;
	return $.extend(vis, this);	  
    }
	
   });

})(jQuery);


