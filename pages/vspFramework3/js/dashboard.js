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
 $title: null,
 $content: null,
 doRemove: function(){
     this.$el.trigger('destroy');
     this.$el.unbind().remove();
     this.unbind();
     this.remove();
     this.model.destroy();
 },
 fullscreenHandler: function(){
	this.$portletDlg.show(this.$el, this.model.get('title'));
    /*
    var that = this;
    this.$portletDlg.show({
        $view:  that.$el, 
        title:  this.model.get('title'),
        fullscreen: true,
        content: {
            objSelector: ".widget-content"
        }
    });
    */
 },
 settingHandler: function(){
    this.$settingDlg.show(this.$el, this.model.get('title') + " Setting");
    /*this.$settingDlg.show({
        $view:  that.$el, 
        title:  this.model.get('title') + " Setting",
        setting: true,
        content: {
            objSelector: ".widget-setting"
        }
    });
    */
 },
 removeHandler: function(){
     var that = this;
     //confirm window;
     this.$removeDlg.show({
         $view:  that.$el, 
         title:   "Remove Portlet",
         content: {
            text: "Do you want to remove the portlet - ["+that.model.get('title') + "] ?"
         },
         buttons:{
            "ok": function(){
                that.$el.animate({
                    opacity: 0
				}, function () {
					$(this).slideUp(function () {
                        that.doRemove();  // real job
					});
				}); 
            },
            "cancel": function(){}
         }
     });
     
 },
 refreshHandler: function(fn){
        var that = this;
		//keep the expand status
		if( that.$content.is(":visible") == false || that.$el.isHidden == true){
				that.model.set("expand", false);
	    }else{
			that.model.set("expand", true);
		}
        that.hideAllDlgs();
        //loading  mask
        that.$el.mask();
        that.model.refresh(function(model){
            //alert(that.$el.is(":visible") )
            //alert(that.$el.parents("body").length )
            fn(model);
            that.$el.unmask();
       });
 
 },
 hideAllDlgs: function(){
		this.$portletDlg.hide();
        this.$settingDlg.hide();
        this.$removeDlg .hide();
 },
 initialize: function(){
	this.$portletDlg  = this.model.collection.controler.$portletDlg;
    this.$settingDlg  = this.model.collection.controler.$settingDlg;
    this.$removeDlg  = this.model.collection.controler.$removeDlg;
 },
 updateView: function(){
 
 },
 refreshDown: function(model){
    console.log("refreshDown " + model.get("id"));
 },
 configRequirejs: function(){
    requirejs.config({
       // baseUrl:"./",
        paths: {
            'css': 'js/css' //relative to dashboard.html
        }
    });
 },
 checkResize: function(type){
    var that = this;
    var cW = this.$el.width();
    var cH = this.$el.height();
    
    function triggerResize(){
       that.$el.oWidth = cW;
       that.$el.oHeight = cH;
       that.$el.trigger("resize", type);
       console.log("resize")
    }
    
    if(this.$el.oWidth == undefined || this.$el.oHeight == undefined){
        triggerResize();
    }
    else if( this.$el.oWidth != cW ||  this.$el.oHeight !=cH){
        triggerResize();
    }
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
        that.$el.attr('pltid', param.id);
	    that.$el.attr('type', param.type);
		that.$content =  that.$el.find(".widget-content");
        that.$head =  that.$el.find(".widget-head");
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
        
        that.model.on("updateDone", function(){
            var model = this;
            console.log("update model done " + model.get('id'));
        });
        
		that.$el.on('setting', function(){that.settingHandler();}); 
        that.$el.on("fullscreen", function(){ that.fullscreenHandler();});
        that.$head.on("dblclick", function(e){ 
            //double click head (exclude controls buttons), will execute fullscreen method;
            that.fullscreenHandler();
        });
        that.$el.on('doRemove', function(){that.removeHandler();});
        that.$el.on('refresh', function(){
            that.refreshHandler(that.refreshDown);
        });
        
        that.$el.bind("fullscreenOn", function(e){
            that.checkResize("fullscreenOn");
        }).bind("fullscreenOff", function(){
            that.checkResize("fullscreenOff");    
        }).bind("dragStop", function(){
            that.checkResize("dragStop"); 
       }).bind("expand", function(){
            that.checkResize("expand"); 
       });
       
       $(window).bind("resize", function(){
              that.checkResize("windowResize"); 
       });
		/*
		that.$el.on('removeClick', function(){
			alert('removeClick');

			//click yes
			that.$el.trigger('destroy');
			that.model.trigger('destroy');
		});
		*/
        
        //public method
        
		that.$el.setConfig = function( newConfig, doneFn ){
			that.model.update({"config": newConfig}, doneFn);
		};
		
		that.$el.setTitle = function( title, doneFn ){
			that.model.update({"title": title}, doneFn);
		};	

        that.$el.setModel = function(newDefine, doneFn){
            that.model.update(newDefine, doneFn);
        };

		that.$el.refresh = function(fn){
            that.$el.trigger("refresh");
		};	

        that.configRequirejs();

        require(["css", moduleUrl ], function(css, _module) {
            _module.init(that.$el, config, url, that);
		    that.trigger("portletViewDone");
        });

    });
 } 
});

var PortletModel = Backbone.Model.extend({
    defaults: {
	 acl:{},
	 title: "",
	 type: "",
	 url: "",
	 config:{},
	 expand: true,
	 id: ""
     /* type: null,
	  title: "",
      url:"",
	  acl: {},
	  id: "",
      config:{},
	  expand: true*/
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
	toJSON : function() {
	  return _.clone(this.attributes);
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
	refresh: function(doneFn){
		var controler =  this.collection.controler;
	/*
		if( this.view.$content.is(":visible") == false || this.view.$el.isHidden == true){
			this.set("expand", false);
		}else{
			this.set("expand", true);
		}
		controler.$portletDlg.hide();
	*/	
		controler.doFetchPortlet(this, this.view.$el, false, doneFn);
	},
	destroy: function(){
		var controler =  this.collection.controler;
		var id = this.get('id');
        
        controler.saveDashboardSetting('pool', null, {id: id}, true);
        controler.saveDashboardSetting('map');
		this.collection.remove( this, {silent: true} );
	},
    updateDashboardDone: function(doneFn){
        console.log("save dashboard setting done");
        if(doneFn!=undefined && typeof(doneFn) != "undefined"){
            doneFn(this);
        }
        this.trigger('updateDone');
    },
	update: function(newDefine, doneFn){
        var that = this;
		var controler =  this.collection.controler;
        var _newDefine = {};
        $.each(newDefine, function(i, t){
        
            if(i!="title" && i!="config"){
                alert("try to update the invaild value in model " + i);
                return true;
            }
            
            var orgDefine = that.get(i);
            if(orgDefine !=undefined ){
                var _t = "";
                if(typeof(t)=="object"){
                    _t = $.extend({}, orgDefine, t);
                }else{
                    _t = t;
                }
                that.set(i, _t);
                _newDefine[i] = _t;
            }
        });
        var updateDashboardDone = this.updateDashboardDone;
		controler.saveDashboardSetting("pool",  this.view.$el, _newDefine, false, function(){
            that.updateDashboardDone(doneFn);
        });
    /*
        var that = this;
		var controler =  this.collection.controler;
		this.set(key, val);
        
		var obj = {};
		obj[key] = val;
        
        var updateDashboardDone = this.updateDashboardDone;
		controler.saveDashboardSetting("pool",  this.view.$el, obj, false, function(){
            that.updateDashboardDone(doneFn);
        });
    */    
	},
    fetch: function(){

        var that = this;
        this.getUserRole();
        this.view = new PortletView({model: this});
        this.view.render();
        this.view.on('portletViewDone', function(){
			 this.off('portletViewDone');
             that.trigger("portletDone");
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
	toJSON : function() {
	  return this.map(function(model){ return model.toJSON(); });
	},
	/*save: function() {      
		//debugger;    
		//localStorage.setItem(this.name, JSON.stringify(this.data));
	},*/
    getPortletDefine: function(){
        var that = this;
		$.getJSON(that.opts.url+"?"+Math.random(), function(json){
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
		fullscreenSelector: "#fullPortlet",
        settingModalSelector : "#settingModal",
        removeModalSelector : "#removelModal",
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
    $settingDlg:null,
    $removeDlg: null,
    initialize: function(){
		this.$portletDlg = $(this.ui.fullscreenSelector).portletDlg();
        this.$settingDlg = $(this.ui.settingModalSelector).settingDlg();
        this.$removeDlg = $(this.ui.removeModalSelector).Dlg();
    },
	doFetchPortlet: function(portlet, $tmpWidget, isNew, doneFn){
		 var that = this;
		 portlet.fetch();
		 portlet.on("portletDone", function(){
			portlet.off('portletDone');
			var model = this;
			
			$tmpWidget.replaceWith(  model.view.$el );
			$tmpWidget.remove();
			model.view.$el.trigger("selfDomReady");
            
			if(isNew){
			    model.view.$el.addClass("newWidget");
				 
				setTimeout(function(){
					if(model.view.$el!=undefined){
					  model.view.$el.removeClass("newWidget");
					}
				}, 2000);
			}
            //var opts = $.extend({}, modelDefine, {expand: expand, id: id});
			 
			var opts =  $.extend({}, model.attributes);
            delete opts.acl;//do not save acl to user portlet setting
			that.$ddPanelObj.addPortlet( model.view.$el, opts, isNew);
            
            if(doneFn!=undefined && typeof( doneFn) == 'function'){
                doneFn(model);
            }
	    });
	},
	addPortlet: function(modelDefine, pos, doneFn){
	    var that = this;
		if(pos == undefined){
            pos = [0, 0];
        }
		var _modelDefine = $.extend({}, modelDefine);
        var userData = that.dashboardOpts.user;
		var isNew;
		var expand = true;

	    if(_modelDefine.id == undefined){
		  //##new portlet!!
		   isNew = true;
		   var key = that.getGUID();
		   _modelDefine.id = _modelDefine.type+"_"+key;
		   _modelDefine.expand = expand;
	    }else{
		  //## restoring portlet
		   isNew = false;
	    }
		
		if(_modelDefine.expand == undefined){
		   _modelDefine.expand = expand;
		}
		
	    var portlet = new PortletModel(_modelDefine, userData);
		this.dashboardModel.add(portlet); 
	    var $tmpWidget = $("<span>");
		if(isNew){
			$(that.$columns[ pos[0] ]).prepend( $tmpWidget );
		}
		else{
			$(that.$columns[ pos[0] ]).append( $tmpWidget );
		}
		that.doFetchPortlet(portlet, $tmpWidget, isNew, doneFn);
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
    portletRestoreDone: function(model){
        console.log("portletRestoreDone " + model.get('id'));
    },
    refreshDashboard: function(){
        var that = this;
        var dashboardSetting = that.dashboardSetting;
    
		var ppool = dashboardSetting.portletPool;
		var pmap = dashboardSetting.portletPosMap;
        var ppoolNew = {};
        var portletRestoreDoneFn = that.portletRestoreDone;
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
		                that.addPortlet(_pltDef, [i, 0], portletRestoreDoneFn);
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
    setUserDashboardSetting: function(doneFn){
        var portletPool = this.dashboardSetting.portletPool;
        var portletPosMap = this.dashboardSetting.portletPosMap;
        localStorage.setItem('portletPool', JSON.stringify(portletPool));
        localStorage.setItem('portletPosMap', JSON.stringify(portletPosMap));
        
        if(doneFn!=undefined && typeof(doneFn)=="function"){
            doneFn(this.dashboardSetting);
        }
    },
    resetUserDashboard: function(){
        delete window.localStorage["portletPool"] ;
        delete window.localStorage["portletPosMap"]; 
    },
	restorePortlet: function(restoreDashboardDone){

		var that = this;
        var userDashboardSetting = that.getUserDashboardSetting();
        if(userDashboardSetting.portletPool !=null){
            //user's setting
            that.dashboardSetting = userDashboardSetting;
            that.refreshDashboard();
        }else{
            //get dashboard from default setting (demo for static json data)
            $.getJSON(that.defautlDashboardUrl+"?"+Math.random(), function(d, s){
                if(s=="success"){
                    try{
                        that.dashboardSetting = d;
                        that.refreshDashboard();
                        that.setUserDashboardSetting(restoreDashboardDone);
                    }catch(e){
                    
                    }
                }
            });
        
        }
	},
    portletAddDone: function(model){
        console.log("add a portlet " + model.get("id"));
    },
    restoreDashboardDone: function(){
        console.log("get restore dashboard data Done");
    },
	getPortletDefine_done: function(){
        //got portlet define, 
        //1. try to build add view for adding portlet.
		var that = this;
        that.portletDefine = this.dashboardModel.portletDefine;
		var ui = this.ui;
		var collection = this.dashboardModel;
        
        var restoreDashboardDone = that.restoreDashboardDone;
        
		$("#"+ ui.menuContainer).append(collection.addView.render().$el);
		collection.addView.on("addPortlet", function(modelDefine){
			that.addPortlet(modelDefine,null, function(m){
                that.portletAddDone(m);
            });
		});
		
        //2. restore Portlet
		that.restorePortlet(restoreDashboardDone);
	},
    saveDashboardSetting: function(type, $w, opts, isRemove, saveDone){//type: pool/map
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
                    var id = $w.attr("pltid");
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
        this.setUserDashboardSetting(saveDone);
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
        $.getJSON(that.userOptsUrl+"?"+Math.random(), function(userData, status){
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
     
     
    function getPortletPool(){
        var ctrler = dashboardCtrler;
	    var str = "";
		if(!debugForLocalStorage){
         var portletPool = ctrler.dashboardSetting.portletPool;
         str = JSON.stringify(portletPool);
		}
		else{
	     str = localStorage.getItem('portletPool');
        }
        return str;
    }

    function getPortletPosMap(){
        var ctrler = dashboardCtrler;
		var str = "";
		if(!debugForLocalStorage){
          var portletPosMap = ctrler.dashboardSetting.portletPosMap;
          str = JSON.stringify(portletPosMap);
		}
		else{
	      str = localStorage.getItem('portletPosMap');
		}
        return str;
    }
    
    $("#getPortletPoolBtn").click(function(){
        var str = getPortletPool();
        debugModal.find('.modal-body').html(str);
        debugModal.modal();
    });
    
    $("#getPortletPosMapBtn").click(function(){
        var str = getPortletPosMap();
        debugModal.find('.modal-body').html(str);
        debugModal.modal();
    });
    
    $("#getDashboardSettingBtn").click(function(){
        var ctrler = dashboardCtrler;
        var dataObj = ctrler.getUserDashboardSetting();
        var str = JSON.stringify(dataObj);
        debugModal.find('.modal-body').html(str);
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