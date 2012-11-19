

/*PORTLET Define

   {
        "id": "CPEPortlet",
        "name": "CPE Portlet",
        "url": "portlet/portletGPE/portlet.php",
        "params":{
            "otherVals": 10
             
        },
        "acl":{
            "admin": [1, 1, 1], 
            "user": [1, 1, 1]
        }
   }

*/
      
            
//--Portlet
var PortletView = Backbone.View.extend({
 template: "",
 portletView: "portlet.tmp",
 portletModule: "module",
 tagName: "li",
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
        that.$el.html(htmlStr);
        that.$el.id = param.id ;
        that.$el.attr('id', param.id);
		//noSetting noRefresh noRemove noCollapse noMove
        that.$el.addClass("widget ui-widget");
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
      params:{},
      acl: {}
    },
	//sync: function(method, model, options){},
	url: function(){
		return this.instanceUrl;
	},
    initialize: function(param, collectionOpts){
       if(collectionOpts == undefined){
       }
    },
    validate: function(attrs){},
    fetch: function(){
        var that = this;
        this.view = new PortletView({model: this});
        this.view.render();
        this.view.on('done', function(){
             that.trigger("done");
        });
		this.on('destroy', function(){
			//that.destroy();
			that.collection.remove( that, {silent: true} );
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
        this.allowList = this.model.filterRole(0, 1); //filter the adding list
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
    opts:{
         user: "",
         role: "",
         url: ""
    },
    menuContainer: "",
    portletDefine: {},
    initialize: function(param){
        $.extend(this.opts, param);
    },
    filterRole: function(index, flag){
        var role = this.opts.role;
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
        userName : "userName"
    },
	dashboardOpts:{
        user: "",
        role: "",
        url: ""
	},
	getGUID: function (){
        function S4() {
               return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        return (S4()+S4());	
	},
	dashboardModel: null,
	$ddPanelObj: null,
    initialize: function(){},
	addPortlet: function(modelDefine, pos){
	    var that = this;
		if(pos == undefined){
            pos = [0, 0];
        }
	    var portlet = new PortletModel(modelDefine);

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
	    portlet.on("done", function(){
			var model = this;
			var opts = $.extend({}, modelDefine, {expand: expand, pltid: pltid});
		
			/*var opts = {
				pltid: pltid,
				name: model.attributes.name,
				params: model.attributes.params,
				url: model.attributes.url,
				expand: expand
			};*/
			
			that.$ddPanelObj.addPortlet( model.view.$el, pos, opts, isUpdateStore);
	    });
		this.dashboardModel.add(portlet); 
	},
	restoreData:{
		portletPool:{},
		portletPosMap:[]
	},
	restorePortlet: function(){
		var that = this;
	    var portletPoolStr = localStorage.getItem('portletPool');
        var portletPosMapStr = localStorage.getItem('portletPosMap');
        var portletPool = null;
        var portletPosMap = null; 
		if(portletPoolStr!=null && portletPosMapStr!=null){
            try{
                that.restoreData.portletPool = JSON.parse(portletPoolStr);
                that.restoreData.portletPosMap = JSON.parse(portletPosMapStr);
				var ppool = that.restoreData.portletPool;
				var pmap = that.restoreData.portletPosMap;

				for(var i = 0; i< pmap.length; i++){
					var col = pmap[i];
					for(var j = 0; j < col.length; j++){
					   try{
						var pltid = col[j];
						var pltDef = ppool[pltid];
						that.addPortlet(pltDef, [i, 0]);
					   }catch(e){}
					}
				}
					//debugger;
               // $ddPanelObj.restorePortlet(portletPosMap, portletPool);
            }catch(e){
            }
        }
	},
	getPortletDefine_done: function(){
		var that = this;
		var uiContainer = this.uiContainer;
		var collection = this.dashboardModel;
		$("#"+ uiContainer.menuContainer).append(collection.addView.render().$el);
		collection.addView.on("addPortlet", function(modelDefine){
			that.addPortlet(modelDefine);
		});
		
		that.restorePortlet();
	},
	initUI: function(){
		var that = this;
	    var uiContainer = that.uiContainer;
		that.$ddPanelObj = $('#' + uiContainer.ddPanelContainer).zyDDPanel();
		$("#"+ uiContainer.userName).html(  that.dashboardOpts.user );
	},
	getUserOptionDone: function(){
		var that = this;
		var dashboardOpts = that.dashboardOpts;
		that.initUI();
		that.dashboardModel = new DashboardModel(dashboardOpts);
		that.dashboardModel.getPortletDefine();//get portletDefine
		that.dashboardModel.on("getPortletDefine_done", function(){ that.getPortletDefine_done(); });
	},
	fetch: function(opts){
		var that = this;
		//call ajax to get dashboardOpts
	    var opts = {
			user: "Caa",
			role: "admin", //admin or user
			url: "./portletDefine.json"
		};
		$.extend(that.dashboardOpts, opts);
		that.getUserOptionDone();
	}
});

$(function(){

	var dashboardCtrler = new DashboardCtrler();
	dashboardCtrler.fetch();
    
 
});