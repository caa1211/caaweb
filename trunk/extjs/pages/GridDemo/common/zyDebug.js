/*
 * Ext JS Library 2.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.debug = {};

(function(){

var cp;

function createConsole(){
	
	var logView = new Ext.debug.LogPanel();
	
	var tabs = new Ext.TabPanel({
		activeTab: 0,
		border: false,
		tabPosition: 'bottom',
		items: [{
			title: 'Response',
			layout:'border',
			items: [logView]
		}]
	});

	cp = new Ext.Panel({
		id: 'x-debug-browser',
		title: ' CLI ',
		collapsible: true,
		animCollapse: false,
		style: 'position:absolute;left:0;bottom:0;',
		height:200,
		logView: logView,
		layout: 'fit',
		tbar:[{
			id:'zy-clear-id',
			text:'Clear',
			tooltip:'Clear',
			iconCls:'remove',
			handler: function(event, toolEl, panel){
				logView.clear();
			}
		}],
		tools:[{
			id: 'close',
			handler: function(){
				cp.destroy();
				cp = null;
				Ext.EventManager.removeResizeListener(handleResize);
			}
		}],
		draggable: {
			insertProxy: true,
			onDrag : function(e){
				var pel = this.proxy.getEl();
				this.x = pel.getLeft(true);
				this.y = pel.getTop(true);
				var s = this.panel.getEl().shadow;
				if (s) {
					s.realign(this.x, this.y, pel.getWidth(), pel.getHeight());
				}
			},
			endDrag : function(e){
				this.panel.setPosition(this.x, this.y);
			}
		},
		items: tabs
		//items:[logView]
	});

	cp.render(document.body);
	
	cp.resizer = new Ext.Resizable(cp.el, {
		minHeight:50,
		handles: "all",
		pinned: true,
		transparent:true,
		resizeElement : function(){
			var box = this.proxy.getBox();
			this.proxy.hide();
			cp.setHeight(box.height);
			cp.setWidth(box.width);
			return box;
		}
	});

	function handleResize(){
		cp.setWidth(Ext.getBody().getViewSize().width);
	}

	Ext.EventManager.onWindowResize(handleResize);
	
	handleResize();
}

Ext.apply(Ext, {
	log : function(){
		if(!cp){
			createConsole();
		}
		cp.logView.log.apply(cp.logView, arguments);
	},

	logf : function(format, arg1, arg2, etc){
		Ext.log(String.format.apply(String, arguments));
	},

	dump : function(o){
		if(typeof o == 'string' || typeof o == 'number' || typeof o == 'undefined' || Ext.isDate(o)){
			Ext.log(o);
		}
		else if(!o) {
			Ext.log("null");
		}
		else if(typeof o != "object") {
			Ext.log('Unknown return type');
		}
		else if(Ext.isArray(o)) {
			Ext.log('['+o.join(',')+']');
		}
		else{
			var b = ["{\n"];
			for(var key in o){
				var to = typeof o[key];
				if(to != "function" && to != "object") {
					b.push(String.format("  {0}: {1},\n", key, o[key]));
				}
			}
			
			var s = b.join("");
			if(s.length > 3){
				s = s.substr(0, s.length-2);
			}
			Ext.log(s + "\n}");
		}
	},

	_timers : {},

	time : function(name) {
		name = name || "def";
		Ext._timers[name] = new Date().getTime();
	},

	timeEnd : function(name, printResults){
		var t = new Date().getTime();
		name = name || "def";
		var v = String.format("{0} ms", t-Ext._timers[name]);
		Ext._timers[name] = new Date().getTime();
		if(printResults !== false){
			Ext.log('Timer ' + (name == "def" ? v : name + ": " + v));
		}
		return v;
	}
});

})();

Ext.debug.LogPanel = Ext.extend(Ext.Panel, {
	autoScroll: true,
	region: 'center',
	border: false,
	style:'border-width:0 1px 0 0',

	log : function(){
		var markup = ['<div style="padding:5px !important;border-bottom:1px solid #ccc;">',
				Ext.util.Format.htmlEncode(Array.prototype.join.call(arguments, ', ')).replace(/\n/g, '<br />').replace(/\s/g, '&#160;'),
				'</div>'].join('');

		this.body.insertHtml('beforeend', markup);
		this.body.scrollTo('top', 100000);
	},

	clear : function(){
		this.body.update('');
		this.body.dom.scrollTop = 0;
	}
});
