	var debugDiv ;
$(function(){


	debugDiv = $("#debugDiv");

	
		
		
		});
			function print(str) {
			debugDiv.append("<p>" + str + "</p>");
		}
		function clear() {
			debugDiv.empty();
		}
		
		
		function printData(str) {
			clear();
			debugDiv.append("<p>" + str + "</p>");
		}