var apiList = [

{
	name : "Customized",
	supportType: ["get", "delete", "post", "put"],
	desc:"",
	url : "/vsp/rest/",
	data : ''
},
//HQ Api################################################################

{
	name : "HQ- Group",
	supportType: ["get", "post", "delete", "put"],
	desc:"PARAM<br> GET: id, POST: id, name, description, location, DELETE: id, PUT: id, name, location, description",
	url : "/vsp/rest/h/group",
	data : '{"id": 0, "name":"testGroup", "description":"", "location":"itri" }'
},
{
	name : "HQ- All Groups",
	supportType: ["get"],
	desc:"",
	url : "/vsp/rest/h/groups",
	data : ''
},
{
	name : "HQ- Get auto discovery",
	supportType: ["get"],
	desc:"PARAM<br> GET: isApprove",
	url : "/vsp/rest/h/autodiscovery",
	data : '{"isApprove": false}'
},
{
	name : "HQ- Get all agents",
	supportType: ["get"],
	desc:"",
	url : "/vsp/rest/h/agents",
	data : ''
},
{
	name : "HQ- Resource",
	supportType: ["get"],
	desc:"GET: resource(key), verbose, children",
	url : "/vsp/rest/h/resource",
	data : '{"resourceId": 12345, "verbose": false, "children": false}'
},
{
	name : "HQ- Agent Resource",
	supportType: ["get"],
	desc:"GET: agentId(key), verbose, children",
	url : "/vsp/rest/h/agentResource",
	data : '{"agentId": 12345, "verbose": false, "children": false}'
},
{
	name : "HQ- Metric List",
	supportType: ["get"],
	desc:"GET: resourceId(key), onlyEnabled",
	url : "/vsp/rest/h/metric",
	data : '{"resourceId": 12345, "onlyEnabled": true}'
},
{
	name : "HQ- Metric Data",
	supportType: ["get"],
	desc:"GET: metricId(key), start (yyyy/MM/dd HH:mm:ss), end (yyyy/MM/dd HH:mm:ss)",
	url : "/vsp/rest/h/metricData",
	data : '{"metricId": 12345, "start": "2013/02/06 18:00:00", "end": "2013/02/06 20:00:00"}'
},


//NOC Api################################################################
{
	name : "NOC- Application",
	supportType: ["get", "delete", "post", "put"],
	desc:"",
	url : "/vsp/rest/n/application",
	data : '{}'
},
{
	name : "NOC- Company",
	supportType: ["get", "delete", "post", "put"],
	desc:"",
	url : "/vsp/rest/n/company",
	data : '{}'
},




//TEST Api###############################################################
{
	name : "restTest dead",
	supportType: ["get"],
	desc:"",
	url : "/vsp/rest/t/dead",
	data : ''
},
{
	name : "restTest unknownDead",
	supportType: ["get"],
	desc:"",
	url : "/vsp/rest/t/unknownDead",
	data : ''
},
{
	name : "restTest fail",
	supportType: ["get"],
	desc:"",
	url : "/vsp/rest/t/fail",
	data : ''
},
{
	name : "restTest",
	supportType: ["get", "delete", "post", "put"],
	desc:"",
	url : "/vsp/rest/t/restCRUD",
	data : '{"name": "caa"}'
},
{
	name : "get json string response",
	supportType: ["get"],
	desc:"",
	url : "/vsp/rest/t/jsonString",
	data : '{}'
},
{
	name : "get json Object response",
	supportType: ["get"],
	desc:"",
	url : "/vsp/rest/t/jsonObj",
	data : '{"name": "caa"}'
},
{
	name : "get json Array response",
	supportType: ["get"],
	desc:"",
	url : "/vsp/rest/t/jsonAry",
	data : '{"name": "caa"}'
}




];