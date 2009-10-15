/*
 * ZyXEL Library 1.0
 * 02/16/2009
 * Copyright(c) 2008-2010, ZyXEL cop.
 * Jerry san
 * hchoe@zyxel.com.tw
 * http://www.zyxel.com
 */

/* Ext.zyTabs  */
Ext.zyTabs = function () {
	this.pages = {
		/* AAA */
		aaa : [
			{name: 'AAA', action:'',  url: 'system/aaa/aaa'},
			{name: 'TACACS+ Server Group', action:'append',  url: 'system/aaa/tacacs'},
			{name: 'RADIUS Server Group', action:'append',  url: 'system/aaa/radius'}
		],
		/* SNMP */
		snmp : [
			{name: 'General Setting', action:'',  url: 'system/snmp/general'},
			{name: 'Trap', action:'append',  url: 'system/snmp/trap'}
		],
		/* Syslog */
		syslog : [
			{name: 'Syslog Server', action:'',  url: 'system/syslog/server'},
			{name: 'Syslog Facility', action:'append',  url: 'system/syslog/facility'}
		],
		/* File Manager */
		filemanager : [
			{name: 'Configuration File', action:'',  url: 'filemanager/configfile'},
			{name: 'Firmware Package', action:'append',  url: 'filemanager/firmware'}
		],
		/* VLAN Stacking */
		vlanstacking : [
			{name: 'Tagged VLAN QinQ', action:'',  url: 'basicl2/8021q/tagged'},
			{name: 'Untagged VLAN QinQ', action:'append',  url: 'basicl2/8021q/untagged'},
			{name: 'Selective QinQ', action:'append',  url: 'basicl2/8021q/selective'}
		],
		/* Spanning Tree Protocol */
		spanning : [
			{name: 'Configuration', action:'',  url: 'basicl2/spanning/configuration'},
			{name: 'Rapid Spanning Tree Protocol', action:'append',  url: 'basicl2/spanning/rapid'},
			{name: 'Multiple Spanning Tree Protocol', action:'append',  url: 'basicl2/spanning/multiple'},
			{name: 'Multiple Rapid Spanning Tree Protocol', action:'append',  url: 'basicl2/spanning/multiplerapid'}
		]
	};
	
}
/* Ext.zyTabs constructor */
Ext.zyTabs.prototype = {
		
	init: function(tabId, whichPage) {
		var tabPtr = this.getTabsInfo(whichPage);
		for(var i=0; i<this.getCount(whichPage); i++){
			if(tabPtr[i].action == 'insert'){
				tabId.insert(i, this.newTab(i, tabPtr));
			}else if(tabPtr[i].action == 'append'){
				tabId.add(this.newTab(i, tabPtr));
			}else if(tabPtr[i].action == ''){	
				tabId.setActiveTab(i);
			}
		}
		/*		
		myTabPanel.items.each(function(item){
			myTabPanel.remove(item)
		});
		Ext.each(panel.items.items, function(childPanel) {
			panel.remove(childPanel, true);

		});
		*/
	},
	UpdateTabsInfo: function(url, pages) {
		var i;

		if ((pages.trim() != '') && (pages != undefined)) 
		{
			var tabPtr = this.getTabsInfo(pages);
					
			var action = 'insert';
			var length = tabPtr.length;
			for(var i=0; i<length; i++){
				tabPtr[i].action = action;
				if(tabPtr[i].url == url){ 
					tabPtr[i].action = '';
					action = 'append'; 
				}
			}	
		}	
	},
	getTabsInfo: function(target) {
		return this.pages[target];	
	},
	getCount: function(target){
		return this.getTabsInfo(target).length;
	},
	newTab: function(idx, tabPtr) {
		var newtab = new Ext.Panel({
			title: tabPtr[idx].name,
			autowidth: true,
			listeners: {
				'tabclick': function(activeTab, scope) {
					/* set action */
					var action = 'insert';
					var length = tabPtr.length;
					for(var j=0; j<length; j++){
						tabPtr[j].action = action;
						if(tabPtr[j].name == this.title){ 
							tabPtr[j].action = '';
							action = 'append'; 
						}
					}
					callPage(tabPtr[idx].url);
				}
			}
		});		
		return newtab;
	},
	getTabID:function(tabId, whichPage){
		var tabPtr = this.getTabsInfo(whichPage);
		for(var i=0; i<this.getCount(whichPage); i++){
			if(tabPtr[i].action == ''){
				return tabPtr[i].name;
			}
		}
	}
}
/* global tabs pointer */
var pageTabs = new Ext.zyTabs;	

