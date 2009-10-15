/*
 * ZyXEL Library 1.0
 * 01/20/2009
 * Copyright(c) 2008-2010, ZyXEL cop.
 * Jane Tseng
 * hchoe@zyxel.com.tw
 * http://www.zyxel.com
 */

/* defined zytextfield */
Ext.zyTextField = Ext.extend(Ext.form.TextField, {
	enableKeyEvents: true
});
Ext.reg('zytextfield', Ext.zyTextField); 

/* defined zynumberfield */
Ext.zyNumberField = Ext.extend(Ext.form.NumberField, {
	/* NOTE: it prevent dot appear in field, if you need this,(e.g. 1.5)
 	 * please enable it in your own widget. -- alex lee
 	 */
	allowDecimals: false,
	enableKeyEvents: true
});
Ext.reg('zynumberfield', Ext.zyNumberField); 

/* defined zycombo */
Ext.zyComboBox = Ext.extend(Ext.form.ComboBox, {
	mode: 'local',
	forceSelection: true,
	triggerAction: 'all',
	typeAhead: true
});
Ext.reg('zycombo', Ext.zyComboBox); 

/* defined zysuffixtextfield */
Ext.zySuffixTextField = Ext.extend(Ext.zyTextField, {
	suffix: '',
	suffixCls: 'suffixtext',
	filename:'',
	hypertext:'',
	zytabpages:'',

	afterRender: function(){
		Ext.zySuffixTextField.superclass.afterRender.call(this);
		
		if (this.suffix && this.suffix != ''){
			var temp = String.format('<a href="#" onClick="callMainPage(\'{0}\',\'{2}\')">{1}</a>', this.filename, this.hypertext, this.zytabpages);
			if ((this.hypertext.trim() != '') && (this.filename.trim() != '') && (this.suffix.indexOf(this.hypertext) != -1))
				this.suffix = this.suffix.replace(this.hypertext, temp);			
			this.el.insertSibling({tag: 'span', cls: this.suffixCls, html: this.suffix}, 'after');
		}
	}
});
Ext.reg('zysuffixtextfield', Ext.zySuffixTextField);

/* defined zysuffixnumberfield */
Ext.zySuffixNumberField = Ext.extend(Ext.zyNumberField, {
	suffix: '',
	suffixCls: 'suffixtext',
	filename:'',
	hypertext:'',
	zytabpages:'',

	afterRender: function(){
		Ext.zySuffixNumberField.superclass.afterRender.call(this);

		if (this.suffix && this.suffix != ''){
			var temp = String.format('<a href="#" onClick="callMainPage(\'{0}\',\'{2}\')">{1}</a>', this.filename, this.hypertext, this.zytabpages);
			if ((this.hypertext.trim() != '') && (this.filename.trim() != '') && (this.suffix.indexOf(this.hypertext) != -1))
				this.suffix = this.suffix.replace(this.hypertext, temp);
				
			this.el.insertSibling({tag: 'span', cls: this.suffixCls, html: this.suffix}, 'after');
		}
		
	}
});
Ext.reg('zysuffixnumberfield', Ext.zySuffixNumberField);

// when hide/show field, it also can hide/show fieldLabel
Ext.override(Ext.layout.FormLayout, {
    renderItem : function(c, position, target){
        if(c && !c.rendered && c.isFormField && c.inputType != 'hidden'){
            var args = [
                   c.id, c.fieldLabel,
                   c.labelStyle||this.labelStyle||'',
                   this.elementStyle||'',
                   typeof c.labelSeparator == 'undefined' ? this.labelSeparator : c.labelSeparator,
                   (c.itemCls||this.container.itemCls||'') + (c.hideLabel ? ' x-hide-label' : ''),
                   c.clearCls || 'x-form-clear-left' 
            ];
            if(typeof position == 'number'){
                position = target.dom.childNodes[position] || null;
            }
            if(position){
                c.formItem = this.fieldTpl.insertBefore(position, args, true);
            }else{
                c.formItem = this.fieldTpl.append(target, args, true);
            }
            c.actionMode = 'formItem';
            c.render('x-form-el-'+c.id);
        }else {
            Ext.layout.FormLayout.superclass.renderItem.apply(this, arguments);
        }
    }
});

Ext.override(Ext.form.TriggerField, {
    actionMode: 'wrap',
    onShow: Ext.form.TriggerField.superclass.onShow,
    onHide: Ext.form.TriggerField.superclass.onHide
});

/* defined zysuffixcombo */
Ext.zySuffixComboBox = Ext.extend(Ext.zyComboBox, {
	suffix: '',
	suffixCls: 'suffixcombo',
	filename:'',
	hypertext:'',
	zytabpages:'',
	
	afterRender: function(){
		Ext.zySuffixComboBox.superclass.afterRender.call(this);
		
		if (this.suffix && this.suffix != ''){
			var temp = String.format('<a href="#" onClick="callMainPage(\'{0}\',\'{2}\')">{1}</a>', this.filename, this.hypertext, this.zytabpages);
			if ((this.hypertext.trim() != '') && (this.filename.trim() != '') && (this.suffix.indexOf(this.hypertext) != -1))
				this.suffix = this.suffix.replace(this.hypertext, temp);
				
			var siblingel = Ext.get(this.el.dom.nextSibling.id);
			siblingel.insertSibling({tag: 'span', cls: this.suffixCls, html: this.suffix}, 'after');
		}
	}
});
Ext.reg('zysuffixcombo', Ext.zySuffixComboBox);

/* zyPagingSize */
Ext.namespace('Ext.ux.Jsan');
Ext.ux.Jsan.zyPageSize = function(config){
	Ext.apply(this, config);
};

Ext.extend(Ext.ux.Jsan.zyPageSize, Ext.util.Observable, {
	beforeText: 'Show',
	afterText: 'items',
	addBefore: '-',
	addAfter: null,
	variations: [20, 30, 50, 80, 100, 200],
	comboCfg: undefined,

	init: function(pagingToolbar){
		this.zyPagingToolbar = pagingToolbar;
		this.zyPagingToolbar.pageSizeCombo = this;
		this.zyPagingToolbar.setPageSize = this.setPageSize.createDelegate(this);
		this.zyPagingToolbar.on('render', this.onRender, this);
	},

	//private
	addSize:function(value) {
		if (value > 0)
			this.sizes.push([value]);
	},

	//private
	updateStore: function() {
		if (!this.staticSizes) {
			this.sizes = [];
			var v = this.variations;
			var middleValue = 0;

			for (var i = 0, len = v.length; i < len; i++) {
				this.addSize(middleValue + v[i]);
			}
			this.staticSizes = this.sizes.slice(0);
		}
		else
			this.sizes = this.staticSizes.slice(0);

		this.combo.store.loadData(this.sizes);
		this.combo.collapse();
		this.combo.setValue(this.zyPagingToolbar.pageSize);
	},

	setPageSize:function(value, forced) {
		var pt = this.zyPagingToolbar;
		this.combo.collapse();
		value = parseInt(value) || parseInt(this.combo.getValue());
		value = (value > 0) ? value:1;
		if (value == pt.pageSize) {
			return;
		}
		else if (value < pt.pageSize) {
			pt.pageSize = value;
			var ap = Math.round(pt.cursor/value)+1;
			var cursor = (ap-1)*value;
			var store = pt.store;
			if (cursor > pt.totalLength) { //alex lee
				pt.pageSize = value;
				pt.doLoad(cursor-value);
			}
			else {
				pt.cursor = cursor;
				var d = pt.getPageData();
				pt.afterTextEl.el.innerHTML = String.format(pt.afterPageText, d.pages);
				pt.field.dom.value = ap;
				pt.first.setDisabled(ap == 1);
				pt.prev.setDisabled(ap == 1);
				pt.next.setDisabled(ap == d.pages);
				pt.last.setDisabled(ap == d.pages);
				pt.updateInfo();
			}
		}
		else {
			pt.pageSize = value;
			pt.doLoad(Math.floor(pt.cursor/pt.pageSize) * pt.pageSize);
		}
		this.updateStore();
	},
	
	//private
	onRender: function(){
		this.combo = Ext.ComponentMgr.create(Ext.applyIf(this.comboCfg||{}, {
			store:new Ext.data.SimpleStore({
				fields:['pageSize'],
				data:[]
			}),
			displayField:'pageSize',
			valueField:'pageSize',
			mode:'local',
			triggerAction:'all',
			width:50,
			xtype:'combo'
		}));
		this.combo.on('select', this.setPageSize, this);
		this.updateStore();

		if (this.addBefore){
			this.zyPagingToolbar.add(this.addBefore);
		}
		if (this.beforeText){
			this.zyPagingToolbar.add(this.beforeText);
		}
		this.zyPagingToolbar.add(this.combo);
		if (this.afterText){
			this.zyPagingToolbar.add(this.afterText);
		}
		if (this.addAfter){
			this.zyPagingToolbar.add(this.addAfter);
		}
	}
});

/* defined zypaging */
Ext.zyPagingToolbar = Ext.extend(Ext.PagingToolbar, {
    initComponent : function(){
		this.addEvents('change', 'beforechange');
		Ext.zyPagingToolbar.superclass.initComponent.call(this);
		this.totalLength = 0; //alex lee
		this.cursor = 0;
		this.bind(this.store);
		/* since store here have no load event, hence bind will fail to execute onLoad.
 		 * Thus, we add doLoad here to execute onLoad directly.
 		 */
		this.doLoad(this.cursor);
    },

    updateInfo : function(){
        if(this.displayEl){
            var count = this.store.getCount();
            var msg = count == 0 ?
                this.emptyMsg :
                String.format(
                    this.displayMsg,
                    this.cursor+1, this.cursor+count, this.totalLength
                ); //alex lee
            this.displayEl.update(msg);
        }
    },

	onLoad : function(store, r, o){
		if(!this.rendered){
	//		this.totalLength = store.getCount(); //alex lee
			this.dsLoaded = [store, r, o];
			return;
		}
		this.totalLength = store.snapshot ? store.snapshot.length : store.getCount(); //alex lee
		this.cursor = o.params ? o.params[this.paramNames.start] : 0;
		this.getPageRange();// Jerry san
		var d = this.getPageData(), ap = d.activePage, ps = d.pages;
		
		this.afterTextEl.el.innerHTML = String.format(this.afterPageText, d.pages);
		this.field.dom.value = ap;
		this.first.setDisabled(ap == 1);
		this.prev.setDisabled(ap == 1);
		this.next.setDisabled(ap == ps);
		this.last.setDisabled(ap == ps);
		//this.loading.enable();//jerry san, disable loading icon	
		this.loading.hideParent = true;//jerry san, disable loading icon
		this.loading.hide();//Jerry san, disable loading icon
		this.updateInfo();
		this.fireEvent('change', this, d);
	},

    getPageData : function(){
        return {
            total : this.totalLength,
            activePage : Math.ceil((this.cursor+this.pageSize)/this.pageSize),
            pages :  this.totalLength < this.pageSize ? 1 : Math.ceil(this.totalLength/this.pageSize)
        }; //alex lee
    },
	
	// private by Jerry san
	getPageRange : function (){
		var dcnt = 0;
		var _st = this.cursor;
		var _ed = this.cursor+this.pageSize;
		this.store.filterBy(function(record, id){
			dcnt++;
			if((dcnt > _st)&&(dcnt <= _ed))
				return true;
			else
				return false;
		});
	},

	doLoad : function(start){
		/* remove var before o for RowNumberer component use, jerry san*/
		o = {}, pn = this.paramNames;
		o[pn.start] = start;
		o[pn.limit] = this.pageSize;
		if(this.fireEvent('beforechange', this, o) !== false){
			this.onLoad(this.store, this, {params:o});//Jerry san
		}
	},

    onClick : function(which){
        var store = this.store;
        switch(which){
            case "first":
                this.doLoad(0);
            break;
            case "prev":
                this.doLoad(Math.max(0, this.cursor-this.pageSize));
            break;
            case "next":
                this.doLoad(this.cursor+this.pageSize);
            break;
            case "last":
                var total = this.totalLength; //alex lee
                var extra = total % this.pageSize;
                var lastStart = extra ? (total - extra) : total-this.pageSize;
                this.doLoad(lastStart);
            break;
            case "refresh":
                this.doLoad(this.cursor);
            break;
        }
    }
});
Ext.reg('zypaging', Ext.zyPagingToolbar);

/*for handle unselect grid*/
function cancelGridClickBubble(grid){
    grid.on('click', function(e){
        e.stopPropagation();
    });
    if (grid.bbar != null && grid.bbar != '') 
        grid.bbar.on('click', function(e){
            e.stopPropagation();
        });
    if (grid.tbar != null && grid.tbar != '') 
        grid.tbar.on('click', function(e){
            e.stopPropagation();
        });
}

/* defined zygrid */
Ext.zyGridPanel = Ext.extend(Ext.grid.GridPanel,{
	ZLDSYSPARM_MAX: null,
	add: Ext.emptyFn,
	edit: Ext.emptyFn,
	rm: Ext.emptyFn,
	activate: Ext.emptyFn,
	inactivate: Ext.emptyFn,
	move: Ext.emptyFn,
	conn: Ext.emptyFn,
	disconn: Ext.emptyFn,
	exportdata: Ext.emptyFn,
	exportall: Ext.emptyFn,
	virtual: Ext.emptyFn,
	objref: Ext.emptyFn,
	params : {
		ADD: '{0}_add_',
		EDIT: '{0}_edit_',
		REMOVE: '{0}_remove_',
		ACT: '{0}_act_',
		INACT: '{0}_inact_',
		CONN: '{0}_conn_',
		DISCONN: '{0}_disconn_',
		MOVE: '{0}_move_',
		MOVETO: '{0}_moveto_',

		EXPDATA: '{0}_expdata_',
		EXPALL: '{0}_expall_',
		VIRTUAL: '{0}_virtual_',
		OBJREF: '{0}_objref_'
	},
	exception : {
		item: null,
		dataIndex: null,
		insertAfter: false,
		editable: false,
		removable: false,
		enable: false,
		disable: false,
		movable: false,
		connable: false,
		disconnable: false,
		exportable: false,
		exportableall: false,
		virtual: false,
		referential: false
	},
	drawAddIcon: true,
	drawEditIcon: true,
	drawRemoveIcon: true,
	drawActiveIcon: true,
	drawInActiveIcon: true,
	drawConnectIcon: false,
	drawDisConnectIcon: false,
	drawMoveIcon: false,
	drawExportAllIcon:false,
	drawExportIcon:false,
	drawVirtualIcon:false,
	drawObjRefIcon:false,
	// FIXME: multi-lingual --alex lee
	addbtnText: 'Add',
	editbtnText: 'Edit',
	rmbtnText: 'Remove',
	atbtnText: 'Activate',
	inatbtnText: 'Inactivate',
	conbtnText: 'Connect',
	disconbtnText: 'Disconnect',
	movebtnText: 'Move',
	exportbtnText:'Export',
	exportallbtnText:'Export All',
	virtualbtnText:'Create Virtual Interface',
	objrefbtnText:'Object References',
	displayText: 'Displaying {0} - {1} of {2}',
	//eo multi-lingual
	initComponent: function() {
		Ext.apply(this, {
			stateful: true,
			stripeRows: true,
			cls: 'innerscope',
			anchor: '-20',
			autoWidth: true,
			autoHeight: true,
			layout: 'fit',
			collapsible: true,
			enableDragDrop: true,
			selModel:
				new Ext.grid.RowSelectionModel({
					listeners: {
						rowselect: function(sm, row, rec) {
							cmp = this.grid.params;
							ADD = String.format(cmp.ADD, this.grid.id);
							EDIT = String.format(cmp.EDIT, this.grid.id);
							REMOVE = String.format(cmp.REMOVE, this.grid.id);
							ACT = String.format(cmp.ACT, this.grid.id);
							INACT = String.format(cmp.INACT, this.grid.id);
							CONN = String.format(cmp.CONN, this.grid.id);
							DISCONN = String.format(cmp.DISCONN, this.grid.id);
							MOVE = String.format(cmp.MOVE, this.grid.id);
							
							EXPDATA = String.format(cmp.EXPDATA, this.grid.id);
							VIRTUAL = String.format(cmp.VIRTUAL, this.grid.id);
							OBJREF = String.format(cmp.OBJREF, this.grid.id);
							excp = this.grid.exception;
							if(excp.item) {
								if (excp.insertAfter == undefined) excp.insertAfter = false;
								if (excp.editable == undefined) excp.editable = false;
								if (excp.removable == undefined) excp.removable = false;
								if (excp.enable == undefined) excp.enable = false;
								if (excp.disable == undefined) excp.disable = false;
								if (excp.movable == undefined) excp.movable = false;
								if (excp.connable == undefined) excp.connable = false;
								if (excp.disconnable == undefined) excp.disconnable = false;
								if (excp.exportable == undefined) excp.exportable = false;
								if (excp.exportableall == undefined) excp.exportableall = false;
								if (excp.virtual == undefined) excp.virtual = false;
								if (excp.referential == undefined) excp.referential = false;
							}	
							if (sm.getCount() > 1) {
								Ext.getCmp(ADD).disable();
								Ext.getCmp(EDIT).disable();
								Ext.getCmp(MOVE).disable();
								Ext.getCmp(VIRTUAL).disable();
								Ext.getCmp(OBJREF).disable();
								Ext.getCmp(CONN).disable();
								/* remove & enable & disable & disconnect */
								var records = sm.getSelections();
								var match1 = match2 = match3 = match4 = match5 = false;
								for (var i = 0, len = records.length; i < len; i++) {
									var recX = records[i];
									if (!excp.item) break;
									Ext.each(excp.item, function(val) {
										if (recX.get(excp.dataIndex) == val) {
											match1 = !excp.removable;
											match2 = !excp.enable;
											match3 = !excp.disable;
											match4 = !excp.disconnable;
											match5 = !excp.exportable;
											return false;
										}
									});
								}
								match1 ? Ext.getCmp(REMOVE).disable() : Ext.getCmp(REMOVE).enable();
								match2 ? Ext.getCmp(ACT).disable() : Ext.getCmp(ACT).enable();
								match3 ? Ext.getCmp(INACT).disable() : Ext.getCmp(INACT).enable();
								match4 ? Ext.getCmp(DISCONN).disable() : Ext.getCmp(DISCONN).enable();
								match5 ? Ext.getCmp(EXPDATA).disable() : Ext.getCmp(EXPDATA).enable();
							}
							else {
								var rec = sm.getSelected();
								var match1 = match2 = match3 = match4 = match5 = match6 = match7 = match8 = match9 = match10 = match11 = false;

								if (excp.item) {
									Ext.each(excp.item, function(val) {
										if (rec.get(excp.dataIndex) == val) {
											match1 = !excp.insertAfter;
											match2 = !excp.editable;
											match3 = !excp.removable;
											match4 = !excp.enable;
											match5 = !excp.disable;
											match6 = !excp.movable;
											match7 = !excp.connable;
											match8 = !excp.disconnable;
											match9 = !excp.exportable;
											match10 = !excp.virtual;
											match11 = !excp.referential;
											return false;
										}
									});
								}
								match1 ? Ext.getCmp(ADD).disable() : Ext.getCmp(ADD).enable();
								match2 ? Ext.getCmp(EDIT).disable() : Ext.getCmp(EDIT).enable();
								match3 ? Ext.getCmp(REMOVE).disable() : Ext.getCmp(REMOVE).enable();
								match4 ? Ext.getCmp(ACT).disable() : Ext.getCmp(ACT).enable();
								match5 ? Ext.getCmp(INACT).disable() : Ext.getCmp(INACT).enable();
								match6 ? Ext.getCmp(MOVE).disable() : Ext.getCmp(MOVE).enable();
								match7 ? Ext.getCmp(CONN).disable() : Ext.getCmp(CONN).enable();
								match8 ? Ext.getCmp(DISCONN).disable() : Ext.getCmp(DISCONN).enable();
								match9 ? Ext.getCmp(EXPDATA).disable() : Ext.getCmp(EXPDATA).enable();
								match10 ? Ext.getCmp(VIRTUAL).disable() : Ext.getCmp(VIRTUAL).enable();
								match11 ? Ext.getCmp(OBJREF).disable() : Ext.getCmp(OBJREF).enable();
							};
						},
						rowdeselect: function(sm, row, rec) {
							cmp = this.grid.params;
							ADD = String.format(cmp.ADD, this.grid.id);
							EDIT = String.format(cmp.EDIT, this.grid.id);
							REMOVE = String.format(cmp.REMOVE, this.grid.id);
							ACT = String.format(cmp.ACT, this.grid.id);
							INACT = String.format(cmp.INACT, this.grid.id);
							CONN = String.format(cmp.CONN, this.grid.id);
							DISCONN = String.format(cmp.DISCONN, this.grid.id);
							MOVE = String.format(cmp.MOVE, this.grid.id);
							
							EXPDATA = String.format(cmp.EXPDATA, this.grid.id);
							VIRTUAL = String.format(cmp.VIRTUAL, this.grid.id);
							OBJREF = String.format(cmp.OBJREF, this.grid.id);
							excp = this.grid.exception;
							if (sm.getCount() == 0) {
								Ext.getCmp(ADD).enable();
								Ext.getCmp(EDIT).disable();
								Ext.getCmp(REMOVE).disable();
								Ext.getCmp(ACT).disable();
								Ext.getCmp(INACT).disable();
								Ext.getCmp(MOVE).disable();
								Ext.getCmp(CONN).disable();
								Ext.getCmp(DISCONN).disable();
								
								Ext.getCmp(EXPDATA).disable();
								Ext.getCmp(VIRTUAL).disable();
								Ext.getCmp(OBJREF).disable();
							}
							else if (sm.getCount() == 1) {
								var rec = sm.getSelected();
								var match1 = match2 = match3 = match4 = match5 = match6 = match7 = match8 = match9 = match10 = match11 = false;
								if (excp.item) {
									Ext.each(excp.item, function(val) {
										if (rec.get(excp.dataIndex) == val) {
											match1 = !excp.insertAfter;
											match2 = !excp.editable;
											match3 = !excp.removable;
											match4 = !excp.enable;
											match5 = !excp.disable;
											match6 = !excp.movable;
											match7 = !excp.connable;
											match8 = !excp.disconnable;
											match9 = !excp.exportable;
											match10 = !excp.virtual;
											match11 = !excp.referential;
											return false;
										}
									});
								}
								match1 ? Ext.getCmp(ADD).disable() : Ext.getCmp(ADD).enable();
								match2 ? Ext.getCmp(EDIT).disable() : Ext.getCmp(EDIT).enable();
								match3 ? Ext.getCmp(REMOVE).disable() : Ext.getCmp(REMOVE).enable();
								match4 ? Ext.getCmp(ACT).disable() : Ext.getCmp(ACT).enable();
								match5 ? Ext.getCmp(INACT).disable() : Ext.getCmp(INACT).enable();
								match6 ? Ext.getCmp(MOVE).disable() : Ext.getCmp(MOVE).enable();
								match7 ? Ext.getCmp(CONN).disable() : Ext.getCmp(CONN).enable();
								match8 ? Ext.getCmp(DISCONN).disable() : Ext.getCmp(DISCONN).enable();
								match9 ? Ext.getCmp(EXPDATA).disable() : Ext.getCmp(EXPDATA).enable();
								match10 ? Ext.getCmp(VIRTUAL).disable() : Ext.getCmp(VIRTUAL).enable();
								match11 ? Ext.getCmp(OBJREF).disable() : Ext.getCmp(OBJREF).enable();
							}
							else if (sm.getCount() > 1) {
								Ext.getCmp(ADD).disable();
								Ext.getCmp(EDIT).disable();
								Ext.getCmp(MOVE).disable();
								Ext.getCmp(VIRTUAL).disable();
								Ext.getCmp(OBJREF).disable();
								Ext.getCmp(CONN).disable();
								/* remove & enable & disable & disconnect */
								var records = sm.getSelections();
								var match1 = match2 = match3 = match4 = match5 = false;
								for (var i = 0, len = records.length; i < len; i++) {
									var recX = records[i];
									if (!excp.item) break;
									Ext.each(excp.item, function(val) {
										if (recX.get(excp.dataIndex) == val) {
											match1 = !excp.removable;
											match2 = !excp.enable;
											match3 = !excp.disable;
											match5 = !excp.disconnable;
											match6 = !excp.exportable;
											return false;
										}
									});
								}
								match1 ? Ext.getCmp(REMOVE).disable() : Ext.getCmp(REMOVE).enable();
								match2 ? Ext.getCmp(ACT).disable() : Ext.getCmp(ACT).enable();
								match3 ? Ext.getCmp(INACT).disable() : Ext.getCmp(INACT).enable();
								match4 ? Ext.getCmp(DISCONN).disable() : Ext.getCmp(DISCONN).enable();
								match5 ? Ext.getCmp(EXPDATA).disable() : Ext.getCmp(EXPDATA).enable();
							}
						}
					}
				}),
			loadMask: true,
			view: new Ext.grid.GroupingView({
				startCollapsed:true,
				forceFit: true,
				groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
			}),
			/* bottom bar */
			bbar: new Ext.zyPagingToolbar({
				store: this.store,
				displayInfo: true,
				plugins: new Ext.ux.Jsan.zyPageSize(),
				displayMsg: this.displayText,
				listeners: {/* setting start number for RowNumber component used, Jerry san*/
					'beforechange': {fn: function(scope, data) {
						if(Ext.grid.RowNumberer){
						  	this.store.paramNames.start = scope.cursor;//setting rownumber start
						}		
					}, scope: this}
				}
			}),
			/* top bar */
			tbar:[
				{
					id: String.format(this.params.ADD, this.id),
					text: this.addbtnText,
					tooltip: 'Add a new rule',
					iconCls: 'add',
					hidden: !this.drawAddIcon,
					handler: this.onBtnClick.createDelegate(this, ["add"])
				}, 
				{
					id: String.format(this.params.EDIT, this.id),
					text: this.editbtnText,
					disabled: true,
					tooltip: 'Edit the selected rule',
					iconCls: 'edit',
					hidden: !this.drawEditIcon,
					handler: this.onBtnClick.createDelegate(this, ["edit"])
				}, 
				{
					id: String.format(this.params.REMOVE, this.id),
					text: this.rmbtnText,
					disabled: true,
					tooltip: 'Remove the selected rule',
					iconCls: 'remove',
					hidden: !this.drawRemoveIcon,
					handler: this.onBtnClick.createDelegate(this, ["remove"])
				}, 
				{
					id: String.format(this.params.ACT, this.id),
					text: this.atbtnText,
					disabled: true,
					tooltip: 'Activate the selected rule',
					iconCls: 'active',
					hidden: !this.drawActiveIcon,
					handler:this.onBtnClick.createDelegate(this, ["activate"])
				},
				{
					id: String.format(this.params.INACT, this.id),
					text: this.inatbtnText,
					disabled: true,
					tooltip: 'Inactivate the selected rule',
					iconCls: 'inactive',
					hidden: !this.drawInActiveIcon,
					handler: this.onBtnClick.createDelegate(this, ["inactivate"])
			 	},
				{
					id: String.format(this.params.CONN, this.id),
					text: this.conbtnText,
					disabled: true,
					tooltip: 'connect the selected rule',
					iconCls: 'connect',
					hidden: !this.drawConnectIcon,
					handler: this.onBtnClick.createDelegate(this, ["connect"])
			 	},
				{
					id: String.format(this.params.DISCONN, this.id),
					text: this.disconbtnText,
					disabled: true,
					tooltip: 'disconnect the selected rule',
					iconCls: 'disconnect',
					hidden: !this.drawDisConnectIcon,
					handler: this.onBtnClick.createDelegate(this, ["disconnect"])
			 	},
				{
					id: String.format(this.params.MOVE, this.id),
					text: this.movebtnText,
					disabled: true,
					tooltip: 'Move the selected rule',
					iconCls: 'ton',
					hidden: !this.drawMoveIcon,
					handler: this.onBtnClick.createDelegate(this, ["move"])
			 	},
				{
					xtype: 'numberfield',
					id: String.format(this.params.MOVETO, this.id),
					defaultAutoCreate: {tag: "input", type: "text", size: "5", autocomplete: "off"},
					cls: 'x-tbar-page-number',
					hidden: true,
					enableKeyEvents: true,
					listeners: {
						'render': {fn: function() {
							Ext.getCmp(String.format(this.params.MOVETO, this.id)).getEl().on('keydown', function(e) {
								if (e.getKey() == e.ENTER)
									this.onBtnClick('moveto');
								else if (e.getKey() == e.ESC) {
									Ext.getCmp(String.format(this.params.MOVETO, this.id)).setValue(null);
									Ext.getCmp(String.format(this.params.MOVETO, this.id)).hide();
								}
							}, this);
						}, scope: this}
					}
				},
				{
					id: String.format(this.params.EXPDATA, this.id),
					text:this.exportbtnText,
					disabled:true,
					tooltip:'Export',
					iconCls:'export',
					hidden: !this.drawExportIcon,
					handler: this.onBtnClick.createDelegate(this, ["exportdata"])
				},
				{
					id: String.format(this.params.EXPALL, this.id),
					id:'exportall'+ this.id,
					text:this.exportallbtnText,
					tooltip:'Export All',
					iconCls:'exportall',
					hidden: !this.drawExportAllIcon,
					handler: this.onBtnClick.createDelegate(this, ["exportall"])
				},
				{
					id: String.format(this.params.VIRTUAL, this.id),
					text:this.virtualbtnText,
					disabled:true,
					tooltip:'create virtual interface',
					iconCls:'addto',
					hidden: !this.drawVirtualIcon,
					handler: this.onBtnClick.createDelegate(this, ["virtual"])
				},
				{
					id: String.format(this.params.OBJREF, this.id),
					text:this.objrefbtnText,
					disabled:true,
					tooltip:'object reference',
					iconCls:'object',
					hidden: !this.drawObjRefIcon,
					handler: this.onBtnClick.createDelegate(this, ["objref"])
				}
			],
			listeners: {
				render: function() {
					this.store.load();
				}
			}
		});

		Ext.zyGridPanel.superclass.initComponent.apply(this);
	},
	listeners:{	//Joze -for handle unselect grid
		render: cancelGridClickBubble,
		click: function(){
			    if(selectedGridIds.indexOf(this.id)==-1)
					selectedGridIds.push(this.id);	//Joze
				}
	},
	onBtnClick: function(which) {
		var length = this.selModel.getCount();
		var s = this.selModel.getSelections();
		var count = this.store.snapshot ? this.store.snapshot.length : this.store.getCount();
		var match = false;
		switch(which) {
			case "add" :
			 	if (this.ZLDSYSPARM_MAX != null && count >=  this.ZLDSYSPARM_MAX)
					Ext.Msg.alert('Alert', 'Items have reached the maximum number.');
 			  	else
 			 	 	this.add();
			break;
			case "edit" :
				this.edit();
			break;
			case "remove" :
				Ext.Msg.confirm('Warning', 'Remove '+ (length > 1 ? 'these items' : 'this one'),
					function(btn) {
						if (btn == 'yes') this.rm();
					}, this);
			break;
			case "activate":
				this.activate();
			break;
			case "inactivate":
				this.inactivate();
			break;
			case "move" :
				Ext.getCmp(String.format(this.params.MOVETO, this.id)).show();
				Ext.getCmp(String.format(this.params.MOVETO, this.id)).focus();
			break;
			case "moveto" :
				var mv = Ext.getCmp(String.format(this.params.MOVETO, this.id));
				if (Ext.isEmpty(mv.getValue())) {
					Ext.MessageBox.show({
						msg: 'Please appoint rule number to move to',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR
					});
				}
				else if (mv.getValue() > count || mv.getValue() <= 0) {
					Ext.MessageBox.show({
						msg: 'The rule number appointed does not exist. Please correct it.',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR
					});
				}
				else if (mv.getValue() == count) {
					if(this.exception.item) {
						Ext.MessageBox.show({
							msg: 'The number appointed is default rule. Please correct it.',
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR
						});
					} else
						this.move(mv.getValue());
				}
				else
					this.move(mv.getValue());
			break;
			case "connect" :
				this.conn();
			break;
			case "disconnect" :
				this.disconn();
			break;
			case "exportdata" :
				this.exportdata();
			break;
			case "exportall" :
				this.exportall();
			break;
			case "virtual" :
				this.virtual();
			break;
			case "objref" :
				this.objref();
			break;
		}
	}
});
Ext.reg('zygrid', Ext.zyGridPanel);

/* defined zyexceptgrid */
Ext.zyExtraGridPanel = Ext.extend(Ext.grid.GridPanel,{
	rm: Ext.emptyFn,
	flush: Ext.emptyFn,
	update: Ext.emptyFn,
	download: Ext.emptyFn,
	upload: Ext.emptyFn,
	copy: Ext.emptyFn,
	rename: Ext.emptyFn,
	run: Ext.emptyFn,
	force: Ext.emptyFn,
	newfolder: Ext.emptyFn,
	up: Ext.emptyFn,
	moreinfo: Ext.emptyFn,
	params : {
		REMOVE: '{0}_remove_',
		FLUSH: '{0}_flush_',
		
		NEWFOLDER: '{0}_newfolder_',
		UPDATE: '{0}_update_',
		DOWNLOAD: '{0}_download_',
		UPLOAD: '{0}_upload_',
		COPY: '{0}_copy_',
		RENAME: '{0}_rename_',
		RUN: '{0}_run_',
		FORCE: '{0}_force_',
		UP: '{0}_up_',
		
		MOREINFO: '{0}_moreinfo_'
	},
	exception : {
		item: null,
		dataIndex: null,
		removable: false,
		flushable: false,
		
		updated: false,
		forceable: false,
		namable: false,
		newfolder: false,
		removable: false,
		up: false,
		upload: false,
		download: false,
		copyable: false,
		run: false,
		flush: false,
		
		moreinfo: false
	},
	drawRemoveIcon: true,
	drawFlushIcon: false,
	drawUpdateIcon:false,
	drawDownloadIcon:false,
	drawUploadIcon:false,
	drawCopyIcon:false,
	drawRenameIcon:false,
	drawRunIcon:false,
	drawForceIcon:false,
	drawNewFolderIcon:false,
	drawUpIcon:false,
	drawMoreInfoIcon:false,
	// FIXME: multi-lingual --alex lee
	rmbtnText: 'Remove',
	movebtnText: 'Move',
	flushbtnText: 'Flush',
	exportbtnText:'Export',
	exportallbtnText:'Export All',
	updatebtnText:'Update',
	downloadbtnText:'Download',
	uploadbtnText:'Upload',
	copybtnText:'Copy',
	renamebtnText:'Rename',
	runbtnText:'Run',
	forcebtnText:'Force',
	newfolderbtnText:'New Folder',
	upbtnText:'Up',
	moreinfobtnText:'More Information',
	displayText: 'Displaying {0} - {1} of {2}',
	//eo multi-lingual
	initComponent: function() {
		Ext.apply(this, {
			stateful: true,
			stripeRows: true,
			cls: 'innerscope',
			anchor: '-20',
			autoWidth: true,
			autoHeight: true,
			layout: 'fit',
			collapsible: true,
			enableDragDrop: true,
			selModel:
				new Ext.grid.RowSelectionModel({
					listeners: {
						rowselect: function(sm, row, rec) {
							cmp = this.grid.params;
							REMOVE = String.format(cmp.REMOVE, this.grid.id);
							FLUSH = String.format(cmp.FLUSH, this.grid.id);
							
							UPDATE = String.format(cmp.UPDATE, this.grid.id);
							DOWNLOAD = String.format(cmp.DOWNLOAD, this.grid.id);
							UPLOAD = String.format(cmp.UPLOAD, this.grid.id);
							COPY = String.format(cmp.COPY, this.grid.id);
							RENAME = String.format(cmp.RENAME, this.grid.id);
							RUN = String.format(cmp.RUN, this.grid.id);
							FORCE = String.format(cmp.FORCE, this.grid.id);
							UP = String.format(cmp.UP, this.grid.id);
							
							MOREINFO = String.format(cmp.MOREINFO, this.grid.id);
							excp = this.grid.exception;
							if(excp.item) {
								if (excp.removable == undefined) excp.removable = false;
								if (excp.flushable == undefined) excp.flushable = false;
								
								if (excp.updated == undefined) excp.updated = false;
								if (excp.forceable == undefined) excp.forceable = false;
								if (excp.namable == undefined) excp.namable = false;
								if (excp.newfolder == undefined) excp.newfolder = false;
								if (excp.up == undefined) excp.up = false;
								if (excp.upload == undefined) excp.upload = false;
								if (excp.download == undefined) excp.download = false;
								if (excp.copyable == undefined) excp.copyable = false;
								if (excp.run == undefined) excp.run = false;
								if (excp.flush == undefined) excp.flush = false;
								
								if (excp.moreinfo == undefined) excp.moreinfo = false;
							}	
							if (sm.getCount() > 1) {
								Ext.getCmp(MOREINFO).disable();
								Ext.getCmp(RENAME).disable();
								Ext.getCmp(DOWNLOAD).disable();
								Ext.getCmp(COPY).disable();
								Ext.getCmp(RUN).disable();
								/* remove & enable & disable & connect & disconnect */
								var records = sm.getSelections();
								var match1 = false;
								for (var i = 0, len = records.length; i < len; i++) {
									var recX = records[i];
									if (!excp.item) break;
									Ext.each(excp.item, function(val) {
										if (recX.get(excp.dataIndex) == val) {
											match1 = !excp.removable;
											return false;
										}
									});
								}
								match1 ? Ext.getCmp(REMOVE).disable() : Ext.getCmp(REMOVE).enable();
							}
							else {
								var rec = sm.getSelected();
								var match1 = match2 = match3 = match4 = match5 = match6 = match7 = match8 = false;
								if (excp.item) {
									Ext.each(excp.item, function(val) {
										if (rec.get(excp.dataIndex) == val) {
											match1 = !excp.removable;
											match2 = !excp.updated;
											match3 = !excp.forceable;
											match4 = !excp.namable;
											match5 = !excp.download;
											match6 = !excp.copyable;
											match7 = !excp.run;
											match8 = !excp.moreinfo;
											return false;
										}
									});
								}
								match1 ? Ext.getCmp(REMOVE).disable() : Ext.getCmp(REMOVE).enable();
								match2 ? Ext.getCmp(UPDATE).disable() : Ext.getCmp(UPDATE).enable();
								match3 ? Ext.getCmp(FORCE).disable() : Ext.getCmp(FORCE).enable();
								match4 ? Ext.getCmp(RENAME).disable() : Ext.getCmp(RENAME).enable();
								match5 ? Ext.getCmp(DOWNLOAD).disable() : Ext.getCmp(DOWNLOAD).enable();
								match6 ? Ext.getCmp(COPY).disable() : Ext.getCmp(COPY).enable();
								match7 ? Ext.getCmp(RUN).disable() : Ext.getCmp(RUN).enable();
								match8 ? Ext.getCmp(MOREINFO).disable() : Ext.getCmp(MOREINFO).enable();
							};
						},
						rowdeselect: function(sm, row, rec) {
							cmp = this.grid.params;
							REMOVE = String.format(cmp.REMOVE, this.grid.id);
							FLUSH = String.format(cmp.FLUSH, this.grid.id);
							
							UPDATE = String.format(cmp.UPDATE, this.grid.id);
							DOWNLOAD = String.format(cmp.DOWNLOAD, this.grid.id);
							UPLOAD = String.format(cmp.UPLOAD, this.grid.id);
							COPY = String.format(cmp.COPY, this.grid.id);
							RENAME = String.format(cmp.RENAME, this.grid.id);
							RUN = String.format(cmp.RUN, this.grid.id);
							FORCE = String.format(cmp.FORCE, this.grid.id);
							UP = String.format(cmp.UP, this.grid.id);
							MOREINFO = String.format(cmp.MOREINFO, this.grid.id);
							excp = this.grid.exception;
							if (sm.getCount() == 0) {
								Ext.getCmp(REMOVE).disable();
								
								Ext.getCmp(UPDATE).disable();
								Ext.getCmp(DOWNLOAD).disable();
								Ext.getCmp(COPY).disable();
								Ext.getCmp(RENAME).disable();
								Ext.getCmp(RUN).disable();
								Ext.getCmp(FORCE).disable();
								Ext.getCmp(MOREINFO).disable();
								}
							else if (sm.getCount() == 1) {
								var rec = sm.getSelected();
								var match1 = match2 = match3 = match4 = match5 = match6 = match7 = match8 = false;
								if (excp.item) {
									Ext.each(excp.item, function(val) {
										if (rec.get(excp.dataIndex) == val) {
											match1 = !excp.removable;
											match2 = !excp.updated;
											match3 = !excp.forceable;
											match4 = !excp.namable;
											match5 = !excp.download;
											match6 = !excp.copyable;
											match7 = !excp.run;
											match8 = !excp.moreinfo;		
											return false;
										}
									});
								}
								match1 ? Ext.getCmp(REMOVE).disable() : Ext.getCmp(REMOVE).enable();
								match2 ? Ext.getCmp(UPDATE).disable() : Ext.getCmp(UPDATE).enable();
								match3 ? Ext.getCmp(FORCE).disable() : Ext.getCmp(FORCE).enable();
								match4 ? Ext.getCmp(RENAME).disable() : Ext.getCmp(RENAME).enable();
								match5 ? Ext.getCmp(DOWNLOAD).disable() : Ext.getCmp(DOWNLOAD).enable();
								match6 ? Ext.getCmp(COPY).disable() : Ext.getCmp(COPY).enable();
								match7 ? Ext.getCmp(RUN).disable() : Ext.getCmp(RUN).enable();
								match8 ? Ext.getCmp(MOREINFO).disable() : Ext.getCmp(MOREINFO).enable();
							}
							else if (sm.getCount() > 1) {
								Ext.getCmp(MOREINFO).disable();
								Ext.getCmp(RENAME).disable();
								Ext.getCmp(DOWNLOAD).disable();
								Ext.getCmp(COPY).disable();
								Ext.getCmp(RUN).disable();
								/* remove & enable & disable & connect & disconnect */
								var records = sm.getSelections();
								var match1 = false;
								for (var i = 0, len = records.length; i < len; i++) {
									var recX = records[i];
									if (!excp.item) break;
									Ext.each(excp.item, function(val) {
										if (recX.get(excp.dataIndex) == val) {
											match1 = !excp.removable;
											return false;
										}
									});
								}
								match1 ? Ext.getCmp(REMOVE).disable() : Ext.getCmp(REMOVE).enable();
								
							}
						}
					}
				}),
			loadMask: true,
			view: new Ext.grid.GroupingView({
				startCollapsed:true,
				forceFit: true,
				groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
			}),
			/* bottom bar */
			bbar: new Ext.zyPagingToolbar({
				store: this.store,
				displayInfo: true,
				plugins: new Ext.ux.Jsan.zyPageSize(),
				displayMsg: this.displayText,
				listeners: {/* setting start number for RowNumber component used, Jerry san*/
					'beforechange': {fn: function(scope, data) {
						if(Ext.grid.RowNumberer){
						  	this.store.paramNames.start = scope.cursor;//setting rownumber start
						}		
					}, scope: this}
				}
			}),
			/* top bar */
			tbar:[
				{
					id: String.format(this.params.NEWFOLDER, this.id),
					text:this.newfolderbtnText,
					tooltip:'New Folder',
					iconCls:'newfolder',
					hidden: !this.drawNewFolderIcon,
					handler: this.onBtnClick.createDelegate(this, ["newfolder"])
				},
				{
					id: String.format(this.params.RENAME, this.id),
					text:this.renamebtnText,
					disabled:true,
					tooltip:'Rename',
					iconCls:'rename',
					hidden: !this.drawRenameIcon,
					handler: this.onBtnClick.createDelegate(this, ["rename"])
				},
				{
					id: String.format(this.params.UPLOAD, this.id),
					text:this.uploadbtnText,
					tooltip:'Upload',
					iconCls:'upload',
					hidden: !this.drawUploadIcon,
					handler: this.onBtnClick.createDelegate(this, ["upload"])
				},
				{
					id: String.format(this.params.REMOVE, this.id),
					text: this.rmbtnText,
					disabled: true,
					tooltip: 'Remove the selected rule',
					iconCls: 'remove',
					hidden: !this.drawRemoveIcon,
					handler: this.onBtnClick.createDelegate(this, ["remove"])
				}, 
				{
					id: String.format(this.params.FLUSH, this.id),
					text:this.flushbtnText,
					tooltip:'Flush',
					iconCls:'flush',
					hidden: !this.drawFlushIcon,
					handler: this.onBtnClick.createDelegate(this, ["flush"])
			 	},
				{
					id: String.format(this.params.UPDATE, this.id),
					text:this.updatebtnText,
					disabled:true,
					tooltip:'Update',
					iconCls:'update',
					hidden: !this.drawUpdateIcon,
					handler: this.onBtnClick.createDelegate(this, ["update"])
				},
				{
					id: String.format(this.params.DOWNLOAD, this.id),
					text:this.downloadbtnText,
					disabled:true,
					tooltip:'Download',
					iconCls:'download',
					hidden: !this.drawDownloadIcon,
					handler: this.onBtnClick.createDelegate(this, ["download"])
				},
				{
					id: String.format(this.params.COPY, this.id),
					text:this.copybtnText,
					disabled:true,
					tooltip:'Copy',
					iconCls:'copy',
					hidden: !this.drawCopyIcon,
					handler: this.onBtnClick.createDelegate(this, ["copy"])
				},
				{
					id: String.format(this.params.RUN, this.id),
					text:this.runbtnText,
					disabled:true,
					tooltip:'Run',
					iconCls:'run',
					hidden: !this.drawRunIcon,
					handler: this.onBtnClick.createDelegate(this, ["run"])
				},
				{
					id: String.format(this.params.FORCE, this.id),
					text:this.forcebtnText,
					disabled:true,
					tooltip:'Force',
					iconCls:'force',
					hidden: !this.drawForceIcon,
					handler: this.onBtnClick.createDelegate(this, ["force"])
				},
				{
					id: String.format(this.params.UP, this.id),
					text:this.upbtnText,
					tooltip:'up',
					iconCls:'up',
					hidden: !this.drawUpIcon,
					handler: this.onBtnClick.createDelegate(this, ["up"])
				},
				{
					id: String.format(this.params.MOREINFO, this.id),
					disabled: true,
					text:this.moreinfobtnText,
					tooltip:'more info',
					iconCls:'info',
					hidden: !this.drawMoreInfoIcon,
					handler: this.onBtnClick.createDelegate(this, ["moreinfo"])
				}
			],
			listeners: {
				render: function() {
					this.store.load();
				}
			}
		});

		Ext.zyExtraGridPanel.superclass.initComponent.apply(this);
	},
	listeners:{	//Joze -for handle unselect grid
		render: cancelGridClickBubble,
		click: function(){
			    if(selectedGridIds.indexOf(this.id)==-1)
					selectedGridIds.push(this.id);	//Joze
				}
	},
	onBtnClick: function(which) {
		var length = this.selModel.getCount();
		var s = this.selModel.getSelections();
		var match = false;
		switch(which) {
			case "remove" :
				Ext.Msg.confirm('Warning', 'Remove '+ (length > 1 ? 'these items' : 'this one'),
					function(btn) {
						if (btn == 'yes') this.rm();
					}, this);
			break;
			case "flush" :
				this.flush();
			break;
			case "update" :
				this.update();
			break;
			case "force" :
				this.force();
			break;
			case "rename" :
				this.rename();
			break;
			case "newfolder" :
				this.newfolder();
			break;
			case "up" :
				this.up();
			break;
			case "download" :
				this.download();
			break;
			case "upload" :
				this.upload();
			break;
			case "copy" :
				this.copy();
			break;
			case "run" :
				this.run();
			break;
			case "moreinfo" :
				this.moreinfo();
			break;
		}
	}
});
Ext.reg('zyextragrid', Ext.zyExtraGridPanel);

/* defined zycombocategory */
Ext.zyComboCategory = Ext.extend(Ext.form.ComboBox,{
	initComponent: function() {
		Ext.apply(this, {
			forceSelection: true,
			valueField: '_ID',
			displayField: '_Name',
			typeAhead: true,
			mode: 'local',
			triggerAction: 'all',
			emptyText: 'Please select one ...',
			tpl: new Ext.XTemplate(
				'<tpl for=".">',
				'<tpl if="values._Tag == \'Empty\'">',
				'<tpl exec="this._Tag = values._Tag"></tpl>',
				'</tpl>',
				'<tpl if="this._Tag != values._Tag">',
				'<tpl exec="this._Tag = values._Tag"></tpl>',
				'<h1 align=center>=== {_Tag} ===</h1>',
				'</tpl>',
				'<div class="x-combo-list-item">{_Name}</div>',
				'</tpl>'
			)	
		});
		Ext.zyComboCategory.superclass.initComponent.apply(this);
	}
});
Ext.reg('zycombocategory', Ext.zyComboCategory);

/* Category Suffix textfield */
Ext.zySuffixComboCategory = Ext.extend(Ext.zyComboCategory, {
	suffix: '',
	suffixCls: 'suffixcombo',
	filename:'',
	hypertext:'',
	zytabpages:'',

	afterRender: function(){
		Ext.zySuffixComboCategory.superclass.afterRender.call(this);
		if (this.suffix && this.suffix != ''){
			var temp = String.format('<a href="#" onClick="callMainPage(\'{0}\',\'{2}\')">{1}</a>', this.filename, this.hypertext, this.zytabpages);
			if ((this.hypertext.trim() != '') && (this.filename.trim() != '') && (this.suffix.indexOf(this.hypertext) != -1))
				this.suffix = this.suffix.replace(this.hypertext, temp);
		
			var siblingel = Ext.get(this.el.dom.nextSibling.id);
			siblingel.insertSibling({tag: 'span', cls: this.suffixCls, html: this.suffix}, 'after');
		}
	}
});
Ext.reg('zysuffixcombocategory', Ext.zySuffixComboCategory);

/* defined filter */
Ext.zyGridFilters = function(config){		
	this.filters = new Ext.util.MixedCollection();
	this.filters.getKey = function(o) {return o ? o.dataIndex : null};
	
	for(var i=0, len=config.filters.length; i<len; i++) {
		this.addFilter(config.filters[i]);
	}
  
	this.deferredUpdate = new Ext.util.DelayedTask(this.reload, this);
	
	delete config.filters;
	Ext.apply(this, config);
};
Ext.extend(Ext.zyGridFilters, Ext.util.Observable, {
	updateBuffer: 500,
	paramPrefix: 'filter',
	filterCls: 'ux-filtered-column',
	local: false,
	autoReload: true,
	stateId: undefined,
	showMenu: true,
	filtersText: 'Filters',

	init: function(grid) {
		if(grid instanceof Ext.grid.GridPanel) {
			this.grid  = grid;
			this.store = this.grid.getStore();
			if(this.local){
				this.store.on('load', function(store) {
					store.filterBy(this.getRecordFilter());
				}, this);
			} else {
				this.store.on('beforeload', this.onBeforeLoad, this);
			}

			this.grid.filters = this;
			this.grid.addEvents('filterupdate');

			grid.on("render", this.onRender, this);
			grid.on("beforestaterestore", this.applyState, this);
			grid.on("beforestatesave", this.saveState, this);

		} 
		else if(grid instanceof Ext.PagingToolbar) {
			this.toolbar = grid;
		}
	},

	/** private **/
	applyState: function(grid, state) {
		this.suspendStateStore = true;
		this.clearFilters();
		if(state.filters) {
			for(var key in state.filters) {
				var filter = this.filters.get(key);
				if(filter) {
					filter.setValue(state.filters[key]);
					filter.setActive(true);
				}
			}
		}

		this.deferredUpdate.cancel();
		if(this.local) {
			this.reload();
		}
		
		this.suspendStateStore = false;
	},
	
	/** private **/
	saveState: function(grid, state) {
		var filters = {};
		this.filters.each(function(filter) {
			if(filter.active) {
				filters[filter.dataIndex] = filter.getValue();
			}
		});
		return state.filters = filters;
	},
	
	/** private **/
	onRender: function() {
		var hmenu;

		if(this.showMenu) {
			hmenu = this.grid.getView().hmenu;
			
			this.sep  = hmenu.addSeparator();
			this.menu = hmenu.add(new Ext.menu.CheckItem({
				text: this.filtersText,
				menu: new Ext.menu.Menu()
			}));
			this.menu.on('checkchange', this.onCheckChange, this);
			this.menu.on('beforecheckchange', this.onBeforeCheck, this);
			
			hmenu.on('beforeshow', this.onMenu, this);
		}

		this.grid.getView().on("refresh", this.onRefresh, this);
		this.updateColumnHeadings(this.grid.getView());
	},
	
	/** private **/
	onMenu: function(filterMenu) {
		var filter = this.getMenuFilter();
		if(filter) {
			this.menu.menu = filter.menu;
			this.menu.setChecked(filter.active, false);
		}
		this.menu.setVisible(filter !== undefined);
		this.sep.setVisible(filter !== undefined);
	},
	
	/** private **/
	onCheckChange: function(item, value) {
		this.getMenuFilter().setActive(value);
	},
	
	/** private **/
	onBeforeCheck: function(check, value) {
		return !value || this.getMenuFilter().isActivatable();
	},
	
	/** private **/
	onStateChange: function(event, filter) {
		if(event == "serialize") return;

		if(filter == this.getMenuFilter()) {
			this.menu.setChecked(filter.active, false);
		}

		if(this.autoReload || this.local) {
			this.deferredUpdate.delay(this.updateBuffer);
		}
		
		var view = this.grid.getView();
		this.updateColumnHeadings(view);

		this.grid.saveState();

		this.grid.fireEvent('filterupdate', this, filter);
	},
	
	/** private **/
	onBeforeLoad: function(store, options) {
		options.params = options.params || {};
		this.cleanParams(options.params);		
		var params = this.buildQuery(this.getFilterData());
		Ext.apply(options.params, params);
	},
	
	/** private **/
	onRefresh: function(view) {
		this.updateColumnHeadings(view);
	},
	
	/** private **/
	getMenuFilter: function() {
		var view = this.grid.getView();
		if(!view || view.hdCtxIndex === undefined) return null;

		return this.filters.get(view.cm.config[view.hdCtxIndex].dataIndex);
	},
	
	/** private **/
	updateColumnHeadings: function(view) {
		if(!view || !view.mainHd) return;
		
		var hds = view.mainHd.select('td').removeClass(this.filterCls);
		for(var i=0, len=view.cm.config.length; i<len; i++) {
			var filter = this.getFilter(view.cm.config[i].dataIndex);
			if(filter && filter.active) {
				hds.item(i).addClass(this.filterCls);
			}
		}
	},
	
	/** private **/
	reload: function() {
		if(this.local) {
			this.grid.store.clearFilter(true);
			this.grid.store.filterBy(this.getRecordFilter());
		} 
		else {
			this.deferredUpdate.cancel();
			var store = this.grid.store;
			if(this.toolbar) {
				var start = this.toolbar.paramNames.start;
				if(store.lastOptions && store.lastOptions.params && store.lastOptions.params[start]) {
					store.lastOptions.params[start] = 0;
				}
			}
			store.reload();
		}
	},

	getRecordFilter: function() {
		var f = [];
		this.filters.each(function(filter) {
			if(filter.active) {
				f.push(filter);
			}
		});
		
		var len = f.length;
		return function(record) {
			for(var i = 0; i < len; i++) {
				if(!f[i].validateRecord(record)) {
					return false;
				}
			}
			return true;
		};
	},

	addFilter: function(config) {
		var filter = config.menu ? config : new (this.getFilterClass(config.type))(config);
		this.filters.add(filter);

		Ext.util.Observable.capture(filter, this.onStateChange, this);
		return filter;
	},
	
	getFilter: function(dataIndex) {
		return this.filters.get(dataIndex);
	},

	clearFilters: function() {
		this.filters.each(function(filter) {
		filter.setActive(false);
		});
	},

	/** private **/
	getFilterData: function() {
		var filters = [];
		
		this.filters.each(function(f) {
			if(f.active) {
				var d = [].concat(f.serialize());
				for(var i=0, len=d.length; i<len; i++) {
					filters.push({field: f.dataIndex, data: d[i]});
				}
			}
		});

		return filters;
	},
	
	buildQuery: function(filters) {
		var p = {};
		for(var i = 0, len = filters.length; i < len; i++) {
			var f = filters[i];
			var root = [this.paramPrefix, '[', i, ']'].join('');
			p[root + '[field]'] = f.field;
				
			var dataPrefix = root + '[data]';
			for(var key in f.data) {
				p[[dataPrefix, '[', key, ']'].join('')] = f.data[key];
			}
		}
		return p;
	},
	
	cleanParams: function(p) {
		var regex = new RegExp("^" + this.paramPrefix + "\[[0-9]+\]");
		for(var key in p) {
			if(regex.test(key)) {
				delete p[key];
			}
		}
	},
	
	getFilterClass: function(type) {
		return Ext.grid.filter[type.substr(0, 1).toUpperCase() + type.substr(1) + 'Filter'];
	}
});

// defined filter for filter
Ext.ns("Ext.grid.filter");
Ext.grid.filter.Filter = function(config){
	Ext.apply(this, config);
	this.events = {
		'activate': true,
		'deactivate': true,
		'update': true,
		'serialize': true
	};
	Ext.grid.filter.Filter.superclass.constructor.call(this);

	this.menu = new Ext.menu.Menu();
	this.init();
	
	if(config && config.value) {
		this.setValue(config.value);
		this.setActive(config.active !== false, true);
		delete config.value;
	}
};

Ext.extend(Ext.grid.filter.Filter, Ext.util.Observable, {
	active: false,
	dataIndex: null,
	menu: null,

	init: Ext.emptyFn,
	
	fireUpdate: function() {
		this.value = this.item.getValue();
		if(this.active) {
			this.fireEvent("update", this);
		}
		this.setActive(this.value.length > 0);
	},

	isActivatable: function() {
		return true;
	},

	setActive: function(active, suppressEvent) {
		if(this.active != active) {
			this.active = active;
			if(suppressEvent !== true) {
				this.fireEvent(active ? 'activate' : 'deactivate', this);
			}
		}
	},
	
	getValue: Ext.emptyFn,
	setValue: Ext.emptyFn,
	serialize: Ext.emptyFn,
	validateRecord: function(){return true;}
});

// defined editable item for filter
Ext.menu.EditableItem = Ext.extend(Ext.menu.BaseItem, {
	itemCls : "x-menu-item",
	hideOnClick: false,
		
	initComponent: function() {
		Ext.menu.EditableItem.superclass.initComponent.call(this);
		this.addEvents('keyup');
		this.editor = this.editor || new Ext.form.TextField();
		if(this.text) {
			this.editor.setValue(this.text);
		}
	},

	onRender: function(container) {
		var s = container.createChild({
			cls: this.itemCls,
			html: '<img src="' + this.icon + '" class="x-menu-item-icon" style="margin: 3px 3px 2px 2px;" />'
		});

		Ext.apply(this.config, {width: 125});
		this.editor.render(s);
		
		this.el = s;
		this.relayEvents(this.editor.el, ["keyup"]);

		if(Ext.isGecko) {
			s.setStyle('overflow', 'auto');
		}
			
		Ext.menu.EditableItem.superclass.onRender.call(this, container);
	},

	getValue: function() {
		return this.editor.getValue();
	},

	setValue: function(value) {
		this.editor.setValue(value);
	},

	isValid: function(preventMark) {
		return this.editor.isValid(preventMark);
	}
});

Ext.menu.RangeMenu = function(config){
	Ext.menu.RangeMenu.superclass.constructor.call(this, config);
  
	this.updateTask = new Ext.util.DelayedTask(this.fireUpdate, this);

	var cfg = this.fieldCfg;
	var cls = this.fieldCls;
	var fields = this.fields = Ext.applyIf(this.fields || {}, {
		'gt':new Ext.menu.EditableItem({
				icon: this.icons.gt,
				editor: new cls(typeof cfg == "object" ? cfg.gt || '' : cfg)
			}),
		'lt':new Ext.menu.EditableItem({
				icon: this.icons.lt,
				editor: new cls(typeof cfg == "object" ? cfg.lt || '' : cfg)
			}),
		'eq':new Ext.menu.EditableItem({
				icon: this.icons.eq, 
				editor: new cls(typeof cfg == "object" ? cfg.gt || '' : cfg)
			})
	});
	this.add(fields.gt, fields.lt, '-', fields.eq);
	
	for(var key in fields) {
		fields[key].on('keyup', this.onKeyUp.createDelegate(this, [fields[key]], true), this);
	}
  
	this.addEvents('update');
};

// defined range menu for filter
Ext.extend(Ext.menu.RangeMenu, Ext.menu.Menu, {
	fieldCls: Ext.form.NumberField,
	fieldCfg: '',
	updateBuffer: 500,
	icons: {
		gt: '../../images/usg/filter/greater_then.png', 
		lt: '../../images/usg/filter/less_then.png',
		eq: '../../images/usg/filter/equals.png'
	},

	fireUpdate: function() {
		this.fireEvent("update", this);
	},

	setValue: function(data) {
		for(var key in this.fields) {
			this.fields[key].setValue(data[key] !== undefined ? data[key] : '');
		}
		this.fireEvent("update", this);
	},
	
	getValue: function() {
		var result = {};
		for(var key in this.fields) {
			var field = this.fields[key];
			if(field.isValid() && String(field.getValue()).length > 0) { 
				result[key] = field.getValue();
			}
		}
		return result;
	},

	onKeyUp: function(event, input, notSure, field) {
		if(event.getKey() == event.ENTER && field.isValid()) {
			this.hide(true);
			return;
		}

		if(field == this.fields.eq) {
			this.fields.gt.setValue(null);
			this.fields.lt.setValue(null);
		} 
		else {
			this.fields.eq.setValue(null);
		}

		this.updateTask.delay(this.updateBuffer);
	}
});

// define StringFilter for filter
Ext.grid.filter.StringFilter = Ext.extend(Ext.grid.filter.Filter, {
	updateBuffer: 500,
	icon: '../../images/usg/filter/find.png',

	init: function() {
		var value = this.value = new Ext.menu.EditableItem({icon: this.icon});
		value.on('keyup', this.onKeyUp, this);
		this.menu.add(value);

		this.updateTask = new Ext.util.DelayedTask(this.fireUpdate, this);
	},

	onKeyUp: function(event) {
		if(event.getKey() == event.ENTER)
		{
			this.menu.hide(true);
			return;
		}
		this.updateTask.delay(this.updateBuffer);
	},

	isActivatable: function() {
		return this.value.getValue().length > 0;
	},
	
	fireUpdate: function() {		
		if(this.active) {
			this.fireEvent("update", this);
		}
			this.setActive(this.isActivatable());
	},

	setValue: function(value) {
		this.value.setValue(value);
		this.fireEvent("update", this);
	},

	getValue: function() {
		return this.value.getValue();
	},

	serialize: function() {
		var args = {type: 'string', value: this.getValue()};
		this.fireEvent('serialize', args, this);
		return args;
	},

	validateRecord: function(record) {
		var val = record.get(this.dataIndex);
		if(typeof val != "string") {
			return this.getValue().length == 0;
		}
		return val.toLowerCase().indexOf(this.getValue().toLowerCase()) > -1;
	}
});

// defined numbericFilter for filter
Ext.grid.filter.NumericFilter = Ext.extend(Ext.grid.filter.Filter, {
	init: function() {
		this.menu = new Ext.menu.RangeMenu();

		this.menu.on("update", this.fireUpdate, this);
	},

	fireUpdate: function() {
		this.setActive(this.isActivatable());
		this.fireEvent("update", this);
	},

	isActivatable: function() {
		var value = this.menu.getValue();
		return value.eq !== undefined || value.gt !== undefined || value.lt !== undefined;
	},

	setValue: function(value) {
		this.menu.setValue(value);
	},

	getValue: function() {
		return this.menu.getValue();
	},

	serialize: function() {
		var args = [];
		var values = this.menu.getValue();
		for(var key in values) {
			args.push({type: 'numeric', comparison: key, value: values[key]});
		}
		this.fireEvent('serialize', args, this);
		return args;
	},

	validateRecord: function(record) {
		var val = record.get(this.dataIndex),
		values = this.menu.getValue();

		if(values.eq != undefined && val != values.eq) return false;
		if(values.lt != undefined && val >= values.lt) return false;
		if(values.gt != undefined && val <= values.gt) return false;
		return true;
	}
});


// drap and drop data between 2 list
Ext.ux.zyDDView = function(config) {
	Ext.ux.zyDDView.superclass.constructor.call(this, Ext.apply(config, {
		border: false
	}));
};

// Drag and Drop DataView
Ext.extend(Ext.ux.zyDDView, Ext.DataView, {
	sortDir: 'ASC',
	isFormField: true,
	reset: Ext.emptyFn,
	clearInvalid: Ext.form.Field.prototype.clearInvalid,
	
	afterRender: function() {
		Ext.ux.zyDDView.superclass.afterRender.call(this);
		if (this.dragGroup) {
			this.setDraggable(this.dragGroup.split(","));
		}
		if (this.dropGroup) {
			this.setDroppable(this.dropGroup.split(","));
		}
		this.isDirtyFlag = false;
		this.addEvents(
			"drop"
		);
	},

	validate: function() {
		return true;
	},
	
	destroy: function() {
		this.purgeListeners();
		this.getEl().removeAllListeners();
		this.getEl().remove();
		if (this.dragZone) {
			if (this.dragZone.destroy) {
				this.dragZone.destroy();
			}
		}
		if (this.dropZone) {
			if (this.dropZone.destroy) {
				this.dropZone.destroy();
			}
		}
	},

	isDirty: function() {
		return this.isDirtyFlag;
	},

	getTargetFromEvent : function(e) {
		var target = e.getTarget();
		while ((target !== null) && (target.parentNode != this.el.dom)) {
			target = target.parentNode;
		}
		if (!target) {
			target = this.el.dom.lastChild || this.el.dom;
		}
		return target;
	},

	getDragData : function(e) {
		var target = this.findItemFromChild(e.getTarget());
		if(target) {
			if (!this.isSelected(target)) {
				delete this.ignoreNextClick;
				this.onItemClick(target, this.indexOf(target), e);
				this.ignoreNextClick = true;
			}
			var dragData = {
				sourceView: this,
				viewNodes: [],
				records: []
			};
			if (this.getSelectionCount() == 1) {
				var i = this.getSelectedIndexes()[0];
				var n = this.getNode(i);
				dragData.viewNodes.push(dragData.ddel = n);
				dragData.records.push(this.store.getAt(i));
				dragData.repairXY = Ext.fly(n).getXY();
			} else {
				dragData.ddel = document.createElement('div');
				dragData.ddel.className = 'multi-proxy';
				this.collectSelection(dragData);
			}
			return dragData;
		}
		return false;
	},
		
	getRepairXY : function(e){
		return this.dragData.repairXY;
	},

	collectSelection: function(data) {
		data.repairXY = Ext.fly(this.getSelectedNodes()[0]).getXY();
		var i = 0;
		this.store.each(function(rec){
			if (this.isSelected(i)) {
				var n = this.getNode(i);
				var dragNode = n.cloneNode(true);
				dragNode.id = Ext.id();
				data.ddel.appendChild(dragNode);
				data.records.push(this.store.getAt(i));
				data.viewNodes.push(n);
			}
			i++;
		}, this);
	},

	setDraggable: function(ddGroup) {
		if (ddGroup instanceof Array) {
			Ext.each(ddGroup, this.setDraggable, this);
			return;
		}
		if (this.dragZone) {
			this.dragZone.addToGroup(ddGroup);
		} else {
			this.dragZone = new Ext.dd.DragZone(this.getEl(), {
				containerScroll: true,
				ddGroup: ddGroup
			});
			if (!this.multiSelect) 
				this.singleSelect = true;
		/* 	Note: Mark below 3 lines to achieve no DD effect -- alex lee
			this.dragZone.getDragData = this.getDragData.createDelegate(this);
			this.dragZone.getRepairXY = this.getRepairXY;
			this.dragZone.onEndDrag = this.onEndDrag;
		*/
		}
	},
	
	setDroppable: function(ddGroup) {
		if (ddGroup instanceof Array) {
			Ext.each(ddGroup, this.setDroppable, this);
			return;
		}
		if (this.dropZone) {
			this.dropZone.addToGroup(ddGroup);
		} else {
			this.dropZone = new Ext.dd.DropZone(this.getEl(), {
				owningView: this,
				containerScroll: true,
				ddGroup: ddGroup
			});

			this.dropZone.getTargetFromEvent = this.getTargetFromEvent.createDelegate(this);
			this.dropZone.onNodeEnter = this.onNodeEnter.createDelegate(this);
			this.dropZone.onNodeOver = this.onNodeOver.createDelegate(this);
			this.dropZone.onNodeOut = this.onNodeOut.createDelegate(this);
			this.dropZone.onNodeDrop = this.onNodeDrop.createDelegate(this);
		}
	},

	getDropPoint : function(e, n, dd){
		if (n == this.el.dom) return "above";
		var t = Ext.lib.Dom.getY(n), b = t + n.offsetHeight;
		var c = t + (b - t) / 2;
		var y = Ext.lib.Event.getPageY(e);
		if(y <= c) return "above";
		else return "below";
	},
		
	isValidDropPoint: function(pt, n, data) {
		if (!data.viewNodes || (data.viewNodes.length != 1)) return true;

		var d = data.viewNodes[0];
		if (d == n) return false;
		if ((pt == "below") && (n.nextSibling == d)) return false;
		if ((pt == "above") && (n.previousSibling == d)) return false;
		return true;
	},

	onNodeEnter : function(n, dd, e, data){
		if (this.highlightColor && (data.sourceView != this)) {
			this.el.highlight(this.highlightColor);
		}
		return false;
	},

	onNodeOver : function(n, dd, e, data){
		var dragElClass = this.dropNotAllowed;
		if (data.sourceView == this && !this.dropSelf)
			return dragElClass;
		var pt = this.getDropPoint(e, n, dd);
		if (this.isValidDropPoint(pt, n, data)) {
			if (this.appendOnly)
				return "x-tree-drop-ok-below";

			if (pt) {
				var targetElClass;
				if (pt == "above"){
					dragElClass = n.previousSibling ? "x-tree-drop-ok-between" : "x-tree-drop-ok-above";
					targetElClass = "x-view-drag-insert-above";
				} else {
					dragElClass = n.nextSibling ? "x-tree-drop-ok-between" : "x-tree-drop-ok-below";
					targetElClass = "x-view-drag-insert-below";
				}
				if (this.lastInsertClass != targetElClass){
					Ext.fly(n).replaceClass(this.lastInsertClass, targetElClass);
					this.lastInsertClass = targetElClass;
				}
			}
		}
		return dragElClass;
	},

	onNodeOut : function(n, dd, e, data){
		this.removeDropIndicators(n);
	},
	
	onNodeDrop : function(n, dd, e, data){
		if (this.fireEvent("drop", this, n, dd, e, data) === false) return false;

		var pt = this.getDropPoint(e, n, dd);
		var end = (this.appendOnly || (n == this.el.dom));
		var insertAt = end ? this.store.getCount() : n.viewIndex;
		var selAry = [];
		var df = this.displayField;

		if (!end && pt == "below")
			insertAt++;

		if (data.sourceView == this) {
			if (pt == "below") {
				if (data.viewNodes[0] == n)
					data.viewNodes.shift();
			} else {
				if (data.viewNodes[data.viewNodes.length - 1] == n)
					data.viewNodes.pop();
			}

			if (!data.viewNodes.length) return false;

			if (insertAt > this.store.indexOf(data.records[0]))
				insertAt--;
		}

		if (data.node instanceof Ext.tree.TreeNode) {
			var r = data.node.getOwnerTree().recordFromNode(data.node);
			if (r)
				data.records = [ r ];
		}
		for (var i = 0, len = data.records.length; i < len; i++) {
			var r = data.records[i];
			var dup = this.store.getById(r.id);
			if (dup && (dd != this.dragZone)) {
				Ext.fly(this.getNode(this.store.indexOf(dup))).frame("red", 1);
				return true;
			}
			if (data.sourceView) {
				data.sourceView.isDirtyFlag = true;
				data.sourceView.store.remove(r);
			}

			if (this.dragGroup.substr(0, 5) == 'drop1') { // from -> to
				if (r.get('_Where') == 'to')
					r.data['_Where'] =  null;
				else if (r.get('_Where') == null)
					r.data['_Where'] =  'from';
			}
			else { // to -> from
				if (r.get('_Where') == 'from')
					r.data['_Where'] =  null;
				else if (r.get('_Where') == null)
					r.data['_Where'] =  'to';
			}
			this.store.insert(insertAt++, r);
			this.isDirtyFlag = true;
		}
		data.sourceView.refresh();
		this.refresh();
		this.store.sort(this.sortField, this.sortDir);
		this.store.each(function(rec, idx) {
			Ext.each(data.records, function(item) {
				if (rec.get(df) == item.get(df))
					selAry.push(idx);
			});
		});
		this.select(selAry);
		this.dragZone.cachedTarget = null;
		return true;
	},
	
	onEndDrag: function(data, e) {
		var d = Ext.get(this.dragData.ddel);
		if (d && d.hasClass("multi-proxy")) {
			d.remove();
		}
	},

	removeDropIndicators : function(n){
		if(n){
			Ext.fly(n).removeClass([
				"x-view-drag-insert-above",
				"x-view-drag-insert-left",
				"x-view-drag-insert-right",
				"x-view-drag-insert-below"]);
			this.lastInsertClass = "_noclass";
		}
	},

	remove: function(selectedIndices) {
		selectedIndices = [].concat(selectedIndices);
		for (var i = 0; i < selectedIndices.length; i++) {
			var rec = this.store.getAt(selectedIndices[i]);
			this.store.remove(rec);
		}
	},

	onDblClick : function(e){
		var item = this.findItemFromChild(e.getTarget());
		var dropGrp = this.dropGroup.split(',');
		if(item){
			if (this.fireEvent("dblclick", this, this.indexOf(item), item, e) === false) {
				return false;
			}
			if (this.dragGroup) {
				var targets = Ext.dd.DragDropMgr.getRelated(this.dragZone, true);

				if (targets.length > 2) {
					Ext.each(targets, function(dd, idx) {
						if (idx < 2) {
							Ext.dd.DragDropMgr.removeDDFromGroup(dd, dropGrp[0]);
							Ext.dd.DragDropMgr.removeDDFromGroup(dd, dropGrp[1]);
						} else return false;
					});
					targets = Ext.dd.DragDropMgr.getRelated(this.dragZone, true);
				}

				while (targets.indexOf(this.dropZone) !== -1) {
					targets.remove(this.dropZone);
				}

				if ((targets.length == 1) && (targets[0].owningView)) {
					this.dragZone.cachedTarget = null;
					var el = Ext.get(targets[0].getEl());
					var box = el.getBox(true);
					targets[0].onNodeDrop(el.dom, {
						target: el.dom,
						xy: [box.x, box.y + box.height - 1]
					}, null, this.getDragData(e));
				}
			}
		}
		item = null;
	},

	onItemClick : function(item, index, e){
		if (this.ignoreNextClick) {
			delete this.ignoreNextClick;
			return;
		}

		if(this.fireEvent("beforeclick", this, index, item, e) === false){
			return false;
		}
		if(this.multiSelect || this.singleSelect){
			if(this.multiSelect && e.shiftKey && this.lastSelection){
				this.select(this.getNodes(this.indexOf(this.lastSelection), index), false);
			} else if (this.isSelected(item) && e.ctrlKey) {
				this.deselect(item);
			}else{
				this.deselect(item);
				this.select(item, this.multiSelect && e.ctrlKey);
				this.lastSelection = item;
			}
			e.preventDefault();
		}
		return true;
	}
});

// defined zymultiselect
Ext.zyMultiselect = Ext.extend(Ext.form.Field,  {
	appendOnly: false,
	width: 100,
	height: 100,
	displayField: 0,
	valueField: 1,
	allowBlank: true,
	minLength: 0,
	maxLength: Number.MAX_VALUE,
	blankText: Ext.form.TextField.prototype.blankText,
	minLengthText: 'Minimum {0} item(s) required',
	maxLengthText: 'Maximum {0} item(s) allowed',
	delimiter: ',',
	allowDup: false,
	allowTrash: false,
	allowDropSelf: false,
	joinDelimiter: true,
	focusClass: undefined,
	sortDir: 'ASC',
	multiSelect: true,
	
	defaultAutoCreate : {tag: "div"},
	initValue: Ext.emptyFn,
	
	initComponent: function(){
		Ext.zyMultiselect.superclass.initComponent.call(this);
		this.addEvents(
			'dblclick',
			'click',
			'change',
			'drop'
		);
	},
	
	onRender: function(ct, position){
		Ext.zyMultiselect.superclass.onRender.call(this, ct, position);
		
		var cls = 'ux-mselect';
		var fs = new Ext.form.FieldSet({
			renderTo: this.el,
			title: this.legend,
			height: this.height,
			width: this.width-15,
			style: "padding:0;"
		});
		fs.body.addClass(cls);

		var _tpl;
		if (Ext.isIE || Ext.isIE7)
			_tpl = '" unselectable=on';
		else
			_tpl = ' x-unselectable"';

		this.view = new Ext.ux.zyDDView({
			multiSelect: this.multiSelect,
			singleSelect: !this.multiSelect,
			store: this.store,
			selectedClass: cls+"-selected",
			tpl: new Ext.XTemplate(
				'<tpl for=".">',
				'<tpl if="values._Tag == \'Empty\'">',
				'<tpl exec="this._Tag = values._Tag"></tpl>',
				'</tpl>',
				'<tpl if="this._Tag != values._Tag">',
				'<tpl exec="this._Tag = values._Tag"></tpl>',
				'<h1 align=center>===== {_Tag} =====</h1>',
				'</tpl>',
				'<div class="'+ cls +'-item'+ _tpl +'>{_Name}</div>',
				'<tpl if="xcount == xindex">',
				'<tpl exec="this._Tag = xcount"></tpl>',
				'</tpl>',
				'</tpl>'
			),
			allowDup: this.allowDup,
			allowTrash: this.allowTrash,
			dragGroup: this.dragGroup,
			dropGroup: this.dropGroup,
			dropSelf: this.allowDropSelf,
			itemSelector: "."+cls+"-item",
			isFormField: false,
			applyTo: fs.body,
			appendOnly: this.appendOnly,
			displayField: this.displayField,
			sortField: this.sortField,
			sortDir: this.sortDir
		});

		fs.add(this.view);
		
		this.view.on('click', this.onViewClick, this);
		this.view.on('beforeClick', this.onViewBeforeClick, this);
		this.view.on('dblclick', this.onViewDblClick, this);
		this.view.on('drop', function(ddView, n, dd, e, data){
			return this.fireEvent("drop", ddView, n, dd, e, data);
		}, this);
		
		this.hiddenName = this.name;
		var hiddenTag={tag: "input", type: "hidden", value: "", name:this.name};
		this.hiddenField = Ext.get(document.body).createChild(hiddenTag);
		fs.doLayout();
	},
    
	onViewClick : function(vw, index, node, e) {
		var aryIdx = this.preClickSelections.indexOf(index);
		if (aryIdx  != -1) {
			this.preClickSelections.splice(aryIdx, 1);
			this.view.clearSelections(true);
			this.view.select(this.preClickSelections);
		}
		this.fireEvent('change', this, this.getValue(), this.hiddenField.dom.value);
		this.hiddenField.dom.value = this.getValue();
		this.fireEvent('click', this, e);
		this.validate();        
	},

	onViewBeforeClick : function(vw, index, node, e) {
		this.preClickSelections = this.view.getSelectedIndexes();
		if (this.disabled) return false;
	},
	
	onViewDblClick : function(vw, index, node, e) {
		return this.fireEvent('dblclick', vw, index, node, e);
	},  
	
	getValue: function(){
		var rtnAry = [];
		var selAry = this.view.getSelectedIndexes();
		if (selAry.length == 0) return '';
		for (var i = 0, len = selAry.length; i < len; i++) {
			rtnAry.push(this.store.getAt(selAry[i]).get(this.valueField));
		}
		if (this.joinDelimiter) {//Jerry san
			return rtnAry.join(this.delimiter);
		}else{
			return rtnAry;
		}
	}
});

Ext.reg("zymultiselect", Ext.zyMultiselect);

/* defined zyitemselector */
Ext.zyItemSelector = Ext.extend(Ext.form.Field,  {
	msWidth: 200,
	msHeight: 300,
	imagePath: "../../images/usg/itemselect/",
	iconUp: "up2.gif",
	iconDown: "down2.gif",
	iconLeft: "left2.gif",
	iconRight: "right2.gif",
	fromStore: null,
	toStore: null,
	displayField: 0,
	valueField: 1,
	allowDup: false,
	delimiter: ',',
	toLegend: null,
	fromLegend: null,
	toSortField: null,
	fromSortField: null,
	toSortDir: 'ASC',
	fromSortDir: 'ASC',
	bodyStyle: null,
	border: false,
	updownEnable: false,
	defaultAutoCreate: {tag: "div"},
	initValue: Ext.emptyFn,
	
	initComponent : function(){
		Ext.zyItemSelector.superclass.initComponent.call(this);
		this.addEvents('rowdblclick', 'change');
	},

	onRender : function(ct, position){
		Ext.zyItemSelector.superclass.onRender.call(this, ct, position);

        this.fromMultiselect = new Ext.zyMultiselect({
			legend: this.fromLegend,
			delimiter: this.delimiter,
			allowDup: this.allowDup,
			allowTrash: this.allowDup,
			dragGroup: "drop2-"+this.el.dom.id,
			dropGroup: "drop2-"+this.el.dom.id+",drop1-"+this.el.dom.id,
			width: this.msWidth,
			height: this.msHeight,
			dataFields: this.dataFields,
			displayField: this.displayField,
			valueField: this.valueField,
			store: this.fromStore,
			isFormField: false,
			sortField: this.fromSortField,
			sortDir: this.fromSortDir
		});
		this.fromMultiselect.on('dblclick', this.onRowDblClick, this);

		this.toStore.on('add', this.valueChanged, this);
		this.toStore.on('remove', this.valueChanged, this);
		this.toStore.on('load', this.valueChanged, this);

		this.toMultiselect = new Ext.zyMultiselect({
			legend: this.toLegend,
			delimiter: this.delimiter,
			allowDup: this.allowDup,
			dragGroup: "drop1-"+this.el.dom.id,
			dropGroup: "drop2-"+this.el.dom.id+",drop1-"+this.el.dom.id,
			width: this.msWidth,
			height: this.msHeight,
			displayField: this.displayField,
			valueField: this.valueField,
			store: this.toStore,
			isFormField: false,
			allowDropSelf: true,
			sortField: this.toSortField,
			sortDir: this.toSortDir
		});
		this.toMultiselect.on('dblclick', this.onRowDblClick, this);
		
		var p = new Ext.Panel({
			bodyStyle: this.bodyStyle,
			border: this.border,
			layout: "table",
			layoutConfig:{columns: this.updownEnable ? 4 : 3}
		});
		/* from panel */
		p.add(this.fromMultiselect);
		/* panel to contain left/right button */
		var icons = new Ext.Panel({header: false, width: 30});
		p.add(icons);
		/* to panel */
		p.add(this.toMultiselect);
		/* panel to contain up/down button */
		if (this.updownEnable) {
			var updownicons = new Ext.Panel({header: false, width: 40});
			p.add(updownicons);
		}

		p.render(this.el);
		icons.el.down('.'+icons.bwrapCls).remove();
		if (this.updownEnable)
			updownicons.el.down('.'+updownicons.bwrapCls).remove();

	    this.iconUp = this.imagePath + this.iconUp;
        this.iconDown = this.imagePath + this.iconDown;
		this.iconLeft = this.imagePath + this.iconLeft;
		this.iconRight = this.imagePath + this.iconRight;
		/* add left/right up/down button */
		var el = icons.getEl();
		this.addIcon = el.createChild({tag:'img', src: this.iconRight, style:{cursor:'pointer', margin:'2px'}});
		el.createChild({tag: 'br'});
		this.removeIcon = el.createChild({tag:'img', src: this.iconLeft, style:{cursor:'pointer', margin:'2px'}});
		el.createChild({tag: 'br'});
		
		if (this.updownEnable) {
			var updownel = updownicons.getEl();
			this.upIcon = updownel.createChild({tag:'img', src: this.iconUp, style:{cursor:'pointer', margin:'2px'}});
			updownel.createChild({tag: 'br'});
			this.downIcon = updownel.createChild({tag:'img', src: this.iconDown, style:{cursor:'pointer', margin:'2px'}});
			updownel.createChild({tag: 'br'});
			this.upIcon.on('click', this.up, this);
			this.downIcon.on('click', this.down, this);
		}

		/* button left/right button handler function */
		this.addIcon.on('click', this.fromTo, this);
		this.removeIcon.on('click', this.toFrom, this);

		var tb = p.body.first();
		this.el.setWidth(tb.getWidth());
		p.body.removeClass();

		this.hiddenName = this.name;
		var hiddenTag = {tag: "input", type: "hidden", value: "", name:this.name};
		this.hiddenField = this.el.createChild(hiddenTag);
		this.valueChanged(this.toStore);
	},
	
	up : function() {
        var record = null;
        var selAry = this.toMultiselect.view.getSelectedIndexes();
        selAry.sort();
        var newSelAry = [];
        if (selAry.length > 0) {
            for (var i = 0; i < selAry.length; i++) {
                record = this.toMultiselect.view.store.getAt(selAry[i]);
                if ((selAry[i] - 1) >= 0) {
                    this.toMultiselect.view.store.remove(record);
                    this.toMultiselect.view.store.insert(selAry[i] - 1, record);
                    newSelAry.push(selAry[i] - 1);
                }
            }
            this.toMultiselect.view.refresh();
            this.toMultiselect.view.select(newSelAry);
        }
    },

    down : function() {
        var record = null;
        var selAry = this.toMultiselect.view.getSelectedIndexes();
        selAry.sort();
        selAry.reverse();
        var newSelAry = [];
        if (selAry.length > 0) {
            for (var i = 0; i < selAry.length; i++) {
                record = this.toMultiselect.view.store.getAt(selAry[i]);
                if ((selAry[i] + 1) < this.toMultiselect.view.store.getCount()) {
                    this.toMultiselect.view.store.remove(record);
                    this.toMultiselect.view.store.insert(selAry[i] + 1, record);
                    newSelAry.push(selAry[i] + 1);
                }
            }
            this.toMultiselect.view.refresh();
            this.toMultiselect.view.select(newSelAry);
        }
    },

	fromTo : function() {
		var df = this.displayField;
		var fv = this.fromMultiselect.view;
		var fs = this.fromMultiselect.store;
		var tv = this.toMultiselect.view;
		var ts = this.toMultiselect.store;
		var selAry = fv.getSelectedIndexes();
		var records = [];

		Ext.each(selAry, function(i) {
			records.push(fs.getAt(i));
		});
		Ext.each(records, function(rec) {
			if (rec.get('_Where') == null)
				rec.set('_Where', 'from');
			else if (rec.get('_Where') == 'to')
				rec.set('_Where', null);
			fs.remove(rec);
			ts.add(rec);
		});
		selAry = [];
		tv.refresh();
		fv.refresh();
		ts.sort(this.toSortField, this.toSortDir);
		ts.each(function(rec, idx) {
			Ext.each(records, function(item) {
				if (rec.get(df) == item.get(df))
					selAry.push(idx);
			});
		});
		tv.select(selAry);
	},

	toFrom : function() {
		var df = this.displayField;
		var fv = this.fromMultiselect.view;
		var fs = this.fromMultiselect.store;
		var tv = this.toMultiselect.view;
		var ts = this.toMultiselect.store;
		var selAry = tv.getSelectedIndexes();
		var records = [];

		Ext.each(selAry, function(i) {
			records.push(ts.getAt(i));
		});
		Ext.each(records, function(rec) {
			if (rec.get('_Where') == null)
				rec.set('_Where', 'to');
			else if (rec.get('_Where') == 'from')
				rec.set('_Where', null);
			ts.remove(rec);
			fs.add(rec);
		});
		selAry = [];
		fv.refresh();
		tv.refresh();
		fs.sort(this.fromSortField, this.fromSortDir);
		fs.each(function(rec, idx) {
			Ext.each(records, function(item) {
				if (rec.get(df) == item.get(df))
					selAry.push(idx);
			});
		});
		fv.select(selAry);
	},

	valueChanged : function(store) {
		var vf = this.valueField;
		var values = [];
		store.each(function(rec) {
			values.push(rec.get(vf));
		});
		this.hiddenField.dom.value = values.join(this.delimiter);
		this.fireEvent('change', this, this.getValue(), this.hiddenField.dom.value);
	},

	getValue : function() {
		return this.hiddenField.dom.value;
	},

	onRowDblClick : function(vw, index, node, e) {
		return this.fireEvent('rowdblclick', vw, index, node, e);
	},
		
	getFromStore : function() {
		return this.fromMultiselect.store;
	},

	getToStore : function() {
		return this.toMultiselect.store;
	},
	
	getAddItems : function() {
		var addAry = [];
		this.toMultiselect.store.each(function(rec) {
			if (rec.get('_Where') == 'from')
				addAry.push(rec);
		});
		return addAry;
	},
	
	getDelItems : function() {
		var delAry = [];
		this.fromMultiselect.store.each(function(rec) {
			if (rec.get('_Where') == 'to')
				delAry.push(rec);
		});
		return delAry;
	}
});

Ext.reg("zyitemselector", Ext.zyItemSelector);

/* defined zyeditorgrid */
Ext.zyEditorGridPanel = Ext.extend(Ext.grid.EditorGridPanel,{
	enableLocalRemove: true,//Jerry san
	enableLocalMove: true,//Jane Tseng
	ZLDSYSPARM_MAX: null,
	ZLDSYSPARM_MIN: null,
	add: Ext.emptyFn,
	rm: Ext.emptyFn,
	activate: Ext.emptyFn,
	inactivate: Ext.emptyFn,
	move: Ext.emptyFn,
	conn: Ext.emptyFn,
	disconn: Ext.emptyFn,
	menugroup: null,
	onEditComplete : function(ed, value, startValue){   
        this.editing = false;   
        this.activeEditor = null;   
        ed.un("specialkey", this.selModel.onEditorKey, this.selModel);   
        var r = ed.record;   
        var field = this.colModel.getDataIndex(ed.col);   
        value = this.postEditValue(value, startValue, r, field);   
        if(String(value) !== String(startValue)){   
            var e = {   
                grid: this,   
                record: r,   
                field: field,   
                originalValue: startValue,   
                value: value,   
                row: ed.row,   
                column: ed.col,   
               cancel:false  
            };   
            if(this.fireEvent("validateedit", e) !== false && !e.cancel){   
                r.set(field, e.value);   
                delete e.cancel;   
                this.fireEvent("afteredit", e);   
            }   
        }   
	  this.view.focusRow(ed.row); 
   }, 
	params : {
		ADD: '{0}_add_',
		EDIT: '{0}_edit_',
		REMOVE: '{0}_remove_',
		ACT: '{0}_act_',
		INACT: '{0}_inact_',
		CONN: '{0}_conn_',
		DISCONN: '{0}_disconn_',
		MOVE: '{0}_move_',
		MOVETO: '{0}_moveto_'
	},
	exception : {
		item: null,
		dataIndex: null,
		insertAfter: false,
		editable: false,
		removable: false,
		enable: false,
		disable: false,
		movable: false,
		connable: false,
		disconnable: false,
		menuable: false
	},
	drawAddIcon: true,
	drawRemoveIcon: true,
	drawActiveIcon: true,
	drawEditIcon: true,//-Joze
	drawInActiveIcon: true,
    drawConnectIcon: false,
	drawDisConnectIcon: false,
	drawMoveIcon: false,
	drawPagingToolBar: true,
	// FIXME: multi-lingual 
	addbtnText: 'Add',
	editbtnText: 'Edit',
	rmbtnText: 'Remove',
	atbtnText: 'Activate',
	inatbtnText: 'Inactivate',
	conbtnText: 'Connect',
	disconbtnText: 'Disconnect',
	movebtnText: 'Move',
	displayText: 'Displaying {0} - {1} of {2}',
	currRowIndex: 0,
	clicksToEdit: 'auto',//click the selected row to edit
	initComponent: function() {
		this.addEvents(// Jerry san
			'afteradd',
			'remove'
		);
		Ext.apply(this, {
			stateful: true,
			stripeRows: true,
			cls: 'innerscope',
			anchor: '-20',
			autoWidth: true,
			autoHeight: true,
			layout: 'fit',
			collapsible: true,
			enableDragDrop: true,
			selModel:
				new Ext.grid.RowSelectionModel({
					listeners: {
						rowselect: function(sm, row, rec) {
							this.grid.currRowIndex = row;
							cmp = this.grid.params;
							ADD = String.format(cmp.ADD, this.grid.id);
							EDIT = String.format(cmp.EDIT, this.grid.id);
							REMOVE = String.format(cmp.REMOVE, this.grid.id);
							ACT = String.format(cmp.ACT, this.grid.id);
							INACT = String.format(cmp.INACT, this.grid.id);
							CONN = String.format(cmp.CONN, this.grid.id);
							DISCONN = String.format(cmp.DISCONN, this.grid.id);
							MOVE = String.format(cmp.MOVE, this.grid.id);
							
							excp = this.grid.exception;
							if(excp.item) {
								if (excp.insertAfter == undefined) excp.insertAfter = false;
								if (excp.editable == undefined) excp.editable = false;
								if (excp.removable == undefined) excp.removable = false;
								if (excp.enable == undefined) excp.enable = false;
								if (excp.disable == undefined) excp.disable = false;
								if (excp.movable == undefined) excp.movable = false;
								if (excp.connable == undefined) excp.connable = false;
								if (excp.disconnable == undefined) excp.disconnable = false;
							}	
							if (sm.getCount() > 1) {
								Ext.getCmp(ADD).disable();
								Ext.getCmp(EDIT).disable();
								Ext.getCmp(MOVE).disable();
								Ext.getCmp(CONN).disable();
								/* remove & enable & disable & disconnect */
								var records = sm.getSelections();
								var match1 = match2 = match3 = match4 = match5 = false;
								for (var i = 0, len = records.length; i < len; i++) {
									var recX = records[i];
									if (!excp.item) break;
									Ext.each(excp.item, function(val) {
										if (recX.get(excp.dataIndex) == val) {
											match1 = !excp.removable;
											match2 = !excp.enable;
											match3 = !excp.disable;
											match4 = !excp.disconnable;
											match5 = !excp.menuable;
											return false;
										}
									});
								}
								match1 ? Ext.getCmp(REMOVE).disable() : Ext.getCmp(REMOVE).enable();
								match2 ? Ext.getCmp(ACT).disable() : Ext.getCmp(ACT).enable();
								match3 ? Ext.getCmp(INACT).disable() : Ext.getCmp(INACT).enable();
								match4 ? Ext.getCmp(DISCONN).disable() : Ext.getCmp(DISCONN).enable();
								if (this.grid.menugroup != null) {
									var len = this.grid.menugroup.length;
									for (var i = 0; i < len; i++)
										match5 ? Ext.getCmp(this.grid.menugroup[i].id).disable() : Ext.getCmp(this.grid.menugroup[i].id).enable();
								}	
							}
							else {
								var rec = sm.getSelected();
                                var match1 = match2 = match3 = match4 = match5 = match6 = match7 = match8 = match9 = false;
								if (excp.item) {
									Ext.each(excp.item, function(val) {
										if (rec.get(excp.dataIndex) == val) {
											match1 = !excp.insertAfter;
											match2 = !excp.removable;
											match3 = !excp.enable;
											match4 = !excp.disable;
											match5 = !excp.movable;
											match6 = !excp.connable;
											match7 = !excp.disconnable;
											match8 = !excp.menuable;
											match9 = !excp.editable;
											return false;
										}
									});
								}
								match1 ? Ext.getCmp(ADD).disable() : Ext.getCmp(ADD).enable();
								match2 ? Ext.getCmp(REMOVE).disable() : Ext.getCmp(REMOVE).enable();
								match3 ? Ext.getCmp(ACT).disable() : Ext.getCmp(ACT).enable();
								match4 ? Ext.getCmp(INACT).disable() : Ext.getCmp(INACT).enable();
								match5 ? Ext.getCmp(MOVE).disable() : Ext.getCmp(MOVE).enable();
								match6 ? Ext.getCmp(CONN).disable() : Ext.getCmp(CONN).enable();
								match7 ? Ext.getCmp(DISCONN).disable() : Ext.getCmp(DISCONN).enable();
								if (this.grid.menugroup != null) {
									var len = this.grid.menugroup.length;
									for (var i = 0; i < len; i++)
										match8 ? Ext.getCmp(this.grid.menugroup[i].id).disable() : Ext.getCmp(this.grid.menugroup[i].id).enable();
								}
								match9 ? Ext.getCmp(EDIT).disable() : Ext.getCmp(EDIT).enable();
							};
						},
						rowdeselect: function(sm, row, rec) {
							cmp = this.grid.params;
							ADD = String.format(cmp.ADD, this.grid.id);
							REMOVE = String.format(cmp.REMOVE, this.grid.id);
							ACT = String.format(cmp.ACT, this.grid.id);
							INACT = String.format(cmp.INACT, this.grid.id);
							CONN = String.format(cmp.CONN, this.grid.id);
							DISCONN = String.format(cmp.DISCONN, this.grid.id);
							MOVE = String.format(cmp.MOVE, this.grid.id);
							
							excp = this.grid.exception;
							if (sm.getCount() == 0) {
								Ext.getCmp(ADD).enable();
								Ext.getCmp(EDIT).disable();
								Ext.getCmp(REMOVE).disable();
								Ext.getCmp(ACT).disable();
								Ext.getCmp(INACT).disable();
								Ext.getCmp(MOVE).disable();
								Ext.getCmp(CONN).disable();
								Ext.getCmp(DISCONN).disable();
								if (this.grid.menugroup != null) {
									var len = this.grid.menugroup.length;
									for (var i = 0; i < len; i++)
										Ext.getCmp(this.grid.menugroup[i].id).disable();
								}
								
							}
							else if (sm.getCount() == 1) {
								var rec = sm.getSelected();
								var match1 = match2 = match3 = match4 = match5 = match6 = match7 = match8 = false;
								if (excp.item) {
									Ext.each(excp.item, function(val) {
										if (rec.get(excp.dataIndex) == val) {
											match1 = !excp.insertAfter;
											match2 = !excp.removable;
											match3 = !excp.enable;
											match4 = !excp.disable;
											match5 = !excp.movable;
											match6 = !excp.connable;
											match7 = !excp.disconnable;
											match8 = !excp.menuable;
											return false;
										}
									});
								}
								match1 ? Ext.getCmp(ADD).disable() : Ext.getCmp(ADD).enable();
								match2 ? Ext.getCmp(REMOVE).disable() : Ext.getCmp(REMOVE).enable();
								match3 ? Ext.getCmp(ACT).disable() : Ext.getCmp(ACT).enable();
								match4 ? Ext.getCmp(INACT).disable() : Ext.getCmp(INACT).enable();
								match5 ? Ext.getCmp(MOVE).disable() : Ext.getCmp(MOVE).enable();
								match6 ? Ext.getCmp(CONN).disable() : Ext.getCmp(CONN).enable();
								match7 ? Ext.getCmp(DISCONN).disable() : Ext.getCmp(DISCONN).enable();
								if (this.grid.menugroup != null) {
									var len = this.grid.menugroup.length;
									for (var i = 0; i < len; i++)
										match8 ? Ext.getCmp(this.grid.menugroup[i].id).disable() : Ext.getCmp(this.grid.menugroup[i].id).enable();
								}
							}
							else if (sm.getCount() > 1) {
								Ext.getCmp(ADD).disable();
								Ext.getCmp(MOVE).disable();
								Ext.getCmp(CONN).disable();
								/* remove & enable & disable & connect & disconnect */
								var records = sm.getSelections();
								var match1 = match2 = match3 = match4 = match5 = false;
								for (var i = 0, len = records.length; i < len; i++) {
									var recX = records[i];
									if (!excp.item) break;
									Ext.each(excp.item, function(val) {
										if (recX.get(excp.dataIndex) == val) {
											match1 = !excp.removable;
											match2 = !excp.enable;
											match3 = !excp.disable;
											match4 = !excp.disconnable;
											match5 = !excp.menuable;
											return false;
										}
									});
								}
								match1 ? Ext.getCmp(REMOVE).disable() : Ext.getCmp(REMOVE).enable();
								match2 ? Ext.getCmp(ACT).disable() : Ext.getCmp(ACT).enable();
								match3 ? Ext.getCmp(INACT).disable() : Ext.getCmp(INACT).enable();
								match4 ? Ext.getCmp(DISCONN).disable() : Ext.getCmp(DISCONN).enable();
								if (this.grid.menugroup != null) {
									var len = this.grid.menugroup.length;
									for (var i = 0; i < len; i++)
										match5 ? Ext.getCmp(this.grid.menugroup[i].id).disable() : Ext.getCmp(this.grid.menugroup[i].id).enable();
								}
							}
						}
					}
				}),
			loadMask: true,
			view: new Ext.grid.GroupingView({
				startCollapsed:true,
				forceFit: true,
				groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
			}),
			/* bottom bar */
			bbar: (this.drawPagingToolBar ?
				new Ext.zyPagingToolbar({
					store: this.store,
					displayInfo: true,
					plugins: new Ext.ux.Jsan.zyPageSize(),
					displayMsg: this.displayText,
					listeners: {/* setting start number for RowNumber component used, Jerry san*/
						'beforechange': {fn: function(scope, data) {
							if(Ext.grid.RowNumberer){
							  	this.store.paramNames.start = scope.cursor;//setting rownumber start
							}		
						}, scope: this}
					}
				}) : ''),
			/* top bar */
			tbar:[
				{
					id: String.format(this.params.ADD, this.id),
					text: this.addbtnText,
					tooltip: 'Add a new rule',
					iconCls: 'add',
					hidden: !this.drawAddIcon,
					handler: this.onBtnClick.createDelegate(this, ["add"])
				}, 
				{
					id: String.format(this.params.EDIT, this.id),
					text: this.editbtnText,
					disabled: true,
					tooltip: 'Edit the selected rule',
					iconCls: 'editor_edit',
					hidden: !this.drawEditIcon,
					handler: this.onBtnClick.createDelegate(this, ["edit"])
				},
				{
					id: String.format(this.params.REMOVE, this.id),
					text: this.rmbtnText,
					disabled: true,
					tooltip: 'Remove the selected rule',
					iconCls: 'remove',
					hidden: !this.drawRemoveIcon,
					handler: this.onBtnClick.createDelegate(this, ["remove"])
				}, 
				{
					id: String.format(this.params.ACT, this.id),
					text: this.atbtnText,
					disabled: true,
					tooltip: 'Activate the selected rule',
					iconCls: 'active',
					hidden: !this.drawActiveIcon,
					handler:this.onBtnClick.createDelegate(this, ["activate"])
				},
				{
					id: String.format(this.params.INACT, this.id),
					text: this.inatbtnText,
					disabled: true,
					tooltip: 'Inactivate the selected rule',
					iconCls: 'inactive',
					hidden: !this.drawInActiveIcon,
					handler: this.onBtnClick.createDelegate(this, ["inactivate"])
			 	},
				{
					id: String.format(this.params.CONN, this.id),
					text: this.conbtnText,
					disabled: true,
					tooltip: 'connect the selected rule',
					iconCls: 'connect',
					hidden: !this.drawConnectIcon,
					handler: this.onBtnClick.createDelegate(this, ["connect"])
			 	},
				{
					id: String.format(this.params.DISCONN, this.id),
					text: this.disconbtnText,
					disabled: true,
					tooltip: 'disconnect the selected rule',
					iconCls: 'disconnect',
					hidden: !this.drawDisConnectIcon,
					handler: this.onBtnClick.createDelegate(this, ["disconnect"])
			 	},
				{
					id: String.format(this.params.MOVE, this.id),
					text: this.movebtnText,
					disabled: true,
					tooltip: 'Move the selected rule',
					iconCls: 'ton',
					hidden: !this.drawMoveIcon,
					handler: this.onBtnClick.createDelegate(this, ["move"])
			 	},
				{
					xtype: 'numberfield',
					id: String.format(this.params.MOVETO, this.id),
					defaultAutoCreate: {tag: "input", type: "text", size: "5", autocomplete: "off"},
					cls: 'x-tbar-page-number',
					hidden: true,
					enableKeyEvents: true,
					listeners: {
						'render': {fn: function() {
							Ext.getCmp(String.format(this.params.MOVETO, this.id)).getEl().on('keydown', function(e) {
								if (e.getKey() == e.ENTER)
									this.onBtnClick('moveto');
								else if (e.getKey() == e.ESC) {
									Ext.getCmp(String.format(this.params.MOVETO, this.id)).setValue('');
									Ext.getCmp(String.format(this.params.MOVETO, this.id)).hide();
								}
							}, this);
						}, scope: this}
					}
				}
			],
			listeners: {
				render: function() {
					this.store.load();
				}
			}
		});

		Ext.zyEditorGridPanel.superclass.initComponent.apply(this);
	},
	onAdd: function(){
		var store = this.getStore();
		var selections = this.selModel.getSelections();
		var n = selections.length;
		var idx = 0;
		
        var EditorCols = [];
		
        for (var i = 0; i < this.getColumnModel().config.length; i++) {
            if (this.getColumnModel().config[i].editor != undefined) {
				EditorCols.push(i);
				break;
			}
        }
		
		if(store.recordType) {
			var rec = new store.recordType({});
			rec.fields.each(function(f) {
				rec.data[f.name] = f.defaultValue || null;
			});
			rec.data['__zyeditorMark'] = 'new';
		//	rec.commit();
			if (n >= 1){
				idx = this.currRowIndex+1;
			}
			store.insert(idx, rec);
			this.getView().refresh();
			//Jerry san
			this.fireEvent('afteradd', store, idx, this);
			
			//joze
            this.stopEditing();
			while(EditorCols.length>0)
			{
				this.startEditing(idx, EditorCols.pop());
			}
			//Select the new added row
			this.selModel.selectRow(idx); 
			
			return rec;
		}
		return false;
	},
    onEdit: function(){
        var selections = this.selModel.getSelections();
        var EditorCols = [];
        var idx = this.currRowIndex;
        for (var i = 0; i < this.getColumnModel().config.length; i++) {
            if (this.getColumnModel().config[i].editor != undefined) {
                EditorCols.push(i);
                break;
            }
        }
        while (EditorCols.length > 0) {
            this.startEditing(idx, EditorCols.pop());
        }
        
      //  this.selModel.selectRow(idx);
    },
	onRm:function(records) {
		var store = this.getStore();
		var selections = this.selModel.getSelections(); 
		var n = selections.length;
		for(var i = 0; i < n; i++){
			if (typeof selections[i].get('__zyeditorMark') == 'undefined') {
				selections[i].dirty = false;
				store.afterEdit(selections[i]);
			} 
			store.remove(selections[i]);
		}
		this.getView().refresh();
		
		Ext.getCmp(String.format(this.params.MOVETO, this.id)).setValue(null);
		Ext.getCmp(String.format(this.params.MOVETO, this.id)).hide();
		
		Ext.getCmp(String.format(this.params.ADD, this.id)).enable();
		Ext.getCmp(String.format(this.params.REMOVE, this.id)).disable();
		Ext.getCmp(String.format(this.params.ACT, this.id)).disable();
		Ext.getCmp(String.format(this.params.INACT, this.id)).disable();
		Ext.getCmp(String.format(this.params.MOVE, this.id)).disable();
		Ext.getCmp(String.format(this.params.CONN, this.id)).disable();
		Ext.getCmp(String.format(this.params.DISCONN, this.id)).disable();
		if (this.menugroup != null) {
			var len = this.menugroup.length;
			for (var i = 0; i < len; i++)
				Ext.getCmp(this.menugroup[i].id).disable();
		}
	},
	onMove:function(moveIndex) {
		var store = this.getStore();
		var select = this.selModel.getSelected();//Only one choice is valid. 
		
		store.remove(select);
		store.insert(moveIndex-1, select);
		this.getView().refresh();
		
		Ext.getCmp(String.format(this.params.MOVETO, this.id)).setValue(null);
		Ext.getCmp(String.format(this.params.MOVETO, this.id)).hide();
		Ext.getCmp(String.format(this.params.MOVE, this.id)).disable();

	},
	onRender:function(){
	   Ext.zyEditorGridPanel.superclass.onRender.apply(this, arguments);
				
		if (this.menugroup != null) { 
			var tb = this.getTopToolbar();
			var len = this.menugroup.length;

			//if user didn't config menu's id, set default id for each menu
			for (var i=0;i<len;i++) {	
				if (this.menugroup[i].id == undefined)
					this.menugroup[i].id = String.format('{0}_menu_{1}', this.id, i);//set default id for hide/show menu
			}	
			tb.add(this.menugroup);
			for (var i=0;i<len;i++)
				Ext.getCmp(this.menugroup[i].id).disable();
		}	
	}, 
	getAddRecords: function() {
		var add = [];
		var store = this.getStore();
		var m = store.getModifiedRecords();
		Ext.each(m, function(r) {
			if (r.get('__zyeditorMark') == 'new')
				add.push(r);
		});
		return add;
	},
	getRemoveRecords: function() {
		var remove = [];
		var store = this.getStore();
		var m = store.getModifiedRecords();
		Ext.each(m, function(r) {
			if (r.get('__zyeditorMark') == undefined && !r.dirty)
				remove.push(r);
		});
		return remove;
	},
	getModifiedRecords: function() {
		var modified = [];
		var store = this.getStore();
		var m = store.getModifiedRecords();
		Ext.each(m, function(r) {
			if (r.get('__zyeditorMark') == undefined && r.dirty)
				modified.push(r);
		});
		return modified;
	},
	onBtnClick: function(which) {
		var length = this.selModel.getCount();
		var s = this.selModel.getSelections();
		var count = this.store.snapshot ? this.store.snapshot.length : this.store.getCount();
		var match = false;
		switch(which) {
			case "add" :
			 	if (this.ZLDSYSPARM_MAX != null && count >= this.ZLDSYSPARM_MAX) 
					Ext.Msg.alert('Alert', 'Items have reached the maximum number.');
				else {
					this.onAdd();
				}
				 
			break;
			
			case "edit" :
			 	if (this.ZLDSYSPARM_MAX != null && count >= this.ZLDSYSPARM_MAX) 
					Ext.Msg.alert('Alert', 'Items have reached the maximum number.');
				else {
                    this.onEdit();
				}
			break;
			
			case "remove" :
				if (this.ZLDSYSPARM_MIN != null && count - length < this.ZLDSYSPARM_MIN){
					Ext.Msg.alert('Alert', 'The minimum item number is ' + this.ZLDSYSPARM_MIN + '.');
				}else{
					Ext.Msg.confirm('Warning', 'Remove '+ (length > 1 ? 'these items' : 'this one'),
					function(btn) {
						if (btn == 'yes'){
							// Jerry san
							if (this.enableLocalRemove) this.onRm();
							this.rm();
							//Jerry san
							this.fireEvent('remove', this);
						}
					}, this);
				}
			break;
			case "activate":
				this.activate();
			break;
			case "inactivate":
				this.inactivate();
			break;
			case "move" :
				Ext.getCmp(String.format(this.params.MOVETO, this.id)).show();
				Ext.getCmp(String.format(this.params.MOVETO, this.id)).focus();
			break;
			case "moveto" :
				var mv = Ext.getCmp(String.format(this.params.MOVETO, this.id));
				if (Ext.isEmpty(mv.getValue())) {
					Ext.MessageBox.show({
						msg: 'Please appoint rule number to move to',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR
					});
				}
				else if (mv.getValue() > count || mv.getValue() <= 0) {
					Ext.MessageBox.show({
						msg: 'The rule number appointed does not exist. Please correct it.',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR
					});
				}
				else if (mv.getValue() == count) {
					if(this.exception.item) {
						Ext.MessageBox.show({
							msg: 'The number appointed is default rule. Please correct it.',
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR
						});
					} else {
						if (this.enableLocalMove) this.onMove(mv.getValue());
						this.move(mv.getValue());
					}	
				}
				else{
					if (this.enableLocalMove) this.onMove(mv.getValue());
					this.move(mv.getValue());
				}	
			break;
			case "connect" :
				this.conn();
			break;
			case "disconnect" :
				this.disconn();
			break;
	
		}
	}
	,
		listeners:{	//Joze -for handle unselect grid Editor Grid
		render: cancelGridClickBubble,
		click: function(){
			    if(selectedGridIds.indexOf(this.id)==-1)
					selectedGridIds.push(this.id);	//Joze
				},
		rowclick: function(){
			this.stopEditing(); 
			}
	}
});
Ext.reg('zyeditorgrid', Ext.zyEditorGridPanel);

/* defined zyuploadfield*/
Ext.zyFileUploadField = Ext.extend(Ext.form.TextField,  {
    
    buttonText: 'Browse...',//FIXME: multi-lingual   
    buttonOnly: false,    
    buttonOffset: 3,
   
    // private
    readOnly: true,
    
    /**
     * @hide 
     * @method autoSize
     */
    autoSize: Ext.emptyFn,
    
    // private
    initComponent: function(){
        Ext.zyFileUploadField.superclass.initComponent.call(this);
        
        this.addEvents(
            /**
             * @event fileselected
             * Fires when the underlying file input field's value has changed from the user
             * selecting a new file from the system file selection dialog.
             * @param {Ext.form.FileUploadField} this
             * @param {String} value The file value returned by the underlying file input field
             */
            'fileselected'
        );
    },
    
    // private
    onRender : function(ct, position){
		Ext.zyFileUploadField.superclass.onRender.call(this, ct, position);
        
        this.wrap = this.el.wrap({cls:'x-form-field-wrap x-form-file-wrap'});
        this.el.addClass('x-form-file-text');
        this.el.dom.removeAttribute('name');
        
        this.fileInput = this.wrap.createChild({
            id: this.getFileInputId(),
            name: this.name||this.getId(),
            cls: 'x-form-file',
            tag: 'input', 
            type: 'file',
            size: 1
        });
        
        var btnCfg = Ext.applyIf(this.buttonCfg || {}, {
            text: this.buttonText
        });
        this.button = new Ext.Button(Ext.apply(btnCfg, {
            renderTo: this.wrap,
            cls: 'x-form-file-btn' + (btnCfg.iconCls ? ' x-btn-icon' : '')
        }));
        
        if(this.buttonOnly){
            this.el.hide();
            this.wrap.setWidth(this.button.getEl().getWidth());
        }
        
        this.fileInput.on('change', function(){
            var v = this.fileInput.dom.value;
            this.setValue(v);
            this.fireEvent('fileselected', this, v);
        }, this);
    },
    
    // private
    getFileInputId: function(){
        return this.id+'-file';
    },
    
    // private
    onResize : function(w, h){
		Ext.zyFileUploadField.superclass.onResize.call(this, w, h);
        
        this.wrap.setWidth(w);
        
        if(!this.buttonOnly){
            var w = this.wrap.getWidth() - this.button.getEl().getWidth() - this.buttonOffset;
            this.el.setWidth(w);
        }
    },
    
    // private
    preFocus : Ext.emptyFn,
    
    // private
    getResizeEl : function(){
        return this.wrap;
    },

    // private
    getPositionEl : function(){
        return this.wrap;
    },

    // private
    alignErrorIcon : function(){
        this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
    }
    
});
Ext.reg('zyuploadfield', Ext.zyFileUploadField);

/* defined zyhyperbox */
Ext.zyHyperBox = Ext.extend(Ext.BoxComponent,{
	hyperlink:true,
	html:'',
	qtip:'',
	target: '',
	url:'',
	initComponent: function() {
		Ext.apply(this, {
			isFormField:true,
			anchor: '',
			autoEl: {
				tag: 'div',
				children: [{
					tag: this.hyperlink ? 'a' : '',
					qtip: this.qtip,
					href: this.url,
					html: this.html,
					target: this.hyperlink ? this.target : ''
				}]
			}
		});
		Ext.zyHyperBox.superclass.initComponent.apply(this);
	}
});
Ext.reg('zyhyperbox', Ext.zyHyperBox);

/* zyformspacer */
Ext.zyFormSpacer = Ext.extend(Ext.BoxComponent, {
    defaultSize: 20,
    initComponent: function(){
        Ext.apply(this, {
            autoEl: {tag: 'div', style: 'padding-bottom: ' + (this.defaultSize) + 'px;'}
        });
        Ext.zyFormSpacer.superclass.initComponent.call(this);
    }
});

Ext.reg('zyformspacer', Ext.zyFormSpacer);

/* defined zytabpanel' */
Ext.zyTabPanel = Ext.extend(Ext.TabPanel, {
	plain: true,
	activeItem: 0,
	listeners: {
		render: function() {
			Ext.getBody().unmask();
		},
		beforetabchange: function(tp, newTab, currentTab) {
			if ((currentTab != undefined) && (newTab.id != currentTab.id) )
			{
				Ext.getBody().mask('Loading..', 'x-mask-loading');	
				return false;
			}
		}
	},

	initComponent: function() {
		Ext.apply(this, {
			layoutOnTabChange: true,
			defaults:{layout:'fit'}
		});
		Ext.zyTabPanel.superclass.initComponent.apply(this);
	}
});
Ext.reg('zytabpanel', Ext.zyTabPanel); 

/* defined zywindow*/
Ext.zyWindow = Ext.extend(Ext.Window, {
	modal: true,
	help: Ext.emptyFn,
	ok: Ext.emptyFn,
	cancel: Ext.emptyFn,
	save: Ext.emptyFn,
	refresh: Ext.emptyFn,
	drawOkBtn: true,
	drawCancelBtn: true, 
	drawSaveBtn: false,
	drawRefreshBtn: false,
	iconCls: 'add',
	listeners: {
		render: function(panel) {
			var formPanel = panel.getComponent(0);
			formPanel.on('clientvalidation', function(form, valid) {
				panel.buttons[0].setDisabled(!valid);
			});
			Ext.getBody().unmask();
		}
	},

	initComponent: function() {
		Ext.apply(this, {
			layout: 'fit',
			plain: true,
			stateful: true,
			constrainHeader:true,
			tools: [{
				id: 'help',
				qtip: 'help',
				handler: this.onBtnClick.createDelegate(this, ["help"])
			}],
			buttons: [{
				text: _T('_button', '_OK'), //DO NOT Touch
				hidden: !this.drawOkBtn,
				handler: this.onBtnClick.createDelegate(this, ["ok"])
			},{
				text: 'Refresh',
				hidden: !this.drawRefreshBtn,
				handler: this.onBtnClick.createDelegate(this, ["refresh"])
			},{
				text: _T('_button', '_Cancel'), // DO NOT Touch
				hidden: !this.drawCancelBtn,
				handler: this.onBtnClick.createDelegate(this, ["cancel"])
			},{
				text: 'Save',
				hidden: !this.drawSaveBtn,
				handler: this.onBtnClick.createDelegate(this, ["save"])
			}]
		});
		Ext.zyWindow.superclass.initComponent.apply(this);
	},
	onBtnClick: function(what) {
		switch (what) {
			case 'help':
				this.help();
			break;
			case 'ok':
				this.ok();
			break;
			case 'cancel':
				this.cancel();
			break;
			case 'save':
				this.save();
			break;
			case 'refresh':
				this.refresh();
			break;
		}
	}
});
Ext.reg('zywindow', Ext.zyWindow); 

/* defined zytextarea */
Ext.zyTextArea = Ext.extend(Ext.form.TextArea, {

});
Ext.reg('zytextarea', Ext.zyTextArea);

/* defined zydatefield */
Ext.zyDateField = Ext.extend(Ext.form.DateField, {
	format: Date.patterns.ISO8601Short
});
Ext.reg('zydatefield', Ext.zyDateField); 

/* defined zyform */
Ext.zyFormPanel = Ext.extend(Ext.form.FormPanel, {
	autoScroll: true,
	border: false,
	hideMode: 'offsets',
	bodyStyle: 'padding:0 20px;font-size:11px;',
	itemCls: 'innerscope',
	monitorValid: true,
	initComponent: function() {
		Ext.apply(this, {
			autoScroll: this.autoScroll,
			border: this.border
		});
		Ext.zyFormPanel.superclass.initComponent.apply(this);
	}	

});
Ext.reg('zyform', Ext.zyFormPanel); 

/* defined zyfieldset */
Ext.zyFieldSet = Ext.extend(Ext.form.FieldSet, {
	autoHeight: true,
	autoWidth: true,
	cls: 'fieldset-noborder',

	initComponent: function() {
		Ext.apply(this, {
			autoHeight: this.autoHeight,
			autoWidth: this.autoWidth,
			cls: this.cls
		});
		Ext.zyFieldSet.superclass.initComponent.apply(this);
	}	

});
Ext.reg('zyfieldset', Ext.zyFieldSet); 

/* defined zyradio */
Ext.zyRadio = Ext.extend(Ext.form.Radio, {
	hideLabel: true
});
Ext.reg('zyradio', Ext.zyRadio); 

Ext.override(Ext.form.Radio, {
    getResizeEl : function(){
        return this.wrap;
    }
});

/* defined zyradiogroup */
Ext.zyRadioGroup = Ext.extend(Ext.form.RadioGroup, {

});
Ext.reg('zyradiogroup', Ext.zyRadioGroup); 

/* defined zycheckbox */
Ext.zyCheckbox = Ext.extend(Ext.form.Checkbox, {
	hideLabel: true
});
Ext.reg('zycheckbox', Ext.zyCheckbox); 

Ext.override(Ext.form.Checkbox, {
    getResizeEl : function(){
        return this.wrap;
    }
});

/* defined zycheckboxgroup */
Ext.zyCheckboxGroup = Ext.extend(Ext.form.CheckboxGroup, {

});
Ext.reg('zycheckboxgroup', Ext.zyCheckboxGroup); 

/* defined zytimefield */
Ext.zyTimeField = Ext.extend(Ext.form.TimeField, {
	/* NOTE : this format does not fulfill if second is considerred.
 	 * if you want more detail, please use your own format in page -- alex lee
 	 */
	format : "H:i",
	triggerClass : 'x-form-time-trigger'
});
Ext.reg('zytimefield', Ext.zyTimeField); 

/* defined zylabel */
Ext.zyLabel = Ext.extend(Ext.form.Label, {
	
});
Ext.reg('zylabel', Ext.zyLabel); 

/* defined zyviewport */
Ext.zyViewport = Ext.extend(Ext.Viewport, {

});
Ext.reg('zyviewport', Ext.zyViewport); 

/* defined zypanel */
Ext.zyPanel = Ext.extend(Ext.Panel, {
	hideMode: 'offsets',
	border: false
});
Ext.reg('zypanel', Ext.zyPanel); 

/* defined zybutton */
Ext.zyButton = Ext.extend(Ext.Button, {

});
Ext.reg('zybutton', Ext.zyButton); 

/* defined zytoolbar */
Ext.zyToolbar = Ext.extend(Ext.Toolbar, {

});
Ext.reg('zytoolbar', Ext.zyToolbar); 

/* defined zytreepanel */
Ext.zyTreePanel = Ext.extend(Ext.tree.TreePanel, {

});
Ext.reg('zytreepanel', Ext.zyTreePanel);

/* defined zyprogress */
Ext.zyProgressBar = Ext.extend(Ext.ProgressBar, {

});
Ext.reg('zyprogress', Ext.zyProgressBar); 

/* defined zysummarygrid */
Ext.zySummaryGridPanel = Ext.extend(Ext.grid.GridPanel, {
	displayText:'Displaying {0} - {1} of {2}',
	
	initComponent: function() {
		Ext.apply(this, {
			anchor: '-50',
			stripeRows: true,
			autoWidth: true,
			autoHeight: true,
			viewConfig: {
				forceFit: true
			},
			bbar: new Ext.zyPagingToolbar({
				store: this.store,
				displayInfo: true,
				plugins: new Ext.ux.Jsan.zyPageSize(),
				displayMsg: this.displayText,
				listeners: {/* setting start number for RowNumber component used, Jerry san*/
					'beforechange': {fn: function(scope, data) {
						if(Ext.grid.RowNumberer){
						  	this.store.paramNames.start = scope.cursor;//setting rownumber start
						}		
					}, scope: this}
				}
			})
		});
		Ext.zySummaryGridPanel.superclass.initComponent.apply(this);
	}
	,
	listeners:{	//Joze -for handle unselect grid
		render: cancelGridClickBubble,
		click: function(){
			    if(selectedGridIds.indexOf(this.id)==-1)
					selectedGridIds.push(this.id);	//Joze
				}
	}
});

Ext.reg('zysummarygrid', Ext.zySummaryGridPanel); 

/* defined zyhyperpage */
Ext.zyHyperPage = Ext.extend(Ext.Panel,{
	filename:'',
	hypertext:'',
	text:'',
	zytabpages:'',
	initComponent: function() {
		Ext.apply(this, {
			baseCls:'desc',
			border:false
		});
		Ext.zyHyperPage.superclass.initComponent.apply(this);
		
		if ((this.hypertext.trim() == '') && (this.text.trim() != ''))
			this.hypertext = this.text;
			
		var temp = String.format('<a href="#" onClick="callMainPage(\'{0}\',\'{2}\')">{1}</a>', this.filename, this.hypertext, this.zytabpages);
		if ((this.hypertext.trim() != '') && (this.filename.trim() != '') && (this.text.indexOf(this.hypertext) != -1))
			this.html = this.text.replace(this.hypertext, temp);
		else
			this.html = this.text;
		
	}
	
});
Ext.reg('zyhyperpage', Ext.zyHyperPage);

/* defined zytabpanelinwin */
Ext.zyTabPanelInWin = Ext.extend(Ext.TabPanel, {

	initComponent: function() {
		Ext.apply(this, {
			activeItem: 0,		
			plain: true,
			layoutOnTabChange: true,
			defaults: {autoScroll : true}
		});
		Ext.zyTabPanelInWin.superclass.initComponent.apply(this);
	}
});
Ext.reg('zytabpanelinwin', Ext.zyTabPanelInWin); 

/* defined zyfieldsetpanel */
Ext.zyFieldSetPanel = Ext.extend(Ext.Panel, {
	border: false,
	layout:'form'
});
Ext.reg('zyfieldsetpanel', Ext.zyFieldSetPanel); 

/* defined zytitlepanel */
Ext.zyTitlePanel = Ext.extend(Ext.Panel, {
	border: false,
	cls:'config-label'
});
Ext.reg('zytitlepanel', Ext.zyTitlePanel); 

/* defined zysubtitlepanel */
Ext.zySubTitlePanel = Ext.extend(Ext.Panel, {
	border: false,
	cls:'subtitle'
});
Ext.reg('zysubtitlepanel', Ext.zySubTitlePanel); 

/* defined zydescpanel */
Ext.zyDescPanel = Ext.extend(Ext.Panel, {
	border: false
});
Ext.reg('zydescpanel', Ext.zyDescPanel); 

Ext.zyMenu = Ext.extend(Ext.menu.Menu, {
	
});
Ext.reg('zymenu', Ext.zyMenu); 

/*Ext.zyGroupSummary */
Ext.zyGroupSummary = function(config){
	Ext.apply(this, config);
};

Ext.extend(Ext.zyGroupSummary, Ext.util.Observable, {
	init : function(grid){
		this.grid = grid;
		this.cm = grid.getColumnModel();
		this.view = grid.getView();
		var v = this.view;
		v.doGroupEnd = this.doGroupEnd.createDelegate(this);
		v.afterMethod('onColumnWidthUpdated', this.doWidth, this);
		v.afterMethod('onAllColumnWidthsUpdated', this.doAllWidths, this);
		v.afterMethod('onColumnHiddenUpdated', this.doHidden, this);
		v.afterMethod('onUpdate', this.doUpdate, this);
		v.afterMethod('onRemove', this.doRemove, this);
		if(!this.rowTpl){
			this.rowTpl = new Ext.Template(
				'<div class="x-grid3-summary-row" style="{tstyle}">',
				'<table class="x-grid3-summary-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
					'<tbody><tr>{cells}</tr></tbody>',
				'</table></div>'
			);
			this.rowTpl.disableFormats = true;
		}
		this.rowTpl.compile();
		if(!this.cellTpl){
			this.cellTpl = new Ext.Template(
				'<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}">',
				'<div class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on">{value}</div>',
				"</td>"
			);
			this.cellTpl.disableFormats = true;
		}
		this.cellTpl.compile();
	},
	renderSummary : function(o, cs){
		cs = cs || this.view.getColumnData();
		var cfg = this.cm.config;
		var buf = [], c, p = {}, cf, last = cs.length-1;
		for(var i = 0, len = cs.length; i < len; i++){
			c = cs[i];
			cf = cfg[i];
			p.id = c.id;
			p.style = c.style;
			p.css = i == 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
			if(cf.summaryType || cf.summaryRenderer){
				p.value = (cf.summaryRenderer || c.renderer)(o.data[c.name], p, o);
			}else{
				p.value = '';
			}
			if(p.value == undefined || p.value === "") p.value = "&#160;";
			buf[buf.length] = this.cellTpl.apply(p);
		}
		return this.rowTpl.apply({
			tstyle: 'width:'+this.view.getTotalWidth()+';',
			cells: buf.join('')
		});
	},
	calculate : function(rs, cs){
		var data = {}, r, c, cfg = this.cm.config, cf;
		for(var j = 0, jlen = rs.length; j < jlen; j++){
			r = rs[j];
			for(var i = 0, len = cs.length; i < len; i++){
				c = cs[i];
				cf = cfg[i];
				if(cf.summaryType){
					data[c.name] = Ext.zyGroupSummary.Calculations[cf.summaryType](data[c.name] || 0, r, c.name, data);
				}
			}
		}
		return data;
	},
	doGroupEnd : function(buf, g, cs, ds, colCount){
		var data = this.calculate(g.rs, cs);
		buf.push('</div>', this.renderSummary({data: data}, cs), '</div>');
	},
	doWidth : function(col, w, tw){
		var gs = this.view.getGroups(), s;
		for(var i = 0, len = gs.length; i < len; i++){
			s = gs[i].childNodes[2];
			s.style.width = tw;
			s.firstChild.style.width = tw;
			s.firstChild.rows[0].childNodes[col].style.width = w;
		}
	},
	doAllWidths : function(ws, tw){
		var gs = this.view.getGroups(), s, cells, wlen = ws.length;
		for(var i = 0, len = gs.length; i < len; i++){
			s = gs[i].childNodes[2];
			s.style.width = tw;
			s.firstChild.style.width = tw;
			cells = s.firstChild.rows[0].childNodes;
			for(var j = 0; j < wlen; j++){
				cells[j].style.width = ws[j];
			}
		}
	},
	doHidden : function(col, hidden, tw){
		var gs = this.view.getGroups(), s, display = hidden ? 'none' : '';
		for(var i = 0, len = gs.length; i < len; i++){
			s = gs[i].childNodes[2];
			s.style.width = tw;
			s.firstChild.style.width = tw;
			s.firstChild.rows[0].childNodes[col].style.display = display;
		}
	},
	refreshSummary : function(groupValue){
		return this.refreshSummaryById(this.view.getGroupId(groupValue));
	},
	getSummaryNode : function(gid){
		var g = Ext.fly(gid, '_gsummary');
		if(g){
			return g.down('.x-grid3-summary-row', true);
		}
		return null;
	},
	refreshSummaryById : function(gid){
		var g = document.getElementById(gid);
		if(!g){
			return false;
		}
		var rs = [];
		this.grid.store.each(function(r){
			if(r._groupId == gid){
				rs[rs.length] = r;
			}
		});
		var cs = this.view.getColumnData();
		var data = this.calculate(rs, cs);
		var markup = this.renderSummary({data: data}, cs);
		var existing = this.getSummaryNode(gid);
		if(existing){
			g.removeChild(existing);
		}
		Ext.DomHelper.append(g, markup);
		return true;
	},
	doUpdate : function(ds, record){
		this.refreshSummaryById(record._groupId);
	},
	doRemove : function(ds, record, index, isUpdate){
		if(!isUpdate){
			this.refreshSummaryById(record._groupId);
		}
	},
	showSummaryMsg : function(groupValue, msg){
		var gid = this.view.getGroupId(groupValue);
		var node = this.getSummaryNode(gid);
		if(node){
			node.innerHTML = '<div class="x-grid3-summary-msg">' + msg + '</div>';
		}
	}
});

Ext.zyGroupSummary.Calculations = {
	'sum' : function(v, record, field){
		return v + (record.data[field]||0);
	},
	'count' : function(v, record, field, data){
		return data[field+'count'] ? ++data[field+'count'] : (data[field+'count'] = 1);
	}
};

/* defined zyextrawindow*/
Ext.zyExtraWindow = Ext.extend(Ext.Window, {
	modal: true,
	plain: true
});
Ext.reg('zyextrawindow', Ext.zyExtraWindow); 

/* zytreegrid */
Ext.namespace('Ext.zyTreeGrid');
Ext.zyTreeGrid.AbstractTreeStore = Ext.extend(Ext.data.Store,
{
	leaf_field_name : '_is_leaf',
	page_offset : 0,
	active_node : null,
	constructor : function(config)
	{
		Ext.zyTreeGrid.AbstractTreeStore.superclass.constructor.call(this, config);
		
		if (!this.paramNames.active_node) {
			this.paramNames.active_node = 'anode';
		}
		
		this.addEvents(
			'beforeexpandnode',
			'expandnode',
			'expandnodefailed',
			'beforecollapsenode',
			'collapsenode',
			'beforeactivenodechange',
			'activenodechange'
		);
	},	

	applySort : function()
	{
		if(this.sortInfo && !this.remoteSort){
			var s = this.sortInfo, f = s.field;
			this.sortData(f, s.direction);
		}
		else {
			this.applyTreeSort();
		}
	},
	
	sortData : function(f, direction) 
	{
		direction = direction || 'ASC';
		var st = this.fields.get(f).sortType;
		var fn = function(r1, r2){
			var v1 = st(r1.data[f]), v2 = st(r2.data[f]);
			return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
		};
		this.data.sort(direction, fn);
		if(this.snapshot && this.snapshot != this.data){
			this.snapshot.sort(direction, fn);
		}
		this.applyTreeSort();
	},
	
	load : function(options)
	{
		if (options) {
			if (options.params) {
				if (options.params[this.paramNames.active_node] === undefined) {
					options.params[this.paramNames.active_node] = this.active_node ? this.active_node.id : null;
				}
			}
			else {
				options.params = {};
				options.params[this.paramNames.active_node] = this.active_node ? this.active_node.id : null;
			}
		}
		else {
			options = {params: {}};
			options.params[this.paramNames.active_node] = this.active_node ? this.active_node.id : null;
		}
		if (options.params[this.paramNames.active_node] !== null) {
			options.add = true;
		}
		return Ext.zyTreeGrid.AbstractTreeStore.superclass.load.call(this, options); 
	},
	
	loadRecords : function(o, options, success)
	{
		if (!o || success === false) {
			if (success !== false) {
				this.fireEvent("load", this, [], options);
			}
			if (options.callback) {
				options.callback.call(options.scope || this, [], options, false);
			}
			return;
		}
  		var r = o.records, t = o.totalRecords || r.length,  
			page_offset = this.getPageOffsetFromOptions(options),
			loaded_node_id = this.getLoadedNodeIdFromOptions(options), 
			loaded_node, i, len, self = this;
		
		if (!options || options.add !== true || loaded_node_id === null) {
			if (this.pruneModifiedRecords) {
				this.modified = [];
			}
			for (var i = 0, len = r.length; i < len; i++) {
				r[i].join(this);
			}
			if (this.snapshot) {
				this.data = this.snapshot;
				delete this.snapshot;
			}
			this.data.clear();
			this.data.addAll(r);
			this.page_offset = page_offset;
			this.totalLength = t;
			this.applySort();
			this.fireEvent("datachanged", this);
		} else {
			loaded_node = this.getById(loaded_node_id);
			if (loaded_node) {
				this.setNodeChildrenOffset(loaded_node, page_offset);
				this.setNodeChildrenTotalCount(loaded_node, Math.max(t, r.length));
				this.removeNodeDescendants(loaded_node);
				this.suspendEvents();
				for (i = 0, len = r.length; i < len; i++) {
					this.add(r[i]);
				}
				this.applySort();
				this.resumeEvents();
				idx = [];
				r.sort(function(r1, r2) {
					var idx1 = self.data.indexOf(r1),
						idx2 = self.data.indexOf(r2),
						r;
					if (idx1 > idx2) {
						r = 1;
					}
					else {
						r = -1;
					}
					return r;
				});
				for (i = 0, len = r.length; i < len; i++) {
					this.fireEvent("add", this, [r[i]], this.data.indexOf(r[i]));
				}
			}
		}
		this.fireEvent("load", this, r, options);
		if (options.callback) {
		  options.callback.call(options.scope || this, r, options, true);
		}
	},
	
	applyTreeSort : function()
	{
		var i, len, temp,
			rec, records = [],
			roots = this.getRootNodes();
				
		for (i = 0, len = roots.length; i < len; i++) {
			rec = roots[i];
			records.push(rec);
			this.collectNodeChildrenTreeSorted(records, rec); 
		}
		if (records.length > 0) {
			this.data.clear();
			this.data.addAll(records);
		}
		if (this.snapshot && this.snapshot !== this.data) {
			temp = this.data;
			this.data = this.snapshot;
			this.snapshot = null; 
			this.applyTreeSort();
			this.snapshot = this.data;
			this.data = temp;
		}
	},
	
	collectNodeChildrenTreeSorted : function(records, rec)
	{
		var i, len,
			child, 
			children = this.getNodeChildren(rec);
				
		for (i = 0, len = children.length; i < len; i++) {
			child = children[i];
			records.push(child);
			this.collectNodeChildrenTreeSorted(records, child); 
		}
	},
	
	getActiveNode : function()
	{
		return this.active_node;
	},
	
	setActiveNode : function(rc)
	{
		if (this.active_node !== rc) {
			if (rc) {
				if (this.data.indexOf(rc) != -1) {
					if (this.fireEvent('beforeactivenodechange', this, this.active_node, rc) !== false) {
						this.active_node = rc;
						this.fireEvent('activenodechange', this, this.active_node, rc);
					}
				}
				else {
					throw "Given record is not from the store.";
				}
			}
			else {
				if (this.fireEvent('beforeactivenodechange', this, this.active_node, rc) !== false) {
					this.active_node = rc;
					this.fireEvent('activenodechange', this, this.active_node, rc);
				}
			}
		}
	},
	 
	isExpandedNode : function(rc)
	{
		return rc.ux_maximgb_treegrid_expanded === true;
	},
	
	setNodeExpanded : function(rc, value)
	{
		rc.ux_maximgb_treegrid_expanded = value;
	},
	
	isVisibleNode : function(rc)
	{
		var i, len,
				ancestors = this.getNodeAncestors(rc),
				result = true;
		
		for (i = 0, len = ancestors.length; i < len; i++) {
			result = result && this.isExpandedNode(ancestors[i]);
			if (!result) {
				break;
			}
		}
		
		return result;
	},
	
	isLeafNode : function(rc)
	{
		return rc.get(this.leaf_field_name) == true;
	},
	
	isLoadedNode : function(rc)
	{
		var result;
		
		if (rc.ux_maximgb_treegrid_loaded !== undefined) {
			result = rc.ux_maximgb_treegrid_loaded
		}
		else if (this.isLeafNode(rc) || this.hasChildNodes(rc)) {
			result = true;
		}
		else {
			result = false;
		}
		
		return result;
	},
	
	collapseNode : function(rc)
	{
		if (
			this.isExpandedNode(rc) &&
			this.fireEvent('beforecollapsenode', this, rc) !== false 
		) {
			this.setNodeExpanded(rc, false);
			this.fireEvent('collapsenode', this, rc);
		}
	},
	
	expandNode : function(rc)
	{
		var params;
		
		if (
			!this.isExpandedNode(rc) &&
			this.fireEvent('beforeexpandnode', this, rc) !== false
		) {
			if (this.isLoadedNode(rc)) {
				this.setNodeExpanded(rc, true);
				this.fireEvent('expandnode', this, rc);
			}
			else {
				params = {};
				params[this.paramNames.active_node] = rc.id;
				this.load({
					add : true,
					params : params,
					callback : this.expandNodeCallback,
					scope : this
				});
			}
		}
	},
	
	expandNodeCallback : function(r, options, success)
	{
		var rc = this.getById(options.params[this.paramNames.active_node]);
		
		if (success && rc) {
			this.setNodeLoaded(rc, true);
			this.setNodeExpanded(rc, true);
			this.fireEvent('expandnode', this, rc);
		}
		else {
			this.fireEvent('expandnodefailed', this, options.params[this.paramNames.active_node], rc);
		}
	},
	
	getLoadedNodeIdFromOptions : function(options)
	{
		var result = null;
		if (options && options.params && options.params[this.paramNames.active_node]) {
			result = options.params[this.paramNames.active_node];
		}
		return result;
	},
	
	getPageOffsetFromOptions : function(options)
	{
		var result = 0;
		if (options && options.params && options.params[this.paramNames.start]) {
			result = parseInt(options.params[this.paramNames.start], 10);
			if (isNaN(result)) {
				result = 0;
			}
		}
		return result;
	},
	
	// Public
	hasNextSiblingNode : function(rc)
	{
		return this.getNodeNextSibling(rc) !== null;
	},
	
	// Public
	hasPrevSiblingNode : function(rc)
	{
		return this.getNodePrevSibling(rc) !== null;
	},
	
	// Public
	hasChildNodes : function(rc)
	{
		return this.getNodeChildrenCount(rc) > 0;
	},
	
	// Public
	getNodeAncestors : function(rc)
	{
		var ancestors = [],
				parent;
		
		parent = this.getNodeParent(rc);
		while (parent) {
			ancestors.push(parent);
			parent = this.getNodeParent(parent);	
		}
		
		return ancestors;
	},
	
	// Public
	getNodeChildrenCount : function(rc)
	{
		return this.getNodeChildren(rc).length;
	},
	
	// Public
	getNodeNextSibling : function(rc)
	{
		var siblings,
				parent,
				index,
				result = null;
				
		parent = this.getNodeParent(rc);
		if (parent) {
			siblings = this.getNodeChildren(parent);
		}
		else {
			siblings = this.getRootNodes();
		}
		
		index = siblings.indexOf(rc);
		
		if (index < siblings.length - 1) {
			result = siblings[index + 1];
		}
		
		return result;
	},
	
	// Public
	getNodePrevSibling : function(rc)
	{
		var siblings,
				parent,
				index,
				result = null;
				
		parent = this.getNodeParent(rc);
		if (parent) {
			siblings = this.getNodeChildren(parent);
		}
		else {
			siblings = this.getRootNodes();
		}
		
		index = siblings.indexOf(rc);
		if (index > 0) {
			result = siblings[index - 1];
		}
		
		return result;
	}
});

Ext.zyTreeGrid.AdjacencyListStore = Ext.extend(Ext.zyTreeGrid.AbstractTreeStore,
{
	parent_id_field_name : '_parent',
	
	getRootNodes : function()
	{
		var i, 
			len, 
			result = [], 
			records = this.data.getRange();
		
		for (i = 0, len = records.length; i < len; i++) {
			if (records[i].get(this.parent_id_field_name) == null) {
				result.push(records[i]);
			}
		}
		
		return result;
	},
	
	getNodeDepth : function(rc)
	{
		return this.getNodeAncestors(rc).length;
	},
	
	getNodeParent : function(rc)
	{
		return this.getById(rc.get(this.parent_id_field_name));
	},
	
	getNodeChildren : function(rc)
	{
		var i, 
				len, 
				result = [], 
				records = this.data.getRange();
		
		for (i = 0, len = records.length; i < len; i++) {
			if (records[i].get(this.parent_id_field_name) == rc.id) {
				result.push(records[i]);
			}
		}
		
		return result;
	}
});

Ext.zyTreeGrid.GridView = Ext.extend(Ext.grid.GridView, 
{
	initTemplates : function()
	{
		var ts = this.templates || {};
		
		ts.master = new Ext.Template(
			'<div class="x-grid3" hidefocus="true">',
				'<div class="x-grid3-viewport">',
					'<div class="x-grid3-header">',
						'<div class="x-grid3-header-inner">',
						'</div>',
						'<div class="x-clear"></div>',
						'<div class="x-grid3-header-inner">',
							'<div class="x-grid3-header-offset">{header}</div>',
						'</div>',
						'<div class="x-clear"></div>',
					'</div>',
					'<div class="x-grid3-scroller">',
						'<div class="x-grid3-body">{body}</div>',
						'<a href="#" class="x-grid3-focus" tabIndex="-1"></a>',
					'</div>',
				'</div>',
				'<div class="x-grid3-resize-marker">&#160;</div>',
				'<div class="x-grid3-resize-proxy">&#160;</div>',
			'</div>'
		);
		
		ts.row = new Ext.Template(
			'<div class="x-grid3-row {alt} ux-maximgb-treegrid-level-{level}" style="{tstyle} {display_style}">',
				'<table class="x-grid3-row-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
        	'<tbody>',
        		'<tr>{cells}</tr>',
            (
            	this.enableRowBody ? 
            		'<tr class="x-grid3-row-body-tr" style="{bodyStyle}">' +
            			'<td colspan="{cols}" class="x-grid3-body-cell" tabIndex="0" hidefocus="on">'+
            				'<div class="x-grid3-row-body">{body}</div>'+
            			'</td>'+
            		'</tr>' 
            			: 
            		''
            ),
			'</tbody>',
			'</table>',
			'</div>'
		);
		
		ts.cell = new Ext.Template(
			'<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>',
				'{treeui}',
				'<div class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on" {attr}>{value}</div>',
			'</td>'
		);
		
		ts.treeui = new Ext.Template(
			'<div class="ux-maximgb-treegrid-uiwrap" style="width: {wrap_width}px">',
				'{elbow_line}',
				'<div style="left: {left}px" class="{cls}">&#160;</div>',
			'</div>'
		);
		
		ts.elbow_line = new Ext.Template(
			'<div style="left: {left}px" class="{cls}">&#160;</div>'
		);
		
		ts.brd_item = new Ext.Template(
			'<a href="#" id="ux-maximgb-treegrid-brditem-{id}" class="ux-maximgb-treegrid-brditem" title="{title}">{caption}</a>'
		);
		
		this.templates = ts;
		Ext.zyTreeGrid.GridView.superclass.initTemplates.call(this);
	},
	
  initElements : function()
  {
		var E = Ext.Element;
		
		var el = this.grid.getGridEl().dom.firstChild;
		var cs = el.childNodes;
		
		this.el = new E(el);
		
		this.mainWrap = new E(cs[0]);
		this.mainHd = new E(this.mainWrap.dom.firstChild);
		
		if(this.grid.hideHeaders){
		    this.mainHd.setDisplayed(false);
		}
		
		this.innerHd = this.mainHd.dom.childNodes[2];
		this.scroller = new E(this.mainWrap.dom.childNodes[1]);
		
		if(this.forceFit){
		    this.scroller.setStyle('overflow-x', 'hidden');
		}
		this.mainBody = new E(this.scroller.dom.firstChild);
		
		this.focusEl = new E(this.scroller.dom.childNodes[1]);
		this.focusEl.swallowEvent("click", true);
		
		this.resizeMarker = new E(cs[1]);
		this.resizeProxy = new E(cs[2]);
		
	},
	
	doRender : function(cs, rs, ds, startRow, colCount, stripe)
	{
		var ts = this.templates, ct = ts.cell, rt = ts.row, last = colCount-1;
		var tstyle = 'width:'+this.getTotalWidth()+';';
		var buf = [], cb, c, p = {}, rp = {tstyle: tstyle}, r;
		for (var j = 0, len = rs.length; j < len; j++) {
			r = rs[j]; cb = [];
			var rowIndex = (j+startRow);
			for (var i = 0; i < colCount; i++) {
				c = cs[i];
				p.id = c.id;
				p.css = i == 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
				p.attr = p.cellAttr = "";
				p.value = c.renderer(r.data[c.name], p, r, rowIndex, i, ds);
				p.style = c.style;
				if (p.value == undefined || p.value === "") {
					p.value = "&#160;";
				}
				if (r.dirty && typeof r.modified[c.name] !== 'undefined') {
					p.css += ' x-grid3-dirty-cell';
				}
				if (c.id == this.grid.master_column_id) {
					p.treeui = this.renderCellTreeUI(r, ds);
				}
				else {
					p.treeui = '';
				}
				cb[cb.length] = ct.apply(p);
			}
			var alt = [];
			if (stripe && ((rowIndex+1) % 2 == 0)) {
				alt[0] = "x-grid3-row-alt";
			}
			if (r.dirty) {
				alt[1] = " x-grid3-dirty-row";
			}
			rp.cols = colCount;
			if(this.getRowClass){
				alt[2] = this.getRowClass(r, rowIndex, rp, ds);
			}
			rp.alt = alt.join(" ");
			rp.cells = cb.join("");
			if (!ds.isVisibleNode(r)) {
				rp.display_style = 'display: none;';
			}
			else {
				rp.display_style = '';
			}
			rp.level = ds.getNodeDepth(r);
			buf[buf.length] =  rt.apply(rp);
		}
		return buf.join("");
	},
  
	renderCellTreeUI : function(record, store)
	{
		var tpl = this.templates.treeui,
  			line_tpl = this.templates.elbow_line,
  			tpl_data = {},
  			rec, parent,
  			depth = level = store.getNodeDepth(record);
  		
		tpl_data.wrap_width = (depth + 1) * 16;	
		if (level > 0) {
			tpl_data.elbow_line = '';
			rec = record;
			left = 0;
			while(level--) {
				parent = store.getNodeParent(rec);
				if (parent) {
					if (store.hasNextSiblingNode(parent)) {
						tpl_data.elbow_line = 
	  					line_tpl.apply({
	  						left : level * 16, 
	  						cls : 'ux-maximgb-treegrid-elbow-line'}) + 
							tpl_data.elbow_line;
					}
					else {
						tpl_data.elbow_line = 
						line_tpl.apply({
							left : level * 16,
							cls : 'ux-maximgb-treegrid-elbow-empty'
						}) +
						tpl_data.elbow_line;
					}
				}
				else {
					throw [
						"Tree inconsistency can't get level ",
						level + 1,
						" node(id=", rec.id, ") parent."
					].join("")
				}
				rec = parent;
			}
		}
		if (store.isLeafNode(record)) {
			if (store.hasNextSiblingNode(record)) {
				tpl_data.cls = 'ux-maximgb-treegrid-elbow';
			}
			else {
				tpl_data.cls = 'ux-maximgb-treegrid-elbow-end';
			}
		}
		else {
			tpl_data.cls = 'ux-maximgb-treegrid-elbow-active ';
			if (store.isExpandedNode(record)) {
				if (store.hasNextSiblingNode(record)) {
					tpl_data.cls += 'ux-maximgb-treegrid-elbow-minus';
				}
				else {
					tpl_data.cls += 'ux-maximgb-treegrid-elbow-end-minus';
				}
			}
			else {
				if (store.hasNextSiblingNode(record)) {
					tpl_data.cls += 'ux-maximgb-treegrid-elbow-plus';
				}
				else {
					tpl_data.cls += 'ux-maximgb-treegrid-elbow-end-plus';
				}
			}
		}
		tpl_data.left = 1 + depth * 16;
  			
		return tpl.apply(tpl_data);
	},
	
	expandRow : function(record, initial)
	{
		var ds = this.ds,
			i, len, row, pmel, children, index, child_index;
		
		if (typeof record == 'number') {
			index = record;
			record = ds.getAt(index);
		}
		else {
			index = ds.indexOf(record);
		}
		
		row = this.getRow(index);
		pmel = Ext.fly(row).child('.ux-maximgb-treegrid-elbow-active');
		if (pmel) {
			if (ds.hasNextSiblingNode(record)) {
				pmel.removeClass('ux-maximgb-treegrid-elbow-plus');
				pmel.removeClass('ux-maximgb-treegrid-elbow-end-plus');
				pmel.addClass('ux-maximgb-treegrid-elbow-minus');
			}
			else {
				pmel.removeClass('ux-maximgb-treegrid-elbow-plus');
				pmel.removeClass('ux-maximgb-treegrid-elbow-end-plus');
				pmel.addClass('ux-maximgb-treegrid-elbow-end-minus');
			}
			if (ds.isVisibleNode(record)) {
				children = ds.getNodeChildren(record);
				for (i = 0, len = children.length; i < len; i++) {
					child_index = ds.indexOf(children[i]);
					row = this.getRow(child_index);
					Ext.fly(row).setStyle('display', 'block');
					if (ds.isExpandedNode(children[i])) {
						this.expandRow(child_index);
					}
				}
			}
		}
	},
	
	collapseRow : function(record)
	{
		var ds = this.ds,
			i, len, children, row, index;
				
		if (typeof record == 'number') {
			index = record;
			record = ds.getAt(index);
		}
		else {
			index = ds.indexOf(record);
		}
		
		row = this.getRow(index);
		pmel = Ext.fly(row).child('.ux-maximgb-treegrid-elbow-active');
		if (pmel) {
			if (ds.hasNextSiblingNode(record)) {
				pmel.removeClass('ux-maximgb-treegrid-elbow-minus');
				pmel.removeClass('ux-maximgb-treegrid-elbow-end-minus');
				pmel.addClass('ux-maximgb-treegrid-elbow-plus');
			}
			else {
				pmel.removeClass('ux-maximgb-treegrid-elbow-minus');
				pmel.removeClass('ux-maximgb-treegrid-elbow-end-minus');
				pmel.addClass('ux-maximgb-treegrid-elbow-end-plus');
			}
			children = ds.getNodeChildren(record);
			for (i = 0, len = children.length; i < len; i++) {
				index = ds.indexOf(children[i]);
				row = this.getRow(index);
				Ext.fly(row).setStyle('display', 'none'); 
				this.collapseRow(index);
			}
		}
	},
	
	initData : function(ds, cm)
	{
		Ext.zyTreeGrid.GridView.superclass.initData.call(this, ds, cm);
		if (this.ds) {
			this.ds.un('activenodechange', this.onStoreActiveNodeChange, this);
			this.ds.un('expandnode', this.onStoreExpandNode, this);
			this.ds.un('collapsenode', this.onStoreCollapseNode, this);
		}
		if (ds) {
			ds.on('activenodechange', this.onStoreActiveNodeChange, this);
			ds.on('expandnode', this.onStoreExpandNode, this);
			ds.on('collapsenode', this.onStoreCollapseNode, this);
		}
	},
	
	onStoreActiveNodeChange : function(store, old_rc, new_rc)
	{
		var parents, i, len, rec, items = [],
				ts = this.templates;
				
		if (new_rc) {
			parents = this.ds.getNodeAncestors(new_rc),
			parents.reverse();
			parents.push(new_rc);
		
			for (i = 0, len = parents.length; i < len; i++) {
				rec = parents[i];
				items.push(
					ts.brd_item.apply({
						id : rec.id,
						caption : rec.get(
							this.cm.getDataIndex(
								this.cm.getIndexById(this.grid.master_column_id)
							)
						)
					})
				);
			}
		}
	},
	
	onLoad : function(store, records, options)
	{
		var id = store.getLoadedNodeIdFromOptions(options);
		if (id === null) {
			Ext.zyTreeGrid.GridView.superclass.onLoad.call(this, store, records, options);
		}
	},
	
	onStoreExpandNode : function(store, rc)
	{
		this.expandRow(rc);
	},
	
	onStoreCollapseNode : function(store, rc)
	{
		this.collapseRow(rc);
	}
});

Ext.zyTreeGrid.GridPanel = Ext.extend(Ext.grid.GridPanel, 
{
	master_column_id : 0,
	
	i18n : null,
	
	stateful: true,
	stripeRows: true,
	anchor: '-50',
	autoWidth: true,
	autoHeight: true,
	collapsible: true,
	viewConfig: {
		forceFit: true
	},

	initComponent : function()
	{
		Ext.zyTreeGrid.GridPanel.superclass.initComponent.call(this);
		
		Ext.applyIf(this.i18n, Ext.zyTreeGrid.GridPanel.prototype.i18n);
		
		this.getSelectionModel().on(
			'selectionchange',
			this.onTreeGridSelectionChange,
			this
		);
	},
	listeners:{	//Joze -for handle unselect grid
		render: cancelGridClickBubble,
		click: function(){
			    if(selectedGridIds.indexOf(this.id)==-1)
					selectedGridIds.push(this.id);	//Joze
				}
	},

	getView : function()
	{
		if (!this.view) {
			this.view = new Ext.zyTreeGrid.GridView(this.viewConfig);
		}
		return this.view;
	},
	
	onClick : function(e)
	{
		var target = e.getTarget(),
			view = this.getView(),
			row = view.findRowIndex(target),
			store = this.getStore(),
			sm = this.getSelectionModel(), 
			record, record_id, do_default = true;
		if (row !== false) {
			if (Ext.fly(target).hasClass('ux-maximgb-treegrid-elbow-active')) {
				record = store.getAt(row);
				if (store.isExpandedNode(record)) {
					store.collapseNode(record);
				}
				else {
					store.expandNode(record);
				}
				do_default = false;
			}
		}
		if (do_default) {
			Ext.zyTreeGrid.GridPanel.superclass.onClick.call(this, e);
		}
	},

	onMouseDown : function(e)
	{
		var target = e.getTarget();

		if (!Ext.fly(target).hasClass('ux-maximgb-treegrid-elbow-active')) {
			Ext.zyTreeGrid.GridPanel.superclass.onMouseDown.call(this, e);
		}
	},
	
	onDblClick : function(e)
	{
		var target = e.getTarget(),
				view = this.getView(),
				row = view.findRowIndex(target),
				store = this.getStore(),
				sm = this.getSelectionModel(), 
				record, record_id;
			
		if (!row && Ext.fly(target).hasClass('ux-maximgb-treegrid-brditem')) {
			record_id = Ext.id(target);
			record_id = record_id.substr(record_id.lastIndexOf('-') + 1);
			if (record_id != '') {
				record = store.getById(record_id);
				row = store.indexOf(record);
				
				if (store.isExpandedNode(record)) {
					store.collapseNode(record);
				}
				else {
					store.expandNode(record);
				}
				
				if (sm.isSelected && !sm.isSelected(row)) {
					sm.selectRow(row);
				}
			}
			else {
				sm.clearSelections();
			}
		}
		
		Ext.zyTreeGrid.GridPanel.superclass.onDblClick.call(this, e);
	},
	
	onTreeGridSelectionChange : function(sm, selection)
	{
		var record;
		if (sm.getSelected) {
			record = sm.getSelected();
			this.getStore().setActiveNode(record);
		}
		else if (Ext.type(selection) == 'array' && selection.length > 0) {
			record = store.getAt(selection[0])
			this.getStore().setActiveNode(record);
		}
		else {
			throw "Unknown selection model applyed to the grid.";
		}
	}
});

Ext.reg('zytreegrid', Ext.zyTreeGrid.GridPanel);

