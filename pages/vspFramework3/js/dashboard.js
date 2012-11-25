/*  dashboard.js
 *  (c) 2012 Jose Change, ITRI.
 */


/*PORTLET Define Example

    {
        "id": "performancePortlet2",
        "title": "CPE Portlet 2",
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
 noRefresh: false,
 title: "",
 $title: null,
 doRemove: function(){
    this.$el.trigger("doRemove");
 },
 fullscreenHandler: function(){
	var $w = this.$el;
	this.$portletDlg.show($w);
 },
 initialize: function(){
	this.$portletDlg  = this.model.collection.controler.$portletDlg;
 },
 updateView: function(){
 
 },
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
	    that.$el.attr('type', param.type);
		that.$title =  that.$el.find('.title'); 
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

		//usless ?!
		that.on('destroy', function(){
			alert("destroy event usless?");
			that.model.destroy();
		});
        
        that.$el.on("fullscreen", function(){ that.fullscreenHandler();});    
        that.$el.on('doRemove', function(){

           $(this).remove();
           that.model.destroy();

           /*
            $(this).trigger('destroy');
            var id =  $(this).attr('id');
            $(this).remove();
            try{
                //delete portletPool[id];
               update2PortletPool($(this), {id: id}, true);//isRemove is true
            }catch(e){}
               update2PortletPosMap();
           */     
		});
        
		/*
		that.$el.on('removeClick', function(){
			alert('removeClick');

			//click yes
			that.$el.trigger('destroy');
			that.model.trigger('destroy');
		});
		*/
		that.$el.on('updateConfig', function(view, configParam ){
			var newConfig = $.extend({}, config, configParam);
			that.model.updateConfig(newConfig);
		});
		
		that.$el.on('updateTitle', function(view, title ){
			that.model.updateTitle(title);
		});	
		
		that.$el.on('refresh', function(){
           that.model.refresh();
		});	
		
        require([ moduleUrl ], function(_module) {
            _module.init(that.$el, config, that);
		    that.trigger("done");
        });


    });
 } 
});

var PortletModel = Backbone.Model.extend({
    defaults: {
      type: null,
	  title: "",
      url:"",
	  acl: {},
	  id: "",
      config:{}
    },
    //idAttribute: "id",
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
	refresh: function(){
		
		var controller =  this.collection.controler;
		controller.doFetchPortlet(this, this.view.$el, false);
	},
	destroy: function(){
		var controller =  this.collection.controler;
		var id = this.get('id');
        controller.saveDashboardSetting('pool', null, {id: id}, true);
        controller.saveDashboardSetting('map');
		this.collection.remove( this, {silent: true} );
	},
	updateConfig: function(newConfig){
		var controller =  this.collection.controler;
		this.set('config', newConfig);
		controller.saveDashboardSetting("pool",  this.view.$el, {config: newConfig});
	},
	updateTitle: function(title){
		var controller =  this.collection.controler;
		this.set('title', title);
		controller.saveDashboardSetting("pool",  this.view.$el, {title: title});
	},
    fetch: function(){
        var that = this;
        this.getUserRole();
        this.view = new PortletView({model: this});
        this.view.render();
		
        this.view.on('done', function(){
			 this.off('done');
             that.trigger("done");
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
	ui: {
        menuContainer: "addPortletCtl",
        ddPanelContainer: "columns",
        userName : "userName",
		columns: ".column",
        widgetSelector: ".widget",
		fullscreenSelector: "#fullPortlet"
    },
    userOptsUrl: "./userOpts.json",
    defautlDashboardUrl: "./dashboard_default.json",
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
	$portletDlg: null,
    initialize: function(){
		this.$portletDlg = $(this.ui.fullscreenSelector).portletDlg();
    },
	doFetchPortlet: function(portlet, $tmpWidget, isRestore){
		 var that = this;
		 portlet.fetch();
		 portlet.on("done", function(){
			portlet.off('done');
			var model = this;
			
			$tmpWidget.replaceWith(  model.view.$el );
			$tmpWidget.remove();
            //var opts = $.extend({}, modelDefine, {expand: expand, id: id});
			
			var opts =  $.extend({}, model.attributes);
            delete opts.acl;//do not save acl to user portlet setting
			that.$ddPanelObj.addPortlet( model.view.$el, opts, isRestore);
	    });
	},
	addPortlet: function(modelDefine, pos){

	    var that = this;
		if(pos == undefined){
            pos = [0, 0];
        }
        var userData = that.dashboardOpts.user;
	    var portlet = new PortletModel(modelDefine, userData);
        
		this.dashboardModel.add(portlet); 
	    //var checkExistedModel = that.findModelInCollectionById(modelDefine.id);
	    var id = modelDefine.id;
		var isRestore = true;
		var expand = true;
	    if(id == undefined){
		  //##new portlet!!
		   //var cid = portlet.cid;
		   var key = that.getGUID();
		   id = modelDefine.type+"_"+key;
		   portlet.set('expand', expand);
	    }else{
		  //## restoring portlet
		  
		   isRestore = false;
	    }
		portlet.set('id', id);
	    //portlet.set('id', id);
		
	    var $tmpWidget = $("<span>");
        $(that.$columns[ pos[0] ]).append( $tmpWidget );

		that.doFetchPortlet(portlet, $tmpWidget, isRestore);
		/*
	    portlet.fetch(pos);
	    portlet.on("done", function($tmpWidget){
			var model = this;
			$tmpWidget.replaceWith(  model.view.$el );
            var opts = $.extend({}, modelDefine, {expand: expand, id: id});
            delete opts.acl;//do not save acl to user portlet setting
			that.$ddPanelObj.addPortlet( model.view.$el, opts, isRestore);
	    });
		*/
		/*
		//hard code, ugly
	    var $tmpWidget = $("<span>");
        $(that.$columns[ pos[0] ]).append( $tmpWidget );
		
	    portlet.on("done", function(){
            //portlet got it's own view.
			var model = this;
			$tmpWidget.replaceWith(  model.view.$el );
            var opts = $.extend({}, modelDefine, {expand: expand, id: id});
            delete opts.acl;//do not save acl to user portlet setting
			that.$ddPanelObj.addPortlet( model.view.$el, opts, isUpdateStore);
	    });
		*/
	},
    clearPortlet: function(){
        var that = this;
        var length = that.dashboardModel.models.length;
        var views = [];
        for(var i=0; i<that.dashboardModel.models.length; i++){
            var model = that.dashboardModel.models[i];
            if(model.view != undefined){
                views.push(model.view);
            }
        }
        for(var i=0; i<views.length; i++){
            views[i].doRemove();
        }
    },
    reset2Default: function(){
        this.clearPortlet();
        this.resetUserDashboard();
        this.restorePortlet();
    },
    portletDefine: [],
    getPortletDefineByType: function(type){
        var portletDefine =  this.portletDefine;
        var currentDefine;
        for(var i = 0; i < portletDefine.length; i++){
            if(portletDefine[i].type == type){
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
    refreshDashboard: function(){
        var that = this;
        var dashboardSetting = that.dashboardSetting;
    
		var ppool = dashboardSetting.portletPool;
		var pmap = dashboardSetting.portletPosMap;
        var ppoolNew = {};
	
		for (var i = 0; i < pmap.length; i++) {
		    var col = pmap[i];
		    for (var j = 0; j < col.length; j++) {
              try{
		            var id = col[j];
		            var pltDef = ppool[id];
		            var _pltDef;
		            var currentDefine = that.getPortletDefineByType(pltDef.type);
		            //avoid restore data is conflict with current portlet define
		            if (currentDefine != undefined) {
		                _pltDef = $.extend({}, pltDef, {
		                    acl: currentDefine.acl,
		                    url: currentDefine.url
		                });
		            }

		            var userRole = that.dashboardOpts.user.role;
		            var roleAry = [0, 0, 0, 0];
		            try {
		                roleAry = _pltDef.acl[userRole];
		            } catch (e) {

		            }

		            if (roleAry[1] == 1) { //ACL: R
                        ppoolNew[id] = _pltDef;
		                that.addPortlet(_pltDef, [i, 0]);
		            }
                }catch(e){
                    //id == null
                }
		    }
		}
        dashboardSetting.portletPool = ppoolNew;
    },
    getUserDashboardSetting: function(){
        var portletPoolStr = localStorage.getItem('portletPool');
        var portletPosMapStr = localStorage.getItem('portletPosMap');
        var portletPool = null;
        var portletPosMap = null;
        try{
            portletPool = JSON.parse(portletPoolStr);
            portletPosMap = JSON.parse(portletPosMapStr);
        }catch(e){
        }
        return { portletPool: portletPool, portletPosMap: portletPosMap  };
    },
    setUserDashboardSetting: function(){
        var portletPool = this.dashboardSetting.portletPool;
        var portletPosMap = this.dashboardSetting.portletPosMap;
        localStorage.setItem('portletPool', JSON.stringify(portletPool));
        localStorage.setItem('portletPosMap', JSON.stringify(portletPosMap));
    },
    resetUserDashboard: function(){
        delete window.localStorage["portletPool"] ;
        delete window.localStorage["portletPosMap"]; 
    },
	restorePortlet: function(){

		var that = this;
        var userDashboardSetting = that.getUserDashboardSetting();
        if(userDashboardSetting.portletPool !=null){
            that.dashboardSetting = userDashboardSetting;
            that.refreshDashboard();
        }else{
            //get dashboard from default setting (demo for static json data)
            $.getJSON(that.defautlDashboardUrl, function(d, s){
                if(s=="success"){
                    try{
                        that.dashboardSetting = d;
                        that.refreshDashboard();
                        that.setUserDashboardSetting();
                    }catch(e){
                    
                    }
                }
            });
        
        }
	},
	getPortletDefine_done: function(){
        //got portlet define, 
        //1. try to build add view for adding portlet.
		var that = this;
        that.portletDefine = this.dashboardModel.portletDefine;
		var ui = this.ui;
		var collection = this.dashboardModel;

		$("#"+ ui.menuContainer).append(collection.addView.render().$el);
		collection.addView.on("addPortlet", function(modelDefine){
			that.addPortlet(modelDefine);
		});
		
        //2. restore Portlet
		that.restorePortlet();
	},
    saveDashboardSetting: function(type, $w, opts, isRemove){//type: pool/map
        var that = this;
        var portletPosMap = this.dashboardSetting.portletPosMap;
        var portletPool = this.dashboardSetting.portletPool;
        if(type == "map"){
            portletPosMap.length = 0;
            var $columns = that.$columns; 
            for(var i=0; i<$columns.length; i++){
                var $col = $columns.eq(i);
                var $widgets =  $col.find(that.ui.widgetSelector);
                var ary = [];

                for(var j=0; j<$widgets.length; j++){
                    var $w = $widgets.eq(j);
                    var id = $w.attr("id");
                    ary.push(id);
                }
                portletPosMap.push(ary);
            }            
            
        }
        else if(type == "pool"){
            if(isRemove == true){
                var id = opts.id;
                delete portletPool[id];
            }else{
                try{
                    var id = $w.attr('id');
                    if(portletPool[id]!=undefined){
                        $.extend(portletPool[id],opts);
                    }else{
                        portletPool[id] = opts ;
                    }
                }catch(e){ return; }
            }
                        
        }
        this.setUserDashboardSetting();
    },
	initUI: function(){
		var that = this;
	    var ui = that.ui;
        var ddpanelOpts = {
            update2PortletPool: function($w, opts, isRemove){that.saveDashboardSetting("pool", $w, opts, isRemove);},
            update2PortletPosMap: function(){that.saveDashboardSetting("map");}
        };
		that.$ddPanelObj = $('#' + ui.ddPanelContainer).zyDDPanel(ddpanelOpts);
		$("#"+ ui.userName).html(  that.dashboardOpts.user.name );
		that.$columns = $(ui.columns);
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


    
    //#############for debug#####################
     var debugModal = $("#debugModal");
     debugModal.find('.ok').click(function(){
        debugModal.modal('hide');
	
     });
          
    $("#debugBtn").click(function(){
        var ctrler = dashboardCtrler;
		//ctrler.dashboardModel.where({id: "performancePortlet_06673d48"})
	


			debugger;
    });
     
	 var debugForLocalStorage = true;
    $("#getPortletPoolBtn").click(function(){
        var ctrler = dashboardCtrler;
	    var str = "";
		if(!debugForLocalStorage){
         var portletPool = ctrler.dashboardSetting.portletPool;
         str = JSON.stringify(portletPool)
		}
		else{
	     str = localStorage.getItem('portletPool');
        }
        debugModal.find('.modal-body').html(str)
        debugModal.modal();
    });
    
    $("#getPortletPosMapBtn").click(function(){
        var ctrler = dashboardCtrler;
		var str = "";
		if(!debugForLocalStorage){
          var portletPosMap = ctrler.dashboardSetting.portletPosMap;
          str = JSON.stringify(portletPosMap)
		}
		else{
	      str = localStorage.getItem('portletPosMap');
		}
        debugModal.find('.modal-body').html(str)
        debugModal.modal();
    });
    
    $("#clearAllPortletsBtn").click(function(){
        var ctrler = dashboardCtrler;
        ctrler.clearPortlet();
    });
    
    
    $("#restore2DefaultBtn").click(function(){
        var ctrler = dashboardCtrler;
        ctrler.reset2Default();
    });
    
    
    //#############for debug#####################
    
    
    
    
    
});