

	
		
	   var data = {
				nodes : [
				{id : "c1", type: "compute" }, 
				{id : "c2", type: "compute"},
				{id : "c3", type: "compute"},
				{id : "n1", type: "network"},
				{id : "n2", type: "network"},
				{id : "s1", type: "storage" }
				],
				edges : [
				{id : "e1",target : "c1",source : "n1"},
				{id : "e2",target : "c2",source : "n1"},
				{id : "e3",target : "c3",source : "n1"},
				{id : "e4",target : "s1",source : "n1"},
				{id : "e5",target : "s1",source : "n2"}
				]
			}
			

	 //--test data
		var data2 = {
					nodes:[
					{id : "network", type: "network", g:"2"},
					{id : "network2", type: "network", g:"4"}],
					 edges:[
					  {id : "networkEdge", target:"network", source:"network2"}
					 ]};

		for(var i=0;i<200;i++)
		{
			var node = {id : "c"+i, type:"compute",  g:"1"};
			var edge = {id : "networkToC" + i , target:"network", source:"c"+i}
			data2.nodes.push(node);
			data2.edges.push(edge);
		}	
		
			
		for(var i=0;i<50;i++)
		{
			var node = {id : "s"+i, type:"storage" , g:"3"};
			var edge = {id : "networkTos" + i , target:"network2", source:"s"+i}
			data2.nodes.push(node);
			data2.edges.push(edge);
		}	
		
		
		//--
		
	