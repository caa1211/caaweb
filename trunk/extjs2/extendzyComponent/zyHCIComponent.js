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

Ext.namespace("Ext.hci");

var zyHCIGridPanelConfig = {
  extraButtons:[],
  afterApplyParentConfig: function() {
     Ext.hci.zyGridPanel.superclass.afterApplyParentConfig.apply(this);
   //--Joze  for extraButtons
     for (var i = 0; i < this.extraButtons.length; i++) {
          if (this.extraButtons[i].mode != undefined && this.extraButtons[i].iconCls.search('extraButton') == -1) {
              var modeStr = this.extraButtons[i].mode.join(' ');
              this.extraButtons[i].iconCls = this.extraButtons[i].iconCls + ' extraButton ' + modeStr;
              modeStr.search('emptyOn') == -1 ? this.extraButtons[i].disabled = true : this.extraButtons[i].disabled = false;
          }
          this.tbar.splice(this.extraButtons[i].index, 0, this.extraButtons[i]);
      }

    function updateExtraButtonsStatus(sm, row, rec){
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
    }
    
       this.getSelectionModel().on('rowselect',updateExtraButtonsStatus);
       this.getSelectionModel().on('rowdeselect',updateExtraButtonsStatus);   
       
       
       //for deselect
        this.on('render', cancelGridClickBubble);     //1.

        this.on('click', function(){                            //2.
            if (selectedGrid == null || selectedGrid != this.id) {
                if (selectedGrid != null) {
                    Ext.getCmp(selectedGrid).getSelectionModel().clearSelections();
                    Ext.getCmp(selectedGrid).stopEditing();
                }
                selectedGrid = this.id;
            }
        });

        Ext.getBody().on('click', function(){           //3
            if (selectedGrid != null) {
                Ext.getCmp(selectedGrid).getSelectionModel().clearSelections();
                Ext.getCmp(selectedGrid).stopEditing();
                selectedGrid = null;
            }
        });
  }

}


Ext.hci.zyGridPanel = Ext.extend(Ext.zyGridPanel, zyHCIGridPanelConfig);
Ext.reg('hcizygrid', Ext.hci.zyGridPanel);