/*
 * ZyXEL Library 1.0
 * 09/12/2008
 * Copyright(c) 2008-2010, ZyXEL cop.
 * Jerry san
 * hchoe@zyxel.com.tw
 * http://www.zyxel.com
 */
/* ext-js default images path */
Ext.BLANK_IMAGE_URL = '../../ext/resources/images/default/s.gif';
/* define CGI */
var zyCGI = "/cgi-bin/zysh-cgi?filter=js2";
var cp = new Ext.state.CookieProvider({
	expires: new Date(new Date().getTime()+(1000*60*60*24*30)) //30 days
});



//store selected grid
var selectedGridIds=[];

Ext.state.Manager.setProvider(cp);
Ext.QuickTips.init();
Ext.form.Field.prototype.msgTarget = 'side';

/* if a lot of pages call the same page A, the page A will use whoCallMe to get the caller.
 * Note: whoCallMe is a relative path like 'license/update/idp', please refer to license/update/idp.js.
 */
var whoCallMe;

/* user for auto execute updating date time 
 * Note: if you want this to do other task, please refer to dashboard.js or datetime.js.
 */
var runTask = new Ext.util.TaskRunner();

/* remove all child node */
function removeAllChild(id){
	var cell = document.getElementById(id);
	if (cell.hasChildNodes()) {
		while (cell.childNodes.length >= 1) {
			cell.removeChild(cell.firstChild);
		}
	}
	cell = null;
}
		
/* Append script language to html head */
function setScript2Head(id, text){
	/* remove old child first */
	var head= document.getElementsByTagName("head").item(0);
	var o = document.getElementById(id);
	if (o) head.removeChild(o);

	/* create new child */
	var n = document.createElement("script");
	n.text = text;
	n.setAttribute('language','javascript');
	n.id = id;
	head.appendChild(n);
	head = o = n = null;
}

/* Append script tag to html head */
function setScriptTag2Head(id, filename){
	/* remove old script tag first */
	var head= document.getElementsByTagName("head").item(0);
	var o = document.getElementById(id);
	if (o) head.removeChild(o);

	/* create new script tag */
	var n = document.createElement("script");
	n.type = 'text/javascript';
	n.id = id;
	n.src = filename;
	head.appendChild(n);
	head = o = n = null;
}

/* retrieve cli & return fields */
function retrieveData(scope, showCmd, callback, id){
	var length = showCmd.length;
	var cli = composeMultiCLI(showCmd);
	issueCLI(cli, scope, showCmd, length, callback, id);
}

/* issue CLI and set Store to record data return */
function issueCLI(cli, scope, cmd, len, cb, id) {
	Ext.Ajax.request({
		url: cli,
		method: 'GET',
		failure:function(response,options) {
			Ext.MessageBox.alert('Error Message',response.responseText);
		},
		callback: function(options, success, response) {
			if(success){ 
				var res = Ext.util.JSON.decode(js2json(response.responseText));
				//if (debugLog) Ext.log('### issue CLI respone :' + response.responseText);
				if(res != false){
					var num = eachReader(res, cmd);
					if (num == len) {
						if (cb == undefined) {
							eval(scope+'.dispatch();');
						}else{
							//dashboard use only
							eval(scope+'.'+cb+'(id);');
						}
					}
				}
			}
		}
	});
}

function eachReader(response, cmd){
	var count = 0, store;
	var eflag = false;//jerry san
	for (var i = 0, length = cmd.length; i < length; i++) {
		if (!Ext.isArray(cmd[i].id)) {
			var ptr = showCLI[cmd[i].id][0];
			var f = ptr.fields;
			var sr = (ptr.subroot && response['zyshdata'+i].length != 0) ? ptr.subroot : '';
			var reader = new Ext.data.JsonReader({
				root: 'zyshdata'+i+sr,
				fields: f
			});

			if (cmd[i].aliasId)
				cmd[i].id = cmd[i].aliasId;
			/* set true, Jerry san */
			eflag = true;
			store = new Ext.data.GroupingStore({
				autoLoad: true,
				data: response,
				reader: reader,
				remoteSort: false,
				groupField: '',
				listeners : {
					load : function(store) {
						if(eflag){/* suspend Event from idp query, Jerry san */
							eval(cmd[i].id +' = store;');
							count++;
							eflag=false;
						}
					},
					scope: this
				}
			});
		}
		else { 
			/* special case, appear in DNS, datetime. */
			Ext.each(cmd[i].id, function(cmd) {
				var ptr = showCLI[cmd.id][0];
				var d = response;
				var f = ptr.fields;
				var sr = (ptr.subroot && eval("typeof d['zyshdata'+i]" + ptr.subroot) == 'object') ? ptr.subroot : '';
				var reader = new Ext.data.JsonReader({
					root: 'zyshdata'+i+sr,
					fields: f
				});
				if (Ext.isEmpty(sr)) {
					var pseudo = "{zyshdata"+i+":[]}";
					d = Ext.util.JSON.decode(pseudo);
				}
				store = new Ext.data.GroupingStore({
					autoLoad: true,
					data: d,
					reader: reader,
					remoteSort: false,
					groupField: '',
					listeners : {
						load : function(store) {
							eval(cmd.id +' = store;');
						}
					}
				});
			});
			count++;
		}
		if (cmd[i].subId) { //special case, appear in system
			Ext.each(cmd[i].subId, function(id, idx) {
				var ptr = showCLI[id][0];
				var f = ptr.fields;
				var sr = (ptr.subroot && response['zyshdata'+i+'_'+(idx+1)].length != 0) ? ptr.subroot : '';
				var reader = new Ext.data.JsonReader({
					root: 'zyshdata'+i+'_'+(idx+1)+sr,
					fields: f
				});
				store = new Ext.data.GroupingStore({
					autoLoad: true,
					data: response,
					reader: reader,
					remoteSort: false,
					groupField: '',
					listeners : {
						load : function(store) {
							eval(id +' = store;');
						}
					}
				});
			});
		}
	}
	store = null;
	return count;
}

function issueConfigCLI(cmd, nextPage){
	var configCLI = composeMultiConfigCLI(cmd);	
	configCLI = configCLI.replace(/[%]/g, '%25').replace(/[#]/g, '%23').replace(/[+]/g, '%2B').replace(/[\\]/g, '%5C');
	var np = '../../web-pages/'+nextPage+'.js';
	Ext.getBody().mask('Loading', 'x-mask-loading');
	Ext.Ajax.request({
		url: configCLI,
		method: 'GET',
		failure:function(response,options) {
			Ext.MessageBox.alert('Error Message',response.responseText);
		},
		callback: function(options, success, response) {
			if(success) {
				var res = Ext.util.JSON.decode(js2json(response.responseText));
				callPage(nextPage);
			}
		}
	});
}

/* 1. Log return data status, i.e. error number and error message
 * 2. Translate js format to json format 
 */
function js2json(js){
	var jsAry = js.match(/(zyshdata)+/g);//all string 

	if (jsAry != null) {
		/* first count CLI # */
		var ccnt = jsAry.length;
		
		/* check error number and error massage */
		for( var i = 0; i < ccnt; i++) {
			var newJS = js.slice(js.search('errno'+i));
			var errno = newJS.slice(newJS.search('=')+1, newJS.search('\;'));
			if (errno == 0)  {
				/* CLI return OK. Do nothing */
			} else {
				newJS = newJS.slice(newJS.search('errmsg'+i));
				var errmsg = newJS.slice(newJS.search('=')+1, newJS.search('\;'));
				if (errno > 0){
					/* warning message */
					Ext.MessageBox.alert('Warning Message', 'CLI: '+i+ '<br>warn no: '+ errno+'<br>warn msg: '+errmsg);
					if(cliLog) Ext.log('### Warn Msg ', 'CLI: '+i+ ', warn no: '+ errno+', warn msg: '+errmsg);
				}else{
					/* error message */
					Ext.MessageBox.alert('Error Message', 'CLI: '+i+ '<br>errno: '+ errno+'<br>errmsg: '+errmsg);
					if(cliLog) Ext.log('### Err Msg ', 'CLI: '+i+ ', errno: '+ errno+', errmsg: '+errmsg);
					Ext.getBody().unmask();
					return false;
				}
			}
		}
	}
	else {
		Ext.MessageBox.alert('Device Error ','Wrong CLI command, device timeout or device logout.');
		if(cliLog) { Ext.log('### Device Error ','Wrong CLI command, device timeout or device logout.');}
		Ext.getBody().unmask();
		return false;
	}
	
	/* translate js to json format : replace "\{\}" to "" is dirty workaround */
	//js = js.replace(/var\s+/gi, '{"').replace(/;+/gi, '}').replace(/\=+/gi, '":').replace(/\}\s\{+/gi, ',').replace(/\{\}+/g, '');
	js = js.replace(/var\s+(\w+)\s*=\s*(.*);\n/gi,'{"$1":$2}\n').replace(/}(\s*){/gi, ',').replace(/{}/gi, '');
	if(debugLog) { Ext.log('### Response Start ', debugLog); Ext.log(js); Ext.log( '### Response End ');}
	return js;
}

function composeCLI(){
	if(arguments.length == 0) {Ext.log('### CLI is empty. '); return ''};
	var cmd= zyCGI;
	if(cliLog){Ext.log('### CLI Start ')};
	for(var n = 0; n < arguments.length; n++){
		cmd += '&cmd=' + arguments[n];  
		if(cliLog){Ext.log('['+n+'] '+arguments[n]);} 
	}	
	if(cliLog){Ext.log('### CLI End ')};
	return cmd;
}

function composeMultiCLI_2(obj){
	if(obj.length == 0) {Ext.log('### CLI is empty.'); return ''};		
	var cmds= zyCGI;
	if(cliLog){Ext.log('### CLI Start ')};
	for (var i = 0; i < obj.length; i++) {
		cmds += '&cmd=' + obj[i].CLI;
		if(cliLog){Ext.log('['+i+'] '+obj[i].CLI);}
	}	
	if(cliLog){Ext.log('### CLI End ')};
	return cmds;
}

function composeMultiCLI(cmd){
	var cmds = zyCGI;
	for (var i = 0, length = cmd.length; i < length; i++) {
		if (Ext.isArray(cmd[i].id)) {
			if (! [cmd[i].id[0].needArg]) {
				cmds += '&cmd=' + showCLI[cmd[i].id[0].id][0].cli;
				if(cliLog){Ext.log('['+i+'] '+showCLI[cmd[i].id[0].id][0].cli);}
			} else {
				var args = [cmd[i].id[0].argv];
				cli = String(showCLI[cmd[i].id[0].id][0].cli).replace(/\{(\d+)\}/g,
					function(m, i) {return args[i];});
				cmds += '&cmd=' + cli;
				if(cliLog){Ext.log('['+i+'] '+cli);}
			}
		} 
		else if (!cmd[i].needArg) {
			cmds += '&cmd=' + showCLI[cmd[i].id][0].cli;
			if(cliLog){Ext.log('['+i+'] '+showCLI[cmd[i].id][0].cli);}
		} 
		else {
			var args = cmd[i].argv[0];
			cli = String(showCLI[cmd[i].id][0].cli).replace(/\{(\d+)\}/g,
				function(m, i) {return args[i];});
			cmds += '&cmd=' + cli;
			if(cliLog){Ext.log('['+i+'] '+cli);}
		}
	}
	if(cliLog){Ext.log('### CLI End ')};
	return cmds;
}

function composeMultiConfigCLI(configCLI){
	if(configCLI.length == 0) {Ext.log('### Configure CLI is empty.'); return ''};		
	var cmds= zyCGI;
	if(cliLog){Ext.log('### Configure CLI Start ')};
	for (var i = 0; i < configCLI.length; i++) {
		cmds += '&cmd=' + configCLI[i];
		if(cliLog){Ext.log('['+i+'] '+configCLI[i]);}
	}	
	if(cliLog){Ext.log('### Configure CLI End ')};
	return cmds;
}

Date.patterns = {
	ISO8601Long:"Y-m-d H:i:s",
	ISO8601Short:"Y-m-d",
	ShortDate: "n/j/Y",
	LongDate: "l, F d, Y",
	FullDateTime: "l, F d, Y g:i:s A",
	MonthDay: "F d",
	ShortTime: "g:i A",
	LongTime: "g:i:s A",
	SortableDateTime: "Y-m-d\\TH:i:s",
	UniversalSortableDateTime: "Y-m-d H:i:sO",
	YearMonth: "F, Y",
	myDateTime: "Y-m-d / H:i:s",
	myClock: "H:i:s"
};

/* Clone Function */
Ext.ux.clone = function(o) {
	if(!o || 'object' !== typeof o) {
		return o;    
	}
	var c = 'function' === typeof o.pop ? [] : {};
	var p, v;    
	for(p in o) {
		if(o.hasOwnProperty(p)) {
			v = o[p];
			if(v && 'object' === typeof v) {
				c[p] = Ext.ux.clone(v);
			}else {
				c[p] = v;
			}
		}
	}
	return c;
}; // eo function clone 
/* tree panel selecter */
function changeModule(moduleName) { 
	/* stop all run time */
	runTask.stopAll();
	var treePtr = Ext.getCmp('tree-panel');	
	Ext.getBody().mask('Loading', 'x-mask-loading');
	switch(moduleName){
		case "config":
			setPanel(moduleName, 'config-panel.json');
			//treePtr.setTitle(_T('_treepanel','_Configuration'));
			treePtr.setTitle('Configuration');
			//Ext.fly('quick-setup').setVisible(true);
			break;
		case "monitor":
			setPanel(moduleName, 'monitor-panel.json');
			//treePtr.setTitle(_T('_treepanel','_Monitor'));
			treePtr.setTitle('Monitor');
			//Ext.fly('quick-setup').setVisible(false);
			break;
		case "maintenance":
			setPanel(moduleName, 'mainten-panel.json');
			treePtr.setTitle(_T('_treepanel','_Maintenance'));
			treePtr.setTitle('Maintenance');
		//	Ext.fly('quick-setup').setVisible(false);
			break;
		case "dashboard":
			var ban = document.getElementById("globalnav");
			if (ban.className != 'dashboard') {	
				checkPanel('dashboard');
				callPage('dashboard/dashboard');
			}
			ban.className="dashboard";
			Ext.getBody().unmask();
			break;
	}
	top.document.title = 'PRODUCT_NAME';//ZLDSYSPARM_PRODUCT_NAME1;
}

/* setPanel */
function setPanel(className, fileName){
	var treePtr = Ext.getCmp('tree-panel');
	treePtr.expand(); 
	treePtr.on('collapse', function(){
		Ext.fly('tree-panel-xcollapsed').setVisible(true);
	});
	document.getElementById("globalnav").className = className;
	treePtr.getLoader().dataUrl = fileName;
	treePtr.getRootNode().reload();
	treePtr.getLoader().addListener('load', function(l, node, response) {
		if (/html/.test(response.getResponseHeader['Content-Type'])) 
			top.location.href = '/';
/*	treePtr.getLoader().addListener('loadexception', function(l, node, response) {
		if (response.status == '403')
			top.location.href = '/';*/
	});

	treePtr.show();
	rmCtPanel('content-panel');
	Ext.getBody().unmask();		
}

/* check treepanel */
function checkPanel(ban){
	var treePtr = Ext.getCmp('tree-panel');
	if(Ext.fly('tree-panel-xsplit').isVisible()){
		treePtr.collapse();	
		treePtr.on('collapse', function(){
			if(ban == 'dashboard'){
				Ext.fly('tree-panel-xcollapsed').setVisible(false);
			}
		});
	}
	if(Ext.get('tree-panel-xcollapsed').isVisible()){
		Ext.fly('tree-panel-xcollapsed').setVisible(false);
	}
}

/* remove content panel */
function rmCtPanel(id){
	Ext.getCmp(id).removeAll();
}

/* browser cookie */
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function readParseCookie(name) {
	var myName = 'ys-' + name + "="; // ext-js format : ys-{cookiename}
	var c = document.cookie.split(';');
	var d = [];
	for (var i = 0, len = c.length; i < len; i++) {
		var eachCookie = c[i];
		while (eachCookie.charAt(0) == ' ')
			eachCookie = eachCookie.substring(1, eachCookie.length);
		if (eachCookie.indexOf(myName) == 0) {
			var mine = eachCookie;
			mine = mine.substring(myName.length + 4, mine.length); // 4 is s%3A
			myAry = mine.split('%20'); // since we use 'space' as delimitation
			return myAry;
		}
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

/* call edit/add object */
function callPage(filename){
	var np = '../../web-pages/'+filename+'.js';
	Ext.Ajax.request({
		url: np,
		method: 'GET',
		failure:function(response,options){
		/*	if (response.status == '403')
				top.location.href = '/';
			else {*/
				Ext.MessageBox.alert('Error Message',response.responseText);
				Ext.getBody().unmask();
		//	}
		},                         
		success:function(response,options){
			if (/html/.test(response.getResponseHeader['Content-Type'])) 
				top.location.href = '/';
			else
				eval(response.responseText);
		}   
	});
}

/* call inline object, meanwhile, set null text and append to header */
function callInlineObj(filename, callerPath){
	var np = '../../common/page-store/'+filename+'.js';
	Ext.Ajax.request({
	   	url: np,
	   	method: 'GET',
	   	failure:function(response,options){
		/*	if (response.status == '403')
				top.location.href = '/';
			else {*/
				Ext.MessageBox.alert('Error Message',response.responseText);
				Ext.getBody().unmask();
		//	}
		},                         
		success:function(response,options){
			whoCallMe = callerPath;
			if (/html/.test(response.getResponseHeader['Content-Type'])) 
				top.location.href = '/';
			else
				eval(response.responseText);
		}   
	});
}

/* This API mixd stores to be a big store which uses in comboBox 
 * Note: It just combo Obj as well as Group Obj
 */
function mixStore(topOne, objStore, objItem, objTag, grpStore, grpItem, grpTag, objExcepSS) {
	var d = [];
	var found;
	var objGet;
	if (topOne) {
		Ext.each(topOne, function(val) {
			d.push([d.length, val, 'Empty']);
		});	
	}
	
	if (objStore) {
		if (typeof objStore != 'string') {
			objStore.each(function(rec) {
				found = false;
				objGet = rec.get(objItem);
				if (objExcepSS) {
					objExcepSS.each(function(rec) {
						if ( rec.get('_Name') == objGet ) {
							found = true;
							return false;
						}
					});
					if (!found)
						d.push([d.length, objGet, objTag ? objTag : 'Empty']);
				} else {
					d.push([d.length, objGet, objTag ? objTag : 'Empty']);
				}
			});
		}
		else
			d.push([d.length, objStore, objTag ? objTag : 'Empty']);
	}
	if (grpStore) {
		if (typeof grpStore != 'string') {
			grpStore.each(function(rec) {
				found = false;
				objGet = rec.get(grpItem);
				if (objExcepSS) {
					objExcepSS.each(function(rec) {
						if ( rec.get('_Name') == objGet ) {
							found = true;
							return false;
						}
					});
					if (!found)
						d.push([d.length, objGet, grpTag ? grpTag : 'Empty']);
				} else {
					d.push([d.length, objGet, grpTag ? grpTag : 'Empty']);
				}
			});
		}
		else
			d.push([d.length, grpStore, grpTag ? grpTag : 'Empty']);
	}
	var bigStore = new Ext.data.SimpleStore({fields: ['_ID', '_Name', '_Tag'], data: d});
	return bigStore;
}

/* This API will find the address content follows the object name in combobox */
function addrSuffix(value) {
	var suffix = 'N/A', found = false;
	var typeRe = /^(SUBNET|INTERFACE SUBNET)$/;

	if ( value != '' && value != 'any') {
		showAddress.each(function(rec) {
			if (rec.get('_Object_name') == value) {
				found = true;
				if (rec.get('_Type').match(typeRe))
					suffix = rec.get('_Type') + ', ' + rec.get('_Address')[0] + '/' + rec.get('_Address')[1];
				else if (rec.get('_Type') == "RANGE")
					suffix = rec.get('_Type') + ', ' + rec.get('_Address')[0] + '-' + rec.get('_Address')[1];
				else
					suffix = rec.get('_Type') + ', ' + rec.get('_Address');
				return false;
			}
		});
		if (!found) {
			showAddressGrp.each(function(rec) {
				if (rec.get('_Group_name') == data) {
					suffix = 'Group';
					if (!Ext.isEmpty(rec.get('_Description')))
						suffix = suffix + ', ' + rec.get('_Description');
					return false;
				}
			});
		}
	}
	return suffix;
}

/* This API will find the Schedule content follows the object name in combobox */
function schSuffix(value) {
	var suffix = '', found = false;
	var _once = '{0}-{1}-{2} {3}:{4} / {5}-{6}-{7} {8}:{9}';
	var _recur = '{0}:{1}-{2}:{3}';

	if ( value != '' && value != 'none') {
		showSchedule.each(function(rec) {
			if (rec.get('_Object_name') == value) {
				found = true;
				var se = rec.get('_Start_End');
				if (rec.get('_Type') == 'Recurring') {
					_recur = String(_recur).replace(/\{(\d+)\}/g, function(m,i) {return se[i];});
					suffix = rec.get('_Type') + ', ' + _recur;
				} else {
					_once = String(_once).replace(/\{(\d+)\}/g, function(m,i) {return se[i];});
					suffix = rec.get('_Type') + ', ' + _once;
				}
				return false;
			}
		});
	} else if ( value == 'none' ) {
		suffix = 'N/A';
	}
	return suffix;
}

/* This API will find the address content follows the object name in combobox */
function ifaceSuffix(value) {
	var suffix = 'N/A';

	if ( value != '' && value != 'any') {
		showIfaceALL.each(function(rec) {
			if (rec.get('_Name') == value) {
				suffix = rec.get('_IP_Assignment') + ' -- ' + rec.get('_IP_Address') + '/' + rec.get('_Mask');
				return false;
			}
		});
	}
	return suffix;
}

function vpnGWSuffix(value) {
	var suffix = 'N/A';

	if ( value != '' && value != 'any') {
		showIsakmpPolicy.each(function(rec) {
			if (rec.get('__name') == value) {
				suffix = rec.get('_my_address').__name + ' ' + rec.get('_secure_gateway_address')[0]._address + ' ' + rec.get('_secure_gateway_address')[1]._address;
				return false;
			}
		});
	}
	return suffix;
}

/* finRecord use to find correspond record. It uses only in comboBox */
function findIndex(store, which) {
	var idx;
	store.each(function(r) {
		if (r.data['_Name'] == which) {
			idx = r.data['_ID'];
			return false;
		}
	});
	return idx;
}

/* help */
var theHelp;
var Context='Web Help';
var Topic='010000';
function openHelp(context, topic){
	var str;
	if((context=='')&&(topic=='')){
		str = '';
	}else{
		str = '?context='+context+'&topic='+topic;
	}
	if((theHelp == undefined)||(theHelp.closed)){
		theHelp = window.open('../../helps/index.html'+str, 'helps', 'width=800, height=600, location=no, status=no, scrollbars=yes, resizable=yes');
	}else{
		theHelp.location.href = '../../helps/index.html'+str;
	}
}

/* findPosition use to find id position. It uses in web page */
function findPosition() {
	var args = Array.prototype.slice.call(arguments, 0);
	for (var k in args[0]) {
		if (args[0][k].aliasId) {
			if (args[0][k].aliasId == args[1])
				return k;
		} else if (args[0][k].id == args[1])
			return k;
	}
}

/* findALTPosition use to find id in second level position */
/* Used to alternate original one - findPosition(). */
/* It uses in web page cmds contained cmd array */
function findALTPosition() {
	var ret = '';
	var args = Array.prototype.slice.call(arguments, 0);
	for (var k in args[0]) {
		var sublist = args[0][k].id;
		if ( sublist instanceof Array ){
			for (var j in sublist) {
				if (sublist[j].id == args[1]){
					/* Note: Returned format 'k , j' of level 1 / 2 cmd idx */
					ret = k + ',' + j;
					return ret;
				}
			}
		}
	}
	return ret;
}

/* used for handle field is changed or not */
function handleFn(record, field, newVal, oldVal) {
	record.set(field, newVal);
	if (newVal == oldVal) {
		if (record.modified)
			delete record.modified[field];
	}
	record.store.fireEvent("update", record.store, record, Ext.data.Record.EDIT);
	var m = record.modified, doRemove = true;
	for (var n in m) {
		if (m.hasOwnProperty(n)) {
			doRemove = false;
			break;
		}
	}
	if(doRemove)
		record.store.modified.remove(record);
}

function recoverRecord(record, bkRecord) {
	var m = record.modified;
	for (var n in m) {
		record.set(n, bkRecord.get(n));
	}
	record.commit();
}

function recover(record) {
	record.commit();
}

/* mouse over address object / group */
function mouseOverAddr(data, metaData, record) {
	var tips = '', found = false;
	var typeRe = /^(SUBNET|INTERFACE SUBNET)$/;
	showAddress.each(function(rec) {
		if (rec.get('_Object_name') == data) {
			found = true;
			if (rec.get('_Type').match(typeRe))
				tips = rec.get('_Object_name') + ', ' + rec.get('_Address')[0] + '/' + rec.get('_Address')[1];
			else if (rec.get('_Type') == 'RANGE')
				tips = rec.get('_Object_name') + ', ' + rec.get('_Address')[0] + '-' + rec.get('_Address')[1];
			else
				tips = rec.get('_Object_name') + ', ' + rec.get('_Address');
			return false;
		}
	});
	if (!found) {
		showAddressGrp.each(function(rec) {
			if (rec.get('_Group_name') == data) {
				tips = 'Group';
				if (!Ext.isEmpty(rec.get('_Description')))
					tips = tips+ ', ' + rec.get('_Description');
				return false;
			}
		});
	}
	if (tips != "")
		return '<a href="#" class="grid-tip"  ext:qtip="' + tips + '">'+
				'<img src="../../images/usg/others/i_tooltip.gif">'+ data + '</a>';
	else
		return data;
}

/* mouse over service object / group */
function mouseOverSrv(data, metaData, record) {
	var tips = '', found = false;
	showService.each(function(rec) {
		if (rec.get('_Object_name') == data) {
			found = true;
			tips = rec.get('_Protocol') + ', ' + rec.get('_Minmum_port') + '/' + rec.get('_Maxmum_port');
			return false;
		}
	});
	if (!found) {
		showServiceGrp.each(function(rec) {
			if (rec.get('_Group_name') == data) {
				if (rec.get('_Description') == "")
					tips = 'Group';
				else
					tips = 'Group, ' + rec.get('_Description');
				return false;
			}
		});
	}
	if (tips != "")
		return '<a href="#" class="grid-tip"  ext:qtip="' + tips + '">'+
				'<img src="../../images/usg/others/i_tooltip.gif">'+ data + '</a>';
	else
		return data;
}

/* mouse over service object / group */
function mouseOverSch(data, metaData, record) {
	var tips = '', found = false;
	var tip_once = 'Start Day/Time {0}-{1}-{2} {3}:{4}<br>Stop Day/Time {5}-{6}-{7} {8}:{9}';
	var tip_recur = 'Start Time {0}:{1}<br>Stop Time {2}:{3}';

	showSchedule.each(function(rec) {
		if (rec.get('_Object_name') == data) {
			var se = rec.get('_Start_End');
			if (rec.get('_Type') == 'Once')
				tips = String(tip_once).replace(/\{(\d+)\}/g, function(m,i) {return se[i];});
			else
				tips = String(tip_recur).replace(/\{(\d+)\}/g, function(m,i) {return se[i];});
			return false;
		}
	});
	if (tips != "")
		return '<a href="#" class="grid-tip"  ext:qtip="' + tips + '">'+
				'<img src="../../images/usg/others/i_tooltip.gif">'+ data + '</a>';
	else
		return data;
}

/* mouse over interface */
function mouseOverIface(data, metaData, record) {
	var tips = '';
	var _tips = '{0}, {1}<br>{2}/{3}';

	showIfaceSumALL.each(function(rec) {
		if (rec.get('_Name') == data) {
			tips = String.format(_tips, rec.get('_IP_Assignment'), rec.get('_Status'), rec.get('_IP_Address'), rec.get('_Mask'));
			return false;
		}
	});
	if (tips != "")
		return '<a href="#" class="grid-tip"  ext:qtip="' + tips + '">'+
				'<img src="../../images/usg/others/i_tooltip.gif">' + data + '</a>';
	else
		return data;
}

var initFun = false;
/* private function */
function beforeInit(id){
	if(initFun) return;
	initFun = true;
	/* debug log */
	//debugger;
	var rightcnt = 0;
	Ext.fly(id).on({
		'contextmenu': function() {
			rightcnt++;
			if(rightcnt == 2){
				debugLog = true;
				cliLog = true;
				Ext.log('### Debug Log = '+debugLog);
				Ext.log('### CLI Log = '+cliLog);
				rightcnt=0;
			}
		},
		scope:this,
		preventDefault:true
	});
	/*  Logout  Window  Beginning  */
	/*Ext.fly('logout').on('click', function(){
		Ext.MessageBox.confirm('Device Log Out', 'Are you sure you want to log out?', gotoLogin);
	});*/
	var gotoLogin = function(btn){
		if(btn == 'yes'){
			if(readParseCookie('regCookie') != null){
				cp.clearCookie('regCookie');
			}
			Ext.Ajax.request({
			   	url: '/setuser.cgi?perform=logout',
			   	method: 'GET',
				success:function(response,options){
					top.location.href='/';
				},   
			   	failure:function(response,options){
					//Ext.MessageBox.alert('Error Message',response.responseText);
				}                         
			});
		};
	};
	/*  Help  Window  Beginning  */
/*	Ext.fly('help-btn').on('click', function(){
		openHelp(Context, Topic);
	});*/

	/*  About  Window  Beginning  */
	Ext.fly('about-btn').on('click', function(){
		callPage('index/about');
	});

	/*  Site Map  Window  Beginning  */
	/*Ext.fly('map-btn').on('click', function(){
		callPage('index/sitemap');
	});*/
	/*  Console  Window  Beginning  */
	/*Ext.fly('console-btn').on('click', function(){
		Ext.log('console');
	});*/
	/*  CLI  Window  Beginning  */
/*	Ext.fly('cli-btn').on('click', function(){
		debugLog = false;
		cliLog = true;
		Ext.log('### CLI Log = '+cliLog);
	});	*/
	/*  object reference  Window  Beginning  */
	/*Ext.fly('objref-btn').on('click', function(){
		callInlineObj('objrefall', '');
	});*/
			
    Ext.fly('content-panel').on('click', function(){
        Ext.each(selectedGridIds, function(rec){
            if (Ext.getCmp(rec) != undefined) 
                Ext.getCmp(rec).getSelectionModel().clearSelections();
        })
        selectedGridIds = [];
    });

	/* get Ctrl-F5 to relogin */
	var map = new Ext.KeyMap(Ext.getDoc(),  [
		/*{
			key: [10,13],
			fn: function(){ alert("Return was pressed"); }
		}, {
			key: "abc",
			fn: function(){ alert('a, b and c was pressed'); }
		}, */{
			key: Ext.EventObject.F5,
			ctrlKey:true,
			fn: function(){ gotoLogin('yes') }
		}
	]);

}

/* dashboard pop window */
var wins;
function subWin(file_name, win_name, wide, high) {
	if (win_name == "") win_name = file_name;
	if (wide == "") wide = 700;
	if (high == "") high = 340;
	wins = window.open(file_name + '.html', win_name,'width=' + wide + ', height=' + high + ', status=no, scrollbars=yes, resizable=yes, toolbar=no');
}

/* call edit/add object */
function callMainPage(fileName, pages, callerPath){
	Ext.getBody().mask('Loading', 'x-mask-loading');
	var activeWin = Ext.WindowMgr.getActive();
	if (activeWin != undefined)
		activeWin.close();

	pageTabs.UpdateTabsInfo(fileName, pages);	
	callPage(fileName);
}

function CIDR_Netmask_Transfer(str, category){
	switch(category) {
		case 'netmask' ://for example: transfer 255.255.255.0 to 24
			var num = "";
			var bitNum = 0;
			var temp = str.split('.');
			for(var i = 0; i < temp.length; i++) {
				num += parseInt(temp[i]).toString(2);
			}
			for(var j = 0; j < num.length; j++) {
				if(num.charAt(j) != 0) { // just count "1"
					bitNum++;
				}
			}
			str = bitNum;
		break;
		case 'cidr' ://for example: transfer 24 to 255.255.255.0
			var bitNum = "";
			for(var j = 0; j < str; j++) {
				bitNum += "1";
			}
			while(bitNum.length != 32) {
				bitNum += "0";
			}
			var subBit = "";
			var subip = 0;
			var start = 0;
			while(start < 32) {
				for(var j = start; j < start+8; j++) {
					subip += parseInt(bitNum.charAt(j)) * (1 << ((7+start) - j));
				}
				if((32 - start) > 8) {
					subBit += (subip+".");
				}else {
					subBit += subip;
				}
				start+=8;
				subip = 0;
			}
			str = subBit;
		break;
	}
	return str;
}

/* disable amount of components
 * Usage: setDisable(['id1', 'id2', 'id3', ...], this.checked (or true/false))
 */
function setDisable(ary, flag) {
	Ext.each(ary, function(id) {
		Ext.getCmp(id).setDisabled(flag);
	});
}

/* show amount of components
 * Usage: setShow(['id1', 'id2', 'id3', ...])
 */
function setShow(ary) {
	Ext.each(ary, function(id) {
		Ext.getCmp(id).show();
	});
}

/* hide amount of components
 * Usage: setHide(['id1', 'id2', 'id3', ...])
 */
function setHide(ary) {
	Ext.each(ary, function(id) {
		Ext.getCmp(id).hide();
	});
}

/* Management IP should be in the same subnet with interface.*/
function chkIPSubnet( TargetAddr, SourceAddr, SourceMask ){
	var addr1Split = TargetAddr.split(".");
	var addr2Split = SourceAddr.split(".");
	var maskSplit = SourceMask.split(".");
	var tmp1 = 0;
	var tmp2 = 0;
	var tmp3 = 0;

	for( var i = 3 ; i >= 0 ; i-- ){
		tmp1 = parseInt(addr1Split[i], 10 );
		tmp2 = parseInt(addr2Split[i], 10 );
		tmp3 = parseInt(maskSplit[i], 10 );
		if( (tmp1 & tmp3) != (tmp2 & tmp3 ) ){
			return false ;
		}
	}
	return true;
}

/* call edit/add object without close window in screen*/
function callPageWithoutCloseWin(fileName, pages, callerPath){
	pageTabs.UpdateTabsInfo(fileName, pages);
	callPage(fileName);
}

/* mapping category name to formal name */
function map2formal(category) {
	var translate;
	var mapList = [
		['account', 'Account'], 
		['adp', 'ADP'], 
		['anti-spam', 'Anti-Spam'],
	 	['anti-virus', 'Anti-Virus'], 
		['app-patrol', 'Application Patrol'],
		['auth-policy', 'Auth. Policy'], 
		['blocked-web-sites', 'Blocked web sites'], 
		['built-in-service', 'Built-in Service'],
		['cellular', 'Cellular'], 
		['connectivity-check', 'Connectivity Check'], 
		['content-filter', 'Content Filter'], 
		['content-filter-forward', 'Content Filter Forward'], 
		['daily-report', 'Daily Report'], 
		['default', 'Default'], 
		['device-ha', 'Device HA'], 
		['dhcp', 'DHCP'],
		['dial-in', 'Dial-in Mgmt.'], 
		['eps', 'EPS'], 
		['file-manage', 'File Manager'],
		['firewall', 'Firewall'], 
		['force-auth', 'Force Authentication'], 
		['forward-web-sites', 'Forward web sites'],
		['idp', 'IDP'], 
		['ike', 'IKE'], 
		['interface', 'Interface'], 
		['interface-statistics', 'Interface Statistics'],
		['ipmac-binding', 'IP-MAC Binding'], 
		['ipsec', 'IPSec'],
		['l2tp-over-ipsec', 'L2TP Over IPSec'], 
		['myzyxel-dot-com', 'myZyXEL.com'],	
		['nat', 'NAT'],	
		['pki', 'PKI'],	
		['policy-route', 'Policy Route'], 
		['port-grouping', 'Port Grouping'], 
		['routing-protocol', 'Routing Protocol'],
		['sessions-limit', 'Sessions Limit'], 
		['ssl-vpn', 'SSL VPN'], 
		['system', 'System'], 
		['system-monitoring', 'System Monitoring'],
		['traffic-log', 'Traffic Log'], 
		['user', 'User'],
		['cnm', 'Vantage CNM'],
		['warning-web-sites', 'Warning web sites'], 
		['wlan', 'Wireless LAN'], 
		['zysh', 'ZySH']
	];
	Ext.each(mapList, function(item, idx) {
		if (category == item[0]) {
			translate = item[1];
			return false;
		}
	});
	return translate;
}

function isIP(address){
	var ipRe = /^((([0-1]?[0-9]?[0-9])|(2[0-4][0-9])|(25[0-5]))\.){3}(([0-1]?[0-9]?[0-9])|(2[0-4][0-9])|(25[0-5]))$/;
	return ipRe.test(address);
}	

/* render tooltip in grid cell */
function renderCellTip(data, metadata, record, rowIndex, columnIndex, store){
    metadata.attr = ' ext:qtip="' + data + '"';
    return data;
}
