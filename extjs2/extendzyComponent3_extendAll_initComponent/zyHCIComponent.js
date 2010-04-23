/*for handle unselect grid*/

Ext.namespace("Ext.hci");

var zyHCIGridPanelConfig = {
    extraButtons:[],
    initComponent: function() {
        Ext.apply(this, {
            stateful: true,
            stripeRows: true,
            anchor: '-50',
//          autoWidth: true,
            autoHeight: true,
//          layout: 'fit',
            collapsible: true,
            enableDragDrop: true,
            selModel:
                new Ext.grid.RowSelectionModel({
                    listeners: {
                        rowselect: function(sm, row, rec) {
                           
                            //--Joze  for extraButtons
                           for (var i = 0; i < this.grid.tbar.query('.extraButton').length; i++) {
                             var extraButtonDomObj=  this.grid.tbar.query('.extraButton')[i].parentNode.parentNode.parentNode.parentNode.parentNode;
                             var extraButtonObj = Ext.getCmp(extraButtonDomObj.id);
                             var btnEnable = false;
                             if(extraButtonObj.iconCls.search('singleOn')!=-1 && sm.getCount()==1)
                             btnEnable= true;
                             if(extraButtonObj.iconCls.search('multiOn')!=-1 && sm.getCount()>1)
                             btnEnable= true;
                             if(extraButtonObj.iconCls.search('emptyOn')!=-1 && sm.getCount()==0)
                             btnEnable= true;
                             btnEnable?extraButtonObj.enable():extraButtonObj.disable();
                           }

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
                          //--Joze  for extraButtons
                           for (var i = 0; i < this.grid.tbar.query('.extraButton').length; i++) {
                             var extraButtonDomObj=  this.grid.tbar.query('.extraButton')[i].parentNode.parentNode.parentNode.parentNode.parentNode;
                             var extraButtonObj = Ext.getCmp(extraButtonDomObj.id);
                             var btnEnable = false;
                             if(extraButtonObj.iconCls.search('singleOn')!=-1 && sm.getCount()==1)
                             btnEnable= true;
                             if(extraButtonObj.iconCls.search('multiOn')!=-1 && sm.getCount()>1)
                             btnEnable= true;
                             if(extraButtonObj.iconCls.search('emptyOn')!=-1 && sm.getCount()==0)
                             btnEnable= true;
                             btnEnable?extraButtonObj.enable():extraButtonObj.disable();
                           }
                           
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
                forceFit: true,
                autoFill: true,
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

       //--Joze  for extraButtons
        for(var i =0; i<this.extraButtons.length; i ++)
        {
            if (this.extraButtons[i].mode != undefined && this.extraButtons[i].iconCls.search('extraButton') == -1) {
                var modeStr= this.extraButtons[i].mode.join(' ');
                this.extraButtons[i].iconCls = this.extraButtons[i].iconCls +' extraButton ' + modeStr;
                modeStr.search('emptyOn')==-1?this.extraButtons[i].disabled=true:this.extraButtons[i].disabled=false;    
            }
              this.tbar.splice(this.extraButtons[i].index, 0, this.extraButtons[i]);
        }

        Ext.zyGridPanel.superclass.initComponent.apply(this);
    }

}


Ext.hci.zyGridPanel = Ext.extend(Ext.zyGridPanel, zyHCIGridPanelConfig);
Ext.reg('hcizygrid', Ext.hci.zyGridPanel);