/*
 * ZyXEL hei Library extend from zyComponent.js
 * 07/30/2010
 * Copyright(c) 2008-2010, ZyXEL cop.
 * Joze.chang@zyxel.com.tw
 * http://www.zyxel.com
 */
Ext.namespace("Ext.hci");
//---
    Ext.hci.onDemandLoad = function(){
    loadComponent = function(component, callback){
        handleSuccess = function(response, options) {
            var type = component.substring(component.lastIndexOf('.'));
            var head = document.getElementsByTagName("head")[0];
            if (type === ".js") {
                var js = document.createElement('script');
                js.setAttribute("type", "text/javascript");
                js.text = response.responseText;
                if (!document.all) {
                    js.innerHTML = response.responseText;
                }
                head.appendChild(js);
            }

            if(typeof callback == "function"){
                if(document.all) {
                    callback();
                } else {
                    callback.defer(50);
                }
            };
        };

        handleFailure = function(response, options) {
            alert('Dynamic load script: [' + component + '] failed!');
        };

        ajaxOption = {
            url: component,
            method: 'GET',sync:true,
            success: handleSuccess,
            failure: handleFailure,
            disableCaching : false
        };

        Ext.Ajax.request(ajaxOption);
    };

    return {
        load: function(components, callback){
            Ext.each(components, function(component){
                loadComponent(component, callback);
            });
        }
    };
}();
//---
var zyHCIGridPanelConfig = {
  extraButtons:[],

  afterApplyConfig: function() {
     Ext.hci.zyGridPanel.superclass.afterApplyConfig.apply(this);
   //--Joze  for extraButtons 
     for (var i = 0; i < this.extraButtons.length; i++) {
          if (this.extraButtons[i].mode != undefined && this.extraButtons[i].iconCls.search('extraButton') == -1) {
		      var tooltipText = this.extraButtons[i].tooltip;
		      this.extraButtons[i].tooltip = tooltipText==undefined ? this.extraButtons[i].text : tooltipText;
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
  }
}

Ext.hci.zyGridPanel = Ext.extend(Ext.zyGridPanel, zyHCIGridPanelConfig);
Ext.reg('hcizygrid', Ext.hci.zyGridPanel);

Ext.hci.zyEditorGridPanel = Ext.extend(Ext.zyEditorGridPanel, zyHCIGridPanelConfig);
Ext.reg('hcizyeditorgrid', Ext.hci.zyEditorGridPanel);

//extend tree grid
Ext.namespace("Ext.hci.zyTreeGrid");

var tempTreeGridConfig={
    afterApplyConfig:Ext.emptyFn, //Joze for oo
    initComponent: function(){
        var tbar=[];
        if (this.extraButtons == '')
            tbar = '';
        
        Ext.apply(this, {
             tbar:tbar
        })
        this.afterApplyConfig(); //Joze for oo
        tempTreeGrid.superclass.initComponent.apply(this);
    }       
};

tempTreeGrid= Ext.extend(Ext.zyTreeGrid.GridPanel, tempTreeGridConfig);
Ext.hci.zyTreeGrid.GridPanel = Ext.extend(tempTreeGrid, zyHCIGridPanelConfig);




