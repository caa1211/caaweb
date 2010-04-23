
Ext.namespace("Ext.hci");
var zyHCIGridPanelConfig = {
  extraButtons:[],
  beforeInitComponent: function() {
     Ext.hci.zyGridPanel.superclass.beforeInitComponent.apply(this);
   //--Joze  for extraButtons
     for (var i = 0; i < this.extraButtons.length; i++) {
          if (this.extraButtons[i].mode != undefined && this.extraButtons[i].iconCls.search('extraButton') == -1) {
              var modeStr = this.extraButtons[i].mode.join(' ');
              this.extraButtons[i].iconCls = this.extraButtons[i].iconCls + ' extraButton ' + modeStr;
              modeStr.search('emptyOn') == -1 ? this.extraButtons[i].disabled = true : this.extraButtons[i].disabled = false;
          }
          this.tbar.splice(this.extraButtons[i].index, 0, this.extraButtons[i]);
      }

//this.getSelectionModel() 
       this.on('render', function(e) {
      //   debugger;
        });
        
  }
}

Ext.hci.zyGridPanel = Ext.extend(Ext.zyGridPanel, zyHCIGridPanelConfig);
Ext.reg('hcizygrid', Ext.hci.zyGridPanel);