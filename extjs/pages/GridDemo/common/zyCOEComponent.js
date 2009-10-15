/**
 * Joze 2009/08*17
 * @param {Object} grid
 */

function initTbar(grid){
    if (grid.topToolbar == null) 
                return;
    var Add = grid.id + GridCtrlParams.ADD;
    var Edit = grid.id + GridCtrlParams.EDIT;
    var Remove = grid.id + GridCtrlParams.REMOVE;
    var Clear = grid.id + GridCtrlParams.CLEAR;
    var ClearCombo = grid.id + GridCtrlParams.CLEARCOMBO;
    var Refresh = grid.id + GridCtrlParams.REFRESH;
    
    Ext.getCmp(Add).enable();
    Ext.getCmp(Edit).disable();
    Ext.getCmp(Remove).disable();
    Ext.getCmp(Clear).disable();
    Ext.getCmp(ClearCombo).enable();
    Ext.getCmp(Refresh).enable();
}

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

var selectedGrid = null;

var GridCtrlParams = {
    ADD: '_add',
    EDIT: '_edit',
    REMOVE: '_remove',
    CLEAR: '_clear',
    CLEARCOMBO: '_clearCombo',
    REFRESH: '_refresh'
};

zyCOEGridPanelConfig = {

    //default options
    stripeRows: true,
    viewConfig: {
        forceFit: true
    },
    //clicksToEdit: 'auto',
    onEditComplete: function(ed, value, startValue){
        this.editing = false;
        this.activeEditor = null;
        ed.un("specialkey", this.selModel.onEditorKey, this.selModel);
        var r = ed.record;
        var field = this.colModel.getDataIndex(ed.col);
        value = this.postEditValue(value, startValue, r, field);
        var e = {
            grid: this,
            record: r,
            field: field,
            originalValue: value,
            value: value,
            row: ed.row,
            column: ed.col,
            cancel: false
        };
        if (String(value) !== String(startValue)) {
            e = {
                grid: this,
                record: r,
                field: field,
                originalValue: startValue,
                value: value,
                row: ed.row,
                column: ed.col,
                cancel: false
            };
            if (this.fireEvent("validateedit", e) !== false && !e.cancel) {
                r.set(field, e.value);
                delete e.cancel;
                this.fireEvent("afteredit", e);
            }
        }
        this.fireEvent("aftereditfource", e);
        //this.view.focusRow(ed.row); 
    },
    
    //added options
    allEditRow: null,
    showBbar: true,
    showTbar: true,
    cancelAllEditFields: [],
    allEditRowCls: 'allEditRow',
    
    //ttbar controls
    onAdd: Ext.emptyFn,
    onEdit: Ext.emptyFn,
    onRemove: Ext.emptyFn,
    onClear: Ext.emptyFn,
    onClearCombo: {handle: Ext.emptyFn, selections: null},
    onRefresh: Ext.emptyFn,
    
    showAdd: false,
    showEdit: false,
    showRemove: false,
    showClear: false,
    showClearCombo: false,
    showReflash: false,

    displayText: 'Displaying {0} - {1} of {2}',
    onBtnClick: function(handleFn){
        /*
         var length = this.selModel.getCount();
         var s = this.selModel.getSelections();
         var count = this.store.snapshot ? this.store.snapshot.length : this.store.getCount();
         */
        if (handleFn != undefined) 
            handleFn(this);
        else 
            alert('please set the btn handler');
    },
    
    initComponent: function(e){
    
        this.on('render', cancelGridClickBubble);
        this.on('click', function(){
            if (selectedGrid == null || selectedGrid != this.id) {
                if (selectedGrid != null) {
                    Ext.getCmp(selectedGrid).getSelectionModel().clearSelections();
                    Ext.getCmp(selectedGrid).stopEditing();
                    
                    if (Ext.getCmp(selectedGrid).topToolbar != null) 
                        initTbar(Ext.getCmp(selectedGrid));
                }
                selectedGrid = this.id;
            }
        });
        Ext.getBody().on('click', function(){
            if (selectedGrid != null) {
                Ext.getCmp(selectedGrid).getSelectionModel().clearSelections();
                Ext.getCmp(selectedGrid).stopEditing();
				
                if (Ext.getCmp(selectedGrid).topToolbar != null) {
					initTbar(Ext.getCmp(selectedGrid));
				}
                selectedGrid = null;
            }
        });
        
        this.on('rowclick', function(grid, rowIndex, e){
    
            if (grid.topToolbar == null) 
                return;
            var gridID = grid.id;
            var Add = gridID + GridCtrlParams.ADD;
            var Edit = gridID + GridCtrlParams.EDIT;
            var Remove = gridID + GridCtrlParams.REMOVE;
            var Clear = gridID + GridCtrlParams.CLEAR;
            if (grid.selModel.getCount() == 1) {
                Ext.getCmp(Add).enable();
                Ext.getCmp(Edit).enable();
                Ext.getCmp(Remove).enable();
                Ext.getCmp(Clear).enable();
            }
            else 
                if (grid.selModel.getCount() > 1) {
                    //Ext.getCmp(Add).disable();
                    Ext.getCmp(Edit).disable();
                    Ext.getCmp(Remove).enable();
                    Ext.getCmp(Clear).enable();
                }
            
            //for 'clicksToEdit: 2' setting, workaround for textfiled editing
            // grid.stopEditing();
        });
        
        //####allEditRow Setting           
        function syncBelowValue(e){
            for (var i = 1; i < e.grid.store.data.items.length; i++) 
                e.grid.store.data.items[i].set(e.field, e.value);
        }
        
        var gridConfig = this;
        if (this.allEditRow != null) {
            //insert a all control row
            this.store.on('load', function(store){
                store.insert(0, gridConfig.allEditRow);
            });
            
            //apply another class.
            this.viewConfig.getRowClass = function(record, rowIndex, p, ds){
            
                if (rowIndex == 0 && this.grid.allEditRow != null) {
                    return gridConfig.allEditRowCls;
                }
            }
            
            // disable sorable in each column
            Ext.each(this.cm.config, function(v, i, a){
                v.sortable = false;
                //alert("index: " + i + " value: " + v + " array.length：" + a.length)
            });
            
            
               //check whether the clicked cell could be edited.
            this.on('beforeedit', function(e){
                if (this.cancelAllEditFields != [] && (this.cancelAllEditFields.indexOf(e.field) != -1) && e.row == 0) {
                    e.cancel = true;
                    return false;
                }
            }, this);
            
            //sync following value after edit
            this.on('aftereditfource', function(e){
                if (e.row == 0) {
                    syncBelowValue(e);
                    //remove red triangle
                    recover(e.record);
                }
            }, this);

            this.on('checkColumnClick', function(e){
                if(this.cancelAllEditFields != []&& (this.cancelAllEditFields.indexOf(e.field) != -1) )
                return ;
                
                if (e.row == 0) {
                    syncBelowValue(e);
                    //remove red triangle
                    recover(e.record);
                }
                
            });
            
            this.on('actionColumnClick', function(e){
                if(this.cancelAllEditFields != []&& (this.cancelAllEditFields.indexOf(e.field) != -1) )
                return ;
                
                if (e.row == 0) {
                    syncBelowValue(e);
                    //remove red triangle
                    recover(e.record);
                }
            });
            //####allEditRow Setting    
        }
        
        //Add CtrlRow
        Ext.apply(this, {
        
            anchor: '-20',
            autoWidth: true,
            autoHeight: true,
            cls: 'innerscope',
            collapsible: true,
            layout: 'fit',
            loadMask: true,
            stateful: true,
            
            bbar: new Ext.zyPagingToolbar({
                store: this.store,
                displayInfo: true,
                plugins: new Ext.ux.Jsan.zyPageSize(),//[new Ext.ux.PageSizePlugin()],
                emptyMsg: 'empty',
                displayMsg: this.displayText,
                listeners: {/* setting start number for RowNumber component used, Jerry san*/
                    'beforechange': {
                        fn: function(scope, data){
                            if (Ext.grid.RowNumberer) {
                                this.store.paramNames.start = scope.cursor;//setting rownumber start
                            }
                        },
                        scope: this
                    }
                }
            }),
            tbar: [{
                id: this.id + GridCtrlParams.ADD,
                text: 'Add',
                tooltip: 'New Folder',
                iconCls: 'newfolder',
                hidden: !this.showAdd && this.onAdd == Ext.emptyFn,
                handler: this.onBtnClick.createDelegate(this, [this.onAdd])
            }, {
                id: this.id + GridCtrlParams.EDIT,
                text: 'Edit',
                disabled: true,
                tooltip: 'Edit the selected rule',
                iconCls: 'edit',
                hidden: !this.showEdit && this.onEdit == Ext.emptyFn,
                handler: this.onBtnClick.createDelegate(this, [this.onEdit])
            }, {
                id: this.id + GridCtrlParams.REMOVE,
                text: 'Remove',
                disabled: true,
                tooltip: 'Remove the selected rule',
                iconCls: 'remove',
                hidden: !this.showRemove && this.onRemove == Ext.emptyFn,
                handler: this.onBtnClick.createDelegate(this, [this.onRemove])
            }, {
                id: this.id + GridCtrlParams.CLEAR,
                text: 'Clear',
                tooltip: 'Clear',
                disabled: true,
                iconCls: 'clear',
                hidden: !this.showClear && this.onClear == Ext.emptyFn,
                handler: this.onBtnClick.createDelegate(this, [this.onClear])
            }, new Ext.form.ComboBox({
                id: this.id + GridCtrlParams.CLEARCOMBO,
                hidden: !this.showClearCombo && this.onClearCombo.selections == null,
                store: new Ext.data.SimpleStore({
                    fields: ["optionID", "optionName"],
                    data: this.onClearCombo.selections
                }),
                listeners: {
                    select: this.onClearCombo.handle
                },
                displayField: "optionName",
                mode: 'local',
                forceSelection: true,
                blankText: 'all',
                emptyText: 'all',
                editable: false,
                selectOnFocus: true,
                triggerAction: 'all',
                width: 100
            }), {
                id: this.id + GridCtrlParams.REFRESH,
                text: 'Refresh',
                tooltip: 'Refresh',
                iconCls: 'refresh',
                hidden: !this.showRefresh && this.onRefresh == Ext.emptyFn,
                handler: this.onBtnClick.createDelegate(this, [this.onRefresh])
            }]
        
        }//apply
);
        
        Ext.grid.zyCOEGridPanel.superclass.initComponent.apply(this);
     
        
        if (this.showBbar == false) 
            this.bottomToolbar = null;
        if (this.showTbar == false) 
            this.topToolbar = null;
        /*
        if (this.getXType() == "zycoeeditorgrid") {
            this.topToolbar = null;
            this.bottomToolbar = null;
        }*/
    }
};

Ext.grid.zyCOEGridPanel = Ext.extend(Ext.grid.GridPanel, zyCOEGridPanelConfig);
Ext.reg('zycoegrid', Ext.grid.zyCOEGridPanel);


Ext.grid.zyCOEEditorGridPanel = Ext.extend(Ext.grid.EditorGridPanel, zyCOEGridPanelConfig);
Ext.reg('zycoeeditorgrid', Ext.grid.zyCOEEditorGridPanel);



var zyRowNumbererOffsetConfig = {
    header: "",
    width: 23,
    sortable: false,
    
    // private
    fixed: true,
    menuDisabled: true,
    dataIndex: '',
    //id: 'numberer',
    rowspan: undefined,
    
    constructor: function(config){
        Ext.apply(this, {
            renderer: function(v, p, record, rowIndex){
                if (this.rowspan) {
                    p.cellAttr = 'rowspan="' + this.rowspan + '"';
                }
                if (rowIndex == 0) 
                    return '';
                else 
                    return rowIndex;
            }
        });
        Ext.grid.zyRowNumbererOffset.superclass.constructor.call(this, config);
    }
}
Ext.grid.zyRowNumbererOffset = Ext.extend(Ext.grid.RowNumberer, zyRowNumbererOffsetConfig);


var zyCheckColumnConfig = {
    init: function(grid){
        this.grid = grid;
        this.grid.on('render', function(){
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },
    
    onMouseDown: function(e, t){
    
        if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
            e.stopEvent();
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(index);
            record.set(this.dataIndex, !record.data[this.dataIndex]);
            
            var columnIndex = this.grid.getColumnModel().getIndexById(this.id);
            this.grid.fireEvent('cellclick', this.grid, index, columnIndex, e);
            
            var params = {
                column: columnIndex,
                field: this.dataIndex,
                grid: this.grid,
                originalValue: !record.data[this.dataIndex],
                record: record,
                row: index,
                value: record.data[this.dataIndex]
            };
            this.grid.fireEvent('checkColumnClick', params);
        }
    },
    
    renderer: function(v, p, record){
        p.css += ' x-grid3-check-col-td';
        
        //image checkbox
        //var baseRender = '<div class="x-grid3-check-col' + (v ? '-on' : '') + ' x-grid3-cc-' + this.id + '">&#160;</div>';
        
        //default checkbox
        var baseRender = '<input type="checkbox" class="x-grid3-cc-' + this.id + '" ' + (v ? 'checked=true' : '') + ' enabled = false>'
        
        var returnRender = '<div style="width:16px; margin-left:4px;">' + baseRender + '</div>';
        
        
        if (this.align == 'center') 
            returnRender = '<div style="width:auto; position:relative;left:50%; float:left;"><div style="position:relative;right:50%;float:left; width:16px">' + baseRender + '</div></div>';
        else 
            if (this.align == 'right') 
                returnRender = '<div style="float:right; width:16px">' + baseRender + '</div>';
        return returnRender;
    }
}
Ext.grid.zyCheckColumn = Ext.extend(Ext.grid.CheckColumn, zyCheckColumnConfig);


var zyActiveColumnConfig = {
    onMouseDown: function(e, t){
        if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
            e.stopEvent();
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(index);
            record.set(this.dataIndex, !record.data[this.dataIndex]);
            var columnIndex = this.grid.getColumnModel().getIndexById(this.id);
            
            this.grid.fireEvent('cellclick', this.grid, index, columnIndex, e);
            
            var params = {
                column: columnIndex,
                field: this.dataIndex,
                grid: this.grid,
                originalValue: !record.data[this.dataIndex],
                record: record,
                row: index,
                value: record.data[this.dataIndex]
            };
            this.grid.fireEvent('actionColumnClick', params);
        }
    },
    renderer: function(v, p, record){
        p.css += ' x-grid3-check-col-td';
        
        var baseRender = '<div class="x-grid3-active-col' + (v ? '-on' : '') + ' x-grid3-cc-' + this.id + '">&#160;</div>';
        var returnRender = '<div style="width:16px">' + baseRender + '</div>';
        
        if (this.align == 'center') 
            returnRender = '<div style="width:auto; position:relative;left:50%; float:left;"><div style="position:relative;right:50%;float:left; width:16px">' + baseRender + '</div></div>';
        else 
            if (this.align == 'right') 
                returnRender = '<div style="float:right; width:16px">' + baseRender + '</div>';
        return returnRender;
    }
};
Ext.grid.zyActiveColumn = Ext.extend(Ext.grid.zyCheckColumn, zyActiveColumnConfig);
