	var debugDiv 
	var	timeDiv;
$(function(){


	debugDiv = $("#debugDiv");

		timeDiv = $("#timeDiv");
		
		
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
		
		
		
			
			
		function timeclear() {
			timeDiv.empty();
		}
		
		
		function printTime(str) {
			timeclear();
			timeDiv.append("<p>" + str + "</p>");
		}
		
		