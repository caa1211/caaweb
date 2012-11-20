/*  dashboard.js
 *  (c) 2012 Jose Change, ITRI.
 */


/*PORTLET Define Example

    {
        "id": "performancePortlet2",
        "name": "CPE Portlet 2",
        "url": "portlets/performancePortlet/",
        "acl":{
            "admin": [1, 1, 1], 
            "user": [1, 1, 1]
        },
        "config":{
            "otherVals": 10
        }
    }

*/
      
            
//--Portlet
var PortletView = Backbone.View.extend({
 template: "",
 portletView: "portlet.pt",
 portletModule: "module",
 tagName: "li",
 noRefresh: true,
 render: function(){
    var that = this;
    var url = this.model.get("url");
    var viewUrl = url+ that.portletView;
    var promise = $.get(viewUrl);
    var moduleUrl = url+"/"+ that.portletModule;
    
    promise.done(function(template){

        that.template = _.template(template);
        var param = that.model.toJSON();
        var config = that.model.get('config');
        var deps = that.model.get('deps');
        var htmlStr = that.template(param);
        var userRoleAry = that.model.userRoleAry; // [0, 0, 0, 0] : CRUD
        that.$el.html(htmlStr);
        that.$el.id = param.id ;
        that.$el.attr('id', param.id);
		//noSetting noRefresh noRemove noCollapse noMove
        that.$el.addClass("widget ui-widget");
        
        if(userRoleAry[2]==0){ //ACL: R
            that.$el.addClass("noSetting");
        }

        if(userRoleAry[3]==0){ //ACL: D
            that.$el.addClass("noRemove");
        }
        
        if(that.noRefresh){
            that.$el.addClass("noRefresh");
        }

		that.$el.on('destroy', function(){
			that.model.trigger('destroy');
		});
        
		/*
		that.$el.on('removeClick', function(){
			alert('removeClick');

			//click yes
			that.$el.trigger('destroy');
			that.model.trigger('destroy');
		});
		*/
		
        require([ moduleUrl ], function(_module) {
            _module.init(that.$el, config);
			that.$el.on('updateConfig', function(view, configParam ){
				var newConfig = $.extend({}, config, configParam);
				that.model.trigger('updateConfig', newConfig);
			});
        });

        that.trigger("done");
    });
 } 
});

var PortletModel = Backbone.Model.extend({
    defaults: {
      id: null,
      name: '',
      url:"",
	  acl: {},
      config:{}
    },
	//sync: function(method, model, options){},
	url: function(){
		return this.instanceUrl;
	},
    initialize: function(param, collectionOpts, c){
       if(collectionOpts == undefined){
            //a portlet be created
       }
    },
    userRoleAry: [0,0,0,0], //CRUD
    getUserRole: function(){
        var userRole =  this.collection.opts.user.role; 
        var userRoleAry = this.userRoleAry;
        try {
            userRoleAry = this.get("acl")[userRole]
        }catch(e){}
        this.userRoleAry = userRoleAry;
    },
    validate: function(attrs){},
    fetch: function(){
        var that = this;
        this.getUserRole();
        this.view = new PortletView({model: this});
        this.view.render();
        this.view.on('done', function(){
             that.trigger("done");
        });
		this.on('destroy', function(){
			//that.destroy();
			that.collection.remove( that, {silent: true} );
		});
		
		this.on('updateConfig', function(newConfig){
			that.set('config', newConfig);
		});
    }
});


var AddViewItem = Backbone.View.extend({
    initialize: function(param){
        this.model = param.model;
        this.parentView = param.parentView;
    },
    template: _.template($("#addPortletItem-template").html()),
    render: function(){
        var that = this;
        this.$el.html(this.template(this.model));
        this.$el.click(function(){
		   that.parentView.trigger('addPortlet', that.model);
        });
        return this;
    }
});

//--Dashboard
var AddView = Backbone.View.extend({
    initialize: function(param){
        this.model = param.model;
    },
    //tagName: 'tr',
    template: _.template($("#addPortlet-template").html()),
    allowList: [],
    render: function(){
        var that = this;
        //ACL: C
        this.allowList = this.model.filterRole(0, 1); //filter the adding list: index 0 is true;
        this.$el.html(this.template());
        var $dropMenu =  this.$el.find(".dropdown-menu");
        
        $.each(this.allowList, function(i, t){
            var addViewItem = new AddViewItem({model: t, parentView: that});
            $dropMenu.append(addViewItem.render().el);
        });
        
        if(this.allowList.length == 0){
             this.$el.css("visibility", "hidden");
        }
        return this;
    }
});


var DashboardModel = Backbone.Collection.extend({
    model: PortletModel,
    controler: null,
    menuContainer: "",
    portletDefine: {},
    initialize: function(param){
       //$.extend(this.opts, param);
        this.opts = param.opts;
        this.controler = param.controler;
    },
    filterRole: function(index, flag){
        var role = this.opts.user.role;
        var allowList = [];
        $.each(this.portletDefine, function(i, t){
           try{
                if(t.acl[role][index] == flag){
                    allowList.push(t);
                }
            }catch(e){
                alert('no allow role!');
            }
        });
        return allowList;
    },
    getPortletDefine: function(){
        var that = this;
		$.getJSON(that.opts.url, function(json){
            that.portletDefine = json;
			that.addView = new AddView({model: that});
            that.trigger("getPortletDefine_done");
        });  
    }
});


var DashboardCtrler = Backbone.Router.extend({
	uiContainer: {
        menuContainer: "addPortletCtl",
        ddPanelContainer: "columns",
        userName : "userName",
		columns: ".column",
        widgetSelector: ".widget"
    },
    userOptsUrl: "./userOpts.json",

	dashboardOpts:{
        user: {
            name: "default user",
            role: "user",
        },
        url: "./portletDefine.json"
	},
	getGUID: function (){
        function S4() {
               return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        return (S4()+S4());	
	},
	dashboardModel: null,
	$ddPanelObj: null,
	$columns: null,
    initialize: function(){},
	addPortlet: function(modelDefine, pos){
	    var that = this;
		if(pos == undefined){
            pos = [0, 0];
        }
        var userData = that.dashboardOpts.user;
	    var portlet = new PortletModel(modelDefine, userData);
        
		this.dashboardModel.add(portlet); 
	    //var checkExistedModel = that.findModelInCollectionById(modelDefine.id);
	    var pltid = modelDefine.pltid;
		var isUpdateStore = true;
		var expand = true;
	    if(pltid == undefined){
		  //##new portlet!!
		   //var cid = portlet.cid;
		   var key = that.getGUID();
		   pltid = modelDefine.id+"_"+key;
		   isUpdateStore = true;
		   expand= true;
	    }else{
		  //## restoring portlet
		   isUpdateStore = false;
		   expand = modelDefine.expand;
	    }
	    portlet.set('id', pltid);
	    portlet.fetch();
		
		//hard code, ugly
	    var $tmpWidget = $("<span>");
        $(that.$columns[ pos[0] ]).append( $tmpWidget );
		
	    portlet.on("done", function(){
            //portlet got it's own view.
			var model = this;
			$tmpWidget.replaceWith(  model.view.$el );
            var opts = $.extend({}, modelDefine, {expand: expand, pltid: pltid});
            delete opts.acl;//do not save acl to user portlet setting
			that.$ddPanelObj.addPortlet( model.view.$el, pos, opts, isUpdateStore);
	    });

		
		portlet.on('updateConfig', function(newConfig){
			var model = this;
			that.$ddPanelObj.updatePortletPool( model.view.$el, {config: newConfig} );
		});
	},
    portletDefine: [],
    getPortletDefineById: function(id){
        var portletDefine =  this.portletDefine;
        var currentDefine;
        for(var i = 0; i < portletDefine.length; i++){
            if(portletDefine[i].id == id){
               currentDefine = portletDefine[i];
               break;
            }
        }
        return currentDefine;
    },
    dashboardSetting:{
        portletPool: {},
        portletPosMap: []
    },
	restorePortlet: function(){
		var that = this;
	    var portletPoolStr = localStorage.getItem('portletPool');
        var portletPosMapStr = localStorage.getItem('portletPosMap');
        var dashboardSetting = that.dashboardSetting;
 
		if(portletPoolStr!=null && portletPosMapStr!=null){
            try{
                dashboardSetting.portletPool = JSON.parse(portletPoolStr);
                dashboardSetting.portletPosMap = JSON.parse(portletPosMapStr);
				var ppool = dashboardSetting.portletPool;
				var pmap = dashboardSetting.portletPosMap;

				for(var i = 0; i< pmap.length; i++){
					var col = pmap[i];
					for(var j = 0; j < col.length; j++){
					   try{
						var pltid = col[j];
						var pltDef = ppool[pltid];
                        
                        var currentDefine = that.getPortletDefineById(pltDef.id);
                        //avoid restore data is conflict with current portlet define
                        if(currentDefine!=undefined){
                            $.extend(pltDef, {acl: currentDefine.acl, url: currentDefine.url  });
                        }
                          
                        var userRole = that.dashboardOpts.user.role;
                        var roleAry = [0,0,0,0];
                        try{
                            roleAry= pltDef.acl[userRole];
                        }catch(e){
                        
                        }
                        
                        if(roleAry[1]==1){ //ACL: R
                            that.addPortlet(pltDef, [i, 0]);
                        }
                        
					   }catch(e){
                       
                       }
					}
				}
                
            }catch(e){
            }
        }
	},
	getPortletDefine_done: function(){
        //got portlet define, 
        //1. try to build add view for adding portlet.
		var that = this;
        that.portletDefine = this.dashboardModel.portletDefine;
		var uiContainer = this.uiContainer;
		var collection = this.dashboardModel;

		$("#"+ uiContainer.menuContainer).append(collection.addView.render().$el);
		collection.addView.on("addPortlet", function(modelDefine){
			that.addPortlet(modelDefine);
		});
		
        //2. restore Portlet
		that.restorePortlet();
	},
    saveDashboardSetting: function(type, $w, opts, isRemove){
        var that = this;
        var portletPosMap = this.dashboardSetting.portletPosMap;
        var portletPool = this.dashboardSetting.portletPool;
   
        if(type == "pos"){
            portletPosMap.length = 0;
            var $columns = that.$columns; 
            for(var i=0; i<$columns.length; i++){
                var $col = $columns.eq(i);
                var $widgets =  $col.find(that.uiContainer.widgetSelector);
                var ary = [];

                for(var j=0; j<$widgets.length; j++){
                    var $w = $widgets.eq(j);
                    var pltid = $w.attr("pltid");
                    ary.push(pltid);
                }
                portletPosMap.push(ary);
            }            
            localStorage.setItem('portletPosMap', JSON.stringify(portletPosMap));
        }
        else if(type == "pool"){
            if(isRemove == true){
                var pltid = opts.pltid;
                delete portletPool[pltid];
            }else{
                try{
                    var pltid = $w.attr('pltid');
                    if(portletPool[pltid]!=undefined){
                        $.extend(portletPool[pltid],opts);
                    }else{
                        portletPool[pltid] = opts ;
                    }
                }catch(e){ return; }
            }
            
            localStorage.setItem('portletPool',  JSON.stringify(portletPool));
        }
   
    },
	initUI: function(){
		var that = this;
	    var uiContainer = that.uiContainer;
        var ddpanelOpts = {
            update2PortletPool: function($w, opts, isRemove){that.saveDashboardSetting("pool", $w, opts, isRemove);},
            update2PortletPosMap: function(){that.saveDashboardSetting("pos");}
        };
		that.$ddPanelObj = $('#' + uiContainer.ddPanelContainer).zyDDPanel(ddpanelOpts);
		$("#"+ uiContainer.userName).html(  that.dashboardOpts.user.name );
		that.$columns = $(uiContainer.columns);
	},
	getUserOptionDone: function(){
		var that = this;
		var dashboardOpts = that.dashboardOpts;
		that.initUI();
		that.dashboardModel = new DashboardModel({opts: dashboardOpts, controler: that});
		that.dashboardModel.getPortletDefine();//get portletDefine
		that.dashboardModel.on("getPortletDefine_done", function(){ that.getPortletDefine_done(); });
	},
	fetch: function(){
		var that = this;
        $.getJSON(that.userOptsUrl, function(userData, status){
            if(status == "success"){
                $.extend(that.dashboardOpts.user, userData);
                that.getUserOptionDone();
            }
        });

	}
});

$(function(){

	var dashboardCtrler = new DashboardCtrler();
	dashboardCtrler.fetch();

});