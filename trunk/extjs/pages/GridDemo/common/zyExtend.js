/*
 * ZyXEL Library 1.0
 * 08/12/2008
 * Copyright(c) 2008-2010, ZyXEL cop.
 * Jerry san
 * hchoe@zyxel.com.tw
 * http://www.zyxel.com
 */

/* zyJsonReader inherits JsonReader, and overwrites some property */
Ext.data.zyJsonReader = function(meta, recordType){
	meta = meta || {};
	Ext.data.zyJsonReader.superclass.constructor.call(this, meta, recordType || meta.fields);
};

Ext.extend(Ext.data.zyJsonReader, Ext.data.JsonReader, {

	read : function(response){
			var js = response.responseText;
			var json = js2json(js);
			if(!json) return false;
			var o = eval("("+json+")");
			if(!o) {
				throw {message: "zyJsonReader.read: zyJson object not found"};
			}
			return this.readRecords(o);
	}
});

//Portal code
Ext.ux.Portal = Ext.extend(Ext.Panel, {
	layout: 'column',
	autoScroll:true,
	cls:'x-portal',
	defaultType: 'portalcolumn',

	initComponent : function(){
		Ext.ux.Portal.superclass.initComponent.call(this);
		this.addEvents({
			validatedrop:true,
			beforedragover:true,
			dragover:true,
			beforedrop:true,
			drop:true
		});
	},

	initEvents : function(){
		Ext.ux.Portal.superclass.initEvents.call(this);
		this.dd = new Ext.ux.Portal.DropZone(this, this.dropConfig);
	}
});

Ext.reg('portal', Ext.ux.Portal);

Ext.ux.Portal.DropZone = function(portal, cfg){
	this.portal = portal;
	Ext.dd.ScrollManager.register(portal.body);
	Ext.ux.Portal.DropZone.superclass.constructor.call(this, portal.bwrap.dom, cfg);
	portal.body.ddScrollConfig = this.ddScrollConfig;
};

Ext.extend(Ext.ux.Portal.DropZone, Ext.dd.DropTarget, {
	ddScrollConfig : {
		vthresh: 50,
		hthresh: -1,
		animate: true,
		increment: 200
	},

	createEvent : function(dd, e, data, col, c, pos){
		return {
			portal: this.portal,
			panel: data.panel,
			columnIndex: col,
			column: c,
			position: pos,
			data: data,
			source: dd,
			rawEvent: e,
			status: this.dropAllowed
		};
	},

	notifyOver : function(dd, e, data){
		var xy = e.getXY(), portal = this.portal, px = dd.proxy;

		// case column widths
		if(!this.grid){
			this.grid = this.getGrid();
		}

        // handle case scroll where scrollbars appear during drag
        var cw = portal.body.dom.clientWidth;
        if(!this.lastCW){
            this.lastCW = cw;
        }else if(this.lastCW != cw){
            this.lastCW = cw;
            portal.doLayout();
            this.grid = this.getGrid();
        }

        // determine column
        var col = 0, xs = this.grid.columnX, cmatch = false;
        for(var len = xs.length; col < len; col++){
            if(xy[0] < (xs[col].x + xs[col].w)){
                cmatch = true;
                break;
            }
        }
        // no match, fix last index
        if(!cmatch){
            col--;
        }

        // find insert position
        var p, match = false, pos = 0,
            c = portal.items.itemAt(col),
            items = c.items.items;

        for(var len = items.length; pos < len; pos++){
            p = items[pos];
            var h = p.el.getHeight();
            if(h !== 0 && (p.el.getY()+(h/2)) > xy[1]){
                match = true;
                break;
            }
        }

        var overEvent = this.createEvent(dd, e, data, col, c,
                match && p ? pos : c.items.getCount());

        if(portal.fireEvent('validatedrop', overEvent) !== false &&
           portal.fireEvent('beforedragover', overEvent) !== false){

            // make sure proxy width is fluid
            px.getProxy().setWidth('auto');

            if(p){
                px.moveProxy(p.el.dom.parentNode, match ? p.el.dom : null);
            }else{
                px.moveProxy(c.el.dom, null);
            }

            this.lastPos = {c: c, col: col, p: match && p ? pos : false};
            this.scrollPos = portal.body.getScroll();

            portal.fireEvent('dragover', overEvent);

            return overEvent.status;;
        }else{
            return overEvent.status;
        }

    },

    notifyOut : function(){
        delete this.grid;
    },

    notifyDrop : function(dd, e, data){
        delete this.grid;
        if(!this.lastPos){
            return;
        }
        var c = this.lastPos.c, col = this.lastPos.col, pos = this.lastPos.p;

        var dropEvent = this.createEvent(dd, e, data, col, c,
                pos !== false ? pos : c.items.getCount());

        if(this.portal.fireEvent('validatedrop', dropEvent) !== false &&
           this.portal.fireEvent('beforedrop', dropEvent) !== false){

            dd.proxy.getProxy().remove();
            dd.panel.el.dom.parentNode.removeChild(dd.panel.el.dom);
            if(pos !== false){
                c.insert(pos, dd.panel);
            }else{
                c.add(dd.panel);
            }
            
            c.doLayout();

            this.portal.fireEvent('drop', dropEvent);

            // scroll position is lost on drop, fix it
            var st = this.scrollPos.top;
            if(st){
                var d = this.portal.body.dom;
                setTimeout(function(){
                    d.scrollTop = st;
                }, 10);
            }

        }
        delete this.lastPos;
    },

    // internal cache of body and column coords
    getGrid : function(){
        var box = this.portal.bwrap.getBox();
        box.columnX = [];
        this.portal.items.each(function(c){
             box.columnX.push({x: c.el.getX(), w: c.el.getWidth()});
        });
        return box;
    }
});

Ext.ux.PortalColumn = Ext.extend(Ext.Container, {
    layout: 'anchor',
    autoEl: 'div',
    defaultType: 'portlet',
    cls:'x-portal-column'
});
Ext.reg('portalcolumn', Ext.ux.PortalColumn);

Ext.ux.Portlet = Ext.extend(Ext.Panel, {
    anchor: '100%',
    frame:true,
    collapsible:true,
    draggable:true,
    cls:'x-portlet'
});
Ext.reg('portlet', Ext.ux.Portlet);

/* Apply configure CLI class */
Ext.zyConfigCLI = function () {
	this.params = {
		'NO' : 'no',
		'Empty' : ''
		// you can add parameters here
	};
	this.arg = [];
	this.counter = 0;
};
/* Ext.zyConfigCLI constructor */
Ext.zyConfigCLI.prototype = {
	addCLI: function(cli) {
		this.arg[this.counter++] = cli;
	},
	append: function(target) {
	},
	insert: function(target) {
	},
	remove: function(target) {
	},
	rename: function(origName, newName) {
	},
	move: function(src, dst) {
	},
	exit: function() {
		this.addCLI('exit');
	},
	getCLIs: function() {
		return this.arg;
	},
	commit: function(nextPage) {
		if (this.counter)
			issueConfigCLI(this.arg, nextPage);
		else
			Ext.MessageBox.alert('Message','No need to apply.');
	},
	directFly: function(nextPage) {
		Ext.getBody().mask('Loading', 'x-mask-loading');
		callPage(nextPage);
	}
};

/* add event 'tabclick' into TabPanel */
Ext.TabPanel.prototype.onStripMouseDown = function(e){
	if(e.button != 0){
		return;
	}
	e.preventDefault();
	var t = this.findTargets(e);
	//close a panel without firing the event
	if(t.close){
		this.remove(t.item);
		return;
	}
	//add in a tab click event
	if(t.item !== 'undefined' && t.item != null){
		if(!t.item.addTabClick){
			t.item.addEvents({
				"tabclick":true
			})
			t.item.addTabClick=true;
		}
		//set the tab as active if it isnt
		if(t.item && t.item != this.activeTab){
			this.setActiveTab(t.item);
		}
		//firing tabclick event
		t.item.fireEvent("tabclick", this.activeTab, this);
	}
} 

/* dashboard DHCP popup window, checkbox usage */
Ext.grid.CheckColumn = function(config){
	Ext.apply(this, config);
	if(!this.id){
		this.id = Ext.id();
	}
	this.renderer = this.renderer.createDelegate(this);
};

Ext.grid.CheckColumn.prototype ={
	init : function(grid){
		this.grid = grid;
		this.grid.addEvents({
			"check":true
		});
		this.grid.on('render', function(){
			var view = this.grid.getView();
			view.mainBody.on('mousedown', this.onMouseDown, this);
		}, this);
	},

	onMouseDown : function(e, t){
		if(t.className && t.className.indexOf('x-grid3-cc-'+this.id) != -1){
			e.stopEvent();
			var index = this.grid.getView().findRowIndex(t);
			var record = this.grid.store.getAt(index);
			record.set(this.dataIndex, !record.data[this.dataIndex]);
			this.grid.fireEvent("check", record, this);//firing check event
		}
	},

	renderer : function(v, p, record){
		p.css += ' x-grid3-check-col-td'; 
		return '<div class="x-grid3-check-col'+(v?'-on':'')+' x-grid3-cc-'+this.id+'">&#160;</div>';
	}
};

colorMap = function() {
    var cl = ['00', '33', '66', '99', 'CC', 'FF'];
    var clist = [];
    for (var r = 0; r < cl.length; r++)
        for (var g = 0; g < cl.length; g++)
        for (var b = 0; b < cl.length; b++)
        clist[clist.length] = cl[r] + cl[g] + cl[b];

    var c2 = ['0', '3', '6', '9', 'C', 'F'];
    for (var a = 0; a < c2.length; a++)
        for (var b = 0; b < c2.length; b++) {
        var rgb = c2[a] + c2[b];
        clist[clist.length] = rgb + rgb + rgb;
    }
    return clist;
};

Ext.ColorPalette.prototype.colors = colorMap();

Ext.menu.ColorItem = function(config) {

    Ext.menu.ColorItem.superclass.constructor.call(this, new Ext.ColorPalette(
        Ext.applyIf({ listeners: config.colorPaletteListeners || {}, handler: config.colorPaletteHandler || Ext.emptyFn }, config)), config);
    this.palette = this.component;
    this.relayEvents(this.palette, ["select"]);
    if (this.selectHandler) {
        this.on('select', this.selectHandler, this.scope);
    }
};
Ext.extend(Ext.menu.ColorItem, Ext.menu.Adapter);
Ext.menu.ColorMenu = function(config){
    Ext.menu.ColorMenu.superclass.constructor.call(this, config);
    this.plain = true;
    var ci = new Ext.menu.ColorItem(Ext.applyIf({listeners: config.colorItemListeners||{}}, config));
    this.add(ci);
    
    this.palette = ci.palette;
    this.relayEvents(ci, ["select"]);
};
Ext.extend(Ext.menu.ColorMenu, Ext.menu.Menu);
